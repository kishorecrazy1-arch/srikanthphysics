# Fix: Missing 'ai_generated' Column Error

## 🔴 Error Message
```
Could not find the 'ai_generated' column of 'questions' in the schema cache
```

## ✅ Quick Fix

### Step 1: Run SQL in Supabase
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and run this SQL:

```sql
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Verify column was added
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'questions' 
  AND column_name = 'ai_generated';
```

### Step 2: Refresh Your App
1. Go back to your app
2. **Hard refresh**: `Ctrl+Shift+R`
3. Click "Get 10 Questions" again

The error should be fixed!

---

**The `ai_generated` column tracks whether questions were AI-generated or manually created.**











