-- Create proper user roles system to prevent privilege escalation
-- Step 1: Create role enum
CREATE TYPE public.app_role AS ENUM ('agent', 'traveler', 'vendor');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create function to get user's primary role (for backwards compatibility)
CREATE OR REPLACE FUNCTION public.get_user_primary_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY created_at ASC
  LIMIT 1
$$;

-- Step 6: Migrate existing roles from users table to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.users
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 7: Update get_user_role_from_auth function to use user_roles table
CREATE OR REPLACE FUNCTION public.get_user_role_from_auth()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY created_at ASC
  LIMIT 1
$function$;

-- Step 8: Update handle_new_user trigger function to use user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from metadata, default to 'traveler'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'traveler')::app_role;
  
  -- Insert into users table (keeping for backwards compatibility)
  INSERT INTO public.users (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    user_role::text,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Insert into user_roles table (secure role storage)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;

-- Step 9: RLS policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Agents can view all roles (for administrative purposes)
CREATE POLICY "Agents can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'agent'));

-- Only service role can insert/update/delete roles (prevents privilege escalation)
-- No INSERT/UPDATE/DELETE policies = only service role can modify

-- Add indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Add comment explaining security
COMMENT ON TABLE public.user_roles IS 
'Secure role storage table. Roles are stored separately from user profiles to prevent privilege escalation attacks. Only service role can modify roles.';

COMMENT ON FUNCTION public.has_role IS
'Security definer function to check user roles without triggering RLS recursion. Used in RLS policies.';