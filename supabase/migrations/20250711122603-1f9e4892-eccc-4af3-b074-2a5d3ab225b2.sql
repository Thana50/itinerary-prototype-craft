
-- Drop and completely recreate the health check function with zero ambiguity
DROP FUNCTION IF EXISTS public.check_auth_schema_health();

CREATE OR REPLACE FUNCTION public.check_auth_schema_health()
RETURNS TABLE(
    table_name text, 
    column_name text, 
    null_count bigint, 
    total_rows bigint, 
    health_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_null_count bigint;
    v_total_rows bigint;
    v_health_status text;
BEGIN
    -- Get counts with completely explicit variable names
    SELECT 
        COUNT(*) FILTER (WHERE au.confirmation_token IS NULL),
        COUNT(*)
    INTO v_null_count, v_total_rows
    FROM auth.users au;
    
    -- Determine status
    v_health_status := CASE 
        WHEN v_null_count > 0 THEN 'NEEDS_ATTENTION'
        ELSE 'HEALTHY'
    END;
    
    -- Return results using variables only
    RETURN QUERY SELECT 
        'auth.users'::text,
        'confirmation_token'::text,
        v_null_count,
        v_total_rows,
        v_health_status;
    
    -- Log without any column name conflicts
    INSERT INTO public.auth_schema_fixes 
    (operation, table_name, column_name, description, affected_rows, status)
    VALUES (
        'HEALTH_CHECK', 
        'auth.users', 
        'confirmation_token', 
        'Health check completed successfully', 
        v_null_count, 
        v_health_status
    );
END;
$$;
