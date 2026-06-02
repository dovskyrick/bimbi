import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Login from './pages/Login';
import AdminGallery from './pages/AdminGallery';
import './App.css';

const ADMIN_EMAIL = import.meta.env['VITE_ADMIN_EMAIL'] as string;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
    return (
      <div className="auth-denied">
        <div className="auth-denied-card">
          <h2>Access Denied</h2>
          <p>Signed in as <strong>{user.email}</strong></p>
          <p>This account is not authorised to access the admin panel.</p>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>
    );
  }

  return <AdminGallery user={user} />;
}
