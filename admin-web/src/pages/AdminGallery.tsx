import { useState, useRef, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { usePaintings } from '../hooks/usePaintings';
import type { Painting } from '../types/painting';
import './AdminGallery.css';

interface PaintingEdits {
  title?: string;
  price?: number;
  medium?: string;
  width?: number;
  height?: number;
  year?: number;
  description?: string;
  available?: boolean;
  newImageFile?: File;
  newImagePreviewUrl?: string;
}

interface AdminGalleryProps {
  user: User;
}

export default function AdminGallery({ user }: AdminGalleryProps) {
  const { paintings, loading, error } = usePaintings();
  const [edits, setEdits] = useState<Record<string, PaintingEdits>>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [scrolled, setScrolled] = useState(false);

  const hasChanges = Object.keys(edits).length > 0;
  const changeCount = Object.keys(edits).length;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useState(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function setEdit<K extends keyof PaintingEdits>(id: string, key: K, value: PaintingEdits[K]) {
    setEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  }

  function getValue<K extends keyof Painting>(painting: Painting, id: string, key: K): Painting[K] {
    const edit = edits[id];
    if (edit && key in edit) return (edit as unknown as Painting)[key];
    return painting[key];
  }

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    setSaveStatus('idle');

    try {
      for (const [id, changes] of Object.entries(edits)) {
        const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

        if (changes.title !== undefined) updates['title'] = changes.title;
        if (changes.price !== undefined) updates['price'] = changes.price;
        if (changes.medium !== undefined) updates['medium'] = changes.medium;
        if (changes.width !== undefined) updates['width'] = changes.width;
        if (changes.height !== undefined) updates['height'] = changes.height;
        if (changes.year !== undefined) updates['year'] = changes.year;
        if (changes.description !== undefined) updates['description'] = changes.description;
        if (changes.available !== undefined) updates['available'] = changes.available;

        if (changes.newImageFile) {
          const file = changes.newImageFile;
          const ext = file.name.split('.').pop() ?? 'jpg';
          const storageRef = ref(storage, `paintings/${id}.${ext}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          updates['imageUrl'] = url;
        }

        await updateDoc(doc(db, 'paintings', id), updates);
      }

      setEdits({});
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: unknown) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-app">
        <AdminNav user={user} scrolled={scrolled} hasChanges={false} changeCount={0} saving={false} saveStatus="idle" onSave={handleSave} />
        <main className="gallery"><div className="state-msg"><p>Loading gallery...</p></div></main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-app">
        <AdminNav user={user} scrolled={scrolled} hasChanges={false} changeCount={0} saving={false} saveStatus="idle" onSave={handleSave} />
        <main className="gallery"><div className="state-msg"><p className="error-text">Error: {error}</p></div></main>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <AdminNav
        user={user}
        scrolled={scrolled}
        hasChanges={hasChanges}
        changeCount={changeCount}
        saving={saving}
        saveStatus={saveStatus}
        onSave={handleSave}
      />

      <main className="gallery">
        {paintings.map((painting, index) => (
          <EditablePaintingSection
            key={painting.id}
            painting={painting}
            index={index}
            edits={edits[painting.id] ?? {}}
            getValue={(key) => getValue(painting, painting.id, key)}
            setEdit={(key, value) => setEdit(painting.id, key, value)}
          />
        ))}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Ricardo Santos • Admin Panel</p>
      </footer>
    </div>
  );
}

interface AdminNavProps {
  user: User;
  scrolled: boolean;
  hasChanges: boolean;
  changeCount: number;
  saving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onSave: () => void;
}

function AdminNav({ user, scrolled, hasChanges, changeCount, saving, saveStatus, onSave }: AdminNavProps) {
  return (
    <nav className={`navbar ${scrolled ? 'hidden' : ''}`}>
      <div className="navbar-left">
        <span className="admin-badge">Admin</span>
        <span className="admin-user">{user.email}</span>
      </div>

      <div className="navbar-center">
        <h1 className="logo">Ricardo Santos</h1>
        <p className="subtitle">Original Oil Paintings</p>
      </div>

      <div className="navbar-right">
        <button
          className={`save-btn ${hasChanges ? 'active' : ''} ${saveStatus === 'success' ? 'success' : ''} ${saveStatus === 'error' ? 'error' : ''}`}
          onClick={onSave}
          disabled={!hasChanges || saving}
        >
          {saving
            ? 'Saving...'
            : saveStatus === 'success'
            ? 'Saved ✓'
            : saveStatus === 'error'
            ? 'Error ✗'
            : hasChanges
            ? `Save (${changeCount})`
            : 'Save'}
        </button>
        <button className="signout-btn" onClick={() => signOut(auth)}>Sign out</button>
      </div>
    </nav>
  );
}

interface EditablePaintingSectionProps {
  painting: Painting;
  index: number;
  edits: PaintingEdits;
  getValue: <K extends keyof Painting>(key: K) => Painting[K];
  setEdit: <K extends keyof PaintingEdits>(key: K, value: PaintingEdits[K]) => void;
}

function EditablePaintingSection({ painting, index, edits, getValue, setEdit }: EditablePaintingSectionProps) {
  const [visible, setVisible] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLeft = index % 2 === 0;

  useState(() => {
    function handleScroll() {
      const element = document.getElementById(`painting-${painting.id}`);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(elementCenter - windowCenter);
      const fadeZoneStart = windowHeight * 0.3;
      const fadeZoneSize = windowHeight * 0.4;
      let visibility = 1;
      if (distance > fadeZoneStart) {
        visibility = Math.max(0, 1 - (distance - fadeZoneStart) / fadeZoneSize);
      }
      setVisible(visibility);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setEdit('newImageFile', file);
    setEdit('newImagePreviewUrl', previewUrl);
  }

  const imageToShow = edits.newImagePreviewUrl ?? (getValue('imageUrl') as string);
  const isImageChanged = !!edits.newImagePreviewUrl;

  return (
    <section
      id={`painting-${painting.id}`}
      className="painting-section"
      style={{ opacity: visible }}
    >
      <div className={`painting-content ${isLeft ? 'left' : 'right'}`}>

        {/* Image */}
        <div className="painting-image-wrap">
          <div className="painting-image" onClick={handleImageClick}>
            <img src={imageToShow} alt={getValue('title') as string} loading="lazy" />
            <div className="image-overlay">
              <span>Replace Image</span>
            </div>
          </div>
          {isImageChanged && (
            <div className="image-changed-badge">New image staged</div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="painting-info">

          <EditableField
            tag="h2"
            className="painting-title"
            value={getValue('title') as string}
            changed={edits.title !== undefined}
            onChange={(v) => setEdit('title', v)}
          />

          <EditableNumber
            className="painting-price"
            value={getValue('price') as number}
            changed={edits.price !== undefined}
            prefix="€"
            onChange={(v) => setEdit('price', v)}
          />

          <div className={`painting-details ${
            edits.medium !== undefined || edits.width !== undefined || edits.height !== undefined || edits.year !== undefined
              ? 'changed' : ''
          }`}>
            <div className="detail-row">
              <strong>Medium:</strong>
              <EditableInline
                value={getValue('medium') as string}
                onChange={(v) => setEdit('medium', v)}
              />
            </div>
            <div className="detail-row">
              <strong>Dimensions:</strong>
              <EditableNumber
                className="detail-number"
                value={getValue('width') as number}
                changed={false}
                onChange={(v) => setEdit('width', v)}
              />
              <span className="detail-sep">×</span>
              <EditableNumber
                className="detail-number"
                value={getValue('height') as number}
                changed={false}
                onChange={(v) => setEdit('height', v)}
              />
              <span className="detail-unit">cm</span>
            </div>
            <div className="detail-row">
              <strong>Year:</strong>
              <EditableNumber
                className="detail-number"
                value={getValue('year') as number}
                changed={false}
                onChange={(v) => setEdit('year', v)}
              />
            </div>
            <div className="detail-row available-row">
              <strong>Available:</strong>
              <input
                type="checkbox"
                className="available-checkbox"
                checked={getValue('available') as boolean}
                onChange={(e) => setEdit('available', e.target.checked)}
              />
              <span className={`available-label ${getValue('available') ? 'yes' : 'no'}`}>
                {getValue('available') ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <EditableTextarea
            className="painting-description"
            value={getValue('description') as string}
            changed={edits.description !== undefined}
            onChange={(v) => setEdit('description', v)}
          />

        </div>
      </div>
    </section>
  );
}

/* ── Editable primitives ─────────────────────────────────────────── */

function EditableField({
  tag: Tag = 'p',
  className,
  value,
  changed,
  onChange,
}: {
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  value: string;
  changed: boolean;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <input
        className={`editable-input ${className ?? ''}`}
        defaultValue={value}
        autoFocus
        onBlur={(e) => { onChange(e.target.value); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      />
    );
  }

  return (
    <Tag
      className={`editable ${className ?? ''} ${changed ? 'field-changed' : ''}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}

function EditableNumber({
  className,
  value,
  changed,
  prefix,
  onChange,
}: {
  className?: string;
  value: number;
  changed: boolean;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <span className="editable-number-wrap">
        {prefix && <span className="number-prefix">{prefix}</span>}
        <input
          className={`editable-input editable-number-input ${className ?? ''}`}
          type="number"
          defaultValue={value}
          autoFocus
          onBlur={(e) => { onChange(Number(e.target.value)); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        />
      </span>
    );
  }

  return (
    <span
      className={`editable ${className ?? ''} ${changed ? 'field-changed' : ''}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {prefix}{typeof value === 'number' ? value.toLocaleString('pt-PT') : value}
    </span>
  );
}

function EditableInline({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <input
        className="editable-input editable-inline"
        defaultValue={value}
        autoFocus
        onBlur={(e) => { onChange(e.target.value); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      />
    );
  }

  return (
    <span className="editable editable-inline-text" onClick={() => setEditing(true)} title="Click to edit">
      {value}
    </span>
  );
}

function EditableTextarea({
  className,
  value,
  changed,
  onChange,
}: {
  className?: string;
  value: string;
  changed: boolean;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        className={`editable-textarea ${className ?? ''}`}
        defaultValue={value}
        autoFocus
        rows={5}
        onBlur={(e) => { onChange(e.target.value); setEditing(false); }}
      />
    );
  }

  return (
    <p
      className={`editable ${className ?? ''} ${changed ? 'field-changed' : ''}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </p>
  );
}
