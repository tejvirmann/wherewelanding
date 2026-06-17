-- Run in Supabase SQL editor
CREATE OR REPLACE FUNCTION get_approved_profiles()
RETURNS TABLE (
  id UUID,
  name TEXT,
  stage_of_life TEXT,
  neighborhood TEXT,
  goals TEXT,
  friend_type TEXT[],
  availability_days TEXT[],
  home_lat DOUBLE PRECISION,
  home_lng DOUBLE PRECISION,
  travel_radius_km REAL
) AS $$
  SELECT
    p.id,
    p.name,
    p.stage_of_life,
    a.neighborhood,
    a.goals,
    a.friend_type,
    a.availability_days,
    a.home_lat,
    a.home_lng,
    a.travel_radius_km
  FROM profiles p
  JOIN applicants a ON a.email = p.email
  WHERE p.status = 'active'
    AND a.status = 'approved'
    AND a.home_lat IS NOT NULL
$$ LANGUAGE sql SECURITY DEFINER;
