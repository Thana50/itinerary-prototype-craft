
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/supabase'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    return { user: data.user, profile }
  },

  async signUp(email: string, password: string, role: 'agent' | 'traveler' | 'vendor', name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          role,
          name,
        })
      
      if (profileError) throw profileError
    }
    
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { user, profile }
  }
}
