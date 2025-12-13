/**
 * Practice Bank Generator
 * Generates and manages practice bank questions for each topic/subtopic/difficulty combination
 * 
 * Structure: 5 questions per (topic, subtopic, difficulty_level)
 */

import { supabase } from '../lib/supabase';
import { generateMCQQuestions } from './questionGenerator';
import type { Question } from '../types/enhanced';

interface PracticeBankConfig {
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  count: number; // Default: 5
}

export class PracticeBankGenerator {
  /**
   * Generate practice bank questions for a specific topic/subtopic/difficulty
   */
  async generatePracticeQuestions(config: PracticeBankConfig): Promise<Question[]> {
    const { topicId, subtopicId, subtopicName, difficulty, count = 5 } = config;

    console.log(`📚 Generating ${count} practice questions for:`, {
      topic: config.topicName,
      subtopic: subtopicName,
      difficulty
    });

    // Check if questions already exist
    const existing = await this.getExistingPracticeQuestions(topicId, subtopicId, difficulty);
    if (existing.length >= count) {
      console.log(`✅ Already have ${existing.length} practice questions for this combination`);
      return existing;
    }

    // Generate missing questions
    const needed = count - existing.length;
    console.log(`🔨 Generating ${needed} new practice questions...`);

    try {
      // Use AI generation if available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const hasOpenAIKey = !!apiKey && apiKey !== 'your-openai-api-key-here' && apiKey.length > 20;

      if (hasOpenAIKey) {
        const generated = await generateMCQQuestions(subtopicName, difficulty, needed);
        
        // Transform and store
        const questionsToInsert = generated.map((q: any) => {
          let optionsObj: Record<string, string> = {};
          if (q.content?.options) {
            optionsObj = { ...q.content.options };
          } else if (q.options) {
            optionsObj = typeof q.options === 'object' && !Array.isArray(q.options) 
              ? { ...q.options } 
              : q.options;
          }

          return {
            id: q.id || crypto.randomUUID(),
            topic_id: topicId,
            subtopic_id: subtopicId,
            segment_type: 'practice_bank', // Mark as practice bank question
            question_text: q.content?.text || q.question_text || '',
            options: optionsObj,
            correct_answer: q.content?.correct_answer || q.correct_answer || 'A',
            difficulty_level: difficulty,
            question_type: q.question_type || 'MCQ',
            solution_steps: q.solution?.steps || [],
            misconceptions: q.solution?.misconceptions || {},
            formulas_used: q.content?.formulas || q.formulas_used || [],
            bloom_taxonomy: q.metadata?.bloom_taxonomy || 'Apply',
            source_api: q.source_api || 'GPT-4o',
            ai_generated: true,
            generated_date: null, // Practice bank questions don't have dates
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          };
        });

        const { data: insertedQuestions, error } = await supabase
          .from('questions')
          .insert(questionsToInsert)
          .select();

        if (error) throw error;

        console.log(`✅ Generated and stored ${insertedQuestions?.length || 0} practice questions`);
        return [...existing, ...(insertedQuestions || [])];
      } else {
        // Fallback to sample questions
        return this.generateSamplePracticeQuestions(config);
      }
    } catch (error) {
      console.error('Error generating practice questions:', error);
      return this.generateSamplePracticeQuestions(config);
    }
  }

  /**
   * Get existing practice bank questions
   */
  async getExistingPracticeQuestions(
    topicId: string,
    subtopicId: string,
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced'
  ): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .eq('subtopic_id', subtopicId)
      .eq('segment_type', 'practice_bank')
      .eq('difficulty_level', difficulty);

    if (error) {
      console.error('Error fetching practice questions:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Generate sample practice questions (fallback)
   */
  private async generateSamplePracticeQuestions(config: PracticeBankConfig): Promise<Question[]> {
    const { topicId, subtopicId, subtopicName, difficulty, count = 5 } = config;

    // Level-specific question templates
    const level1Templates = [
      `What is the definition of ${subtopicName}?`,
      `A simple ${subtopicName} problem: Calculate the basic value.`,
      `Identify the key concept in ${subtopicName}.`,
      `What is the formula for ${subtopicName}?`,
      `Solve this basic ${subtopicName} calculation.`
    ];

    const level2Templates = [
      `Apply ${subtopicName} to solve this two-step problem.`,
      `Analyze this ${subtopicName} scenario with multiple variables.`,
      `Use ${subtopicName} concepts to find the solution.`,
      `Solve this ${subtopicName} problem requiring two calculations.`,
      `Apply ${subtopicName} principles to this intermediate scenario.`
    ];

    const level3Templates = [
      `Synthesize ${subtopicName} with other concepts to solve this complex problem.`,
      `Evaluate this multi-phase ${subtopicName} scenario.`,
      `Apply advanced ${subtopicName} reasoning to this complex situation.`,
      `Integrate multiple ${subtopicName} principles for this solution.`,
      `Analyze this complex ${subtopicName} system with multiple variables.`
    ];

    const templates = difficulty === 'Foundation' ? level1Templates :
                     difficulty === 'Intermediate' ? level2Templates :
                     level3Templates;

    const questions = Array.from({ length: count }, (_, index) => {
      const questionText = templates[index % templates.length].replace('${subtopicName}', subtopicName);
      
      const optionsObj: Record<string, string> = {
        'A': 'Option A',
        'B': 'Option B',
        'C': 'Option C',
        'D': 'Option D'
      };

      return {
        id: crypto.randomUUID(),
        topic_id: topicId,
        subtopic_id: subtopicId,
        segment_type: 'practice_bank',
        question_type: 'MCQ',
        difficulty_level: difficulty,
        question_text: `${questionText} (Sample question ${index + 1})`,
        options: optionsObj,
        correct_answer: ['A', 'B', 'C', 'D'][index % 4],
        solution_steps: [
          `Step 1: Understand the ${subtopicName} concept`,
          `Step 2: Apply the appropriate formula`,
          `Step 3: Calculate the answer`,
          `Step 4: Verify the solution`
        ],
        misconceptions: {},
        formulas_used: [`Formula for ${subtopicName}`],
        bloom_taxonomy: difficulty === 'Foundation' ? 'Remember' : 
                       difficulty === 'Intermediate' ? 'Apply' : 'Synthesize',
        source_api: 'Sample',
        ai_generated: false,
        generated_date: null,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };
    });

    const { data: insertedQuestions, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) {
      console.error('Error inserting sample practice questions:', error);
      return [];
    }

    return insertedQuestions || [];
  }

  /**
   * Generate practice bank for all topics/subtopics
   * This is a batch operation to populate the entire practice bank
   */
  async generateAllPracticeBanks(): Promise<void> {
    console.log('🚀 Starting practice bank generation for all topics...');

    // Get all topics and subtopics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, name');

    if (topicsError || !topics) {
      console.error('Error fetching topics:', topicsError);
      return;
    }

    const { data: subtopics, error: subtopicsError } = await supabase
      .from('subtopics')
      .select('id, name, topic_id');

    if (subtopicsError || !subtopics) {
      console.error('Error fetching subtopics:', subtopicsError);
      return;
    }

    const difficulties: ('Foundation' | 'Intermediate' | 'Advanced')[] = 
      ['Foundation', 'Intermediate', 'Advanced'];

    let totalGenerated = 0;

    // Generate for each topic/subtopic/difficulty combination
    for (const topic of topics) {
      const topicSubtopics = subtopics.filter(st => st.topic_id === topic.id);
      
      for (const subtopic of topicSubtopics) {
        for (const difficulty of difficulties) {
          try {
            const questions = await this.generatePracticeQuestions({
              topicId: topic.id,
              topicName: topic.name,
              subtopicId: subtopic.id,
              subtopicName: subtopic.name,
              difficulty,
              count: 5
            });
            totalGenerated += questions.length;
            console.log(`✅ Generated ${questions.length} questions for ${topic.name} > ${subtopic.name} (${difficulty})`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error generating for ${topic.name} > ${subtopic.name} (${difficulty}):`, error);
          }
        }
      }
    }

    console.log(`🎉 Practice bank generation complete! Total questions: ${totalGenerated}`);
  }
}























