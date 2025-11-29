# Daily Quiz Question Generation Guide

## 🚀 Quick Start

### Option 1: Automatic Generation (Recommended)
Questions are automatically generated when users access the Daily Practice tab. No action needed!

### Option 2: Manual Generation (For Testing/Pre-generation)

#### In Browser Console:
```javascript
// Generate for Kinematics topic
const { generateDailyQuizForKinematics } = await import('./src/scripts/generateDailyQuiz');
await generateDailyQuizForKinematics();
```

#### For Specific Topic/Subtopic:
```javascript
const { generateDailyQuizQuestions } = await import('./src/scripts/generateDailyQuiz');

await generateDailyQuizQuestions({
  topicId: 'your-topic-id',
  topicName: 'Kinematics',
  subtopicId: 'your-subtopic-id',
  subtopicName: 'Scalars and Vectors',
  difficulty: 'Intermediate',
  questionCount: 10
});
```

## 📋 What Gets Generated

### For Each Question:
- ✅ **Question Text**: Scenario-based physics question
- ✅ **4 Options**: A, B, C, D (multiple choice)
- ✅ **Correct Answer**: Marked with solution
- ✅ **Step-by-Step Solution**: Detailed explanation
- ✅ **Formulas Used**: List of physics formulas
- ✅ **Misconceptions**: Why wrong answers are incorrect
- ✅ **Bloom Taxonomy**: Cognitive level classification
- ✅ **Time Estimate**: Estimated completion time

### Example Generated Question:

**Question:**
"A car accelerates from rest at 2 m/s² for 5 seconds. What is the final velocity?"

**Options:**
- A: 5 m/s (misconception: multiplied time incorrectly)
- B: 10 m/s ✅ (correct answer)
- C: 12 m/s (misconception: added acceleration incorrectly)
- D: 20 m/s (misconception: used wrong formula)

**Solution Steps:**
1. Identify given: u = 0 m/s, a = 2 m/s², t = 5 s
2. Select formula: v = u + at
3. Substitute: v = 0 + (2)(5) = 10 m/s
4. Answer: 10 m/s

**Formulas Used:**
- v = u + at

**Misconceptions:**
- Option A: Student may have calculated 2 × 2.5 instead of 2 × 5
- Option C: Student may have added acceleration and time
- Option D: Student may have used v² = u² + 2as incorrectly

## 🛠️ Tools Used

### AI Services:
- **OpenAI GPT-4o**: For MCQ question generation
- **Anthropic Claude 3.5**: For FRQ questions (future)

### Features:
- ✅ Retry logic (3 attempts with exponential backoff)
- ✅ Physics accuracy validation
- ✅ Cost tracking
- ✅ Database caching (24-hour TTL)
- ✅ Smart retrieval (avoids repetition)

## 📊 Generation Process

```
1. User opens Daily Practice
   ↓
2. Check Supabase for today's questions
   ↓
3. If none exist → Generate via AI
   ├─ Check cache first
   ├─ Call OpenAI GPT-4o
   ├─ Validate physics accuracy
   ├─ Store in database
   └─ Return to user
   ↓
4. Display questions with answers
```

## 🔧 Configuration

### Difficulty Levels:
- **Foundation** (Level 1): Single-step, basic concepts
- **Intermediate** (Level 2): Two-step, combined concepts
- **Advanced** (Level 3): Multi-step, AP exam standard

### Question Count:
- Default: 10 questions per day
- Configurable: Can generate 5-20 questions

## 📝 Database Storage

Questions are stored in `questions` table with:
- `question_text`: The question
- `options`: JSONB with A, B, C, D options
- `correct_answer`: The correct option
- `solution_steps`: Array of solution steps
- `formulas_used`: Array of formulas
- `misconceptions`: JSONB with wrong answer explanations
- `generated_date`: Date question was generated

## 💰 Cost Estimate

- **Per 10 questions**: ~$0.10 (OpenAI GPT-4o)
- **With caching**: ~$0.03 per user per day
- **Monthly (100 users)**: ~$30-90 depending on usage

## ✅ Verification

After generation, verify questions by:
1. Checking database: `SELECT * FROM questions WHERE generated_date = '2024-01-15'`
2. Viewing in app: Open Daily Practice tab
3. Checking console: See generation logs

## 🐛 Troubleshooting

### No questions generated?
- Check API keys in `.env`
- Verify Supabase connection
- Check browser console for errors

### Questions not accurate?
- AI validation is automatic
- Low-quality questions are filtered
- Check `avg_student_score` in database

### High costs?
- Enable caching (24-hour TTL)
- Reduce question count
- Use cheaper models for simple questions

## 📚 API Reference

### `generateDailyQuizQuestions(config)`
Generates questions for specific topic/subtopic.

**Parameters:**
- `topicId`: UUID of topic
- `topicName`: Name of topic
- `subtopicId`: UUID of subtopic
- `subtopicName`: Name of subtopic
- `difficulty`: 'Foundation' | 'Intermediate' | 'Advanced'
- `questionCount`: Number of questions (default: 10)
- `date`: Optional date (defaults to today)

**Returns:** Array of generated questions with answers

### `getTodaysDailyQuiz(topicId, subtopicId, difficulty)`
Gets today's questions or generates if none exist.

**Returns:** Array of questions with full solutions

---

**All questions include complete answers and explanations!** ✅




