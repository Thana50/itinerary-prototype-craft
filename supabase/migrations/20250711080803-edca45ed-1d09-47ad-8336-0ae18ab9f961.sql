
-- First, let's check if the demo users exist in auth.users and get their details
-- Then manually insert them into public.users with the correct data

-- Insert the demo users manually with their correct roles
INSERT INTO public.users (id, email, role, name) VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'agent@demo.com' LIMIT 1),
  'agent@demo.com',
  'agent',
  'Demo Agent'
),
(
  (SELECT id FROM auth.users WHERE email = 'traveler@demo.com' LIMIT 1),
  'traveler@demo.com', 
  'traveler',
  'Demo Traveler'
),
(
  (SELECT id FROM auth.users WHERE email = 'vendor@demo.com' LIMIT 1),
  'vendor@demo.com',
  'vendor', 
  'Demo Vendor'
)
ON CONFLICT (id) DO NOTHING;
