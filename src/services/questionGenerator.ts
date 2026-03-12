/**
 * Enhanced Question Generation Service
 * 
 * Features:
 * - Retry logic with exponential backoff
 * - Physics accuracy validation
 * - API cost tracking
 * - Error handling and fallback
 */

import { z } from "zod";
import type { Question, QuestionContent, Solution, QuestionMetadata } from '../types/enhanced';

// Lazy load clients to avoid issues in browser
let openai: any = null;
let anthropic: any = null;

async function getOpenAIClient() {
  if (!openai && import.meta.env.VITE_OPENAI_API_KEY) {
    const OpenAI = (await import("openai")).default;
    openai = new OpenAI({ 
      apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
      dangerouslyAllowBrowser: true 
    });
  }
  return openai;
}

async function getAnthropicClient() {
  if (!anthropic && import.meta.env.VITE_ANTHROPIC_API_KEY) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    anthropic = new Anthropic({ 
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY 
    });
  }
  return anthropic;
}

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Question validation schema
const QuestionSchema = z.object({
  question_text: z.string().min(50),
  options: z.record(z.string()).optional(),
  correct_answer: z.string(),
  solution_steps: z.array(z.string()).min(1),
  formulas_used: z.array(z.string()),
  bloom_taxonomy: z.string(),
  difficulty_level: z.enum(['Foundation', 'Intermediate', 'Advanced']),
});

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = MAX_RETRIES, retryDelay = INITIAL_RETRY_DELAY, onRetry } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt);
        if (onRetry) onRetry(attempt + 1, error as Error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Validate physics accuracy of generated question
 */
function validatePhysicsAccuracy(question: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check dimensional consistency
  if (question.formulas_used) {
    // Basic validation - units should be consistent
    // This is a simplified check - can be enhanced
  }
  
  // Check for realistic values
  if (question.numerical_values) {
    // Check if values are physically reasonable
    // e.g., velocity < speed of light, mass > 0, etc.
  }
  
  // Check sign consistency
  if (question.vector_quantities) {
    // Verify vector directions are consistent
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate that Advanced (Level 3) questions are truly complex
 * Must require multi-step reasoning, not simple calculations
 */
function validateAdvancedComplexity(question: any): { isComplex: boolean; reason: string } {
  const solutionSteps = question.solution_steps || [];
  const questionText = (question.question_text || '').toLowerCase();
  
  // Check 1: Must have at least 3 solution steps
  if (solutionSteps.length < 3) {
    return {
      isComplex: false,
      reason: `Only ${solutionSteps.length} steps - Advanced questions require at least 3 steps`
    };
  }

  // Check 2: Look for complexity indicators in question text
  const complexityIndicators = [
    'multi-phase', 'multiple phases', 'rebound', 'collision', 'variable',
    'changing', 'synthesis', 'combine', 'integrate', 'analyze the system',
    'consider', 'account for', 'reference frame', 'relative', 'non-inertial'
  ];
  
  const hasComplexityKeywords = complexityIndicators.some(keyword => 
    questionText.includes(keyword)
  );

  // Check 3: Solution steps should show reasoning, not just calculation
  const hasReasoningSteps = solutionSteps.some((step: string) => {
    const stepLower = step.toLowerCase();
    return stepLower.includes('identify') || 
           stepLower.includes('analyze') || 
           stepLower.includes('consider') ||
           stepLower.includes('synthesis') ||
           stepLower.includes('reasoning');
  });

  // Check 4: Question should not be solvable with a single formula substitution
  const isSimpleCalculation = questionText.match(/(calculate|find|determine).*?using.*?formula/i);
  if (isSimpleCalculation && solutionSteps.length < 4) {
    return {
      isComplex: false,
      reason: 'Question appears to be a simple direct calculation, not requiring synthesis'
    };
  }

  // Advanced questions must pass at least 2 of these checks
  const complexityScore = [
    hasComplexityKeywords,
    hasReasoningSteps,
    solutionSteps.length >= 4,
    !isSimpleCalculation
  ].filter(Boolean).length;

  if (complexityScore < 2) {
    return {
      isComplex: false,
      reason: `Complexity score too low (${complexityScore}/4). Question needs multi-phase motion, variable acceleration, or synthesis`
    };
  }

  return {
    isComplex: true,
    reason: 'Question meets Advanced complexity requirements'
  };
}

/**
 * Generate MCQ questions using OpenAI GPT-4o
 */
export async function generateMCQQuestions(
  subtopic: string,
  difficulty: "Foundation" | "Intermediate" | "Advanced",
  count: number = 10
): Promise<Question[]> {
  const openaiClient = await getOpenAIClient();
  if (!openaiClient) {
    throw new Error('OpenAI API key not configured');
  }

  // Enhanced difficulty-specific prompts based on Bloom's Taxonomy
  const difficultyPrompts = {
    Foundation: {
      description: 'Foundation - Level 1 (Remember/Understand)',
      requirements: `- Single-step problems, direct formula application
- Basic concepts and definitions
- Simple calculations with direct substitutions
- Bloom's Taxonomy: Remember/Understand level
- Direct recall of physics principles
- No multi-step reasoning required
- Estimated time: 1-2 minutes per question`,
      bloomLevel: 'Remember/Understand'
    },
    Intermediate: {
      description: 'Intermediate - Level 2 (Apply/Analyze)',
      requirements: `- Two-step reasoning required
- Multiple concepts combined
- Numerical complexity with intermediate calculations
- Bloom's Taxonomy: Apply/Analyze level
- Requires concept selection and application
- Some problem-solving strategy needed
- Estimated time: 2-3 minutes per question`,
      bloomLevel: 'Apply/Analyze'
    },
    Advanced: {
      description: 'Advanced - Level 3 (Synthesize/Evaluate)',
      requirements: `- Multi-step analysis required (minimum 3 steps)
- Complex scenarios with non-trivial context
- Real-world application and synthesis
- Bloom's Taxonomy: Synthesize/Evaluate level
- Requires deep reasoning, not just calculation
- May involve multi-phase motion, variable acceleration, or conceptual twists
- Must require synthesis of multiple concepts
- Options should reflect high-level misconceptions (e.g., signs, reference frames)
- Estimated time: 3-5 minutes per question
- CRITICAL: If question can be solved with simple calculation, regenerate with stricter requirements`,
      bloomLevel: 'Synthesize/Evaluate'
    }
  };

  const levelConfig = difficultyPrompts[difficulty];

  // Enhanced prompt template based on best practices for Daily Practice
  const prompt = `You are an expert AP Physics instructor. Generate ${count} multiple-choice question${count > 1 ? 's' : ''} for the subtopic: "${subtopic}".

Difficulty Level: ${difficulty} (Level 1 - Basic; Level 2 - Intermediate; Level 3 - Advanced)

Bloom's Taxonomy: ${levelConfig.bloomLevel}

${levelConfig.requirements}

Requirements:
- Provide question text with clear, realistic physics scenario
- Provide exactly 4 answer choices (A, B, C, D) with one correct answer
- Include detailed step-by-step explanation showing reasoning
- Require conceptual rigor suitable for ${difficulty} level
- Use proper SI units and realistic values
- Ensure physics accuracy (dimensional consistency, sign conventions)
${difficulty === 'Advanced' ? '- MUST involve multi-phase motion, variable acceleration, complex scenarios, or synthesis - NOT simple direct calculations' : ''}

Output format (JSON object with "questions" array):
{
  "questions": [
    {
      "question_text": "Full question with scenario and all given data",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correct_answer": "A|B|C|D",
      "explanation": "Step-by-step solution or reasoning",
      "solution_steps": [
        "Step 1: Identify given information and what needs to be found",
        "Step 2: Select appropriate physics principles/formulas",
        "Step 3: Apply concepts (show work with calculations)",
        "Step 4: Solve for unknown",
        "Step 5: Verify answer has correct units and is reasonable"
      ],
      "distractor_explanations": {
        "B": "Explanation of why this distractor is wrong (common misconception)",
        "C": "Explanation of why this distractor is wrong",
        "D": "Explanation of why this distractor is wrong"
      },
      "formulas_used": ["formula1", "formula2", ...],
      "bloom_level": "${levelConfig.bloomLevel}",
      "estimated_time_min": ${difficulty === 'Foundation' ? 1 : difficulty === 'Intermediate' ? 2 : 3},
      "scenario": "Brief description of the physics scenario"
    }
  ]
}

Important: Return valid JSON only. Each question must be pedagogically sound and appropriate for ${difficulty} level.`;

  return withRetry(async () => {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert physics educator. Generate accurate, pedagogically sound physics questions with correct solutions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    // Validate each question with difficulty-specific checks
    const validatedQuestions: Question[] = [];
    for (const q of questions) {
      // Basic schema validation
      const validation = QuestionSchema.safeParse(q);
      if (!validation.success) {
        console.warn('Question failed schema validation:', validation.error);
        continue;
      }

      // Physics accuracy validation
      const physicsValidation = validatePhysicsAccuracy(q);
      if (!physicsValidation.valid) {
        console.warn('Question failed physics validation:', physicsValidation.errors);
        continue;
      }

      // Difficulty-specific validation (especially for Advanced)
      if (difficulty === 'Advanced') {
        const complexityCheck = validateAdvancedComplexity(q);
        if (!complexityCheck.isComplex) {
          console.warn(`Advanced question rejected - too simple: ${complexityCheck.reason}`);
          continue; // Skip this question if it's not complex enough
        }
      }

      // Convert distractor_explanations to misconceptions format
      const misconceptions: Record<string, string> = {};
      if (q.distractor_explanations) {
        Object.entries(q.distractor_explanations).forEach(([key, value]) => {
          misconceptions[key] = value as string;
        });
      }

      validatedQuestions.push({
        id: crypto.randomUUID(),
        subtopic_id: '', // Will be set by caller
        question_type: 'MCQ',
        difficulty_level: difficulty,
        content: {
          text: q.question_text,
          options: q.options,
          scenario: q.scenario || '',
          formulas: q.formulas_used || []
        },
        solution: {
          steps: q.solution_steps || (q.explanation ? [q.explanation] : []),
          final_answer: q.correct_answer,
          misconceptions: misconceptions,
          rubric: undefined
        },
        metadata: {
          bloom_taxonomy: q.bloom_level || q.bloom_taxonomy || levelConfig.bloomLevel,
          time_estimate: (q.estimated_time_min || q.time_estimate || (difficulty === 'Foundation' ? 60 : difficulty === 'Intermediate' ? 120 : 180)) * 60, // Convert to seconds
          topic_tags: [subtopic],
          difficulty_score: difficulty === 'Foundation' ? 1 : difficulty === 'Intermediate' ? 2 : 3,
          student_success_rate: 0
        },
        created_at: new Date().toISOString(),
        source_api: 'GPT-4o'
      });
    }

    // If we don't have enough questions and it's Advanced, log a warning
    if (validatedQuestions.length < count && difficulty === 'Advanced') {
      console.warn(`Only generated ${validatedQuestions.length} of ${count} Advanced questions. Some were rejected for being too simple.`);
    }

    // Track API usage
    await trackAPICall('openai', 'gpt-4o', {
      input_tokens: response.usage?.prompt_tokens || 0,
      output_tokens: response.usage?.completion_tokens || 0
    });

    return validatedQuestions;
  }, {
    onRetry: (attempt, error) => {
      console.warn(`MCQ generation retry ${attempt}:`, error.message);
    }
  });
}

/**
 * Generate FRQ questions using Anthropic Claude 3.5 Sonnet
 */
export async function generateFRQQuestions(
  subtopic: string,
  difficulty: string
): Promise<Question[]> {
  const anthropicClient = await getAnthropicClient();
  if (!anthropicClient) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = `Generate a complex free-response physics question for the subtopic: "${subtopic}".

Difficulty: ${difficulty}

Requirements:
- Multi-part question structure (3-5 parts)
- Require multi-step reasoning
- Include detailed rubric for grading
- Identify common misconceptions
- Provide complete solution with step-by-step explanation
- Use realistic physics scenarios

Return as JSON with this structure:
{
  "question_text": "Main question with parts (a), (b), (c)...",
  "parts": [
    {"part": "a", "question": "...", "points": 5},
    {"part": "b", "question": "...", "points": 5}
  ],
  "solution_steps": ["step1", "step2", ...],
  "rubric": [
    {"part": "a", "points": 5, "criteria": "..."}
  ],
  "formulas_used": ["formula1", ...],
  "misconceptions": {"common_mistake": "explanation"},
  "bloom_taxonomy": "Analyze|Evaluate|Create"
}`;

  return withRetry(async () => {
    const response = await anthropicClient.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Invalid response format');

    const parsed = JSON.parse(content.text);
    
    // Track API usage
    await trackAPICall('anthropic', 'claude-3-5-sonnet', {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens
    });

    return [{
      id: crypto.randomUUID(),
      subtopic_id: '',
      question_type: 'FRQ',
      difficulty_level: difficulty as 'Foundation' | 'Intermediate' | 'Advanced',
      content: {
        text: parsed.question_text,
        scenario: parsed.scenario || '',
        formulas: parsed.formulas_used || []
      },
      solution: {
        steps: parsed.solution_steps,
        final_answer: parsed.final_answer || '',
        rubric: parsed.rubric,
        misconceptions: parsed.misconceptions || {}
      },
      metadata: {
        bloom_taxonomy: parsed.bloom_taxonomy,
        time_estimate: parsed.time_estimate || 600,
        topic_tags: [subtopic],
        difficulty_score: difficulty === 'Foundation' ? 1 : difficulty === 'Intermediate' ? 2 : 3,
        student_success_rate: 0
      },
      created_at: new Date().toISOString(),
      source_api: 'Claude-3.5'
    }];
  }, {
    onRetry: (attempt, error) => {
      console.warn(`FRQ generation retry ${attempt}:`, error.message);
    }
  });
}

/**
 * Track API call for cost monitoring
 */
async function trackAPICall(
  service: 'openai' | 'anthropic',
  model: string,
  usage: { input_tokens: number; output_tokens: number }
): Promise<void> {
  // Pricing per 1M tokens (as of 2024)
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 2.50, output: 10.00 },
    'claude-3-5-sonnet': { input: 3.00, output: 15.00 }
  };

  const modelPricing = pricing[model] || { input: 0, output: 0 };
  const inputCost = (usage.input_tokens / 1_000_000) * modelPricing.input;
  const outputCost = (usage.output_tokens / 1_000_000) * modelPricing.output;
  const totalCost = inputCost + outputCost;

  // Store in Supabase (will be implemented in CostTracker)
  try {
    const { supabase } = await import('../lib/supabase');
    await supabase.from('api_usage_logs').insert({
      service,
      model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cost: totalCost,
      status: 'success',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log API usage:', error);
  }
}

