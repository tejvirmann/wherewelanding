-- Where We Landing v2 Schema
-- Run this in your Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- APPLICANTS
-- =====================
CREATE TABLE public.applicants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  stage_of_life TEXT,
  neighborhood TEXT,
  travel_radius TEXT[],
  goals TEXT,
  friend_type TEXT[],
  availability_days TEXT[],
  availability_time TEXT[],
  madison_proof TEXT,
  status TEXT DEFAULT 'pending', -- pending | approved | rejected
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
-- Anon can insert (submit form), service role bypasses RLS for admin reads
CREATE POLICY "Anyone can submit application"
  ON public.applicants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =====================
-- PROFILES (approved users)
-- =====================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  stage_of_life TEXT,
  neighborhood TEXT,
  travel_radius TEXT[],
  goals TEXT,
  friend_type TEXT[],
  interests TEXT[],
  availability_days TEXT[],
  availability_time TEXT[],
  role TEXT DEFAULT 'user', -- user | admin
  status TEXT DEFAULT 'active', -- active | kicked | paused
  strike_count INTEGER DEFAULT 0,
  kicked_at TIMESTAMPTZ,
  kick_reason TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all active profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- =====================
-- KICKED PROFILES (archive)
-- =====================
CREATE TABLE public.kicked_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_user_id UUID,
  email TEXT,
  name TEXT,
  kick_reason TEXT,
  strike_history JSONB,
  kicked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kicked_profiles ENABLE ROW LEVEL SECURITY;
-- No direct client access; admin API uses service role key

-- =====================
-- GROUPS
-- =====================
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  status TEXT DEFAULT 'active', -- active | inactive | dissolved
  email_thread_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  dissolved_at TIMESTAMPTZ
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- =====================
-- GROUP MEMBERS
-- =====================
CREATE TABLE public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Policies that reference group_members added after both tables exist
CREATE POLICY "Authenticated users can read their groups"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can see members of their groups"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

-- =====================
-- GROUP EVENTS (timeline log)
-- =====================
CREATE TABLE public.group_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- email_sent | check_in | admin_note | ai_message | member_left | dissolved
  content TEXT,
  actor TEXT, -- 'system' | 'ai' | 'admin' | user_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read events for their groups"
  ON public.group_events FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- HELPER: increment strike count
-- =====================
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
  SELECT x + 1;
$$ LANGUAGE sql;

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_applicants_status ON public.applicants(status);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_neighborhood ON public.profiles(neighborhood);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_events_group_id ON public.group_events(group_id);
