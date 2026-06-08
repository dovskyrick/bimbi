import { useState, useEffect, useRef } from 'react';
import './InquireModal.css';

const FORMSPREE_ENDPOINT = `https://formspree.io/f/${import.meta.env['VITE_FORMSPREE_ID']}`;
const INSTAGRAM_HANDLE = import.meta.env['VITE_INSTAGRAM_HANDLE'] as string;

interface Props {
  paintingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function InquireModal({ paintingTitle, isOpen, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I'm interested in "${paintingTitle}".`);
  const [status, setStatus] = useState<Status>('idle');
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessage(`I'm interested in "${paintingTitle}".`);
  }, [paintingTitle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {status === 'success' ? (
          <div className="modal-success">
            <p>Thank you. I'll be in touch shortly.</p>
            <button className="modal-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Inquire</h2>
            <p className="modal-subtitle">{paintingTitle}</p>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-field">
                <label htmlFor="inq-name">Name</label>
                <input
                  ref={firstFieldRef}
                  id="inq-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="inq-email">Email</label>
                <input
                  id="inq-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="inq-message">Message</label>
                <textarea
                  id="inq-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {status === 'error' && (
                <p className="modal-error">Something went wrong. Please try again.</p>
              )}

              <button
                className="modal-btn"
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>

            <div className="modal-instagram">
              <span>Or reach out on </span>
              <a
                href={`https://ig.me/m/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
