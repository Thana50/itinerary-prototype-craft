
import { supabase } from '@/lib/supabase'
import type { Itinerary, ItineraryDay } from '@/lib/supabase'

export const itineraryService = {
  async createItinerary(itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('itineraries')
      .insert(itinerary)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getItinerary(id: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getItineraryByToken(token: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('share_token', token)
      .single()
    
    if (error) throw error
    return data
  },

  async updateItinerary(id: string, updates: Partial<Itinerary>) {
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
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async shareItinerary(id: string, travelerEmail: string) {
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
