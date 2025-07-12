-- Complete Enhanced Agent-Initiated Rate Negotiation System
-- Migration: 20250712_complete_negotiation_system.sql

-- 1. Vendor business profiles extending user accounts
CREATE TABLE public.vendor_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  service_specializations TEXT[] NOT NULL,
  coverage_areas TEXT[] NOT NULL,
  response_time_avg_hours INTEGER DEFAULT 24,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  preferred_partner BOOLEAN DEFAULT false,
  business_license TEXT,
  contract_terms JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clean itinerary items structure
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('accommodation', 'transportation', 'activity', 'dining', 'guide')),
  service_name TEXT NOT NULL,
  description TEXT,
  estimated_price DECIMAL(10,2),
  assigned_vendor_id UUID REFERENCES public.users(id),
  suggested_vendors UUID[],
  location TEXT,
  duration_hours INTEGER,
  participants INTEGER DEFAULT 1,
  special_requirements JSONB DEFAULT '{}',
  negotiation_priority TEXT DEFAULT 'medium' CHECK (negotiation_priority IN ('low', 'medium', 'high')),
  is_negotiable BOOLEAN DEFAULT true,
  market_rate_reference DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Critical negotiation history for AI learning
CREATE TABLE public.negotiation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('price_offer', 'counter_offer', 'terms_change', 'status_change', 'ai_suggestion')),
  actor_id UUID NOT NULL REFERENCES public.users(id),
  actor_role TEXT NOT NULL CHECK (actor_role IN ('agent', 'vendor', 'ai_system')),
  previous_value JSONB,
  new_value JSONB,
  ai_confidence_score DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enhanced market intelligence
CREATE TABLE public.market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  location TEXT NOT NULL,
  service_name TEXT,
  season TEXT CHECK (season IN ('high', 'shoulder', 'low')),
  market_rate_min DECIMAL(10,2),
  market_rate_avg DECIMAL(10,2),
  market_rate_max DECIMAL(10,2),
  typical_discount_pct DECIMAL(5,2),
  max_achievable_discount_pct DECIMAL(5,2),
  negotiation_success_rate DECIMAL(5,2),
  average_negotiation_rounds INTEGER DEFAULT 2,
  optimal_timing_hours INTEGER[],
  seasonal_factors JSONB DEFAULT '{}',
  group_size_factors JSONB DEFAULT '{}',
  sample_size INTEGER DEFAULT 1,
  confidence_score DECIMAL(3,2) DEFAULT 0.80,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_from DATE NOT NULL,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI negotiation templates
CREATE TABLE public.negotiation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('initial_request', 'counter_offer', 'acceptance', 'rejection')),
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('conservative', 'professional', 'aggressive')),
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enhanced vendor services
CREATE TABLE public.vendor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('accommodation', 'transportation', 'activity', 'dining', 'guide')),
  service_name TEXT NOT NULL,
  location TEXT,
  base_price DECIMAL(10,2),
  negotiable_discount_max DECIMAL(5,2),
  capacity INTEGER,
  description TEXT,
  specializations JSONB DEFAULT '[]',
  availability JSONB DEFAULT '{}',
  market_rate_reference DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Essential workflow notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_id UUID,
  entity_type TEXT,
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enhance existing tables
ALTER TABLE public.itineraries 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' 
CHECK (approval_status IN ('pending', 'approved', 'negotiation_initiated', 'negotiation_completed'));

ALTER TABLE public.negotiations 
ADD COLUMN IF NOT EXISTS itinerary_item_id UUID REFERENCES public.itinerary_items(id),
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS target_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS negotiation_priority TEXT DEFAULT 'medium' CHECK (negotiation_priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS auto_approval_threshold DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS negotiation_deadline TIMESTAMP WITH TIME ZONE;

-- 9. Critical indexes for performance
CREATE INDEX idx_itinerary_items_itinerary_vendor ON itinerary_items(itinerary_id, assigned_vendor_id);
CREATE INDEX idx_market_intelligence_lookup ON market_intelligence(service_type, location, season);
CREATE INDEX idx_vendor_services_type_location ON vendor_services(service_type, location);
CREATE INDEX idx_negotiation_history_negotiation_time ON negotiation_history(negotiation_id, created_at);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_itinerary_items_type_location ON itinerary_items(item_type, location);
CREATE INDEX idx_negotiations_status_priority ON negotiations(status, negotiation_priority);

-- 10. Row Level Security policies
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Vendor profiles policies
CREATE POLICY "Vendors can manage their own profiles" ON public.vendor_profiles
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view vendor profiles" ON public.vendor_profiles
FOR SELECT USING (true);

-- Itinerary items policies
CREATE POLICY "Agents can manage itinerary items for their itineraries" ON public.itinerary_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.itineraries 
    WHERE itineraries.id = itinerary_items.itinerary_id 
    AND itineraries.agent_id = auth.uid()
  )
);

CREATE POLICY "Vendors can view assigned items" ON public.itinerary_items
FOR SELECT USING (assigned_vendor_id = auth.uid());

-- Negotiation history policies
CREATE POLICY "Users can view negotiation history for their negotiations" ON public.negotiation_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.negotiations 
    WHERE negotiations.id = negotiation_history.negotiation_id 
    AND (negotiations.agent_id = auth.uid() OR negotiations.vendor_id = auth.uid())
  )
);

CREATE POLICY "Users can add to negotiation history for their negotiations" ON public.negotiation_history
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.negotiations 
    WHERE negotiations.id = negotiation_history.negotiation_id 
    AND (negotiations.agent_id = auth.uid() OR negotiations.vendor_id = auth.uid())
  )
);

-- Market intelligence policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market intelligence" ON public.market_intelligence
FOR SELECT TO authenticated USING (true);

-- Negotiation templates policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view negotiation templates" ON public.negotiation_templates
FOR SELECT TO authenticated USING (true);

-- Vendor services policies
CREATE POLICY "Vendors can manage their own services" ON public.vendor_services
FOR ALL USING (auth.uid() = vendor_id);

CREATE POLICY "Anyone can view vendor services" ON public.vendor_services
FOR SELECT USING (true);

-- Notifications policies
CREATE POLICY "Users can manage their own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id);

-- 11. Seed data for market intelligence
INSERT INTO public.market_intelligence (service_type, location, season, market_rate_min, market_rate_avg, market_rate_max, typical_discount_pct, max_achievable_discount_pct, negotiation_success_rate, average_negotiation_rounds, valid_from)
VALUES 
  ('accommodation', 'Thailand', 'high', 100.00, 150.00, 250.00, 15.00, 25.00, 75.00, 3, CURRENT_DATE),
  ('accommodation', 'Thailand', 'shoulder', 70.00, 100.00, 180.00, 20.00, 30.00, 80.00, 2, CURRENT_DATE),
  ('accommodation', 'Thailand', 'low', 50.00, 80.00, 120.00, 25.00, 35.00, 85.00, 2, CURRENT_DATE),
  ('activity', 'Thailand', 'high', 40.00, 75.00, 120.00, 10.00, 20.00, 70.00, 2, CURRENT_DATE),
  ('activity', 'Thailand', 'shoulder', 30.00, 55.00, 90.00, 15.00, 25.00, 75.00, 2, CURRENT_DATE),
  ('activity', 'Thailand', 'low', 25.00, 50.00, 75.00, 20.00, 30.00, 80.00, 2, CURRENT_DATE),
  ('transportation', 'Thailand', 'high', 30.00, 60.00, 100.00, 10.00, 15.00, 65.00, 2, CURRENT_DATE),
  ('transportation', 'Thailand', 'shoulder', 25.00, 45.00, 80.00, 15.00, 20.00, 70.00, 2, CURRENT_DATE),
  ('transportation', 'Thailand', 'low', 20.00, 35.00, 60.00, 20.00, 25.00, 75.00, 2, CURRENT_DATE);

-- 12. Seed data for negotiation templates
INSERT INTO public.negotiation_templates (name, service_type, template_type, subject_template, body_template, tone, success_rate, is_active)
VALUES 
  ('Professional Hotel Request', 'accommodation', 'initial_request', 'Rate Inquiry for {{service_name}} - {{dates}}', 'Dear {{vendor_name}},\n\nI hope this message finds you well. I am writing to inquire about availability and rates for {{service_name}} for {{participants}} guests from {{start_date}} to {{end_date}}.\n\nWe are looking for competitive rates for this booking and would appreciate your best offer. Our target budget is around {{target_price}}.\n\nPlease let me know your availability and rates at your earliest convenience.\n\nBest regards,\n{{agent_name}}', 'professional', 78.5, true),
  ('Activity Booking Request', 'activity', 'initial_request', 'Group Activity Booking - {{service_name}}', 'Hello {{vendor_name}},\n\nWe are organizing {{service_name}} for a group of {{participants}} people and would like to request your best rates.\n\nOur preferred dates are {{dates}} and our budget target is {{target_price}}.\n\nCould you please provide your availability and pricing?\n\nThank you,\n{{agent_name}}', 'professional', 72.3, true),
  ('Professional Counter Offer', 'accommodation', 'counter_offer', 'Re: Rate Inquiry - Counter Proposal', 'Thank you for your quote of {{previous_price}}.\n\nWe appreciate your offer, however, our budget constraints require us to work within {{target_price}}. Given the volume of business we bring and our long-term partnership potential, would you be able to accommodate this rate?\n\nWe are flexible on {{flexible_terms}} and would be happy to discuss alternative arrangements.\n\nLooking forward to your response.\n\nBest regards,\n{{agent_name}}', 'professional', 65.8, true);

-- 13. Create sample vendor profiles for existing vendors
INSERT INTO public.vendor_profiles (user_id, company_name, service_specializations, coverage_areas, response_time_avg_hours, success_rate)
SELECT 
  id as user_id,
  name as company_name,
  ARRAY['accommodation', 'activity'] as service_specializations,
  ARRAY['Thailand', 'Southeast Asia'] as coverage_areas,
  24 as response_time_avg_hours,
  75.0 as success_rate
FROM public.users 
WHERE role = 'vendor'
AND id NOT IN (SELECT user_id FROM public.vendor_profiles);

-- 14. Create sample vendor services
INSERT INTO public.vendor_services (vendor_id, service_type, service_name, location, base_price, negotiable_discount_max, capacity, description)
SELECT 
  vp.user_id as vendor_id,
  'accommodation' as service_type,
  u.name || ' Hotel Services' as service_name,
  'Thailand' as location,
  120.00 as base_price,
  20.00 as negotiable_discount_max,
  50 as capacity,
  'Premium accommodation services in Thailand' as description
FROM public.vendor_profiles vp
JOIN public.users u ON vp.user_id = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_services vs 
  WHERE vs.vendor_id = vp.user_id AND vs.service_type = 'accommodation'
);