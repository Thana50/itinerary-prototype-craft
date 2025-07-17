
-- Drop the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile and agents can view all users" ON public.users;

-- Create a security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM auth.users WHERE id = auth.uid()
$$;

-- Create a new RLS policy using the security definer function
CREATE POLICY "Users can view own profile and agents view all" 
ON public.users 
FOR SELECT 
USING (
  auth.uid() = id OR 
  public.get_current_user_role() = 'agent'
);

-- Also ensure we have proper policies for other operations
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);
