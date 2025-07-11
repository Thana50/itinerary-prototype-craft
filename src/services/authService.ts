
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signIn(email: string, password: string) {
    console.log('AuthService: Attempting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthService: Sign in error:', error);
      throw error;
    }
    
    console.log('AuthService: Sign in successful for user:', data.user?.id);
    
    // Get user profile with improved error handling
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('AuthService: Error fetching profile:', profileError);
      // Don't throw here - user is authenticated, profile fetch can be retried
    }
    
    console.log('AuthService: Profile fetched:', profile ? 'success' : 'not found');
    return { user: data.user, profile };
  },

  async signUp(email: string, password: string, role: 'agent' | 'traveler' | 'vendor', name: string) {
    console.log('AuthService: Attempting sign up for:', email, 'as', role);
    
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
    
    if (error) {
      console.error('AuthService: Sign up error:', error);
      throw error;
    }
    
    console.log('AuthService: Sign up successful for user:', data.user?.id);
    return data;
  },

  async signOut() {
    console.log('AuthService: Signing out');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthService: Sign out error:', error);
      throw error;
    }
    
    console.log('AuthService: Sign out successful');
  },

  async getCurrentUser() {
    console.log('AuthService: Getting current user');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('AuthService: Error getting current user:', userError);
      return null;
    }
    
    if (!user) {
      console.log('AuthService: No current user');
      return null;
    }
    
    console.log('AuthService: Current user found:', user.id);
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('AuthService: Error fetching current user profile:', profileError);
    }
    
    console.log('AuthService: Current user profile:', profile ? 'found' : 'not found');
    return { user, profile };
  }
};
