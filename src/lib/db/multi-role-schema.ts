import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, decimal, varchar, date, check } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// MULTI-ROLE AUTHENTICATION SYSTEM
// ============================================================================

// User roles table for multi-role management
export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  availableRoles: text('available_roles').array().default(['student']).notNull(),
  currentRole: varchar('current_role', { length: 50 }).default('student').notNull(),
  rolePreferences: jsonb('role_preferences').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Role history for tracking role switches
export const roleHistory = pgTable('role_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  fromRole: varchar('from_role', { length: 50 }),
  toRole: varchar('to_role', { length: 50 }).notNull(),
  switchedAt: timestamp('switched_at').defaultNow().notNull(),
  sessionDuration: integer('session_duration'), // in minutes
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

// Teacher profiles for teacher-specific data
export const teacherProfiles = pgTable('teacher_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  bio: text('bio'),
  expertiseAreas: text('expertise_areas').array().default([]),
  educationBackground: jsonb('education_background').default({}),
  certifications: jsonb('certifications').default([]),
  teachingExperienceYears: integer('teaching_experience_years').default(0),
  preferredSubjects: text('preferred_subjects').array().default([]),
  preferredEducationLevels: text('preferred_education_levels').array().default([]),
  preferredRegions: text('preferred_regions').array().default([]),
  revenueSharePercentage: decimal('revenue_share_percentage', { precision: 5, scale: 2 }).default('70.00'),
  totalRevenueEarned: decimal('total_revenue_earned', { precision: 12, scale: 2 }).default('0.00'),
  totalCoursesCreated: integer('total_courses_created').default(0),
  totalStudentsTaught: integer('total_students_taught').default(0),
  averageCourseRating: decimal('average_course_rating', { precision: 3, scale: 2 }).default('0.00'),
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Researcher profiles for researcher-specific data
export const researcherProfiles = pgTable('researcher_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }),
  researchAreas: text('research_areas').array().default([]),
  academicTitle: varchar('academic_title', { length: 100 }),
  publications: jsonb('publications').default([]),
  researchInterests: text('research_interests'),
  dataAccessLevel: varchar('data_access_level', { length: 50 }).default('basic'),
  approvedDatasets: text('approved_datasets').array().default([]),
  researchProjects: jsonb('research_projects').default([]),
  collaborationPreferences: jsonb('collaboration_preferences').default({}),
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// ENHANCED COURSE SYSTEM
// ============================================================================

// Enhanced courses table with multi-modal content support
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Student who requested the course
  teacherId: varchar('teacher_id', { length: 255 }), // Teacher who created the course
  title: text('title').notNull(),
  description: text('description'),
  subjectId: uuid('subject_id'),
  topicId: uuid('topic_id'),
  educationLevelId: uuid('education_level_id'),
  difficulty: integer('difficulty'), // 1-10 scale
  estimatedDuration: integer('estimated_duration'), // in minutes
  contentType: text('content_type'), // 'study', 'assessment', 'hybrid'
  isPersonalized: boolean('is_personalized').default(true),
  generationPrompt: text('generation_prompt'), // AI prompt used to generate content
  status: text('status').default('draft'), // 'draft', 'active', 'completed', 'archived'
  progressPercentage: integer('progress_percentage').default(0),
  
  // Multi-modal content fields
  contentGenerationMetadata: jsonb('content_generation_metadata').default({}),
  aiContentStatus: jsonb('ai_content_status').default({}),
  generatedContent: jsonb('generated_content').default({}),
  revenueModel: varchar('revenue_model', { length: 50 }).default('free'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  enrollmentCount: integer('enrollment_count').default(0),
  revenueGenerated: decimal('revenue_generated', { precision: 12, scale: 2 }).default('0.00'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalRatings: integer('total_ratings').default(0),
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0.00'),
  syllabusAlignment: text('syllabus_alignment'),
  examinationBoard: varchar('examination_board', { length: 100 }),
  targetRegion: varchar('target_region', { length: 100 }),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course modules for structured course content
export const courseModules = pgTable('course_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
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

// Course enrollments for tracking student enrollments
export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  studentId: varchar('student_id', { length: 255 }).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  progressPercentage: decimal('progress_percentage', { precision: 5, scale: 2 }).default('0.00'),
  lastAccessedAt: timestamp('last_accessed_at'),
  completionStatus: varchar('completion_status', { length: 50 }).default('in_progress'),
  finalGrade: decimal('final_grade', { precision: 5, scale: 2 }),
  timeSpentMinutes: integer('time_spent_minutes').default(0),
  modulesCompleted: integer('modules_completed').default(0),
  assessmentsCompleted: integer('assessments_completed').default(0),
  certificateIssued: boolean('certificate_issued').default(false),
  certificateIssuedAt: timestamp('certificate_issued_at'),
});

// Course ratings for course reviews and ratings
export const courseRatings = pgTable('course_ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  studentId: varchar('student_id', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  reviewTitle: varchar('review_title', { length: 255 }),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  helpfulVotes: integer('helpful_votes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content generation jobs for tracking AI content generation
export const contentGenerationJobs = pgTable('content_generation_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  teacherId: varchar('teacher_id', { length: 255 }).notNull(),
  jobType: varchar('job_type', { length: 50 }).notNull(), // 'full_course', 'module', 'assessment', etc.
  contentTypes: text('content_types').array().notNull(), // ['text', 'images', 'videos', 'voice', 'assessments']
  generationParameters: jsonb('generation_parameters').default({}).notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'processing', 'completed', 'failed'
  progressPercentage: decimal('progress_percentage', { precision: 5, scale: 2 }).default('0.00'),
  generatedContent: jsonb('generated_content').default({}),
  generationMetadata: jsonb('generation_metadata').default({}),
  errorMessage: text('error_message'),
  tokensUsed: integer('tokens_used').default(0),
  generationCost: decimal('generation_cost', { precision: 10, scale: 4 }).default('0.00'),
  qualityScore: decimal('quality_score', { precision: 3, scale: 2 }),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Teacher analytics for teacher performance metrics
export const teacherAnalytics = pgTable('teacher_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: varchar('teacher_id', { length: 255 }).notNull(),
  date: date('date').notNull(),
  coursesCreated: integer('courses_created').default(0),
  totalEnrollments: integer('total_enrollments').default(0),
  newEnrollments: integer('new_enrollments').default(0),
  courseCompletions: integer('course_completions').default(0),
  revenueEarned: decimal('revenue_earned', { precision: 12, scale: 2 }).default('0.00'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalRatings: integer('total_ratings').default(0),
  contentGenerationJobs: integer('content_generation_jobs').default(0),
  aiTokensUsed: integer('ai_tokens_used').default(0),
  studentEngagementScore: decimal('student_engagement_score', { precision: 5, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Learning paths for structured learning journeys
export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  creatorId: varchar('creator_id', { length: 255 }).notNull(),
  creatorType: varchar('creator_type', { length: 50 }).notNull(), // 'teacher', 'system', 'ai'
  targetAudience: jsonb('target_audience').default({}),
  estimatedDurationHours: integer('estimated_duration_hours'),
  difficultyLevel: integer('difficulty_level').default(1),
  courseSequence: uuid('course_sequence').array().default([]),
  prerequisites: text('prerequisites').array().default([]),
  learningOutcomes: text('learning_outcomes').array().default([]),
  careerOutcomes: text('career_outcomes').array().default([]),
  isPublished: boolean('is_published').default(false),
  enrollmentCount: integer('enrollment_count').default(0),
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0.00'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// EXISTING SCHEMA (PRESERVED)
// ============================================================================

// Users table - core user information
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User profiles - extended user information
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  location: text('location'),
  educationLevel: text('education_level'), // 'primary', 'high_school', 'college', 'professional'
  currentInstitution: text('current_institution'),
  fieldOfStudy: text('field_of_study'),
  careerGoals: text('career_goals'),
  learningObjectives: jsonb('learning_objectives'), // Array of objectives
  timeAvailability: integer('time_availability'), // minutes per day
  preferredStudyTime: text('preferred_study_time'), // 'morning', 'afternoon', 'evening', 'night'
  isProfileComplete: boolean('is_profile_complete').default(false),
  completedSections: jsonb('completed_sections'), // Track which profile sections are complete
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
  detailedResults: jsonb('detailed_results'), // Store game-by-game results
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
  bigFiveScores: jsonb('big_five_scores'), // Openness, Conscientiousness, etc.
  keyTraits: jsonb('key_traits'), // Array of traits
  workStyle: text('work_style'),
  communicationStyle: text('communication_style'),
  leadershipPotential: integer('leadership_potential'),
  teamCompatibility: integer('team_compatibility'),
  detailedResults: jsonb('detailed_results'),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Learning preferences
export const learningPreferences = pgTable('learning_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  learningStyle: text('learning_style'), // 'visual', 'auditory', 'kinesthetic', 'reading'
  preferredContentFormat: jsonb('preferred_content_format'), // Array: 'video', 'text', 'interactive', 'audio'
  difficultyPreference: text('difficulty_preference'), // 'easy', 'moderate', 'challenging'
  pacePreference: text('pace_preference'), // 'slow', 'moderate', 'fast'
  feedbackPreference: text('feedback_preference'), // 'immediate', 'periodic', 'minimal'
  motivationalFactors: jsonb('motivational_factors'), // Array of motivating factors
  distractionLevel: integer('distraction_level'), // 1-10 scale
  attentionSpan: integer('attention_span'), // in minutes
  preferredSessionLength: integer('preferred_session_length'), // in minutes
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
  learningObjectives: jsonb('learning_objectives'), // Array of objectives
  content: text('content'),
  activities: jsonb('activities'), // Array of activities
  difficulty: integer('difficulty'), // 1-10 scale
  estimatedDuration: integer('estimated_duration'), // in minutes
  prerequisites: jsonb('prerequisites'), // Array of prerequisite topic IDs
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Career paths
export const careerPaths = pgTable('career_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'), // 'Technology', 'Healthcare', etc.
  requiredSkills: jsonb('required_skills'), // Array of skills
  salaryRange: jsonb('salary_range'), // {min: number, max: number, currency: string}
  growthOutlook: text('growth_outlook'), // 'high', 'moderate', 'low'
  educationRequirements: jsonb('education_requirements'),
  certifications: jsonb('certifications'), // Array of certifications
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
  requiredSteps: jsonb('required_steps'), // Array of steps
  skillGaps: jsonb('skill_gaps'), // Array of skills to develop
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
  requiredSkills: jsonb('required_skills'),
  resources: jsonb('resources'), // Array of learning resources
  assessmentCriteria: jsonb('assessment_criteria'),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

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
  requirements: jsonb('requirements'), // Conditions to unlock
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
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
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
  courses: many(courses),
  progress: many(userProgress),
  gamification: one(gamificationProfiles, {
    fields: [users.id],
    references: [gamificationProfiles.userId],
  }),
  achievements: many(userAchievements),
  careerRecommendations: many(careerRecommendations),
  learningRoadmaps: many(learningRoadmaps),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  modules: many(courseModules),
  progress: many(userProgress),
  enrollments: many(courseEnrollments),
  ratings: many(courseRatings),
}));

// Additional relations for multi-role tables
export const userRolesRelations = relations(userRoles, ({ many }) => ({
  history: many(roleHistory),
}));

export const teacherProfilesRelations = relations(teacherProfiles, ({ many }) => ({
  courses: many(courses),
  analytics: many(teacherAnalytics),
  contentJobs: many(contentGenerationJobs),
}));

export const courseModulesRelations = relations(courseModules, ({ one }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one }) => ({
  course: one(courses, {
    fields: [courseEnrollments.courseId],
    references: [courses.id],
  }),
}));

export const courseRatingsRelations = relations(courseRatings, ({ one }) => ({
  course: one(courses, {
    fields: [courseRatings.courseId],
    references: [courses.id],
  }),
}));
