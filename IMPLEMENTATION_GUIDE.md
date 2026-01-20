# Implementation Guide for Where We Landing

## Current Status

✅ **Completed:**
- Renamed "groups" to "squads" throughout the app
- Removed "how does it work" and "what is where we landing" sections
- Removed "future ideas" section
- Added 3 CTA buttons: "add to community board", "create squad", "join squad"
- Created comprehensive Supabase database schema
- Location selector filters entire site by city

## Database Schema Files

1. **`supabase-schema.sql`** - Complete SQL schema to run in Supabase
2. **`DATABASE.md`** - Detailed documentation of all tables and usage

## Next Steps to Implement

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Set Up Supabase Config

Create `app/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Add to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Implement CTA Buttons

The three buttons on the home page need to be wired up:

#### "Add to Community Board" Button
- Opens modal/form to create a new board post
- Fields: title, content
- Saves to `board_posts` table with user's city

#### "Create Squad" Button
- Opens modal/form to create new squad
- Fields: name, description, city
- Creates entry in `squads` table
- Automatically adds creator to `squad_members`

#### "Join Squad" Button
- Shows list of available squads in user's city
- User selects squad to join
- Adds entry to `squad_members` table

### 4. Implement Authentication

Use Supabase Auth:

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### 5. Connect Community Board to Database

Update `app/page.js` community board section to fetch real posts:

```javascript
const [boardPosts, setBoardPosts] = useState([]);

useEffect(() => {
  async function fetchPosts() {
    const { data } = await supabase
      .from('board_posts')
      .select('*')
      .eq('city', location)
      .order('created_at', { ascending: false })
      .limit(3);
    setBoardPosts(data);
  }
  fetchPosts();
}, [location]);
```

### 6. Connect Community Map to Database

Update `app/components/MapPreview.js` to fetch real pins:

```javascript
const { data: pins } = await supabase
  .from('community_map')
  .select('*')
  .eq('city', location);
```

### 7. Implement Pin Dropping

When user clicks map:

```javascript
const { data, error } = await supabase
  .from('pins')
  .insert({
    squad_id: currentSquadId,
    user_id: user.id,
    latitude: clickedLat,
    longitude: clickedLng,
    meeting_time: selectedTime,
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks
  });
```

### 8. Set Up Scheduled Jobs

In Supabase dashboard, enable pg_cron and add:

```sql
-- Expire old pins hourly
SELECT cron.schedule('expire-pins', '0 * * * *', 'SELECT expire_old_pins()');

-- Update streaks daily
SELECT cron.schedule('update-streaks', '0 0 * * *', 'SELECT calculate_squad_streaks()');
```

### 9. Email Notifications (Future)

For pin expiry notifications:
- Use Supabase Edge Functions or
- Set up a cron job to check `pins` table for expiring pins
- Send emails via Resend, SendGrid, etc.

Query for expiring pins:
```sql
SELECT * FROM pins 
WHERE expires_at BETWEEN NOW() AND NOW() + INTERVAL '1 day'
  AND is_active = true
  AND notified_before_expiry = false;
```

## Quick Reference: Database Tables

### Core Tables
1. **`profiles`** - User data (extends auth.users)
2. **`squads`** - Groups/communities
3. **`squad_members`** - Who's in which squad
4. **`pins`** - Landing locations (expire after 2 weeks)
5. **`pin_renewals`** - Track pin revivals
6. **`board_posts`** - Community board posts

### View
- **`community_map`** - Aggregated view of all pins across all squads

## File Structure Recommendation

```
app/
├── lib/
│   ├── supabase.js          # Supabase client
│   └── hooks/
│       ├── useAuth.js       # Auth hook
│       ├── usePins.js       # Pins CRUD
│       └── useSquads.js     # Squads CRUD
├── components/
│   ├── modals/
│   │   ├── CreateSquadModal.js
│   │   ├── JoinSquadModal.js
│   │   └── CreatePostModal.js
│   └── auth/
│       ├── LoginForm.js
│       └── SignupForm.js
```

## Testing Checklist

- [ ] User can sign up / sign in
- [ ] User can create a squad
- [ ] User can join existing squad
- [ ] User can drop pin on map
- [ ] Pins appear on community map
- [ ] Pins filtered by selected city
- [ ] User can post to community board
- [ ] Board posts filtered by city
- [ ] Pin expires after 2 weeks (test with shorter duration)
- [ ] Squad member counts update correctly
- [ ] Active member count updates when pins are created

## Performance Considerations

1. Add indexes (already in schema)
2. Use Supabase realtime subscriptions for live updates
3. Cache squad lists client-side
4. Paginate community board posts
5. Use map clustering for many pins

## Security Notes

- Row Level Security (RLS) policies are included in schema
- Users can only edit their own pins/posts
- Anyone can view public squads and pins
- Admins can moderate squads they manage
