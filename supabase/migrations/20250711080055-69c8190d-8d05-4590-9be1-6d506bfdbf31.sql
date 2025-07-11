
-- Create the trigger to automatically create user profiles when auth users are created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Populate the missing user profiles for existing demo users
INSERT INTO public.users (id, email, role, name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'traveler') as role,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name
FROM auth.users 
WHERE email IN ('agent@demo.com', 'traveler@demo.com', 'vendor@demo.com')
ON CONFLICT (id) DO NOTHING;
