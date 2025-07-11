
-- First, let's completely recreate the health check function to fix the ambiguous column reference
DROP FUNCTION IF EXISTS public.check_auth_schema_health();

CREATE OR REPLACE FUNCTION public.check_auth_schema_health()
RETURNS TABLE(table_name text, column_name text, null_count bigint, total_rows bigint, health_status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    _null_count bigint;
    _total_rows bigint;
    _health_status text;
BEGIN
    -- Get counts from auth.users table
    SELECT 
        COUNT(*) FILTER (WHERE confirmation_token IS NULL),
        COUNT(*)
    INTO _null_count, _total_rows
    FROM auth.users;
    
    -- Determine health status
    _health_status := CASE 
        WHEN _null_count > 0 THEN 'NEEDS_ATTENTION'
        ELSE 'HEALTHY'
    END;
    
    -- Return the results
    RETURN QUERY SELECT 
        'auth.users'::text,
        'confirmation_token'::text,
        _null_count,
        _total_rows,
        _health_status;
    
    -- Log the check
    INSERT INTO public.auth_schema_fixes 
    (operation, table_name, column_name, description, affected_rows, status)
    VALUES (
        'CHECK', 
        'auth.users', 
        'confirmation_token', 
        'Performed health check on confirmation_token column', 
        _null_count, 
        _health_status
    );
END;
$$;

-- Now let's comprehensively fix ALL potential NULL issues in auth.users
-- This addresses the core "Database error querying schema" problem

-- Step 1: Fix all existing NULL values in auth.users
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
    reauthentication_sent_at = COALESCE(reauthentication_sent_at, NOW())
WHERE 
    confirmation_token IS NULL 
    OR email_change IS NULL 
    OR phone_change IS NULL 
    OR recovery_token IS NULL 
    OR email_change_token_new IS NULL 
    OR email_change_token_current IS NULL
    OR phone_change_token IS NULL
    OR reauthentication_token IS NULL
    OR reauthentication_sent_at IS NULL;

-- Step 2: Set proper default values for all problematic columns
ALTER TABLE auth.users 
    ALTER COLUMN confirmation_token SET DEFAULT '',
    ALTER COLUMN email_change SET DEFAULT '',
    ALTER COLUMN phone_change SET DEFAULT '',
    ALTER COLUMN recovery_token SET DEFAULT '',
    ALTER COLUMN email_change_token_new SET DEFAULT '',
    ALTER COLUMN email_change_token_current SET DEFAULT '',
    ALTER COLUMN phone_change_token SET DEFAULT '',
    ALTER COLUMN reauthentication_token SET DEFAULT '';

-- Step 3: Create a comprehensive trigger to prevent ANY NULL values in critical auth columns
CREATE OR REPLACE FUNCTION public.fix_all_auth_nulls()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure no critical auth columns are NULL
    NEW.confirmation_token := COALESCE(NEW.confirmation_token, '');
    NEW.email_change := COALESCE(NEW.email_change, '');
    NEW.phone_change := COALESCE(NEW.phone_change, '');
    NEW.recovery_token := COALESCE(NEW.recovery_token, '');
    NEW.email_change_token_new := COALESCE(NEW.email_change_token_new, '');
    NEW.email_change_token_current := COALESCE(NEW.email_change_token_current, '');
    NEW.phone_change_token := COALESCE(NEW.phone_change_token, '');
    NEW.reauthentication_token := COALESCE(NEW.reauthentication_token, '');
    
    -- Ensure timestamp fields have valid values
    IF NEW.reauthentication_sent_at IS NULL THEN
        NEW.reauthentication_sent_at := NOW();
    END IF;
    
    -- Log any fixes made
    IF TG_OP = 'UPDATE' AND (
        OLD.confirmation_token IS DISTINCT FROM NEW.confirmation_token 
        OR OLD.email_change IS DISTINCT FROM NEW.email_change 
        OR OLD.phone_change IS DISTINCT FROM NEW.phone_change 
        OR OLD.recovery_token IS DISTINCT FROM NEW.recovery_token 
        OR OLD.email_change_token_new IS DISTINCT FROM NEW.email_change_token_new 
        OR OLD.email_change_token_current IS DISTINCT FROM NEW.email_change_token_current
        OR OLD.phone_change_token IS DISTINCT FROM NEW.phone_change_token
        OR OLD.reauthentication_token IS DISTINCT FROM NEW.reauthentication_token
    ) THEN
        INSERT INTO public.auth_schema_fixes 
        (operation, table_name, column_name, description, affected_rows, status)
        VALUES (
            'TRIGGER_FIX', 
            'auth.users', 
            'multiple_columns', 
            'Fixed NULL values in auth columns during ' || TG_OP || ' operation for user_id: ' || NEW.id, 
            1, 
            'COMPLETED'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Step 4: Drop any existing triggers and create the new comprehensive one
DROP TRIGGER IF EXISTS ensure_confirmation_token_not_null ON auth.users;
DROP TRIGGER IF EXISTS ensure_auth_columns_not_null ON auth.users;
DROP TRIGGER IF EXISTS fix_auth_nulls_trigger ON auth.users;

CREATE TRIGGER fix_all_auth_nulls_trigger
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.fix_all_auth_nulls();

-- Step 5: Force update all existing auth.users records to trigger the fixes
UPDATE auth.users SET updated_at = NOW();

-- Step 6: Log this comprehensive fix
INSERT INTO public.auth_schema_fixes 
(operation, table_name, column_name, description, affected_rows, status)
VALUES (
    'COMPREHENSIVE_FIX', 
    'auth.users', 
    'all_auth_columns', 
    'Applied comprehensive fix for ALL NULL values in auth.users table with enhanced triggers and defaults', 
    (SELECT COUNT(*) FROM auth.users), 
    'COMPLETED'
);
