CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"icon_url" text,
	"xp_reward" integer DEFAULT 0,
	"requirements" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"module_id" uuid NOT NULL,
	"question_id" uuid,
	"attempt_number" integer DEFAULT 1,
	"user_answer" text,
	"is_correct" boolean,
	"points_earned" integer DEFAULT 0,
	"time_spent" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"feedback" text,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid,
	"question_type" varchar(50) NOT NULL,
	"question_text" text NOT NULL,
	"question_html" text,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" text,
	"explanation" text,
	"points" integer DEFAULT 1,
	"difficulty" varchar(20) DEFAULT 'medium',
	"time_limit" integer,
	"tags" text[] DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"required_skills" jsonb DEFAULT '[]'::jsonb,
	"salary_range" jsonb DEFAULT '{}'::jsonb,
	"growth_outlook" text,
	"education_requirements" jsonb DEFAULT '{}'::jsonb,
	"certifications" jsonb DEFAULT '[]'::jsonb,
	"work_environment" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"career_path_id" uuid NOT NULL,
	"fit_score" integer,
	"reasoning" text,
	"timeline_estimate" text,
	"required_steps" jsonb DEFAULT '[]'::jsonb,
	"skill_gaps" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cognitive_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"overall_score" integer,
	"logical_reasoning_score" integer,
	"numerical_reasoning_score" integer,
	"verbal_reasoning_score" integer,
	"spatial_reasoning_score" integer,
	"working_memory_score" integer,
	"processing_speed_score" integer,
	"detailed_results" jsonb DEFAULT '{}'::jsonb,
	"completion_time" integer,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" uuid NOT NULL,
	"user_id" text,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb DEFAULT '{}'::jsonb,
	"session_id" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"referrer" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar(50) DEFAULT 'editor',
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"invited_by" text,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	"last_active_at" timestamp,
	"status" varchar(20) DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "content_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"content_type" varchar(50) NOT NULL,
	"template" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"total_ratings" integer DEFAULT 0,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"version_number" integer NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"content_html" text,
	"summary" text,
	"word_count" integer DEFAULT 0,
	"reading_time" integer DEFAULT 0,
	"creation_method" varchar(50) DEFAULT 'manual',
	"ai_prompt" text,
	"ai_model" varchar(100),
	"generation_metadata" jsonb DEFAULT '{}'::jsonb,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ai_generated" boolean DEFAULT false,
	"generation_metadata" jsonb DEFAULT '{}'::jsonb,
	"estimated_duration" integer,
	"learning_objectives" text[] DEFAULT '{}',
	"prerequisites" text[] DEFAULT '{}',
	"difficulty_level" integer DEFAULT 1,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"teacher_id" text,
	"title" text NOT NULL,
	"description" text,
	"subject_id" uuid,
	"topic_id" uuid,
	"education_level_id" uuid,
	"difficulty" integer DEFAULT 1,
	"estimated_duration" integer,
	"content_type" text DEFAULT 'study',
	"is_personalized" boolean DEFAULT true,
	"generation_prompt" text,
	"content_generation_metadata" jsonb DEFAULT '{}'::jsonb,
	"ai_content_status" jsonb DEFAULT '{}'::jsonb,
	"generated_content" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'draft',
	"progress_percentage" integer DEFAULT 0,
	"revenue_model" varchar(50) DEFAULT 'free',
	"price" numeric(10, 2) DEFAULT '0.00',
	"enrollment_count" integer DEFAULT 0,
	"revenue_generated" numeric(12, 2) DEFAULT '0.00',
	"average_rating" numeric(3, 2) DEFAULT '0.00',
	"total_ratings" integer DEFAULT 0,
	"completion_rate" numeric(5, 2) DEFAULT '0.00',
	"syllabus_alignment" text,
	"examination_board" varchar(100),
	"target_region" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "examination_boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"syllabus_code" text,
	"subject_id" uuid NOT NULL,
	"education_level_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "gamification_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"total_xp" integer DEFAULT 0,
	"current_level" integer DEFAULT 1,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_study_time" integer DEFAULT 0,
	"courses_completed" integer DEFAULT 0,
	"assessments_completed" integer DEFAULT 0,
	"last_activity_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gamification_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "learning_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"learning_style" text,
	"preferred_content_format" jsonb DEFAULT '[]'::jsonb,
	"difficulty_preference" text,
	"pace_preference" text,
	"feedback_preference" text,
	"motivational_factors" jsonb DEFAULT '[]'::jsonb,
	"distraction_level" integer,
	"attention_span" integer,
	"preferred_session_length" integer,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_roadmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"career_path_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"current_education_level" text,
	"target_career" text,
	"estimated_duration_months" integer,
	"total_milestones" integer,
	"completed_milestones" integer DEFAULT 0,
	"progress_percentage" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"storage_url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" text,
	"description" text,
	"tags" text[] DEFAULT '{}',
	"is_public" boolean DEFAULT false,
	"uploaded_by" text NOT NULL,
	"usage_count" integer DEFAULT 0,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personality_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"jung_type" text,
	"jung_description" text,
	"big_five_scores" jsonb DEFAULT '{}'::jsonb,
	"key_traits" jsonb DEFAULT '[]'::jsonb,
	"work_style" text,
	"communication_style" text,
	"leadership_potential" integer,
	"team_compatibility" integer,
	"detailed_results" jsonb DEFAULT '{}'::jsonb,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researcher_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"institution" varchar(255),
	"research_areas" text[] DEFAULT '{}',
	"academic_title" varchar(100),
	"publications" jsonb DEFAULT '[]'::jsonb,
	"research_interests" text,
	"data_access_level" varchar(50) DEFAULT 'basic',
	"approved_datasets" text[] DEFAULT '{}',
	"research_projects" jsonb DEFAULT '[]'::jsonb,
	"collaboration_preferences" jsonb DEFAULT '{}'::jsonb,
	"is_verified" boolean DEFAULT false,
	"verification_date" timestamp,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "researcher_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "roadmap_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roadmap_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"estimated_duration" text,
	"required_skills" jsonb DEFAULT '[]'::jsonb,
	"resources" jsonb DEFAULT '[]'::jsonb,
	"assessment_criteria" jsonb DEFAULT '[]'::jsonb,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"from_role" varchar(50),
	"to_role" varchar(50) NOT NULL,
	"switched_at" timestamp DEFAULT now() NOT NULL,
	"session_duration" integer,
	"ip_address" varchar(45),
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date_of_birth" timestamp,
	"location" text,
	"phone" text,
	"education_level" text,
	"current_institution" text,
	"field_of_study" text,
	"career_goals" text,
	"learning_objectives" jsonb DEFAULT '[]'::jsonb,
	"time_availability" integer,
	"preferred_study_time" text,
	"completed_sections" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid,
	"module_id" uuid,
	"scheduled_for" timestamp,
	"started_at" timestamp,
	"ended_at" timestamp,
	"duration" integer,
	"session_type" text,
	"status" text DEFAULT 'scheduled',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"category" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"phone" text,
	"location" text,
	"display_name" varchar(255) NOT NULL,
	"bio" text,
	"qualifications" text[] DEFAULT '{}',
	"teaching_experience_years" integer DEFAULT 0,
	"current_institution" text,
	"subjects" text[] DEFAULT '{}',
	"education_levels" text[] DEFAULT '{}',
	"target_regions" text[] DEFAULT '{}',
	"preferred_languages" text[] DEFAULT '{}',
	"content_types" text[] DEFAULT '{}',
	"revenue_goals" text,
	"motivation" text,
	"revenue_share_percentage" numeric(5, 2) DEFAULT '70.00',
	"total_revenue_earned" numeric(12, 2) DEFAULT '0.00',
	"total_courses_created" integer DEFAULT 0,
	"total_students_taught" integer DEFAULT 0,
	"average_course_rating" numeric(3, 2) DEFAULT '0.00',
	"is_verified" boolean DEFAULT false,
	"verification_date" timestamp,
	"status" varchar(50) DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"subject_id" uuid NOT NULL,
	"education_level_id" uuid NOT NULL,
	"examination_board_id" uuid,
	"learning_objectives" jsonb DEFAULT '[]'::jsonb,
	"content" text,
	"activities" jsonb DEFAULT '[]'::jsonb,
	"difficulty" integer,
	"estimated_duration" integer,
	"prerequisites" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"achievement_id" uuid NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"is_notified" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid,
	"module_id" uuid,
	"topic_id" uuid,
	"progress_type" text NOT NULL,
	"progress_percentage" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"last_accessed_at" timestamp,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"current_role" varchar(50) DEFAULT 'student' NOT NULL,
	"available_roles" text[] DEFAULT '{"student"}' NOT NULL,
	"role_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"profile_completion_status" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_profile_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "xp_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"reference_id" uuid,
	"reference_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_question_id_assessment_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."assessment_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_recommendations" ADD CONSTRAINT "career_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_recommendations" ADD CONSTRAINT "career_recommendations_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cognitive_assessments" ADD CONSTRAINT "cognitive_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_collaborations" ADD CONSTRAINT "content_collaborations_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_collaborations" ADD CONSTRAINT "content_collaborations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_collaborations" ADD CONSTRAINT "content_collaborations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_education_level_id_education_levels_id_fk" FOREIGN KEY ("education_level_id") REFERENCES "public"."education_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examination_boards" ADD CONSTRAINT "examination_boards_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examination_boards" ADD CONSTRAINT "examination_boards_education_level_id_education_levels_id_fk" FOREIGN KEY ("education_level_id") REFERENCES "public"."education_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gamification_profiles" ADD CONSTRAINT "gamification_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_preferences" ADD CONSTRAINT "learning_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_roadmaps" ADD CONSTRAINT "learning_roadmaps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_roadmaps" ADD CONSTRAINT "learning_roadmaps_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personality_assessments" ADD CONSTRAINT "personality_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_profiles" ADD CONSTRAINT "researcher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_milestones" ADD CONSTRAINT "roadmap_milestones_roadmap_id_learning_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."learning_roadmaps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_history" ADD CONSTRAINT "role_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_education_level_id_education_levels_id_fk" FOREIGN KEY ("education_level_id") REFERENCES "public"."education_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_examination_board_id_examination_boards_id_fk" FOREIGN KEY ("examination_board_id") REFERENCES "public"."examination_boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;