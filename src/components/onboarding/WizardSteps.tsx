'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Shield,
  Target,
  Code,
  Database,
  Globe,
  Zap,
  Star,
  Users,
  Trophy,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';
import ComprehensivePersonalityTest from '../assessment/ComprehensivePersonalityTest';
import ComprehensiveCognitiveTest from '../assessment/ComprehensiveCognitiveTest';
import { supabaseAssessmentService } from '../../lib/supabase';

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

// Basic Information Step Component
export function BasicInfoStep({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Personal Information</h2>
      <p className="text-gray-300 mb-8">Tell us about yourself to personalize your learning experience.</p>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">First Name</label>
            <input
              type="text"
              value={data.firstName || ''}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={data.lastName || ''}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Current Education Level</label>
          <select 
            value={data.educationLevel || ''}
            onChange={(e) => onUpdate({ educationLevel: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your education level</option>
            <option value="primary">Primary School</option>
            <option value="o_level">O-Level (Secondary)</option>
            <option value="a_level">A-Level (Advanced)</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="masters">Masters</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Location</label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onUpdate({ location: e.target.value })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Age Range</label>
            <select 
              value={data.ageRange || ''}
              onChange={(e) => onUpdate({ ageRange: e.target.value })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
            >
              <option value="">Select age range</option>
              <option value="under_18">Under 18</option>
              <option value="18_24">18-24</option>
              <option value="25_34">25-34</option>
              <option value="35_44">35-44</option>
              <option value="45_54">45-54</option>
              <option value="55_plus">55+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Cultural Background (Optional)</label>
          <input
            type="text"
            value={data.culturalBackground || ''}
            onChange={(e) => onUpdate({ culturalBackground: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
            placeholder="e.g., Zimbabwean, British, American"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Preferred Language</label>
          <select 
            value={data.preferredLanguage || 'en'}
            onChange={(e) => onUpdate({ preferredLanguage: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="pt">Portuguese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Cognitive Assessment Step Component
export function CognitiveAssessmentStep({ onStartGames }: { onStartGames: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Cognitive Assessment</h2>
      <p className="text-gray-300 mb-8">
        Complete fun, interactive brain games to evaluate your cognitive abilities.
        These games adapt to your education level and provide insights into your thinking style.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Brain className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Logic Games</h3>
          <p className="text-gray-300 text-sm">Pattern recognition and logical reasoning</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Target className="w-8 h-8 text-green-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Problem Solving</h3>
          <p className="text-gray-300 text-sm">Mathematical and analytical thinking</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <Zap className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">Memory Tasks</h3>
          <p className="text-gray-300 text-sm">Working memory and information processing</p>
        </div>
      </div>

      <motion.button
        onClick={onStartGames}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-8 py-4 rounded-full flex items-center space-x-2 mx-auto font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Start Brain Games! 🧩</span>
      </motion.button>
    </div>
  );
}

// Jung Typology Step Component
export function JungTypologyStep({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);

  const scenarios = [
    {
      question: "When learning a new subject, how do you prefer to approach it?",
      options: [
        { text: "Jump in and start exploring immediately", extraversion: 10, thinking: 0, sensing: 10, judging: 0 },
        { text: "Research and understand the theory first", extraversion: -10, thinking: 10, sensing: -10, judging: 10 },
        { text: "Discuss concepts with classmates or friends", extraversion: 10, thinking: -5, sensing: 0, judging: -5 },
        { text: "Create a structured study plan", extraversion: -5, thinking: 5, sensing: 5, judging: 10 }
      ]
    },
    {
      question: "When solving academic problems, you tend to:",
      options: [
        { text: "Focus on logical analysis and facts", extraversion: 0, thinking: 10, sensing: 5, judging: 5 },
        { text: "Consider different perspectives and viewpoints", extraversion: 5, thinking: -10, sensing: 0, judging: 0 },
        { text: "Trust your intuition and gut feeling", extraversion: 0, thinking: 0, sensing: -10, judging: -5 },
        { text: "Follow proven methods and techniques", extraversion: 0, thinking: 5, sensing: 10, judging: 10 }
      ]
    }
  ];

  const handleResponse = (optionIndex: number) => {
    const newResponses = [...responses, optionIndex];
    setResponses(newResponses);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      // Calculate final scores
      let extraversion = 50, thinking = 50, sensing = 50, judging = 50;
      
      newResponses.forEach((responseIndex, scenarioIndex) => {
        const option = scenarios[scenarioIndex].options[responseIndex];
        extraversion += option.extraversion;
        thinking += option.thinking;
        sensing += option.sensing;
        judging += option.judging;
      });

      // Determine type
      const E_I = extraversion > 50 ? 'E' : 'I';
      const T_F = thinking > 50 ? 'T' : 'F';
      const S_N = sensing > 50 ? 'S' : 'N';
      const J_P = judging > 50 ? 'J' : 'P';
      const type = E_I + S_N + T_F + J_P;

      onUpdate({
        extraversion: Math.max(0, Math.min(100, extraversion)),
        thinking: Math.max(0, Math.min(100, thinking)),
        sensing: Math.max(0, Math.min(100, sensing)),
        judging: Math.max(0, Math.min(100, judging)),
        type,
        description: `${type} personality type`
      });
    }
  };

  const isComplete = responses.length === scenarios.length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Personality Type Assessment</h2>
      <p className="text-gray-300 mb-8">
        Answer honestly about how you naturally prefer to behave in work situations.
      </p>

      {!isComplete ? (
        <div className="space-y-6">
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Question {currentScenario + 1} of {scenarios.length}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl text-white mb-6">{scenarios[currentScenario].question}</h3>
          
          <div className="space-y-4">
            {scenarios[currentScenario].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleResponse(index)}
                className="w-full p-4 rounded-lg border-2 border-gray-600 hover:border-cyan-400 hover:bg-cyan-400/10 text-left text-white transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.text}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Personality Type: {data.type}</h3>
          <p className="text-gray-300 mb-6">{data.description}</p>
        </div>
      )}
    </div>
  );
}

// Big Five Step Component
export function BigFiveStep({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [currentTrait, setCurrentTrait] = useState(0);
  const [traitScores, setTraitScores] = useState({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const traits = [
    {
      name: 'openness',
      title: 'Openness to Experience',
      description: 'Creativity, curiosity, and openness to new ideas',
      questions: [
        { text: "I enjoy exploring new ideas and concepts", reverse: false },
        { text: "I prefer familiar routines over new experiences", reverse: true },
        { text: "I'm curious about how things work", reverse: false }
      ]
    },
    {
      name: 'conscientiousness',
      title: 'Conscientiousness',
      description: 'Organization, discipline, and goal-oriented behavior',
      questions: [
        { text: "I always complete tasks on time", reverse: false },
        { text: "I often leave things until the last minute", reverse: true },
        { text: "I pay attention to details", reverse: false }
      ]
    }
  ];

  const handleResponse = (rating: number) => {
    const trait = traits[currentTrait];
    const question = trait.questions[currentQuestion];
    const adjustedRating = question.reverse ? 6 - rating : rating;
    
    const newScore = traitScores[trait.name as keyof typeof traitScores] + (adjustedRating - 3) * 10;
    const updatedScores = {
      ...traitScores,
      [trait.name]: Math.max(0, Math.min(100, newScore))
    };
    setTraitScores(updatedScores);

    if (currentQuestion < trait.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentTrait < traits.length - 1) {
      setCurrentTrait(currentTrait + 1);
      setCurrentQuestion(0);
    } else {
      // Assessment complete
      const traitsList = [];
      if (updatedScores.openness > 60) traitsList.push('Creative');
      if (updatedScores.conscientiousness > 60) traitsList.push('Organized');

      onUpdate({
        ...updatedScores,
        traits: traitsList
      });
    }
  };

  const isComplete = currentTrait >= traits.length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Personality Traits Assessment</h2>
      <p className="text-gray-300 mb-8">
        Rate how much you agree with each statement on a scale of 1-5.
      </p>

      {!isComplete ? (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">{traits[currentTrait].title}</h3>
            <p className="text-sm text-gray-300 mb-4">{traits[currentTrait].description}</p>
          </div>

          <h4 className="text-xl text-white mb-6">{traits[currentTrait].questions[currentQuestion].text}</h4>
          
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                onClick={() => handleResponse(rating)}
                className="w-16 h-16 rounded-full border-2 border-gray-600 hover:border-cyan-400 hover:bg-cyan-400/10 text-white font-semibold transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {rating}
              </motion.button>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Users className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Personality Profile Complete!</h3>
          <p className="text-gray-300 mb-6">Your personality traits have been analyzed.</p>
        </div>
      )}
    </div>
  );
}

// Learning Style Step Component with Supabase Integration
export function LearningStyleStep({ 
  data, 
  onUpdate, 
  assessmentData, 
  user, 
  onComplete 
}: { 
  data: any; 
  onUpdate: (data: any) => void;
  assessmentData?: any;
  user?: any;
  onComplete?: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleLearningStyleUpdate = (newData: any) => {
    onUpdate(newData);
    
    // Check if all required fields are filled
    const updatedData = { ...data, ...newData };
    if (updatedData.modality && updatedData.pace && updatedData.support) {
      setIsComplete(true);
      
      // Trigger API call and Supabase save after a short delay
      setTimeout(() => {
        processAssessmentResults(updatedData);
      }, 1000);
    }
  };

  const processAssessmentResults = async (learningData: any) => {
    if (!assessmentData || !user) return;
    
    setIsProcessing(true);
    
    try {
      // Call backend API for analysis
      const response = await fetch('/api/v1/assessment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assessmentData,
          learningStyle: learningData
        })
      });

      if (response.ok) {
        const analysisResults = await response.json();
        
        // Save results to Supabase
        const supabaseResult = await supabaseAssessmentService.saveAssessmentResults(
          user.id,
          user.emailAddresses?.[0]?.emailAddress || user.id,
          { ...assessmentData, learningStyle: learningData },
          analysisResults
        );

        if (supabaseResult.success) {
          console.log('Assessment results saved to Supabase successfully');
        } else {
          console.warn('Failed to save to Supabase:', supabaseResult.error);
        }

        // Update user metadata
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingCompleted: true,
            assessmentData: { ...assessmentData, learningStyle: learningData },
            analysisResults: analysisResults,
            completedAt: new Date().toISOString()
          }
        });

        // Trigger completion
        if (onComplete) {
          onComplete();
        }
      } else {
        throw new Error('API analysis failed');
      }
    } catch (error) {
      console.error('Assessment processing failed:', error);
      
      // Still proceed with completion even if API/Supabase fails
      if (onComplete) {
        onComplete();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-white mb-4">Processing Your Assessment...</h2>
        <p className="text-gray-300 mb-4">
          Analyzing your responses and saving results to create your personalized career roadmap.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <div>✓ Calling AI analysis API</div>
          <div>✓ Saving results to database</div>
          <div>✓ Preparing your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Learning Preferences</h2>
      <p className="text-gray-300 mb-8">Help us customize your learning experience. Once complete, we'll analyze your full assessment and prepare your personalized dashboard.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">Preferred Learning Style</label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { id: 'visual', title: 'Visual', desc: 'Charts, diagrams, 3D models' },
              { id: 'auditory', title: 'Auditory', desc: 'Voice explanations, discussions' },
              { id: 'kinesthetic', title: 'Hands-on', desc: 'Interactive labs, practice' },
              { id: 'reading', title: 'Reading/Writing', desc: 'Text, documentation, notes' }
            ].map((style) => (
              <motion.button
                key={style.id}
                onClick={() => handleLearningStyleUpdate({ modality: style.id })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.modality === style.id
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-white mb-1">{style.title}</h3>
                <p className="text-sm text-gray-300">{style.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Learning Pace</label>
          <select 
            value={data.pace}
            onChange={(e) => handleLearningStyleUpdate({ pace: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your preferred pace</option>
            <option value="self-paced">Self-paced (flexible)</option>
            <option value="structured">Structured (scheduled)</option>
            <option value="intensive">Intensive (accelerated)</option>
            <option value="part-time">Part-time (evenings/weekends)</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Support Level</label>
          <select 
            value={data.support}
            onChange={(e) => handleLearningStyleUpdate({ support: e.target.value })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">How much guidance do you prefer?</option>
            <option value="minimal">Minimal - I prefer to explore independently</option>
            <option value="moderate">Moderate - Some guidance and check-ins</option>
            <option value="high">High - Regular support and mentoring</option>
            <option value="intensive">Intensive - Constant guidance and feedback</option>
          </select>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-semibold">Learning preferences complete!</p>
            <p className="text-gray-300 text-sm">Processing your assessment results...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Results Step Component
export function ResultsStep({ data, onComplete }: { data: any; onComplete: () => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    analyzeAssessmentData();
  }, []);

  const analyzeAssessmentData = async () => {
    try {
      const response = await fetch('/api/v1/assessment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResults(result);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Use fallback results
      setAnalysisResults({
        personalityProfile: {
          jungType: 'ENFJ',
          jungDescription: 'The Protagonist - Charismatic and inspiring leader',
          keyTraits: ['Creative', 'Organized', 'Outgoing']
        },
        careerRecommendations: [
          {
            title: 'AI Product Manager',
            fitScore: 92,
            salary: '$120,000 - $200,000',
            skills: ['Product Strategy', 'AI/ML Understanding', 'Team Leadership']
          }
        ]
      });
    } finally {
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Profile...</h2>
        <p className="text-gray-300 mb-8">
          Our AI is processing your assessment data to create your personalized career roadmap.
        </p>
      </div>
    );
  }

  const topRecommendation = analysisResults?.careerRecommendations?.[0];

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
          Your Personalized Career Path
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Based on your assessment, we've created a customized learning journey 
          to help you achieve your career goals.
        </p>
      </motion.div>

      {topRecommendation && (
        <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8 text-left">
          <div className="flex items-center space-x-4 mb-6">
            <Brain className="w-12 h-12 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">{topRecommendation.title}</h2>
              <p className="text-cyan-400 font-semibold">{topRecommendation.salary}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Key Skills to Master</h3>
              <div className="space-y-2">
                {topRecommendation.skills?.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">Your Fit Score</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-2">{topRecommendation.fitScore}%</div>
              <p className="text-gray-300 text-sm">Excellent match for this career path!</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.button
        variants={fadeInUp}
        onClick={onComplete}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-8 py-4 rounded-full flex items-center space-x-2 mx-auto font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Enter Your Learning Journey</span>
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
