# Where We Landing - Database Schema

This document explains the Supabase database structure for the application.

## Setup Instructions

1. Create a new Supabase project
2. Run the SQL in `supabase-schema.sql` in the Supabase SQL Editor
3. Enable Row Level Security (RLS) policies are included
4. Set up authentication (Email, Google, etc.)

## Tables Overview

### 1. `profiles`
Extends Supabase's built-in `auth.users` table with additional user information.

**Fields:**
- `id` - UUID (references auth.users)
- `email` - User's email
- `display_name` - Public display name
- `city` - User's city
- `zipcode` - User's zipcode
- `created_at`, `updated_at` - Timestamps

**Usage:** Store user profile data, preferences, and location information.

---

### 2. `squads` (formerly groups)
Represents a community/group where people can land together.

**Fields:**
- `id` - UUID
- `name` - Squad name (e.g., "Madison Software Squad")
- `description` - What the squad is about
- `city` - City where the squad operates
- `creator_id` - User who created the squad
- `is_active` - Whether squad is active
- `member_count` - Total members
- `active_member_count` - Members with pins in last 2 weeks
- `last_active_at` - Last activity timestamp
- `streak_days` - Consecutive days with >50% members active
- `created_at`, `updated_at` - Timestamps

**Usage:** Each squad has its own map where members can drop pins.

---

### 3. `squad_members`
Join table connecting users to squads.

**Fields:**
- `id` - UUID
- `squad_id` - References squads
- `user_id` - References profiles
- `role` - 'creator', 'admin', or 'member'
- `joined_at` - When user joined
- `last_active_at` - Last activity in squad

**Usage:** Track squad membership and roles.

---

### 4. `pins`
User landing locations on the map (with TTL).

**Fields:**
- `id` - UUID
- `squad_id` - Which squad this pin belongs to
- `user_id` - Who dropped the pin
- `latitude`, `longitude` - GPS coordinates
- `location_name` - Optional name (e.g., "Starbucks Downtown")
- `meeting_time` - When they plan to be there
- `expires_at` - When pin expires (2 weeks from creation)
- `is_active` - Whether pin is active
- `notified_before_expiry` - Whether we sent reminder email
- `created_at`, `updated_at` - Timestamps

**Usage:** Core feature - users drop pins on the map. Pins expire after 2 weeks unless renewed.

**Key Logic:**
- Pins auto-expire after 2 weeks (`expires_at`)
- Email notification sent 1 day before expiry
- User can renew/revive pins before expiry

---

### 5. `pin_renewals`
Tracks when users renew/revive their pins.

**Fields:**
- `id` - UUID
- `pin_id` - References pins
- `user_id` - Who renewed it
- `renewed_at` - When renewed

**Usage:** Track pin revival history, useful for analytics.

---

### 6. `board_posts`
Community board posts/questions.

**Fields:**
- `id` - UUID
- `user_id` - Who posted
- `city` - Filter posts by city
- `title` - Post title
- `content` - Post content/body
- `is_active` - Whether post is visible
- `view_count` - Number of views
- `created_at`, `updated_at` - Timestamps

**Usage:** Community board where users can ask questions, start discussions.

---

### 7. `community_map` (VIEW)
Not a table - a SQL VIEW that aggregates all active pins from all squads.

**Returns:**
- All active pins across all squads
- Filtered by city
- Shows squad name, user display name, location, etc.

**Usage:** Powers the "community map" feature showing all landing spots in a city across all squads.

---

## Key Features Explained

### Pin TTL (Time To Live)
- Pins expire 2 weeks after creation
- Users get email notification 1 day before expiry
- Can renew pin to extend for another 2 weeks
- Expired pins become `is_active = false`

### Squad Streaks
- If >50% of squad members keep pins active, streak continues
- If most pins die in a week, streak resets to 0
- Encourages consistent participation

### Active Member Count
- Updated automatically via triggers
- Counts members with active pins in last 2 weeks
- Displayed on squad cards

### Community Map Data
- Combines pins from all squads in a city
- Real-time view of where everyone is landing
- Filtered by selected city/location

---

## Database Functions

### `update_squad_counts()`
Automatically updates `member_count` and `active_member_count` when members join/leave or pins change.

### `expire_old_pins()`
Marks pins as inactive when they pass `expires_at` timestamp.
Should run hourly via cron job.

### `calculate_squad_streaks()`
Updates squad streak counts based on member activity.
Should run daily via cron job.

---

## Scheduled Jobs (Cron)

Set these up in Supabase or using pg_cron:

```sql
-- Expire old pins every hour
SELECT cron.schedule('expire-pins', '0 * * * *', 'SELECT expire_old_pins()');

-- Update squad streaks daily at midnight
SELECT cron.schedule('update-streaks', '0 0 * * *', 'SELECT calculate_squad_streaks()');
```

---

## Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for backend)
```

---

## Example Queries

### Get all active squads in a city
```sql
SELECT * FROM squads 
WHERE city = 'Madison, WI' 
  AND is_active = true
ORDER BY active_member_count DESC;
```

### Get community map for a city
```sql
SELECT * FROM community_map 
WHERE city = 'Madison, WI'
ORDER BY created_at DESC;
```

### Get user's active pins
```sql
SELECT * FROM pins 
WHERE user_id = 'user-uuid' 
  AND is_active = true 
  AND expires_at > NOW();
```

### Get pins expiring soon (for email notifications)
```sql
SELECT * FROM pins 
WHERE expires_at BETWEEN NOW() AND NOW() + INTERVAL '1 day'
  AND is_active = true
  AND notified_before_expiry = false;
```
