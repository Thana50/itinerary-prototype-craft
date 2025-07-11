
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: 'agent' | 'traveler' | 'vendor';
  name: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'agent' | 'traveler' | 'vendor', name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          // Fetch user profile after auth state change
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching user profile:', error);
                if (error.code === 'PGRST116') {
                  console.log('No profile found in users table - this might be expected for new users');
                  setUser(null);
                } else {
                  console.error('Database error fetching profile:', error);
                  setUser(null);
                }
                return;
              }
              
              if (profile) {
                console.log('User profile fetched:', profile);
                setUser({
                  id: profile.id,
                  email: profile.email,
                  role: profile.role as 'agent' | 'traveler' | 'vendor',
                  name: profile.name,
                  created_at: profile.created_at || new Date().toISOString()
                });
              } else {
                console.log('No profile found for user');
                setUser(null);
              }
            } catch (error) {
              console.error('Exception fetching user profile:', error);
              setUser(null);
            }
          }, 0);
        } else {
          console.log('User not authenticated');
          setUser(null);
        }
        
        if (event === 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching initial user profile:', error);
              setUser(null);
            } else if (profile) {
              console.log('Initial user profile fetched:', profile);
              setUser({
                id: profile.id,
                email: profile.email,
                role: profile.role as 'agent' | 'traveler' | 'vendor',
                name: profile.name,
                created_at: profile.created_at || new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Exception fetching initial user profile:', error);
            setUser(null);
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }
      
      console.log('Login successful:', data.user?.id);
      // User profile will be set via the auth state change listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, role: 'agent' | 'traveler' | 'vendor', name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role,
            name
          }
        }
      });
      
      if (error) throw error;
      
      // Don't return data, just complete successfully
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
