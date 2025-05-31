
// Mock authentication service for prototype demo
export interface User {
  id: string
  email: string
  role: 'agent' | 'traveler' | 'vendor'
  name: string
  created_at: string
}

export interface AuthResponse {
  user: any
  profile: User
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'agent@demo.com',
    role: 'agent',
    name: 'Travel Agent Demo',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'traveler@demo.com',
    role: 'traveler',
    name: 'Traveler Demo',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'vendor@demo.com',
    role: 'vendor',
    name: 'Vendor Demo',
    created_at: new Date().toISOString()
  }
]

export const mockAuthService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    // Simple demo login - any password works
    const profile = mockUsers.find(user => user.email === email)
    
    if (!profile) {
      throw new Error('User not found')
    }
    
    // Store user in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(profile))
    
    return {
      user: { id: profile.id, email: profile.email },
      profile
    }
  },

  async signOut() {
    localStorage.removeItem('currentUser')
  },

  async getCurrentUser(): Promise<{ user: any, profile: User } | null> {
    const stored = localStorage.getItem('currentUser')
    if (!stored) return null
    
    const profile = JSON.parse(stored)
    return {
      user: { id: profile.id, email: profile.email },
      profile
    }
  }
}
