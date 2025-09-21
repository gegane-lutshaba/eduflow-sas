import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from './db/connection';
import * as schema from './db/unified-schema';

export class UnifiedDatabaseService {
  // ============================================================================
  // USER MANAGEMENT (Single Source of Truth)
  // ============================================================================

  static async createUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    currentRole?: string;
    availableRoles?: string[];
  }) {
    try {
      const [user] = await db.insert(schema.users).values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        currentRole: userData.currentRole || 'student',
        availableRoles: userData.availableRoles || ['student'],
        rolePreferences: {},
        profileCompletionStatus: {},
        isProfileComplete: false,
      }).returning();

      // Create default gamification profile
      await db.insert(schema.gamificationProfiles).values({
        userId: user.id,
        totalXp: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyTime: 0,
        coursesCompleted: 0,
        assessmentsCompleted: 0,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async upsertUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    currentRole?: string;
    availableRoles?: string[];
  }) {
    try {
      // Check if user exists
      const [existingUser] = await db.select().from(schema.users).where(eq(schema.users.id, userData.id));
      
      if (existingUser) {
        // Update existing user
        const [updatedUser] = await db
          .update(schema.users)
          .set({
            email: userData.email,
            firstName: userData.firstName || existingUser.firstName,
            lastName: userData.lastName || existingUser.lastName,
            imageUrl: userData.imageUrl || existingUser.imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(schema.users.id, userData.id))
          .returning();

        return updatedUser;
      } else {
        // Create new user
        return await this.createUser(userData);
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  static async getUser(userId: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<typeof schema.users.$inferInsert>) {
    try {
      const [updatedUser] = await db
        .update(schema.users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, userId))
        .returning();

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  static async addRoleToUser(userId: string, newRole: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      
      if (user) {
        // Add role if not already present
        const updatedRoles = user.availableRoles.includes(newRole) 
          ? user.availableRoles 
          : [...user.availableRoles, newRole];

        const [updatedUser] = await db
          .update(schema.users)
          .set({
            availableRoles: updatedRoles,
            updatedAt: new Date(),
          })
          .where(eq(schema.users.id, userId))
          .returning();

        return updatedUser;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error adding role to user:', error);
      throw error;
    }
  }

  static async switchUserRole(userId: string, newRole: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.availableRoles.includes(newRole)) {
        throw new Error('User does not have access to this role');
      }

      // Record role switch in history
      await db.insert(schema.roleHistory).values({
        userId,
        fromRole: user.currentRole,
        toRole: newRole,
        switchedAt: new Date(),
      });

      // Update current role
      const [updatedUser] = await db
        .update(schema.users)
        .set({
          currentRole: newRole,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, userId))
        .returning();

      return updatedUser;
    } catch (error) {
      console.error('Error switching user role:', error);
      throw error;
    }
  }

  // ============================================================================
  // PROFILE MANAGEMENT (Role-Specific)
  // ============================================================================

  static async createStudentProfile(userId: string, profileData: {
    dateOfBirth?: Date;
    location?: string;
    phone?: string;
    educationLevel?: string;
    currentInstitution?: string;
    fieldOfStudy?: string;
    careerGoals?: string;
    learningObjectives?: any[];
    timeAvailability?: number;
    preferredStudyTime?: string;
  }) {
    try {
      const [profile] = await db.insert(schema.studentProfiles).values({
        userId,
        ...profileData,
        completedSections: ['basic_info'],
      }).returning();

      return profile;
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  }

  static async createTeacherProfile(userId: string, profileData: {
    phone?: string;
    location?: string;
    displayName: string;
    bio?: string;
    qualifications?: string[];
    teachingExperienceYears?: number;
    currentInstitution?: string;
    subjects?: string[];
    educationLevels?: string[];
    targetRegions?: string[];
    preferredLanguages?: string[];
    contentTypes?: string[];
    revenueGoals?: string;
    motivation?: string;
  }) {
    try {
      const [profile] = await db.insert(schema.teacherProfiles).values({
        userId,
        ...profileData,
        qualifications: profileData.qualifications || [],
        subjects: profileData.subjects || [],
        educationLevels: profileData.educationLevels || [],
        targetRegions: profileData.targetRegions || [],
        preferredLanguages: profileData.preferredLanguages || [],
        contentTypes: profileData.contentTypes || [],
        teachingExperienceYears: profileData.teachingExperienceYears || 0,
        status: 'active',
      }).returning();

      return profile;
    } catch (error) {
      console.error('Error creating teacher profile:', error);
      throw error;
    }
  }

  static async getStudentProfile(userId: string) {
    try {
      const [profile] = await db.select().from(schema.studentProfiles).where(eq(schema.studentProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error('Error getting student profile:', error);
      throw error;
    }
  }

  static async getTeacherProfile(userId: string) {
    try {
      const [profile] = await db.select().from(schema.teacherProfiles).where(eq(schema.teacherProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error('Error getting teacher profile:', error);
      throw error;
    }
  }

  static async updateStudentProfile(userId: string, profileData: Partial<typeof schema.studentProfiles.$inferInsert>) {
    try {
      const [updatedProfile] = await db
        .update(schema.studentProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(schema.studentProfiles.userId, userId))
        .returning();

      return updatedProfile;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  static async updateTeacherProfile(userId: string, profileData: Partial<typeof schema.teacherProfiles.$inferInsert>) {
    try {
      const [updatedProfile] = await db
        .update(schema.teacherProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(schema.teacherProfiles.userId, userId))
        .returning();

      return updatedProfile;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      throw error;
    }
  }

  // ============================================================================
  // ASSESSMENT MANAGEMENT (Preserved from original)
  // ============================================================================

  static async saveCognitiveAssessment(userId: string, assessmentData: {
    overallScore?: number;
    logicalReasoningScore?: number;
    numericalReasoningScore?: number;
    verbalReasoningScore?: number;
    spatialReasoningScore?: number;
    workingMemoryScore?: number;
    processingSpeedScore?: number;
    detailedResults?: any;
    completionTime?: number;
    isCompleted?: boolean;
  }) {
    try {
      const [existingAssessment] = await db
        .select()
        .from(schema.cognitiveAssessments)
        .where(eq(schema.cognitiveAssessments.userId, userId));

      if (existingAssessment) {
        const [updatedAssessment] = await db
          .update(schema.cognitiveAssessments)
          .set({
            ...assessmentData,
            updatedAt: new Date(),
          })
          .where(eq(schema.cognitiveAssessments.userId, userId))
          .returning();

        return updatedAssessment;
      } else {
        const [newAssessment] = await db
          .insert(schema.cognitiveAssessments)
          .values({
            userId,
            ...assessmentData,
          })
          .returning();

        return newAssessment;
      }
    } catch (error) {
      console.error('Error saving cognitive assessment:', error);
      throw error;
    }
  }

  static async savePersonalityAssessment(userId: string, assessmentData: {
    jungType?: string;
    jungDescription?: string;
    bigFiveScores?: any;
    keyTraits?: any;
    workStyle?: string;
    communicationStyle?: string;
    leadershipPotential?: number;
    teamCompatibility?: number;
    detailedResults?: any;
    isCompleted?: boolean;
  }) {
    try {
      const [existingAssessment] = await db
        .select()
        .from(schema.personalityAssessments)
        .where(eq(schema.personalityAssessments.userId, userId));

      if (existingAssessment) {
        const [updatedAssessment] = await db
          .update(schema.personalityAssessments)
          .set({
            ...assessmentData,
            updatedAt: new Date(),
          })
          .where(eq(schema.personalityAssessments.userId, userId))
          .returning();

        return updatedAssessment;
      } else {
        const [newAssessment] = await db
          .insert(schema.personalityAssessments)
          .values({
            userId,
            ...assessmentData,
          })
          .returning();

        return newAssessment;
      }
    } catch (error) {
      console.error('Error saving personality assessment:', error);
      throw error;
    }
  }

  static async saveLearningPreferences(userId: string, preferencesData: {
    learningStyle?: string;
    preferredContentFormat?: any;
    difficultyPreference?: string;
    pacePreference?: string;
    feedbackPreference?: string;
    motivationalFactors?: any;
    distractionLevel?: number;
    attentionSpan?: number;
    preferredSessionLength?: number;
    isCompleted?: boolean;
  }) {
    try {
      const [existingPreferences] = await db
        .select()
        .from(schema.learningPreferences)
        .where(eq(schema.learningPreferences.userId, userId));

      if (existingPreferences) {
        const [updatedPreferences] = await db
          .update(schema.learningPreferences)
          .set({
            ...preferencesData,
            updatedAt: new Date(),
          })
          .where(eq(schema.learningPreferences.userId, userId))
          .returning();

        return updatedPreferences;
      } else {
        const [newPreferences] = await db
          .insert(schema.learningPreferences)
          .values({
            userId,
            ...preferencesData,
          })
          .returning();

        return newPreferences;
      }
    } catch (error) {
      console.error('Error saving learning preferences:', error);
      throw error;
    }
  }

  // ============================================================================
  // COURSE MANAGEMENT (Updated for unified schema)
  // ============================================================================

  static async createCourse(courseData: {
    studentId: string;
    teacherId?: string;
    title: string;
    description: string;
    subjectId?: string;
    topicId?: string;
    educationLevelId?: string;
    difficulty: number;
    estimatedDuration: number;
    contentType: string;
    generationPrompt?: string;
  }) {
    try {
      const [newCourse] = await db
        .insert(schema.courses)
        .values({
          ...courseData,
          status: 'draft',
          progressPercentage: 0,
        })
        .returning();

      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  static async getUserCourses(userId: string) {
    try {
      const courses = await db
        .select({
          id: schema.courses.id,
          title: schema.courses.title,
          description: schema.courses.description,
          difficulty: schema.courses.difficulty,
          estimatedDuration: schema.courses.estimatedDuration,
          contentType: schema.courses.contentType,
          status: schema.courses.status,
          progressPercentage: schema.courses.progressPercentage,
          createdAt: schema.courses.createdAt,
          subject: {
            id: schema.subjects.id,
            name: schema.subjects.name,
            displayName: schema.subjects.displayName,
          },
          topic: {
            id: schema.topics.id,
            name: schema.topics.name,
            description: schema.topics.description,
          }
        })
        .from(schema.courses)
        .leftJoin(schema.subjects, eq(schema.courses.subjectId, schema.subjects.id))
        .leftJoin(schema.topics, eq(schema.courses.topicId, schema.topics.id))
        .where(eq(schema.courses.studentId, userId))
        .orderBy(desc(schema.courses.createdAt));

      return courses;
    } catch (error) {
      console.error('Error getting user courses:', error);
      throw error;
    }
  }

  static async createCourseWithModules(courseData: {
    studentId: string;
    teacherId?: string;
    title: string;
    description: string;
    subjectId?: string;
    topicId?: string;
    educationLevelId?: string;
    difficulty: number;
    estimatedDuration: number;
    contentType: string;
    generationPrompt?: string;
    syllabusAlignment?: string;
    examinationBoard?: string;
    targetRegion?: string;
    learningObjectives?: string[];
    contentGenerationMetadata?: any;
    aiContentStatus?: any;
    generatedContent?: any;
    syllabusOverview?: string;
    modules?: Array<{
      title: string;
      description: string;
      orderIndex: number;
      learningOutcomes: string[];
      notes?: string;
      estimatedDuration: number;
    }>;
  }) {
    try {
      // Create the course first
      const [newCourse] = await db
        .insert(schema.courses)
        .values({
          studentId: courseData.studentId,
          teacherId: courseData.teacherId,
          title: courseData.title,
          description: courseData.description,
          subjectId: courseData.subjectId,
          topicId: courseData.topicId,
          educationLevelId: courseData.educationLevelId,
          difficulty: courseData.difficulty,
          estimatedDuration: courseData.estimatedDuration,
          contentType: courseData.contentType,
          generationPrompt: courseData.generationPrompt,
          syllabusAlignment: courseData.syllabusAlignment,
          examinationBoard: courseData.examinationBoard,
          targetRegion: courseData.targetRegion,
          contentGenerationMetadata: courseData.contentGenerationMetadata || {},
          aiContentStatus: courseData.aiContentStatus || {},
          generatedContent: courseData.generatedContent || {},
          status: 'draft',
          progressPercentage: 0,
        })
        .returning();

      // Create course modules if provided
      if (courseData.modules && courseData.modules.length > 0) {
        const moduleInserts = courseData.modules.map(module => ({
          courseId: newCourse.id,
          title: module.title,
          description: module.description,
          orderIndex: module.orderIndex,
          contentType: 'text', // Default content type for syllabus modules
          contentData: {
            learningOutcomes: module.learningOutcomes,
            notes: module.notes,
            syllabusOverview: courseData.syllabusOverview,
          },
          estimatedDuration: module.estimatedDuration,
          learningObjectives: module.learningOutcomes,
          aiGenerated: false, // These are teacher-defined modules
          isPublished: false,
        }));

        const createdModules = await db
          .insert(schema.courseModules)
          .values(moduleInserts)
          .returning();

        return {
          course: newCourse,
          modules: createdModules,
        };
      }

      return {
        course: newCourse,
        modules: [],
      };
    } catch (error) {
      console.error('Error creating course with modules:', error);
      throw error;
    }
  }

  static async getCourseWithModules(courseId: string) {
    try {
      const [course] = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.id, courseId));

      if (!course) {
        return null;
      }

      const modules = await db
        .select()
        .from(schema.courseModules)
        .where(eq(schema.courseModules.courseId, courseId))
        .orderBy(asc(schema.courseModules.orderIndex));

      return {
        course,
        modules,
      };
    } catch (error) {
      console.error('Error getting course with modules:', error);
      throw error;
    }
  }

  static async getTeacherCourses(teacherId: string) {
    try {
      const courses = await db
        .select({
          id: schema.courses.id,
          title: schema.courses.title,
          description: schema.courses.description,
          difficulty: schema.courses.difficulty,
          estimatedDuration: schema.courses.estimatedDuration,
          contentType: schema.courses.contentType,
          status: schema.courses.status,
          progressPercentage: schema.courses.progressPercentage,
          enrollmentCount: schema.courses.enrollmentCount,
          revenueGenerated: schema.courses.revenueGenerated,
          averageRating: schema.courses.averageRating,
          createdAt: schema.courses.createdAt,
          updatedAt: schema.courses.updatedAt,
          aiContentStatus: schema.courses.aiContentStatus,
          examinationBoard: schema.courses.examinationBoard,
          targetRegion: schema.courses.targetRegion,
        })
        .from(schema.courses)
        .where(eq(schema.courses.teacherId, teacherId))
        .orderBy(desc(schema.courses.createdAt));

      return courses;
    } catch (error) {
      console.error('Error getting teacher courses:', error);
      throw error;
    }
  }

  // ============================================================================
  // SUBJECTS AND TOPICS (Preserved from original)
  // ============================================================================

  static async getSubjects() {
    try {
      const subjects = await db
        .select()
        .from(schema.subjects)
        .where(eq(schema.subjects.isActive, true))
        .orderBy(asc(schema.subjects.displayName));

      return subjects;
    } catch (error) {
      console.error('Error getting subjects:', error);
      throw error;
    }
  }

  static async getEducationLevels() {
    try {
      const levels = await db
        .select()
        .from(schema.educationLevels)
        .where(eq(schema.educationLevels.isActive, true))
        .orderBy(asc(schema.educationLevels.displayName));

      return levels;
    } catch (error) {
      console.error('Error getting education levels:', error);
      throw error;
    }
  }

  static async getTopicsBySubjectAndLevel(subjectId: string, educationLevelId: string) {
    try {
      const topics = await db
        .select()
        .from(schema.topics)
        .where(and(
          eq(schema.topics.subjectId, subjectId),
          eq(schema.topics.educationLevelId, educationLevelId),
          eq(schema.topics.isActive, true)
        ))
        .orderBy(asc(schema.topics.name));

      return topics;
    } catch (error) {
      console.error('Error getting topics:', error);
      throw error;
    }
  }

  // ============================================================================
  // GAMIFICATION (Preserved from original)
  // ============================================================================

  static async getGamificationProfile(userId: string) {
    try {
      const [profile] = await db
        .select()
        .from(schema.gamificationProfiles)
        .where(eq(schema.gamificationProfiles.userId, userId));

      return profile;
    } catch (error) {
      console.error('Error getting gamification profile:', error);
      throw error;
    }
  }

  static async updateGamificationProfile(userId: string, updates: Partial<typeof schema.gamificationProfiles.$inferInsert>) {
    try {
      const [updatedProfile] = await db
        .update(schema.gamificationProfiles)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(schema.gamificationProfiles.userId, userId))
        .returning();

      return updatedProfile;
    } catch (error) {
      console.error('Error updating gamification profile:', error);
      throw error;
    }
  }

  static async addXpTransaction(userId: string, amount: number, reason: string, referenceId?: string, referenceType?: string) {
    try {
      // Add XP transaction
      const [transaction] = await db
        .insert(schema.xpTransactions)
        .values({
          userId,
          amount,
          reason,
          referenceId,
          referenceType,
        })
        .returning();

      // Update gamification profile
      const [currentProfile] = await db
        .select()
        .from(schema.gamificationProfiles)
        .where(eq(schema.gamificationProfiles.userId, userId));

      if (currentProfile) {
        const newTotalXp = currentProfile.totalXp + amount;
        const newLevel = Math.floor(newTotalXp / 1000) + 1; // 1000 XP per level

        await db
          .update(schema.gamificationProfiles)
          .set({
            totalXp: newTotalXp,
            currentLevel: newLevel,
            updatedAt: new Date(),
          })
          .where(eq(schema.gamificationProfiles.userId, userId));
      }

      return transaction;
    } catch (error) {
      console.error('Error adding XP transaction:', error);
      throw error;
    }
  }

  // ============================================================================
  // COMPREHENSIVE USER PROFILE
  // ============================================================================

  static async getUserComprehensiveProfile(userId: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get role-specific profile based on current role
      let roleProfile = null;
      if (user.currentRole === 'student') {
        roleProfile = await this.getStudentProfile(userId);
      } else if (user.currentRole === 'teacher') {
        roleProfile = await this.getTeacherProfile(userId);
      }

      const [cognitiveAssessment] = await db.select().from(schema.cognitiveAssessments).where(eq(schema.cognitiveAssessments.userId, userId));
      const [personalityAssessment] = await db.select().from(schema.personalityAssessments).where(eq(schema.personalityAssessments.userId, userId));
      const [learningPrefs] = await db.select().from(schema.learningPreferences).where(eq(schema.learningPreferences.userId, userId));
      const [gamification] = await db.select().from(schema.gamificationProfiles).where(eq(schema.gamificationProfiles.userId, userId));
      
      const courses = await this.getUserCourses(userId);

      return {
        user,
        roleProfile,
        cognitiveAssessment,
        personalityAssessment,
        learningPreferences: learningPrefs,
        gamification,
        courses,
      };
    } catch (error) {
      console.error('Error getting comprehensive user profile:', error);
      throw error;
    }
  }

  // ============================================================================
  // MODULE MANAGEMENT
  // ============================================================================

  static async getModuleById(moduleId: string) {
    try {
      const [module] = await db
        .select()
        .from(schema.courseModules)
        .where(eq(schema.courseModules.id, moduleId));

      return module;
    } catch (error) {
      console.error('Error getting module by ID:', error);
      throw error;
    }
  }

  static async getCourseById(courseId: string) {
    try {
      const [course] = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.id, courseId));

      return course;
    } catch (error) {
      console.error('Error getting course by ID:', error);
      throw error;
    }
  }

  static async updateModuleContent(moduleId: string, updates: {
    contentData?: any;
    generationMetadata?: any;
  }) {
    try {
      const [updatedModule] = await db
        .update(schema.courseModules)
        .set({
          contentData: updates.contentData,
          generationMetadata: updates.generationMetadata,
          updatedAt: new Date(),
        })
        .where(eq(schema.courseModules.id, moduleId))
        .returning();

      return updatedModule;
    } catch (error) {
      console.error('Error updating module content:', error);
      throw error;
    }
  }

  static async createModule(moduleData: {
    courseId: string;
    title: string;
    description: string;
    orderIndex: number;
    contentType: string;
    contentData?: any;
    estimatedDuration: number;
    learningObjectives: string[];
    aiGenerated?: boolean;
  }) {
    try {
      const [newModule] = await db
        .insert(schema.courseModules)
        .values({
          ...moduleData,
          contentData: moduleData.contentData || {},
          generationMetadata: {},
          aiGenerated: moduleData.aiGenerated || false,
          isPublished: false,
        })
        .returning();

      return newModule;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  }

  static async deleteModule(moduleId: string) {
    try {
      const [deletedModule] = await db
        .delete(schema.courseModules)
        .where(eq(schema.courseModules.id, moduleId))
        .returning();

      return deletedModule;
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  }

  static async getModulesByCourse(courseId: string) {
    try {
      const modules = await db
        .select()
        .from(schema.courseModules)
        .where(eq(schema.courseModules.courseId, courseId))
        .orderBy(asc(schema.courseModules.orderIndex));

      return modules;
    } catch (error) {
      console.error('Error getting modules by course:', error);
      throw error;
    }
  }

  // ============================================================================
  // PROFILE COMPLETION CHECKING
  // ============================================================================

  static async checkProfileCompleteness(userId: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      
      if (!user) {
        return { isComplete: false, completedSections: [], missingFields: [] };
      }

      // Check role-specific profile completeness
      let roleProfileComplete = false;
      let missingFields: string[] = [];

      if (user.currentRole === 'student') {
        const studentProfile = await this.getStudentProfile(userId);
        if (studentProfile) {
          const requiredFields = ['educationLevel', 'timeAvailability', 'preferredStudyTime'];
          missingFields = requiredFields.filter(field => !studentProfile[field as keyof typeof studentProfile]);
          roleProfileComplete = missingFields.length === 0;
        } else {
          missingFields = ['student_profile'];
        }
      } else if (user.currentRole === 'teacher') {
        const teacherProfile = await this.getTeacherProfile(userId);
        if (teacherProfile) {
          const requiredFields = ['displayName', 'subjects', 'educationLevels'];
          missingFields = requiredFields.filter(field => {
            const value = teacherProfile[field as keyof typeof teacherProfile];
            return !value || (Array.isArray(value) && value.length === 0);
          });
          roleProfileComplete = missingFields.length === 0;
        } else {
          missingFields = ['teacher_profile'];
        }
      }

      const isComplete = roleProfileComplete && user.isProfileComplete;

      return {
        isComplete,
        completedSections: user.profileCompletionStatus || {},
        missingFields,
        roleProfile: user.currentRole,
      };
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      throw error;
    }
  }
}

export default UnifiedDatabaseService;
