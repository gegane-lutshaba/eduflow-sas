// Supabase Database Types for Subject-Agnostic Learning Platform
// Auto-generated types based on database schema

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          current_role: string | null
          experience_level: string | null
          education_level: string | null
          location: string | null
          age_range: string | null
          cultural_background: string | null
          preferred_language: string
          timezone: string | null
          profile_completed: boolean
          assessment_completed: boolean
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          current_role?: string | null
          experience_level?: string | null
          education_level?: string | null
          location?: string | null
          age_range?: string | null
          cultural_background?: string | null
          preferred_language?: string
          timezone?: string | null
          profile_completed?: boolean
          assessment_completed?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          current_role?: string | null
          experience_level?: string | null
          education_level?: string | null
          location?: string | null
          age_range?: string | null
          cultural_background?: string | null
          preferred_language?: string
          timezone?: string | null
          profile_completed?: boolean
          assessment_completed?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cognitive_assessment_sessions: {
        Row: {
          id: string
          user_id: string
          session_id: string
          started_at: string
          completed_at: string | null
          total_duration: number | null
          education_level: string
          overall_score: number | null
          logical_reasoning_score: number | null
          numerical_reasoning_score: number | null
          verbal_reasoning_score: number | null
          working_memory_score: number | null
          processing_speed_score: number | null
          cognitive_strengths: string[] | null
          cognitive_weaknesses: string[] | null
          recommended_learning_style: string | null
          is_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          started_at?: string
          completed_at?: string | null
          total_duration?: number | null
          education_level: string
          overall_score?: number | null
          logical_reasoning_score?: number | null
          numerical_reasoning_score?: number | null
          verbal_reasoning_score?: number | null
          working_memory_score?: number | null
          processing_speed_score?: number | null
          cognitive_strengths?: string[] | null
          cognitive_weaknesses?: string[] | null
          recommended_learning_style?: string | null
          is_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          started_at?: string
          completed_at?: string | null
          total_duration?: number | null
          education_level?: string
          overall_score?: number | null
          logical_reasoning_score?: number | null
          numerical_reasoning_score?: number | null
          verbal_reasoning_score?: number | null
          working_memory_score?: number | null
          processing_speed_score?: number | null
          cognitive_strengths?: string[] | null
          cognitive_weaknesses?: string[] | null
          recommended_learning_style?: string | null
          is_completed?: boolean
          created_at?: string
        }
      }
      cognitive_question_responses: {
        Row: {
          id: string
          session_id: string
          question_id: string
          question_text: string
          question_category: string
          difficulty_level: string
          user_answer: string | null
          correct_answer: string | null
          is_correct: boolean | null
          response_time: number | null
          question_order: number | null
          answered_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          question_text: string
          question_category: string
          difficulty_level: string
          user_answer?: string | null
          correct_answer?: string | null
          is_correct?: boolean | null
          response_time?: number | null
          question_order?: number | null
          answered_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          question_text?: string
          question_category?: string
          difficulty_level?: string
          user_answer?: string | null
          correct_answer?: string | null
          is_correct?: boolean | null
          response_time?: number | null
          question_order?: number | null
          answered_at?: string
        }
      }
      personality_assessments: {
        Row: {
          id: string
          user_id: string
          jung_type: string | null
          jung_description: string | null
          extraversion_score: number | null
          thinking_score: number | null
          sensing_score: number | null
          judging_score: number | null
          openness_score: number | null
          conscientiousness_score: number | null
          extraversion_big5_score: number | null
          agreeableness_score: number | null
          neuroticism_score: number | null
          key_traits: string[] | null
          work_style: string | null
          communication_style: string | null
          leadership_potential: number | null
          team_compatibility: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          jung_type?: string | null
          jung_description?: string | null
          extraversion_score?: number | null
          thinking_score?: number | null
          sensing_score?: number | null
          judging_score?: number | null
          openness_score?: number | null
          conscientiousness_score?: number | null
          extraversion_big5_score?: number | null
          agreeableness_score?: number | null
          neuroticism_score?: number | null
          key_traits?: string[] | null
          work_style?: string | null
          communication_style?: string | null
          leadership_potential?: number | null
          team_compatibility?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          jung_type?: string | null
          jung_description?: string | null
          extraversion_score?: number | null
          thinking_score?: number | null
          sensing_score?: number | null
          judging_score?: number | null
          openness_score?: number | null
          conscientiousness_score?: number | null
          extraversion_big5_score?: number | null
          agreeableness_score?: number | null
          neuroticism_score?: number | null
          key_traits?: string[] | null
          work_style?: string | null
          communication_style?: string | null
          leadership_potential?: number | null
          team_compatibility?: string | null
          created_at?: string
        }
      }
      learning_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_modality: string | null
          learning_pace: string | null
          support_level: string | null
          study_schedule: string | null
          attention_span: string | null
          preferred_format: string | null
          motivational_approach: string | null
          engagement_strategies: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_modality?: string | null
          learning_pace?: string | null
          support_level?: string | null
          study_schedule?: string | null
          attention_span?: string | null
          preferred_format?: string | null
          motivational_approach?: string | null
          engagement_strategies?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_modality?: string | null
          learning_pace?: string | null
          support_level?: string | null
          study_schedule?: string | null
          attention_span?: string | null
          preferred_format?: string | null
          motivational_approach?: string | null
          engagement_strategies?: string[] | null
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          display_name: string
          description: string | null
          category: string
          icon: string | null
          color: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          description?: string | null
          category: string
          icon?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          description?: string | null
          category?: string
          icon?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      career_paths: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          required_subjects: string[] | null
          education_requirements: string[] | null
          skills_required: string[] | null
          average_salary_min: number | null
          average_salary_max: number | null
          job_growth_rate: number | null
          demand_level: string | null
          available_locations: string[] | null
          remote_friendly: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          required_subjects?: string[] | null
          education_requirements?: string[] | null
          skills_required?: string[] | null
          average_salary_min?: number | null
          average_salary_max?: number | null
          job_growth_rate?: number | null
          demand_level?: string | null
          available_locations?: string[] | null
          remote_friendly?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          required_subjects?: string[] | null
          education_requirements?: string[] | null
          skills_required?: string[] | null
          average_salary_min?: number | null
          average_salary_max?: number | null
          job_growth_rate?: number | null
          demand_level?: string | null
          available_locations?: string[] | null
          remote_friendly?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      career_recommendations: {
        Row: {
          id: string
          user_id: string
          career_path_id: string
          fit_score: number
          reasoning: string | null
          timeline_estimate: string | null
          confidence_level: number | null
          missing_skills: string[] | null
          recommended_subjects: string[] | null
          next_steps: string[] | null
          is_active: boolean
          user_interest_level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_path_id: string
          fit_score: number
          reasoning?: string | null
          timeline_estimate?: string | null
          confidence_level?: number | null
          missing_skills?: string[] | null
          recommended_subjects?: string[] | null
          next_steps?: string[] | null
          is_active?: boolean
          user_interest_level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_path_id?: string
          fit_score?: number
          reasoning?: string | null
          timeline_estimate?: string | null
          confidence_level?: number | null
          missing_skills?: string[] | null
          recommended_subjects?: string[] | null
          next_steps?: string[] | null
          is_active?: boolean
          user_interest_level?: number | null
          created_at?: string
        }
      }
      learning_roadmaps: {
        Row: {
          id: string
          user_id: string
          career_path_id: string | null
          title: string
          description: string | null
          current_education_level: string | null
          target_career: string | null
          estimated_duration_months: number | null
          total_milestones: number
          completed_milestones: number
          progress_percentage: number
          is_active: boolean
          started_at: string | null
          target_completion_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_path_id?: string | null
          title: string
          description?: string | null
          current_education_level?: string | null
          target_career?: string | null
          estimated_duration_months?: number | null
          total_milestones?: number
          completed_milestones?: number
          progress_percentage?: number
          is_active?: boolean
          started_at?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_path_id?: string | null
          title?: string
          description?: string | null
          current_education_level?: string | null
          target_career?: string | null
          estimated_duration_months?: number | null
          total_milestones?: number
          completed_milestones?: number
          progress_percentage?: number
          is_active?: boolean
          started_at?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_milestones: {
        Row: {
          id: string
          roadmap_id: string
          title: string
          description: string | null
          milestone_type: string | null
          order_index: number
          prerequisites: string[] | null
          estimated_duration_months: number | null
          difficulty_level: string | null
          subjects_covered: string[] | null
          skills_developed: string[] | null
          resources: string[] | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          roadmap_id: string
          title: string
          description?: string | null
          milestone_type?: string | null
          order_index: number
          prerequisites?: string[] | null
          estimated_duration_months?: number | null
          difficulty_level?: string | null
          subjects_covered?: string[] | null
          skills_developed?: string[] | null
          resources?: string[] | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          roadmap_id?: string
          title?: string
          description?: string | null
          milestone_type?: string | null
          order_index?: number
          prerequisites?: string[] | null
          estimated_duration_months?: number | null
          difficulty_level?: string | null
          subjects_covered?: string[] | null
          skills_developed?: string[] | null
          resources?: string[] | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      roadmap_content: {
        Row: {
          id: string
          milestone_id: string
          title: string
          description: string | null
          content_type: string | null
          order_index: number
          learning_objectives: string[] | null
          content_data: any | null
          estimated_study_time: number | null
          is_completed: boolean
          completion_percentage: number
          created_at: string
        }
        Insert: {
          id?: string
          milestone_id: string
          title: string
          description?: string | null
          content_type?: string | null
          order_index: number
          learning_objectives?: string[] | null
          content_data?: any | null
          estimated_study_time?: number | null
          is_completed?: boolean
          completion_percentage?: number
          created_at?: string
        }
        Update: {
          id?: string
          milestone_id?: string
          title?: string
          description?: string | null
          content_type?: string | null
          order_index?: number
          learning_objectives?: string[] | null
          content_data?: any | null
          estimated_study_time?: number | null
          is_completed?: boolean
          completion_percentage?: number
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          subject_id: string | null
          difficulty_level: string | null
          education_level: string | null
          estimated_duration: number | null
          total_modules: number
          completed_modules: number
          is_personalized: boolean
          personalization_factors: any | null
          prerequisites: string[] | null
          learning_objectives: string[] | null
          tags: string[] | null
          progress_percentage: number
          is_completed: boolean
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          subject_id?: string | null
          difficulty_level?: string | null
          education_level?: string | null
          estimated_duration?: number | null
          total_modules?: number
          completed_modules?: number
          is_personalized?: boolean
          personalization_factors?: any | null
          prerequisites?: string[] | null
          learning_objectives?: string[] | null
          tags?: string[] | null
          progress_percentage?: number
          is_completed?: boolean
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          subject_id?: string | null
          difficulty_level?: string | null
          education_level?: string | null
          estimated_duration?: number | null
          total_modules?: number
          completed_modules?: number
          is_personalized?: boolean
          personalization_factors?: any | null
          prerequisites?: string[] | null
          learning_objectives?: string[] | null
          tags?: string[] | null
          progress_percentage?: number
          is_completed?: boolean
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          module_type: string | null
          order_index: number
          content: any
          estimated_duration: number | null
          learning_objectives: string[] | null
          assessment_criteria: any | null
          passing_score: number
          is_completed: boolean
          score: number | null
          attempts: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          module_type?: string | null
          order_index: number
          content: any
          estimated_duration?: number | null
          learning_objectives?: string[] | null
          assessment_criteria?: any | null
          passing_score?: number
          is_completed?: boolean
          score?: number | null
          attempts?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          module_type?: string | null
          order_index?: number
          content?: any
          estimated_duration?: number | null
          learning_objectives?: string[] | null
          assessment_criteria?: any | null
          passing_score?: number
          is_completed?: boolean
          score?: number | null
          attempts?: number
          created_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          module_id: string | null
          session_type: string | null
          started_at: string
          ended_at: string | null
          duration: number | null
          completion_percentage: number
          score: number | null
          interactions_count: number
          time_on_task: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          module_id?: string | null
          session_type?: string | null
          started_at?: string
          ended_at?: string | null
          duration?: number | null
          completion_percentage?: number
          score?: number | null
          interactions_count?: number
          time_on_task?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          module_id?: string | null
          session_type?: string | null
          started_at?: string
          ended_at?: string | null
          duration?: number | null
          completion_percentage?: number
          score?: number | null
          interactions_count?: number
          time_on_task?: number | null
          created_at?: string
        }
      }
      gamification_profiles: {
        Row: {
          id: string
          user_id: string
          total_xp: number
          current_level: number
          xp_to_next_level: number
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_study_time: number
          courses_completed: number
          assessments_passed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_xp?: number
          current_level?: number
          xp_to_next_level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_study_time?: number
          courses_completed?: number
          assessments_passed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_xp?: number
          current_level?: number
          xp_to_next_level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_study_time?: number
          courses_completed?: number
          assessments_passed?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          title: string
          description: string | null
          icon: string | null
          category: string | null
          requirements: any | null
          xp_reward: number
          rarity: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description?: string | null
          icon?: string | null
          category?: string | null
          requirements?: any | null
          xp_reward?: number
          rarity?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          description?: string | null
          icon?: string | null
          category?: string | null
          requirements?: any | null
          xp_reward?: number
          rarity?: string
          is_active?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          progress_data: any | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
          progress_data?: any | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          progress_data?: any | null
        }
      }
      xp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          reason: string
          category: string | null
          reference_id: string | null
          balance_before: number | null
          balance_after: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          reason: string
          category?: string | null
          reference_id?: string | null
          balance_before?: number | null
          balance_after?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          reason?: string
          category?: string | null
          reference_id?: string | null
          balance_before?: number | null
          balance_after?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_progress: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_courses: number
          completed_courses: number
          total_roadmaps: number
          active_roadmaps: number
          overall_progress_percentage: number
        }[]
      }
      update_gamification_stats: {
        Args: {
          user_uuid: string
          xp_gained?: number
          activity_type?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common operations
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type CognitiveAssessmentSession = Database['public']['Tables']['cognitive_assessment_sessions']['Row']
export type CognitiveAssessmentSessionInsert = Database['public']['Tables']['cognitive_assessment_sessions']['Insert']
export type CognitiveAssessmentSessionUpdate = Database['public']['Tables']['cognitive_assessment_sessions']['Update']

export type CognitiveQuestionResponse = Database['public']['Tables']['cognitive_question_responses']['Row']
export type CognitiveQuestionResponseInsert = Database['public']['Tables']['cognitive_question_responses']['Insert']

export type PersonalityAssessment = Database['public']['Tables']['personality_assessments']['Row']
export type PersonalityAssessmentInsert = Database['public']['Tables']['personality_assessments']['Insert']

export type LearningPreferences = Database['public']['Tables']['learning_preferences']['Row']
export type LearningPreferencesInsert = Database['public']['Tables']['learning_preferences']['Insert']

export type Subject = Database['public']['Tables']['subjects']['Row']
export type CareerPath = Database['public']['Tables']['career_paths']['Row']
export type CareerRecommendation = Database['public']['Tables']['career_recommendations']['Row']

export type LearningRoadmap = Database['public']['Tables']['learning_roadmaps']['Row']
export type LearningRoadmapInsert = Database['public']['Tables']['learning_roadmaps']['Insert']
export type LearningRoadmapUpdate = Database['public']['Tables']['learning_roadmaps']['Update']

export type RoadmapMilestone = Database['public']['Tables']['roadmap_milestones']['Row']
export type RoadmapMilestoneInsert = Database['public']['Tables']['roadmap_milestones']['Insert']

export type RoadmapContent = Database['public']['Tables']['roadmap_content']['Row']
export type RoadmapContentInsert = Database['public']['Tables']['roadmap_content']['Insert']

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']

export type CourseModule = Database['public']['Tables']['course_modules']['Row']
export type CourseModuleInsert = Database['public']['Tables']['course_modules']['Insert']

export type StudySession = Database['public']['Tables']['study_sessions']['Row']
export type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert']

export type GamificationProfile = Database['public']['Tables']['gamification_profiles']['Row']
export type GamificationProfileInsert = Database['public']['Tables']['gamification_profiles']['Insert']
export type GamificationProfileUpdate = Database['public']['Tables']['gamification_profiles']['Update']

export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type XPTransaction = Database['public']['Tables']['xp_transactions']['Row']

// Enums for type safety
export type EducationLevel = 'primary' | 'o-level' | 'a-level' | 'undergraduate' | 'masters' | 'phd' | 'bootcamp' | 'self-taught'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type QuestionCategory = 'logical' | 'numerical' | 'verbal' | 'memory' | 'processing'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type LearningModality = 'visual' | 'auditory' | 'kinesthetic' | 'reading'
export type LearningPace = 'self-paced' | 'structured' | 'intensive' | 'part-time'
export type SupportLevel = 'minimal' | 'moderate' | 'high' | 'intensive'
export type ModuleType = 'micro-learning' | 'deep-dive' | 'hands-on-lab' | 'assessment'
export type MilestoneType = 'education' | 'skill' | 'certification' | 'experience'
export type ContentType = 'topic' | 'module' | 'project' | 'assessment'
export type SessionType = 'study' | 'assessment' | 'review'
export type AchievementCategory = 'learning' | 'assessment' | 'streak' | 'milestone'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type DemandLevel = 'low' | 'medium' | 'high' | 'very-high'

// Complex types for assessment data
export interface CognitiveAssessmentResults {
  sessionId: string
  userId: string
  educationLevel: EducationLevel
  responses: CognitiveQuestionResponse[]
  scores: {
    logical_reasoning: number
    numerical_reasoning: number
    verbal_reasoning: number
    working_memory: number
    processing_speed: number
    overall: number
  }
  analysis: {
    strengths: string[]
    weaknesses: string[]
    recommended_learning_style: string
  }
  completionTime: number
}

export interface CareerRecommendationWithPath extends CareerRecommendation {
  career_path: CareerPath
}

export interface LearningRoadmapWithMilestones extends LearningRoadmap {
  milestones: (RoadmapMilestone & {
    content: RoadmapContent[]
  })[]
  career_path?: CareerPath
}

export interface CourseWithModules extends Course {
  modules: CourseModule[]
  subject?: Subject
}

export interface UserProgressSummary {
  total_courses: number
  completed_courses: number
  total_roadmaps: number
  active_roadmaps: number
  overall_progress_percentage: number
}

// Question bank types for cognitive assessment
export interface CognitiveQuestion {
  id: string
  category: QuestionCategory
  difficulty: QuestionDifficulty
  question: string
  options?: string[]
  correct_answer: string | number
  explanation: string
  education_level: EducationLevel[]
  response_time_limit?: number
}

export interface AssessmentQuestionBank {
  logical_reasoning: CognitiveQuestion[]
  numerical_reasoning: CognitiveQuestion[]
  verbal_reasoning: CognitiveQuestion[]
  working_memory: CognitiveQuestion[]
  processing_speed: CognitiveQuestion[]
}
