'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Zap, 
  MessageCircle,
  CheckCircle,
  Timer,
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import { 
  CognitiveAssessmentResults, 
  CognitiveQuestionResponse, 
  EducationLevel,
  QuestionCategory,
  QuestionDifficulty,
  CognitiveQuestion
} from '../../lib/supabase-types';

interface GeneralizedCognitiveTestProps {
  educationLevel: EducationLevel;
  onComplete: (results: CognitiveAssessmentResults) => void;
}

interface TestResult {
  category: QuestionCategory;
  score: number;
  completionTime: number;
  correctAnswers: number;
  totalQuestions: number;
  responses: CognitiveQuestionResponse[];
}

// Generalized question bank - no technical/domain-specific content
const QUESTION_BANK: Record<QuestionCategory, CognitiveQuestion[]> = {
  logical: [
    {
      id: 'logical_1',
      category: 'logical',
      difficulty: 'easy',
      question: 'What comes next in this sequence: 2, 6, 18, 54, ?',
      options: ['108', '162', '216', '324'],
      correct_answer: '162',
      explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_2',
      category: 'logical',
      difficulty: 'medium',
      question: 'If all roses are flowers and some flowers are red, which statement must be true?',
      options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
      correct_answer: 'Cannot be determined',
      explanation: 'We know roses are flowers and some flowers are red, but we cannot determine if any roses are among the red flowers',
      education_level: ['o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_3',
      category: 'logical',
      difficulty: 'easy',
      question: 'Complete the pattern: ○ △ ○ △ ○ ?',
      options: ['○', '△', '□', '◇'],
      correct_answer: '△',
      explanation: 'The pattern alternates between circle (○) and triangle (△)',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_4',
      category: 'logical',
      difficulty: 'hard',
      question: 'In a group of people, if everyone who likes tea also likes coffee, and Maria likes tea, what can we conclude?',
      options: ['Maria likes coffee', 'Maria might like coffee', 'Maria doesn\'t like coffee', 'Cannot be determined'],
      correct_answer: 'Maria likes coffee',
      explanation: 'Since everyone who likes tea also likes coffee, and Maria likes tea, she must also like coffee',
      education_level: ['a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_5',
      category: 'logical',
      difficulty: 'medium',
      question: 'Which shape comes next in the sequence: ■ ● ▲ ■ ● ?',
      options: ['▲', '■', '●', '◆'],
      correct_answer: '▲',
      explanation: 'The pattern repeats every 3 shapes: square, circle, triangle',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_6',
      category: 'logical',
      difficulty: 'easy',
      question: 'If A is taller than B, and B is taller than C, who is the shortest?',
      options: ['A', 'B', 'C', 'Cannot tell'],
      correct_answer: 'C',
      explanation: 'Since A > B > C in height, C is the shortest',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'logical_7',
      category: 'logical',
      difficulty: 'hard',
      question: 'What number should replace the question mark: 4, 9, 16, 25, ?',
      options: ['30', '36', '49', '64'],
      correct_answer: '36',
      explanation: 'These are perfect squares: 2², 3², 4², 5², 6² = 36',
      education_level: ['o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    }
  ],
  numerical: [
    {
      id: 'numerical_1',
      category: 'numerical',
      difficulty: 'easy',
      question: 'What is 15% of 200?',
      correct_answer: 30,
      explanation: '15% = 15/100 = 0.15, so 0.15 × 200 = 30',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_2',
      category: 'numerical',
      difficulty: 'medium',
      question: 'If 3 books cost $15, how much do 7 books cost?',
      correct_answer: 35,
      explanation: 'Each book costs $5 ($15 ÷ 3), so 7 books cost 7 × $5 = $35',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_3',
      category: 'numerical',
      difficulty: 'medium',
      question: 'What is the next number in the sequence: 1, 4, 9, 16, 25, ?',
      correct_answer: 36,
      explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6² = 36',
      education_level: ['o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_4',
      category: 'numerical',
      difficulty: 'hard',
      question: 'A store offers a 20% discount, then adds 8% tax. What is the final price of a $100 item?',
      correct_answer: 86.4,
      explanation: 'After 20% discount: $80. After 8% tax: $80 × 1.08 = $86.40',
      education_level: ['a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_5',
      category: 'numerical',
      difficulty: 'easy',
      question: 'What is 8 × 7?',
      correct_answer: 56,
      explanation: '8 × 7 = 56',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_6',
      category: 'numerical',
      difficulty: 'medium',
      question: 'If a train travels 120 km in 2 hours, what is its average speed in km/h?',
      correct_answer: 60,
      explanation: 'Speed = Distance ÷ Time = 120 km ÷ 2 hours = 60 km/h',
      education_level: ['o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'numerical_7',
      category: 'numerical',
      difficulty: 'hard',
      question: 'What is 2³ + 3² - 4¹?',
      correct_answer: 13,
      explanation: '2³ = 8, 3² = 9, 4¹ = 4, so 8 + 9 - 4 = 13',
      education_level: ['a-level', 'undergraduate', 'masters', 'phd']
    }
  ],
  verbal: [
    {
      id: 'verbal_1',
      category: 'verbal',
      difficulty: 'easy',
      question: 'Choose the word that best completes the analogy: Book is to Library as Car is to:',
      options: ['Road', 'Garage', 'Driver', 'Engine'],
      correct_answer: 'Garage',
      explanation: 'A book is stored in a library, just as a car is stored in a garage',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'verbal_2',
      category: 'verbal',
      difficulty: 'medium',
      question: 'Which word is most opposite in meaning to "abundant"?',
      options: ['Plentiful', 'Scarce', 'Numerous', 'Ample'],
      correct_answer: 'Scarce',
      explanation: 'Abundant means plentiful or existing in large quantities, while scarce means insufficient or rare',
      education_level: ['o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'verbal_3',
      category: 'verbal',
      difficulty: 'easy',
      question: 'Complete the sentence: "The weather was so cold that the lake ___"',
      options: ['melted', 'froze', 'evaporated', 'warmed'],
      correct_answer: 'froze',
      explanation: 'Cold weather causes water to freeze, not melt, evaporate, or warm',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'verbal_4',
      category: 'verbal',
      difficulty: 'hard',
      question: 'Choose the word that best fits: "Her argument was so _____ that even her critics were convinced."',
      options: ['weak', 'compelling', 'confusing', 'brief'],
      correct_answer: 'compelling',
      explanation: 'A compelling argument is persuasive and convincing, which would convince even critics',
      education_level: ['a-level', 'undergraduate', 'masters', 'phd']
    }
  ],
  memory: [
    {
      id: 'memory_1',
      category: 'memory',
      difficulty: 'easy',
      question: 'Remember this sequence: 3, 7, 1, 9. What was the second number?',
      correct_answer: 7,
      explanation: 'The sequence was 3, 7, 1, 9, so the second number was 7',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'memory_2',
      category: 'memory',
      difficulty: 'medium',
      question: 'Study these words for 5 seconds: CAT, TREE, BLUE, HAPPY. Which word was third?',
      correct_answer: 'BLUE',
      explanation: 'The sequence was CAT, TREE, BLUE, HAPPY, so BLUE was the third word',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    }
  ],
  processing: [
    {
      id: 'processing_1',
      category: 'processing',
      difficulty: 'easy',
      question: 'How many vowels are in the word "EDUCATION"?',
      correct_answer: 5,
      explanation: 'E-D-U-C-A-T-I-O-N contains vowels: E, U, A, I, O (5 vowels)',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    },
    {
      id: 'processing_2',
      category: 'processing',
      difficulty: 'medium',
      question: 'Count the number of times the letter "T" appears in: "THE CAT SAT ON THE MAT"',
      correct_answer: 4,
      explanation: 'T appears in: THE (1), CAT (1), SAT (1), THE (1), MAT (1) = 5 times total, but "THE" appears twice so T appears 4 times',
      education_level: ['primary', 'o-level', 'a-level', 'undergraduate', 'masters', 'phd']
    }
  ]
};

export default function GeneralizedCognitiveTest({ educationLevel, onComplete }: GeneralizedCognitiveTestProps) {
  const [currentTest, setCurrentTest] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [startTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const tests = [
    { id: 'logical', title: 'Logical Reasoning', icon: Brain, color: 'from-blue-500 to-purple-600' },
    { id: 'numerical', title: 'Numerical Reasoning', icon: Target, color: 'from-green-500 to-blue-500' },
    { id: 'verbal', title: 'Verbal Reasoning', icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
    { id: 'memory', title: 'Working Memory', icon: Zap, color: 'from-yellow-500 to-orange-500' }
  ];

  const handleTestComplete = (result: TestResult) => {
    const newResults = [...testResults, result];
    setTestResults(newResults);

    if (currentTest < tests.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      // All tests completed
      const cognitiveResults = calculateCognitiveResults(newResults);
      setShowResults(true);
      setTimeout(() => onComplete(cognitiveResults), 2000);
    }
  };

  const calculateCognitiveResults = (results: TestResult[]): CognitiveAssessmentResults => {
    const scores = {
      logical_reasoning: 0,
      numerical_reasoning: 0,
      verbal_reasoning: 0,
      working_memory: 0,
      processing_speed: 0,
      overall: 0
    };

    const allResponses: CognitiveQuestionResponse[] = [];

    results.forEach(result => {
      const categoryKey = result.category === 'logical' ? 'logical_reasoning' :
                         result.category === 'numerical' ? 'numerical_reasoning' :
                         result.category === 'verbal' ? 'verbal_reasoning' :
                         result.category === 'memory' ? 'working_memory' :
                         'processing_speed';
      
      scores[categoryKey] = result.score;
      allResponses.push(...result.responses);
    });

    scores.overall = Math.round(Object.values(scores).filter(s => s > 0).reduce((a, b) => a + b, 0) / results.length);

    // Determine strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    Object.entries(scores).forEach(([key, score]) => {
      if (key === 'overall') return;
      
      const displayName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (score >= 80) {
        strengths.push(displayName);
      } else if (score < 60) {
        weaknesses.push(displayName);
      }
    });

    // Determine recommended learning style based on performance
    let recommendedStyle = 'Visual';
    if (scores.verbal_reasoning > scores.numerical_reasoning) {
      recommendedStyle = 'Auditory';
    } else if (scores.working_memory > 75) {
      recommendedStyle = 'Kinesthetic';
    }

    return {
      sessionId,
      userId: '', // Will be set by parent component
      educationLevel,
      responses: allResponses,
      scores,
      analysis: {
        strengths,
        weaknesses,
        recommended_learning_style: recommendedStyle
      },
      completionTime: Date.now() - startTime
    };
  };

  if (showResults) {
    return <CognitiveResultsDisplay results={calculateCognitiveResults(testResults)} />;
  }

  const currentTestData = tests[currentTest];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Test Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Cognitive Assessment</h1>
            <span className="text-sm text-gray-300">Test {currentTest + 1} of {tests.length}</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentTest + 1) / tests.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Test Selection Grid */}
          <div className="grid grid-cols-4 gap-4">
            {tests.map((test, index) => {
              const Icon = test.icon;
              const isActive = index === currentTest;
              const isCompleted = testResults.some(r => r.category === test.id);
              const isLocked = index > currentTest;

              return (
                <div
                  key={test.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive ? 'border-blue-400 bg-blue-400/20' :
                    isCompleted ? 'border-green-400 bg-green-400/20' :
                    isLocked ? 'border-gray-600 bg-gray-600/10 opacity-50' :
                    'border-gray-600 bg-gray-600/10'
                  }`}
                >
                  <div className="text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      isActive ? 'text-blue-400' :
                      isCompleted ? 'text-green-400' :
                      'text-gray-400'
                    }`} />
                    <div className="text-xs text-white font-medium">{test.title}</div>
                    {isCompleted && (
                      <div className="text-xs text-green-400 mt-1">
                        {testResults.find(r => r.category === test.id)?.score}/100
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Test */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTest}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TestComponent
                category={currentTestData.id as QuestionCategory}
                educationLevel={educationLevel}
                sessionId={sessionId}
                onComplete={handleTestComplete}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Individual Test Component
function TestComponent({ 
  category, 
  educationLevel, 
  sessionId,
  onComplete 
}: { 
  category: QuestionCategory;
  educationLevel: EducationLevel;
  sessionId: string;
  onComplete: (result: TestResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [responses, setResponses] = useState<CognitiveQuestionResponse[]>([]);

  // Filter questions by education level and category
  const questions = QUESTION_BANK[category].filter(q => 
    q.education_level.includes(educationLevel)
  ).slice(0, 5); // Limit to 5 questions per category

  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer: string | number) => {
    const responseTime = Date.now() - questionStartTime;
    const isCorrect = answer.toString() === currentQ.correct_answer.toString();
    
    // Create response record
    const response: CognitiveQuestionResponse = {
      id: `${sessionId}_${currentQ.id}`,
      session_id: sessionId,
      question_id: currentQ.id,
      question_text: currentQ.question,
      question_category: category,
      difficulty_level: currentQ.difficulty,
      user_answer: answer.toString(),
      correct_answer: currentQ.correct_answer.toString(),
      is_correct: isCorrect,
      response_time: responseTime,
      question_order: currentQuestion,
      answered_at: new Date().toISOString()
    };

    setResponses([...responses, response]);
    setSelectedAnswer(answer.toString());
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setUserAnswer('');
        setShowResult(false);
        setQuestionStartTime(Date.now());
      } else {
        const finalScore = Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0));
        const finalResponses = [...responses, response];
        
        onComplete({
          category,
          score: finalScore,
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length,
          responses: finalResponses
        });
      }
    }, 2500);
  };

  const getCategoryTitle = (cat: QuestionCategory) => {
    switch (cat) {
      case 'logical': return 'Logical Reasoning';
      case 'numerical': return 'Numerical Reasoning';
      case 'verbal': return 'Verbal Reasoning';
      case 'memory': return 'Working Memory';
      case 'processing': return 'Processing Speed';
      default: return 'Assessment';
    }
  };

  const getCategoryColor = (cat: QuestionCategory) => {
    switch (cat) {
      case 'logical': return 'from-blue-500 to-purple-600';
      case 'numerical': return 'from-green-500 to-blue-500';
      case 'verbal': return 'from-purple-500 to-pink-500';
      case 'memory': return 'from-yellow-500 to-orange-500';
      case 'processing': return 'from-pink-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!currentQ) {
    return <div className="text-white text-center">No questions available for this level.</div>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{getCategoryTitle(category)}</h2>
          <div className="text-blue-400 font-semibold">Score: {score}</div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-blue-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`bg-gradient-to-r ${getCategoryColor(category)} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl text-white mb-6">{currentQ.question}</h3>
        
        {currentQ.options ? (
          // Multiple choice
          <div className="grid grid-cols-2 gap-4">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  showResult
                    ? option === currentQ.correct_answer.toString()
                      ? 'border-green-400 bg-green-400/20 text-white'
                      : option === selectedAnswer
                      ? 'border-red-500 bg-red-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/30 text-gray-400'
                    : 'border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 text-white'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>
        ) : (
          // Numerical input
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="number"
              step="0.01"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              disabled={showResult}
              className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white text-center focus:border-green-400 focus:outline-none"
            />
            <motion.button
              onClick={() => handleAnswer(parseFloat(userAnswer) || 0)}
              disabled={!userAnswer || showResult}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-semibold disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                (currentQ.options ? selectedAnswer === currentQ.correct_answer.toString() : 
                 Math.abs(parseFloat(userAnswer) - Number(currentQ.correct_answer)) < 0.01)
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <p className={`font-semibold mb-2 ${
                (currentQ.options ? selectedAnswer === currentQ.correct_answer.toString() : 
                 Math.abs(parseFloat(userAnswer) - Number(currentQ.correct_answer)) < 0.01)
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {(currentQ.options ? selectedAnswer === currentQ.correct_answer.toString() : 
                  Math.abs(parseFloat(userAnswer) - Number(currentQ.correct_answer)) < 0.01)
                  ? 'Correct! 🎉' 
                  : 'Not quite right 🤔'
                }
              </p>
              <p className="text-sm text-gray-300">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Cognitive Results Display Component
function CognitiveResultsDisplay({ results }: { results: CognitiveAssessmentResults }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center max-w-4xl mx-auto"
    >
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete! 🧠</h2>
      <p className="text-gray-300 mb-6">
        Excellent work! Your cognitive profile has been analyzed.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{results.scores.logical_reasoning}</div>
          <div className="text-xs text-gray-300">Logical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{results.scores.numerical_reasoning}</div>
          <div className="text-xs text-gray-300">Numerical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{results.scores.verbal_reasoning}</div>
          <div className="text-xs text-gray-300">Verbal</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{results.scores.working_memory}</div>
          <div className="text-xs text-gray-300">Memory</div>
        </div>
      </div>

      <div className="text-lg font-semibold text-white mb-2">
        Overall Score: {results.scores.overall}/100
      </div>
      
      {results.analysis.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-green-400 font-semibold mb-2">Cognitive Strengths:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {results.analysis.strengths.map((strength, index) => (
              <span key={index} className="px-3 py-1 bg-green-500/20 border border-green-400 rounded-full text-sm text-green-400">
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-400">
        Completion time: {Math.round(results.completionTime / 1000)} seconds
      </div>
      
      <div className="mt-4 text-sm text-blue-400">
        Recommended learning style: {results.analysis.recommended_learning_style}
      </div>
    </motion.div>
  );
}
