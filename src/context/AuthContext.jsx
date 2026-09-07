import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async (u) => {
    setUser(u);
    if (u && isSupabaseConfigured) {
      const { data } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle();
      setProfile(data || null);
    } else setProfile(u ? { id: u.id, full_name: u.user_metadata?.full_name, role: u.isAdmin ? 'admin' : 'customer' } : null);
  };

  useEffect(() => {
    authService.getCurrentUser().then(hydrate).finally(() => setLoading(false));
    const { data } = authService.onAuthStateChange((u) => { hydrate(u); });
    return () => data?.subscription?.unsubscribe?.();
  }, []);

  const signUp = async (payload) => { const u = await authService.signUp(payload); await hydrate(u); return u; };
  const signIn = async (payload) => { const u = await authService.signIn(payload); await hydrate(u); return u; };
  const signOut = async () => { await authService.signOut(); setUser(null); setProfile(null); };
  const updateProfile = async ({ fullName, email }) => {
    if (!user) throw new Error('Not signed in');
    if (!isSupabaseConfigured) { const next = { ...user, email, user_metadata: { ...user.user_metadata, full_name: fullName } }; localStorage.setItem('bongo_demo_user', JSON.stringify(next)); await hydrate(next); return next; }
    const { data, error } = await supabase.auth.updateUser({ email, data: { full_name: fullName } });
    if (error) throw error;
    await hydrate(data.user);
    return data.user;
  };
  const changePassword = async (password) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };
  const requestPasswordReset = (email) => authService.requestPasswordReset(email);

  const value = { user, profile, loading, isAuthenticated: Boolean(user), isAdmin: profile?.role === 'admin' || Boolean(user?.isAdmin), signUp, signIn, signOut, updateProfile, changePassword, requestPasswordReset };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
