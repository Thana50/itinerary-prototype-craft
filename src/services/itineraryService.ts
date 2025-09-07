
import { supabase } from '@/integrations/supabase/client';
import type { Itinerary, ItineraryDay } from '@/lib/supabase';

export const itineraryService = {
  async createItinerary(itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        ...itinerary,
        days: itinerary.days as any // Convert to JSONB
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert back to our type format
    return {
      ...data,
      status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (data.days as any) || []
    } as Itinerary;
  },

  async getItinerary(id: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (data.days as any) || []
    } as Itinerary;
  },

  async getItineraryByToken(token: string) {
    // Use secure RPC instead of direct table access to respect RLS
    const { data, error } = await supabase
      .rpc('get_itinerary_by_token', { _token: token })
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Itinerary not found or not shared');
    
    return {
      ...data,
      status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (data.days as any) || []
    } as Itinerary;
  },

  async updateItinerary(id: string, updates: Partial<Itinerary> & { approval_status?: string }) {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Convert days array to JSONB if present
    if (updates.days) {
      updateData.days = updates.days as any;
    }
    
    const { data, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (data.days as any) || []
    } as Itinerary;
  },

  async getAgentItineraries(agentId: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      status: item.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (item.days as any) || []
    })) as Itinerary[];
  },

  async shareItinerary(id: string, travelerEmail: string) {
    // Generate a secure share token
    const shareToken = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('itineraries')
      .update({ 
        share_token: shareToken,
        status: 'shared',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // TODO: Send email notification to traveler
    console.log(`Share link: ${window.location.origin}/itinerary/shared/${shareToken}`);
    
    return {
      ...data,
      status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
      days: (data.days as any) || []
    } as Itinerary;
  }
};
