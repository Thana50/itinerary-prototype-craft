
-- First, let's see what columns might have NULL values in auth.users
-- and get a complete picture of the demo users
SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as has_password,
    email_confirmed_at IS NOT NULL as email_confirmed,
    confirmed_at IS NOT NULL as confirmed,
    confirmation_token IS NOT NULL as has_confirmation_token,
    recovery_token IS NOT NULL as has_recovery_token,
    email_change_token_new IS NOT NULL as has_email_change_token_new,
    email_change_token_current IS NOT NULL as has_email_change_token_current,
    phone_change IS NOT NULL as has_phone_change,
    phone_change_token IS NOT NULL as has_phone_change_token,
    aud,
    role,
    created_at,
    updated_at
FROM auth.users 
WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com');

-- Now let's fix ALL possible NULL values in auth.users that could cause issues
UPDATE auth.users 
SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    aud = COALESCE(aud, 'authenticated'),
    role = COALESCE(role, 'authenticated'),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmed_at = COALESCE(confirmed_at, now()),
    phone_confirmed_at = COALESCE(phone_confirmed_at, now()),
    last_sign_in_at = COALESCE(last_sign_in_at, now()),
    updated_at = now()
WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com');

-- Let's also ensure the users have proper encrypted passwords
-- This will reset their passwords to 'demo123' if they don't have proper passwords
DO $$
DECLARE
    user_record RECORD;
    hashed_password TEXT;
BEGIN
    -- Check each demo user and ensure they have proper passwords
    FOR user_record IN 
        SELECT id, email 
        FROM auth.users 
        WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com')
        AND (encrypted_password IS NULL OR encrypted_password = '')
    LOOP
        -- Use crypt to hash the password 'demo123'
        hashed_password := crypt('demo123', gen_salt('bf'));
        
        UPDATE auth.users 
        SET encrypted_password = hashed_password,
            updated_at = now()
        WHERE id = user_record.id;
        
        RAISE NOTICE 'Updated password for user: %', user_record.email;
    END LOOP;
END $$;

-- Log this comprehensive fix
INSERT INTO public.auth_schema_fixes 
(operation, table_name, column_name, description, affected_rows, status)
VALUES (
    'COMPREHENSIVE_FIX', 
    'auth.users', 
    'all_columns', 
    'Comprehensive fix of ALL NULL values and password verification for demo users', 
    3, 
    'COMPLETED'
);
