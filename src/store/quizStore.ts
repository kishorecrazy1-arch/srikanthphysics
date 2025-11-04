import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Question, QuizType, QuizAnswer } from '../types';
import { sampleQuestions } from '../data/questions';

interface QuizState {
  currentSessionId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizType: QuizType | null;
  startTime: number;
  questionStartTime: number;
  showExplanation: boolean;
  startQuiz: (type: QuizType, questionCount: number) => Promise<void>;
  submitAnswer: (questionId: number, answer: string, confidence: number) => void;
  nextQuestion: () => void;
  completeQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentSessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  quizType: null,
  startTime: 0,
  questionStartTime: 0,
  showExplanation: false,

  startQuiz: async (type, questionCount) => {
    const selectedQuestions = [...sampleQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        quiz_type: type,
        status: 'in_progress',
        total_questions: questionCount,
      })
      .select()
      .single();

    if (error) throw error;

    set({
      currentSessionId: session.id,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: [],
      quizType: type,
      startTime: Date.now(),
      questionStartTime: Date.now(),
      showExplanation: false,
    });
  },

  submitAnswer: (questionId, answer, confidence) => {
    const state = get();
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = answer === question.correctAnswer;
    const timeSpent = Math.floor((Date.now() - state.questionStartTime) / 1000);

    const newAnswer: QuizAnswer = {
      questionId,
      selectedAnswer: answer,
      confidence,
      timeSpent,
      isCorrect,
    };

    set({
      answers: [...state.answers, newAnswer],
      showExplanation: true,
    });
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        questionStartTime: Date.now(),
        showExplanation: false,
      });
    }
  },

  completeQuiz: async () => {
    const state = get();
    if (!state.currentSessionId) return;

    const totalTimeSpent = Math.floor((Date.now() - state.startTime) / 1000);
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / state.questions.length) * 100);

    await supabase
      .from('quiz_sessions')
      .update({
        status: 'completed',
        score,
        time_spent: totalTimeSpent,
        completed_at: new Date().toISOString(),
      })
      .eq('id', state.currentSessionId);

    for (const answer of state.answers) {
      await supabase.from('quiz_answers').insert({
        session_id: state.currentSessionId,
        question_id: answer.questionId,
        selected_answer: answer.selectedAnswer,
        confidence: answer.confidence,
        time_spent: answer.timeSpent,
        is_correct: answer.isCorrect,
      });
    }

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('user_profiles')
        .update({
          total_questions: profile.total_questions + state.questions.length,
          correct_answers: profile.correct_answers + correctCount,
          last_active: new Date().toISOString(),
        })
        .eq('id', userId);
    }

    const topicStats: { [key: string]: { attempted: number; correct: number } } = {};
    state.questions.forEach((q, idx) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { attempted: 0, correct: 0 };
      }
      topicStats[q.topic].attempted++;
      if (state.answers[idx]?.isCorrect) {
        topicStats[q.topic].correct++;
      }
    });

    for (const [topic, stats] of Object.entries(topicStats)) {
      const { data: existing } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('topic', topic)
        .maybeSingle();

      if (existing) {
        const newAttempted = existing.questions_attempted + stats.attempted;
        const newCorrect = existing.questions_correct + stats.correct;
        const newMastery = Math.round((newCorrect / newAttempted) * 100);

        await supabase
          .from('topic_mastery')
          .update({
            questions_attempted: newAttempted,
            questions_correct: newCorrect,
            mastery: newMastery,
            last_practiced: new Date().toISOString(),
          })
          .eq('id', existing.id);
      }
    }
  },

  resetQuiz: () => {
    set({
      currentSessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      quizType: null,
      startTime: 0,
      questionStartTime: 0,
      showExplanation: false,
    });
  },
}));
