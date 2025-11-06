# Enhanced Question Generation System - Implementation Guide

## Overview

This guide covers the enhanced question generation system with production-ready features including retry logic, cost tracking, caching, and analytics.

## ✅ What's Been Added

### 1. Enhanced Question Generator Service
**File**: `src/services/questionGenerator.ts`

Features:
- ✅ Retry logic with exponential backoff (3 retries)
- ✅ Physics accuracy validation using Zod schemas
- ✅ API cost tracking
- ✅ Separate functions for MCQ (OpenAI) and FRQ (Anthropic) generation
- ✅ Error handling and fallback mechanisms

### 2. Question Service Class
**File**: `src/services/questionService.ts`

Features:
- ✅ Batch question generation
- ✅ Cache checking before API calls
- ✅ Smart retrieval (avoids repetition for students)
- ✅ Question metrics tracking
- ✅ Fallback to existing questions if generation fails

### 3. Cost Tracker Service
**File**: `src/services/costTracker.ts`

Features:
- ✅ Real-time cost monitoring
- ✅ Daily and monthly threshold alerts
- ✅ Cost analysis reports
- ✅ Optimization recommendations
- ✅ Usage statistics

### 4. Enhanced TypeScript Types
**File**: `src/types/enhanced.ts`

New types:
- `Question` - Enhanced question structure
- `QuestionContent` - Question content with options, scenario, formulas
- `Solution` - Solution with steps, rubric, misconceptions
- `QuestionMetadata` - Bloom taxonomy, time estimates, tags
- `CostAnalysis` - Cost reporting structure

### 5. Enhanced Database Schema
**File**: `SUPABASE_ENHANCED_SCHEMA.sql`

New tables:
- `questions` - Enhanced with all required fields
- `api_usage_logs` - Cost tracking and analytics
- `question_cache` - Caching layer for generated questions

New views:
- `question_performance_analysis` - Analytics view

## 📦 Installation Steps

### Step 1: Install Dependencies

```bash
npm install openai @anthropic-ai/sdk zod
```

### Step 2: Set Environment Variables

Add to your `.env` file:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Step 3: Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents from `SUPABASE_ENHANCED_SCHEMA.sql`
3. Paste and run in SQL Editor

### Step 4: Update Existing Code

The new services are ready to use. You can integrate them into your existing components:

```typescript
import { QuestionService } from './services/questionService';
import { CostTracker } from './services/costTracker';

// Initialize services
const questionService = new QuestionService();
const costTracker = new CostTracker();

// Generate questions
const questions = await questionService.batchGenerateQuestions(
  subtopicId,
  'Kinematics',
  'Intermediate',
  10,
  'MCQ'
);

// Get cost report
const costReport = await costTracker.generateCostReport();
```

## 🔧 Integration Examples

### Example 1: Generate Daily Practice Questions

```typescript
import { QuestionService } from '../services/questionService';

const questionService = new QuestionService();

// Get daily practice questions (smart retrieval - no repeats)
const dailyQuestions = await questionService.getDailyPracticeQuestions(
  userId,
  subtopicId,
  'Kinematics',
  'Intermediate'
);
```

### Example 2: Track Question Performance

```typescript
import { QuestionService } from '../services/questionService';

const questionService = new QuestionService();

// Update metrics after student answers
await questionService.updateQuestionMetrics(
  questionId,
  studentScore, // 0 or 1
  timeSpent // seconds
);
```

### Example 3: Monitor API Costs

```typescript
import { CostTracker } from '../services/costTracker';

const costTracker = new CostTracker();

// Get usage stats
const stats = await costTracker.getUsageStats(userId, 30); // Last 30 days
console.log('Total cost:', stats.totalCost);
console.log('Average daily:', stats.avgDailyCost);

// Generate full report
const report = await costTracker.generateCostReport(userId);
console.log('Recommendations:', report.recommendations);
```

## 📊 Database Views

### Question Performance Analysis

Query the view to get analytics:

```sql
SELECT * FROM question_performance_analysis
WHERE subtopic_id = 'your-subtopic-id'
ORDER BY success_rate DESC;
```

This provides:
- Attempt count
- Success rate (%)
- Average time spent
- Question difficulty correlation

## 🚀 Advanced Features (Optional)

### 1. Add Error Tracking (Sentry)

```bash
npm install @sentry/react
```

### 2. Add Logging (Winston)

```bash
npm install winston
```

### 3. Add Rate Limiting

```bash
npm install express-rate-limit
```

### 4. Add Job Queue (Bull)

```bash
npm install bull
```

For batch question generation without blocking UI.

## 🎯 Next Steps

1. **Run the SQL schema** in Supabase
2. **Install dependencies**: `npm install`
3. **Update environment variables** with API keys
4. **Integrate services** into your components
5. **Monitor costs** using CostTracker
6. **Review analytics** using the performance view

## 📝 API Usage

### MCQ Generation

```typescript
import { generateMCQQuestions } from './services/questionGenerator';

const questions = await generateMCQQuestions(
  'Scalars and Vectors',
  'Intermediate',
  10
);
```

### FRQ Generation

```typescript
import { generateFRQQuestions } from './services/questionGenerator';

const questions = await generateFRQQuestions(
  'Kinematics',
  'Advanced'
);
```

## ⚠️ Important Notes

1. **API Keys**: Store securely in environment variables
2. **Cost Monitoring**: Set appropriate thresholds in `CostTracker`
3. **Cache TTL**: Currently 24 hours - adjust as needed
4. **Retry Logic**: 3 retries with exponential backoff
5. **Validation**: Physics accuracy validation before storing

## 🔍 Troubleshooting

### Questions not generating?
- Check API keys in `.env`
- Verify Supabase schema is applied
- Check browser console for errors

### High costs?
- Review `CostTracker` recommendations
- Increase cache TTL
- Use cheaper models for simple questions

### Validation errors?
- Check Zod schema in `questionGenerator.ts`
- Verify question structure matches types

## 📚 Documentation

- OpenAI API: https://platform.openai.com/docs
- Anthropic API: https://docs.anthropic.com
- Zod Validation: https://zod.dev
- Supabase: https://supabase.com/docs



