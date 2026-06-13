'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSignOut() {
    localStorage.removeItem('wc_company_email');
    localStorage.removeItem('wc_company_name');
    router.push('/login');
    setOpen(false);
  }

  return (
    <div className="more-menu" ref={ref}>
      <button
        className="nav-link more-btn"
        onClick={() => setOpen(!open)}
      >
        More {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="more-dropdown">
          <Link href="/sweepstake" className="more-item" onClick={() => setOpen(false)}>
            🏆 Sweepstake
          </Link>
          <Link href="/chat" className="more-item" onClick={() => setOpen(false)}>
            💬 Chat
          </Link>
          <button className="more-item more-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}