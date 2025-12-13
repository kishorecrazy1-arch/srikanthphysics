/**
 * Daily Quiz Question Generator Script
 * 
 * This script generates daily quiz questions and answers for a specific topic/subtopic
 * Run this to pre-generate questions or generate them on-demand
 */

import { QuestionService } from '../services/questionService';
import { supabase } from '../lib/supabase';

interface GenerationConfig {
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  questionCount: number;
  date?: string; // Optional: specific date (defaults to today)
}

/**
 * Generate daily quiz questions for a specific topic/subtopic
 */
export async function generateDailyQuizQuestions(config: GenerationConfig) {
  const {
    topicId,
    topicName,
    subtopicId,
    subtopicName,
    difficulty,
    questionCount,
    date
  } = config;

  const questionService = new QuestionService();
  const today = date || new Date().toISOString().split('T')[0];

  console.log(`📚 Generating daily quiz questions for ${subtopicName}...`);
  console.log(`   Topic: ${topicName}`);
  console.log(`   Difficulty: ${difficulty}`);
  console.log(`   Count: ${questionCount}`);
  console.log(`   Date: ${today}`);

  try {
    // Check if questions already exist for today
    const { data: existingQuestions } = await supabase
      .from('questions')
      .select('id')
      .eq('topic_id', topicId)
      .eq('subtopic_id', subtopicId)
      .eq('difficulty_level', difficulty)
      .eq('generated_date', today)
      .eq('segment_type', 'basics');

    if (existingQuestions && existingQuestions.length >= questionCount) {
      console.log(`✅ Questions already exist for ${today} (${existingQuestions.length} questions)`);
      return existingQuestions;
    }

    // Generate questions using QuestionService
    const questions = await questionService.batchGenerateQuestions(
      subtopicId,
      subtopicName,
      difficulty,
      questionCount,
      'MCQ'
    );

    if (!questions || questions.length === 0) {
      throw new Error('No questions generated');
    }

    console.log(`✅ Generated ${questions.length} questions`);

    // Transform to database format
    const questionsToInsert = questions.map((q, index) => ({
      id: q.id || crypto.randomUUID(),
      topic_id: topicId,
      subtopic_id: subtopicId,
      question_type: q.question_type,
      difficulty_level: q.difficulty_level,
      question_text: q.content.text,
      options: q.content.options || {},
      correct_answer: q.solution.final_answer,
      solution_steps: q.solution.steps,
      misconceptions: q.solution.misconceptions || {},
      formulas_used: q.content.formulas || [],
      bloom_taxonomy: q.metadata.bloom_taxonomy,
      source_api: q.source_api,
      segment_type: 'basics',
      generated_date: today,
      created_at: q.created_at || new Date().toISOString(),
      last_updated: new Date().toISOString()
    }));

    // Insert into database
    const { data: insertedQuestions, error } = await supabase
      .from('questions')
      .upsert(questionsToInsert, { onConflict: 'id' })
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully stored ${insertedQuestions?.length || 0} questions in database`);
    
    // Log questions with answers
    console.log('\n📝 Generated Questions & Answers:');
    insertedQuestions?.forEach((q, index) => {
      console.log(`\n${index + 1}. ${q.question_text}`);
      console.log(`   Options: ${JSON.stringify(q.options)}`);
      console.log(`   ✅ Correct Answer: ${q.correct_answer}`);
      console.log(`   Solution Steps: ${q.solution_steps?.length || 0} steps`);
      console.log(`   Formulas: ${q.formulas_used?.join(', ') || 'None'}`);
    });

    return insertedQuestions;
  } catch (error) {
    console.error('❌ Error generating daily quiz questions:', error);
    throw error;
  }
}

/**
 * Generate daily quiz questions for multiple subtopics
 */
export async function generateDailyQuizForMultipleSubtopics(
  topicId: string,
  topicName: string,
  subtopics: Array<{ id: string; name: string }>,
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' = 'Intermediate',
  questionsPerSubtopic: number = 10
) {
  console.log(`\n🚀 Generating daily quiz for ${topicName}`);
  console.log(`   Subtopics: ${subtopics.length}`);
  console.log(`   Questions per subtopic: ${questionsPerSubtopic}`);
  console.log(`   Difficulty: ${difficulty}\n`);

  const results = [];

  for (const subtopic of subtopics) {
    try {
      const questions = await generateDailyQuizQuestions({
        topicId,
        topicName,
        subtopicId: subtopic.id,
        subtopicName: subtopic.name,
        difficulty,
        questionCount: questionsPerSubtopic
      });

      results.push({
        subtopic: subtopic.name,
        success: true,
        count: questions?.length || 0
      });
    } catch (error) {
      console.error(`❌ Failed for ${subtopic.name}:`, error);
      results.push({
        subtopic: subtopic.name,
        success: false,
        error: (error as Error).message
      });
    }
  }

  console.log('\n📊 Generation Summary:');
  results.forEach(result => {
    if (result.success) {
      console.log(`   ✅ ${result.subtopic}: ${result.count} questions`);
    } else {
      console.log(`   ❌ ${result.subtopic}: Failed - ${result.error}`);
    }
  });

  return results;
}

/**
 * Generate daily quiz for AP Physics 1 - Kinematics (example)
 */
export async function generateDailyQuizForKinematics() {
  // Get Kinematics topic and subtopics from database
  const { data: topic } = await supabase
    .from('topics')
    .select('*')
    .eq('name', 'Kinematics')
    .single();

  if (!topic) {
    throw new Error('Kinematics topic not found. Please run SUPABASE_TOPICS_SETUP.sql first.');
  }

  const { data: subtopics } = await supabase
    .from('subtopics')
    .select('*')
    .eq('topic_id', topic.id)
    .order('display_order');

  if (!subtopics || subtopics.length === 0) {
    throw new Error('No subtopics found for Kinematics. Please run SUPABASE_TOPICS_SETUP.sql first.');
  }

  return await generateDailyQuizForMultipleSubtopics(
    topic.id,
    topic.name,
    subtopics.map(st => ({ id: st.id, name: st.name })),
    'Intermediate',
    10
  );
}

// Example usage (can be called from browser console or as a script)
if (import.meta.hot) {
  // Dev mode - expose for testing
  (window as any).generateDailyQuiz = {
    generate: generateDailyQuizQuestions,
    generateMultiple: generateDailyQuizForMultipleSubtopics,
    generateKinematics: generateDailyQuizForKinematics
  };
}























