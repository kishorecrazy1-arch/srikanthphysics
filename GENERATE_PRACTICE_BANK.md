# Practice Bank Generation Guide

## Overview

The Practice Bank contains **5 pre-generated questions** for each combination of:
- **Topic** (e.g., Kinematics, Force and Motion)
- **Subtopic** (e.g., Scalars and Vectors, Newton's Third Law)
- **Difficulty Level** (Foundation, Intermediate, Advanced)

**Total Questions**: ~8 topics × 4 subtopics × 3 levels × 5 questions = **~480 questions**

## How Practice Bank Works

### 1. **Automatic Generation**
- Questions are generated on-demand when first accessed
- Uses AI (OpenAI) if API key is available
- Falls back to sample questions if AI unavailable

### 2. **Storage**
- Questions stored in `questions` table
- `segment_type = 'practice_bank'` identifies practice questions
- `generated_date = null` (practice questions don't expire)

### 3. **Access**
- Select topic → Select difficulty level → Click "Practice Bank"
- Questions filtered by topic, subtopic (if selected), and difficulty

## Manual Generation Script

To generate all practice bank questions at once:

### Option 1: Via Browser Console

1. Open your app in browser
2. Open Developer Console (F12)
3. Run:
```javascript
import { PracticeBankGenerator } from './src/services/practiceBankGenerator';
const generator = new PracticeBankGenerator();
await generator.generateAllPracticeBanks();
```

### Option 2: Create a Page Component

Create a temporary admin page to trigger generation:

```typescript
// src/pages/GeneratePracticeBank.tsx
import { PracticeBankGenerator } from '../services/practiceBankGenerator';

export function GeneratePracticeBank() {
  const handleGenerate = async () => {
    const generator = new PracticeBankGenerator();
    await generator.generateAllPracticeBanks();
    alert('Practice bank generation complete!');
  };

  return (
    <div>
      <button onClick={handleGenerate}>
        Generate All Practice Bank Questions
      </button>
    </div>
  );
}
```

## Database Structure

Practice bank questions use:
- `segment_type = 'practice_bank'`
- `difficulty_level = 'Foundation' | 'Intermediate' | 'Advanced'`
- `topic_id` and `subtopic_id` for filtering
- `generated_date = null` (no expiration)

## Features

✅ **5 questions per combination** (topic/subtopic/difficulty)
✅ **AI-generated** (if API key available)
✅ **Fallback to samples** if AI unavailable
✅ **Filtered by difficulty** automatically
✅ **Cached** - generates once, reuses forever
✅ **No expiration** - practice questions don't reset daily

## Testing

1. Go to any topic
2. Select difficulty level (Level 1, 2, or 3)
3. Click "Practice Bank" tab
4. Should see 5 questions for current topic/subtopic/difficulty
5. Questions should be different for each level

## Troubleshooting

**No questions showing?**
- Check console for generation errors
- Verify API key is set (for AI generation)
- Check database has `questions` table with `segment_type` column

**Same questions for all levels?**
- Verify `difficulty_level` filter is working
- Check questions have correct `difficulty_level` values

**Questions not generating?**
- Check OpenAI API key in `.env`
- Verify network connectivity
- Check console for specific errors




















