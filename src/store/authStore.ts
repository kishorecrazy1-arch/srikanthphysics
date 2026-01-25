import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { sendSignupNotification } from '../services/signupService';
import { sendSigninNotification } from '../services/signinService';
import { checkUserApproval } from '../services/approvalCheckService';

interface AuthState {
  user: User | null;
  loading: boolean;
  emailVerified: boolean | null; // null = unknown, true = verified, false = not verified
  approved: boolean | null; // null = unknown, true = approved, false = not approved (from Google Sheet)
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

  signUp: async (email, password, userData) => {
    // Include user data in metadata for trigger function
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
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    // Try to sign in immediately after signup (no email confirmation required)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If sign-in fails, user might need to confirm email, but we'll still proceed
      // The trigger will create the profile
      console.warn('Sign-in after signup failed:', signInError);
    }

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

    await supabase.from('topic_mastery').insert(masteryInserts);

    // Send signup notification to srikanthsacademyforphysics@gmail.com
    // This happens in the background and doesn't block signup
    sendSignupNotification({
      name: userData.name,
      email: userData.email,
      countryCode: userData.countryCode,
      phoneNumber: userData.phoneNumber,
      grade: userData.grade,
      courseType: userData.courseType,
    }).catch(error => {
      console.error('Failed to send signup notification:', error);
      // Don't throw - signup should succeed even if notification fails
    });

    // Fetch user profile if sign-in was successful
    if (!signInError) {
    await get().fetchUserProfile();
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Check email verification status
    if (data.user) {
      const emailVerified = data.user.email_confirmed_at !== null;
      set({ emailVerified });
    }
    
    await get().fetchUserProfile();
    
    // Check approval status from Google Sheet via n8n
    const user = get().user;
    if (user) {
      // Check approval status
      const approvalResult = await checkUserApproval({
        email: user.email,
        name: user.name,
        userId: user.id,
        mobile: user.phoneNumber,
      });
      
      set({ approved: approvalResult.approved });
      
      // Send sign-in notification to srikanthsacademyforphysics@gmail.com
      // This happens in the background and doesn't block sign-in
      sendSigninNotification({
        name: user.name,
        email: user.email,
        userId: user.id,
        lastSignIn: data.user.last_sign_in_at || undefined,
      }).catch(error => {
        console.error('Failed to send sign-in notification:', error);
        // Don't throw - sign-in should succeed even if notification fails
      });
    } else if (data.user) {
      // If user profile not loaded yet, check with auth data
      const approvalResult = await checkUserApproval({
        email: email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        userId: data.user.id,
      });
      
      set({ approved: approvalResult.approved });
      
      // Send sign-in notification
      sendSigninNotification({
        name: data.user.user_metadata?.name || email.split('@')[0],
        email: email,
        userId: data.user.id,
        lastSignIn: data.user.last_sign_in_at || undefined,
      }).catch(error => {
        console.error('Failed to send sign-in notification:', error);
      });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, emailVerified: null, approved: null });
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
      
      set({ approved: approvalResult.approved });
    } catch (error) {
      console.error('Error checking approval:', error);
      // Don't update approval status on error
    }
  },

  fetchUserProfile: async () => {
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
        
        // Check approval status after profile is loaded
        get().checkApproval();
      } else {
        // No profile found - user not authenticated or profile doesn't exist
        set({ user: null, loading: false, approved: null });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Always clear loading state, even on error or timeout
      set({ user: null, loading: false, emailVerified: null, approved: null });
    }
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

supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      useAuthStore.getState().fetchUserProfile();
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null, approved: null });
    }
});

// Initialize - fetch user profile with timeout fallback
(async () => {
  try {
    // Set a timeout to ensure loading doesn't hang forever
    const timeoutId = setTimeout(() => {
      console.warn('Auth check taking too long, clearing loading state');
      useAuthStore.setState({ loading: false, user: null, emailVerified: null, approved: null });
    }, 10000); // 10 second timeout

    await useAuthStore.getState().fetchUserProfile();
    clearTimeout(timeoutId);
  } catch (error) {
    console.error('Initial auth check failed:', error);
    useAuthStore.setState({ loading: false, user: null, emailVerified: null, approved: null });
  }
})();
