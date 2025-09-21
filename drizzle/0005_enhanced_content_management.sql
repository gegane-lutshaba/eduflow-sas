-- Enhanced Content Management Schema
-- This migration adds support for manual content editing, versioning, media management, and assessment building

-- Content versions for tracking changes and history
CREATE TABLE IF NOT EXISTS "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"content_type" varchar(50) NOT NULL, -- 'core', 'bite-sized', 'video-script', etc.
	"version_number" integer NOT NULL DEFAULT 1,
	"content_data" jsonb DEFAULT '{}' NOT NULL,
	"creation_method" varchar(20) DEFAULT 'manual' NOT NULL, -- 'ai', 'manual', 'hybrid'
	"created_by" text NOT NULL,
	"is_published" boolean DEFAULT false,
	"is_current" boolean DEFAULT false,
	"change_summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Media assets management
CREATE TABLE IF NOT EXISTS "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL, -- 'image', 'video', 'audio', 'document'
	"mime_type" varchar(100) NOT NULL,
	"file_size" bigint NOT NULL,
	"storage_url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" text,
	"description" text,
	"metadata" jsonb DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"is_public" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Assessment questions bank
CREATE TABLE IF NOT EXISTS "assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"question_type" varchar(50) NOT NULL, -- 'multiple_choice', 'true_false', 'fill_blank', 'essay', 'matching', 'drag_drop'
	"question_text" text NOT NULL,
	"question_data" jsonb DEFAULT '{}' NOT NULL, -- stores options, correct answers, etc.
	"explanation" text,
	"difficulty_level" integer DEFAULT 1, -- 1-10 scale
	"points" integer DEFAULT 1,
	"time_limit" integer, -- in seconds
	"order_index" integer NOT NULL,
	"tags" text[] DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Content templates for reusable content structures
CREATE TABLE IF NOT EXISTS "content_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_name" varchar(255) NOT NULL,
	"template_type" varchar(50) NOT NULL, -- 'core_content', 'assessment', 'video_script', etc.
	"template_data" jsonb DEFAULT '{}' NOT NULL,
	"description" text,
	"category" varchar(100), -- 'mathematics', 'science', 'language', etc.
	"education_level" varchar(50),
	"is_public" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Content collaboration for tracking who worked on what
CREATE TABLE IF NOT EXISTS "content_collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar(50) NOT NULL, -- 'owner', 'editor', 'reviewer', 'viewer'
	"permissions" jsonb DEFAULT '{}' NOT NULL,
	"last_accessed" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Content analytics for tracking performance
CREATE TABLE IF NOT EXISTS "content_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"version_id" uuid,
	"metric_type" varchar(50) NOT NULL, -- 'view', 'engagement', 'completion', 'rating'
	"metric_value" decimal(10,4) NOT NULL,
	"user_id" text,
	"session_id" varchar(255),
	"metadata" jsonb DEFAULT '{}',
	"recorded_at" timestamp DEFAULT now() NOT NULL
);

-- Assessment attempts for tracking student performance
CREATE TABLE IF NOT EXISTS "assessment_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"attempt_number" integer NOT NULL DEFAULT 1,
	"questions_data" jsonb DEFAULT '{}' NOT NULL, -- snapshot of questions at attempt time
	"answers_data" jsonb DEFAULT '{}' NOT NULL,
	"score" decimal(5,2),
	"max_score" decimal(5,2),
	"time_taken" integer, -- in seconds
	"is_completed" boolean DEFAULT false,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_collaborations" ADD CONSTRAINT "content_collaborations_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_collaborations" ADD CONSTRAINT "content_collaborations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_version_id_content_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "content_versions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "content_versions_module_content_idx" ON "content_versions" ("module_id", "content_type");
CREATE INDEX IF NOT EXISTS "content_versions_current_idx" ON "content_versions" ("is_current") WHERE "is_current" = true;
CREATE INDEX IF NOT EXISTS "media_assets_user_type_idx" ON "media_assets" ("user_id", "file_type");
CREATE INDEX IF NOT EXISTS "assessment_questions_module_idx" ON "assessment_questions" ("module_id", "order_index");
CREATE INDEX IF NOT EXISTS "content_templates_type_category_idx" ON "content_templates" ("template_type", "category");
CREATE INDEX IF NOT EXISTS "content_analytics_module_type_idx" ON "content_analytics" ("module_id", "content_type", "metric_type");
CREATE INDEX IF NOT EXISTS "assessment_attempts_user_module_idx" ON "assessment_attempts" ("user_id", "module_id");

-- Add some useful views
CREATE OR REPLACE VIEW "current_content_versions" AS
SELECT 
    cv.*,
    cm.title as module_title,
    cm.course_id,
    u.first_name || ' ' || u.last_name as created_by_name
FROM content_versions cv
JOIN course_modules cm ON cv.module_id = cm.id
JOIN users u ON cv.created_by = u.id
WHERE cv.is_current = true;

CREATE OR REPLACE VIEW "content_performance_summary" AS
SELECT 
    ca.module_id,
    ca.content_type,
    COUNT(CASE WHEN ca.metric_type = 'view' THEN 1 END) as total_views,
    AVG(CASE WHEN ca.metric_type = 'engagement' THEN ca.metric_value END) as avg_engagement,
    AVG(CASE WHEN ca.metric_type = 'rating' THEN ca.metric_value END) as avg_rating,
    COUNT(DISTINCT ca.user_id) as unique_users
FROM content_analytics ca
GROUP BY ca.module_id, ca.content_type;
