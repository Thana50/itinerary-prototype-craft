-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view market intelligence" ON public.market_intelligence;

-- Create a new policy that restricts access to agents only
CREATE POLICY "Only agents can view market intelligence" 
ON public.market_intelligence
FOR SELECT 
USING (get_user_role_from_auth() = 'agent');

-- Add a comment explaining the security rationale
COMMENT ON POLICY "Only agents can view market intelligence" ON public.market_intelligence IS 
'Restricts access to proprietary market research data to agents only. Vendors and travelers should not have access to this competitive intelligence.';