
-- Insert demo users into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'agent@demo.com',
  '$2a$10$N0aKOQcFqaLzRlYBnYH0V.hKjZXoIUB3Gy4LjIqwB4zXkWuqP2nwS', -- password: "demo123"
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "agent", "name": "Travel Agent Demo"}',
  false,
  'authenticated',
  'authenticated'
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'traveler@demo.com',
  '$2a$10$N0aKOQcFqaLzRlYBnYH0V.hKjZXoIUB3Gy4LjIqwB4zXkWuqP2nwS', -- password: "demo123"
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "traveler", "name": "Traveler Demo"}',
  false,
  'authenticated',
  'authenticated'
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'vendor@demo.com',
  '$2a$10$N0aKOQcFqaLzRlYBnYH0V.hKjZXoIUB3Gy4LjIqwB4zXkWuqP2nwS', -- password: "demo123"
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "vendor", "name": "Vendor Demo"}',
  false,
  'authenticated',
  'authenticated'
);

-- The users table entries will be automatically created by the handle_new_user trigger
-- But let's make sure they exist with the correct data
INSERT INTO public.users (id, email, role, name, created_at) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'agent@demo.com',
  'agent',
  'Travel Agent Demo',
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'traveler@demo.com',
  'traveler',
  'Traveler Demo',
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333',
  'vendor@demo.com',
  'vendor',
  'Vendor Demo',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  name = EXCLUDED.name;
