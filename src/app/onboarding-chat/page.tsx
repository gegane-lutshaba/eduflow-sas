'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ChatMessage from '../../components/chat/ChatMessage';
import TypingIndicator from '../../components/chat/TypingIndicator';
import XPDisplay from '../../components/gamification/XPDisplay';
import { gamificationService, GamificationProfile } from '../../lib/gamification';
import { novaAssistant, NovaResponse } from '../../lib/nova-assistant';
import {
  Brain,
  Shield,
  User,
  Target,
  Clock,
  ChevronRight,
  Send,
  Sparkles,
  Database,
  Globe,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  emoji?: string;
  xpReward?: number;
  achievement?: string;
}

interface AssessmentData {
  basicInfo: {
    currentRole: string;
    experience: string;
    education: string;
    educationLevel: 'primary' | 'high-school' | 'college' | 'professional';
    location: string;
  };
  technicalInterests: {
    technologyComfort: string;
    problemSolvingApproach: string;
    interestAreas: string[];
    analyticalThinking: string;
  };
  cognitiveAssessment: {
    iqComponents: {
      logicalReasoning: number;
      numericalReasoning: number;
      verbalReasoning: number;
      spatialReasoning: number;
      workingMemory: number;
    };
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
  };
}

export default function ChatOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('welcome');
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({});
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile>(
    gamificationService.initializeProfile()
  );
  const [showOptions, setShowOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start conversation
    startConversation();
  }, []);

  const startConversation = () => {
    const welcomeResponse = novaAssistant.getWelcomeResponse();
    addNovaMessage(welcomeResponse);
  };

  const addNovaMessage = (response: NovaResponse, delay: number = 1000) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: response.message,
        isUser: false,
        timestamp: new Date(),
        emoji: response.emoji,
        xpReward: response.xpReward,
        achievement: response.achievement
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);

      // Award XP if provided
      if (response.xpReward) {
        const updatedProfile = gamificationService.awardXP(gamificationProfile, {
          amount: response.xpReward,
          reason: 'Conversation progress',
          category: 'assessment'
        });
        setGamificationProfile(updatedProfile);
      }

      // Show options if provided
      if (response.options) {
        setShowOptions(response.options);
      }
    }, delay);
  };

  const addUserMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setShowOptions([]);
    setInputValue('');
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    processUserResponse(option);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      processUserResponse(inputValue);
    }
  };

  const processUserResponse = (response: string) => {
    switch (currentQuestion) {
      case 'welcome':
        const welcomeResponse = novaAssistant.getWelcomeResponse(response);
        addNovaMessage(welcomeResponse);
        setTimeout(() => askBasicInfo(), 2000);
        break;
        
      case 'role':
        const roleResponse = novaAssistant.getRoleResponse(response);
        setAssessmentData(prev => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, currentRole: response }
        }));
        addNovaMessage(roleResponse);
        setTimeout(() => askExperience(), 2000);
        break;
        
      case 'education':
        const educationResponse = novaAssistant.getEducationResponse(response);
        setAssessmentData(prev => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, education: response }
        }));
        addNovaMessage(educationResponse);
        setTimeout(() => askLocation(), 2000);
        break;
        
      case 'location':
        const locationResponse = novaAssistant.getLocationResponse(response);
        setAssessmentData(prev => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, location: response }
        }));
        addNovaMessage(locationResponse);
        setTimeout(() => askTechnicalInterests(), 2000);
        break;
        
      case 'interests':
        const interestResponse = novaAssistant.getInterestResponse([response]);
        setAssessmentData(prev => ({
          ...prev,
          technicalInterests: { 
            ...prev.technicalInterests, 
            interestAreas: [...(prev.technicalInterests?.interestAreas || []), response]
          }
        }));
        addNovaMessage(interestResponse);
        setTimeout(() => startCognitiveTests(), 2000);
        break;
        
      default:
        // Default encouraging response
        const encouragementResponse = novaAssistant.getContextualResponse({
          currentStep: currentQuestion,
          userResponses: assessmentData,
          personalityHints: {}
        }, response);
        addNovaMessage(encouragementResponse);
    }
  };

  const askBasicInfo = () => {
    setCurrentQuestion('role');
    addNovaMessage({
      message: "Let's start with the basics! 📝 What's your current role or status? This helps me understand where you're starting from! 🎯",
      emoji: "💼",
      options: ["Student", "Entry-level Professional", "Career Changer", "Mid-level Professional", "Senior Professional"]
    });
  };

  const askExperience = () => {
    setCurrentQuestion('experience');
    addNovaMessage({
      message: "Got it! 👍 Now, how many years of professional experience do you have? Don't worry if it's zero - everyone starts somewhere! 🌱",
      emoji: "⏰",
      options: ["0-1 years", "2-3 years", "4-6 years", "7-10 years", "10+ years"]
    });
  };

  const askEducation = () => {
    setCurrentQuestion('education');
    addNovaMessage({
      message: "Education time! 🎓 What's your highest level of education? This helps me tailor the questions to be just right for you! 📚",
      emoji: "🎯",
      options: ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD", "Coding Bootcamp", "Self-taught"]
    });
  };

  const askLocation = () => {
    setCurrentQuestion('location');
    addNovaMessage({
      message: "Where in the world are you? 🌍 This helps me give you accurate salary insights and understand the local tech scene! 💰",
      emoji: "📍",
      options: ["US - West Coast", "US - East Coast", "South Africa", "Nigeria", "Kenya", "UK", "Germany", "Other"]
    });
  };

  const askTechnicalInterests = () => {
    setCurrentQuestion('interests');
    addNovaMessage({
      message: "Now for the exciting part! 🎉 What areas of tech spark your curiosity? Pick what genuinely interests you - passion is the best predictor of success! 💡",
      emoji: "🔥",
      options: ["Machine Learning", "Cybersecurity", "Data Analysis", "Web Development", "Automation", "Research"]
    });
  };

  const startCognitiveTests = () => {
    setCurrentQuestion('cognitive');
    addNovaMessage({
      message: "Time for some brain games! 🧩 These are actually fun, I promise! I've adapted them to your education level. Ready to show off those thinking skills? 💪",
      emoji: "🎮"
    });
    
    setTimeout(() => {
      router.push('/onboarding?step=cognitive');
    }, 3000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Neural Background */}
      <div className="neural-bg"></div>
      
      {/* Header with XP Display */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyber-green/20 border-2 border-cyber-green rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyber-green" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Chat with Nova</h1>
                <p className="text-sm text-gray-300">Your AI Career Guide</p>
              </div>
            </div>
            <XPDisplay profile={gamificationProfile} size="sm" />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Chat Messages */}
          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.message}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  emoji={message.emoji}
                  xpReward={message.xpReward}
                  achievement={message.achievement}
                />
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
          </div>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-gray-600/30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Quick Options */}
          {showOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex flex-wrap gap-2">
                {showOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="px-4 py-2 bg-neural-blue/20 border border-neural-blue/30 rounded-full text-sm text-white hover:bg-neural-blue/30 transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Text Input */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder="Type your response or choose an option above..."
                className="w-full bg-black/30 border border-gray-600 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-neural-blue focus:outline-none"
              />
              <button
                onClick={handleInputSubmit}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-neural-blue rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neural-blue/80 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400">
              💡 Tip: Be honest and authentic - Nova adapts to your unique personality!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
