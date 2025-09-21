-- ============================================================================
-- UNIFIED SCHEMA CONSOLIDATION MIGRATION
-- This migration consolidates the fragmented schema into a clean, unified structure
-- ============================================================================

-- Drop existing fragmented tables to avoid conflicts
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_history CASCADE;
DROP TABLE IF EXISTS teacher_profiles CASCADE;
DROP TABLE IF EXISTS researcher_profiles CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_ratings CASCADE;
DROP TABLE IF EXISTS content_generation_jobs CASCADE;
DROP TABLE IF EXISTS teacher_analytics CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;

-- ============================================================================
-- CORE USER MANAGEMENT (Single Source of Truth)
-- ============================================================================

-- Enhanced users table with role management built-in
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  
  -- Role Management (built into core user table)
  current_role VARCHAR(50) DEFAULT 'student' NOT NULL,
  available_roles TEXT[] DEFAULT ARRAY['student'] NOT NULL,
  role_preferences JSONB DEFAULT '{}' NOT NULL,
  
  -- Profile Status
  profile_completion_status JSONB DEFAULT '{}' NOT NULL,
  is_profile_complete BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Role history for tracking role switches
CREATE TABLE role_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  from_role VARCHAR(50),
  to_role VARCHAR(50) NOT NULL,
  switched_at TIMESTAMP DEFAULT NOW() NOT NULL,
  session_duration INTEGER, -- in minutes
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- ============================================================================
-- ROLE-SPECIFIC PROFILE TABLES
-- ============================================================================

-- Student profiles for student-specific data
CREATE TABLE student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL UNIQUE,
  
  -- Personal Information
  date_of_birth TIMESTAMP,
  location TEXT,
  phone TEXT,
  
  -- Education Information
  education_level TEXT, -- 'primary', 'high_school', 'college', 'professional'
  current_institution TEXT,
  field_of_study TEXT,
  
  -- Learning Preferences
  career_goals TEXT,
  learning_objectives JSONB DEFAULT '[]',
  time_availability INTEGER, -- minutes per day
  preferred_study_time TEXT, -- 'morning', 'afternoon', 'evening', 'night'
  
  -- Profile Completion Tracking
  completed_sections JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Teacher profiles for teacher-specific data
CREATE TABLE teacher_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL UNIQUE,
  
  -- Contact Information
  phone TEXT,
  location TEXT,
  
  -- Professional Information
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  qualifications TEXT[] DEFAULT '{}',
  teaching_experience_years INTEGER DEFAULT 0,
  current_institution TEXT,
  
  -- Teaching Preferences
  subjects TEXT[] DEFAULT '{}',
  education_levels TEXT[] DEFAULT '{}',
  target_regions TEXT[] DEFAULT '{}',
  preferred_languages TEXT[] DEFAULT '{}',
  content_types TEXT[] DEFAULT '{}',
  
  -- Platform Goals
  revenue_goals TEXT,
  motivation TEXT,
  
  -- Platform Metrics
  revenue_share_percentage DECIMAL(5,2) DEFAULT 70.00,
  total_revenue_earned DECIMAL(12,2) DEFAULT 0.00,
  total_courses_created INTEGER DEFAULT 0,
  total_students_taught INTEGER DEFAULT 0,
  average_course_rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Researcher profiles for researcher-specific data
CREATE TABLE researcher_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL UNIQUE,
  
  -- Professional Information
  display_name VARCHAR(255) NOT NULL,
  institution VARCHAR(255),
  research_areas TEXT[] DEFAULT '{}',
  academic_title VARCHAR(100),
  publications JSONB DEFAULT '[]',
  research_interests TEXT,
  
  -- Platform Access
  data_access_level VARCHAR(50) DEFAULT 'basic',
  approved_datasets TEXT[] DEFAULT '{}',
  research_projects JSONB DEFAULT '[]',
  collaboration_preferences JSONB DEFAULT '{}',
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- ASSESSMENT TABLES (Preserved from original schema)
-- ============================================================================

-- Cognitive assessments
CREATE TABLE IF NOT EXISTS cognitive_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  overall_score INTEGER,
  logical_reasoning_score INTEGER,
  numerical_reasoning_score INTEGER,
  verbal_reasoning_score INTEGER,
  spatial_reasoning_score INTEGER,
  working_memory_score INTEGER,
  processing_speed_score INTEGER,
  detailed_results JSONB DEFAULT '{}',
  completion_time INTEGER, -- in seconds
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Personality assessments
CREATE TABLE IF NOT EXISTS personality_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  jung_type TEXT, -- MBTI type
  jung_description TEXT,
  big_five_scores JSONB DEFAULT '{}',
  key_traits JSONB DEFAULT '[]',
  work_style TEXT,
  communication_style TEXT,
  leadership_potential INTEGER,
  team_compatibility INTEGER,
  detailed_results JSONB DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Learning preferences
CREATE TABLE IF NOT EXISTS learning_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  learning_style TEXT, -- 'visual', 'auditory', 'kinesthetic', 'reading'
  preferred_content_format JSONB DEFAULT '[]',
  difficulty_preference TEXT, -- 'easy', 'moderate', 'challenging'
  pace_preference TEXT, -- 'slow', 'moderate', 'fast'
  feedback_preference TEXT, -- 'immediate', 'periodic', 'minimal'
  motivational_factors JSONB DEFAULT '[]',
  distraction_level INTEGER, -- 1-10 scale
  attention_span INTEGER, -- in minutes
  preferred_session_length INTEGER, -- in minutes
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CONTENT & CURRICULUM TABLES (Preserved from original schema)
-- ============================================================================

-- Subjects - STEM subjects from syllabus
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- 'Mathematics', 'Physics', etc.
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'STEM', 'Language', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Education levels and examination boards
CREATE TABLE IF NOT EXISTS education_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- 'o_level', 'a_level'
  display_name TEXT NOT NULL, -- 'O Level', 'A Level'
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS examination_boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- 'Cambridge International'
  syllabus_code TEXT, -- '4024'
  subject_id UUID REFERENCES subjects(id) NOT NULL,
  education_level_id UUID REFERENCES education_levels(id) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Topics within subjects
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) NOT NULL,
  education_level_id UUID REFERENCES education_levels(id) NOT NULL,
  examination_board_id UUID REFERENCES examination_boards(id),
  learning_objectives JSONB DEFAULT '[]',
  content TEXT,
  activities JSONB DEFAULT '[]',
  difficulty INTEGER, -- 1-10 scale
  estimated_duration INTEGER, -- in minutes
  prerequisites JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- COURSE SYSTEM (Unified and Enhanced)
-- ============================================================================

-- Unified courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Ownership
  student_id TEXT REFERENCES users(id) NOT NULL, -- Student who requested the course
  teacher_id TEXT REFERENCES users(id), -- Teacher who created the course (if applicable)
  
  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,
  
  -- Content Classification
  subject_id UUID REFERENCES subjects(id),
  topic_id UUID REFERENCES topics(id),
  education_level_id UUID REFERENCES education_levels(id),
  
  -- Course Properties
  difficulty INTEGER DEFAULT 1, -- 1-10 scale
  estimated_duration INTEGER, -- in minutes
  content_type TEXT DEFAULT 'study', -- 'study', 'assessment', 'hybrid'
  is_personalized BOOLEAN DEFAULT true,
  
  -- AI Generation
  generation_prompt TEXT,
  content_generation_metadata JSONB DEFAULT '{}',
  ai_content_status JSONB DEFAULT '{}',
  generated_content JSONB DEFAULT '{}',
  
  -- Course Status
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed', 'archived'
  progress_percentage INTEGER DEFAULT 0,
  
  -- Business Model
  revenue_model VARCHAR(50) DEFAULT 'free',
  price DECIMAL(10,2) DEFAULT 0.00,
  enrollment_count INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0.00,
  
  -- Quality Metrics
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Curriculum Alignment
  syllabus_alignment TEXT,
  examination_board VARCHAR(100),
  target_region VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Course modules for structured course content
CREATE TABLE course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'text', 'video', 'audio', 'interactive', 'assessment'
  content_data JSONB DEFAULT '{}' NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  generation_metadata JSONB DEFAULT '{}',
  estimated_duration INTEGER, -- in minutes
  learning_objectives TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  difficulty_level INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CAREER & LEARNING PATH SYSTEM (Preserved from original schema)
-- ============================================================================

-- Career paths
CREATE TABLE IF NOT EXISTS career_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'Technology', 'Healthcare', etc.
  required_skills JSONB DEFAULT '[]',
  salary_range JSONB DEFAULT '{}',
  growth_outlook TEXT, -- 'high', 'moderate', 'low'
  education_requirements JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  work_environment TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Career recommendations for users
CREATE TABLE IF NOT EXISTS career_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  career_path_id UUID REFERENCES career_paths(id) NOT NULL,
  fit_score INTEGER, -- 0-100
  reasoning TEXT,
  timeline_estimate TEXT,
  required_steps JSONB DEFAULT '[]',
  skill_gaps JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Learning roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  career_path_id UUID REFERENCES career_paths(id),
  title TEXT NOT NULL,
  description TEXT,
  current_education_level TEXT,
  target_career TEXT,
  estimated_duration_months INTEGER,
  total_milestones INTEGER,
  completed_milestones INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Roadmap milestones
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES learning_roadmaps(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_duration TEXT,
  required_skills JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  assessment_criteria JSONB DEFAULT '[]',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- PROGRESS & ANALYTICS SYSTEM (Preserved from original schema)
-- ============================================================================

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES course_modules(id),
  topic_id UUID REFERENCES topics(id),
  progress_type TEXT NOT NULL, -- 'course', 'module', 'topic'
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_accessed_at TIMESTAMP,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Study sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES course_modules(id),
  scheduled_for TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration INTEGER, -- in seconds
  session_type TEXT, -- 'study', 'assessment', 'review'
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'active', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- GAMIFICATION SYSTEM (Preserved from original schema)
-- ============================================================================

-- Gamification profiles
CREATE TABLE IF NOT EXISTS gamification_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL UNIQUE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in seconds
  courses_completed INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'learning', 'streak', 'assessment', 'social'
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW() NOT NULL,
  is_notified BOOLEAN DEFAULT false
);

-- XP transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'course_completion', 'daily_streak', etc.
  reference_id UUID, -- ID of related entity (course, achievement, etc.)
  reference_type TEXT, -- 'course', 'achievement', 'assessment'
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_current_role ON users(current_role);

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_researcher_profiles_user_id ON researcher_profiles(user_id);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_student_id ON courses(student_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_assessments_user_id ON cognitive_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_assessments_user_id ON personality_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_preferences_user_id ON learning_preferences(user_id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON teacher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_researcher_profiles_updated_at BEFORE UPDATE ON researcher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_roadmaps_updated_at BEFORE UPDATE ON learning_roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gamification_profiles_updated_at BEFORE UPDATE ON gamification_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cognitive_assessments_updated_at BEFORE UPDATE ON cognitive_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personality_assessments_updated_at BEFORE UPDATE ON personality_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_preferences_updated_at BEFORE UPDATE ON learning_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
