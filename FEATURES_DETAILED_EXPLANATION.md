    # 📚 Detailed Explanation: How Features Work

    This document provides a comprehensive explanation of how each major feature works in Srikanth's Academy platform.

    ---

    ## 1. 📅 Daily Questions Generation

    ### **Overview**
    Daily questions are AI-generated practice questions that refresh each day, providing students with fresh content for consistent practice.

    ### **How It Works**

    #### **Step 1: User Request**
    - User opens Daily Practice section
    - Selects a topic/subtopic and difficulty level (Level 1/2/3)
    - Clicks "Load Questions" or "Daily Questions" card

    #### **Step 2: Database Check**
    ```typescript
    // System checks Supabase for today's questions
    const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .eq('difficulty_level', difficulty)
    .eq('segment_type', 'basics')  // Daily Practice questions
    .eq('generated_date', today)   // Today's date
    ```

    #### **Step 3: Question Generation (If Needed)**
    If no questions exist for today:

    1. **Cache Check**: System checks `question_cache` table for cached questions
    2. **AI Generation**: If cache miss, calls AI service:
    - **MCQ Questions**: Uses OpenAI GPT-4o
    - **FRQ Questions**: Uses Anthropic Claude 3.5 Sonnet
    3. **Validation**: Validates physics accuracy, checks formulas
    4. **Storage**: Saves to Supabase `questions` table with:
    - `segment_type = 'basics'` (Daily Practice)
    - `generated_date = today`
    - `difficulty_level` (Foundation/Intermediate/Advanced)
    - `ai_generated = true`

    #### **Step 4: Smart Retrieval**
    - System avoids showing questions user already attempted
    - Checks `user_answers` table to filter out completed questions
    - Shuffles remaining questions for variety

    ### **Technical Details**

    **Files Involved:**
    - `src/services/questionService.ts` - Main service
    - `src/lib/aiQuestionGenerator.ts` - AI generation logic
    - `src/components/topics/BasicsSection.tsx` - UI component
    - `src/utils/generateDailyQuizHelper.ts` - Helper functions

    **AI Prompt Structure:**
    ```
    You are an expert AP Physics instructor.
    Generate {count} questions for subtopic: "{subtopic}"
    Difficulty: {level} (Foundation/Intermediate/Advanced)
    Requirements:
    - Realistic physics scenarios
    - 4 answer choices (A, B, C, D)
    - Step-by-step explanations
    - Proper SI units
    ```

    **Caching:**
    - In-memory cache: 24-hour TTL
    - Database cache: `question_cache` table
    - Cache key format: `{subtopicId}_{difficulty}_{questionType}_{count}`

    **Cost Tracking:**
    - Tracks API usage in `api_usage_logs` table
    - Monitors costs per generation
    - Alerts if daily threshold exceeded ($50/day)

    ---

    ## 2. 📝 FRQ (Free Response Questions)

    ### **Overview**
    FRQ questions are multi-part, complex problems that require detailed written responses, similar to AP exam free-response sections.

    ### **How It Works**

    #### **Step 1: Question Structure**
    Each FRQ has multiple parts (a, b, c, d, e):
    - **Part (a)**: Usually diagram or setup (2 points)
    - **Part (b)**: Calculation (2 points)
    - **Part (c)**: Further calculation (2 points)
    - **Part (d)**: Analysis or comparison (2 points)
    - **Part (e)**: Explanation or reasoning (2 points)
    - **Total**: 10 points per FRQ

    #### **Step 2: Generation Process**
    ```typescript
    // FRQ Generation uses Claude 3.5 Sonnet
    const questions = await generateFRQQuestions(
    subtopic,
    difficulty
    );
    ```

    **AI Prompt for FRQ:**
    - Multi-part question structure (3-5 parts)
    - Requires multi-step reasoning
    - Includes detailed rubric for grading
    - Identifies common misconceptions
    - Provides complete solution with step-by-step explanation

    #### **Step 3: User Interface**
    - User sees problem statement
    - Each part has:
    - Question text
    - Points value
    - Type (diagram/calculation/explanation)
    - Text area for answer
    - For diagrams: Upload option or text description

    #### **Step 4: Submission & Grading**
    When user submits:
    1. **AI Grading** (Future): Uses AI to evaluate responses
    2. **Rubric-Based Scoring**: Checks against rubric criteria:
    - Formula application (1pt)
    - Calculation accuracy (1pt)
    - Units included (1pt)
    - Reasoning clarity (1pt)
    3. **Feedback Generation**: Provides detailed feedback per part

    ### **Technical Details**

    **Files:**
    - `src/pages/FRQPractice.tsx` - Main FRQ interface
    - `src/lib/aiQuestionGenerator.ts` - FRQ generation (lines 345-526)
    - `src/services/questionGenerator.ts` - FRQ service (lines 400-491)

    **Question Format:**
    ```json
    {
    "question_text": "Main scenario",
    "parts": [
        {
        "part": "a",
        "question": "Part (a) question",
        "points": 2,
        "type": "diagram|calculation|explanation"
        }
    ],
    "solution_steps": ["step1", "step2"],
    "rubric": {
        "part_a": "Points awarded for: formula (1pt), calculation (1pt)"
    }
    }
    ```

    **Current Status:**
    - ✅ Question generation working
    - ✅ UI for answering working
    - ⚠️ AI grading: Placeholder (currently auto-scores as full points)
    - 🔄 Future: Real AI-based grading with rubric

    ---

    ## 3. 📈 Graph Questions

    ### **Overview**
    Graph questions generate dynamic physics graphs (velocity-time, position-time, acceleration-time) and ask questions about interpreting them.

    ### **How It Works**

    #### **Step 1: Graph Generation**
    ```typescript
    // Generate graph data based on type
    const generateGraphData = (type: GraphType) => {
    // Velocity-time: Uses acceleration and initial velocity
    // Position-time: Uses amplitude and frequency
    // Acceleration-time: Uses max acceleration
    }
    ```

    **Graph Types:**
    - **Velocity-Time**: Shows velocity changes over time
    - **Position-Time**: Shows position changes over time
    - **Acceleration-Time**: Shows acceleration changes over time

    #### **Step 2: Question Generation**
    Based on graph features:
    - **Area Under Curve**: "What is the displacement?"
    - **Slope Analysis**: "What is the acceleration?"
    - **Intercept Values**: "What is the initial velocity?"
    - **Interpretation**: "Which statement describes the motion?"

    #### **Step 3: Statistics Calculation**
    ```typescript
    const calculateStats = (data) => {
    maxValue: Math.max(...data.map(d => d.value))
    totalTime: data[data.length - 1].time
    areaUnderCurve: // Numerical integration
    }
    ```

    #### **Step 4: Answer Generation**
    - Correct answer calculated from graph data
    - Wrong answers generated as variations (0.5x, 1.5x, 2x correct answer)
    - Solution explains how to read the graph

    ### **Technical Details**

    **Files:**
    - `src/pages/GraphGenerator.tsx` - Main graph generator
    - Uses Recharts library for visualization

    **Graph Generation Algorithm:**
    ```typescript
    // Velocity-time example
    for (let i = 0; i < timePoints; i++) {
    const t = (totalTime * i) / (timePoints - 1);
    let v;
    if (t < peakTime * 0.4) {
        v = initialVelocity + acceleration * t;  // Accelerating
    } else if (t < peakTime * 0.6) {
        v = constant;  // Constant velocity
    } else {
        v = decelerating;  // Decelerating
    }
    data.push({ time: t, value: v });
    }
    ```

    **Question Focus Types:**
    - `area` - Area under curve (displacement)
    - `slope` - Slope of graph (acceleration)
    - `intercept` - Y-intercept (initial value)
    - `comparison` - Compare multiple graphs
    - `interpretation` - Describe motion

    **Visualization:**
    - Uses Recharts `AreaChart` component
    - Gradient fills for visual appeal
    - Real-time stats display (max value, total time, area)

    ---

    ## 4. 🎮 AP Physics Simulators

    ### **Overview**
    Interactive physics simulators that visualize motion in real-time, allowing students to experiment with different parameters.

    ### **How It Works**

    #### **Motion Simulator (Projectile Motion)**

    **Step 1: Parameter Input**
    User sets:
    - **Initial Velocity**: 5-50 m/s (slider)
    - **Launch Angle**: 0-90° (slider)
    - **Gravity**: 1-20 m/s² (slider)

    **Step 2: Physics Calculations**
    ```typescript
    // Calculate projectile motion
    const angleRad = (launchAngle * Math.PI) / 180;
    const v0x = initialVelocity * Math.cos(angleRad);  // Horizontal component
    const v0y = initialVelocity * Math.sin(angleRad);   // Vertical component
    const totalTime = (2 * v0y) / gravity;               // Time of flight
    const maxHeight = (v0y * v0y) / (2 * gravity);      // Maximum height
    const range = (v0² * sin(2θ)) / gravity;            // Range
    ```

    **Step 3: Animation**
    - Uses `requestAnimationFrame` for smooth animation
    - Updates position every frame (60 FPS)
    - Draws trajectory path as projectile moves
    - Shows velocity vectors (horizontal in cyan, vertical in pink)

    **Step 4: Visualization**
    - **Canvas Drawing**: HTML5 Canvas for projectile visualization
    - **Graphs**: Recharts for height-time and velocity-time graphs
    - **Live Stats**: Real-time display of time, height, distance

    **Features:**
    - ✅ Play/Pause controls
    - ✅ Speed control (0.5x, 1x, 2x, 4x)
    - ✅ Reset button
    - ✅ Live calculations display
    - ✅ Real-time graphs

    ### **Technical Details**

    **Files:**
    - `src/components/MotionSimulator.tsx` - Main simulator
    - `src/components/BasketballSimulator.tsx` - Basketball variant
    - `src/pages/Simulators.tsx` - Simulator selection page

    **Animation Loop:**
    ```typescript
    useEffect(() => {
    if (playing && time < totalTime) {
        animationFrameRef.current = requestAnimationFrame(() => {
        setTime((prev) => prev + 0.016 * speed);  // 60 FPS
        });
    }
    }, [playing, time, totalTime, speed]);
    ```

    **Canvas Drawing:**
    - Grid background
    - Ground line
    - Trajectory path (dashed line)
    - Projectile ball (with glow effect)
    - Velocity vectors (arrows)

    **Graphs:**
    - Height vs Time: Area chart showing parabolic motion
    - Velocity vs Time: Line chart showing velocity changes

    ---

    ## 5. 📊 Performance Analysis & Analytics

    ### **Overview**
    Comprehensive analytics dashboard that tracks student performance across all activities and provides insights.

    ### **How It Works**

    #### **Data Collection**
    System tracks:
    1. **Question Attempts**: Every question answered
    2. **Time Spent**: Time per question
    3. **Correctness**: Whether answer was correct
    4. **Topics**: Which topics/subtopics attempted
    5. **Question Types**: MCQ, FRQ, Graph questions

    **Storage:**
    - `user_answers` table: Individual answer records
    - `user_profiles` table: Aggregated stats
    - `topic_mastery` table: Per-topic performance

    #### **Metrics Calculated**

    **1. Overall Score**
    ```typescript
    const overallScore = (correctAnswers / totalQuestions) * 100;
    ```

    **2. Topic Performance**
    ```typescript
    // Per topic
    const topicScore = (topicCorrect / topicTotal) * 100;
    ```

    **3. Time Metrics**
    - Average time per question
    - Fastest topic
    - Slowest topic
    - Time wasted on wrong answers

    **4. Skills Radar**
    - Speed: Questions per minute
    - Accuracy: Correct answer percentage
    - Conceptual: Understanding score
    - Problem Solving: Multi-step problems
    - FRQs: Free response performance

    #### **Visualizations**

    **1. Weekly Performance Line Chart**
    - Shows score trend over 7 days
    - Highlights improvement/decline

    **2. Topic Performance Bar Chart**
    - Bar chart showing score per topic
    - Color-coded by performance level

    **3. Skills Radar Chart**
    - Radar/spider chart
    - Shows strengths and weaknesses across skills

    **4. Question Distribution Pie Chart**
    - Breakdown: MCQ vs FRQ vs Graph questions
    - Shows practice distribution

    #### **AI Recommendations**
    Based on performance data:
    - Identifies weak topics
    - Suggests practice focus areas
    - Recommends question types to practice
    - Generates personalized practice plan

    ### **Technical Details**

    **Files:**
    - `src/pages/Analytics.tsx` - Main analytics page
    - Uses Recharts for all visualizations

    **Data Sources:**
    ```typescript
    // Weekly data
    const weeklyData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 72 },
    // ...
    ];

    // Topic data
    const topicData = [
    { topic: 'Kinematics', score: 85, color: '#10b981' },
    // ...
    ];
    ```

    **Current Status:**
    - ✅ UI and visualizations working
    - ⚠️ Data: Currently uses mock/static data
    - 🔄 Future: Connect to real `user_answers` data
    - 🔄 Future: Real-time performance calculations

    **Future Enhancements:**
    1. Real-time data from Supabase
    2. Historical trend analysis
    3. Predictive analytics (score predictions)
    4. Comparative analytics (vs. other students)
    5. Detailed per-question analysis

    ---

    ## 🔄 Data Flow Summary

    ### **Daily Questions Flow:**
    ```
    User Request → Check DB → Check Cache → AI Generation → Validation → Storage → Display
    ```

    ### **FRQ Flow:**
    ```
    User Opens FRQ → Load Question → User Answers → Submit → AI Grading → Feedback
    ```

    ### **Graph Questions Flow:**
    ```
    User Clicks Generate → Generate Graph Data → Calculate Stats → Generate Question → Display
    ```

    ### **Simulator Flow:**
    ```
    User Sets Parameters → Calculate Physics → Animate → Draw Canvas → Update Graphs
    ```

    ### **Analytics Flow:**
    ```
    Collect Data → Aggregate Metrics → Calculate Stats → Generate Visualizations → Display Insights
    ```

    ---

    ## 🛠️ Technology Stack

    **AI Services:**
    - OpenAI GPT-4o (MCQ generation)
    - Anthropic Claude 3.5 Sonnet (FRQ generation)

    **Visualization:**
    - Recharts (charts and graphs)
    - HTML5 Canvas (simulators)

    **Database:**
    - Supabase (PostgreSQL)
    - Tables: `questions`, `user_answers`, `question_cache`, `api_usage_logs`

    **Caching:**
    - In-memory cache (24-hour TTL)
    - Database cache (`question_cache` table)

    **Cost Tracking:**
    - `api_usage_logs` table
    - Daily threshold monitoring
    - Cost analysis reports

    ---

    ## 📝 Notes

    1. **Daily Questions**: Regenerate each day, avoid repetition
    2. **FRQ Grading**: Currently placeholder, needs AI integration
    3. **Graph Questions**: Fully functional, generates unique graphs
    4. **Simulators**: Real-time physics calculations and visualization
    5. **Analytics**: UI complete, needs real data integration

    ---

    ## 🔮 Future Enhancements

    1. **AI-Powered FRQ Grading**: Real rubric-based scoring
    2. **Adaptive Difficulty**: Adjust based on performance
    3. **Predictive Analytics**: Score predictions for AP exam
    4. **Social Features**: Compare with other students
    5. **Mobile Optimization**: Better mobile experience for simulators

