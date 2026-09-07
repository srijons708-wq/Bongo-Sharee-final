import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Thin wrapper around Supabase Auth. Every method mirrors the shape of the
 * real Supabase call so swapping the demo layer out later is a no-op for
 * calling code — AuthContext never has to change.
 */
export const authService = {
  async signUp({ fullName, email, password }) {
    if (!isSupabaseConfigured) {
      return demoSignUp({ fullName, email, password });
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data.user;
  },

  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      return demoSignIn({ email, password });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('bongo_demo_user');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async requestPasswordReset(email) {
    if (!isSupabaseConfigured) {
      return { email, sent: true };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { email, sent: true };
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured) {
      const raw = localStorage.getItem('bongo_demo_user');
      return raw ? JSON.parse(raw) : null;
    }
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe() {} } } };
    }
    return supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
  },
};

// --- Demo-mode helpers (localStorage-backed, no server) ---------------
function demoSignUp({ fullName, email, password }) {
  if (!fullName || !email || !password) throw new Error('All fields are required.');
  const user = { id: `demo-${Date.now()}`, email, user_metadata: { full_name: fullName }, isAdmin: false };
  localStorage.setItem('bongo_demo_user', JSON.stringify(user));
  return user;
}

function demoSignIn({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required.');
  const isAdmin = email.toLowerCase() === 'admin@bongosharee.com';
  const user = {
    id: 'demo-user',
    email,
    user_metadata: { full_name: isAdmin ? 'Store Admin' : email.split('@')[0] },
    isAdmin,
  };
  localStorage.setItem('bongo_demo_user', JSON.stringify(user));
  return user;
}
