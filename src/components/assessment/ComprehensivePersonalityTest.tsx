'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Star, 
  Heart, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface PersonalityTestProps {
  onComplete: (results: {
    bigFive: BigFiveResults;
    jungTypology: JungTypologyResults;
    workStyle: WorkStyleResults;
  }) => void;
}

interface BigFiveResults {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  traits: string[];
}

interface JungTypologyResults {
  extraversion: number;
  thinking: number;
  sensing: number;
  judging: number;
  type: string;
  description: string;
}

interface WorkStyleResults {
  leadership: number;
  collaboration: number;
  innovation: number;
  structure: number;
  riskTolerance: number;
  communicationStyle: string;
  motivationDrivers: string[];
}

export default function ComprehensivePersonalityTest({ onComplete }: PersonalityTestProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [bigFiveResponses, setBigFiveResponses] = useState<number[]>([]);
  const [jungResponses, setJungResponses] = useState<number[]>([]);
  const [workStyleResponses, setWorkStyleResponses] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const sections = [
    { id: 'big-five', title: 'Personality Traits', icon: Users, color: 'from-blue-500 to-purple-600' },
    { id: 'jung-typology', title: 'Work Preferences', icon: Star, color: 'from-purple-500 to-pink-600' },
    { id: 'work-style', title: 'Professional Style', icon: Target, color: 'from-pink-500 to-red-600' }
  ];

  // Comprehensive Big Five Questions (10 per trait = 50 total)
  const bigFiveQuestions = [
    // Openness to Experience (10 questions)
    { text: "I enjoy exploring new ideas and concepts", trait: 'openness', reverse: false },
    { text: "I prefer familiar routines over new experiences", trait: 'openness', reverse: true },
    { text: "I'm curious about how things work", trait: 'openness', reverse: false },
    { text: "I like to experiment with new approaches to problems", trait: 'openness', reverse: false },
    { text: "I enjoy abstract thinking and theoretical concepts", trait: 'openness', reverse: false },
    { text: "I prefer practical, concrete solutions over theoretical ones", trait: 'openness', reverse: true },
    { text: "I'm interested in art, music, or creative expression", trait: 'openness', reverse: false },
    { text: "I enjoy learning about different cultures and perspectives", trait: 'openness', reverse: false },
    { text: "I like to question conventional wisdom", trait: 'openness', reverse: false },
    { text: "I prefer tried-and-true methods over innovative approaches", trait: 'openness', reverse: true },

    // Conscientiousness (10 questions)
    { text: "I always complete tasks on time", trait: 'conscientiousness', reverse: false },
    { text: "I often leave things until the last minute", trait: 'conscientiousness', reverse: true },
    { text: "I pay close attention to details", trait: 'conscientiousness', reverse: false },
    { text: "I keep my workspace organized and tidy", trait: 'conscientiousness', reverse: false },
    { text: "I set clear goals and work systematically toward them", trait: 'conscientiousness', reverse: false },
    { text: "I often forget appointments or deadlines", trait: 'conscientiousness', reverse: true },
    { text: "I double-check my work for errors", trait: 'conscientiousness', reverse: false },
    { text: "I prefer to plan ahead rather than be spontaneous", trait: 'conscientiousness', reverse: false },
    { text: "I follow through on my commitments", trait: 'conscientiousness', reverse: false },
    { text: "I tend to be careless with my belongings", trait: 'conscientiousness', reverse: true },

    // Extraversion (10 questions)
    { text: "I enjoy being the center of attention", trait: 'extraversion', reverse: false },
    { text: "I prefer working alone to working in groups", trait: 'extraversion', reverse: true },
    { text: "I feel energized by social interactions", trait: 'extraversion', reverse: false },
    { text: "I'm comfortable speaking in front of large groups", trait: 'extraversion', reverse: false },
    { text: "I enjoy meeting new people", trait: 'extraversion', reverse: false },
    { text: "I prefer quiet, solitary activities", trait: 'extraversion', reverse: true },
    { text: "I'm often the one to start conversations", trait: 'extraversion', reverse: false },
    { text: "I feel drained after social events", trait: 'extraversion', reverse: true },
    { text: "I'm assertive in expressing my opinions", trait: 'extraversion', reverse: false },
    { text: "I prefer small, intimate gatherings to large parties", trait: 'extraversion', reverse: true },

    // Agreeableness (10 questions)
    { text: "I try to help others when I can", trait: 'agreeableness', reverse: false },
    { text: "I tend to be skeptical of others' motives", trait: 'agreeableness', reverse: true },
    { text: "I avoid conflicts when possible", trait: 'agreeableness', reverse: false },
    { text: "I'm generally trusting of other people", trait: 'agreeableness', reverse: false },
    { text: "I enjoy cooperating with others", trait: 'agreeableness', reverse: false },
    { text: "I tend to be competitive rather than cooperative", trait: 'agreeableness', reverse: true },
    { text: "I'm sympathetic to others' problems", trait: 'agreeableness', reverse: false },
    { text: "I prefer to put my own interests first", trait: 'agreeableness', reverse: true },
    { text: "I'm forgiving when others make mistakes", trait: 'agreeableness', reverse: false },
    { text: "I tend to be critical of others", trait: 'agreeableness', reverse: true },

    // Neuroticism (10 questions)
    { text: "I often feel anxious or worried", trait: 'neuroticism', reverse: false },
    { text: "I remain calm under pressure", trait: 'neuroticism', reverse: true },
    { text: "I get upset easily", trait: 'neuroticism', reverse: false },
    { text: "I handle stress well", trait: 'neuroticism', reverse: true },
    { text: "I worry about things that might go wrong", trait: 'neuroticism', reverse: false },
    { text: "I'm generally optimistic about the future", trait: 'neuroticism', reverse: true },
    { text: "I get frustrated when things don't go as planned", trait: 'neuroticism', reverse: false },
    { text: "I bounce back quickly from setbacks", trait: 'neuroticism', reverse: true },
    { text: "I tend to overthink situations", trait: 'neuroticism', reverse: false },
    { text: "I maintain emotional balance in difficult situations", trait: 'neuroticism', reverse: true }
  ];

  // Comprehensive Jung Typology Scenarios (10 scenarios)
  const jungScenarios = [
    {
      question: "You're leading an AI project team. How do you prefer to approach the initial planning phase?",
      options: [
        { text: "Organize a brainstorming session with the whole team", extraversion: 10, thinking: -5, sensing: 0, judging: 5 },
        { text: "Research best practices and create a detailed plan first", extraversion: -10, thinking: 10, sensing: 5, judging: 10 },
        { text: "Start with a small prototype to test concepts", extraversion: 0, thinking: 5, sensing: 10, judging: -10 },
        { text: "Explore innovative approaches and possibilities", extraversion: 0, thinking: 0, sensing: -10, judging: -5 }
      ]
    },
    {
      question: "When making decisions about cybersecurity protocols, you tend to:",
      options: [
        { text: "Focus on logical analysis and data-driven evidence", extraversion: 0, thinking: 10, sensing: 5, judging: 5 },
        { text: "Consider the human impact and team morale", extraversion: 5, thinking: -10, sensing: 0, judging: 0 },
        { text: "Trust your intuition and past experience", extraversion: 0, thinking: 0, sensing: -10, judging: -5 },
        { text: "Follow established industry best practices", extraversion: 0, thinking: 5, sensing: 10, judging: 10 }
      ]
    },
    {
      question: "In a team meeting about AI ethics, you're most likely to:",
      options: [
        { text: "Lead the discussion and share ideas openly", extraversion: 10, thinking: 0, sensing: 0, judging: 0 },
        { text: "Listen carefully and contribute thoughtful insights", extraversion: -10, thinking: 5, sensing: 0, judging: 0 },
        { text: "Focus on practical implementation details", extraversion: 0, thinking: 5, sensing: 10, judging: 5 },
        { text: "Explore theoretical implications and future possibilities", extraversion: 0, thinking: 0, sensing: -10, judging: -5 }
      ]
    },
    {
      question: "When learning new technology, you prefer to:",
      options: [
        { text: "Jump in and learn by doing hands-on projects", extraversion: 5, thinking: 0, sensing: 10, judging: -10 },
        { text: "Read documentation and understand theory first", extraversion: -5, thinking: 10, sensing: -5, judging: 10 },
        { text: "Find patterns and connections to what you already know", extraversion: 0, thinking: 5, sensing: -5, judging: 0 },
        { text: "Experiment freely and see what's possible", extraversion: 0, thinking: 0, sensing: 0, judging: -10 }
      ]
    },
    {
      question: "Your ideal work environment for a tech career would be:",
      options: [
        { text: "Open office with lots of collaboration and energy", extraversion: 10, thinking: 0, sensing: 5, judging: 0 },
        { text: "Quiet space where I can focus deeply on complex problems", extraversion: -10, thinking: 5, sensing: 0, judging: 5 },
        { text: "Flexible environment that adapts to different project needs", extraversion: 0, thinking: 0, sensing: 0, judging: -10 },
        { text: "Structured environment with clear processes and expectations", extraversion: 0, thinking: 5, sensing: 5, judging: 10 }
      ]
    },
    {
      question: "When facing a complex cybersecurity threat, your first instinct is to:",
      options: [
        { text: "Gather the team and brainstorm solutions together", extraversion: 10, thinking: -5, sensing: 0, judging: 0 },
        { text: "Analyze the threat systematically using established frameworks", extraversion: 0, thinking: 10, sensing: 5, judging: 10 },
        { text: "Trust your experience and act quickly", extraversion: 0, thinking: 0, sensing: 5, judging: -5 },
        { text: "Consider multiple scenarios and potential implications", extraversion: 0, thinking: 5, sensing: -10, judging: 0 }
      ]
    },
    {
      question: "In your ideal AI/tech role, you would spend most time:",
      options: [
        { text: "Collaborating with diverse teams on innovative solutions", extraversion: 10, thinking: 0, sensing: 0, judging: 0 },
        { text: "Deep-diving into technical problems and finding optimal solutions", extraversion: -10, thinking: 10, sensing: 5, judging: 5 },
        { text: "Building practical applications that solve real-world problems", extraversion: 0, thinking: 5, sensing: 10, judging: 5 },
        { text: "Exploring cutting-edge possibilities and future technologies", extraversion: 0, thinking: 0, sensing: -10, judging: -10 }
      ]
    },
    {
      question: "When presenting technical concepts to non-technical stakeholders, you:",
      options: [
        { text: "Enjoy the interaction and adapt your style to the audience", extraversion: 10, thinking: -5, sensing: 0, judging: 0 },
        { text: "Focus on logical explanations with clear evidence", extraversion: 0, thinking: 10, sensing: 5, judging: 5 },
        { text: "Use concrete examples and practical demonstrations", extraversion: 0, thinking: 0, sensing: 10, judging: 0 },
        { text: "Paint a vision of possibilities and potential impact", extraversion: 0, thinking: 0, sensing: -10, judging: -5 }
      ]
    },
    {
      question: "Your approach to staying current with rapidly evolving tech trends is to:",
      options: [
        { text: "Join communities and discuss trends with peers", extraversion: 10, thinking: 0, sensing: 0, judging: 0 },
        { text: "Systematically research and analyze new developments", extraversion: -5, thinking: 10, sensing: 0, judging: 10 },
        { text: "Focus on trends that have practical applications", extraversion: 0, thinking: 5, sensing: 10, judging: 5 },
        { text: "Explore emerging possibilities and experimental technologies", extraversion: 0, thinking: 0, sensing: -10, judging: -10 }
      ]
    },
    {
      question: "When debugging complex code or investigating security incidents, you:",
      options: [
        { text: "Discuss the problem with colleagues to get different perspectives", extraversion: 10, thinking: 0, sensing: 0, judging: 0 },
        { text: "Methodically work through the problem using logical analysis", extraversion: -5, thinking: 10, sensing: 5, judging: 10 },
        { text: "Draw on past experience and proven troubleshooting methods", extraversion: 0, thinking: 5, sensing: 10, judging: 5 },
        { text: "Try creative approaches and think outside the box", extraversion: 0, thinking: 0, sensing: -10, judging: -10 }
      ]
    }
  ];

  // Work Style Assessment Questions (15 questions)
  const workStyleQuestions = [
    { text: "I prefer to lead projects rather than follow others' direction", category: 'leadership' },
    { text: "I work best when I can collaborate closely with team members", category: 'collaboration' },
    { text: "I enjoy finding innovative solutions to traditional problems", category: 'innovation' },
    { text: "I prefer structured processes and clear guidelines", category: 'structure' },
    { text: "I'm comfortable taking calculated risks for potential rewards", category: 'riskTolerance' },
    { text: "I like to mentor and guide junior team members", category: 'leadership' },
    { text: "I thrive in team-based environments", category: 'collaboration' },
    { text: "I often suggest new ways of doing things", category: 'innovation' },
    { text: "I appreciate having clear deadlines and expectations", category: 'structure' },
    { text: "I'm willing to try unproven technologies if they show promise", category: 'riskTolerance' },
    { text: "I enjoy taking responsibility for project outcomes", category: 'leadership' },
    { text: "I prefer consensus-building over individual decision-making", category: 'collaboration' },
    { text: "I get excited about disruptive technologies", category: 'innovation' },
    { text: "I work best with established workflows and procedures", category: 'structure' },
    { text: "I'm comfortable with uncertainty and ambiguous situations", category: 'riskTolerance' }
  ];

  const handleBigFiveResponse = (rating: number) => {
    const newResponses = [...bigFiveResponses, rating];
    setBigFiveResponses(newResponses);

    if (currentQuestion < bigFiveQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate Big Five scores
      const scores = calculateBigFiveScores(newResponses);
      setCurrentSection(1);
      setCurrentQuestion(0);
    }
  };

  const handleJungResponse = (optionIndex: number) => {
    const newResponses = [...jungResponses, optionIndex];
    setJungResponses(newResponses);

    if (currentQuestion < jungScenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate Jung scores
      const jungResults = calculateJungScores(newResponses);
      setCurrentSection(2);
      setCurrentQuestion(0);
    }
  };

  const handleWorkStyleResponse = (rating: number) => {
    const newResponses = [...workStyleResponses, rating];
    setWorkStyleResponses(newResponses);

    if (currentQuestion < workStyleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate work style scores and complete assessment
      const workStyleResults = calculateWorkStyleScores(newResponses);
      const bigFiveResults = calculateBigFiveScores(bigFiveResponses);
      const jungResults = calculateJungScores(jungResponses);
      
      onComplete({
        bigFive: bigFiveResults,
        jungTypology: jungResults,
        workStyle: workStyleResults
      });
    }
  };

  const calculateBigFiveScores = (responses: number[]): BigFiveResults => {
    const scores = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    };

    responses.forEach((rating, index) => {
      const question = bigFiveQuestions[index];
      const adjustedRating = question.reverse ? 6 - rating : rating;
      const impact = (adjustedRating - 3) * 5; // Scale to -10 to +10
      
      scores[question.trait as keyof typeof scores] += impact;
    });

    // Ensure scores are within 0-100 range
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.max(0, Math.min(100, scores[key as keyof typeof scores]));
    });

    // Determine key traits
    const traits = [];
    if (scores.openness > 65) traits.push('Creative');
    if (scores.conscientiousness > 65) traits.push('Organized');
    if (scores.extraversion > 65) traits.push('Outgoing');
    if (scores.agreeableness > 65) traits.push('Cooperative');
    if (scores.neuroticism < 35) traits.push('Emotionally Stable');

    return { ...scores, traits };
  };

  const calculateJungScores = (responses: number[]): JungTypologyResults => {
    let extraversion = 50, thinking = 50, sensing = 50, judging = 50;
    
    responses.forEach((responseIndex, scenarioIndex) => {
      const option = jungScenarios[scenarioIndex].options[responseIndex];
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

    const typeDescriptions: { [key: string]: string } = {
      'INTJ': 'The Architect - Strategic, independent, and focused on long-term goals',
      'INTP': 'The Thinker - Analytical, curious, and driven by understanding',
      'ENTJ': 'The Commander - Natural leader, strategic, and results-oriented',
      'ENTP': 'The Debater - Innovative, enthusiastic, and loves exploring possibilities',
      'INFJ': 'The Advocate - Insightful, principled, and focused on helping others',
      'INFP': 'The Mediator - Creative, idealistic, and values-driven',
      'ENFJ': 'The Protagonist - Charismatic, inspiring, and people-focused',
      'ENFP': 'The Campaigner - Enthusiastic, creative, and socially confident',
      'ISTJ': 'The Logistician - Practical, reliable, and detail-oriented',
      'ISFJ': 'The Protector - Caring, responsible, and service-oriented',
      'ESTJ': 'The Executive - Organized, practical, and results-focused',
      'ESFJ': 'The Consul - Supportive, organized, and people-oriented',
      'ISTP': 'The Virtuoso - Practical, hands-on, and adaptable',
      'ISFP': 'The Adventurer - Flexible, creative, and values personal freedom',
      'ESTP': 'The Entrepreneur - Energetic, practical, and action-oriented',
      'ESFP': 'The Entertainer - Enthusiastic, spontaneous, and people-focused'
    };

    return {
      extraversion: Math.max(0, Math.min(100, extraversion)),
      thinking: Math.max(0, Math.min(100, thinking)),
      sensing: Math.max(0, Math.min(100, sensing)),
      judging: Math.max(0, Math.min(100, judging)),
      type,
      description: typeDescriptions[type] || 'Unique personality type'
    };
  };

  const calculateWorkStyleScores = (responses: number[]): WorkStyleResults => {
    const categoryScores = {
      leadership: [],
      collaboration: [],
      innovation: [],
      structure: [],
      riskTolerance: []
    };

    responses.forEach((rating, index) => {
      const question = workStyleQuestions[index];
      categoryScores[question.category as keyof typeof categoryScores].push(rating);
    });

    const averageScores = {
      leadership: Math.round(categoryScores.leadership.reduce((a, b) => a + b, 0) / categoryScores.leadership.length * 20),
      collaboration: Math.round(categoryScores.collaboration.reduce((a, b) => a + b, 0) / categoryScores.collaboration.length * 20),
      innovation: Math.round(categoryScores.innovation.reduce((a, b) => a + b, 0) / categoryScores.innovation.length * 20),
      structure: Math.round(categoryScores.structure.reduce((a, b) => a + b, 0) / categoryScores.structure.length * 20),
      riskTolerance: Math.round(categoryScores.riskTolerance.reduce((a, b) => a + b, 0) / categoryScores.riskTolerance.length * 20)
    };

    // Determine communication style and motivation drivers
    const communicationStyle = averageScores.collaboration > 70 ? 'Collaborative' : 
                              averageScores.leadership > 70 ? 'Directive' : 'Balanced';
    
    const motivationDrivers = [];
    if (averageScores.leadership > 65) motivationDrivers.push('Leadership');
    if (averageScores.innovation > 65) motivationDrivers.push('Innovation');
    if (averageScores.collaboration > 65) motivationDrivers.push('Teamwork');
    if (averageScores.structure > 65) motivationDrivers.push('Organization');

    return {
      ...averageScores,
      communicationStyle,
      motivationDrivers
    };
  };

  const renderCurrentSection = () => {
    const section = sections[currentSection];
    
    switch (section.id) {
      case 'big-five':
        return renderBigFiveSection();
      case 'jung-typology':
        return renderJungSection();
      case 'work-style':
        return renderWorkStyleSection();
      default:
        return null;
    }
  };

  const renderBigFiveSection = () => {
    const question = bigFiveQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / bigFiveQuestions.length) * 100;

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Personality Traits Assessment</h2>
          <p className="text-gray-300 mb-4">Rate how much you agree with each statement (1 = Strongly Disagree, 5 = Strongly Agree)</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {bigFiveQuestions.length}</span>
            <span className="text-sm text-blue-400">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl text-white mb-6">{question.text}</h3>
          
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                onClick={() => handleBigFiveResponse(rating)}
                className="w-16 h-16 rounded-full border-2 border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 text-white font-semibold transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {rating}
              </motion.button>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 mt-4 max-w-md mx-auto">
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      </div>
    );
  };

  const renderJungSection = () => {
    const scenario = jungScenarios[currentQuestion];
    const progress = ((currentQuestion + 1) / jungScenarios.length) * 100;

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Work Preferences Assessment</h2>
          <p className="text-gray-300 mb-4">Choose the option that best describes your natural work style</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Scenario {currentQuestion + 1} of {jungScenarios.length}</span>
            <span className="text-sm text-purple-400">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl text-white mb-6">{scenario.question}</h3>
          
          <div className="space-y-4">
            {scenario.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleJungResponse(index)}
                className="w-full p-4 rounded-lg border-2 border-gray-600 hover:border-purple-400 hover:bg-purple-400/10 text-left text-white transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.text}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWorkStyleSection = () => {
    const question = workStyleQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / workStyleQuestions.length) * 100;

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Professional Style Assessment</h2>
          <p className="text-gray-300 mb-4">Rate how well each statement describes your work preferences</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {workStyleQuestions.length}</span>
            <span className="text-sm text-pink-400">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl text-white mb-6">{question.text}</h3>
          
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                onClick={() => handleWorkStyleResponse(rating)}
                className="w-16 h-16 rounded-full border-2 border-gray-600 hover:border-pink-400 hover:bg-pink-400/10 text-white font-semibold transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {rating}
              </motion.button>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 mt-4 max-w-md mx-auto">
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Section Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Comprehensive Personality Assessment</h1>
            <span className="text-sm text-gray-300">Section {currentSection + 1} of {sections.length}</span>
          </div>
          
          <div className="flex space-x-4 mb-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = index === currentSection;
              const isCompleted = index < currentSection;
              
              return (
                <div
                  key={section.id}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    isActive ? 'border-blue-400 bg-blue-400/10' :
                    isCompleted ? 'border-green-400 bg-green-400/10' :
                    'border-gray-600 bg-gray-600/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-400' :
                      isCompleted ? 'text-green-400' :
                      'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-400' :
                      isCompleted ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      {section.title}
                    </span>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Section Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSection}-${currentQuestion}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
