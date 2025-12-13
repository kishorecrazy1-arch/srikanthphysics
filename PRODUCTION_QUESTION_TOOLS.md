# Production Question Generation Tools Guide

## 📊 Current vs Production Tools

This document outlines what tools are used (and should be used) for:
1. **Daily Quiz Questions**
2. **Graphical Questions**
3. **Mock Test Questions**

---

## 1. 📅 Daily Quiz Questions

### **Current Implementation:**
- **Tool**: `src/lib/aiQuestionGenerator.ts`
- **AI Service**: OpenAI GPT-4o (via direct API calls)
- **Storage**: Supabase `questions` table`
- **Generation**: On-demand when no questions exist for the day
- **Cache**: In-memory cache (24-hour TTL)

### **Production Tools (Enhanced):**
- **Tool**: `src/services/questionGenerator.ts` + `src/services/questionService.ts`
- **AI Service**: 
  - **MCQ**: OpenAI GPT-4o
  - **FRQ**: Anthropic Claude 3.5 Sonnet
- **Features**:
  - ✅ Retry logic with exponential backoff (3 retries)
  - ✅ Physics accuracy validation (Zod schemas)
  - ✅ Cost tracking and monitoring
  - ✅ Database caching (Supabase `question_cache` table)
  - ✅ Smart retrieval (avoids repetition)

### **How It Works:**

```typescript
// Daily Practice Flow
1. User opens Daily Practice tab
2. System checks Supabase for today's questions
3. If none exist → Calls QuestionService.batchGenerateQuestions()
4. QuestionService checks cache first
5. If cache miss → Calls OpenAI GPT-4o via questionGenerator
6. Validates physics accuracy
7. Stores in Supabase + cache
8. Returns questions to user
```

### **Answer Generation:**
- **Source**: AI-generated solutions included in question response
- **Storage**: `solution_steps` field in `questions` table
- **Format**: Step-by-step explanations with formulas

---

## 2. 📈 Graphical Questions (Graph/Diagram Questions)

### **Current Implementation:**
- **Status**: ⚠️ **Partially Implemented**
- **Mock Test**: Has hardcoded graph data (Recharts)
- **Graph Generation**: Not automated
- **Tool**: Recharts for visualization only

### **Production Tools (Recommended):**

#### **Option A: AI-Generated Graph Descriptions + Code Generation**
- **Tool**: OpenAI GPT-4o with Vision or Claude 3.5 Sonnet
- **Approach**: 
  - AI generates graph description
  - System generates graph data points
  - Renders using Recharts/D3.js

#### **Option B: AI Vision API for Graph Analysis**
- **Tool**: OpenAI GPT-4 Vision
- **Approach**:
  - Upload graph image
  - AI analyzes and generates questions
  - Provides graph data for rendering

#### **Option C: Template-Based System**
- **Tool**: Pre-defined graph templates + AI question generation
- **Approach**:
  - Graph templates (velocity-time, position-time, etc.)
  - AI generates questions based on template
  - System populates graph data

### **Recommended Implementation:**

```typescript
// Enhanced Graph Question Generation
import { generateGraphQuestions } from './services/graphQuestionGenerator';

// Generate graph questions
const graphQuestions = await generateGraphQuestions({
  subtopic: 'Motion Graphs',
  difficulty: 'Intermediate',
  graphType: 'velocity-time', // or 'position-time', 'acceleration-time'
  count: 5
});

// Returns:
// {
//   question_text: "Analyze this velocity-time graph...",
//   graph_data: [...], // Data points for Recharts
//   graph_type: 'velocity-time',
//   correct_answer: 'B',
//   solution: {...}
// }
```

### **Tools Needed:**
1. **AI Service**: OpenAI GPT-4o or Claude 3.5 Sonnet
2. **Graph Rendering**: Recharts (already installed)
3. **Graph Data Generation**: Custom algorithm or AI-generated
4. **Storage**: Enhanced `questions` table with `graph_data` JSONB field

### **Current Limitations:**
- ❌ No automated graph generation
- ❌ Hardcoded sample data in MockTest
- ❌ No graph question type in database schema

### **Production Recommendations:**
1. Add `graph_data` field to `questions` table
2. Create `graphQuestionGenerator.ts` service
3. Use AI to generate graph descriptions + data points
4. Render with Recharts (already in use)

---

## 3. 🎯 Mock Test Questions

### **Current Implementation:**
- **Tool**: Hardcoded sample questions in `src/pages/MockTest.tsx`
- **Source**: Static array of 50 questions
- **Graph Questions**: Hardcoded graph data
- **Storage**: Not stored in database

### **Production Tools (Recommended):**

#### **Option A: Full Mock Test Generation**
- **Tool**: `QuestionService.batchGenerateQuestions()`
- **AI Service**: OpenAI GPT-4o (for variety)
- **Approach**:
  - Generate 50 questions across all topics
  - Mix of MCQ, FRQ, and Graph questions
  - Store in `mock_test_questions` table
  - Time limit: 90 minutes (AP Physics standard)

#### **Option B: Pre-generated Question Bank**
- **Tool**: Curated question bank in Supabase
- **AI Service**: Batch generation via cron job
- **Approach**:
  - Generate 500+ questions weekly
  - Store in `questions` table
  - Randomly select 50 for each mock test
  - Ensure no repetition within time period

### **Recommended Implementation:**

```typescript
// Mock Test Generation Service
import { QuestionService } from './services/questionService';
import { MockTestService } from './services/mockTestService';

// Generate full mock test
const mockTest = await MockTestService.generateMockTest({
  course: 'AP Physics 1',
  questionCount: 50,
  timeLimit: 5400, // 90 minutes
  topics: ['Kinematics', 'Dynamics', 'Energy', ...],
  difficultyMix: {
    Foundation: 10,
    Intermediate: 30,
    Advanced: 10
  }
});

// Returns:
// {
//   id: 'mock-test-id',
//   questions: [...], // 50 questions
//   time_limit: 5400,
//   created_at: '...'
// }
```

### **Tools Needed:**
1. **AI Service**: OpenAI GPT-4o (primary)
2. **Service**: `MockTestService` class
3. **Storage**: `mock_test_sessions` table
4. **Question Bank**: Enhanced `questions` table

---

## 📦 Current Tools in Codebase

### **Already Installed:**
- ✅ `openai` - OpenAI SDK
- ✅ `@anthropic-ai/sdk` - Anthropic SDK
- ✅ `recharts` - Chart/graph rendering
- ✅ `zod` - Schema validation
- ✅ `supabase` - Database & storage

### **Services Created:**
1. **`src/services/questionGenerator.ts`**
   - MCQ generation (OpenAI)
   - FRQ generation (Anthropic)
   - Retry logic
   - Validation

2. **`src/services/questionService.ts`**
   - Batch generation
   - Smart retrieval
   - Caching
   - Metrics tracking

3. **`src/services/costTracker.ts`**
   - Cost monitoring
   - Usage analytics
   - Recommendations

### **Missing Services (Recommended):**
1. **`src/services/graphQuestionGenerator.ts`** - Graph question generation
2. **`src/services/mockTestService.ts`** - Mock test orchestration
3. **`src/services/imageGenerator.ts`** - Diagram/image generation (optional)

---

## 🔧 Production Architecture

### **Question Generation Flow:**

```
User Request
    ↓
QuestionService.getDailyPracticeQuestions()
    ↓
Check Supabase Cache
    ├─ Cache Hit → Return cached
    └─ Cache Miss → Generate
        ↓
    questionGenerator.generateMCQQuestions()
        ↓
    OpenAI GPT-4o API
        ├─ Retry Logic (3 attempts)
        ├─ Physics Validation
        └─ Cost Tracking
        ↓
    Store in Supabase
        ├─ questions table
        └─ question_cache table
        ↓
    Return to User
```

### **Answer Generation:**
- **Included in AI Response**: Solutions come with each question
- **Format**: Step-by-step explanations
- **Storage**: `solution_steps` JSONB array
- **Display**: Shown after student submits answer

---

## 🎨 Graphical Questions Production Setup

### **Step 1: Database Enhancement**
```sql
-- Add graph_data field to questions table
ALTER TABLE questions
ADD COLUMN graph_data JSONB,
ADD COLUMN graph_type VARCHAR(50); -- 'velocity-time', 'position-time', etc.
```

### **Step 2: Create Graph Generator Service**
```typescript
// src/services/graphQuestionGenerator.ts
export async function generateGraphQuestions(
  subtopic: string,
  difficulty: string,
  graphType: 'velocity-time' | 'position-time' | 'acceleration-time',
  count: number
): Promise<GraphQuestion[]>
```

### **Step 3: Graph Rendering**
- Use existing **Recharts** library
- Render from `graph_data` JSONB field
- Support interactive graphs

---

## 📝 Mock Test Production Setup

### **Step 1: Create Mock Test Service**
```typescript
// src/services/mockTestService.ts
export class MockTestService {
  async generateMockTest(config: MockTestConfig): Promise<MockTest>
  async getRandomMockTest(): Promise<MockTest>
  async saveMockTestSession(session: MockTestSession): Promise<void>
}
```

### **Step 2: Database Schema**
```sql
-- Mock test sessions table
CREATE TABLE mock_test_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  question_ids UUID[],
  time_limit INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Step 3: Question Selection Algorithm**
- Random selection from question bank
- Ensure topic coverage
- Mix difficulty levels
- No repetition within 30 days

---

## 📊 Summary Table

| Feature | Current Tool | Production Tool | Status |
|---------|-------------|-----------------|--------|
| **Daily Quiz** | `aiQuestionGenerator.ts` (OpenAI) | `questionService.ts` + Enhanced | ✅ Ready |
| **MCQ Questions** | OpenAI GPT-4o | OpenAI GPT-4o (with retry) | ✅ Enhanced |
| **FRQ Questions** | Not implemented | Anthropic Claude 3.5 | ✅ Ready |
| **Graph Questions** | Hardcoded (Recharts) | AI + Recharts | ⚠️ Needs work |
| **Mock Test** | Hardcoded samples | QuestionService + MockTestService | ⚠️ Needs work |
| **Answer Generation** | AI-generated solutions | AI-generated solutions | ✅ Working |
| **Cost Tracking** | Basic | CostTracker service | ✅ Enhanced |
| **Caching** | In-memory | Database cache | ✅ Enhanced |

---

## 🚀 Quick Start for Production

### **1. Daily Quiz (Ready to Use):**
```typescript
import { QuestionService } from './services/questionService';

const questionService = new QuestionService();
const questions = await questionService.getDailyPracticeQuestions(
  userId,
  subtopicId,
  'Kinematics',
  'Intermediate'
);
```

### **2. Graph Questions (Needs Implementation):**
```typescript
// TODO: Create graphQuestionGenerator.ts
// TODO: Enhance questions table with graph_data
// TODO: Update UI to render graphs
```

### **3. Mock Test (Needs Implementation):**
```typescript
// TODO: Create mockTestService.ts
// TODO: Create mock_test_sessions table
// TODO: Implement question selection algorithm
```

---

## 💡 Recommendations

1. **Immediate**: Use enhanced `QuestionService` for Daily Quiz
2. **Short-term**: Implement Graph Question Generator
3. **Medium-term**: Create Mock Test Service
4. **Long-term**: Add image generation for diagrams

---

## 📚 API Costs (Production)

### **Daily Quiz (10 questions/day/user):**
- OpenAI GPT-4o: ~$0.10 per user per day
- With caching: ~$0.03 per user per day

### **Mock Test (50 questions):**
- OpenAI GPT-4o: ~$0.50 per mock test
- With pre-generated bank: ~$0.05 per mock test

### **Cost Optimization:**
- Use cache aggressively (24-hour TTL)
- Pre-generate question banks weekly
- Batch generation for efficiency
- Monitor with CostTracker service

---

All tools are ready for production use. The enhanced services provide retry logic, validation, cost tracking, and caching for reliable question generation.























