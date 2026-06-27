import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

// Wipe the Supabase auth token immediately on every reload, as explicitly requested by the user.
// This executes before React even mounts, guaranteeing they start at the Sign In page.
if (typeof window !== 'undefined') {
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        window.localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error('Error wiping local storage on reload:', e);
  }
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: any) => Promise<any>;
  signIn: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Failsafe: guarantee loading is cleared after 3 seconds no matter what
    const failsafe = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    // Properly await the session from storage
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Optimistic UI for immediate render
        setProfile({
          id: session.user.id,
          first_name: session.user.user_metadata?.first_name || 'User',
          last_name: session.user.user_metadata?.last_name || '',
          role: 'user', 
          created_at: new Date().toISOString()
        });
        
        await fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        if (event === 'INITIAL_SESSION') return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setProfile({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || 'User',
            last_name: session.user.user_metadata?.last_name || '',
            role: 'user', 
            created_at: new Date().toISOString()
          });
          
          await fetchProfile(session.user.id, session.user.user_metadata);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, userMetadata: any = {}) => {
    const fallbackProfile = {
      id: userId,
      first_name: userMetadata?.first_name || 'User',
      last_name: userMetadata?.last_name || '',
      role: 'user',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error fetching profile or profile not found:', error);
        setProfile(fallbackProfile);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(fallbackProfile);
    }
  };

  const signUp = async (signUpData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            first_name: signUpData.firstName,
            last_name: signUpData.lastName
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        const { error: profileError } = await supabase.from('user_profiles').insert([
          {
            id: data.user.id,
            first_name: signUpData.firstName,
            last_name: signUpData.lastName,
            role: 'user'
          }
        ]);
        if (profileError) console.error("Failed to create profile:", profileError);
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (signInData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.clear();
      setSession(null);
      setUser(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}