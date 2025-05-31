
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For demo prototype - make Supabase optional
let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.log('Supabase environment variables not found - running in demo mode with mock data')
}

export { supabase }

// Database types
export interface User {
  id: string
  email: string
  role: 'agent' | 'traveler' | 'vendor'
  name: string
  created_at: string
}

export interface Itinerary {
  id: string
  agent_id: string
  traveler_id?: string
  name: string
  destination: string
  start_date: string
  end_date: string
  number_of_travelers: number
  preferences: string
  status: 'draft' | 'shared' | 'confirmed' | 'modified'
  days: ItineraryDay[]
  share_token?: string
  created_at: string
  updated_at: string
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface Negotiation {
  id: string
  itinerary_id: string
  agent_id: string
  vendor_id: string
  service_type: string
  description: string
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected'
  messages: NegotiationMessage[]
  created_at: string
  updated_at: string
}

export interface NegotiationMessage {
  id: string
  sender_id: string
  sender_role: 'agent' | 'vendor'
  message: string
  price_offer?: number
  created_at: string
}
