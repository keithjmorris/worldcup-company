'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if email is on the allowed list
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.allowed) {
        setError('This email address is not authorised to access this app.');
        setLoading(false);
        return;
      }

      const actionCodeSettings = {
  url: 'https://worldcup-company.vercel.app/auth/callback',
  handleCodeInApp: true,
};

      console.log('Callback URL:', actionCodeSettings.url);

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main>
        <header className="site-header">
          <div className="header-inner">
            <span className="trophy">🏆</span>
            <div>
              <h1 className="site-title">Check your email</h1>
              <p className="site-subtitle">World Cup 2026</p>
            </div>
          </div>
        </header>
        <div className="content" style={{ maxWidth: 400, paddingTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            We've sent a sign-in link to:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--pitch)', marginBottom: '1.5rem' }}>
            {email}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Click the link in the email to sign in. You can close this tab.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <span className="trophy">🏆</span>
          <div>
            <h1 className="site-title">World Cup 2026</h1>
            <p className="site-subtitle">Company App</p>
          </div>
        </div>
      </header>
      <div className="content" style={{ maxWidth: 400, paddingTop: '3rem' }}>
        <p style={{ marginBottom: '1rem', fontWeight: 600 }}>
          Sign in with your email address
        </p>
        <p style={{ marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          We'll send you a sign-in link — no password needed.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="chat-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
          />
          {error && (
            <p style={{ color: 'var(--live-red)', fontSize: '0.85rem' }}>{error}</p>
          )}
          <button className="send-btn" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send sign-in link'}
          </button>
        </form>
      </div>
    </main>
  );
}