# 📊 Sample Data Guide

## Overview

This document explains all the sample data that has been added to your Supabase database for testing and development.

---

## 🎯 Topics Added (6 Topics)

### 1. **Kinematics** (Blue)
- **Description**: Study of motion without considering forces
- **Subtopics**: Displacement and Velocity, Acceleration, Free Fall, Projectile Motion, Relative Motion
- **Total Questions**: 45 (11 basics + 3 homework + 2 practice = 16 sample questions added)
- **Display Order**: 1

### 2. **Forces and Newton's Laws** (Green)
- **Description**: Understanding forces and their effects on motion
- **Subtopics**: Newton's First Law, Second Law, Third Law, Friction, Tension and Normal Force
- **Total Questions**: 50 (3 basics + 2 homework + 2 practice = 7 sample questions added)
- **Display Order**: 2

### 3. **Energy and Work** (Yellow)
- **Description**: Conservation of energy and work-energy theorem
- **Subtopics**: Kinetic Energy, Potential Energy, Work-Energy Theorem, Power, Conservation of Energy
- **Total Questions**: 40 (3 basics + 2 homework + 2 practice = 7 sample questions added)
- **Display Order**: 3

### 4. **Momentum** (Red)
- **Description**: Linear momentum and collisions
- **Subtopics**: Linear Momentum, Impulse, Elastic Collisions, Inelastic Collisions, Center of Mass
- **Total Questions**: 35 (2 homework + 2 practice = 4 sample questions added)
- **Display Order**: 4

### 5. **Circular Motion** (Purple)
- **Description**: Motion in circles and rotational dynamics
- **Subtopics**: Centripetal Force, Angular Velocity, Banking of Roads, Vertical Circles, Rotational Kinematics
- **Total Questions**: 38 (2 practice questions added)
- **Display Order**: 5

### 6. **Electricity** (Cyan)
- **Description**: Electric charge, fields, and circuits
- **Subtopics**: Electric Charge, Electric Field, Electric Potential, Ohm's Law, Series and Parallel Circuits
- **Total Questions**: 42 (2 practice questions added)
- **Display Order**: 6

---

## 📝 Sample Questions Breakdown

### Total Questions Added: **42 Questions**

#### By Segment Type:
- **Basics** (Strengthen Your Basics): 11 questions
  - Easy conceptual and calculation questions
  - Focus on fundamental understanding
  - Time limit: 60-90 seconds

- **Homework**: 11 questions
  - Medium to hard difficulty
  - Application and calculation focused
  - Time limit: 90-150 seconds

- **Practice**: 20 questions
  - Hard/challenging problems
  - Advanced applications
  - Time limit: 120-180 seconds

#### By Difficulty:
- **Easy**: 9 questions (all in basics)
- **Medium**: 14 questions (across all segments)
- **Hard**: 19 questions (homework and practice)

#### By Question Type:
- **Conceptual**: 10 questions
- **Calculation**: 28 questions
- **Application**: 4 questions

---

## 📚 Sample Questions by Topic

### Kinematics (16 questions)

**Basics (5 questions):**
1. What is displacement? (Easy, Conceptual)
2. Car travels 100m east, 50m west - displacement? (Easy, Calculation)
3. What does constant velocity mean? (Easy, Conceptual)
4. Ball at highest point - velocity and acceleration? (Medium, Conceptual)
5. Car accelerates from rest - final velocity? (Medium, Calculation)

**Homework (3 questions):**
1. Car accelerates - distance traveled (Medium, Calculation)
2. Projectile horizontal velocity component (Medium, Calculation)
3. Object dropped - velocity after 2 seconds (Medium, Calculation)

**Practice (2 questions):**
1. Ball thrown upward - return time (Hard, Calculation)
2. Projectile at 60° - percentage of max range (Hard, Application)

### Forces and Newton's Laws (7 questions)

**Basics (3 questions):**
1. What is Newton's First Law? (Easy, Conceptual)
2. Force 20N on 5kg - acceleration? (Easy, Calculation)
3. Direction of friction force (Easy, Conceptual)

**Homework (2 questions):**
1. Box pulled with friction - acceleration (Medium, Calculation)
2. Two connected blocks - system acceleration (Hard, Calculation)

**Practice (2 questions):**
1. Block on incline with friction (Hard, Calculation)
2. Two masses over pulley (Hard, Calculation)

### Energy and Work (7 questions)

**Basics (3 questions):**
1. What is kinetic energy? (Easy, Conceptual)
2. Ball moving - kinetic energy calculation (Easy, Calculation)
3. SI unit of work (Easy, Conceptual)

**Homework (2 questions):**
1. Object at height - potential energy (Medium, Calculation)
2. Speed doubles - energy factor increase (Medium, Conceptual)

**Practice (2 questions):**
1. Block slides down ramp - final speed (Hard, Calculation)
2. Compressed spring - stored energy (Hard, Calculation)

### Momentum (4 questions)

**Homework (2 questions):**
1. Ball collision - total momentum (Medium, Calculation)
2. What's conserved in elastic collision? (Medium, Conceptual)

**Practice (2 questions):**
1. Car-truck collision - final velocity (Hard, Calculation)
2. Force impulse calculation (Medium, Calculation)

### Circular Motion (2 questions)

**Practice (2 questions):**
1. Ball on string - centripetal force (Hard, Calculation)
2. Car on curve - centripetal acceleration (Medium, Calculation)

### Electricity (2 questions)

**Practice (2 questions):**
1. Three resistors in parallel (Hard, Calculation)
2. Battery and resistor - power dissipated (Medium, Calculation)

---

## 📋 Homework Assignments (6 Assignments)

### 1. **Kinematics Problem Set 1**
- **Topic**: Kinematics
- **Due Date**: 7 days from now
- **Status**: Active
- **Description**: Practice problems on displacement, velocity, and acceleration

### 2. **Projectile Motion Assignment**
- **Topic**: Kinematics
- **Due Date**: 5 days from now
- **Status**: Active
- **Description**: 8 problems including maximum height, range, time of flight

### 3. **Newton's Laws Worksheet**
- **Topic**: Forces and Newton's Laws
- **Due Date**: 4 days from now
- **Status**: Active
- **Description**: Apply Newton's laws to friction, tension, connected objects

### 4. **Forces on Inclined Planes**
- **Topic**: Forces and Newton's Laws
- **Due Date**: 10 days from now
- **Status**: Active
- **Description**: 12 comprehensive problems with and without friction

### 5. **Energy Conservation Problems**
- **Topic**: Energy and Work
- **Due Date**: 6 days from now
- **Status**: Active
- **Description**: KE and PE transformations using conservation principles

### 6. **Collision Analysis**
- **Topic**: Momentum
- **Due Date**: 8 days from now
- **Status**: Active
- **Description**: Elastic and inelastic collisions analysis

---

## 👤 Creating a Test User with Progress

To test the app with sample data, create a user account:

### Option 1: Sign Up Through the App

1. Go to `/signup`
2. Fill in the form:
   ```
   Name: Demo Student
   Email: demo@example.com
   Password: Demo123456
   Phone: +1-555-0123
   Grade: 11
   Course: AP Physics 1
   ```
3. After signup, the system will automatically create user_profiles entry

### Option 2: Manual Database Entry

```sql
-- First create auth user in Supabase Dashboard
-- Then insert profile with this SQL:

INSERT INTO user_profiles
(id, name, email, country_code, phone_number, grade, course_type,
 current_streak, total_questions, correct_answers, skill_level)
VALUES
('[AUTH_USER_ID]', 'Demo Student', 'demo@example.com', '+1', '5550123',
 11, 'ap_physics_1', 5, 50, 38, 25);
```

### Adding Sample Progress for Test User

Once you have a user ID, you can add sample progress:

```sql
-- Get topic IDs first
SELECT id, name FROM topics;

-- Add topic progress for the user
INSERT INTO topic_progress (user_id, topic_id, mastery, questions_completed, questions_correct, streak_days)
VALUES
-- Kinematics - High progress
('[USER_ID]', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 75, 20, 17, 7),

-- Forces - Medium progress
('[USER_ID]', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 60, 15, 10, 5),

-- Energy - Low progress
('[USER_ID]', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 40, 10, 6, 3),

-- Momentum - Just started
('[USER_ID]', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 25, 5, 3, 2);
```

### Adding Sample Answer History

```sql
-- Get question IDs first
SELECT id, topic_id, question_text, segment_type FROM questions LIMIT 10;

-- Add sample user answers
INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct, time_spent)
VALUES
('[USER_ID]', '[QUESTION_ID_1]', 'b', true, 45),
('[USER_ID]', '[QUESTION_ID_2]', 'a', false, 67),
('[USER_ID]', '[QUESTION_ID_3]', 'c', true, 52),
-- Add more as needed
```

---

## 📊 Expected Progress Dashboard Display

With sample data, your dashboard should show:

### Overall Stats:
- **Current Streak**: 5 days
- **Total Questions**: 50
- **Correct Answers**: 38
- **Accuracy**: 76%
- **Skill Level**: 25

### Topic Progress:
1. **Kinematics**: 75% mastery (Advanced) - 20 completed, 17 correct
2. **Forces**: 60% mastery (Intermediate) - 15 completed, 10 correct
3. **Energy**: 40% mastery (Developing) - 10 completed, 6 correct
4. **Momentum**: 25% mastery (Beginner) - 5 completed, 3 correct
5. **Circular Motion**: 0% mastery (Not Started)
6. **Electricity**: 0% mastery (Not Started)

### Available Quizzes:
- **Morning Pulse**: 5 quick questions (pending)
- **Homework Review**: Based on due assignments (6 active)
- **Challenge Mode**: Advanced problems (available)

---

## 🎨 Topic Detail Page Features

When you click on a topic (e.g., Kinematics), you'll see:

### 1. **Strengthen Your Basics** Section
- 5 easy questions to build foundation
- Multiple choice format
- Instant feedback with explanations
- Time limits: 60-90 seconds per question

### 2. **Homework** Section
- 3 medium-hard questions
- Application-focused problems
- Detailed step-by-step explanations
- Time limits: 90-150 seconds per question

### 3. **Practice** Section
- 2 challenging questions
- Advanced problem-solving
- Comprehensive solutions
- Time limits: 120-180 seconds per question

### Progress Tracking:
- Mastery percentage per topic
- Questions completed vs total
- Accuracy rate
- Recent activity
- Streak tracking

---

## 🔄 How to Add More Data

### Add More Topics:
```sql
INSERT INTO topics (name, icon, description, subtopics, total_questions, display_order, color)
VALUES ('Wave Motion', 'Radio', 'Study of mechanical and electromagnetic waves',
        '["Wave Properties", "Sound Waves", "Interference"]'::jsonb,
        30, 7, 'orange');
```

### Add More Questions:
```sql
INSERT INTO questions (topic_id, segment_type, question_text, options,
                      difficulty, question_type, subtopic, explanation, time_limit)
VALUES ('[TOPIC_ID]', 'basics', 'Your question here?',
        '[{"id":"a","text":"Option A","isCorrect":false},
          {"id":"b","text":"Option B","isCorrect":true}]'::jsonb,
        'easy', 'conceptual', 'Subtopic Name',
        '{"correct":"b","explanation":"Your explanation here"}'::jsonb,
        60);
```

### Add More Homework:
```sql
INSERT INTO homework (topic_id, title, due_date, status, extracted_text)
VALUES ('[TOPIC_ID]', 'Assignment Title', NOW() + INTERVAL '7 days',
        'active', 'Assignment description and instructions');
```

---

## 🧪 Testing Checklist

- [ ] Create test user account via signup
- [ ] Verify topics appear on Topic Selection page
- [ ] Click on Kinematics - see 3 sections (Basics, Homework, Practice)
- [ ] Complete a basics question - see explanation
- [ ] Check progress updates after completing questions
- [ ] View homework assignments on Schedule page
- [ ] Test filtering by difficulty/type
- [ ] Verify mastery percentages calculate correctly
- [ ] Check streak tracking functionality
- [ ] Test answer feedback and explanations

---

## 📈 Sample Data Summary

### Database Contents:
- ✅ **6 Topics** covering major physics areas
- ✅ **42 Questions** across all difficulty levels
- ✅ **11 Basics Questions** for foundation building
- ✅ **11 Homework Questions** for practice
- ✅ **20 Practice Questions** for mastery
- ✅ **6 Homework Assignments** with due dates
- ✅ All questions have detailed explanations
- ✅ All questions tagged with difficulty, type, subtopic

### Question Coverage:
- **Conceptual Understanding**: 24%
- **Problem Solving**: 67%
- **Real-world Application**: 9%

### Difficulty Distribution:
- **Easy**: 21% (Foundation)
- **Medium**: 33% (Development)
- **Hard**: 45% (Mastery)

---

## 🚀 Next Steps

1. **Sign up** with test credentials
2. **Explore topics** - Navigate to Topic Selection
3. **Try questions** - Answer basics, homework, and practice
4. **Check progress** - View your dashboard stats
5. **Review homework** - See upcoming assignments
6. **Build streaks** - Practice daily to maintain streaks

---

## 💡 Tips for Testing

- Try answering questions correctly and incorrectly to see different feedback
- Complete multiple questions in one topic to see mastery increase
- Check that time limits work properly
- Verify explanations display correctly
- Test on mobile and desktop for responsive design
- Try all three segment types (basics, homework, practice)

---

## 🎯 Dynamic Data (Future)

Currently sample data is static. In production, you'll want:

1. **AI-Generated Questions**
   - Daily new questions based on user level
   - Personalized difficulty adjustment
   - Topic-specific question generation

2. **Adaptive Learning**
   - Questions adapt to user performance
   - Focus on weak areas automatically
   - Progressive difficulty increase

3. **Real-time Updates**
   - Progress syncs across devices
   - Instant feedback processing
   - Live leaderboards and competition

4. **Teacher Features**
   - Upload custom homework
   - Create assignments
   - Track student progress
   - Generate reports

---

## ⚠️ Important: Questions Now Visible

All sample questions are now visible in the app! The basics questions have been updated with today's date so they'll appear in the "Strengthen Your Basics" section.

**What you'll see:**
- **Basics Section**: 11 questions (5 for Kinematics, 3 for Forces, 3 for Energy)
- **Homework Section**: 6 active assignments with due dates
- **Practice Section**: 20 challenging questions across all topics

**Note about daily refresh:**
The "Strengthen Your Basics" section shows questions dated for today. Tomorrow, you'll need to either:
1. Run this SQL to update the date:
   ```sql
   UPDATE questions SET generated_date = CURRENT_DATE WHERE segment_type = 'basics';
   ```
2. Or let the app auto-generate new sample questions for the new day

---

## ✅ All Set!

Your database is now populated with comprehensive sample data. You can:
- Create a test user and start practicing
- See realistic progress tracking
- Experience the full learning flow
- Test all app features with meaningful data

**Quick Test Flow:**
1. Sign up at `/signup`
2. Go to Topic Selection (`/ap-physics`)
3. Click "Kinematics"
4. Try all three sections: Basics, Homework, Practice
5. Answer questions and see your progress update!

Happy testing! 🎓
