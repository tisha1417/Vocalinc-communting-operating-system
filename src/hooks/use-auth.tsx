import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

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

    // Get initial session
    supabase.auth.getSession().then(async (response) => {
      const session = response.data?.session || null;
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.user_metadata);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Error getting session:', err);
      if (isMounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        // Only fetch on actual changes, not the initial session which is handled above
        if (event !== 'INITIAL_SESSION') {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id, session.user.user_metadata);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
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
        // Do not cache the fallback to ensure we try again next time, or cache it if we want it sticky?
        // Let's not cache fallback to ensure it checks DB next time.
        return;
      }

      setProfile(data);
      // Cache the successful profile
      localStorage.setItem(`profile_cache_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(fallbackProfile);
    }
  };

  const signUp = async (signUpData: any) => {
    try {
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
    }
  };

  const signIn = async (signInData: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.clear();
      setSession(null);
      setUser(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
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