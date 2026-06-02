import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import './Login.css';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  async function handleSignIn() {
    setSigning(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Sign-in failed');
      setSigning(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">Ricardo Santos</h1>
        <p className="login-subtitle">Admin Panel</p>

        <div className="login-divider" />

        <button className="login-btn" onClick={handleSignIn} disabled={signing}>
          {signing ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
