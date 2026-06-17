-- Migration 001: add location, travel radius, availability detail, and proof columns to applicants
-- Run this in Supabase SQL editor when your project is unpaused

ALTER TABLE public.applicants
  ADD COLUMN IF NOT EXISTS home_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS home_lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS travel_radius_km REAL,
  ADD COLUMN IF NOT EXISTS availability_detail TEXT,
  ADD COLUMN IF NOT EXISTS proof_link TEXT;
