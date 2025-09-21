/**
 * Enhanced Nova AI Assistant - Advanced Conversational Assessment Guide
 * Provides dynamic, contextual conversations with personality adaptation
 */

export interface NovaResponse {
  message: string;
  emoji?: string;
  xpReward?: number;
  achievement?: string;
  options?: string[];
  followUp?: string;
  nextPhase?: string;
  animationType?: 'celebration' | 'thinking' | 'excitement' | 'encouragement';
  soundEffect?: string;
}

export interface ConversationContext {
  currentPhase: string;
  userResponses: Record<string, any>;
  personalityProfile: {
    extraversion?: number;
    openness?: number;
    conscientiousness?: number;
    agreeableness?: number;
    neuroticism?: number;
    detectedTraits?: string[];
  };
  cognitiveProfile: {
    logicalReasoning?: number;
    numericalReasoning?: number;
    verbalReasoning?: number;
    spatialReasoning?: number;
  };
  conversationHistory: string[];
  culturalContext?: string;
  educationLevel?: string;
  engagementLevel: number;
  completedPhases: string[];
}

export interface AssessmentData {
  basicInfo: {
    currentRole: string;
    experience: string;
    education: string;
    educationLevel: 'primary' | 'high-school' | 'college' | 'professional';
    location: string;
    ageRange: string;
    culturalBackground: string;
    preferredLanguage: string;
    timezone: string;
  };
  technicalInterests: {
    technologyComfort: string;
    problemSolvingApproach: string;
    interestAreas: string[];
    analyticalThinking: string;
    codingExperience: string;
    favoriteTools: string[];
  };
  cognitiveAssessment: {
    iqComponents: {
      logicalReasoning: number;
      numericalReasoning: number;
      verbalReasoning: number;
      spatialReasoning: number;
      workingMemory: number;
    };
    school42Style: {
      patternRecognition: number;
      algorithmicThinking: number;
      memoryTasks: number;
      problemDecomposition: number;
    };
    completionTime: number;
    educationAdjustedScores: {
      logicalReasoning: number;
      numericalReasoning: number;
      verbalReasoning: number;
      spatialReasoning: number;
    };
  };
  jungTypology: {
    extraversion: number;
    thinking: number;
    sensing: number;
    judging: number;
    type: string;
    description: string;
  };
  bigFivePersonality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    traits: string[];
  };
  learningStyle: {
    modality: string;
    pace: string;
    support: string;
    schedule: string;
    attentionSpan: string;
    preferredFormat: string;
  };
  goals: {
    careerGoals: string;
    timeline: string;
    salaryExpectations: string;
    workEnvironment: string;
    personalMotivation: string;
    successMetrics: string[];
  };
}

class EnhancedNovaAssistant {
  private context: ConversationContext;
  private assessmentData: Partial<AssessmentData> = {};

  constructor() {
    this.context = {
      currentPhase: 'welcome',
      userResponses: {},
      personalityProfile: {},
      cognitiveProfile: {},
      conversationHistory: [],
      engagementLevel: 100,
      completedPhases: []
    };
  }

  // Dynamic conversation flow based on user responses and personality
  getNextResponse(userInput: string, currentPhase: string): NovaResponse {
    this.updateContext(userInput, currentPhase);
    
    switch (currentPhase) {
      case 'welcome':
        return this.handleWelcomePhase(userInput);
      case 'basic-info':
        return this.handleBasicInfoPhase(userInput);
      case 'technical-interests':
        return this.handleTechnicalInterestsPhase(userInput);
      case 'cognitive-assessment':
        return this.handleCognitiveAssessmentPhase(userInput);
      case 'personality-assessment':
        return this.handlePersonalityAssessmentPhase(userInput);
      case 'learning-preferences':
        return this.handleLearningPreferencesPhase(userInput);
      case 'results':
        return this.handleResultsPhase(userInput);
      default:
        return this.getContextualResponse(userInput);
    }
  }

  private updateContext(userInput: string, currentPhase: string) {
    this.context.conversationHistory.push(userInput);
    this.context.currentPhase = currentPhase;
    
    // Analyze user input for personality hints
    this.analyzePersonalityFromInput(userInput);
    
    // Update engagement level based on response quality
    this.updateEngagementLevel(userInput);
  }

  private analyzePersonalityFromInput(input: string): void {
    const lowerInput = input.toLowerCase();
    
    // Extraversion indicators
    if (lowerInput.includes('team') || lowerInput.includes('people') || lowerInput.includes('social')) {
      this.context.personalityProfile.extraversion = (this.context.personalityProfile.extraversion || 50) + 10;
    }
    if (lowerInput.includes('alone') || lowerInput.includes('quiet') || lowerInput.includes('independent')) {
      this.context.personalityProfile.extraversion = (this.context.personalityProfile.extraversion || 50) - 10;
    }

    // Openness indicators
    if (lowerInput.includes('creative') || lowerInput.includes('innovative') || lowerInput.includes('new')) {
      this.context.personalityProfile.openness = (this.context.personalityProfile.openness || 50) + 10;
    }

    // Conscientiousness indicators
    if (lowerInput.includes('organized') || lowerInput.includes('plan') || lowerInput.includes('systematic')) {
      this.context.personalityProfile.conscientiousness = (this.context.personalityProfile.conscientiousness || 50) + 10;
    }
  }

  private updateEngagementLevel(input: string): void {
    if (input.length > 50) {
      this.context.engagementLevel = Math.min(100, this.context.engagementLevel + 5);
    } else if (input.length < 10) {
      this.context.engagementLevel = Math.max(0, this.context.engagementLevel - 5);
    }
  }

  private handleWelcomePhase(userInput: string): NovaResponse {
    if (!userInput) {
      return {
        message: this.adaptToneForPersonality(
          "Hey there! 👋 I'm Nova, your AI career guide! I'm absolutely thrilled to help you discover your perfect tech career path! Think of me as your personal career detective - I'll ask engaging questions, we'll play some brain games, and together we'll uncover what makes you uniquely awesome! Ready to start this exciting journey? 🚀",
          this.context.personalityProfile
        ),
        emoji: "🤖",
        options: ["Let's do this! I'm excited!", "Tell me more about what we'll do", "I'm a bit nervous, but ready"],
        animationType: 'excitement',
        xpReward: 10
      };
    }

    const enthusiasm = this.detectEnthusiasm(userInput);
    
    if (enthusiasm === 'high') {
      return {
        message: "I LOVE that energy! 🔥 You're going to absolutely crush this! Your enthusiasm tells me you're ready for big things. Let's dive right in and start discovering what makes you special! 💪✨",
        emoji: "⚡",
        xpReward: 20,
        nextPhase: 'basic-info',
        animationType: 'celebration',
        followUp: "Perfect! Let's start getting to know the amazing person behind the screen! 😊 First up - what's your current situation? Are you a student diving into possibilities, a professional looking to pivot, or somewhere in between?",
        options: [
          "I'm a student exploring options",
          "I'm working but want to change careers", 
          "I'm just starting my professional journey",
          "I'm experienced but want to specialize",
          "I'm between jobs and exploring",
          "Let me explain my unique situation"
        ]
      };
    } else if (enthusiasm === 'curious') {
      return {
        message: "Great question! 🤔 Here's what we'll do: I'll chat with you about your background, interests, and goals. Then we'll play some fun brain games that adapt to your level. Finally, I'll analyze everything to create your personalized career roadmap. It's like having a career counselor who really gets tech! Sound good? 💡",
        emoji: "🎯",
        options: ["That sounds perfect!", "How long will it take?", "What kind of brain games?"],
        xpReward: 15,
        nextPhase: 'basic-info'
      };
    } else {
      return {
        message: "Hey, no worries at all! 🤗 Feeling nervous is totally normal - it just shows you care about your future! I'm here to support you every step of the way. There are no wrong answers, and we'll go at your pace. Think of this as a friendly chat with someone who wants to see you succeed! Ready to take the first small step? 🌟",
        emoji: "💙",
        xpReward: 25,
        nextPhase: 'basic-info',
        animationType: 'encouragement',
        followUp: "Let's start with something easy! What's your current situation? Are you a student, working professional, or somewhere in between?",
        options: [
          "I'm a student exploring options",
          "I'm working but want to change careers",
          "I'm just starting my professional journey", 
          "I'm experienced but want to specialize",
          "I'm between jobs and exploring"
        ]
      };
    }
  }

  private handleBasicInfoPhase(userInput: string): NovaResponse {
    const phase = this.determineBasicInfoSubPhase();
    
    switch (phase) {
      case 'role':
        return this.handleRoleQuestion(userInput);
      case 'experience':
        return this.handleExperienceQuestion(userInput);
      case 'education':
        return this.handleEducationQuestion(userInput);
      case 'location':
        return this.handleLocationQuestion(userInput);
      case 'background':
        return this.handleBackgroundQuestion(userInput);
      default:
        return this.startBasicInfoCollection();
    }
  }

  private startBasicInfoCollection(): NovaResponse {
    return {
      message: this.adaptToneForPersonality(
        "Perfect! Let's start getting to know the amazing person behind the screen! 😊 First up - what's your current situation? Are you a student diving into possibilities, a professional looking to pivot, or somewhere in between? Don't worry about labels - just tell me where you're at right now! 📍",
        this.context.personalityProfile
      ),
      emoji: "💼",
      options: [
        "I'm a student exploring options",
        "I'm working but want to change careers",
        "I'm just starting my professional journey",
        "I'm experienced but want to specialize",
        "I'm between jobs and exploring",
        "Let me explain my unique situation"
      ],
      animationType: 'thinking'
    };
  }

  private handleRoleQuestion(userInput: string): NovaResponse {
    this.assessmentData.basicInfo = { 
      ...this.assessmentData.basicInfo, 
      currentRole: userInput 
    };

    const roleResponses = {
      student: {
        message: "A student! 🎓 I absolutely LOVE working with students - you have this incredible advantage of starting with a clean slate and endless possibilities! The tech world is going to be so lucky to have fresh talent like you. Your timing is perfect! 🌟",
        emoji: "📚",
        xpReward: 20,
        achievement: "Future Tech Leader"
      },
      "career-changer": {
        message: "A career changer! 🔄 Now THIS is exciting! You know what? Career changers often become the most successful tech professionals because you bring unique perspectives and real-world experience. That's not just valuable - it's a superpower! 💪",
        emoji: "🦋",
        xpReward: 25,
        achievement: "Brave Transformer"
      },
      "entry-level": {
        message: "Starting your professional journey! 🌱 You're at such an exciting point - everything is possible! Your fresh perspective and eagerness to learn are exactly what the tech industry needs. Get ready to grow into something amazing! 🚀",
        emoji: "🌟",
        xpReward: 20
      }
    };

    const response = this.findBestMatch(userInput, roleResponses) || {
      message: `Interesting background! 💼 Every path brings unique value to tech. I can already see some exciting possibilities forming based on your experience. Let's keep building your profile! 🎯`,
      emoji: "✨",
      xpReward: 15
    };

    return {
      ...response,
      followUp: "Now, let's talk experience! How many years have you been in the professional world? And don't worry if it's zero - everyone starts somewhere, and I'll adjust everything to match your level! ⏰",
      options: [
        "0-1 years (just starting!)",
        "2-3 years (getting my feet wet)",
        "4-6 years (building momentum)",
        "7-10 years (solid experience)",
        "10+ years (seasoned professional)"
      ]
    };
  }

  private handleExperienceQuestion(userInput: string): NovaResponse {
    this.assessmentData.basicInfo = { 
      ...this.assessmentData.basicInfo, 
      experience: userInput 
    };

    const experienceLevel = this.extractExperienceLevel(userInput);
    let response: NovaResponse;

    if (experienceLevel <= 1) {
      response = {
        message: "Starting fresh - I love it! 🌱 You know what's amazing about being new? You get to learn the latest technologies and best practices from day one. No bad habits to unlearn! Plus, your beginner's mind will help you see solutions that experienced folks might miss. 💡",
        emoji: "🎯",
        xpReward: 15
      };
    } else if (experienceLevel <= 5) {
      response = {
        message: "Great foundation years! 🏗️ You've got that perfect sweet spot - enough experience to understand how things work, but still fresh enough to adapt quickly to new technologies. Employers love this combination! 📈",
        emoji: "⚡",
        xpReward: 20
      };
    } else {
      response = {
        message: "Seasoned professional! 🏆 Your experience is gold in the tech world. You understand business needs, can mentor others, and bring strategic thinking to technical challenges. That's leadership material right there! 👑",
        emoji: "💎",
        xpReward: 25,
        achievement: "Experienced Professional"
      };
    }

    return {
      ...response,
      followUp: "Education time! 🎓 What's your highest level of education? This helps me tailor our brain games and explanations to be just right for you - not too easy, not too hard, but perfectly challenging! 📚",
      options: [
        "High School",
        "Some College",
        "Associate Degree",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD",
        "Coding Bootcamp",
        "Self-taught (the best kind!)",
        "Professional Certifications"
      ]
    };
  }

  private handleEducationQuestion(userInput: string): NovaResponse {
    const educationLevel = this.determineEducationLevel(userInput);
    this.assessmentData.basicInfo = { 
      ...this.assessmentData.basicInfo, 
      education: userInput,
      educationLevel 
    };
    this.context.educationLevel = educationLevel;

    const educationResponses = {
      'high-school': {
        message: "High school foundation - perfect! 🎯 You know what I love about this? You're getting into tech at the perfect time to grow with the industry. I'll make sure our assessments match your level, and trust me, some of the most successful tech leaders started exactly where you are! 🌟",
        emoji: "📖"
      },
      'college': {
        message: "College education - excellent! 🏛️ Your academic experience has given you critical thinking skills and the ability to learn complex concepts. That's exactly what tech careers need! 🧠",
        emoji: "🎓"
      },
      'professional': {
        message: "Advanced education - impressive! 🎖️ Your deep academic background gives you a real advantage in understanding complex systems and research. I can already see some exciting high-level career paths opening up! ✨",
        emoji: "👨‍🎓",
        xpReward: 15
      }
    };

    const response = educationResponses[educationLevel] || {
      message: "Great educational background! 📚 Every learning path brings unique value. Your combination of formal and practical learning is exactly what makes tech professionals well-rounded! 💪",
      emoji: "🎯"
    };

    return {
      ...response,
      followUp: "Now for geography! 🌍 Where in the world are you? This helps me give you accurate salary insights and understand your local tech scene. Plus, I love learning about different tech communities around the globe! 🗺️",
      options: [
        "United States",
        "Canada",
        "United Kingdom",
        "Germany",
        "South Africa",
        "Nigeria",
        "Kenya",
        "India",
        "Australia",
        "Other (I'll specify)"
      ]
    };
  }

  private handleLocationQuestion(userInput: string): NovaResponse {
    this.assessmentData.basicInfo = { 
      ...this.assessmentData.basicInfo, 
      location: userInput 
    };

    const culturalContext = this.determineCulturalContext(userInput);
    this.context.culturalContext = culturalContext;

    let response: NovaResponse;

    if (userInput.toLowerCase().includes('africa')) {
      response = {
        message: "Africa represent! 🦁 The tech scene across Africa is absolutely BOOMING right now! From fintech in Nigeria to AI startups in South Africa, you're part of an incredible wave of innovation. The world is watching African tech, and you're going to be part of that story! 🌍✨",
        emoji: "🚀",
        xpReward: 25,
        achievement: "African Tech Pioneer"
      };
    } else if (userInput.toLowerCase().includes('us') || userInput.toLowerCase().includes('united states')) {
      response = {
        message: "United States! 🇺🇸 You're in the heart of the global tech ecosystem! From Silicon Valley to Austin, from Seattle to New York - opportunities are everywhere. The salary potential and career growth here are incredible! 💰",
        emoji: "🏙️",
        xpReward: 20
      };
    } else if (userInput.toLowerCase().includes('europe') || userInput.toLowerCase().includes('uk') || userInput.toLowerCase().includes('germany')) {
      response = {
        message: "Europe! 🇪🇺 Amazing choice! European tech hubs offer incredible opportunities with that famous work-life balance. Plus, the diversity of languages and cultures makes for such rich, innovative teams! 🌟",
        emoji: "🏰",
        xpReward: 20
      };
    } else {
      response = {
        message: "Global perspective! 🌍 I love that tech is truly worldwide now. Your international viewpoint is going to be such an asset - global companies need people who understand different markets and cultures! 🗺️",
        emoji: "🌐",
        xpReward: 15
      };
    }

    return {
      ...response,
      followUp: "Fantastic! Now I'm getting a great picture of who you are. Ready for the fun part? Let's explore what areas of tech make your brain light up! 🧠⚡ What draws you in - the logic of code, the creativity of design, the detective work of cybersecurity, or something else entirely?",
      nextPhase: 'technical-interests',
      animationType: 'excitement'
    };
  }

  private handleTechnicalInterestsPhase(userInput: string): NovaResponse {
    if (!this.assessmentData.technicalInterests) {
      return this.startTechnicalInterestsExploration();
    }

    return this.processTechnicalInterest(userInput);
  }

  private startTechnicalInterestsExploration(): NovaResponse {
    return {
      message: this.adaptToneForPersonality(
        "Now for my favorite part - let's explore what makes your tech heart beat faster! 💓 I'm going to ask about different areas, and I want you to be completely honest about what genuinely excites you. Passion is the best predictor of success in tech! 🔥",
        this.context.personalityProfile
      ),
      emoji: "🎯",
      followUp: "First question: When you think about technology, what aspect fascinates you most? The problem-solving, the creativity, the impact on people, or something else?",
      options: [
        "I love solving complex puzzles and problems",
        "I'm drawn to creating things people will use",
        "I want to protect people and systems from threats",
        "I'm fascinated by data and finding patterns",
        "I enjoy automating and optimizing processes",
        "I'm curious about how intelligent systems work",
        "Let me think about this more..."
      ],
      animationType: 'thinking'
    };
  }

  private processTechnicalInterest(userInput: string): NovaResponse {
    const interests = this.assessmentData.technicalInterests?.interestAreas || [];
    
    // Analyze the input for technical interests
    const detectedInterests = this.detectTechnicalInterests(userInput);
    const updatedInterests = [...new Set([...interests, ...detectedInterests])];
    
    this.assessmentData.technicalInterests = {
      ...this.assessmentData.technicalInterests,
      interestAreas: updatedInterests
    };

    // Generate response based on detected interests
    const primaryInterest = detectedInterests[0];
    let response: NovaResponse;

    switch (primaryInterest) {
      case 'machine-learning':
        response = {
          message: "Machine Learning and AI! 🤖 OH MY GOODNESS, yes! You're interested in literally the most transformative technology of our time! ML is reshaping every single industry - from healthcare saving lives to finance preventing fraud. Your curiosity about intelligent systems shows you're thinking about the future! 🧠✨",
          emoji: "🔮",
          xpReward: 30,
          achievement: "AI Visionary"
        };
        break;
      case 'cybersecurity':
        response = {
          message: "Cybersecurity! 🛡️ The digital guardians! With cyber threats everywhere, you're choosing to be a HERO - literally protecting people, companies, and even countries from digital attacks! Plus, cybersecurity professionals are in massive demand with incredible salaries. You're thinking strategically! 🦸‍♀️",
          emoji: "🔒",
          xpReward: 30,
          achievement: "Digital Guardian"
        };
        break;
      case 'data-science':
        response = {
          message: "Data Science! 📊 The modern-day detective work! You'll be like Sherlock Holmes but with datasets - finding hidden patterns, predicting trends, and uncovering insights that drive million-dollar decisions. Data is the new oil, and you want to be the refinery! 🕵️‍♀️✨",
          emoji: "📈",
          xpReward: 25
        };
        break;
      default:
        response = {
          message: "I can hear the passion in your response! 🔥 That genuine curiosity and interest is exactly what successful tech careers are built on. Let me dig a little deeper to understand what specifically excites you! 💡",
          emoji: "⭐",
          xpReward: 15
        };
    }

    // Ask follow-up questions based on their interests
    const followUpQuestions = this.generateTechnicalFollowUp(updatedInterests);
    
    return {
      ...response,
      followUp: followUpQuestions.question,
      options: followUpQuestions.options,
      nextPhase: updatedInterests.length >= 2 ? 'cognitive-assessment' : undefined
    };
  }

  private handleCognitiveAssessmentPhase(userInput: string): NovaResponse {
    return {
      message: "Time for some brain games! 🧩 Don't worry - these are actually fun! I've designed them to feel like games rather than tests. Based on your education level, I'll make sure they're challenging but fair. Ready to show off those thinking skills? 💪",
      emoji: "🎮",
      followUp: "We'll start with some pattern recognition - think of it as a puzzle game! Are you ready to begin?",
      options: ["Let's do this!", "What exactly will we be doing?", "I'm ready but a bit nervous"],
      nextPhase: 'cognitive-games',
      animationType: 'excitement'
    };
  }

  private handlePersonalityAssessmentPhase(userInput: string): NovaResponse {
    return {
      message: "Now for the personality exploration! 🌈 This is where we discover what makes you uniquely YOU! I'll present some work scenarios, and you just pick what feels most natural. There's no right or wrong - just authentic! 😊",
      emoji: "🎭",
      nextPhase: 'personality-scenarios',
      animationType: 'thinking'
    };
  }

  private handleLearningPreferencesPhase(userInput: string): NovaResponse {
    return {
      message: "Almost there! 🏁 Let's talk about how you learn best. This helps me recommend the perfect learning path for your unique style! 📚",
      emoji: "🎯",
      nextPhase: 'learning-style',
      animationType: 'encouragement'
    };
  }

  private handleResultsPhase(userInput: string): NovaResponse {
    return {
      message: "WOW! 🤩 I've analyzed everything and your results are INCREDIBLE! I've found some amazing career paths that are perfect for your unique combination of skills, personality, and interests. Ready to see your personalized roadmap to success? 🚀",
      emoji: "🎊",
      xpReward: 50,
      achievement: "Assessment Master",
      nextPhase: 'results-reveal',
      animationType: 'celebration'
    };
  }

  // Utility methods
  private detectEnthusiasm(input: string): 'high' | 'medium' | 'low' | 'curious' {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('excited') || lowerInput.includes('let\'s do this') || lowerInput.includes('yes!')) {
      return 'high';
    }
    if (lowerInput.includes('tell me more') || lowerInput.includes('what') || lowerInput.includes('how')) {
      return 'curious';
    }
    if (lowerInput.includes('nervous') || lowerInput.includes('worried')) {
      return 'low';
    }
    return 'medium';
  }

  private findBestMatch(input: string, responses: Record<string, any>): any {
    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key) || lowerInput.includes(key.replace('-', ' '))) {
        return response;
      }
    }
    return null;
  }

  private extractExperienceLevel(input: string): number {
    if (input.includes('0-1')) return 1;
    if (input.includes('2-3')) return 3;
    if (input.includes('4-6')) return 5;
    if (input.includes('7-10')) return 8;
    if (input.includes('10+')) return 12;
    return 0;
  }

  private determineEducationLevel(input: string): 'primary' | 'high-school' | 'college' | 'professional' {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('phd') || lowerInput.includes('master')) return 'professional';
    if (lowerInput.includes('bachelor') || lowerInput.includes('college') || lowerInput.includes('associate')) return 'college';
    if (lowerInput.includes('high school')) return 'high-school';
    return 'high-school';
  }

  private determineCulturalContext(location: string): string {
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes('africa')) return 'african';
    if (lowerLocation.includes('us') || lowerLocation.includes('america')) return 'american';
    if (lowerLocation.includes('europe') || lowerLocation.includes('uk')) return 'european';
    if (lowerLocation.includes('asia') || lowerLocation.includes('india')) return 'asian';
    return 'global';
  }

  private detectTechnicalInterests(input: string): string[] {
    const interests: string[] = [];
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('ai') || lowerInput.includes('machine learning') || lowerInput.includes('intelligent')) {
      interests.push('machine-learning');
    }
    if (lowerInput.includes('security') || lowerInput.includes('protect') || lowerInput.includes('cyber')) {
      interests.push('cybersecurity');
    }
    if (lowerInput.includes('data') || lowerInput.includes('pattern') || lowerInput.includes('analytics')) {
      interests.push('data-science');
    }
    if (lowerInput.includes('web') || lowerInput.includes('app') || lowerInput.includes('frontend')) {
      interests.push('web-development');
    }
    if (lowerInput.includes('automat') || lowerInput.includes('optim') || lowerInput.includes('process')) {
      interests.push('automation');
    }

    return interests;
  }

  private generateTechnicalFollowUp(interests: string[]): { question: string; options: string[] } {
    if (interests.length === 0) {
      return {
        question: "Let me ask differently - when you use technology, what do you find most interesting?",
        options: [
          "How it solves real problems",
          "The creative possibilities",
          "The technical complexity",
          "The impact on people's lives"
        ]
      };
    }

    return {
      question: "Great! Now, what draws you to technology in general - the problem-solving aspect, the creativity, or something else?",
      options: [
        "I love the logical problem-solving",
        "I'm excited by the creative possibilities",
        "I want to make a positive impact",
        "I'm fascinated by how things work",
        "I enjoy the continuous learning"
      ]
    };
  }

  private determineBasicInfoSubPhase(): string {
    if (!this.assessmentData.basicInfo?.currentRole) return 'role';
    if (!this.assessmentData.basicInfo?.experience) return 'experience';
    if (!this.assessmentData.basicInfo?.education) return 'education';
    if (!this.assessmentData.basicInfo?.location) return 'location';
    return 'complete';
  }

  private adaptToneForPersonality(message: string, personality: any): string {
    if (personality.extraversion && personality.extraversion > 60) {
      return message.replace(/\./g, '!').replace(/good/g, 'AMAZING').replace(/great/g, 'FANTASTIC');
    }
    if (personality.extraversion && personality.extraversion < 40) {
      return message.replace(/!/g, '.').replace(/AMAZING/g, 'good').replace(/🔥/g, '💭');
    }
    return message;
  }

  private getContextualResponse(userInput: string): NovaResponse {
    return {
      message: "I can see you're really thinking about this! 💭 Your thoughtful responses are giving me great insights. Keep being authentic - that's what makes you special! 🌟",
      emoji: "💡",
      xpReward: 10,
      animationType: 'encouragement'
    };
  }

  private handleBackgroundQuestion(userInput: string): NovaResponse {
    return {
      message: "Thanks for sharing more about your background! 📝 Every detail helps me understand you better and create the perfect career path recommendations! 🎯",
      emoji: "✨",
      xpReward: 15,
      nextPhase: 'technical-interests'
    };
  }

  // Public methods for external access
  getAssessmentData(): Partial<AssessmentData> {
    return this.assessmentData;
  }

  getContext(): ConversationContext {
    return this.context;
  }

  updateAssessmentData(data: Partial<AssessmentData>): void {
    this.assessmentData = { ...this.assessmentData, ...data };
  }

  resetConversation(): void {
    this.context = {
      currentPhase: 'welcome',
      userResponses: {},
      personalityProfile: {},
      cognitiveProfile: {},
      conversationHistory: [],
      engagementLevel: 100,
      completedPhases: []
    };
    this.assessmentData = {};
  }
}

export const enhancedNovaAssistant = new EnhancedNovaAssistant();
