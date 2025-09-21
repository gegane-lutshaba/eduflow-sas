import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from './db/connection';
import * as schema from './db/schema';
import * as multiRoleSchema from './db/multi-role-schema';

export class NeonDatabaseService {
  // User Management
  static async createUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }) {
    try {
      const [user] = await db.insert(schema.users).values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
      }).returning();

      // Create default profile
      await db.insert(schema.userProfiles).values({
        userId: user.id,
        isProfileComplete: false,
        completedSections: [],
      });

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

  // User Profile Management
  static async getUserProfile(userId: string) {
    try {
      const [profile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, profileData: Partial<typeof schema.userProfiles.$inferInsert>) {
    try {
      // First check if profile exists
      const [existingProfile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId));
      
      if (existingProfile) {
        // Update existing profile
        const [updatedProfile] = await db
          .update(schema.userProfiles)
          .set({
            ...profileData,
            updatedAt: new Date(),
          })
          .where(eq(schema.userProfiles.userId, userId))
          .returning();

        return updatedProfile;
      } else {
        // Create new profile
        const [newProfile] = await db
          .insert(schema.userProfiles)
          .values({
            userId,
            ...profileData,
          })
          .returning();

        return newProfile;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async checkProfileCompleteness(userId: string) {
    try {
      const [profile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId));
      
      if (!profile) return { isComplete: false, completedSections: [], missingFields: [] };

      const requiredFields = [
        'dateOfBirth',
        'location',
        'educationLevel',
        'timeAvailability',
        'preferredStudyTime'
      ];

      const missingFields = requiredFields.filter(field => !profile[field as keyof typeof profile]);
      const isComplete = missingFields.length === 0;

      return {
        isComplete,
        completedSections: profile.completedSections || [],
        missingFields,
        profile
      };
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      throw error;
    }
  }

  // Assessment Management
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
      // Check if assessment already exists
      const [existingAssessment] = await db
        .select()
        .from(schema.cognitiveAssessments)
        .where(eq(schema.cognitiveAssessments.userId, userId));

      if (existingAssessment) {
        // Update existing assessment
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
        // Create new assessment
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

  // Career Recommendations
  static async saveCareerRecommendations(userId: string, recommendations: Array<{
    careerPathId: string;
    fitScore: number;
    reasoning: string;
    timelineEstimate: string;
    requiredSteps: any;
    skillGaps: any;
  }>) {
    try {
      // Delete existing recommendations
      await db.delete(schema.careerRecommendations).where(eq(schema.careerRecommendations.userId, userId));

      // Insert new recommendations
      const newRecommendations = await db
        .insert(schema.careerRecommendations)
        .values(
          recommendations.map(rec => ({
            userId,
            ...rec,
          }))
        )
        .returning();

      return newRecommendations;
    } catch (error) {
      console.error('Error saving career recommendations:', error);
      throw error;
    }
  }

  static async getCareerRecommendations(userId: string) {
    try {
      const recommendations = await db
        .select({
          id: schema.careerRecommendations.id,
          fitScore: schema.careerRecommendations.fitScore,
          reasoning: schema.careerRecommendations.reasoning,
          timelineEstimate: schema.careerRecommendations.timelineEstimate,
          requiredSteps: schema.careerRecommendations.requiredSteps,
          skillGaps: schema.careerRecommendations.skillGaps,
          createdAt: schema.careerRecommendations.createdAt,
          careerPath: {
            id: schema.careerPaths.id,
            title: schema.careerPaths.title,
            description: schema.careerPaths.description,
            category: schema.careerPaths.category,
            requiredSkills: schema.careerPaths.requiredSkills,
            salaryRange: schema.careerPaths.salaryRange,
          }
        })
        .from(schema.careerRecommendations)
        .leftJoin(schema.careerPaths, eq(schema.careerRecommendations.careerPathId, schema.careerPaths.id))
        .where(eq(schema.careerRecommendations.userId, userId))
        .orderBy(desc(schema.careerRecommendations.fitScore));

      return recommendations;
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      throw error;
    }
  }

  // Learning Roadmaps
  static async saveLearningRoadmap(roadmapData: {
    userId: string;
    careerPathId?: string;
    title: string;
    description: string;
    currentEducationLevel: string;
    targetCareer: string;
    estimatedDurationMonths: number;
    totalMilestones: number;
  }) {
    try {
      const [newRoadmap] = await db
        .insert(schema.learningRoadmaps)
        .values(roadmapData)
        .returning();

      return newRoadmap;
    } catch (error) {
      console.error('Error saving learning roadmap:', error);
      throw error;
    }
  }

  static async getLearningRoadmaps(userId: string) {
    try {
      const roadmaps = await db
        .select()
        .from(schema.learningRoadmaps)
        .where(and(
          eq(schema.learningRoadmaps.userId, userId),
          eq(schema.learningRoadmaps.isActive, true)
        ))
        .orderBy(desc(schema.learningRoadmaps.createdAt));

      return roadmaps;
    } catch (error) {
      console.error('Error getting learning roadmaps:', error);
      throw error;
    }
  }

  // Course Management
  static async createCourse(courseData: {
    userId: string;
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
        .where(eq(schema.courses.userId, userId))
        .orderBy(desc(schema.courses.createdAt));

      return courses;
    } catch (error) {
      console.error('Error getting user courses:', error);
      throw error;
    }
  }

  // Subjects and Topics
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

  // Gamification
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

  // Comprehensive User Profile
  static async getUserComprehensiveProfile(userId: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      const [profile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId));
      const [cognitiveAssessment] = await db.select().from(schema.cognitiveAssessments).where(eq(schema.cognitiveAssessments.userId, userId));
      const [personalityAssessment] = await db.select().from(schema.personalityAssessments).where(eq(schema.personalityAssessments.userId, userId));
      const [learningPrefs] = await db.select().from(schema.learningPreferences).where(eq(schema.learningPreferences.userId, userId));
      const [gamification] = await db.select().from(schema.gamificationProfiles).where(eq(schema.gamificationProfiles.userId, userId));
      
      const careerRecommendations = await this.getCareerRecommendations(userId);
      const courses = await this.getUserCourses(userId);
      const roadmaps = await this.getLearningRoadmaps(userId);

      return {
        user,
        profile,
        cognitiveAssessment,
        personalityAssessment,
        learningPreferences: learningPrefs,
        gamification,
        careerRecommendations,
        courses,
        roadmaps,
      };
    } catch (error) {
      console.error('Error getting comprehensive user profile:', error);
      throw error;
    }
  }
  // Multi-Role Management
  static async getUserRoles(clerkId: string) {
    try {
      const [userRole] = await db.select().from(multiRoleSchema.userRoles).where(eq(multiRoleSchema.userRoles.clerkId, clerkId));
      return userRole;
    } catch (error) {
      console.error('Error getting user roles:', error);
      throw error;
    }
  }

  static async createUserRole(clerkId: string, role: string = 'student') {
    try {
      const [userRole] = await db.insert(multiRoleSchema.userRoles).values({
        clerkId,
        availableRoles: [role],
        currentRole: role,
        rolePreferences: {},
      }).returning();

      return userRole;
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  }

  static async addRoleToUser(clerkId: string, newRole: string) {
    try {
      const [existingRole] = await db.select().from(multiRoleSchema.userRoles).where(eq(multiRoleSchema.userRoles.clerkId, clerkId));
      
      if (existingRole) {
        // Add role if not already present
        const updatedRoles = existingRole.availableRoles.includes(newRole) 
          ? existingRole.availableRoles 
          : [...existingRole.availableRoles, newRole];

        const [updatedUserRole] = await db
          .update(multiRoleSchema.userRoles)
          .set({
            availableRoles: updatedRoles,
            updatedAt: new Date(),
          })
          .where(eq(multiRoleSchema.userRoles.clerkId, clerkId))
          .returning();

        return updatedUserRole;
      } else {
        // Create new role record
        return await this.createUserRole(clerkId, newRole);
      }
    } catch (error) {
      console.error('Error adding role to user:', error);
      throw error;
    }
  }

  static async createTeacherProfile(clerkId: string, profileData: {
    displayName: string;
    bio?: string;
    expertiseAreas?: string[];
    educationBackground?: any;
    certifications?: any[];
    teachingExperienceYears?: number;
    preferredSubjects?: string[];
    preferredEducationLevels?: string[];
    preferredRegions?: string[];
  }) {
    try {
      const [teacherProfile] = await db.insert(multiRoleSchema.teacherProfiles).values({
        clerkId,
        displayName: profileData.displayName,
        bio: profileData.bio || '',
        expertiseAreas: profileData.expertiseAreas || [],
        educationBackground: profileData.educationBackground || {},
        certifications: profileData.certifications || [],
        teachingExperienceYears: profileData.teachingExperienceYears || 0,
        preferredSubjects: profileData.preferredSubjects || [],
        preferredEducationLevels: profileData.preferredEducationLevels || [],
        preferredRegions: profileData.preferredRegions || [],
        status: 'active',
      }).returning();

      return teacherProfile;
    } catch (error) {
      console.error('Error creating teacher profile:', error);
      throw error;
    }
  }

  static async getTeacherProfile(clerkId: string) {
    try {
      const [teacherProfile] = await db.select().from(multiRoleSchema.teacherProfiles).where(eq(multiRoleSchema.teacherProfiles.clerkId, clerkId));
      return teacherProfile;
    } catch (error) {
      console.error('Error getting teacher profile:', error);
      throw error;
    }
  }

  static async updateTeacherProfile(clerkId: string, profileData: Partial<typeof multiRoleSchema.teacherProfiles.$inferInsert>) {
    try {
      const [updatedProfile] = await db
        .update(multiRoleSchema.teacherProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(multiRoleSchema.teacherProfiles.clerkId, clerkId))
        .returning();

      return updatedProfile;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      throw error;
    }
  }
}

export default NeonDatabaseService;
