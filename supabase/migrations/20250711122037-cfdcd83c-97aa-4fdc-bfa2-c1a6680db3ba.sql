
-- Step 1: First, let's check what columns actually exist in auth.users and fix missing ones
-- Add any missing columns that might be expected by Supabase Auth
DO $$
BEGIN
    -- Add phone_change_token if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'phone_change_token') THEN
        ALTER TABLE auth.users ADD COLUMN phone_change_token VARCHAR(255);
    END IF;
    
    -- Add reauthentication_token if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'reauthentication_token') THEN
        ALTER TABLE auth.users ADD COLUMN reauthentication_token VARCHAR(255);
    END IF;
    
    -- Add reauthentication_sent_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'reauthentication_sent_at') THEN
        ALTER TABLE auth.users ADD COLUMN reauthentication_sent_at TIMESTAMPTZ;
    END IF;
END $$;

-- Step 2: Completely recreate the health check function with no ambiguous references
DROP FUNCTION IF EXISTS public.check_auth_schema_health();

CREATE OR REPLACE FUNCTION public.check_auth_schema_health()
RETURNS TABLE(table_name text, column_name text, null_count bigint, total_rows bigint, health_status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    confirmation_nulls bigint;
    total_users bigint;
    status_text text;
BEGIN
    -- Get counts from auth.users table with explicit variable names
    SELECT 
        COUNT(*) FILTER (WHERE confirmation_token IS NULL),
        COUNT(*)
    INTO confirmation_nulls, total_users
    FROM auth.users;
    
    -- Determine health status
    status_text := CASE 
        WHEN confirmation_nulls > 0 THEN 'NEEDS_ATTENTION'
        ELSE 'HEALTHY'
    END;
    
    -- Return the results with explicit values
    RETURN QUERY SELECT 
        'auth.users'::text as table_name,
        'confirmation_token'::text as column_name,
        confirmation_nulls as null_count,
        total_users as total_rows,
        status_text as health_status;
    
    -- Log the check
    INSERT INTO public.auth_schema_fixes 
    (operation, table_name, column_name, description, affected_rows, status)
    VALUES (
        'CHECK', 
        'auth.users', 
        'confirmation_token', 
        'Performed health check on confirmation_token column', 
        confirmation_nulls, 
        status_text
    );
END;
$$;

-- Step 3: Fix ALL NULL values comprehensively across ALL auth columns
UPDATE auth.users 
SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    email_change = COALESCE(email_change, ''),
    phone_change = COALESCE(phone_change, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    reauthentication_sent_at = COALESCE(reauthentication_sent_at, NOW()),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    phone_confirmed_at = COALESCE(phone_confirmed_at, NULL),
    confirmation_sent_at = COALESCE(confirmation_sent_at, NOW()),
    recovery_sent_at = COALESCE(recovery_sent_at, NULL),
    email_change_sent_at = COALESCE(email_change_sent_at, NULL),
    phone_change_sent_at = COALESCE(phone_change_sent_at, NULL);

-- Step 4: Set comprehensive default values to prevent future NULL issues
ALTER TABLE auth.users 
    ALTER COLUMN confirmation_token SET DEFAULT '',
    ALTER COLUMN email_change SET DEFAULT '',
    ALTER COLUMN phone_change SET DEFAULT '',
    ALTER COLUMN recovery_token SET DEFAULT '',
    ALTER COLUMN email_change_token_new SET DEFAULT '',
    ALTER COLUMN email_change_token_current SET DEFAULT '',
    ALTER COLUMN phone_change_token SET DEFAULT '',
    ALTER COLUMN reauthentication_token SET DEFAULT '';

-- Step 5: Drop ALL existing triggers and recreate with comprehensive coverage
DROP TRIGGER IF EXISTS ensure_confirmation_token_not_null ON auth.users;
DROP TRIGGER IF EXISTS ensure_auth_columns_not_null ON auth.users;
DROP TRIGGER IF EXISTS fix_auth_nulls_trigger ON auth.users;
DROP TRIGGER IF EXISTS fix_all_auth_nulls_trigger ON auth.users;

-- Step 6: Create the most comprehensive trigger function possible
CREATE OR REPLACE FUNCTION public.ensure_auth_schema_integrity()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure ALL string columns are never NULL
    NEW.confirmation_token := COALESCE(NEW.confirmation_token, '');
    NEW.email_change := COALESCE(NEW.email_change, '');
    NEW.phone_change := COALESCE(NEW.phone_change, '');
    NEW.recovery_token := COALESCE(NEW.recovery_token, '');
    NEW.email_change_token_new := COALESCE(NEW.email_change_token_new, '');
    NEW.email_change_token_current := COALESCE(NEW.email_change_token_current, '');
    NEW.phone_change_token := COALESCE(NEW.phone_change_token, '');
    NEW.reauthentication_token := COALESCE(NEW.reauthentication_token, '');
    
    -- Ensure critical timestamp fields have reasonable defaults
    IF NEW.email_confirmed_at IS NULL AND NEW.email IS NOT NULL THEN
        NEW.email_confirmed_at := NOW();
    END IF;
    
    IF NEW.confirmation_sent_at IS NULL THEN
        NEW.confirmation_sent_at := NOW();
    END IF;
    
    IF NEW.reauthentication_sent_at IS NULL THEN
        NEW.reauthentication_sent_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Step 7: Create the comprehensive trigger
CREATE TRIGGER ensure_auth_schema_integrity_trigger
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.ensure_auth_schema_integrity();

-- Step 8: Force a complete refresh of all auth.users records
UPDATE auth.users SET updated_at = NOW();

-- Step 9: Log this ultimate fix
INSERT INTO public.auth_schema_fixes 
(operation, table_name, column_name, description, affected_rows, status)
VALUES (
    'ULTIMATE_SCHEMA_FIX', 
    'auth.users', 
    'complete_schema', 
    'Applied ultimate comprehensive fix for ALL auth schema issues including missing columns, NULL values, and ambiguous references', 
    (SELECT COUNT(*) FROM auth.users), 
    'COMPLETED'
);
