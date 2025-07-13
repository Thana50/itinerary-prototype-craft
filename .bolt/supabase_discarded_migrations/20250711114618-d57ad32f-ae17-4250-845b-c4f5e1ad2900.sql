
-- Create a table to log our authentication fixes
CREATE TABLE IF NOT EXISTS public.auth_schema_fixes (
  id BIGSERIAL PRIMARY KEY,
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_rows INTEGER,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the fixes table for security
ALTER TABLE public.auth_schema_fixes ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to view fixes
CREATE POLICY "Allow all operations for authenticated users" ON public.auth_schema_fixes
FOR ALL TO authenticated USING (true);

-- First, update existing NULL values to empty strings
UPDATE auth.users 
SET confirmation_token = '' 
WHERE confirmation_token IS NULL;

-- Log the update operation
INSERT INTO public.auth_schema_fixes 
(operation, table_name, column_name, description, affected_rows, status)
SELECT 
    'UPDATE', 
    'auth.users', 
    'confirmation_token', 
    'Updated NULL confirmation_token values to empty strings', 
    COUNT(*), 
    'COMPLETED'
FROM auth.users
WHERE confirmation_token = '';

-- Now alter the column to set a default value
ALTER TABLE auth.users 
ALTER COLUMN confirmation_token SET DEFAULT '';
