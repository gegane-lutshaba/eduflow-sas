export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GamificationProfile {
  level: number;
  xp: number;
  totalXp: number;
  achievements: Achievement[];
  streakDays: number;
  lastActivity: Date;
  badges: string[];
}

export interface XPGain {
  amount: number;
  reason: string;
  category: 'assessment' | 'learning' | 'achievement' | 'streak' | 'bonus';
}

class GamificationService {
  private readonly XP_THRESHOLDS = [
    0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500, 4150, 4850, 5600, 6400, 7250
  ];

  private readonly ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Started your career assessment journey',
      icon: '🚀',
      xp: 25,
      unlocked: false
    },
    {
      id: 'deep-thinker',
      title: 'Deep Thinker',
      description: 'Completed personality assessment thoroughly',
      icon: '🧠',
      xp: 50,
      unlocked: false
    },
    {
      id: 'tech-explorer',
      title: 'Tech Explorer',
      description: 'Explored multiple technical interest areas',
      icon: '💻',
      xp: 40,
      unlocked: false
    },
    {
      id: 'logic-master',
      title: 'Logic Master',
      description: 'Scored 85+ on logic assessment',
      icon: '🔍',
      xp: 75,
      unlocked: false
    },
    {
      id: 'creative-genius',
      title: 'Creative Genius',
      description: 'Showed exceptional creativity in challenges',
      icon: '🎨',
      xp: 60,
      unlocked: false
    },
    {
      id: 'goal-crusher',
      title: 'Goal Crusher',
      description: 'Set comprehensive career goals',
      icon: '🎯',
      xp: 45,
      unlocked: false
    },
    {
      id: 'assessment-champion',
      title: 'Assessment Champion',
      description: 'Completed full career assessment',
      icon: '🏆',
      xp: 100,
      unlocked: false
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Answered all optional questions',
      icon: '⭐',
      xp: 80,
      unlocked: false
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Completed assessment in under 15 minutes',
      icon: '⚡',
      xp: 65,
      unlocked: false
    },
    {
      id: 'thoughtful-responder',
      title: 'Thoughtful Responder',
      description: 'Provided detailed responses to open questions',
      icon: '💭',
      xp: 55,
      unlocked: false
    }
  ];

  calculateLevel(totalXp: number): number {
    for (let i = this.XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXp >= this.XP_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  getXpForNextLevel(currentLevel: number): number {
    if (currentLevel >= this.XP_THRESHOLDS.length) {
      return this.XP_THRESHOLDS[this.XP_THRESHOLDS.length - 1];
    }
    return this.XP_THRESHOLDS[currentLevel];
  }

  getProgressToNextLevel(totalXp: number): { current: number; needed: number; percentage: number } {
    const currentLevel = this.calculateLevel(totalXp);
    const currentLevelXp = this.XP_THRESHOLDS[currentLevel - 1] || 0;
    const nextLevelXp = this.getXpForNextLevel(currentLevel);
    
    const current = totalXp - currentLevelXp;
    const needed = nextLevelXp - currentLevelXp;
    const percentage = Math.min((current / needed) * 100, 100);

    return { current, needed, percentage };
  }

  awardXP(profile: GamificationProfile, xpGain: XPGain): GamificationProfile {
    const newTotalXp = profile.totalXp + xpGain.amount;
    const newLevel = this.calculateLevel(newTotalXp);
    const leveledUp = newLevel > profile.level;

    return {
      ...profile,
      xp: profile.xp + xpGain.amount,
      totalXp: newTotalXp,
      level: newLevel,
      lastActivity: new Date()
    };
  }

  checkAchievements(profile: GamificationProfile, assessmentData: any): { 
    profile: GamificationProfile; 
    newAchievements: Achievement[] 
  } {
    const newAchievements: Achievement[] = [];
    const updatedAchievements = [...profile.achievements];

    // Check each achievement
    this.ACHIEVEMENTS.forEach(achievement => {
      const existingIndex = updatedAchievements.findIndex(a => a.id === achievement.id);
      const alreadyUnlocked = existingIndex >= 0 && updatedAchievements[existingIndex].unlocked;

      if (!alreadyUnlocked && this.checkAchievementCondition(achievement.id, assessmentData, profile)) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };

        if (existingIndex >= 0) {
          updatedAchievements[existingIndex] = unlockedAchievement;
        } else {
          updatedAchievements.push(unlockedAchievement);
        }

        newAchievements.push(unlockedAchievement);
      }
    });

    // Award XP for new achievements
    let updatedProfile = { ...profile, achievements: updatedAchievements };
    newAchievements.forEach(achievement => {
      updatedProfile = this.awardXP(updatedProfile, {
        amount: achievement.xp,
        reason: `Achievement unlocked: ${achievement.title}`,
        category: 'achievement'
      });
    });

    return { profile: updatedProfile, newAchievements };
  }

  private checkAchievementCondition(achievementId: string, assessmentData: any, profile: GamificationProfile): boolean {
    switch (achievementId) {
      case 'first-steps':
        return true; // Unlocked when starting assessment

      case 'deep-thinker':
        return assessmentData.personalityProfile && 
               Object.keys(assessmentData.personalityProfile).length >= 3;

      case 'tech-explorer':
        return assessmentData.technicalInterests?.interestAreas?.length >= 3;

      case 'logic-master':
        return assessmentData.technicalAptitude?.logicScore >= 85;

      case 'creative-genius':
        return assessmentData.technicalAptitude?.creativityScore >= 80;

      case 'goal-crusher':
        return assessmentData.goals && 
               assessmentData.goals.careerGoals && 
               assessmentData.goals.timeline;

      case 'assessment-champion':
        return assessmentData.basicInfo && 
               assessmentData.technicalInterests && 
               assessmentData.learningStyle && 
               assessmentData.personalityProfile;

      case 'perfectionist':
        // Check if all optional fields are filled
        return this.checkAllOptionalFieldsFilled(assessmentData);

      case 'speed-demon':
        // This would need to be tracked during assessment
        return assessmentData.completionTime && assessmentData.completionTime < 15 * 60 * 1000;

      case 'thoughtful-responder':
        // Check for detailed text responses
        return this.checkDetailedResponses(assessmentData);

      default:
        return false;
    }
  }

  private checkAllOptionalFieldsFilled(data: any): boolean {
    // Check various optional fields across the assessment
    const optionalFields = [
      data.basicInfo?.culturalBackground,
      data.basicInfo?.preferredLanguage,
      data.goals?.workEnvironment,
      data.goals?.salaryExpectations,
      data.personalityProfile?.motivationDrivers?.length >= 3
    ];

    return optionalFields.filter(Boolean).length >= 3;
  }

  private checkDetailedResponses(data: any): boolean {
    // Check for text responses that are reasonably detailed
    const textResponses = [
      data.goals?.careerGoals,
      data.goals?.personalMotivation,
      data.technicalInterests?.specificInterests
    ].filter(response => response && response.length > 50);

    return textResponses.length >= 2;
  }

  generateMotivationalMessage(profile: GamificationProfile): string {
    const messages = [
      `You're on fire! 🔥 Level ${profile.level} and climbing!`,
      `Amazing progress! You've earned ${profile.totalXp} XP so far!`,
      `Keep it up, champion! Your dedication is inspiring! 💪`,
      `You're building an incredible career foundation! 🏗️`,
      `Every step forward is a step toward your dream career! ✨`,
      `Your future self will thank you for this effort! 🚀`,
      `You're not just learning, you're transforming! 🦋`,
      `Excellence is a habit, and you're building it! 🏆`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  getStreakBonus(streakDays: number): number {
    if (streakDays >= 7) return 50;
    if (streakDays >= 3) return 25;
    if (streakDays >= 1) return 10;
    return 0;
  }

  initializeProfile(): GamificationProfile {
    return {
      level: 1,
      xp: 0,
      totalXp: 0,
      achievements: [],
      streakDays: 0,
      lastActivity: new Date(),
      badges: []
    };
  }
}

export const gamificationService = new GamificationService();
