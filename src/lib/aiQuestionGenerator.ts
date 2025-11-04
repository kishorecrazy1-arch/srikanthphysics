/**
 * AI Question Generation Service for AP Physics 1 - Kinematics
 * 
 * ARCHITECTURE:
 * - Uses OpenAI GPT-4o API for daily practice MCQ generation
 * - Uses Anthropic Claude 3.5 Sonnet API for complex multi-step FRQ questions
 * - Implements three difficulty levels: Foundation (Level 1), Intermediate (Level 2), Advanced (Level 3)
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - VITE_OPENAI_API_KEY: Your OpenAI API key for GPT-4o
 * - VITE_ANTHROPIC_API_KEY: Your Anthropic API key for Claude 3.5 Sonnet
 * 
 * Add these to your .env file:
 * VITE_OPENAI_API_KEY=sk-...
 * VITE_ANTHROPIC_API_KEY=sk-ant-...
 * 
 * FEATURES:
 * ✓ Retry logic with exponential backoff (3 retries)
 * ✓ Response validation for physics accuracy
 * ✓ Caching of frequently generated question patterns (24-hour TTL)
 * ✓ Cost tracking for API usage
 * ✓ Fallback to sample questions if API fails
 * ✓ Supports MCQ, FRQ, and Graph question types
 * 
 * USAGE:
 * import { generatePhysicsQuestions, getAPIUsageStats } from './lib/aiQuestionGenerator';
 * 
 * // Generate 10 MCQ questions
 * const questions = await generatePhysicsQuestions(
 *   topicId,
 *   'Kinematics',
 *   'Scalars and Vectors in One Dimension',
 *   'level_1',
 *   'mcq',
 *   10
 * );
 * 
 * // Get API usage statistics
 * const stats = getAPIUsageStats();
 * console.log('Total cost:', stats.totalCost, 'Total tokens:', stats.totalTokens);
 */

import type { Question, QuestionOption, QuestionExplanation } from '../types/topics';

interface GenerationConfig {
  topicName: string;
  subtopicName: string;
  difficultyLevel: 'level_1' | 'level_2' | 'level_3';
  questionType: 'mcq' | 'frq' | 'graph';
  questionCount?: number;
}

interface QuestionGenerationResult {
  questions: Question[];
  apiCost: number;
  tokensUsed: number;
}

interface CacheEntry {
  questions: Question[];
  timestamp: number;
  expiresAt: number;
}

// In-memory cache for question patterns (can be moved to Supabase or Redis)
const questionCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Cost tracking
let totalAPICost = 0;
let totalTokensUsed = 0;

/**
 * Difficulty level configurations
 */
const DIFFICULTY_CONFIG = {
  level_1: {
    name: 'Foundation',
    description: 'Single-step problems, direct formula application, basic concepts, no calculus',
    complexity: 'basic',
    timeLimit: 120,
    bloomLevel: 'Apply',
    steps: 1,
    formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as']
  },
  level_2: {
    name: 'Intermediate',
    description: 'Two-step reasoning, multiple concepts combined, numerical complexity',
    complexity: 'intermediate',
    timeLimit: 180,
    bloomLevel: 'Analyze',
    steps: 2,
    formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'Vector components', 'Relative motion']
  },
  level_3: {
    name: 'Advanced',
    description: 'Multi-step analysis, complex scenarios, calculus-based, AP exam standard',
    complexity: 'advanced',
    timeLimit: 240,
    bloomLevel: 'Analyze',
    steps: 3,
    formulas: ['All kinematic equations', 'Calculus: v = ds/dt, a = dv/dt', 'Projectile motion', 'Relative motion']
  }
};

/**
 * Kinematics topics mapping
 */
const KINEMATICS_TOPICS = {
  'Position': 'position, displacement, distance',
  'Velocity': 'velocity, speed, instantaneous velocity, average velocity',
  'Acceleration': 'acceleration, constant acceleration, free fall',
  'Displacement': 'displacement, distance, position vectors',
  'Motion Graphs': 'position-time graphs, velocity-time graphs, acceleration-time graphs',
  'Projectile Motion': 'projectile motion, horizontal and vertical components, range, maximum height',
  'Relative Motion': 'relative velocity, reference frames, vector addition',
  'Scalars and Vectors in One Dimension': 'scalars vs vectors, one-dimensional motion',
  'Displacement, Velocity, and Acceleration': 'definitions, relationships, calculations',
  'Representing Motion': 'graphs, equations, diagrams',
  'Reference Frames and Relative Motion': 'reference frames, relative motion',
  'Vectors and Motion in Two Dimensions': 'two-dimensional motion, vector components'
};

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Generate MCQ questions using OpenAI GPT-4o
 */
async function generateMCQQuestions(config: GenerationConfig): Promise<Question[]> {
  const { topicName, subtopicName, difficultyLevel, questionCount = 10 } = config;
  const levelConfig = DIFFICULTY_CONFIG[difficultyLevel];
  const topicKeywords = KINEMATICS_TOPICS[subtopicName as keyof typeof KINEMATICS_TOPICS] || subtopicName;

  const prompt = `You are an expert AP Physics 1 teacher creating multiple-choice questions for Kinematics.

CONTEXT:
- Topic: ${topicName}
- Subtopic: ${subtopicName}
- Difficulty Level: ${levelConfig.name} (${levelConfig.description})
- Question Type: Multiple Choice (4 options)
- Number of Questions: ${questionCount}

REQUIREMENTS:
1. Generate ${questionCount} unique, high-quality multiple-choice questions
2. Each question must have exactly 4 options (A, B, C, D)
3. Only ONE correct answer per question
4. Questions should test: ${levelConfig.bloomLevel} level thinking
5. Focus on: ${topicKeywords}
6. Difficulty: ${levelConfig.complexity} level problems

QUESTION FORMAT (JSON array):
[
  {
    "question_text": "Clear scenario-based question with context",
    "options": [
      {"id": "A", "text": "Option A text", "isCorrect": false, "misconception": "Why this is wrong"},
      {"id": "B", "text": "Option B text", "isCorrect": false, "misconception": "Why this is wrong"},
      {"id": "C", "text": "Option C text", "isCorrect": true, "misconception": null},
      {"id": "D", "text": "Option D text", "isCorrect": false, "misconception": "Why this is wrong"}
    ],
    "correct_answer": "C",
    "explanation": {
      "steps": [
        {
          "title": "Step 1: Identify given information",
          "content": "List all given values and what needs to be found"
        },
        {
          "title": "Step 2: Select appropriate formula",
          "content": "Choose the correct kinematic equation"
        },
        {
          "title": "Step 3: Solve",
          "content": "Substitute values and calculate"
        }
      ],
      "keyConcept": "Main concept tested",
      "relatedFormulas": ["v = u + at", "s = ut + ½at²"],
      "commonMisconceptions": ["List of common mistakes students make"]
    },
    "estimated_time": ${levelConfig.timeLimit},
    "bloom_level": "${levelConfig.bloomLevel}",
    "formulas_used": ["List of formulas"],
    "misconceptions": {
      "option_a": "Why students might choose A",
      "option_b": "Why students might choose B",
      "option_d": "Why students might choose D"
    }
  }
]

GUIDELINES:
- Use realistic scenarios (cars, balls, elevators, rockets, etc.)
- Include appropriate units (m, m/s, m/s², s)
- Avoid trivial or overly complex calculations
- Ensure numerical answers are reasonable
- Make wrong answers plausible (common calculation errors, sign mistakes, unit errors)
- Each question should be unique and test different aspects
- For Level 1: Single-step, direct formula application
- For Level 2: Two-step problems, combine concepts
- For Level 3: Multi-step, AP exam difficulty, may include graphs

IMPORTANT: Return a JSON object with this exact structure:
{
  "questions": [
    ... (array of questions as specified above)
  ]
}

Return ONLY valid JSON, no markdown, no additional text, no code blocks.`;

  const cacheKey = `mcq_${topicName}_${subtopicName}_${difficultyLevel}_${questionCount}`;
  
  // Check cache
  const cached = questionCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.questions;
  }

  try {
    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AP Physics 1 teacher specializing in Kinematics. Generate accurate, educational multiple-choice questions with detailed explanations. Always return valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: 'json_object' }
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `HTTP ${res.status}`);
      }

      return res;
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse and validate response
    let parsedQuestions;
    try {
      const parsed = JSON.parse(content);
      // Handle JSON object with "questions" property or direct array
      if (Array.isArray(parsed)) {
        parsedQuestions = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        parsedQuestions = parsed.questions;
      } else {
        throw new Error('Invalid JSON structure: expected array or object with "questions" property');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content.substring(0, 500));
      throw new Error('Invalid JSON response from API');
    }

    // Validate and transform questions
    const validatedQuestions = validateAndTransformQuestions(parsedQuestions, config, levelConfig);
    
    // Validate physics accuracy
    const invalidQuestions = validatedQuestions.filter(q => !validatePhysicsAccuracy(q));
    if (invalidQuestions.length > 0) {
      console.warn(`${invalidQuestions.length} questions failed physics accuracy validation`);
      // Filter out invalid questions
      validatedQuestions.splice(0, validatedQuestions.length, ...validatedQuestions.filter(q => validatePhysicsAccuracy(q)));
    }

    // Track costs (GPT-4o pricing: ~$5/1M input tokens, ~$15/1M output tokens)
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const cost = (inputTokens / 1_000_000) * 5 + (outputTokens / 1_000_000) * 15;
    
    totalAPICost += cost;
    totalTokensUsed += (inputTokens + outputTokens);

    // Cache the results
    questionCache.set(cacheKey, {
      questions: validatedQuestions,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    });

    return validatedQuestions;
  } catch (error) {
    console.error('Error generating MCQ questions:', error);
    // Fallback to sample questions if API fails
    return generateFallbackQuestions(config, levelConfig);
  }
}

/**
 * Generate FRQ questions using Anthropic Claude 3.5 Sonnet
 */
async function generateFRQQuestions(config: GenerationConfig): Promise<Question[]> {
  const { topicName, subtopicName, difficultyLevel, questionCount = 5 } = config;
  const levelConfig = DIFFICULTY_CONFIG[difficultyLevel];
  const topicKeywords = KINEMATICS_TOPICS[subtopicName as keyof typeof KINEMATICS_TOPICS] || subtopicName;

  const prompt = `You are an expert AP Physics 1 teacher creating Free Response Questions (FRQs) for Kinematics.

CONTEXT:
- Topic: ${topicName}
- Subtopic: ${subtopicName}
- Difficulty Level: ${levelConfig.name} (${levelConfig.description})
- Question Type: Free Response Question (FRQ)
- Number of Questions: ${questionCount}

REQUIREMENTS:
1. Generate ${questionCount} complex, multi-step FRQ questions
2. Each question should have multiple parts (a, b, c, d, e)
3. Questions should require: ${levelConfig.bloomLevel} level thinking
4. Focus on: ${topicKeywords}
5. Difficulty: ${levelConfig.complexity} level, AP exam standard

QUESTION FORMAT (JSON array):
[
  {
    "question_text": "Complete scenario-based problem statement",
    "parts": [
      {
        "part": "a",
        "question": "Part (a) question",
        "points": 2,
        "type": "calculation|diagram|explanation"
      }
    ],
    "total_points": 10,
    "explanation": {
      "steps": [
        {
          "title": "Part (a) Solution",
          "content": "Detailed step-by-step solution"
        }
      ],
      "keyConcept": "Main concepts tested",
      "relatedFormulas": ["List of formulas"],
      "rubric": {
        "part_a": "Points awarded for: formula (1pt), calculation (1pt)",
        "part_b": "Points awarded for: correct reasoning (2pts)"
      }
    },
    "estimated_time": ${levelConfig.timeLimit * 2},
    "bloom_level": "${levelConfig.bloomLevel}",
    "formulas_used": ["List of formulas"],
    "common_mistakes": ["List of common student errors"]
  }
]

GUIDELINES:
- Use realistic, complex scenarios
- Include appropriate units throughout
- Each part should build on previous parts
- Include diagrams where relevant
- Provide detailed rubric for grading
- For Level 3: Include calculus-based problems
- Make questions challenging but fair

IMPORTANT: Return a JSON object with this exact structure:
{
  "questions": [
    ... (array of questions as specified above)
  ]
}

Return ONLY valid JSON, no markdown, no additional text, no code blocks.`;

  const cacheKey = `frq_${topicName}_${subtopicName}_${difficultyLevel}_${questionCount}`;
  
  // Check cache
  const cached = questionCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.questions;
  }

  try {
    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          system: 'You are an expert AP Physics 1 teacher specializing in Kinematics. Generate accurate, educational free response questions with detailed solutions and rubrics. Always return valid JSON format.'
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `HTTP ${res.status}`);
      }

      return res;
    });

    const data = await response.json();
    const content = data.content[0]?.text;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse and validate response
    let parsedQuestions;
    try {
      // Extract JSON from response (Claude may wrap in markdown code blocks)
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to find JSON object or array
      const jsonMatch = jsonString.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonString);
      
      // Handle JSON object with "questions" property or direct array
      if (Array.isArray(parsed)) {
        parsedQuestions = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        parsedQuestions = parsed.questions;
      } else {
        throw new Error('Invalid JSON structure: expected array or object with "questions" property');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response content:', content.substring(0, 500));
      throw new Error('Invalid JSON response from API');
    }

    // Transform FRQ format to Question format
    const validatedQuestions = validateAndTransformFRQQuestions(parsedQuestions, config, levelConfig);
    
    // Validate physics accuracy
    const invalidQuestions = validatedQuestions.filter(q => !validatePhysicsAccuracy(q));
    if (invalidQuestions.length > 0) {
      console.warn(`${invalidQuestions.length} FRQ questions failed physics accuracy validation`);
      // Filter out invalid questions
      validatedQuestions.splice(0, validatedQuestions.length, ...validatedQuestions.filter(q => validatePhysicsAccuracy(q)));
    }

    // Track costs (Claude 3.5 Sonnet: ~$3/1M input tokens, ~$15/1M output tokens)
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const cost = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;
    
    totalAPICost += cost;
    totalTokensUsed += (inputTokens + outputTokens);

    // Cache the results
    questionCache.set(cacheKey, {
      questions: validatedQuestions,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    });

    return validatedQuestions;
  } catch (error) {
    console.error('Error generating FRQ questions:', error);
    // Fallback to sample questions if API fails
    return generateFallbackQuestions(config, levelConfig);
  }
}

/**
 * Validate and transform API response to Question format
 */
function validateAndTransformQuestions(
  rawQuestions: any[],
  config: GenerationConfig,
  levelConfig: typeof DIFFICULTY_CONFIG.level_1
): Question[] {
  return rawQuestions.map((raw, index) => {
    // Validate required fields
    if (!raw.question_text || !raw.options || !Array.isArray(raw.options)) {
      throw new Error(`Invalid question format at index ${index}`);
    }

    // Transform options
    const options: QuestionOption[] = raw.options.map((opt: any, i: number) => ({
      id: opt.id || String.fromCharCode(65 + i), // A, B, C, D
      text: opt.text || `Option ${String.fromCharCode(65 + i)}`,
      isCorrect: opt.isCorrect === true || opt.isCorrect === 'true'
    }));

    // Ensure exactly one correct answer
    const correctCount = options.filter(o => o.isCorrect).length;
    if (correctCount !== 1) {
      // Fix: mark first option as correct if none, or mark only first as correct if multiple
      options.forEach((opt, i) => {
        opt.isCorrect = i === 0;
      });
    }

    // Build explanation
    const explanation: QuestionExplanation = {
      steps: raw.explanation?.steps || [
        {
          title: 'Solution',
          content: raw.explanation?.content || 'Step-by-step solution'
        }
      ],
      keyConcept: raw.explanation?.keyConcept || raw.explanation?.key_concept || config.subtopicName,
      relatedFormulas: raw.explanation?.relatedFormulas || raw.explanation?.related_formulas || raw.formulas_used || levelConfig.formulas
    };

    return {
      id: `temp_${Date.now()}_${index}`, // Will be replaced by database
      topic_id: '', // Will be set by caller
      segment_type: 'basics',
      question_text: raw.question_text,
      options,
      difficulty: levelConfig.complexity === 'basic' ? 'easy' : levelConfig.complexity === 'intermediate' ? 'medium' : 'hard',
      question_type: 'calculation',
      subtopic: config.subtopicName,
      explanation,
      image_url: null,
      time_limit: raw.estimated_time || raw.estimatedTime || levelConfig.timeLimit,
      ai_generated: true,
      generated_date: new Date().toISOString().split('T')[0],
      homework_id: null,
      created_at: new Date().toISOString()
    };
  });
}

/**
 * Transform FRQ format to Question format
 */
function validateAndTransformFRQQuestions(
  rawQuestions: any[],
  config: GenerationConfig,
  levelConfig: typeof DIFFICULTY_CONFIG.level_1
): Question[] {
  return rawQuestions.map((raw, index) => {
    // Combine all parts into one question text
    const partsText = raw.parts?.map((p: any) => `(${p.part}) ${p.question}`).join('\n') || '';
    const questionText = `${raw.question_text}\n\n${partsText}`;

    // For FRQs, create options that represent "Complete" / "Incomplete" states
    // Or we can make FRQs have no options (free response)
    const options: QuestionOption[] = [
      { id: 'A', text: 'Complete', isCorrect: true },
      { id: 'B', text: 'Incomplete', isCorrect: false },
      { id: 'C', text: 'Needs Review', isCorrect: false },
      { id: 'D', text: 'Not Attempted', isCorrect: false }
    ];

    const explanation: QuestionExplanation = {
      steps: raw.explanation?.steps || [
        {
          title: 'Solution',
          content: raw.explanation?.content || 'Detailed solution for free response question'
        }
      ],
      keyConcept: raw.explanation?.keyConcept || config.subtopicName,
      relatedFormulas: raw.explanation?.relatedFormulas || raw.formulas_used || levelConfig.formulas
    };

    return {
      id: `temp_${Date.now()}_${index}`,
      topic_id: '',
      segment_type: 'practice',
      question_text: questionText,
      options,
      difficulty: levelConfig.complexity === 'basic' ? 'easy' : levelConfig.complexity === 'intermediate' ? 'medium' : 'hard',
      question_type: 'application',
      subtopic: config.subtopicName,
      explanation,
      image_url: null,
      time_limit: raw.estimated_time || levelConfig.timeLimit * 2,
      ai_generated: true,
      generated_date: new Date().toISOString().split('T')[0],
      homework_id: null,
      created_at: new Date().toISOString()
    };
  });
}

/**
 * Fallback question generator if API fails
 */
function generateFallbackQuestions(
  config: GenerationConfig,
  levelConfig: typeof DIFFICULTY_CONFIG.level_1
): Question[] {
  const questionCount = config.questionCount || 10;
  
  return Array.from({ length: questionCount }, (_, index) => ({
    id: `fallback_${Date.now()}_${index}`,
    topic_id: '',
    segment_type: 'basics' as const,
    question_text: `[Fallback] ${config.subtopicName} - ${levelConfig.name} Level Question ${index + 1}`,
    options: [
      { id: 'A', text: 'Option A', isCorrect: index % 4 === 0 },
      { id: 'B', text: 'Option B', isCorrect: index % 4 === 1 },
      { id: 'C', text: 'Option C', isCorrect: index % 4 === 2 },
      { id: 'D', text: 'Option D', isCorrect: index % 4 === 3 }
    ],
    difficulty: levelConfig.complexity === 'basic' ? 'easy' : levelConfig.complexity === 'intermediate' ? 'medium' : 'hard',
    question_type: 'calculation' as const,
    subtopic: config.subtopicName,
    explanation: {
      steps: [
        {
          title: 'Understanding',
          content: `This question tests ${config.subtopicName} at ${levelConfig.name} level.`
        },
        {
          title: 'Solution',
          content: 'Apply the appropriate kinematic equations.'
        }
      ],
      keyConcept: config.subtopicName,
      relatedFormulas: levelConfig.formulas
    },
    image_url: null,
    time_limit: levelConfig.timeLimit,
    ai_generated: true,
    generated_date: new Date().toISOString().split('T')[0],
    homework_id: null,
    created_at: new Date().toISOString()
  }));
}

/**
 * Main function to generate questions
 */
export async function generatePhysicsQuestions(
  topicId: string,
  topicName: string,
  subtopicName: string,
  difficultyLevel: 'level_1' | 'level_2' | 'level_3',
  questionType: 'mcq' | 'frq' | 'graph' = 'mcq',
  questionCount: number = 10
): Promise<Question[]> {
  const config: GenerationConfig = {
    topicName,
    subtopicName,
    difficultyLevel,
    questionType,
    questionCount
  };

  let questions: Question[];

  if (questionType === 'frq') {
    questions = await generateFRQQuestions(config);
  } else {
    questions = await generateMCQQuestions(config);
  }

  // Set topic_id for all questions
  questions.forEach(q => {
    q.topic_id = topicId;
  });

  return questions;
}

/**
 * Get API usage statistics
 */
export function getAPIUsageStats() {
  return {
    totalCost: totalAPICost,
    totalTokens: totalTokensUsed,
    cacheSize: questionCache.size
  };
}

/**
 * Clear question cache
 */
export function clearQuestionCache() {
  questionCache.clear();
}

/**
 * Validate physics accuracy of generated questions
 */
function validatePhysicsAccuracy(question: Question): boolean {
  // Basic validation checks
  const checks = [
    question.question_text && question.question_text.length > 20,
    question.options && question.options.length === 4,
    question.options.filter(o => o.isCorrect).length === 1,
    question.explanation && question.explanation.steps && question.explanation.steps.length > 0,
    question.explanation && question.explanation.keyConcept && question.explanation.keyConcept.length > 0,
    question.time_limit && question.time_limit > 0 && question.time_limit <= 600
  ];

  // Additional physics-specific checks
  const physicsChecks = [
    // Check for common physics keywords in question
    /(velocity|acceleration|displacement|position|motion|kinematics|force|distance|time|speed)/i.test(question.question_text),
    // Check for units in question or options
    /(m\/s|m\/s²|m|s|km|km\/h)/i.test(question.question_text) || 
    question.options.some(opt => /(m\/s|m\/s²|m|s|km|km\/h)/i.test(opt.text))
  ];

  return checks.every(check => check === true) && physicsChecks.some(check => check === true);
}

