-- Restrict public access to shared itineraries and add secure RPC for token-based access

-- 1) Remove overly permissive shared access policy
DROP POLICY IF EXISTS "Travelers can view shared itineraries" ON public.itineraries;

-- 2) Add scoped traveler access policy (own itineraries only)
CREATE POLICY "Travelers can view their own itineraries"
ON public.itineraries
FOR SELECT
USING (traveler_id = auth.uid());

-- 3) Secure RPC to fetch a shared itinerary by token
CREATE OR REPLACE FUNCTION public.get_itinerary_by_token(_token uuid)
RETURNS SETOF public.itineraries
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT i.*
  FROM public.itineraries i
  WHERE i.share_token = _token
    AND i.status = 'shared'
  LIMIT 1
$$;

-- 4) Allow both anon and authenticated to call the RPC (token acts as the secret)
GRANT EXECUTE ON FUNCTION public.get_itinerary_by_token(uuid) TO anon, authenticated;