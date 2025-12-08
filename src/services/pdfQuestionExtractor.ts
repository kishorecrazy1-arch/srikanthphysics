/**
 * PDF Question Extractor
 * Extracts questions and answers from uploaded PDF files
 * Uses AI to parse and format questions for quiz ingestion
 */

import { getOpenAIClient } from './questionGenerator';
import type { Question } from '../types/enhanced';

interface PDFExtractionResult {
  questions: Question[];
  errors: string[];
}

/**
 * Extract questions from PDF text content
 * Uses AI to parse PDF content and format as quiz questions
 */
export async function extractQuestionsFromPDF(
  pdfText: string,
  topicId?: string,
  subtopicId?: string
): Promise<PDFExtractionResult> {
  const openaiClient = await getOpenAIClient();
  if (!openaiClient) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `You are an AI assistant. Extract physics questions and answers from the following PDF text content.

Identify question types, answers, and explanations. Format as JSON for quiz ingestion.

Requirements:
- Extract all multiple-choice questions
- Identify correct answers
- Generate step-by-step explanations
- Infer difficulty level (Level 1/2/3) based on complexity
- Identify subtopic if not explicitly stated
- If no options given, generate plausible distractors

PDF Content:
${pdfText}

Output format (JSON object with "questions" array):
{
  "questions": [
    {
      "question_text": "Question text",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct_answer": "A|B|C|D",
      "explanation": "Stepwise solution or reasoning",
      "subtopic": "Topic name (if identifiable)",
      "difficulty": "Level 1|Level 2|Level 3",
      "solution_steps": [
        "Step 1: ...",
        "Step 2: ..."
      ],
      "formulas_used": ["formula1", "formula2"],
      "bloom_level": "Remember|Understand|Apply|Analyze|Synthesize|Evaluate"
    }
  ]
}

Important: Return valid JSON only. Extract all questions found in the PDF.`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting structured data from physics educational content. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent extraction
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    const extractedQuestions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    // Transform to Question format
    const questions: Question[] = [];
    const errors: string[] = [];

    for (const q of extractedQuestions) {
      try {
        // Map difficulty
        const difficultyMap: Record<string, 'Foundation' | 'Intermediate' | 'Advanced'> = {
          'Level 1': 'Foundation',
          'Level 2': 'Intermediate',
          'Level 3': 'Advanced',
          '1': 'Foundation',
          '2': 'Intermediate',
          '3': 'Advanced',
          'Basic': 'Foundation',
          'Intermediate': 'Intermediate',
          'Advanced': 'Advanced'
        };
        const difficulty = difficultyMap[q.difficulty] || 'Intermediate';

        questions.push({
          id: crypto.randomUUID(),
          subtopic_id: subtopicId || '',
          question_type: 'MCQ',
          difficulty_level: difficulty,
          content: {
            text: q.question_text || q.question || '',
            options: q.options || {},
            scenario: q.scenario || '',
            formulas: q.formulas_used || []
          },
          solution: {
            steps: q.solution_steps || (q.explanation ? [q.explanation] : []),
            final_answer: q.correct_answer || 'A',
            misconceptions: {},
            rubric: undefined
          },
          metadata: {
            bloom_taxonomy: q.bloom_level || 'Apply',
            time_estimate: 120,
            topic_tags: q.subtopic ? [q.subtopic] : [],
            difficulty_score: difficulty === 'Foundation' ? 1 : difficulty === 'Intermediate' ? 2 : 3,
            student_success_rate: 0
          },
          created_at: new Date().toISOString(),
          source_api: 'GPT-4o'
        });
      } catch (error: any) {
        errors.push(`Failed to process question: ${error.message}`);
      }
    }

    return { questions, errors };
  } catch (error: any) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Process uploaded PDF file
 * Note: This requires a PDF parsing library on the backend
 * For frontend, you'd need to use pdf-parse or similar
 */
export async function processPDFUpload(
  pdfFile: File,
  topicId?: string,
  subtopicId?: string
): Promise<PDFExtractionResult> {
  // Note: PDF parsing in browser requires a library like pdf.js or pdf-parse
  // This is a placeholder - implement based on your PDF parsing solution
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // For now, this is a placeholder
        // You'll need to integrate a PDF parsing library
        // Example: const pdfText = await parsePDF(e.target?.result);
        
        // Placeholder: Extract text (this won't work for binary PDFs)
        const pdfText = 'PDF text extraction requires a library like pdf.js';
        
        const result = await extractQuestionsFromPDF(pdfText, topicId, subtopicId);
        resolve(result);
      } catch (error: any) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(pdfFile);
  });
}












