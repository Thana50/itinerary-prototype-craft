
import { supabase } from '@/lib/supabase'
import type { Itinerary, ItineraryDay } from '@/lib/supabase'

// Mock data storage for demo
let mockItineraries: Itinerary[] = []
let mockIdCounter = 1

export const itineraryService = {
  async createItinerary(itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      // Mock implementation
      const newItinerary: Itinerary = {
        ...itinerary,
        id: mockIdCounter.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockItineraries.push(newItinerary)
      mockIdCounter++
      return newItinerary
    }

    const { data, error } = await supabase
      .from('itineraries')
      .insert(itinerary)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getItinerary(id: string) {
    if (!supabase) {
      const itinerary = mockItineraries.find(i => i.id === id)
      if (!itinerary) throw new Error('Itinerary not found')
      return itinerary
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getItineraryByToken(token: string) {
    if (!supabase) {
      const itinerary = mockItineraries.find(i => i.share_token === token)
      if (!itinerary) throw new Error('Itinerary not found')
      return itinerary
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('share_token', token)
      .single()
    
    if (error) throw error
    return data
  },

  async updateItinerary(id: string, updates: Partial<Itinerary>) {
    if (!supabase) {
      const index = mockItineraries.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Itinerary not found')
      
      mockItineraries[index] = {
        ...mockItineraries[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockItineraries[index]
    }

    const { data, error } = await supabase
      .from('itineraries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAgentItineraries(agentId: string) {
    if (!supabase) {
      return mockItineraries
        .filter(i => i.agent_id === agentId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async shareItinerary(id: string, travelerEmail: string) {
    if (!supabase) {
      const shareToken = crypto.randomUUID()
      const index = mockItineraries.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Itinerary not found')
      
      mockItineraries[index] = {
        ...mockItineraries[index],
        share_token: shareToken,
        status: 'shared',
        updated_at: new Date().toISOString()
      }
      
      console.log(`Share link: ${window.location.origin}/itinerary/shared/${shareToken}`)
      return mockItineraries[index]
    }

    // Generate a secure share token
    const shareToken = crypto.randomUUID()
    
    const { data, error } = await supabase
      .from('itineraries')
      .update({ 
        share_token: shareToken,
        status: 'shared',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // TODO: Send email notification to traveler
    console.log(`Share link: ${window.location.origin}/itinerary/shared/${shareToken}`)
    
    return data
  }
}
