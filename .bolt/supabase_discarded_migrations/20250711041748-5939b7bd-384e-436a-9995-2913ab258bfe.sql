
-- Create users table for profiles
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('agent', 'traveler', 'vendor')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  traveler_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  preferences TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'shared', 'confirmed', 'modified')),
  days JSONB NOT NULL DEFAULT '[]',
  share_token UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create negotiations table
CREATE TABLE public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'accepted', 'rejected')),
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for itineraries table
CREATE POLICY "Agents can view their own itineraries" ON public.itineraries
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Travelers can view shared itineraries" ON public.itineraries
  FOR SELECT USING (traveler_id = auth.uid() OR status = 'shared');

CREATE POLICY "Agents can insert their own itineraries" ON public.itineraries
  FOR INSERT WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own itineraries" ON public.itineraries
  FOR UPDATE USING (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own itineraries" ON public.itineraries
  FOR DELETE USING (agent_id = auth.uid());

-- RLS Policies for negotiations table
CREATE POLICY "Agents can view their negotiations" ON public.negotiations
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Vendors can view their negotiations" ON public.negotiations
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Agents can insert negotiations" ON public.negotiations
  FOR INSERT WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents and vendors can update negotiations" ON public.negotiations
  FOR UPDATE USING (agent_id = auth.uid() OR vendor_id = auth.uid());

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'traveler'),
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_itineraries_agent_id ON public.itineraries(agent_id);
CREATE INDEX idx_itineraries_traveler_id ON public.itineraries(traveler_id);
CREATE INDEX idx_itineraries_share_token ON public.itineraries(share_token);
CREATE INDEX idx_negotiations_agent_id ON public.negotiations(agent_id);
CREATE INDEX idx_negotiations_vendor_id ON public.negotiations(vendor_id);
CREATE INDEX idx_negotiations_itinerary_id ON public.negotiations(itinerary_id);
