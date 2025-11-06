# Practice Bank Setup - Complete Guide

## ✅ What's Been Created

### 1. **Practice Bank Generator Service** (`src/services/practiceBankGenerator.ts`)
- Generates 5 questions per (topic, subtopic, difficulty) combination
- Uses AI if API key available, falls back to samples
- Checks for existing questions before generating
- Batch generation for all topics

### 2. **Updated Practice Section** (`src/components/topics/PracticeSection.tsx`)
- Loads questions from `practice_bank` segment
- Filters by difficulty level automatically
- Generates questions on-demand if missing
- Supports all practice modes (normal, club, random)

### 3. **Admin Page** (`src/pages/AdminGeneratePracticeBank.tsx`)
- Bulk generation interface
- One-click generation for all topics
- Progress tracking and status updates

## 📋 How to Use

### Option 1: Automatic Generation (Recommended)
1. Go to any topic
2. Select difficulty level (Level 1, 2, or 3)
3. Click "Practice Bank" tab
4. Questions generate automatically on first access

### Option 2: Bulk Generation
1. Navigate to: `http://localhost:5175/admin/generate-practice-bank`
2. Click "Generate All Practice Bank Questions"
3. Wait for completion (may take several minutes)
4. Questions are now available in Practice Bank mode

## 🗄️ Database Structure

Practice bank questions are stored with:
- `segment_type = 'practice_bank'` (identifies practice questions)
- `difficulty_level = 'Foundation' | 'Intermediate' | 'Advanced'`
- `topic_id` and `subtopic_id` for filtering
- `generated_date = null` (no expiration)

## 📊 Question Count

**Per combination**: 5 questions
**Total estimated**: ~480 questions
- 8 topics × 4 subtopics × 3 levels × 5 = 480

## 🔍 Features

✅ **5 questions per combination** - Exactly as requested
✅ **Difficulty-specific** - Different questions for Level 1, 2, 3
✅ **Topic & Subtopic specific** - Organized by topic structure
✅ **AI-generated** - Uses OpenAI if available
✅ **Auto-cached** - Generates once, reuses forever
✅ **On-demand generation** - Creates questions when needed
✅ **Bulk generation** - Admin page for batch creation

## 🧪 Testing

1. **Test Practice Bank Mode**:
   - Go to any topic (e.g., Kinematics)
   - Select Level 1 → Click "Practice Bank"
   - Should see 5 Foundation questions
   - Select Level 3 → Should see 5 Advanced questions (different)

2. **Test Bulk Generation**:
   - Visit `/admin/generate-practice-bank`
   - Click generate button
   - Check console for progress
   - Verify questions in database

3. **Verify Questions**:
   - Check Supabase: `SELECT * FROM questions WHERE segment_type = 'practice_bank'`
   - Should see questions grouped by topic/subtopic/difficulty

## 🐛 Troubleshooting

**No questions showing?**
- Check API key is set (for AI generation)
- Verify `questions` table exists
- Check console for errors

**Same questions for all levels?**
- Verify `difficulty_level` filter in query
- Check questions have correct `difficulty_level` values

**Generation taking too long?**
- This is normal for bulk generation
- Check console for progress
- Questions generate with 1-second delay between batches

## 📝 Next Steps

1. **Test Practice Bank** - Verify questions load correctly
2. **Generate Questions** - Use admin page or automatic generation
3. **Verify Difficulty** - Ensure Level 1, 2, 3 show different questions
4. **Test All Topics** - Check multiple topics work correctly

The system is ready! Practice Bank now generates 5 questions for each topic/subtopic/difficulty combination.

