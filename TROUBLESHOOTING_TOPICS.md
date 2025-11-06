# Troubleshooting: Topics Not Loading / Daily Practice Tabs Not Showing

## Issue Overview

**Problem**: Topics not showing on AP Physics 1 page, so Daily Practice tabs are inaccessible.

**Why tabs aren't showing**: Daily Practice, Homework, and Practice Bank tabs are on the **Topic Detail page**, which only appears **after clicking a topic**. If topics don't load, you can't access the tabs.

## Quick Fix Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors when the page loads
4. Check for messages like:
   - "Topics loading error:..."
   - "Failed to load topics..."
   - Any Supabase connection errors

### Step 2: Verify Database Tables Exist

Run this in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('topics', 'subtopics')
ORDER BY table_name;
```

You should see both `topics` and `subtopics` tables.

### Step 3: Verify Topics Were Inserted

Run this in Supabase SQL Editor:

```sql
-- Check topics count
SELECT COUNT(*) as topic_count FROM public.topics;
SELECT COUNT(*) as subtopic_count FROM public.subtopics;

-- List all topics
SELECT id, name, display_order, color 
FROM public.topics 
ORDER BY display_order;
```

You should see 8 topics.

### Step 4: Check RLS Policies

Run this in Supabase SQL Editor:

```sql
-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('topics', 'subtopics');
```

You should see policies that allow SELECT for everyone.

### Step 5: Test Direct Query

Run this in Supabase SQL Editor to test if you can read topics:

```sql
-- Test query (should work without auth)
SELECT * FROM public.topics ORDER BY display_order LIMIT 5;
```

If this fails, there's an RLS policy issue.

## Common Issues & Solutions

### Issue 1: RLS Policies Blocking Access

**Solution**: Run this in Supabase SQL Editor:

```sql
-- Ensure public read access
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Subtopics are viewable by everyone" ON public.subtopics;
CREATE POLICY "Subtopics are viewable by everyone"
  ON public.subtopics
  FOR SELECT
  USING (true);
```

### Issue 2: Topics Table Empty

**Solution**: Run the INSERT statements from `COMPLETE_SUPABASE_SETUP.sql` again:

```sql
-- Re-insert topics if they don't exist
INSERT INTO public.topics (name, icon, description, display_order, color) VALUES
('Kinematics', '📏', 'Motion, velocity, acceleration, graphs', 1, '#3b82f6'),
('Force and Translational Dynamics', '⚖️', 'Forces, Newton''s laws, free-body diagrams', 2, '#8b5cf6'),
('Work, Energy, and Power', '⚡', 'Kinetic energy, potential energy, conservation, power', 3, '#10b981'),
('Linear Momentum', '🚀', 'Linear momentum, collisions, impulse', 4, '#f59e0b'),
('Torque and Rotational Dynamics', '🔄', 'Rotational motion, torque, rotational inertia', 5, '#ef4444'),
('Energy and Momentum of Rotating Systems', '🌌', 'Rotational energy, angular momentum, conservation', 6, '#ec4899'),
('Oscillations', '📊', 'Simple harmonic motion, frequency, period', 7, '#06b6d4'),
('Fluids', '💧', 'Pressure, density, fluids and Newton''s laws, conservation', 8, '#14b8a6')
ON CONFLICT DO NOTHING;
```

### Issue 3: Supabase Connection Issue

**Solution**: Check your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Verify these are correct in Supabase Dashboard → Settings → API.

### Issue 4: Test Mode Not Working

**Solution**: Enable test mode from login page, or check if it's active:

```javascript
// In browser console
console.log('Test mode:', localStorage.getItem('testMode'));
```

## How to Access Daily Practice Tabs

Once topics are loading:

1. **Go to AP Physics 1 page** (`/ap-physics`)
2. **See list of topics** (Kinematics, Forces, etc.)
3. **Click on any topic** (e.g., "Kinematics")
4. **You'll see the Topic Detail page** with:
   - Difficulty Level Selector (Level 1, 2, 3)
   - **Daily Practice** tab (green)
   - **Homework** tab (orange)
   - **Practice Bank** tab (blue)
5. **Click "Daily Practice" tab** to start!

## Flow Diagram

```
AP Physics 1 Page (TopicSelection)
    ↓
[Shows list of topics]
    ↓
User clicks "Kinematics" topic
    ↓
Topic Detail Page (TopicDetail)
    ↓
[Shows tabs: Daily Practice | Homework | Practice Bank]
    ↓
User clicks "Daily Practice" tab
    ↓
BasicsSection component loads
    ↓
Questions generated/displayed
```

## Debug Checklist

- [ ] Topics table exists in Supabase
- [ ] Topics table has 8 rows
- [ ] RLS policies allow public SELECT
- [ ] Browser console shows no errors
- [ ] Supabase URL and key are correct
- [ ] Page refreshes after running SQL
- [ ] Test mode is enabled (if not logged in)

## Still Not Working?

1. **Clear browser cache** and refresh
2. **Check Network tab** in DevTools for failed requests
3. **Run verification queries** in Supabase SQL Editor
4. **Check Supabase logs** in Dashboard → Logs

The most common issue is RLS policies blocking access. Make sure the policies allow public read access!

