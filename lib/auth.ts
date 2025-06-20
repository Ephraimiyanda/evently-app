import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback: (user: any | null) => void) {
    return supabase.auth.onAuthStateChange((event: any, session: any) => {
      callback(session?.user ?? null);
    });
  },
};
