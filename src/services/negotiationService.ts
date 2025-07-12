
import { supabase } from '@/integrations/supabase/client';
import type { Negotiation, NegotiationMessage } from '@/lib/supabase';
import { notificationService } from './notificationService';

export const negotiationService = {
  async createNegotiation(negotiation: Omit<Negotiation, 'id' | 'created_at' | 'updated_at' | 'messages'> & {
    itinerary_item_id?: string;
    original_price?: number;
    target_price?: number;
    negotiation_priority?: 'low' | 'medium' | 'high';
    auto_approval_threshold?: number;
    negotiation_deadline?: string;
  }) {
    const { data, error } = await supabase
      .from('negotiations')
      .insert({ ...negotiation, messages: [] })
      .select()
      .single();
    
    if (error) throw error;
    
    // Send notification to vendor
    try {
      await notificationService.notifyNegotiationStarted(
        negotiation.vendor_id, 
        data.id, 
        negotiation.description
      );
    } catch (notificationError) {
      console.error('Failed to send negotiation notification:', notificationError);
    }
    
    return {
      ...data,
      status: data.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(data.messages) ? (data.messages as unknown as NegotiationMessage[]) : []
    } as Negotiation;
  },

  async getNegotiation(id: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(data.messages) ? (data.messages as unknown as NegotiationMessage[]) : []
    } as Negotiation;
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
    
    const currentMessages = Array.isArray(negotiation?.messages) ? (negotiation.messages as unknown as NegotiationMessage[]) : [];
    const updatedMessages = [...currentMessages, newMessage];
    
    const { data, error } = await supabase
      .from('negotiations')
      .update({ 
        messages: updatedMessages as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', negotiationId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(data.messages) ? (data.messages as unknown as NegotiationMessage[]) : []
    } as Negotiation;
  },

  async getVendorNegotiations(vendorId: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      status: item.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(item.messages) ? (item.messages as unknown as NegotiationMessage[]) : []
    })) as Negotiation[];
  },

  async getAgentNegotiations(agentId: string) {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      status: item.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(item.messages) ? (item.messages as unknown as NegotiationMessage[]) : []
    })) as Negotiation[];
  },

  async updateNegotiation(id: string, updates: {
    status?: 'pending' | 'negotiating' | 'accepted' | 'rejected';
    final_price?: number;
    updated_at?: string;
  }) {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('negotiations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Send notifications based on status update
    try {
      if (updates.status === 'accepted' && updates.final_price) {
        await notificationService.notifyNegotiationAccepted(
          data.vendor_id, 
          data.id, 
          updates.final_price
        );
      } else if (updates.status === 'rejected') {
        await notificationService.notifyNegotiationRejected(data.vendor_id, data.id);
      } else if (updates.status === 'negotiating') {
        await notificationService.notifyNegotiationResponse(
          data.agent_id, 
          data.id, 
          'Vendor'
        );
      }
    } catch (notificationError) {
      console.error('Failed to send status update notification:', notificationError);
    }
    
    return {
      ...data,
      status: data.status as 'pending' | 'negotiating' | 'accepted' | 'rejected',
      messages: Array.isArray(data.messages) ? (data.messages as unknown as NegotiationMessage[]) : []
    } as Negotiation;
  }
};
