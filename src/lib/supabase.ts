import { createClient } from '@supabase/supabase-js';
import type { 
  UserProfile, 
  CognitiveAssessmentSession, 
  PersonalityAssessment, 
  CareerRecommendation, 
  LearningRoadmap,
  Subject,
  EducationLevel,
  DifficultyLevel
} from './supabase-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subject-Agnostic Assessment Service
export class SubjectAgnosticAssessmentService {
  // Create or update user profile
  async saveUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Profile save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Profile save failed:', error);
      return { success: false, error: 'Failed to save user profile' };
    }
  }

  // Save cognitive assessment results
  async saveCognitiveAssessment(
    userId: string,
    assessmentData: Partial<CognitiveAssessmentSession>
  ): Promise<{ success: boolean; data?: CognitiveAssessmentSession; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('cognitive_assessment_sessions')
        .insert({
          user_id: userId,
          session_id: `session_${Date.now()}_${userId}`,
          education_level: assessmentData.education_level || 'high_school',
          ...assessmentData
        })
        .select()
        .single();

      if (error) {
        console.error('Cognitive assessment save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Cognitive assessment save failed:', error);
      return { success: false, error: 'Failed to save cognitive assessment' };
    }
  }

  // Save personality assessment results
  async savePersonalityAssessment(
    userId: string,
    assessmentData: Partial<PersonalityAssessment>
  ): Promise<{ success: boolean; data?: PersonalityAssessment; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('personality_assessments')
        .insert({
          user_id: userId,
          ...assessmentData
        })
        .select()
        .single();

      if (error) {
        console.error('Personality assessment save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Personality assessment save failed:', error);
      return { success: false, error: 'Failed to save personality assessment' };
    }
  }

  // Save career recommendations
  async saveCareerRecommendations(
    userId: string,
    recommendations: Partial<CareerRecommendation>[]
  ): Promise<{ success: boolean; data?: CareerRecommendation[]; error?: string }> {
    try {
      const recommendationsWithUserId = recommendations.map(rec => ({
        user_id: userId,
        ...rec
      }));

      const { data, error } = await supabase
        .from('career_recommendations')
        .insert(recommendationsWithUserId)
        .select();

      if (error) {
        console.error('Career recommendations save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Career recommendations save failed:', error);
      return { success: false, error: 'Failed to save career recommendations' };
    }
  }

  // Save learning roadmap
  async saveLearningRoadmap(
    userId: string,
    roadmapData: Partial<LearningRoadmap>
  ): Promise<{ success: boolean; data?: LearningRoadmap; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('learning_roadmaps')
        .insert({
          user_id: userId,
          ...roadmapData
        })
        .select()
        .single();

      if (error) {
        console.error('Learning roadmap save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Learning roadmap save failed:', error);
      return { success: false, error: 'Failed to save learning roadmap' };
    }
  }

  // Get complete user assessment data
  async getUserAssessmentData(userId: string): Promise<{
    success: boolean;
    data?: {
      profile?: UserProfile;
      cognitiveAssessment?: CognitiveAssessmentSession;
      personalityAssessment?: PersonalityAssessment;
      careerRecommendations?: CareerRecommendation[];
      learningRoadmaps?: LearningRoadmap[];
    };
    error?: string;
  }> {
    try {
      // Fetch all user data in parallel
      const [
        profileResult,
        cognitiveResult,
        personalityResult,
        careerResult,
        roadmapResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('clerk_user_id', userId).single(),
        supabase.from('cognitive_assessment_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('personality_assessments').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('career_recommendations').select('*').eq('user_id', userId).order('fit_score', { ascending: false }),
        supabase.from('learning_roadmaps').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      const data = {
        profile: profileResult.data || undefined,
        cognitiveAssessment: cognitiveResult.data || undefined,
        personalityAssessment: personalityResult.data || undefined,
        careerRecommendations: careerResult.data || [],
        learningRoadmaps: roadmapResult.data || []
      };

      return { success: true, data };
    } catch (error) {
      console.error('User assessment data fetch failed:', error);
      return { success: false, error: 'Failed to fetch user assessment data' };
    }
  }

  // Get all subjects
  async getSubjects(): Promise<{ success: boolean; data?: Subject[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Subjects fetch error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Subjects fetch failed:', error);
      return { success: false, error: 'Failed to fetch subjects' };
    }
  }

  // Get subjects by category
  async getSubjectsByCategory(category: string): Promise<{ success: boolean; data?: Subject[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Subjects by category fetch error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Subjects by category fetch failed:', error);
      return { success: false, error: 'Failed to fetch subjects by category' };
    }
  }

  // Save complete assessment results (legacy compatibility)
  async saveAssessmentResults(
    userId: string,
    userEmail: string,
    assessmentData: any,
    analysisResults: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Save to new schema structure
      const profileResult = await this.saveUserProfile(userId, {
        clerk_user_id: userId,
        email: userEmail,
        first_name: assessmentData.basicInfo?.firstName || '',
        last_name: assessmentData.basicInfo?.lastName || '',
        education_level: assessmentData.basicInfo?.educationLevel || 'high_school',
        location: assessmentData.basicInfo?.location || '',
        timezone: assessmentData.basicInfo?.timezone || '',
        preferred_language: assessmentData.basicInfo?.preferredLanguage || 'en',
        cultural_background: assessmentData.basicInfo?.culturalBackground || ''
      });

      if (assessmentData.cognitiveAssessment) {
        await this.saveCognitiveAssessment(userId, {
          logical_reasoning_score: assessmentData.cognitiveAssessment.iqComponents?.logicalReasoning || 0,
          numerical_reasoning_score: assessmentData.cognitiveAssessment.iqComponents?.numericalReasoning || 0,
          verbal_reasoning_score: assessmentData.cognitiveAssessment.iqComponents?.verbalReasoning || 0,
          working_memory_score: assessmentData.cognitiveAssessment.iqComponents?.workingMemory || 0,
          processing_speed_score: assessmentData.cognitiveAssessment.school42Style?.patternRecognition || 0,
          overall_score: Math.round(
            (assessmentData.cognitiveAssessment.iqComponents?.logicalReasoning +
             assessmentData.cognitiveAssessment.iqComponents?.numericalReasoning +
             assessmentData.cognitiveAssessment.iqComponents?.verbalReasoning +
             assessmentData.cognitiveAssessment.iqComponents?.workingMemory) / 4
          ),
          total_duration: assessmentData.cognitiveAssessment.completionTime || 0,
          is_completed: true,
          completed_at: new Date().toISOString()
        });
      }

      if (assessmentData.jungTypology || assessmentData.bigFivePersonality) {
        await this.savePersonalityAssessment(userId, {
          jung_type: assessmentData.jungTypology?.type || '',
          extraversion_score: assessmentData.jungTypology?.extraversion || 50,
          thinking_score: assessmentData.jungTypology?.thinking || 50,
          sensing_score: assessmentData.jungTypology?.sensing || 50,
          judging_score: assessmentData.jungTypology?.judging || 50,
          openness_score: assessmentData.bigFivePersonality?.openness || 50,
          conscientiousness_score: assessmentData.bigFivePersonality?.conscientiousness || 50,
          extraversion_big5_score: assessmentData.bigFivePersonality?.extraversion || 50,
          agreeableness_score: assessmentData.bigFivePersonality?.agreeableness || 50,
          neuroticism_score: assessmentData.bigFivePersonality?.neuroticism || 50,
          key_traits: assessmentData.bigFivePersonality?.traits || []
        });
      }

      if (analysisResults?.careerRecommendations) {
        const recommendations = analysisResults.careerRecommendations.map((rec: any) => ({
          career_title: rec.title || rec.career || '',
          career_description: rec.description || '',
          confidence_score: rec.confidence || rec.fitScore || 0,
          salary_range_min: rec.salaryRange?.min || 0,
          salary_range_max: rec.salaryRange?.max || 0,
          required_skills: rec.requiredSkills || [],
          growth_potential: rec.growthPotential || 'medium',
          market_demand: rec.marketDemand || 'medium',
          reasoning: rec.reasoning || rec.explanation || ''
        }));
        
        await this.saveCareerRecommendations(userId, recommendations);
      }

      return { success: true, data: profileResult.data };
    } catch (error) {
      console.error('Assessment results save failed:', error);
      return { success: false, error: 'Failed to save assessment results' };
    }
  }
}

export const supabaseAssessmentService = new SubjectAgnosticAssessmentService();

// Legacy compatibility
export const SupabaseAssessmentService = SubjectAgnosticAssessmentService;
