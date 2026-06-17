-- Where We Landing — Neon DB Schema
-- Run this in your Neon SQL editor (console.neon.tech → your project → SQL editor)

-- =====================
-- PROFILES
-- id = Google OAuth user ID (string from NextAuth token.sub)
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  image TEXT,
  stage_of_life TEXT,
  neighborhood TEXT,
  travel_radius TEXT[],
  goals TEXT,
  friend_type TEXT[],
  interests TEXT[],
  availability_days TEXT[],
  availability_time TEXT[],
  role TEXT DEFAULT 'user',        -- user | admin
  status TEXT DEFAULT 'active',    -- active | kicked | paused
  strike_count INTEGER DEFAULT 0,
  kicked_at TIMESTAMPTZ,
  kick_reason TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- APPLICANTS
-- =====================
CREATE TABLE IF NOT EXISTS applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  stage_of_life TEXT,
  neighborhood TEXT,
  home_lat DOUBLE PRECISION,
  home_lng DOUBLE PRECISION,
  travel_radius_km REAL,
  travel_radius TEXT[],
  friend_type TEXT[],
  goals TEXT,
  availability_days TEXT[],
  availability_detail TEXT,
  madison_proof TEXT,
  proof_link TEXT,
  status TEXT DEFAULT 'pending',   -- pending | approved | rejected
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- KICKED PROFILES (archive)
-- =====================
CREATE TABLE IF NOT EXISTS kicked_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_user_id TEXT,
  email TEXT,
  name TEXT,
  kick_reason TEXT,
  strike_history JSONB,
  kicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- GROUPS
-- =====================
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  status TEXT DEFAULT 'active',    -- active | inactive | dissolved
  email_thread_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  dissolved_at TIMESTAMPTZ
);

-- =====================
-- GROUP MEMBERS
-- =====================
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(group_id, user_id)
);

-- =====================
-- GROUP EVENTS
-- =====================
CREATE TABLE IF NOT EXISTS group_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  actor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_events_group_id ON group_events(group_id);
