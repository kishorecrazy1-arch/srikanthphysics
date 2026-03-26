import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { sendSignupNotification } from '../services/signupService';
import {
  checkUserApproval,
  clearSigninNotificationDedupe,
  clearSigninWebhookLocalStorage,
  persistSigninWebhookToLocalStorage,
  type ApprovalCheckUser,
} from '../services/approvalCheckService';

/** Serialize profile fetches so SIGNED_IN and signIn never overwrite approval state mid-flight */
let fetchUserProfileChain: Promise<void> = Promise.resolve();

/**
 * When true, `onAuthStateChange(SIGNED_IN)` must not call fetchUserProfile — password signUp/signIn
 * already will. Avoids duplicate checkApproval + signin webhook hits (duplicate emails).
 */
let suppressSignedInFetch = false;

interface AuthState {
  user: User | null;
  loading: boolean;
  emailVerified: boolean | null; // null = unknown, true = verified, false = not verified
  approved: boolean | null; // null = unknown, true = approved, false = not approved (from Google Sheet)
  /** Set from n8n approval response: where to redirect (e.g. /dashboard or /foundation-dashboard) */
  approvalRedirectTo: string | null;
  approvalCourseType: string | null;
  approvalUser: ApprovalCheckUser | null;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'currentStreak' | 'longestStreak' | 'totalQuestions' | 'correctAnswers' | 'skillLevel' | 'createdAt'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  checkApproval: () => Promise<void>; // Check approval status from Google Sheet
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  emailVerified: null,
  approved: null,
  approvalRedirectTo: null,
  approvalCourseType: null,
  approvalUser: null,

  signUp: async (email, password, userData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          country_code: userData.countryCode,
          phone_number: userData.phoneNumber,
          grade: userData.grade,
          course_type: userData.courseType,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    suppressSignedInFetch = true;
    let signInError: { message: string } | null = null;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      signInError = error;

      if (signInError) {
        console.warn('Sign-in after signup failed:', signInError);
      }

      // n8n → Google Sheet (and optional notifications); do not block on failure
      sendSignupNotification({
        name: userData.name,
        email: userData.email,
        countryCode: userData.countryCode,
        phoneNumber: userData.phoneNumber,
        grade: userData.grade,
        courseType: userData.courseType,
      }).catch(error => {
        console.error('Failed to send signup notification:', error);
      });

      // Try to insert profile if trigger didn't create it
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
        })
        .select()
        .single();

      // If insert fails with duplicate error, trigger already created it - that's fine
      if (profileError && !profileError.message.includes('duplicate') && !profileError.message.includes('already exists')) {
        console.warn('Profile insert failed, but trigger may have created it:', profileError);
      }

      const topics = ['Kinematics', "Newton's Laws", 'Energy & Work', 'Momentum', 'Circular Motion', 'Rotational Motion'];
      const masteryInserts = topics.map(topic => ({
        user_id: authData.user!.id,
        topic,
        mastery: 0,
        questions_attempted: 0,
        questions_correct: 0,
      }));

      const { error: masteryError } = await supabase.from('topic_mastery').insert(masteryInserts);
      if (masteryError) {
        console.warn('topic_mastery insert after signup:', masteryError);
      }

      if (!signInError) {
        clearSigninWebhookLocalStorage();
        await get().fetchUserProfile();
      }
    } finally {
      suppressSignedInFetch = false;
    }
  },

  signIn: async (email, password) => {
    suppressSignedInFetch = true;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (result.error) throw result.error;
      const data = result.data;

      // Check email verification status
      if (data.user) {
        const emailVerified = data.user.email_confirmed_at !== null;
        set({ emailVerified });
      }

      clearSigninWebhookLocalStorage();
      await get().fetchUserProfile();

      const user = get().user;
      if (!user && data.user) {
        const approvalResult = await checkUserApproval({
          email: email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          userId: data.user.id,
        });

        set({
          approved: approvalResult.approved,
          approvalRedirectTo: approvalResult.redirectTo || null,
          approvalCourseType: approvalResult.courseType || null,
          approvalUser: approvalResult.user || null,
        });
        persistSigninWebhookToLocalStorage(approvalResult);
      }
      // With profile: fetchUserProfile → checkApproval already POSTed signin-check once.
      // Do not call sendSigninNotification (second POST) — same URL caused duplicate emails.
    } finally {
      suppressSignedInFetch = false;
    }
  },

  signOut: async () => {
    const currentUserId = get().user?.id;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearSigninWebhookLocalStorage();
    if (currentUserId) {
      clearSigninNotificationDedupe(currentUserId);
    }
    set({
      user: null,
      emailVerified: null,
      approved: null,
      approvalRedirectTo: null,
      approvalCourseType: null,
      approvalUser: null,
    });
  },

  checkApproval: async () => {
    const user = get().user;
    if (!user) {
      set({ approved: null });
      return;
    }

    try {
      const approvalResult = await checkUserApproval({
        email: user.email,
        name: user.name,
        userId: user.id,
        mobile: user.phoneNumber,
      });

      set({
        approved: approvalResult.approved,
        approvalRedirectTo: approvalResult.redirectTo || null,
        approvalCourseType: approvalResult.courseType || null,
        approvalUser: approvalResult.user || null,
      });
      persistSigninWebhookToLocalStorage(approvalResult);
    } catch (error) {
      console.error('Error checking approval:', error);
      set({
        approved: false,
        approvalRedirectTo: '/approval-pending',
        approvalCourseType: null,
        approvalUser: null,
      });
    }
  },

  fetchUserProfile: async () => {
    const run = async () => {
      try {
        set({ loading: true });
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          set({ user: null, loading: false, emailVerified: null });
          return;
        }

        // Check email verification status
        const emailVerified = authUser.email_confirmed_at !== null;
        set({ emailVerified });

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
              subscriptionStatus: profile.subscription_status || 'free',
              subscriptionExpiresAt: profile.subscription_expires_at,
              paymentDate: profile.payment_date,
            },
            loading: false,
          });

          await get().checkApproval();
        } else {
          // No profile found - user not authenticated or profile doesn't exist
          set({ user: null, loading: false, approved: null });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Always clear loading state, even on error or timeout
        set({ user: null, loading: false, emailVerified: null, approved: null });
      }
    };

    const p = fetchUserProfileChain.then(run);
    fetchUserProfileChain = p.catch(() => {});
    await p;
  },

  updateUserProfile: async (updates) => {
    const user = get().user;
    if (!user) return;


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

}));

supabase.auth.onAuthStateChange((event, session) => {
  // INITIAL_SESSION: restored session on page load — one fetch only (avoids duplicate with old IIFE + SIGNED_IN)
  if (event === 'INITIAL_SESSION') {
    if (session?.user) {
      useAuthStore.getState().fetchUserProfile();
    } else {
      useAuthStore.setState({
        loading: false,
        user: null,
        emailVerified: null,
        approved: null,
      });
    }
    return;
  }

  if (event === 'SIGNED_IN') {
    if (suppressSignedInFetch) {
      return;
    }
    clearSigninWebhookLocalStorage();
    useAuthStore.getState().fetchUserProfile();
    return;
  }

  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, approved: null });
  }
});

// Fast path when there is no session (INITIAL_SESSION may follow; this avoids stuck loading on public pages)
void supabase.auth.getSession().then(({ data: { session } }) => {
  if (!session) {
    useAuthStore.setState({ loading: false, user: null, emailVerified: null, approved: null });
  }
});
