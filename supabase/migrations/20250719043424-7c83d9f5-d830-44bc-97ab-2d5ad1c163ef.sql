
-- Drop all existing problematic policies and functions
DROP POLICY IF EXISTS "Users can view own profile and agents view all" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile and agents can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Agents can view all profiles" ON public.users;
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_role_from_auth();

-- Create a security definer function that gets role from auth.users metadata
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

-- Create new RLS policies that don't cause recursion
-- Users can always view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Agents can view all profiles (using auth metadata, not public.users table)
CREATE POLICY "Agents can view all profiles" 
ON public.users 
FOR SELECT 
USING (public.get_user_role_from_auth() = 'agent');

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);
