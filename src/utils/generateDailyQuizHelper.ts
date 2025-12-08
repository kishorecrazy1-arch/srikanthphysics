/**
 * Helper function to generate daily quiz questions
 * This can be called from components or as a standalone utility
 */

import { generateDailyQuizQuestions } from '../scripts/generateDailyQuiz';
import { supabase } from '../lib/supabase';

/**
 * Generate daily quiz questions for the current user's selected topic
 */
export async function generateUserDailyQuiz(
  userId: string,
  topicId?: string,
  subtopicId?: string
) {
  try {
    // If topic/subtopic not provided, get from user preferences
    if (!topicId || !subtopicId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('course_type')
        .eq('id', userId)
        .single();

      // Get default topic for course
      const { data: topics } = await supabase
        .from('topics')
        .select('*')
        .order('display_order')
        .limit(1);

      if (!topics || topics.length === 0) {
        throw new Error('No topics available');
      }

      topicId = topics[0].id;

      // Get first subtopic
      const { data: subtopics } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topicId)
        .order('display_order')
        .limit(1);

      if (!subtopics || subtopics.length === 0) {
        throw new Error('No subtopics available');
      }

      subtopicId = subtopics[0].id;
    }

    // Get topic and subtopic details
    const { data: topic } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    const { data: subtopic } = await supabase
      .from('subtopics')
      .select('*')
      .eq('id', subtopicId)
      .single();

    if (!topic || !subtopic) {
      throw new Error('Topic or subtopic not found');
    }

    // Generate questions
    const questions = await generateDailyQuizQuestions({
      topicId: topic.id,
      topicName: topic.name,
      subtopicId: subtopic.id,
      subtopicName: subtopic.name,
      difficulty: 'Intermediate', // Can be made dynamic based on user level
      questionCount: 10
    });

    return questions;
  } catch (error) {
    console.error('Error generating user daily quiz:', error);
    throw error;
  }
}

/**
 * Get today's daily quiz questions with answers
 */
export async function getTodaysDailyQuiz(
  topicId: string,
  subtopicId: string,
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' = 'Intermediate'
) {
  const today = new Date().toISOString().split('T')[0];

  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .eq('difficulty_level', difficulty)
    .eq('segment_type', 'basics')
    .eq('generated_date', today)
    .order('created_at');

  if (error) {
    throw error;
  }

  // If no questions exist, generate them
  if (!questions || questions.length === 0) {
    const { data: topic } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    const { data: subtopic } = await supabase
      .from('subtopics')
      .select('*')
      .eq('id', subtopicId)
      .single();

    if (!topic || !subtopic) {
      throw new Error('Topic or subtopic not found');
    }

    return await generateDailyQuizQuestions({
      topicId: topic.id,
      topicName: topic.name,
      subtopicId: subtopic.id,
      subtopicName: subtopic.name,
      difficulty,
      questionCount: 10,
      date: today
    });
  }

  return questions;
}












