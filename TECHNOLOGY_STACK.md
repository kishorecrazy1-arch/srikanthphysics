# Technology Stack & Tools Used

## 🚀 Core Framework & Build Tools

### Frontend Framework
- **React 18.3.1** - UI library for building components
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Fast build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing

### State Management
- **Zustand 5.0.8** - Lightweight state management
  - Used for: Authentication store, Quiz store, User profile state

---

## 🎨 UI & Styling

### CSS Framework
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - Automatic vendor prefixes

### Icons
- **Lucide React 0.344.0** - Icon library
  - Used for: Navigation icons, feature icons, UI elements

### Charts & Data Visualization
- **Recharts 3.3.0** - React charting library
  - Used for: Analytics page, progress charts, performance graphs
  - Components: LineChart, BarChart, RadarChart, PieChart

---

## 🔐 Authentication & Backend

### Database & Backend
- **Supabase 2.57.4** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Email/Password, Google OAuth, Apple OAuth)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage (for homework uploads)

### Features Using Supabase:
- User authentication & authorization
- User profiles storage
- Topics & subtopics management
- Questions storage
- User answers tracking
- Progress tracking
- Topic mastery tracking
- Quiz results
- Homework file storage

---

## 🤖 AI & Question Generation

### AI Services
- **OpenAI GPT-4o** - For MCQ question generation
  - Used for: Daily practice questions, basic question generation
  - Environment variable: `VITE_OPENAI_API_KEY`

- **Anthropic Claude 3.5 Sonnet** - For complex FRQ questions
  - Used for: Free Response Questions (FRQ), multi-step problems
  - Environment variable: `VITE_ANTHROPIC_API_KEY`

### AI Features:
- Automatic question generation
- Difficulty level adaptation (Level 1, 2, 3)
- Physics accuracy validation
- Retry logic with exponential backoff
- Cost tracking
- Response caching (24-hour TTL)

---

## 📱 Features & Pages

### Core Features Implemented:

#### 1. **Authentication System**
- **Tools**: Supabase Auth, React Router
- Email/Password login
- Google OAuth
- Apple OAuth
- Password reset flow
- Test mode (bypass authentication)

#### 2. **Course Management**
- **Tools**: React Router, Supabase
- Multiple course support:
  - AP Physics 1, 2, C (Mechanics & EM)
  - IGCSE Physics
  - SAT Physics
  - IIT JEE Physics
  - NEET Physics
- Course selection & navigation

#### 3. **Topics & Subtopic System**
- **Tools**: Supabase, React Router
- Dynamic topic loading
- Subtopics organization
- Progress tracking per topic
- Mastery levels (0-100%)

#### 4. **Daily Practice**
- **Tools**: OpenAI GPT-4o, Supabase
- AI-generated daily questions
- Three difficulty levels
- Progress tracking
- Timed practice mode
- Question explanations

#### 5. **Practice Bank**
- **Tools**: Supabase, AI generators
- Large question bank
- Filtering by difficulty, subtopic, status
- Multiple modes:
  - Normal mode
  - Club mode
  - Random mode
  - Exam Simulator

#### 6. **Homework Management**
- **Tools**: Supabase Storage, React
- Homework assignments
- File uploads
- Submission tracking
- File storage

#### 7. **Quiz System**
- **Tools**: Zustand, Supabase
- Multiple quiz types:
  - Morning Pulse
  - Homework
  - Challenge
- Real-time scoring
- Answer tracking
- Performance analytics

#### 8. **Analytics Dashboard**
- **Tools**: Recharts, Supabase
- Performance charts
- Progress visualization
- Topic mastery graphs
- Time spent tracking
- Accuracy metrics

#### 9. **Progress Tracking**
- **Tools**: Supabase, React
- Streak tracking
- Question completion stats
- Mastery percentage
- Level-wise progress

#### 10. **Achievements System**
- **Tools**: Supabase, React
- Badge system
- Achievement unlocking
- Progress milestones

#### 11. **Schedule Management**
- **Tools**: React, Supabase
- Study schedule creation
- Reminder system
- Calendar view

#### 12. **Motion Simulator**
- **Tools**: React, Canvas API
- Physics motion visualization
- Interactive graphs
- Parameter adjustment

#### 13. **Graph Generator**
- **Tools**: React, Canvas API
- Physics graph creation
- Data visualization
- Export capabilities

#### 14. **Mock Test**
- **Tools**: Supabase, React
- Full-length practice tests
- Timed exams
- Score calculation

#### 15. **FRQ Practice**
- **Tools**: Anthropic Claude, Supabase
- Free Response Questions
- Multi-step problem solving
- Detailed explanations

#### 16. **Speed Drill**
- **Tools**: React, Supabase
- Timed quick practice
- Rapid question answering
- Speed metrics

---

## 🛠️ Development Tools

### Code Quality
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **React Hooks ESLint Plugin** - React hooks validation

### Build & Development
- **Vite** - Fast HMR (Hot Module Replacement)
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

---

## 📦 Key Libraries & Dependencies

### Routing
- `react-router-dom` - Client-side routing, protected routes

### State Management
- `zustand` - Global state management (auth, quiz, user)

### UI Components
- `lucide-react` - Icon library
- `recharts` - Charting library

### Backend
- `@supabase/supabase-js` - Supabase client SDK

### Styling
- `tailwindcss` - Utility CSS framework
- Custom gradient backgrounds
- Responsive design

---

## 🔧 Environment Variables Required

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Services
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📊 Database Schema (Supabase)

### Main Tables:
- `user_profiles` - User information
- `topics` - Course topics
- `subtopics` - Topic subtopics
- `questions` - Generated questions
- `user_answers` - User answer tracking
- `topic_progress` - Progress per topic
- `topic_mastery` - Mastery tracking
- `quiz_answers` - Quiz responses
- `daily_quizzes` - Daily quiz assignments

---

## 🎯 Feature-to-Tool Mapping

| Feature | Primary Tools |
|---------|--------------|
| Authentication | Supabase Auth, React Router |
| Question Generation | OpenAI GPT-4o, Anthropic Claude |
| Data Storage | Supabase PostgreSQL |
| State Management | Zustand |
| UI Components | React, Tailwind CSS |
| Charts/Analytics | Recharts |
| File Uploads | Supabase Storage |
| Routing | React Router DOM |
| Icons | Lucide React |
| Build Tool | Vite |

---

## 🚀 Performance Optimizations

- **Vite** - Fast HMR for development
- **Code splitting** - Lazy loading routes
- **Caching** - AI response caching (24-hour TTL)
- **Retry logic** - Exponential backoff for API calls
- **Optimized queries** - Supabase query optimization

---

## 📱 Responsive Design

- **Tailwind CSS** - Mobile-first responsive design
- Breakpoints: sm, md, lg, xl
- Adaptive layouts for all screen sizes

---

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security
- **Authentication** - Supabase Auth
- **Protected Routes** - React Router guards
- **API Key Management** - Environment variables

---

This stack provides a modern, scalable, and feature-rich physics learning platform with AI-powered question generation, comprehensive progress tracking, and an intuitive user interface.






















