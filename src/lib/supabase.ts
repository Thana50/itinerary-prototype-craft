
import { supabase } from '@/integrations/supabase/client';

// Export the integrated Supabase client
export { supabase };

// Database types
export interface User {
  id: string;
  email: string;
  role: 'agent' | 'traveler' | 'vendor';
  name: string;
  created_at: string;
}

export interface Itinerary {
  id: string;
  agent_id: string;
  traveler_id?: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  number_of_travelers: number;
  preferences: string;
  status: 'draft' | 'shared' | 'confirmed' | 'modified';
  approval_status?: string;
  days: ItineraryDay[];
  share_token?: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Negotiation {
  id: string;
  itinerary_id: string;
  itinerary_item_id?: string;
  agent_id: string;
  vendor_id: string;
  service_type: string;
  description: string;
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected';
  original_price?: number;
  target_price?: number;
  final_price?: number;
  auto_approval_threshold?: number;
  negotiation_priority?: string;
  negotiation_deadline?: string;
  messages: NegotiationMessage[];
  created_at: string;
  updated_at: string;
}

export interface NegotiationMessage {
  id: string;
  sender_id: string;
  sender_role: 'agent' | 'vendor';
  message: string;
  price_offer?: number;
  created_at: string;
}
