/**
 * Nova AI Assistant - Conversational Assessment Guide
 * Provides contextual, encouraging responses with emojis and gamification
 */

export interface NovaResponse {
  message: string;
  emoji?: string;
  xpReward?: number;
  achievement?: string;
  options?: string[];
  followUp?: string;
}

export interface ConversationContext {
  currentStep: string;
  userResponses: Record<string, any>;
  personalityHints: {
    extraversion?: number;
    openness?: number;
    conscientiousness?: number;
  };
}

class NovaAssistant {
  private responses = {
    welcome: {
      initial: {
        message: "Hey there! 👋 I'm Nova, your AI career guide. I'm super excited to help you discover your perfect tech career path! Ready to embark on this journey together?",
        emoji: "🚀",
        options: ["Let's do this!", "Tell me more first", "I'm a bit nervous"]
      },
      enthusiastic: {
        message: "I love that energy! 🔥 You're going to do amazing things. Let's start by getting to know you better!",
        emoji: "⭐",
        xpReward: 10
      },
      curious: {
        message: "Great question! 🤔 I'll guide you through a fun, personalized assessment that adapts to YOU. Think of it as a conversation with a career counselor who really gets tech! 💡",
        emoji: "💭"
      },
      nervous: {
        message: "No worries at all! 🤗 I'm here to support you every step of the way. There are no wrong answers - this is all about discovering what makes YOU unique! 💪",
        emoji: "🌟",
        xpReward: 5
      }
    },
    
    basicInfo: {
      role: {
        student: {
          message: "A student! 📚 I love working with students - you have so much potential ahead of you! The tech world is going to be lucky to have you. +15 XP for being on this journey early! ✨",
          emoji: "🎓",
          xpReward: 15
        },
        "career-changer": {
          message: "Career changer! 🔄 That takes real courage and vision. You're bringing valuable experience from another field - that's actually a superpower in tech! 💪",
          emoji: "🦋",
          xpReward: 20
        },
        "entry-level": {
          message: "Starting your tech journey! 🌱 Perfect timing - the industry needs fresh talent like you. Your beginner's mind is actually an advantage! 🚀",
          emoji: "🌟",
          xpReward: 15
        }
      },
      
      education: {
        "high-school": {
          message: "High school level - fantastic! 🎯 You're getting started at the perfect time. I'll make sure our questions match where you're at right now. No pressure! 😊",
          emoji: "📖"
        },
        "bachelor": {
          message: "Bachelor's degree - excellent foundation! 🏗️ You've got the analytical thinking skills that tech careers love. Let's build on that! 💡",
          emoji: "🎓"
        },
        "master": {
          message: "Master's degree - impressive! 🧠 Your advanced education gives you a real edge. I can already see some exciting career paths opening up! ✨",
          emoji: "🎖️",
          xpReward: 10
        }
      },
      
      location: {
        africa: {
          message: "Africa represent! 🌍 The tech scene there is absolutely booming. You're part of an incredible wave of innovation happening across the continent! 🚀",
          emoji: "🦁",
          xpReward: 15,
          achievement: "Global Innovator"
        },
        us: {
          message: "US-based! 🇺🇸 You're in the heart of the tech world. So many opportunities at your fingertips! 💼",
          emoji: "🏙️"
        },
        europe: {
          message: "Europe! 🇪🇺 Amazing tech hubs and a great work-life balance culture. The European tech scene is thriving! 🌟",
          emoji: "🏰"
        }
      }
    },

    technicalInterests: {
      "machine-learning": {
        message: "Machine Learning! 🤖 Now we're talking! ML is literally reshaping every industry. Your interest in this field shows you're thinking ahead! 🧠✨",
        emoji: "🔮",
        xpReward: 20
      },
      "cybersecurity": {
        message: "Cybersecurity! 🛡️ The digital guardians! With cyber threats everywhere, you're choosing a field where you'll be a real hero protecting people and organizations! 🦸‍♀️",
        emoji: "🔒",
        xpReward: 20
      },
      "data-analysis": {
        message: "Data Analysis! 📊 The art of finding stories in numbers! You'll be like a detective, uncovering insights that drive real business decisions. So cool! 🕵️‍♀️",
        emoji: "📈",
        xpReward: 15
      }
    },

    cognitiveTests: {
      start: {
        message: "Time for some brain games! 🧩 Don't worry - these are actually fun! I've adapted them to your education level, so they'll be challenging but fair. Ready to show off those thinking skills? 💪",
        emoji: "🎮"
      },
      
      logical: {
        correct: {
          message: "Brilliant logical thinking! 🧠 You nailed that pattern. Your analytical mind is definitely showing! ⭐",
          emoji: "🎯",
          xpReward: 25
        },
        incorrect: {
          message: "Good attempt! 🤔 Logic puzzles can be tricky. The important thing is how you approach problems - and you're thinking it through! 💭",
          emoji: "💡"
        }
      },
      
      numerical: {
        correct: {
          message: "Math wizard! 🧙‍♀️ Your numerical reasoning is on point. This skill will serve you incredibly well in tech! 📊✨",
          emoji: "🔢",
          xpReward: 25
        },
        incorrect: {
          message: "Numbers can be sneaky! 😅 But I can see you're working through the logic. That problem-solving approach is what matters most! 🎯",
          emoji: "🤓"
        }
      }
    },

    personality: {
      jung: {
        start: {
          message: "Now for the fun part - let's explore your personality! 🌈 I'll ask about different work scenarios. Just pick what feels most natural to you - there's no 'right' answer! 😊",
          emoji: "🎭"
        },
        
        "INTJ": {
          message: "The Architect! 🏗️ You're strategic, independent, and love long-term planning. Perfect for complex tech projects that need vision and execution! 🎯",
          emoji: "🧠",
          xpReward: 30,
          achievement: "Strategic Thinker"
        },
        
        "ENTJ": {
          message: "The Commander! 👑 Natural leadership combined with strategic thinking. You're going to excel in roles where you can lead tech teams and drive innovation! 🚀",
          emoji: "⚡",
          xpReward: 30,
          achievement: "Born Leader"
        },
        
        "ESFP": {
          message: "The Entertainer! 🎪 You bring energy and creativity to everything you do. Tech needs people like you to make it more human and accessible! 🌟",
          emoji: "🎨",
          xpReward: 30,
          achievement: "Creative Spirit"
        }
      },
      
      bigFive: {
        start: {
          message: "Almost there! 🏁 These last questions help me understand your work style and what motivates you. Rate how much each statement sounds like you! 📝",
          emoji: "📋"
        },
        
        highOpenness: {
          message: "Wow, your creativity scores are off the charts! 🎨 You're going to bring fresh perspectives to whatever field you choose. Innovation is your middle name! ✨",
          emoji: "🌈",
          xpReward: 20
        },
        
        highConscientiousness: {
          message: "Your organization and discipline are impressive! 📋 These traits are gold in tech - you'll be the person others rely on to get things done right! 💎",
          emoji: "⚡",
          xpReward: 20
        }
      }
    },

    results: {
      analyzing: {
        message: "This is so exciting! 🎉 I'm analyzing all your responses to create your personalized career roadmap. My AI brain is working overtime to find the perfect matches for you! 🤖✨",
        emoji: "🔮"
      },
      
      complete: {
        message: "WOW! 🤩 Your results are incredible! I've found some amazing career paths that are perfect for your unique combination of skills and personality. Ready to see your future? 🚀",
        emoji: "🎊",
        xpReward: 50,
        achievement: "Assessment Master"
      }
    },

    encouragement: [
      "You're doing fantastic! 🌟",
      "I'm impressed by your thoughtful answers! 💭",
      "Your potential is showing! ⭐",
      "Keep up the great work! 💪",
      "You're going to go far! 🚀",
      "I can see your passion shining through! ✨",
      "Your analytical mind is amazing! 🧠",
      "You're asking all the right questions! 🎯"
    ]
  };

  getWelcomeResponse(userChoice?: string): NovaResponse {
    if (!userChoice) {
      return this.responses.welcome.initial;
    }

    switch (userChoice.toLowerCase()) {
      case "let's do this!":
      case "yes":
        return this.responses.welcome.enthusiastic;
      case "tell me more first":
      case "more info":
        return this.responses.welcome.curious;
      case "i'm a bit nervous":
      case "nervous":
        return this.responses.welcome.nervous;
      default:
        return this.responses.welcome.enthusiastic;
    }
  }

  getRoleResponse(role: string): NovaResponse {
    const roleResponses = this.responses.basicInfo.role;
    return roleResponses[role as keyof typeof roleResponses] || {
      message: "Interesting background! 💼 Every path brings unique value to tech. Let's see where your journey takes you! 🌟",
      emoji: "🎯",
      xpReward: 10
    };
  }

  getEducationResponse(education: string): NovaResponse {
    const educationResponses = this.responses.basicInfo.education;
    return educationResponses[education as keyof typeof educationResponses] || {
      message: "Great educational foundation! 📚 Knowledge is power, and you're building yours! 💪",
      emoji: "🎓"
    };
  }

  getLocationResponse(location: string): NovaResponse {
    if (location.includes('africa')) {
      return this.responses.basicInfo.location.africa;
    } else if (location.includes('us-')) {
      return this.responses.basicInfo.location.us;
    } else if (location.includes('uk') || location.includes('eu-') || location.includes('germany') || location.includes('france')) {
      return this.responses.basicInfo.location.europe;
    }
    
    return {
      message: "Global perspective! 🌍 Tech is truly worldwide, and your international viewpoint is valuable! 🌟",
      emoji: "🗺️",
      xpReward: 10
    };
  }

  getInterestResponse(interests: string[]): NovaResponse {
    const interestResponses = this.responses.technicalInterests;
    
    // Find the first matching interest
    for (const interest of interests) {
      if (interestResponses[interest as keyof typeof interestResponses]) {
        return interestResponses[interest as keyof typeof interestResponses];
      }
    }

    return {
      message: "Diverse interests! 🎯 I love seeing someone with curiosity across multiple tech areas. That versatility will serve you well! 🌟",
      emoji: "🔥",
      xpReward: 15
    };
  }

  getCognitiveTestResponse(testType: string, isCorrect: boolean): NovaResponse {
    const testResponses = this.responses.cognitiveTests[testType as keyof typeof this.responses.cognitiveTests];
    
    if (typeof testResponses === 'object' && 'correct' in testResponses && 'incorrect' in testResponses) {
      return isCorrect ? testResponses.correct : testResponses.incorrect;
    }

    return {
      message: isCorrect ? "Excellent work! 🎉" : "Good thinking! 💭",
      emoji: isCorrect ? "✅" : "🤔",
      xpReward: isCorrect ? 20 : 5
    };
  }

  getJungTypeResponse(jungType: string): NovaResponse {
    const jungResponses = this.responses.personality.jung;
    return jungResponses[jungType as keyof typeof jungResponses] || {
      message: `${jungType} - what a unique personality type! 🌟 Your combination of traits is going to bring something special to the tech world! ✨`,
      emoji: "🎭",
      xpReward: 25,
      achievement: "Personality Discovered"
    };
  }

  getBigFiveResponse(trait: string, score: number): NovaResponse {
    if (trait === 'openness' && score > 70) {
      return this.responses.personality.bigFive.highOpenness;
    } else if (trait === 'conscientiousness' && score > 70) {
      return this.responses.personality.bigFive.highConscientiousness;
    }

    return {
      message: `Your ${trait} score shows interesting insights about your work style! 📊 This helps me understand how you'll thrive in your future career! 🎯`,
      emoji: "📈",
      xpReward: 10
    };
  }

  getEncouragementMessage(): string {
    const messages = this.responses.encouragement;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getAnalyzingResponse(): NovaResponse {
    return this.responses.results.analyzing;
  }

  getResultsCompleteResponse(): NovaResponse {
    return this.responses.results.complete;
  }

  getContextualResponse(context: ConversationContext, userInput: any): NovaResponse {
    // Analyze user input and provide contextual response
    const { currentStep, userResponses, personalityHints } = context;

    // Adapt response based on detected personality traits
    let enthusiasm = "🌟";
    let tone = "encouraging";

    if (personalityHints.extraversion && personalityHints.extraversion > 60) {
      enthusiasm = "🔥";
      tone = "energetic";
    } else if (personalityHints.extraversion && personalityHints.extraversion < 40) {
      enthusiasm = "💭";
      tone = "thoughtful";
    }

    if (personalityHints.openness && personalityHints.openness > 70) {
      return {
        message: `I can see your creative mind at work! ${enthusiasm} Your innovative thinking is exactly what the tech world needs right now! Keep those unique ideas coming! 🎨`,
        emoji: "🌈",
        xpReward: 15
      };
    }

    // Default encouraging response
    return {
      message: `${this.getEncouragementMessage()} Your answers are giving me great insights into your potential! ${enthusiasm}`,
      emoji: enthusiasm,
      xpReward: 10
    };
  }

  // Personality-based conversation adaptation
  adaptToneForPersonality(baseMessage: string, personalityHints: any): string {
    if (personalityHints.extraversion > 60) {
      // More energetic for extraverts
      return baseMessage.replace(/\./g, '! 🔥').replace(/!/g, '!! 🚀');
    } else if (personalityHints.extraversion < 40) {
      // More thoughtful for introverts
      return baseMessage.replace(/!/g, '.').replace(/🔥/g, '💭').replace(/🚀/g, '🌟');
    }
    
    return baseMessage;
  }

  // Generate motivational messages based on progress
  getProgressMotivation(completedSteps: number, totalSteps: number): NovaResponse {
    const progress = (completedSteps / totalSteps) * 100;
    
    if (progress >= 75) {
      return {
        message: "You're almost at the finish line! 🏁 Your dedication is inspiring. Just a little more and we'll have your complete career profile! 🎯",
        emoji: "🏆",
        xpReward: 25
      };
    } else if (progress >= 50) {
      return {
        message: "Halfway there! 🎉 You're doing amazing. I'm already seeing some exciting patterns in your responses! Keep going! 💪",
        emoji: "⚡",
        xpReward: 20
      };
    } else if (progress >= 25) {
      return {
        message: "Great momentum! 🌟 You're really getting into the flow. I love seeing your personality shine through your answers! ✨",
        emoji: "🚀",
        xpReward: 15
      };
    }
    
    return {
      message: "You're off to a fantastic start! 🌱 Every answer helps me understand you better. This is going to be an amazing journey! 🎯",
      emoji: "🌟",
      xpReward: 10
    };
  }
}

export const novaAssistant = new NovaAssistant();
