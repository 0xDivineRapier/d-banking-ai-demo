import { useState, useEffect, createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, session: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using dummy auth bypass only
    if (localStorage.getItem('bankdozn_dummy_auth') === 'true') {
      setUser({ id: 'dummy-123', email: 'admin@bankxyz.co.id' } as any);
      setSession({ user: { id: 'dummy-123', email: 'admin@bankxyz.co.id' } } as any);
    } else {
      setUser(null);
      setSession(null);
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('bankdozn_dummy_auth');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
