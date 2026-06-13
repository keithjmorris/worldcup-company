'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const { setUser } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    localStorage.removeItem('wc_company_email');
    localStorage.removeItem('wc_company_name');
    setUser(null);
    router.push('/login');
  }

  return (
    <button onClick={handleSignOut} className="nav-link nav-signout">
      Sign out
    </button>
  );
}