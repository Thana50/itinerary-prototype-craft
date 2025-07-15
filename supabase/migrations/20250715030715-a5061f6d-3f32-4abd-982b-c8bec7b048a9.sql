
-- Update RLS policy to allow agents to view all users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

CREATE POLICY "Users can view their own profile and agents can view all users" 
ON public.users 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'agent')
);
