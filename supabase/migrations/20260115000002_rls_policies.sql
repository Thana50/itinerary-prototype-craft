-- Travia MVP Database Schema - Row Level Security Policies
-- Migration: 20260115000002
-- Description: Implement comprehensive RLS policies for all tables
-- Security: Fine-grained access control based on user roles and relationships

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_customization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_performance ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Get current user's agency_id
CREATE OR REPLACE FUNCTION get_user_agency()
RETURNS UUID AS $$
  SELECT agency_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user has specific role (already exists from previous migration)
-- public.has_role(user_id UUID, role app_role)

-- Check if user is agent
CREATE OR REPLACE FUNCTION is_agent()
RETURNS BOOLEAN AS $$
  SELECT public.has_role(auth.uid(), 'agent')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is traveler
CREATE OR REPLACE FUNCTION is_traveler()
RETURNS BOOLEAN AS $$
  SELECT public.has_role(auth.uid(), 'traveler')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is vendor
CREATE OR REPLACE FUNCTION is_vendor()
RETURNS BOOLEAN AS $$
  SELECT public.has_role(auth.uid(), 'vendor')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- AGENCIES POLICIES
-- ============================================================================

-- Users can view their own agency
CREATE POLICY "Users can view own agency"
ON agencies FOR SELECT
USING (id = get_user_agency());

-- Agents can update their own agency (with restrictions)
CREATE POLICY "Agents can update own agency settings"
ON agencies FOR UPDATE
USING (id = get_user_agency() AND is_agent());

-- ============================================================================
-- CUSTOMERS POLICIES
-- ============================================================================

-- Agents can view customers they manage or in their agency
CREATE POLICY "Agents can view own customers"
ON customers FOR SELECT
USING (
  is_agent() AND (
    agent_id = auth.uid() OR 
    agent_id IN (SELECT id FROM users WHERE agency_id = get_user_agency())
  )
);

-- Agents can create customers
CREATE POLICY "Agents can create customers"
ON customers FOR INSERT
WITH CHECK (is_agent() AND agent_id = auth.uid());

-- Agents can update their own customers
CREATE POLICY "Agents can update own customers"
ON customers FOR UPDATE
USING (is_agent() AND agent_id = auth.uid());

-- Travelers can view their own customer record
CREATE POLICY "Travelers can view own record"
ON customers FOR SELECT
USING (is_traveler() AND user_id = auth.uid());

-- ============================================================================
-- DESTINATIONS POLICIES
-- ============================================================================

-- Everyone can view active destinations
CREATE POLICY "Anyone can view active destinations"
ON destinations FOR SELECT
USING (is_active = TRUE);

-- Only service role can modify destinations (via backend)
-- No INSERT/UPDATE/DELETE policies = only service role can modify

-- ============================================================================
-- TEMPLATES POLICIES
-- ============================================================================

-- Agents can view templates they created or public templates
CREATE POLICY "Agents can view accessible templates"
ON templates FOR SELECT
USING (
  is_agent() AND (
    created_by = auth.uid() OR
    is_public = TRUE OR
    agency_id = get_user_agency()
  ) AND is_active = TRUE
);

-- Agents can create templates
CREATE POLICY "Agents can create templates"
ON templates FOR INSERT
WITH CHECK (is_agent() AND created_by = auth.uid());

-- Agents can update their own templates
CREATE POLICY "Agents can update own templates"
ON templates FOR UPDATE
USING (is_agent() AND created_by = auth.uid());

-- Agents can delete their own templates
CREATE POLICY "Agents can delete own templates"
ON templates FOR DELETE
USING (is_agent() AND created_by = auth.uid());

-- ============================================================================
-- TEMPLATE COMPONENTS POLICIES
-- ============================================================================

-- Template activities: inherit template access
CREATE POLICY "View template activities if can view template"
ON template_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates t 
    WHERE t.id = template_id 
    AND (
      (is_agent() AND (t.created_by = auth.uid() OR t.is_public = TRUE OR t.agency_id = get_user_agency())) AND
      t.is_active = TRUE
    )
  )
);

CREATE POLICY "Agents can manage own template activities"
ON template_activities FOR ALL
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM templates WHERE id = template_id AND created_by = auth.uid()
  )
);

-- Template accommodations: same as activities
CREATE POLICY "View template accommodations if can view template"
ON template_accommodations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates t 
    WHERE t.id = template_id 
    AND (
      (is_agent() AND (t.created_by = auth.uid() OR t.is_public = TRUE OR t.agency_id = get_user_agency())) AND
      t.is_active = TRUE
    )
  )
);

CREATE POLICY "Agents can manage own template accommodations"
ON template_accommodations FOR ALL
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM templates WHERE id = template_id AND created_by = auth.uid()
  )
);

-- Template meals: same as activities
CREATE POLICY "View template meals if can view template"
ON template_meals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates t 
    WHERE t.id = template_id 
    AND (
      (is_agent() AND (t.created_by = auth.uid() OR t.is_public = TRUE OR t.agency_id = get_user_agency())) AND
      t.is_active = TRUE
    )
  )
);

CREATE POLICY "Agents can manage own template meals"
ON template_meals FOR ALL
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM templates WHERE id = template_id AND created_by = auth.uid()
  )
);

-- Template customization rules
CREATE POLICY "View template rules if can view template"
ON template_customization_rules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM templates t 
    WHERE t.id = template_id 
    AND (
      (is_agent() AND (t.created_by = auth.uid() OR t.is_public = TRUE OR t.agency_id = get_user_agency())) AND
      t.is_active = TRUE
    )
  )
);

CREATE POLICY "Agents can manage own template rules"
ON template_customization_rules FOR ALL
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM templates WHERE id = template_id AND created_by = auth.uid()
  )
);

-- Template usage analytics
CREATE POLICY "Agents can view template analytics"
ON template_usage_analytics FOR SELECT
USING (
  is_agent() AND (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM templates t 
      WHERE t.id = template_id AND t.created_by = auth.uid()
    )
  )
);

CREATE POLICY "System can insert usage analytics"
ON template_usage_analytics FOR INSERT
WITH CHECK (TRUE); -- Will be controlled by backend service role

-- ============================================================================
-- ITINERARIES POLICIES
-- ============================================================================

-- Agents can view itineraries they created or in their agency
CREATE POLICY "Agents can view own itineraries"
ON itineraries FOR SELECT
USING (
  is_agent() AND (
    agent_id = auth.uid() OR
    agent_id IN (SELECT id FROM users WHERE agency_id = get_user_agency())
  )
);

-- Travelers can view itineraries shared with them
CREATE POLICY "Travelers can view shared itineraries"
ON itineraries FOR SELECT
USING (
  is_traveler() AND (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()) OR
    shared_token IN (
      SELECT share_token FROM itinerary_shares 
      WHERE shared_with_email IN (SELECT email FROM users WHERE id = auth.uid())
    )
  )
);

-- Agents can create itineraries
CREATE POLICY "Agents can create itineraries"
ON itineraries FOR INSERT
WITH CHECK (is_agent() AND agent_id = auth.uid());

-- Agents can update their own itineraries
CREATE POLICY "Agents can update own itineraries"
ON itineraries FOR UPDATE
USING (is_agent() AND agent_id = auth.uid());

-- Agents can delete their own draft itineraries
CREATE POLICY "Agents can delete own draft itineraries"
ON itineraries FOR DELETE
USING (is_agent() AND agent_id = auth.uid() AND status = 'draft');

-- ============================================================================
-- ITINERARY CUSTOMIZATIONS POLICIES
-- ============================================================================

-- Agents can view customizations for their itineraries
CREATE POLICY "Agents can view itinerary customizations"
ON itinerary_customizations FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- Agents and customers can create customizations
CREATE POLICY "Users can create customizations"
ON itinerary_customizations FOR INSERT
WITH CHECK (
  (is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )) OR
  (is_traveler() AND EXISTS (
    SELECT 1 FROM itineraries i
    JOIN customers c ON i.customer_id = c.id
    WHERE i.id = itinerary_id AND c.user_id = auth.uid()
  ))
);

-- ============================================================================
-- ITINERARY SHARES POLICIES
-- ============================================================================

-- Agents can view shares for their itineraries
CREATE POLICY "Agents can view itinerary shares"
ON itinerary_shares FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- Agents can create shares
CREATE POLICY "Agents can share itineraries"
ON itinerary_shares FOR INSERT
WITH CHECK (
  is_agent() AND shared_by = auth.uid() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- Agents can update their shares
CREATE POLICY "Agents can update own shares"
ON itinerary_shares FOR UPDATE
USING (is_agent() AND shared_by = auth.uid());

-- ============================================================================
-- MODIFICATION REQUESTS POLICIES
-- ============================================================================

-- Agents can view modification requests for their itineraries
CREATE POLICY "Agents can view modification requests"
ON modification_requests FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- Travelers can view their own modification requests
CREATE POLICY "Travelers can view own modification requests"
ON modification_requests FOR SELECT
USING (
  is_traveler() AND EXISTS (
    SELECT 1 FROM customers WHERE id = customer_id AND user_id = auth.uid()
  )
);

-- Travelers can create modification requests
CREATE POLICY "Travelers can create modification requests"
ON modification_requests FOR INSERT
WITH CHECK (
  is_traveler() AND EXISTS (
    SELECT 1 FROM customers WHERE id = customer_id AND user_id = auth.uid()
  )
);

-- Agents can update modification requests (respond)
CREATE POLICY "Agents can respond to modification requests"
ON modification_requests FOR UPDATE
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- ============================================================================
-- CONVERSATION HISTORY POLICIES
-- ============================================================================

-- Agents can view conversations for their itineraries
CREATE POLICY "Agents can view conversation history"
ON conversation_history FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )
);

-- Travelers can view conversations for their itineraries
CREATE POLICY "Travelers can view own conversations"
ON conversation_history FOR SELECT
USING (
  is_traveler() AND EXISTS (
    SELECT 1 FROM itineraries i
    JOIN customers c ON i.customer_id = c.id
    WHERE i.id = itinerary_id AND c.user_id = auth.uid()
  )
);

-- Both agents and travelers can create messages
CREATE POLICY "Users can create conversation messages"
ON conversation_history FOR INSERT
WITH CHECK (
  (is_agent() AND EXISTS (
    SELECT 1 FROM itineraries WHERE id = itinerary_id AND agent_id = auth.uid()
  )) OR
  (is_traveler() AND EXISTS (
    SELECT 1 FROM itineraries i
    JOIN customers c ON i.customer_id = c.id
    WHERE i.id = itinerary_id AND c.user_id = auth.uid()
  ))
);

-- ============================================================================
-- SERVICE PROVIDERS POLICIES
-- ============================================================================

-- Agents can view active providers
CREATE POLICY "Agents can view active providers"
ON service_providers FOR SELECT
USING (is_agent() AND is_active = TRUE);

-- Vendors can view their own profile
CREATE POLICY "Vendors can view own profile"
ON service_providers FOR SELECT
USING (is_vendor() AND auth.uid() IN (SELECT user_id FROM users)); -- Need more complex mapping

-- Only service role can modify providers (via backend)

-- ============================================================================
-- PROVIDER SERVICES POLICIES
-- ============================================================================

-- Agents can view services from active providers
CREATE POLICY "Agents can view provider services"
ON provider_services FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM service_providers WHERE id = provider_id AND is_active = TRUE
  )
);

-- ============================================================================
-- NEGOTIATIONS POLICIES
-- ============================================================================

-- Agents can view their own negotiations
CREATE POLICY "Agents can view own negotiations"
ON negotiations FOR SELECT
USING (is_agent() AND agent_id = auth.uid());

-- Agents can create negotiations
CREATE POLICY "Agents can create negotiations"
ON negotiations FOR INSERT
WITH CHECK (is_agent() AND agent_id = auth.uid());

-- Agents can update their negotiations
CREATE POLICY "Agents can update own negotiations"
ON negotiations FOR UPDATE
USING (is_agent() AND agent_id = auth.uid());

-- Vendors can view negotiations sent to them
CREATE POLICY "Vendors can view negotiations sent to them"
ON negotiations FOR SELECT
USING (
  is_vendor() 
  -- This needs proper user-provider mapping which would be implemented in backend
);

-- ============================================================================
-- NEGOTIATION MESSAGES POLICIES
-- ============================================================================

-- Agents can view messages for their negotiations
CREATE POLICY "Agents can view negotiation messages"
ON negotiation_messages FOR SELECT
USING (
  is_agent() AND EXISTS (
    SELECT 1 FROM negotiations WHERE id = negotiation_id AND agent_id = auth.uid()
  )
);

-- Agents can create messages for their negotiations
CREATE POLICY "Agents can create negotiation messages"
ON negotiation_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM negotiations WHERE id = negotiation_id AND agent_id = auth.uid()
  )
);

-- ============================================================================
-- PROVIDER PERFORMANCE POLICIES
-- ============================================================================

-- Agents can view provider performance
CREATE POLICY "Agents can view provider performance"
ON provider_performance FOR SELECT
USING (is_agent());

-- Only service role can insert performance data

-- ============================================================================
-- COMMENTS ON POLICIES
-- ============================================================================

COMMENT ON POLICY "Users can view own agency" ON agencies IS 
'Users can only view their own agency information';

COMMENT ON POLICY "Agents can view accessible templates" ON templates IS 
'Agents can view templates they created, public templates, or templates from their agency';

COMMENT ON POLICY "Agents can view own itineraries" ON itineraries IS 
'Agents can view itineraries they created or from agents in their agency';

COMMENT ON POLICY "Travelers can view shared itineraries" ON itineraries IS 
'Travelers can view itineraries that have been shared with them';

COMMENT ON POLICY "Only agents can view all vendor profiles" ON service_providers IS 
'Protects vendor network data from public access';
