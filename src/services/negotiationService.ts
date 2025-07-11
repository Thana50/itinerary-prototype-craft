
import { supabase } from '@/integrations/supabase/client';
import type { Negotiation, NegotiationMessage } from '@/lib/supabase';

export const negotiationService = {
  async createNegotiation(negotiation: Omit<Negotiation, 'id' | 'created_at' | 'updated_at' | 'messages'>) {
    const { data, error } = await supabase
      .from('negotiations')
      .insert({ ...negotiation, messages: [] })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getNegotiation(id: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async addMessage(negotiationId: string, message: Omit<NegotiationMessage, 'id' | 'created_at'>) {
    // Get current negotiation
    const { data: negotiation } = await supabase
      .from('negotiations')
      .select('messages')
      .eq('id', negotiationId)
      .single();
    
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    
    const updatedMessages = [...(negotiation?.messages || []), newMessage];
    
    const { data, error } = await supabase
      .from('negotiations')
      .update({ 
        messages: updatedMessages,
        updated_at: new Date().toISOString()
      })
      .eq('id', negotiationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getVendorNegotiations(vendorId: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAgentNegotiations(agentId: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
