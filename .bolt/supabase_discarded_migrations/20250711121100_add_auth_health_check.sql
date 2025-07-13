
-- Create a function to check authentication health
CREATE OR REPLACE FUNCTION public.check_auth_schema_health()
RETURNS TABLE (
    table_name TEXT,
    column_name TEXT,
    null_count BIGINT,
    total_rows BIGINT,
    health_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'auth.users'::TEXT AS table_name,
        'confirmation_token'::TEXT AS column_name,
        COUNT(*) FILTER (WHERE confirmation_token IS NULL) AS null_count,
        COUNT(*) AS total_rows,
        CASE 
            WHEN COUNT(*) FILTER (WHERE confirmation_token IS NULL) > 0 
            THEN 'NEEDS_ATTENTION'
            ELSE 'HEALTHY'
        END AS health_status
    FROM auth.users;
    
    -- Log the check
    INSERT INTO public.auth_schema_fixes 
    (operation, table_name, column_name, description, affected_rows, status)
    SELECT 
        'CHECK', 
        'auth.users', 
        'confirmation_token', 
        'Performed health check on confirmation_token column', 
        null_count, 
        health_status
    FROM (
        SELECT 
            COUNT(*) FILTER (WHERE confirmation_token IS NULL) AS null_count,
            CASE 
                WHEN COUNT(*) FILTER (WHERE confirmation_token IS NULL) > 0 
                THEN 'NEEDS_ATTENTION'
                ELSE 'HEALTHY'
            END AS health_status
        FROM auth.users
    ) subquery;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';
