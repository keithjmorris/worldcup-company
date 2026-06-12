'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    router.push('/login');
  }

  return (
    <button onClick={handleSignOut} className="nav-link nav-signout">
      Sign out
    </button>
  );
}