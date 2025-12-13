# How "Daily Questions" Card Works

## Overview

The "Daily Questions" card is a **quick access button** to view or load your daily practice questions. It's part of the **Daily Practice** mode.

## How It Works

### 1. **Display Logic**

The card shows:
- **"20 Questions Available"** - Default display when no questions loaded yet
- **"[X] Questions Available"** - Actual count when questions are loaded
- **"Click to view questions"** - If questions exist
- **"Click to load questions"** - If no questions exist

### 2. **Click Behavior**

When you click the "Daily Questions" card:

**Scenario A: Questions Already Loaded**
```javascript
if (questions.length > 0) {
  // Smoothly scroll to questions section
  questionsSection.scrollIntoView({ behavior: 'smooth' });
}
```
- Scrolls down to show the questions
- Questions are already displayed below

**Scenario B: No Questions Loaded**
```javascript
else {
  // Trigger question generation
  setLoading(true);
  loadDailyQuestions();
}
```
- Automatically loads/generates questions
- Uses the same system as "Strengthen Your Basics"
- Generates 10 questions for the selected difficulty level

### 3. **Question Source**

Daily Questions come from:
- **Segment Type**: `'basics'` (Daily Practice questions)
- **Difficulty**: Based on selected level (Level 1/2/3)
- **Date**: Today's date (`generated_date = today`)
- **Count**: 10 questions (from Daily Practice)

### 4. **Difference from Other Modes**

| Feature | Daily Questions | Practice Bank | Homework |
|---------|----------------|---------------|----------|
| **Source** | Daily Practice (`basics`) | Practice Bank (`practice_bank`) | Homework assignments |
| **Count** | 10 questions | 5 per subtopic | Varies |
| **Refresh** | Daily (new each day) | Permanent (cached) | Assignment-based |
| **Difficulty** | Based on selected level | Based on selected level | Varies |

## Code Flow

```
User clicks "Daily Questions" card
    ↓
Check: questions.length > 0?
    ↓
YES → Scroll to questions (already loaded)
    ↓
NO → Call loadDailyQuestions()
    ↓
    Query database for today's questions
    ↓
    Found? → Display questions
    ↓
    Not found? → Generate 10 new questions
    ↓
    Store in database with today's date
    ↓
    Display questions below
```

## Visual States

### State 1: No Questions Loaded
```
┌─────────────────────────┐
│ 📚 Daily Questions       │
│ Practice & learn         │
│                          │
│ Complete all 20 questions│
│                          │
│ ┌─────────────────────┐  │
│ │        20          │  │
│ │ Questions Available│  │
│ │ Click to load      │  │
│ └─────────────────────┘  │
└─────────────────────────┘
```

### State 2: Questions Loaded
```
┌─────────────────────────┐
│ 📚 Daily Questions       │
│ Practice & learn         │
│                          │
│ Complete all 10 questions│
│                          │
│ ┌─────────────────────┐  │
│ │        10          │  │
│ │ Questions Available│  │
│ │ Click to view      │  │
│ └─────────────────────┘  │
└─────────────────────────┘
```

## Key Features

✅ **Smart Loading** - Only loads when needed
✅ **Smooth Navigation** - Scrolls to questions automatically
✅ **Real-time Count** - Shows actual number of questions
✅ **Visual Feedback** - Clear indication of what clicking will do
✅ **Integrated** - Uses same questions as "Strengthen Your Basics"

## Technical Details

- **Component**: `BasicsSection.tsx`
- **Function**: `loadDailyQuestions()`
- **State**: `questions` array
- **Storage**: Supabase `questions` table
- **Filter**: `segment_type = 'basics'`, `generated_date = today`

## User Experience

1. **First Visit**: Click → Generates 10 questions → Shows questions
2. **Return Visit**: Click → Scrolls to existing questions
3. **Next Day**: Click → Generates new 10 questions (old ones expired)

The card is essentially a **shortcut** to access your daily practice questions quickly!























