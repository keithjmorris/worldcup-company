'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const email = localStorage.getItem('wc_company_email');
    const name = localStorage.getItem('wc_company_name');

    if (email && name) {
      setUser({ email, name });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user === undefined) return;

    const isLoginPage = pathname.startsWith('/login');

    if (!user && !isLoginPage) {
      router.push('/login');
    }

    if (user && isLoginPage) {
      router.push('/');
    }
  }, [user, pathname, router]);

  if (user === undefined) {
    return (
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
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}