import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  testMode: boolean;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'currentStreak' | 'longestStreak' | 'totalQuestions' | 'correctAnswers' | 'skillLevel' | 'createdAt'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  enableTestMode: () => void;
  disableTestMode: () => void;
}

// Load test mode from localStorage on initialization
const getInitialTestMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('testMode') === 'true';
  }
  return false;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  testMode: getInitialTestMode(),

  signUp: async (email, password, userData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        country_code: userData.countryCode,
        phone_number: userData.phoneNumber,
        grade: userData.grade,
        course_type: userData.courseType,
      });

    if (profileError) throw profileError;

    const topics = ['Kinematics', "Newton's Laws", 'Energy & Work', 'Momentum', 'Circular Motion', 'Rotational Motion'];
    const masteryInserts = topics.map(topic => ({
      user_id: authData.user!.id,
      topic,
      mastery: 0,
      questions_attempted: 0,
      questions_correct: 0,
    }));

    await supabase.from('topic_mastery').insert(masteryInserts);

    await get().fetchUserProfile();
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    await get().fetchUserProfile();
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  fetchUserProfile: async () => {
    try {
      set({ loading: true });
      
      // Check if test mode is enabled
      if (get().testMode) {
        const testUser: User = {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          countryCode: '+1',
          phoneNumber: '1234567890',
          grade: 11,
          courseType: 'ap_physics_1',
          currentStreak: 5,
          longestStreak: 10,
          totalQuestions: 150,
          correctAnswers: 120,
          skillLevel: 75,
          createdAt: new Date().toISOString(),
        };
        set({ user: testUser, loading: false });
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        set({ user: null, loading: false });
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        set({
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            countryCode: profile.country_code,
            phoneNumber: profile.phone_number,
            grade: profile.grade,
            courseType: profile.course_type,
            currentStreak: profile.current_streak,
            longestStreak: profile.longest_streak,
            totalQuestions: profile.total_questions,
            correctAnswers: profile.correct_answers,
            skillLevel: profile.skill_level,
            createdAt: profile.created_at,
          },
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ user: null, loading: false });
    }
  },

  updateUserProfile: async (updates) => {
    const user = get().user;
    if (!user) return;

    // Don't update database in test mode
    if (get().testMode) {
      set({ user: { ...user, ...updates } });
      return;
    }

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.countryCode) dbUpdates.country_code = updates.countryCode;
    if (updates.phoneNumber) dbUpdates.phone_number = updates.phoneNumber;
    if (updates.grade) dbUpdates.grade = updates.grade;
    if (updates.courseType) dbUpdates.course_type = updates.courseType;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.totalQuestions !== undefined) dbUpdates.total_questions = updates.totalQuestions;
    if (updates.correctAnswers !== undefined) dbUpdates.correct_answers = updates.correctAnswers;
    if (updates.skillLevel !== undefined) dbUpdates.skill_level = updates.skillLevel;

    const { error } = await supabase
      .from('user_profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) throw error;

    set({ user: { ...user, ...updates } });
  },

  enableTestMode: () => {
    const testUser: User = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      countryCode: '+1',
      phoneNumber: '1234567890',
      grade: 11,
      courseType: 'ap_physics_1',
      currentStreak: 5,
      longestStreak: 10,
      totalQuestions: 150,
      correctAnswers: 120,
      skillLevel: 75,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('testMode', 'true');
    set({ user: testUser, testMode: true, loading: false });
  },

  disableTestMode: () => {
    localStorage.removeItem('testMode');
    set({ user: null, testMode: false });
  },
}));

supabase.auth.onAuthStateChange((event) => {
  (() => {
    // Don't interfere with test mode
    if (useAuthStore.getState().testMode) return;
    
    if (event === 'SIGNED_IN') {
      useAuthStore.getState().fetchUserProfile();
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null });
    }
  })();
});

// Initialize - check test mode first, then fetch profile if not in test mode
const initAuth = () => {
  const state = useAuthStore.getState();
  if (state.testMode) {
    // Test mode is enabled, set up test user
    const testUser: User = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      countryCode: '+1',
      phoneNumber: '1234567890',
      grade: 11,
      courseType: 'ap_physics_1',
      currentStreak: 5,
      longestStreak: 10,
      totalQuestions: 150,
      correctAnswers: 120,
      skillLevel: 75,
      createdAt: new Date().toISOString(),
    };
    useAuthStore.setState({ user: testUser, loading: false });
  } else {
    state.fetchUserProfile();
  }
};

initAuth();
