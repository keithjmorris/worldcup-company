'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth');

      if (!firebaseUser && !isAuthPage) {
        router.push('/login');
      }

      if (firebaseUser && isAuthPage) {
        router.push('/');
      }
    });

    return () => unsub();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user }}>
      {user === undefined ? (
        <main>
          <header className="site-header">
            <div className="header-inner">
              <span className="trophy">🏆</span>
              <div>
                <h1 className="site-title">World Cup 2026</h1>
                <p className="site-subtitle">Loading…</p>
              </div>
            </div>
          </header>
        </main>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}