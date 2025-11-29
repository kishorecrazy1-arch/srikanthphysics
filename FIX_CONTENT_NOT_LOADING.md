# Fix: Content Not Loading / Stuck on Loading Spinner

## Current Issue
You can see the topic page with level selection and tabs, but:
- Content isn't loading
- Loading spinner is stuck
- Practice sections aren't appearing

## Quick Checks

### Step 1: Open Browser Console
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Look for any error messages (red text)
4. Share what errors you see

### Step 2: Check Network Requests
1. In DevTools, go to **Network** tab
2. Refresh the page (`Ctrl+Shift+R`)
3. Look for failed requests (red status codes)
4. Check requests to Supabase

### Step 3: Verify Database Tables
Run this in Supabase SQL Editor:

```sql
-- Check if subtopics exist for this topic
SELECT COUNT(*) as subtopic_count 
FROM public.subtopics 
WHERE topic_id = 'YOUR_TOPIC_ID_HERE';
```

Replace `YOUR_TOPIC_ID_HERE` with the actual topic ID from the URL.

## Common Issues & Fixes

### Issue 1: Subtopics Table is Empty
**Symptom:** Page loads but shows no subtopic in the title

**Fix:** Run in Supabase SQL Editor:
```sql
-- Insert subtopics for Kinematics (if missing)
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Scalars and Vectors in One Dimension', 1 
FROM public.topics WHERE name = 'Kinematics'
ON CONFLICT DO NOTHING;
```

Or run `DIAGNOSE_AND_FIX.sql` to set up all subtopics.

### Issue 2: RLS Policies Blocking
**Symptom:** Console shows permission errors

**Fix:** Run in Supabase SQL Editor:
```sql
-- Ensure public read access for subtopics
DROP POLICY IF EXISTS "Subtopics are viewable by everyone" ON public.subtopics;
CREATE POLICY "Subtopics are viewable by everyone"
  ON public.subtopics
  FOR SELECT
  USING (true);
```

### Issue 3: Stuck Loading State
**Symptom:** Loading spinner never disappears

**Fix:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Check console for JavaScript errors

### Issue 4: Practice Sections Not Showing
**Symptom:** No practice cards appear

**This is normal!** The practice sections should show three cards:
- "Strengthen Your Basics" - Click this to load MCQ questions
- "AI Motion Simulator" - Navigates to simulator
- "Daily Questions" - Click this to load Q&A questions

**The cards should be visible immediately** - you don't need to wait for loading.

## What Should Appear

When the page loads successfully, you should see:

1. ✅ **Header** - Topic name, subtopic name, progress stats
2. ✅ **Level Selector** - Level 1, 2, 3 buttons (for Homework/Practice Bank)
3. ✅ **Tabs** - Daily Practice, Homework, Practice Bank
4. ✅ **Practice Section Cards** - 3 cards in a grid:
   - Strengthen Your Basics (green)
   - AI Motion Simulator (cyan)
   - Daily Questions (blue)
5. ✅ **Stats Cards** - Completed Today, Accuracy, Avg Time

## If Practice Cards Don't Show

The practice cards are in `BasicsSection` component. If they don't appear:

1. Check browser console for errors
2. Verify the component is rendering
3. Check if there's a JavaScript error preventing render

## Next Steps

1. **Check browser console** and share any errors
2. **Run the SQL checks** above
3. **Try hard refresh** (`Ctrl+Shift+R`)
4. **Clear browser cache** and try again

---

**Please check your browser console and share any error messages you see!** 🔍

