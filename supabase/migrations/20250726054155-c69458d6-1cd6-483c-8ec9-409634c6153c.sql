-- Create the security definer function that gets role from auth.users metadata
CREATE OR REPLACE FUNCTION public.get_user_role_from_auth()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (raw_user_meta_data->>'role')::text, 
    'traveler'
  ) FROM auth.users WHERE id = auth.uid()
$$;

-- Force drop the problematic recursive policy
DROP POLICY "Users can view their own profile and agents can view all users" ON public.users;

-- Ensure our non-recursive policies are in place
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Agents can view all profiles" ON public.users;

-- Recreate the non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Agents can view all profiles" 
ON public.users 
FOR SELECT 
USING (public.get_user_role_from_auth() = 'agent');