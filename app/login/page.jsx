'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED_DOMAINS = ['xenomorph.com', 'newmodel.vc', 'wellsmaltings.org.uk'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const normalised = email.toLowerCase().trim();
    const domain = normalised.split('@')[1];

    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('This email address is not authorised to access this app.');
      return;
    }

    // Store name derived from email
    const name = normalised.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    localStorage.setItem('wc_company_email', normalised);
    localStorage.setItem('wc_company_name', name);

    router.push('/');
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
        <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
          Enter your work email to continue
        </p>
        <p style={{ marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Access is restricted to authorised email domains.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="chat-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@company.com"
            required
            autoFocus
          />
          {error && (
            <p style={{ color: 'var(--live-red)', fontSize: '0.85rem' }}>{error}</p>
          )}
          <button className="send-btn" type="submit">
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}