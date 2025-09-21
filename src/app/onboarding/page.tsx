'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Shield,
  User,
  Users,
  Target,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Star,
  Zap,
  Award,
  TrendingUp,
  Code,
  Database,
  Lock,
  Globe,
  Sparkles,
  Trophy
} from 'lucide-react';

// Enhanced components
import { gamificationService, GamificationProfile } from '../../lib/gamification';
import { novaAudioService } from '../../lib/nova-audio-service';
import { animationEngine, injectAnimationStyles } from '../../lib/animation-engine';
import { supabaseAssessmentService } from '../../lib/supabase';
import XPDisplay from '../../components/gamification/XPDisplay';
import AchievementNotification from '../../components/gamification/AchievementNotification';
import NovaCompanion, { useNovaCompanion } from '../../components/onboarding/NovaCompanion';
import GeneralizedCognitiveTest from '../../components/assessment/GeneralizedCognitiveTest';
import ComprehensivePersonalityTest from '../../components/assessment/ComprehensivePersonalityTest';
import CognitiveGamesEngine, { GameResult, CognitiveProfile } from '../../components/assessment/CognitiveGamesEngine';
import {
  BasicInfoStep as WizardBasicInfoStep,
  CognitiveAssessmentStep,
  JungTypologyStep,
  BigFiveStep,
  LearningStyleStep,
  ResultsStep
} from '../../components/onboarding/WizardSteps';
import { EducationLevel } from '../../lib/supabase-types';

interface AssessmentData {
  basicInfo: {
    firstName: string;
    lastName: string;
    educationLevel: EducationLevel;
    location: string;
    ageRange: string;
    culturalBackground: string;
    preferredLanguage: string;
    timezone: string;
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
  gamification: {
    startTime: number;
    xp: number;
    level: number;
    achievements: string[];
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile>(
    gamificationService.initializeProfile()
  );
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showCognitiveGames, setShowCognitiveGames] = useState(false);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Nova companion integration
  const {
    novaState,
    celebrateWithNova,
    encourageWithNova,
    exciteWithNova
  } = useNovaCompanion();

  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    basicInfo: {
      firstName: '',
      lastName: '',
      educationLevel: 'o-level',
      location: '',
      ageRange: '',
      culturalBackground: '',
      preferredLanguage: 'en',
      timezone: ''
    },
    cognitiveAssessment: {
      iqComponents: {
        logicalReasoning: 0,
        numericalReasoning: 0,
        verbalReasoning: 0,
        spatialReasoning: 0,
        workingMemory: 0
      },
      school42Style: {
        patternRecognition: 0,
        algorithmicThinking: 0,
        memoryTasks: 0,
        problemDecomposition: 0
      },
      completionTime: 0,
      educationAdjustedScores: {
        logicalReasoning: 0,
        numericalReasoning: 0,
        verbalReasoning: 0,
        spatialReasoning: 0
      }
    },
    jungTypology: {
      extraversion: 50,
      thinking: 50,
      sensing: 50,
      judging: 50,
      type: '',
      description: ''
    },
    bigFivePersonality: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
      traits: []
    },
    learningStyle: {
      modality: '',
      pace: '',
      support: '',
      schedule: '',
      attentionSpan: '',
      preferredFormat: ''
    },
    gamification: {
      startTime: Date.now(),
      xp: 0,
      level: 1,
      achievements: []
    }
  });

  const steps = [
    { id: 'welcome', title: 'Welcome', icon: User, audioId: 'welcome-intro' },
    { id: 'basic-info', title: 'Basic Info', icon: User, audioId: 'basic-info-intro' },
    { id: 'cognitive-assessment', title: 'Cognitive Assessment', icon: Brain, audioId: 'cognitive-games-intro' },
    { id: 'jung-typology', title: 'Personality Type', icon: Star, audioId: 'personality-intro' },
    { id: 'learning-style', title: 'Learning Preferences', icon: Clock, audioId: 'learning-preferences-intro' },
    { id: 'results', title: 'Your Results', icon: Award, audioId: 'results-ready' }
  ];

  // Initialize enhanced features
  useEffect(() => {
    injectAnimationStyles();
    
    if (canvasRef.current) {
      try {
        animationEngine.initialize(canvasRef.current);
      } catch (error) {
        console.warn('Animation engine initialization failed:', error);
      }
    }

    // Initialize gamification
    const profile = gamificationService.initializeProfile();
    const updatedProfile = gamificationService.awardXP(profile, {
      amount: 10,
      reason: 'Started career assessment',
      category: 'assessment'
    });
    
    const { profile: finalProfile, newAchievements: achievements } = 
      gamificationService.checkAchievements(updatedProfile, { started: true });
    
    setGamificationProfile(finalProfile);
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      setTimeout(() => setNewAchievements([]), 4000);
    }

    // Nova welcome message
    setTimeout(() => {
      exciteWithNova(
        "Welcome! I'm Nova, your AI career guide! I'm thrilled to help you discover your perfect tech career path!",
        'welcome-intro'
      );
    }, 1000);

    return () => {
      try {
        animationEngine.destroy();
        novaAudioService.destroy();
      } catch (error) {
        console.warn('Cleanup failed:', error);
      }
    };
  }, []);

  // Nova step introductions
  useEffect(() => {
    const step = steps[currentStep];
    if (step && currentStep > 0) {
      setTimeout(() => {
        const audioId = novaAudioService.selectAudioForContext({
          step: step.id,
          emotion: 'encouraging'
        });
        
        if (audioId) {
          encourageWithNova(
            getStepIntroMessage(step.id),
            audioId
          );
        }
      }, 500);
    }
  }, [currentStep]);

  const getStepIntroMessage = (stepId: string): string => {
    switch (stepId) {
      case 'basic-info':
        return "Let's get to know you better! Tell me about your background and experience.";
      case 'technical-interests':
        return "Now for the fun part - what areas of tech excite you most?";
      case 'cognitive-assessment':
        return "Time for some brain games! These are actually fun, I promise!";
      case 'jung-typology':
        return "Let's explore your personality type - this helps me understand how you work best!";
      case 'big-five':
        return "A few more personality questions to complete your profile!";
      case 'learning-style':
        return "Almost there! Let's talk about how you learn best!";
      case 'results':
        return "Your results are ready! I'm so excited to show you what we've discovered!";
      default:
        return "Great progress! Keep going!";
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Nova encouragement
      if (currentStep === Math.floor(steps.length / 2)) {
        celebrateWithNova("Halfway there! You're doing amazing!", 'halfway-celebration');
      } else if (currentStep === steps.length - 2) {
        exciteWithNova("Almost complete! Your dedication is inspiring!", 'almost-complete');
      } else {
        encourageWithNova("Great progress! Keep it up!", 'great-progress');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Celebrate completion
      celebrateWithNova("Assessment complete! You're officially an Assessment Master!", 'assessment-master');
      
      // Trigger celebration animation
      try {
        animationEngine.triggerAnimation({
          type: 'celebration',
          intensity: 'high'
        });
      } catch (error) {
        console.warn('Celebration animation failed:', error);
      }

      // Call backend API to analyze assessment data
      const analysisResults = await analyzeAssessmentData(assessmentData);

      // Save to Supabase
      if (user && analysisResults) {
        const supabaseResult = await supabaseAssessmentService.saveAssessmentResults(
          user.id,
          user.emailAddresses[0]?.emailAddress || '',
          assessmentData,
          analysisResults
        );

        if (!supabaseResult.success) {
          console.error('Supabase save failed:', supabaseResult.error);
        }
      }

      // Save assessment data to Clerk metadata
      if (user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingCompleted: true,
            assessmentData: analysisResults || assessmentData,
            completedAt: new Date().toISOString()
          }
        });
      }
      
      // Navigate to dashboard after celebration
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.push('/dashboard');
    }
  };

  const analyzeAssessmentData = async (data: AssessmentData) => {
    try {
      const response = await fetch('/api/v1/assessment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Assessment analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing assessment data:', error);
      return null;
    }
  };

  const updateAssessmentData = (section: keyof AssessmentData, data: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));

    // Award XP for completing sections
    awardXPForProgress(section, data);
  };

  const awardXPForProgress = (section: keyof AssessmentData, data: any) => {
    let xpAmount = 0;
    let reason = '';
    let novaMessage = '';
    let audioId = '';

    switch (section) {
      case 'basicInfo':
        if (data.currentRole && data.experience && data.education && data.location) {
          xpAmount = 25;
          reason = 'Completed basic information';
          novaMessage = "Excellent! I'm getting a great picture of who you are!";
          audioId = 'great-progress';
        }
        break;
      case 'cognitiveAssessment':
        if (data.iqComponents?.logicalReasoning > 0) {
          xpAmount = 50;
          reason = 'Completed cognitive assessment';
          novaMessage = "Brilliant work on those brain games! Your thinking skills are impressive!";
          audioId = 'cognitive-master';
        }
        break;
      case 'jungTypology':
        if (data.type) {
          xpAmount = 35;
          reason = 'Completed personality type assessment';
          novaMessage = `${data.type} - what a fascinating personality type!`;
          audioId = 'great-progress';
        }
        break;
      case 'bigFivePersonality':
        if (data.traits?.length >= 2) {
          xpAmount = 35;
          reason = 'Completed personality traits assessment';
          novaMessage = "Your personality profile is coming together beautifully!";
          audioId = 'great-progress';
        }
        break;
      case 'learningStyle':
        if (data.modality && data.pace) {
          xpAmount = 20;
          reason = 'Defined learning preferences';
          novaMessage = "Perfect! Now I know exactly how to help you learn best!";
          audioId = 'almost-complete';
        }
        break;
    }

    if (xpAmount > 0) {
      const updatedProfile = gamificationService.awardXP(gamificationProfile, {
        amount: xpAmount,
        reason,
        category: 'assessment'
      });

      const { profile: finalProfile, newAchievements: achievements } = 
        gamificationService.checkAchievements(updatedProfile, assessmentData);

      setGamificationProfile(finalProfile);
      
      if (achievements.length > 0) {
        setNewAchievements(achievements);
        setTimeout(() => setNewAchievements([]), 4000);
      }

      // Nova celebration
      if (novaMessage) {
        celebrateWithNova(novaMessage, audioId);
      }
    }
  };

  const handleCognitiveTestComplete = (results: any) => {
    setShowCognitiveGames(false);
    
    // Update assessment data with comprehensive cognitive results
    updateAssessmentData('cognitiveAssessment', {
      iqComponents: {
        logicalReasoning: results.logicalReasoning,
        numericalReasoning: results.numericalReasoning,
        verbalReasoning: results.verbalReasoning,
        spatialReasoning: results.spatialReasoning,
        workingMemory: results.workingMemory
      },
      completionTime: results.completionTime,
      educationAdjustedScores: {
        logicalReasoning: results.logicalReasoning,
        numericalReasoning: results.numericalReasoning,
        verbalReasoning: results.verbalReasoning,
        spatialReasoning: results.spatialReasoning
      }
    });
    
    // Move to next step (personality assessment)
    setCurrentStep(currentStep + 1);
  };

  const handlePersonalityTestComplete = (results: any) => {
    setShowPersonalityTest(false);
    
    // Update assessment data with comprehensive personality results
    updateAssessmentData('jungTypology', {
      extraversion: results.jungTypology.extraversion,
      thinking: results.jungTypology.thinking,
      sensing: results.jungTypology.sensing,
      judging: results.jungTypology.judging,
      type: results.jungTypology.type,
      description: results.jungTypology.description
    });
    
    updateAssessmentData('bigFivePersonality', {
      openness: results.bigFive.openness,
      conscientiousness: results.bigFive.conscientiousness,
      extraversion: results.bigFive.extraversion,
      agreeableness: results.bigFive.agreeableness,
      neuroticism: results.bigFive.neuroticism,
      traits: results.bigFive.traits
    });
    
    // Skip to learning style step (step 6)
    setCurrentStep(6);
  };

  const renderStepContent = () => {
    // Add bounds checking to prevent undefined step access
    if (currentStep < 0 || currentStep >= steps.length) {
      console.error('Invalid step index:', currentStep);
      return <div className="text-white">Invalid step</div>;
    }
    
    const step = steps[currentStep];
    if (!step) {
      console.error('Step not found for index:', currentStep);
      return <div className="text-white">Step not found</div>;
    }
    
    switch (step.id) {
      case 'welcome':
        return <WelcomeStep user={user} onNext={handleNext} />;
      case 'basic-info':
        return <WizardBasicInfoStep data={assessmentData.basicInfo} onUpdate={(data) => updateAssessmentData('basicInfo', data)} />;
      case 'cognitive-assessment':
        return <CognitiveAssessmentStep onStartGames={() => setShowCognitiveGames(true)} />;
      case 'jung-typology':
        return <PersonalityAssessmentStep onStartPersonalityTest={() => setShowPersonalityTest(true)} />;
      case 'learning-style':
        return <LearningStyleStep 
          data={assessmentData.learningStyle} 
          onUpdate={(data) => updateAssessmentData('learningStyle', data)}
          assessmentData={assessmentData}
          user={user}
          onComplete={() => setCurrentStep(currentStep + 1)}
        />;
      case 'results':
        return <ResultsStep data={assessmentData} onComplete={handleComplete} />;
      default:
        return <div className="text-white">Unknown step: {step.id}</div>;
    }
  };

  // Show comprehensive cognitive test if active
  if (showCognitiveGames) {
    return (
      <GeneralizedCognitiveTest
        educationLevel={assessmentData.basicInfo.educationLevel}
        onComplete={handleCognitiveTestComplete}
      />
    );
  }

  // Show comprehensive personality test if active
  if (showPersonalityTest) {
    return (
      <ComprehensivePersonalityTest
        onComplete={handlePersonalityTestComplete}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
      />
      
      {/* Animated Neural Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      
      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white">Career Assessment</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Step {currentStep + 1} of {steps.length}
              </span>
              <XPDisplay profile={gamificationProfile} size="sm" />
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <motion.div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isCompleted ? 'text-cyan-400' : 
                    isCurrent ? 'text-blue-400' : 'text-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    isCompleted ? 'bg-cyan-500/20 border-2 border-cyan-400' :
                    isCurrent ? 'bg-blue-500/20 border-2 border-blue-400' :
                    'bg-gray-600/20 border-2 border-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block font-medium">{step.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {steps[currentStep].id !== 'welcome' && steps[currentStep].id !== 'results' && (
            <motion.div 
              className="flex justify-between mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </motion.button>

              <motion.button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nova Companion */}
      <NovaCompanion
        currentStep={steps[currentStep].id}
        message={novaState.message}
        emotion={novaState.emotion}
        isVisible={novaState.isVisible}
        audioId={novaState.audioId}
      />

      {/* Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement, index) => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement}
            onClose={() => setNewAchievements(prev => prev.filter(a => a.id !== achievement.id))}
            delay={index * 200}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ user, onNext }: { user: any; onNext: () => void }) {
  return (
    <motion.div 
      className="text-center"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to CogniFlow!
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Your AI-powered career transformation starts here. Meet Nova, your personal AI guide who will help you discover your perfect tech career path.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Clock className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">15-20 Minutes</h3>
          <p className="text-gray-300 text-sm">Comprehensive assessment with Nova's guidance 🎯</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Target className="w-8 h-8 text-green-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">AI-Powered Analysis</h3>
          <p className="text-gray-300 text-sm">Real AI analysis of your personality and skills 🧠</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Zap className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Gamified Experience</h3>
          <p className="text-gray-300 text-sm">Earn XP and unlock achievements as you progress! 🏆</p>
        </div>
      </motion.div>

      <motion.button
        variants={fadeInUp}
        onClick={onNext}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-8 py-4 rounded-full flex items-center space-x-2 mx-auto font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Let's Begin! 🚀</span>
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

// Personality Assessment Step Component
function PersonalityAssessmentStep({ onStartPersonalityTest }: { onStartPersonalityTest: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Comprehensive Personality Assessment</h2>
      <p className="text-gray-300 mb-8">
        Complete a comprehensive personality assessment including Big Five traits, Jung typology, and work style preferences.
        This comprehensive assessment will provide deep insights into your personality and work preferences.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Users className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Big Five Traits</h3>
          <p className="text-gray-300 text-sm">50 questions covering all major personality dimensions</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Star className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Work Preferences</h3>
          <p className="text-gray-300 text-sm">Jung typology scenarios for work style analysis</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Target className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Professional Style</h3>
          <p className="text-gray-300 text-sm">Leadership, collaboration, and innovation preferences</p>
        </div>
      </div>

      <motion.button
        onClick={onStartPersonalityTest}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4 rounded-full flex items-center space-x-2 mx-auto font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Start Personality Assessment! 🧠</span>
      </motion.button>
    </div>
  );
}

// Basic Info Step Component
function BasicInfoStep({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Tell us about yourself</h2>
      <p className="text-gray-300 mb-8">Help us understand your current background and experience level.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">Current Role/Status</label>
          <select 
            value={data.currentRole}
            onChange={(e) => onUpdate({ currentRole: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your current status</option>
            <option value="student">Student</option>
            <option value="entry-level">Entry-level Professional</option>
            <option value="mid-level">Mid-level Professional</option>
            <option value="senior-level">Senior Professional</option>
            <option value="career-changer">Career Changer</option>
            <option value="unemployed">Currently Unemployed</option>
            <option value="entrepreneur">Entrepreneur</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Years of Professional Experience</label>
          <select 
            value={data.experience}
            onChange={(e) => onUpdate({ experience: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years</option>
            <option value="2-3">2-3 years</option>
            <option value="4-6">4-6 years</option>
            <option value="7-10">7-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Highest Education Level</label>
          <select 
            value={data.education}
            onChange={(e) => onUpdate({ education: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select education level</option>
            <option value="high-school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="bootcamp">Coding Bootcamp</option>
            <option value="self-taught">Self-taught</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Location (for salary insights)</label>
          <select 
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your location</option>
            <optgroup label="North America">
              <option value="us-west">US - West Coast</option>
              <option value="us-east">US - East Coast</option>
              <option value="canada">Canada</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="uk">United Kingdom</option>
              <option value="germany">Germany</option>
              <option value="france">France</option>
            </optgroup>
            <optgroup label="Africa">
              <option value="south-africa">South Africa</option>
              <option value="nigeria">Nigeria</option>
              <option value="kenya">Kenya</option>
            </optgroup>
            <optgroup label="Asia Pacific">
              <option value="india">India</option>
              <option value="australia">Australia</option>
              <option value="singapore">Singapore</option>
            </optgroup>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
