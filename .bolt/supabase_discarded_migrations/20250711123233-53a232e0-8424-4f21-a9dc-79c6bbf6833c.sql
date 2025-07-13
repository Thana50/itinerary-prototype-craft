
-- Fix NULL values in auth.users table that are causing authentication failures
UPDATE auth.users 
SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    email_change = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    aud = COALESCE(aud, 'authenticated'),
    role = COALESCE(role, 'authenticated')
WHERE 
    confirmation_token IS NULL 
    OR email_change IS NULL 
    OR email_change_token_new IS NULL 
    OR email_change_token_current IS NULL 
    OR phone_change IS NULL 
    OR phone_change_token IS NULL 
    OR aud IS NULL 
    OR role IS NULL;

-- Ensure all demo users are properly confirmed
UPDATE auth.users 
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmed_at = COALESCE(confirmed_at, now())
WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com')
    AND (email_confirmed_at IS NULL OR confirmed_at IS NULL);

-- Log the fix
INSERT INTO public.auth_schema_fixes 
(operation, table_name, column_name, description, affected_rows, status)
VALUES (
    'DATA_FIX', 
    'auth.users', 
    'multiple_columns', 
    'Fixed NULL values in auth.users table to resolve authentication failures', 
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com')), 
    'COMPLETED'
);
