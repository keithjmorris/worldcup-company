'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function completeSignIn() {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        router.push('/login');
        return;
      }

      let email = window.localStorage.getItem('emailForSignIn');

      if (!email) {
        email = window.prompt('Please enter your email to confirm sign in:');
      }

      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        router.push('/');
      } catch (err) {
        setError('Sign in failed. Please try again.');
      }
    }

    completeSignIn();
  }, [router]);

  if (error) {
    return (
      <main>
        <header className="site-header">
          <div className="header-inner">
            <span className="trophy">🏆</span>
            <div>
              <h1 className="site-title">Sign in failed</h1>
              <p className="site-subtitle">World Cup 2026</p>
            </div>
          </div>
        </header>
        <div className="content" style={{ maxWidth: 400, paddingTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--live-red)', marginBottom: '1rem' }}>{error}</p>
          <a href="/login" className="send-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Try again
          </a>
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
            <h1 className="site-title">Signing you in…</h1>
            <p className="site-subtitle">World Cup 2026</p>
          </div>
        </div>
      </header>
      <div className="content" style={{ maxWidth: 400, paddingTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Please wait…</p>
      </div>
    </main>
  );
}