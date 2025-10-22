-- Fix vendor_profiles and vendor_services public exposure
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view vendor profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Anyone can view vendor services" ON public.vendor_services;
DROP POLICY IF EXISTS "Authenticated users can view negotiation templates" ON public.negotiation_templates;

-- Vendor Profiles: Agents can view all, vendors can view their own
CREATE POLICY "Only agents can view all vendor profiles"
ON public.vendor_profiles
FOR SELECT
USING (get_user_role_from_auth() = 'agent');

CREATE POLICY "Vendors can view own profile"
ON public.vendor_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Vendor Services: Agents can view all, vendors can view their own
CREATE POLICY "Only agents can view all vendor services"
ON public.vendor_services
FOR SELECT
USING (get_user_role_from_auth() = 'agent');

CREATE POLICY "Vendors can view own services"
ON public.vendor_services
FOR SELECT
USING (auth.uid() = vendor_id);

-- Negotiation Templates: Agents only (vendors should not see negotiation strategies)
CREATE POLICY "Only agents can view negotiation templates"
ON public.negotiation_templates
FOR SELECT
USING (get_user_role_from_auth() = 'agent');

-- Add comments explaining security rationale
COMMENT ON POLICY "Only agents can view all vendor profiles" ON public.vendor_profiles IS 
'Restricts vendor network data to agents only. Prevents competitors from accessing vendor relationships.';

COMMENT ON POLICY "Only agents can view all vendor services" ON public.vendor_services IS 
'Protects pricing and negotiation discount information from public access. Critical for maintaining competitive advantage.';

COMMENT ON POLICY "Only agents can view negotiation templates" ON public.negotiation_templates IS 
'Keeps negotiation strategies confidential from vendors. Prevents them from anticipating tactics.';