import { supabase } from './supabase';
import { Database } from './supabase-types';

// Type definitions for our service layer
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

type CognitiveAssessmentSession = Database['public']['Tables']['cognitive_assessment_sessions']['Row'];
type CognitiveAssessmentSessionInsert = Database['public']['Tables']['cognitive_assessment_sessions']['Insert'];

type CognitiveQuestionResponse = Database['public']['Tables']['cognitive_question_responses']['Row'];
type CognitiveQuestionResponseInsert = Database['public']['Tables']['cognitive_question_responses']['Insert'];

type PersonalityAssessment = Database['public']['Tables']['personality_assessments']['Row'];
type PersonalityAssessmentInsert = Database['public']['Tables']['personality_assessments']['Insert'];

type LearningPreferences = Database['public']['Tables']['learning_preferences']['Row'];
type LearningPreferencesInsert = Database['public']['Tables']['learning_preferences']['Insert'];

type CareerRecommendation = Database['public']['Tables']['career_recommendations']['Row'];
type CareerRecommendationInsert = Database['public']['Tables']['career_recommendations']['Insert'];

type LearningRoadmap = Database['public']['Tables']['learning_roadmaps']['Row'];
type LearningRoadmapInsert = Database['public']['Tables']['learning_roadmaps']['Insert'];

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];

type GamificationProfile = Database['public']['Tables']['gamification_profiles']['Row'];
type GamificationProfileInsert = Database['public']['Tables']['gamification_profiles']['Insert'];

export class SupabaseService {
  // =============================================
  // USER PROFILE MANAGEMENT
  // =============================================

  static async createUserProfile(profileData: UserProfileInsert): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user profile: ${error.message}`);
    return data;
  }

  static async getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
    return data;
  }

  static async updateUserProfile(clerkUserId: string, updates: UserProfileUpdate): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user profile: ${error.message}`);
    return data;
  }

  // =============================================
  // COGNITIVE ASSESSMENT MANAGEMENT
  // =============================================

  static async createCognitiveAssessmentSession(sessionData: CognitiveAssessmentSessionInsert): Promise<CognitiveAssessmentSession> {
    const { data, error } = await supabase
      .from('cognitive_assessment_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create assessment session: ${error.message}`);
    return data;
  }

  static async updateCognitiveAssessmentSession(sessionId: string, updates: Partial<CognitiveAssessmentSession>): Promise<CognitiveAssessmentSession> {
    const { data, error } = await supabase
      .from('cognitive_assessment_sessions')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update assessment session: ${error.message}`);
    return data;
  }

  static async saveCognitiveQuestionResponse(responseData: CognitiveQuestionResponseInsert): Promise<CognitiveQuestionResponse> {
    const { data, error } = await supabase
      .from('cognitive_question_responses')
      .insert(responseData)
      .select()
      .single();

    if (error) throw new Error(`Failed to save question response: ${error.message}`);
    return data;
  }

  static async getCognitiveAssessmentSessions(userId: string): Promise<CognitiveAssessmentSession[]> {
    const { data, error } = await supabase
      .from('cognitive_assessment_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get assessment sessions: ${error.message}`);
    return data || [];
  }

  static async getLatestCognitiveAssessment(userId: string): Promise<CognitiveAssessmentSession | null> {
    const { data, error } = await supabase
      .from('cognitive_assessment_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get latest assessment: ${error.message}`);
    }
    return data;
  }

  // =============================================
  // PERSONALITY ASSESSMENT MANAGEMENT
  // =============================================

  static async savePersonalityAssessment(assessmentData: PersonalityAssessmentInsert): Promise<PersonalityAssessment> {
    const { data, error } = await supabase
      .from('personality_assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error) throw new Error(`Failed to save personality assessment: ${error.message}`);
    return data;
  }

  static async getPersonalityAssessment(userId: string): Promise<PersonalityAssessment | null> {
    const { data, error } = await supabase
      .from('personality_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get personality assessment: ${error.message}`);
    }
    return data;
  }

  // =============================================
  // LEARNING PREFERENCES MANAGEMENT
  // =============================================

  static async saveLearningPreferences(preferencesData: LearningPreferencesInsert): Promise<LearningPreferences> {
    const { data, error } = await supabase
      .from('learning_preferences')
      .insert(preferencesData)
      .select()
      .single();

    if (error) throw new Error(`Failed to save learning preferences: ${error.message}`);
    return data;
  }

  static async getLearningPreferences(userId: string): Promise<LearningPreferences | null> {
    const { data, error } = await supabase
      .from('learning_preferences')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get learning preferences: ${error.message}`);
    }
    return data;
  }

  // =============================================
  // CAREER RECOMMENDATIONS MANAGEMENT
  // =============================================

  static async saveCareerRecommendations(recommendations: CareerRecommendationInsert[]): Promise<CareerRecommendation[]> {
    const { data, error } = await supabase
      .from('career_recommendations')
      .insert(recommendations)
      .select();

    if (error) throw new Error(`Failed to save career recommendations: ${error.message}`);
    return data || [];
  }

  static async getCareerRecommendations(userId: string): Promise<CareerRecommendation[]> {
    const { data, error } = await supabase
      .from('career_recommendations')
      .select(`
        *,
        career_paths (
          title,
          description,
          category,
          average_salary_min,
          average_salary_max,
          job_growth_rate,
          demand_level
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('fit_score', { ascending: false });

    if (error) throw new Error(`Failed to get career recommendations: ${error.message}`);
    return data || [];
  }

  static async updateCareerRecommendationInterest(recommendationId: string, interestLevel: number): Promise<void> {
    const { error } = await supabase
      .from('career_recommendations')
      .update({ user_interest_level: interestLevel })
      .eq('id', recommendationId);

    if (error) throw new Error(`Failed to update career interest: ${error.message}`);
  }

  // =============================================
  // LEARNING ROADMAPS MANAGEMENT
  // =============================================

  static async saveLearningRoadmap(roadmapData: LearningRoadmapInsert): Promise<LearningRoadmap> {
    const { data, error } = await supabase
      .from('learning_roadmaps')
      .insert(roadmapData)
      .select()
      .single();

    if (error) throw new Error(`Failed to save learning roadmap: ${error.message}`);
    return data;
  }

  static async getLearningRoadmaps(userId: string): Promise<LearningRoadmap[]> {
    const { data, error } = await supabase
      .from('learning_roadmaps')
      .select(`
        *,
        career_paths (
          title,
          description,
          category
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get learning roadmaps: ${error.message}`);
    return data || [];
  }

  static async updateRoadmapProgress(roadmapId: string, completedMilestones: number, progressPercentage: number): Promise<void> {
    const { error } = await supabase
      .from('learning_roadmaps')
      .update({
        completed_milestones: completedMilestones,
        progress_percentage: progressPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', roadmapId);

    if (error) throw new Error(`Failed to update roadmap progress: ${error.message}`);
  }

  // =============================================
  // COURSES MANAGEMENT
  // =============================================

  static async saveUserCourse(courseData: CourseInsert): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw new Error(`Failed to save user course: ${error.message}`);
    return data;
  }

  static async getUserCourses(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        subjects (
          name,
          display_name,
          category,
          icon,
          color
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get user courses: ${error.message}`);
    return data || [];
  }

  static async updateCourseProgress(courseId: string, progress: number, completedModules: number): Promise<void> {
    const updates: any = {
      progress_percentage: progress,
      completed_modules: completedModules,
      updated_at: new Date().toISOString()
    };

    if (progress >= 100) {
      updates.is_completed = true;
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId);

    if (error) throw new Error(`Failed to update course progress: ${error.message}`);
  }

  // =============================================
  // GAMIFICATION MANAGEMENT
  // =============================================

  static async getOrCreateGamificationProfile(userId: string): Promise<GamificationProfile> {
    // First try to get existing profile
    const { data: existing, error: getError } = await supabase
      .from('gamification_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) return existing;

    // Create new profile if doesn't exist
    const { data, error } = await supabase
      .from('gamification_profiles')
      .insert({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: 100,
        current_streak: 0,
        longest_streak: 0,
        total_study_time: 0,
        courses_completed: 0,
        assessments_passed: 0
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create gamification profile: ${error.message}`);
    return data;
  }

  static async updateGamificationProfile(userId: string, updates: Partial<GamificationProfile>): Promise<GamificationProfile> {
    const { data, error } = await supabase
      .from('gamification_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update gamification profile: ${error.message}`);
    return data;
  }

  static async addXPTransaction(userId: string, amount: number, reason: string, category: string, referenceId?: string): Promise<void> {
    // Get current profile to calculate balance
    const profile = await this.getOrCreateGamificationProfile(userId);
    
    const { error } = await supabase
      .from('xp_transactions')
      .insert({
        user_id: userId,
        amount,
        reason,
        category,
        reference_id: referenceId,
        balance_before: profile.total_xp,
        balance_after: profile.total_xp + amount
      });

    if (error) throw new Error(`Failed to add XP transaction: ${error.message}`);

    // Update profile with new XP
    const newTotalXP = profile.total_xp + amount;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    const xpToNextLevel = (newLevel * 100) - newTotalXP;

    await this.updateGamificationProfile(userId, {
      total_xp: newTotalXP,
      current_level: newLevel,
      xp_to_next_level: xpToNextLevel
    });
  }

  // =============================================
  // SUBJECTS & CAREER PATHS (READ-ONLY)
  // =============================================

  static async getSubjects(): Promise<any[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .order('display_name');

    if (error) throw new Error(`Failed to get subjects: ${error.message}`);
    return data || [];
  }

  static async getCareerPaths(): Promise<any[]> {
    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .eq('is_active', true)
      .order('title');

    if (error) throw new Error(`Failed to get career paths: ${error.message}`);
    return data || [];
  }

  // =============================================
  // COMPREHENSIVE USER DATA RETRIEVAL
  // =============================================

  static async getUserComprehensiveProfile(clerkUserId: string): Promise<{
    profile: UserProfile | null;
    cognitiveAssessment: CognitiveAssessmentSession | null;
    personalityAssessment: PersonalityAssessment | null;
    learningPreferences: LearningPreferences | null;
    careerRecommendations: CareerRecommendation[];
    roadmaps: LearningRoadmap[];
    courses: Course[];
    gamification: GamificationProfile;
  }> {
    // Get user profile first
    const profile = await this.getUserProfile(clerkUserId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // Get all related data in parallel
    const [
      cognitiveAssessment,
      personalityAssessment,
      learningPreferences,
      careerRecommendations,
      roadmaps,
      courses,
      gamification
    ] = await Promise.all([
      this.getLatestCognitiveAssessment(profile.id),
      this.getPersonalityAssessment(profile.id),
      this.getLearningPreferences(profile.id),
      this.getCareerRecommendations(profile.id),
      this.getLearningRoadmaps(profile.id),
      this.getUserCourses(profile.id),
      this.getOrCreateGamificationProfile(profile.id)
    ]);

    return {
      profile,
      cognitiveAssessment,
      personalityAssessment,
      learningPreferences,
      careerRecommendations,
      roadmaps,
      courses,
      gamification
    };
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  static async getUserIdFromClerkId(clerkUserId: string): Promise<string> {
    const profile = await this.getUserProfile(clerkUserId);
    if (!profile) {
      throw new Error('User profile not found');
    }
    return profile.id;
  }

  static async markAssessmentCompleted(clerkUserId: string): Promise<void> {
    await this.updateUserProfile(clerkUserId, {
      assessment_completed: true,
      updated_at: new Date().toISOString()
    });
  }

  static async markOnboardingCompleted(clerkUserId: string): Promise<void> {
    await this.updateUserProfile(clerkUserId, {
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    });
  }
}

export default SupabaseService;
