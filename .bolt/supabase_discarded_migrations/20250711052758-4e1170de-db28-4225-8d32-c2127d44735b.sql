
-- Remove the problematic direct inserts to auth.users table
-- The edge function will handle user creation properly

-- Only ensure we have the demo users in our public.users table
-- This will be handled by the handle_new_user trigger when users are created via the edge function
