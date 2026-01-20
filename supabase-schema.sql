-- Where We Landing - Supabase Database Schema
-- This schema defines all tables needed for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- USERS TABLE (extends Supabase auth.users)
-- ==============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  city TEXT,
  zipcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ==============================================
-- SQUADS (formerly groups) TABLE
-- ==============================================
CREATE TABLE public.squads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 0,
  active_member_count INTEGER DEFAULT 0, -- Members active in last 2 weeks
  last_active_at TIMESTAMPTZ,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active squads" 
  ON public.squads FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create squads" 
  ON public.squads FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Squad creators can update their squads" 
  ON public.squads FOR UPDATE 
  USING (auth.uid() = creator_id);

-- ==============================================
-- SQUAD MEMBERS (join table)
-- ==============================================
CREATE TABLE public.squad_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member', -- 'creator', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view squad members" 
  ON public.squad_members FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can join squads" 
  ON public.squad_members FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave squads" 
  ON public.squad_members FOR DELETE 
  USING (auth.uid() = user_id);

-- ==============================================
-- PINS (user landing locations)
-- ==============================================
CREATE TABLE public.pins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name TEXT, -- e.g., "Starbucks Downtown"
  meeting_time TIMESTAMPTZ, -- When they plan to be there
  expires_at TIMESTAMPTZ NOT NULL, -- TTL - 2 weeks from creation
  is_active BOOLEAN DEFAULT true,
  notified_before_expiry BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pins" 
  ON public.pins FOR SELECT 
  USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Authenticated users can create pins" 
  ON public.pins FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pins" 
  ON public.pins FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pins" 
  ON public.pins FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for geospatial queries
CREATE INDEX idx_pins_location ON public.pins(latitude, longitude);
CREATE INDEX idx_pins_expires_at ON public.pins(expires_at);
CREATE INDEX idx_pins_squad_id ON public.pins(squad_id);

-- ==============================================
-- PIN RENEWALS (track when users renew/revive pins)
-- ==============================================
CREATE TABLE public.pin_renewals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  renewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pin_renewals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pin renewals" 
  ON public.pin_renewals FOR SELECT 
  USING (auth.uid() = user_id);

-- ==============================================
-- COMMUNITY BOARD POSTS
-- ==============================================
CREATE TABLE public.board_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  city TEXT NOT NULL, -- Filter posts by city
  title TEXT NOT NULL,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active board posts" 
  ON public.board_posts FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.board_posts FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" 
  ON public.board_posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" 
  ON public.board_posts FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for city filtering
CREATE INDEX idx_board_posts_city ON public.board_posts(city);
CREATE INDEX idx_board_posts_created_at ON public.board_posts(created_at DESC);

-- ==============================================
-- COMMUNITY MAP (aggregated view of all squads)
-- This is a VIEW, not a table - it combines data from all squads
-- ==============================================
CREATE OR REPLACE VIEW public.community_map AS
SELECT 
  p.id AS pin_id,
  p.squad_id,
  s.name AS squad_name,
  s.city,
  p.user_id,
  prof.display_name,
  p.latitude,
  p.longitude,
  p.location_name,
  p.meeting_time,
  p.created_at,
  p.expires_at
FROM public.pins p
JOIN public.squads s ON p.squad_id = s.id
JOIN public.profiles prof ON p.user_id = prof.id
WHERE p.is_active = true 
  AND p.expires_at > NOW()
  AND s.is_active = true
ORDER BY p.created_at DESC;

-- ==============================================
-- FUNCTIONS
-- ==============================================

-- Function to update squad member counts
CREATE OR REPLACE FUNCTION update_squad_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total member count
  UPDATE public.squads
  SET member_count = (
    SELECT COUNT(*) FROM public.squad_members WHERE squad_id = NEW.squad_id
  )
  WHERE id = NEW.squad_id;
  
  -- Update active member count (members with pins in last 2 weeks)
  UPDATE public.squads
  SET active_member_count = (
    SELECT COUNT(DISTINCT user_id) 
    FROM public.pins 
    WHERE squad_id = NEW.squad_id 
      AND created_at > NOW() - INTERVAL '2 weeks'
      AND is_active = true
  )
  WHERE id = NEW.squad_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update counts when squad members change
CREATE TRIGGER update_squad_counts_trigger
AFTER INSERT OR DELETE ON public.squad_members
FOR EACH ROW
EXECUTE FUNCTION update_squad_counts();

-- Function to expire old pins automatically
CREATE OR REPLACE FUNCTION expire_old_pins()
RETURNS void AS $$
BEGIN
  UPDATE public.pins
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate squad streaks
CREATE OR REPLACE FUNCTION calculate_squad_streaks()
RETURNS void AS $$
BEGIN
  -- Reset streaks for squads where most members' pins died
  UPDATE public.squads s
  SET streak_days = 0
  WHERE (
    SELECT COUNT(*) 
    FROM public.pins p 
    WHERE p.squad_id = s.id 
      AND p.is_active = false 
      AND p.expires_at > NOW() - INTERVAL '1 week'
  ) > (s.member_count / 2);
  
  -- Increment streaks for active squads
  UPDATE public.squads
  SET streak_days = streak_days + 1
  WHERE active_member_count > (member_count / 2);
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- SCHEDULED JOBS (using pg_cron or similar)
-- ==============================================
-- Note: These would be set up in Supabase dashboard or via pg_cron
-- Example:
-- SELECT cron.schedule('expire-pins', '0 * * * *', 'SELECT expire_old_pins()');
-- SELECT cron.schedule('update-streaks', '0 0 * * *', 'SELECT calculate_squad_streaks()');

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================
CREATE INDEX idx_squad_members_user_id ON public.squad_members(user_id);
CREATE INDEX idx_squad_members_squad_id ON public.squad_members(squad_id);
CREATE INDEX idx_squads_city ON public.squads(city);
CREATE INDEX idx_squads_is_active ON public.squads(is_active);
CREATE INDEX idx_pins_user_id ON public.pins(user_id);
CREATE INDEX idx_pins_is_active ON public.pins(is_active);
