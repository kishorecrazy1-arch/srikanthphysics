# Topics & Practice Sections Setup Guide

## Issue: No Topics Showing / Daily Practice & Practice Bank Empty

The "Daily Practice", "Practice Bank", and "Homework" sections are available once you:
1. Set up topics in your Supabase database
2. Update RLS policies to allow test mode access

## Quick Setup Steps

### Step 1: Run the SQL Setup Script

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Open the file `SUPABASE_TOPICS_SETUP.sql` from your project
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **Run** to execute

This will:
- Create the `topics` and `subtopics` tables (if they don't exist)
- Set up public read access (for test mode)
- Insert 8 AP Physics 1 topics with all subtopics
- Verify the setup

### Step 2: Verify Topics Are Created

After running the SQL, you should see:
- **8 Topics** in the `topics` table
- **Multiple Subtopics** for each topic

You can verify by running this query in SQL Editor:
```sql
SELECT 
  t.name as topic_name,
  COUNT(s.id) as subtopic_count
FROM public.topics t
LEFT JOIN public.subtopics s ON s.topic_id = t.id
GROUP BY t.id, t.name
ORDER BY t.display_order;
```

### Step 3: Refresh Your App

1. Go back to your app (`http://localhost:5175`)
2. Navigate to **AP Physics 1** topic selection page
3. You should now see all 8 topics listed

### Step 4: Access Practice Sections

Once topics are visible:

1. **Click on any topic** (e.g., "Kinematics")
2. You'll see three tabs:
   - **Daily Practice** 📍 - Daily generated questions
   - **Homework** 📚 - Homework assignments
   - **Practice Bank** ⚡ - Practice questions bank

3. **Click on a subtopic** from the topic selection page to jump directly to that subtopic's practice

## Practice Sections Explained

### 📍 Daily Practice
- **Location**: Inside each topic → "Daily Practice" tab
- **Content**: AI-generated questions for today
- **Levels**: Level 1, 2, 3 (selectable via difficulty selector)
- **Features**: 
  - Daily questions generated automatically
  - Progress tracking
  - Timed practice

### ⚡ Practice Bank
- **Location**: Inside each topic → "Practice Bank" tab
- **Content**: Large bank of practice questions
- **Features**:
  - Filter by difficulty, subtopic, status
  - Normal mode, Club mode, Random mode, Exam Simulator
  - Unlimited practice

### 📚 Homework
- **Location**: Inside each topic → "Homework" tab
- **Content**: Homework assignments and uploads
- **Features**:
  - View assigned homework
  - Upload homework files
  - Track completion

## Troubleshooting

### "No Topics Available" Message

**Solution**: 
1. Make sure you ran the SQL setup script
2. Check browser console for errors
3. Verify RLS policies allow public read:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('topics', 'subtopics');
   ```

### Topics Show But No Questions

**Solution**:
- Questions are generated on-demand when you access Daily Practice
- Practice Bank questions are also generated automatically
- Wait a moment for AI generation to complete

### Test Mode Not Working

**Solution**:
- The SQL script now includes public read policies
- Test mode users can now access topics without authentication
- If still not working, disable and re-enable test mode

## Next Steps

After topics are set up:
1. Navigate to any topic
2. Select a subtopic
3. Choose a difficulty level (Level 1, 2, or 3)
4. Click on "Daily Practice", "Homework", or "Practice Bank" tabs
5. Start practicing!

## Database Tables Required

Make sure these tables exist:
- `topics` - Main topics/chapters
- `subtopics` - Subtopics within each topic
- `questions` - Generated questions (created automatically)
- `user_answers` - User answer tracking
- `topic_progress` - User progress per topic

All tables are created automatically by the SQL script!

























