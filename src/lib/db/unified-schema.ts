import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, decimal, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// CORE USER MANAGEMENT (Single Source of Truth)
// ============================================================================

// Enhanced users table with role management built-in
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  
  // Role Management (built into core user table)
  currentRole: varchar('current_role', { length: 50 }).default('student').notNull(),
  availableRoles: text('available_roles').array().default(['student']).notNull(),
  rolePreferences: jsonb('role_preferences').default({}).notNull(),
  
  // Profile Status
  profileCompletionStatus: jsonb('profile_completion_status').default({}).notNull(),
  isProfileComplete: boolean('is_profile_complete').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Role history for tracking role switches
export const roleHistory = pgTable('role_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  fromRole: varchar('from_role', { length: 50 }),
  toRole: varchar('to_role', { length: 50 }).notNull(),
  switchedAt: timestamp('switched_at').defaultNow().notNull(),
  sessionDuration: integer('session_duration'), // in minutes
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

// ============================================================================
// ROLE-SPECIFIC PROFILE TABLES
// ============================================================================

// Student profiles for student-specific data
export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  
  // Personal Information
  dateOfBirth: timestamp('date_of_birth'),
  location: text('location'),
  phone: text('phone'),
  
  // Education Information
  educationLevel: text('education_level'), // 'primary', 'high_school', 'college', 'professional'
  currentInstitution: text('current_institution'),
  fieldOfStudy: text('field_of_study'),
  
  // Learning Preferences
  careerGoals: text('career_goals'),
  learningObjectives: jsonb('learning_objectives').default([]),
  timeAvailability: integer('time_availability'), // minutes per day
  preferredStudyTime: text('preferred_study_time'), // 'morning', 'afternoon', 'evening', 'night'
  
  // Profile Completion Tracking
  completedSections: jsonb('completed_sections').default([]),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Teacher profiles for teacher-specific data
export const teacherProfiles = pgTable('teacher_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  
  // Contact Information
  phone: text('phone'),
  location: text('location'),
  
  // Professional Information
  displayName: varchar('display_name', { length: 255 }).notNull(),
  bio: text('bio'),
  qualifications: text('qualifications').array().default([]),
  teachingExperienceYears: integer('teaching_experience_years').default(0),
  currentInstitution: text('current_institution'),
  
  // Teaching Preferences
  subjects: text('subjects').array().default([]),
  educationLevels: text('education_levels').array().default([]),
  targetRegions: text('target_regions').array().default([]),
  preferredLanguages: text('preferred_languages').array().default([]),
  contentTypes: text('content_types').array().default([]),
  
  // Platform Goals
  revenueGoals: text('revenue_goals'),
  motivation: text('motivation'),
  
  // Platform Metrics
  revenueSharePercentage: decimal('revenue_share_percentage', { precision: 5, scale: 2 }).default('70.00'),
  totalRevenueEarned: decimal('total_revenue_earned', { precision: 12, scale: 2 }).default('0.00'),
  totalCoursesCreated: integer('total_courses_created').default(0),
  totalStudentsTaught: integer('total_students_taught').default(0),
  averageCourseRating: decimal('average_course_rating', { precision: 3, scale: 2 }).default('0.00'),
  
  // Status
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  status: varchar('status', { length: 50 }).default('active'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Researcher profiles for researcher-specific data
export const researcherProfiles = pgTable('researcher_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  
  // Professional Information
  displayName: varchar('display_name', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }),
  researchAreas: text('research_areas').array().default([]),
  academicTitle: varchar('academic_title', { length: 100 }),
  publications: jsonb('publications').default([]),
  researchInterests: text('research_interests'),
  
  // Platform Access
  dataAccessLevel: varchar('data_access_level', { length: 50 }).default('basic'),
  approvedDatasets: text('approved_datasets').array().default([]),
  researchProjects: jsonb('research_projects').default([]),
  collaborationPreferences: jsonb('collaboration_preferences').default({}),
  
  // Status
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  status: varchar('status', { length: 50 }).default('pending'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// ASSESSMENT TABLES (Preserved from original schema)
// ============================================================================

// Cognitive assessments
export const cognitiveAssessments = pgTable('cognitive_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  overallScore: integer('overall_score'),
  logicalReasoningScore: integer('logical_reasoning_score'),
  numericalReasoningScore: integer('numerical_reasoning_score'),
  verbalReasoningScore: integer('verbal_reasoning_score'),
  spatialReasoningScore: integer('spatial_reasoning_score'),
  workingMemoryScore: integer('working_memory_score'),
  processingSpeedScore: integer('processing_speed_score'),
  detailedResults: jsonb('detailed_results').default({}),
  completionTime: integer('completion_time'), // in seconds
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Personality assessments
export const personalityAssessments = pgTable('personality_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  jungType: text('jung_type'), // MBTI type
  jungDescription: text('jung_description'),
  bigFiveScores: jsonb('big_five_scores').default({}),
  keyTraits: jsonb('key_traits').default([]),
  workStyle: text('work_style'),
  communicationStyle: text('communication_style'),
  leadershipPotential: integer('leadership_potential'),
  teamCompatibility: integer('team_compatibility'),
  detailedResults: jsonb('detailed_results').default({}),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Learning preferences
export const learningPreferences = pgTable('learning_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  learningStyle: text('learning_style'), // 'visual', 'auditory', 'kinesthetic', 'reading'
  preferredContentFormat: jsonb('preferred_content_format').default([]),
  difficultyPreference: text('difficulty_preference'), // 'easy', 'moderate', 'challenging'
  pacePreference: text('pace_preference'), // 'slow', 'moderate', 'fast'
  feedbackPreference: text('feedback_preference'), // 'immediate', 'periodic', 'minimal'
  motivationalFactors: jsonb('motivational_factors').default([]),
  distractionLevel: integer('distraction_level'), // 1-10 scale
  attentionSpan: integer('attention_span'), // in minutes
  preferredSessionLength: integer('preferred_session_length'), // in minutes
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// CONTENT & CURRICULUM TABLES (Preserved from original schema)
// ============================================================================

// Subjects - STEM subjects from syllabus
export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // 'Mathematics', 'Physics', etc.
  displayName: text('display_name').notNull(),
  description: text('description'),
  category: text('category'), // 'STEM', 'Language', etc.
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Education levels and examination boards
export const educationLevels = pgTable('education_levels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // 'o_level', 'a_level'
  displayName: text('display_name').notNull(), // 'O Level', 'A Level'
  description: text('description'),
  isActive: boolean('is_active').default(true),
});

export const examinationBoards = pgTable('examination_boards', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // 'Cambridge International'
  syllabusCode: text('syllabus_code'), // '4024'
  subjectId: uuid('subject_id').references(() => subjects.id).notNull(),
  educationLevelId: uuid('education_level_id').references(() => educationLevels.id).notNull(),
  isActive: boolean('is_active').default(true),
});

// Topics within subjects
export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  subjectId: uuid('subject_id').references(() => subjects.id).notNull(),
  educationLevelId: uuid('education_level_id').references(() => educationLevels.id).notNull(),
  examinationBoardId: uuid('examination_board_id').references(() => examinationBoards.id),
  learningObjectives: jsonb('learning_objectives').default([]),
  content: text('content'),
  activities: jsonb('activities').default([]),
  difficulty: integer('difficulty'), // 1-10 scale
  estimatedDuration: integer('estimated_duration'), // in minutes
  prerequisites: jsonb('prerequisites').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// COURSE SYSTEM (Unified and Enhanced)
// ============================================================================

// Unified courses table
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Ownership
  studentId: text('student_id').references(() => users.id).notNull(), // Student who requested the course
  teacherId: text('teacher_id').references(() => users.id), // Teacher who created the course (if applicable)
  
  // Basic Information
  title: text('title').notNull(),
  description: text('description'),
  
  // Content Classification
  subjectId: uuid('subject_id').references(() => subjects.id),
  topicId: uuid('topic_id').references(() => topics.id),
  educationLevelId: uuid('education_level_id').references(() => educationLevels.id),
  
  // Course Properties
  difficulty: integer('difficulty').default(1), // 1-10 scale
  estimatedDuration: integer('estimated_duration'), // in minutes
  contentType: text('content_type').default('study'), // 'study', 'assessment', 'hybrid'
  isPersonalized: boolean('is_personalized').default(true),
  
  // AI Generation
  generationPrompt: text('generation_prompt'),
  contentGenerationMetadata: jsonb('content_generation_metadata').default({}),
  aiContentStatus: jsonb('ai_content_status').default({}),
  generatedContent: jsonb('generated_content').default({}),
  
  // Course Status
  status: text('status').default('draft'), // 'draft', 'active', 'completed', 'archived'
  progressPercentage: integer('progress_percentage').default(0),
  
  // Business Model
  revenueModel: varchar('revenue_model', { length: 50 }).default('free'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  enrollmentCount: integer('enrollment_count').default(0),
  revenueGenerated: decimal('revenue_generated', { precision: 12, scale: 2 }).default('0.00'),
  
  // Quality Metrics
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalRatings: integer('total_ratings').default(0),
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0.00'),
  
  // Curriculum Alignment
  syllabusAlignment: text('syllabus_alignment'),
  examinationBoard: varchar('examination_board', { length: 100 }),
  targetRegion: varchar('target_region', { length: 100 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course modules for structured course content
export const courseModules = pgTable('course_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'text', 'video', 'audio', 'interactive', 'assessment'
  contentData: jsonb('content_data').default({}).notNull(),
  aiGenerated: boolean('ai_generated').default(false),
  generationMetadata: jsonb('generation_metadata').default({}),
  estimatedDuration: integer('estimated_duration'), // in minutes
  learningObjectives: text('learning_objectives').array().default([]),
  prerequisites: text('prerequisites').array().default([]),
  difficultyLevel: integer('difficulty_level').default(1),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// CAREER & LEARNING PATH SYSTEM (Preserved from original schema)
// ============================================================================

// Career paths
export const careerPaths = pgTable('career_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'), // 'Technology', 'Healthcare', etc.
  requiredSkills: jsonb('required_skills').default([]),
  salaryRange: jsonb('salary_range').default({}),
  growthOutlook: text('growth_outlook'), // 'high', 'moderate', 'low'
  educationRequirements: jsonb('education_requirements').default({}),
  certifications: jsonb('certifications').default([]),
  workEnvironment: text('work_environment'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Career recommendations for users
export const careerRecommendations = pgTable('career_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  careerPathId: uuid('career_path_id').references(() => careerPaths.id).notNull(),
  fitScore: integer('fit_score'), // 0-100
  reasoning: text('reasoning'),
  timelineEstimate: text('timeline_estimate'),
  requiredSteps: jsonb('required_steps').default([]),
  skillGaps: jsonb('skill_gaps').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Learning roadmaps
export const learningRoadmaps = pgTable('learning_roadmaps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  careerPathId: uuid('career_path_id').references(() => careerPaths.id),
  title: text('title').notNull(),
  description: text('description'),
  currentEducationLevel: text('current_education_level'),
  targetCareer: text('target_career'),
  estimatedDurationMonths: integer('estimated_duration_months'),
  totalMilestones: integer('total_milestones'),
  completedMilestones: integer('completed_milestones').default(0),
  progressPercentage: integer('progress_percentage').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Roadmap milestones
export const roadmapMilestones = pgTable('roadmap_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  roadmapId: uuid('roadmap_id').references(() => learningRoadmaps.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  estimatedDuration: text('estimated_duration'),
  requiredSkills: jsonb('required_skills').default([]),
  resources: jsonb('resources').default([]),
  assessmentCriteria: jsonb('assessment_criteria').default([]),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// PROGRESS & ANALYTICS SYSTEM (Preserved from original schema)
// ============================================================================

// User progress tracking
export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id),
  moduleId: uuid('module_id').references(() => courseModules.id),
  topicId: uuid('topic_id').references(() => topics.id),
  progressType: text('progress_type').notNull(), // 'course', 'module', 'topic'
  progressPercentage: integer('progress_percentage').default(0),
  timeSpent: integer('time_spent').default(0), // in seconds
  lastAccessedAt: timestamp('last_accessed_at'),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Study sessions
export const studySessions = pgTable('study_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id),
  moduleId: uuid('module_id').references(() => courseModules.id),
  scheduledFor: timestamp('scheduled_for'),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  duration: integer('duration'), // in seconds
  sessionType: text('session_type'), // 'study', 'assessment', 'review'
  status: text('status').default('scheduled'), // 'scheduled', 'active', 'completed', 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// GAMIFICATION SYSTEM (Preserved from original schema)
// ============================================================================

// Gamification profiles
export const gamificationProfiles = pgTable('gamification_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  totalXp: integer('total_xp').default(0),
  currentLevel: integer('current_level').default(1),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  totalStudyTime: integer('total_study_time').default(0), // in seconds
  coursesCompleted: integer('courses_completed').default(0),
  assessmentsCompleted: integer('assessments_completed').default(0),
  lastActivityDate: timestamp('last_activity_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Achievements
export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'), // 'learning', 'streak', 'assessment', 'social'
  iconUrl: text('icon_url'),
  xpReward: integer('xp_reward').default(0),
  requirements: jsonb('requirements').default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User achievements
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  achievementId: uuid('achievement_id').references(() => achievements.id).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  isNotified: boolean('is_notified').default(false),
});

// XP transactions
export const xpTransactions = pgTable('xp_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(), // 'course_completion', 'daily_streak', etc.
  referenceId: uuid('reference_id'), // ID of related entity (course, achievement, etc.)
  referenceType: text('reference_type'), // 'course', 'achievement', 'assessment'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// ENHANCED CONTENT MANAGEMENT SYSTEM
// ============================================================================

// Content versions for version control
export const contentVersions = pgTable('content_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: uuid('module_id').references(() => courseModules.id).notNull(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'core', 'bite-sized', 'video-script', etc.
  versionNumber: integer('version_number').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  contentHtml: text('content_html'), // Rendered HTML version
  summary: text('summary'),
  wordCount: integer('word_count').default(0),
  readingTime: integer('reading_time').default(0), // in minutes
  creationMethod: varchar('creation_method', { length: 50 }).default('manual'), // 'ai', 'manual', 'hybrid'
  aiPrompt: text('ai_prompt'), // Original AI prompt if AI-generated
  aiModel: varchar('ai_model', { length: 100 }), // AI model used
  generationMetadata: jsonb('generation_metadata').default({}),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdBy: text('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media assets for file management
export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // 'image', 'video', 'audio', 'document'
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  storageUrl: text('storage_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  altText: text('alt_text'),
  description: text('description'),
  tags: text('tags').array().default([]),
  isPublic: boolean('is_public').default(false),
  uploadedBy: text('uploaded_by').references(() => users.id).notNull(),
  usageCount: integer('usage_count').default(0),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Assessment questions for question bank
export const assessmentQuestions = pgTable('assessment_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: uuid('module_id').references(() => courseModules.id),
  questionType: varchar('question_type', { length: 50 }).notNull(), // 'multiple_choice', 'true_false', 'short_answer', etc.
  questionText: text('question_text').notNull(),
  questionHtml: text('question_html'), // Rich text version
  options: jsonb('options').default([]), // For multiple choice questions
  correctAnswer: text('correct_answer'),
  explanation: text('explanation'),
  points: integer('points').default(1),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'), // 'easy', 'medium', 'hard'
  timeLimit: integer('time_limit'), // in seconds
  tags: text('tags').array().default([]),
  isActive: boolean('is_active').default(true),
  createdBy: text('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content templates for reusable content structures
export const contentTemplates = pgTable('content_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // 'lesson', 'assessment', 'activity'
  contentType: varchar('content_type', { length: 50 }).notNull(),
  template: text('template').notNull(), // Template content with placeholders
  variables: jsonb('variables').default([]), // Template variable definitions
  isPublic: boolean('is_public').default(false),
  usageCount: integer('usage_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  totalRatings: integer('total_ratings').default(0),
  createdBy: text('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content collaborations for multi-user editing
export const contentCollaborations = pgTable('content_collaborations', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentVersionId: uuid('content_version_id').references(() => contentVersions.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 50 }).default('editor'), // 'owner', 'editor', 'reviewer', 'viewer'
  permissions: jsonb('permissions').default({}),
  invitedBy: text('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at').defaultNow().notNull(),
  acceptedAt: timestamp('accepted_at'),
  lastActiveAt: timestamp('last_active_at'),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'active', 'inactive'
});

// Content analytics for performance tracking
export const contentAnalytics = pgTable('content_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentVersionId: uuid('content_version_id').references(() => contentVersions.id).notNull(),
  userId: text('user_id').references(() => users.id),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'view', 'edit', 'share', 'complete'
  eventData: jsonb('event_data').default({}),
  sessionId: varchar('session_id', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Assessment attempts for student assessment data
export const assessmentAttempts = pgTable('assessment_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  moduleId: uuid('module_id').references(() => courseModules.id).notNull(),
  questionId: uuid('question_id').references(() => assessmentQuestions.id),
  attemptNumber: integer('attempt_number').default(1),
  userAnswer: text('user_answer'),
  isCorrect: boolean('is_correct'),
  pointsEarned: integer('points_earned').default(0),
  timeSpent: integer('time_spent'), // in seconds
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  feedback: text('feedback'),
  metadata: jsonb('metadata').default({}),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  teacherProfile: one(teacherProfiles, {
    fields: [users.id],
    references: [teacherProfiles.userId],
  }),
  researcherProfile: one(researcherProfiles, {
    fields: [users.id],
    references: [researcherProfiles.userId],
  }),
  cognitiveAssessment: one(cognitiveAssessments, {
    fields: [users.id],
    references: [cognitiveAssessments.userId],
  }),
  personalityAssessment: one(personalityAssessments, {
    fields: [users.id],
    references: [personalityAssessments.userId],
  }),
  learningPreferences: one(learningPreferences, {
    fields: [users.id],
    references: [learningPreferences.userId],
  }),
  coursesAsStudent: many(courses, { relationName: 'studentCourses' }),
  coursesAsTeacher: many(courses, { relationName: 'teacherCourses' }),
  progress: many(userProgress),
  gamification: one(gamificationProfiles, {
    fields: [users.id],
    references: [gamificationProfiles.userId],
  }),
  achievements: many(userAchievements),
  careerRecommendations: many(careerRecommendations),
  learningRoadmaps: many(learningRoadmaps),
  roleHistory: many(roleHistory),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));

export const teacherProfilesRelations = relations(teacherProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [teacherProfiles.userId],
    references: [users.id],
  }),
  courses: many(courses, { relationName: 'teacherCourses' }),
}));

export const researcherProfilesRelations = relations(researcherProfiles, ({ one }) => ({
  user: one(users, {
    fields: [researcherProfiles.userId],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  student: one(users, {
    fields: [courses.studentId],
    references: [users.id],
    relationName: 'studentCourses',
  }),
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
    relationName: 'teacherCourses',
  }),
  subject: one(subjects, {
    fields: [courses.subjectId],
    references: [subjects.id],
  }),
  topic: one(topics, {
    fields: [courses.topicId],
    references: [topics.id],
  }),
  educationLevel: one(educationLevels, {
    fields: [courses.educationLevelId],
    references: [educationLevels.id],
  }),
  modules: many(courseModules),
  progress: many(userProgress),
}));

export const courseModulesRelations = relations(courseModules, ({ one }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  topics: many(topics),
  courses: many(courses),
  examinationBoards: many(examinationBoards),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
  educationLevel: one(educationLevels, {
    fields: [topics.educationLevelId],
    references: [educationLevels.id],
  }),
  examinationBoard: one(examinationBoards, {
    fields: [topics.examinationBoardId],
    references: [examinationBoards.id],
  }),
  courses: many(courses),
}));

export const careerPathsRelations = relations(careerPaths, ({ many }) => ({
  recommendations: many(careerRecommendations),
  roadmaps: many(learningRoadmaps),
}));

export const learningRoadmapsRelations = relations(learningRoadmaps, ({ one, many }) => ({
  user: one(users, {
    fields: [learningRoadmaps.userId],
    references: [users.id],
  }),
  careerPath: one(careerPaths, {
    fields: [learningRoadmaps.careerPathId],
    references: [careerPaths.id],
  }),
  milestones: many(roadmapMilestones),
}));

export const roleHistoryRelations = relations(roleHistory, ({ one }) => ({
  user: one(users, {
    fields: [roleHistory.userId],
    references: [users.id],
  }),
}));
