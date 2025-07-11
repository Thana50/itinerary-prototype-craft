
-- Create a function to ensure confirmation_token is never NULL
CREATE OR REPLACE FUNCTION public.fix_null_confirmation_tokens()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if confirmation_token is NULL and set to empty string if it is
    IF NEW.confirmation_token IS NULL THEN
        NEW.confirmation_token := '';
        
        -- Log the fix
        INSERT INTO public.auth_schema_fixes 
        (operation, table_name, column_name, description, affected_rows, status)
        VALUES (
            'TRIGGER_FIX', 
            'auth.users', 
            'confirmation_token', 
            'Fixed NULL confirmation_token during ' || TG_OP || ' operation for user_id: ' || NEW.id, 
            1, 
            'COMPLETED'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Create the trigger
DROP TRIGGER IF EXISTS ensure_confirmation_token_not_null ON auth.users;

CREATE TRIGGER ensure_confirmation_token_not_null
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.fix_null_confirmation_tokens();
