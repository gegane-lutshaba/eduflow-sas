'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text, Cylinder, Cone } from '@react-three/drei';
import { 
  Brain, 
  Target, 
  Zap, 
  Code, 
  Globe,
  CheckCircle,
  Timer,
  Star,
  Trophy,
  Play,
  RotateCcw
} from 'lucide-react';
import * as THREE from 'three';

interface CognitiveTestProps {
  educationLevel: 'primary' | 'high-school' | 'college' | 'professional';
  onComplete: (results: CognitiveResults) => void;
}

interface CognitiveResults {
  logicalReasoning: number;
  numericalReasoning: number;
  verbalReasoning: number;
  spatialReasoning: number;
  workingMemory: number;
  overallScore: number;
  completionTime: number;
  strengths: string[];
  weaknesses: string[];
}

interface TestResult {
  testId: string;
  score: number;
  completionTime: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function ComprehensiveCognitiveTest({ educationLevel, onComplete }: CognitiveTestProps) {
  const [currentTest, setCurrentTest] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [startTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);

  const tests = [
    { id: 'logical-reasoning', title: 'Logical Reasoning', icon: Brain, color: 'from-blue-500 to-purple-600' },
    { id: 'numerical-reasoning', title: 'Numerical Reasoning', icon: Target, color: 'from-green-500 to-blue-500' },
    { id: 'verbal-reasoning', title: 'Verbal Reasoning', icon: Globe, color: 'from-purple-500 to-pink-500' },
    { id: 'spatial-reasoning', title: 'Spatial Reasoning', icon: Code, color: 'from-pink-500 to-red-500' },
    { id: 'working-memory', title: 'Working Memory', icon: Zap, color: 'from-yellow-500 to-orange-500' }
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

  const calculateCognitiveResults = (results: TestResult[]): CognitiveResults => {
    const scores = {
      logicalReasoning: 0,
      numericalReasoning: 0,
      verbalReasoning: 0,
      spatialReasoning: 0,
      workingMemory: 0
    };

    results.forEach(result => {
      const testName = result.testId.replace('-', '');
      if (testName in scores) {
        scores[testName as keyof typeof scores] = result.score;
      }
    });

    const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
    const completionTime = Date.now() - startTime;

    // Determine strengths and weaknesses
    const strengths = [];
    const weaknesses = [];
    
    Object.entries(scores).forEach(([key, score]) => {
      if (score >= 80) {
        strengths.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      } else if (score < 60) {
        weaknesses.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });

    return {
      ...scores,
      overallScore,
      completionTime,
      strengths,
      weaknesses
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
            <h1 className="text-2xl font-bold text-white">Cognitive Assessment Battery</h1>
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
          <div className="grid grid-cols-5 gap-4">
            {tests.map((test, index) => {
              const Icon = test.icon;
              const isActive = index === currentTest;
              const isCompleted = testResults.some(r => r.testId === test.id);
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
                        {testResults.find(r => r.testId === test.id)?.score}/100
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
              {currentTestData.id === 'logical-reasoning' && (
                <LogicalReasoningTest 
                  educationLevel={educationLevel}
                  onComplete={handleTestComplete}
                />
              )}
              {currentTestData.id === 'numerical-reasoning' && (
                <NumericalReasoningTest 
                  educationLevel={educationLevel}
                  onComplete={handleTestComplete}
                />
              )}
              {currentTestData.id === 'verbal-reasoning' && (
                <VerbalReasoningTest 
                  educationLevel={educationLevel}
                  onComplete={handleTestComplete}
                />
              )}
              {currentTestData.id === 'spatial-reasoning' && (
                <SpatialReasoningTest 
                  educationLevel={educationLevel}
                  onComplete={handleTestComplete}
                />
              )}
              {currentTestData.id === 'working-memory' && (
                <WorkingMemory3DTest 
                  educationLevel={educationLevel}
                  onComplete={handleTestComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Logical Reasoning Test Component
function LogicalReasoningTest({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: TestResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const getQuestions = () => {
    const questions = [
      {
        question: "What comes next in this sequence: 2, 6, 18, 54, ?",
        options: ["108", "162", "216", "324"],
        correct: "162",
        explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
      },
      {
        question: "If all Bloops are Razzles and all Razzles are Lazzles, then:",
        options: ["All Bloops are Lazzles", "Some Lazzles are Bloops", "No Bloops are Lazzles", "Cannot be determined"],
        correct: "All Bloops are Lazzles",
        explanation: "This follows logical transitivity: Bloops → Razzles → Lazzles"
      },
      {
        question: "Complete the pattern: △ ○ △ ○ △ ?",
        options: ["△", "○", "□", "◇"],
        correct: "○",
        explanation: "The pattern alternates between triangle and circle"
      },
      {
        question: "If some programmers are creative and all creative people are innovative, then:",
        options: ["All programmers are innovative", "Some programmers are innovative", "No programmers are innovative", "Cannot be determined"],
        correct: "Some programmers are innovative",
        explanation: "Since some programmers are creative, and all creative people are innovative, some programmers must be innovative"
      },
      {
        question: "What number should replace the question mark? 4, 9, 16, 25, ?",
        options: ["30", "36", "42", "49"],
        correct: "36",
        explanation: "These are perfect squares: 2², 3², 4², 5², 6² = 36"
      }
    ];

    // Adapt based on education level
    if (educationLevel === 'primary') {
      return questions.slice(0, 3);
    } else if (educationLevel === 'high-school') {
      return questions.slice(0, 4);
    }
    return questions;
  };

  const questions = getQuestions();

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0));
        onComplete({
          testId: 'logical-reasoning',
          score: finalScore,
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length
        });
      }
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Logical Reasoning</h2>
          <div className="text-blue-400 font-semibold">Score: {score}</div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-blue-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl text-white mb-6">{questions[currentQuestion].question}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                showResult
                  ? option === questions[currentQuestion].correct
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

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <p className="text-sm text-gray-300">{questions[currentQuestion].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Numerical Reasoning Test Component
function NumericalReasoningTest({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: TestResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const getQuestions = () => {
    if (educationLevel === 'primary') {
      return [
        {
          question: "What is 15% of 200?",
          answer: 30,
          explanation: "15% = 15/100 = 0.15, so 0.15 × 200 = 30"
        },
        {
          question: "If 3 items cost $9, how much do 7 items cost?",
          answer: 21,
          explanation: "Each item costs $3, so 7 items cost 7 × $3 = $21"
        }
      ];
    } else if (educationLevel === 'high-school') {
      return [
        {
          question: "A dataset grows by 25% each month. If it starts with 1000 records, how many after 2 months?",
          answer: 1563,
          explanation: "Month 1: 1000 × 1.25 = 1250, Month 2: 1250 × 1.25 = 1562.5 ≈ 1563"
        },
        {
          question: "If a security system has 98% accuracy, what's the error rate as a percentage?",
          answer: 2,
          explanation: "Error rate = 100% - 98% = 2%"
        },
        {
          question: "What's the next number: 1, 4, 9, 16, 25, ?",
          answer: 36,
          explanation: "Perfect squares: 1², 2², 3², 4², 5², 6² = 36"
        }
      ];
    } else {
      return [
        {
          question: "A ML model has precision 0.8 and recall 0.9. What's the F1 score? (round to 2 decimals)",
          answer: 0.85,
          explanation: "F1 = 2 × (precision × recall) / (precision + recall) = 2 × (0.8 × 0.9) / (0.8 + 0.9) = 0.847 ≈ 0.85"
        },
        {
          question: "If a dataset has 10,000 samples with 30% positive class, how many negative samples?",
          answer: 7000,
          explanation: "Positive: 30% of 10,000 = 3,000, Negative: 10,000 - 3,000 = 7,000"
        },
        {
          question: "What's the probability of exactly 2 heads in 4 coin flips? (as decimal)",
          answer: 0.375,
          explanation: "C(4,2) × (0.5)⁴ = 6 × 0.0625 = 0.375"
        },
        {
          question: "A cybersecurity team analyzes 500 alerts daily. If 15% are true positives, how many false positives?",
          answer: 425,
          explanation: "True positives: 500 × 0.15 = 75, False positives: 500 - 75 = 425"
        }
      ];
    }
  };

  const questions = getQuestions();

  const handleSubmit = () => {
    const userNum = parseFloat(userAnswer);
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = Math.abs(userNum - correctAnswer) < 0.01;
    
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        const finalScore = Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0));
        onComplete({
          testId: 'numerical-reasoning',
          score: finalScore,
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length
        });
      }
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Numerical Reasoning</h2>
          <div className="text-green-400 font-semibold">Score: {score}</div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-6">{questions[currentQuestion].question}</h3>
        
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
            onClick={handleSubmit}
            disabled={!userAnswer || showResult}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-semibold disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                Math.abs(parseFloat(userAnswer) - questions[currentQuestion].answer) < 0.01
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <p className={`font-semibold mb-2 ${
                Math.abs(parseFloat(userAnswer) - questions[currentQuestion].answer) < 0.01 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {Math.abs(parseFloat(userAnswer) - questions[currentQuestion].answer) < 0.01 
                  ? 'Correct! 🎉' 
                  : 'Not quite right 🤔'
                }
              </p>
              <p className="text-sm text-gray-300">{questions[currentQuestion].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Verbal Reasoning Test Component
function VerbalReasoningTest({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: TestResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const questions = [
    {
      question: "Choose the word that best completes the analogy: Code is to Program as Recipe is to:",
      options: ["Kitchen", "Meal", "Chef", "Ingredients"],
      correct: "Meal",
      explanation: "Code creates a program, just as a recipe creates a meal"
    },
    {
      question: "What does 'algorithm' mean in the context of computer science?",
      options: ["A programming language", "A step-by-step procedure for solving problems", "A type of computer hardware", "A software application"],
      correct: "A step-by-step procedure for solving problems",
      explanation: "An algorithm is a defined sequence of steps to solve a problem or complete a task"
    },
    {
      question: "Choose the word that is most opposite in meaning to 'encrypt':",
      options: ["Secure", "Decode", "Protect", "Hide"],
      correct: "Decode",
      explanation: "Encrypt means to encode/secure data, while decode means to reverse that process"
    },
    {
      question: "In cybersecurity, what does 'phishing' refer to?",
      options: ["Catching network errors", "Fraudulent attempts to obtain sensitive information", "Monitoring network traffic", "Backing up data"],
      correct: "Fraudulent attempts to obtain sensitive information",
      explanation: "Phishing is a social engineering attack to steal sensitive information like passwords"
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0));
        onComplete({
          testId: 'verbal-reasoning',
          score: finalScore,
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length
        });
      }
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Verbal Reasoning</h2>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-6">{questions[currentQuestion].question}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                showResult
                  ? option === questions[currentQuestion].correct
                    ? 'border-green-400 bg-green-400/20 text-white'
                    : option === selectedAnswer
                    ? 'border-red-500 bg-red-500/20 text-white'
                    : 'border-gray-600 bg-gray-800/30 text-gray-400'
                  : 'border-gray-600 hover:border-purple-400 hover:bg-purple-400/10 text-white'
              }`}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              {option}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <p className="text-sm text-gray-300">{questions[currentQuestion].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 3D Spatial Reasoning Test Component
function SpatialReasoningTest({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: TestResult) => void; 
}) {
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const tasks = [
    {
      question: "Which shape would this cube look like when unfolded?",
      type: "cube-unfolding",
      correctAnswer: 2,
      explanation: "The cube unfolds to form a cross pattern with the colored face in the center"
    },
    {
      question: "How many cubes are in this 3D structure?",
      type: "cube-counting",
      correctAnswer: 7,
      explanation: "Count all visible and hidden cubes in the structure"
    },
    {
      question: "Which object is the same as the target, just rotated?",
      type: "mental-rotation",
      correctAnswer: 1,
      explanation: "The object is rotated 90 degrees clockwise around the vertical axis"
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === tasks[currentTask].correctAnswer;
    if (isCorrect) {
      setScore(score + Math.round(100 / tasks.length));
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = Math.max(0, score + (isCorrect ? Math.round(100 / tasks.length) : 0));
        onComplete({
          testId: 'spatial-reasoning',
          score: finalScore,
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: tasks.length
        });
      }
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">3D Spatial Reasoning</h2>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentTask + 1) / tasks.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-6">{tasks[currentTask].question}</h3>
        
        {/* 3D Visualization */}
        <div className="h-64 mb-6 rounded-lg overflow-hidden bg-black/20">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading 3D scene...</div>}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <SpatialTask3D taskType={tasks[currentTask].type} />
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          </Suspense>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((optionIndex) => (
            <motion.button
              key={optionIndex}
              onClick={() => !showResult && handleAnswer(optionIndex)}
              disabled={showResult}
              className={`p-6 rounded-xl border-2 transition-all font-bold text-lg min-h-[100px] flex items-center justify-center relative overflow-hidden ${
                showResult
                  ? optionIndex === tasks[currentTask].correctAnswer
                    ? 'border-green-400 bg-green-500/40 text-green-50 shadow-xl shadow-green-400/30'
                    : optionIndex === selectedAnswer
                    ? 'border-red-500 bg-red-500/40 text-red-50 shadow-xl shadow-red-500/30'
                    : 'border-gray-400 bg-gray-600/40 text-gray-200'
                  : 'border-pink-400 bg-pink-500/25 hover:border-pink-300 hover:bg-pink-400/35 text-white hover:shadow-xl hover:shadow-pink-400/25 backdrop-blur-md'
              }`}
              whileHover={!showResult ? { scale: 1.08, y: -4 } : {}}
              whileTap={!showResult ? { scale: 0.92 } : {}}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 opacity-20 ${
                showResult
                  ? optionIndex === tasks[currentTask].correctAnswer
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : optionIndex === selectedAnswer
                    ? 'bg-gradient-to-br from-red-400 to-red-600'
                    : 'bg-gradient-to-br from-gray-500 to-gray-700'
                  : 'bg-gradient-to-br from-pink-400 to-purple-500'
              }`} />
              
              <span className="relative z-10 drop-shadow-lg text-shadow">Option {optionIndex + 1}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-pink-500/10 border border-pink-500/20"
            >
              <p className="text-sm text-gray-300">{tasks[currentTask].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 3D Spatial Task Component
function SpatialTask3D({ taskType }: { taskType: string }) {
  switch (taskType) {
    case 'cube-unfolding':
      return (
        <group>
          <Box position={[0, 0, 0]} args={[2, 2, 2]}>
            <meshStandardMaterial color="#4F46E5" />
          </Box>
          <Box position={[0, 1, 2]} args={[2, 2, 0.1]}>
            <meshStandardMaterial color="#EF4444" />
          </Box>
        </group>
      );
    case 'cube-counting':
      return (
        <group>
          {/* Create a 3D structure with multiple cubes */}
          <Box position={[0, 0, 0]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[1, 0, 0]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[0, 1, 0]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[1, 1, 0]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[0, 0, 1]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[1, 0, 1]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
          <Box position={[0, 1, 1]} args={[1, 1, 1]}><meshStandardMaterial color="#10B981" /></Box>
        </group>
      );
    case 'mental-rotation':
      return (
        <group>
          <Box position={[0, 0, 0]} args={[2, 1, 1]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial color="#8B5CF6" />
          </Box>
          <Sphere position={[1, 0.5, 0]} args={[0.3]}>
            <meshStandardMaterial color="#F59E0B" />
          </Sphere>
        </group>
      );
    default:
      return null;
  }
}

// Working Memory Test Component
function WorkingMemoryTest({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: TestResult) => void; 
}) {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  useEffect(() => {
    startNewSequence();
  }, [currentLevel]);

  const startNewSequence = () => {
    const newSequence = Array.from({ length: currentLevel }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('memorize');
    
    // Show sequence for 2 seconds
    setTimeout(() => {
      setPhase('recall');
    }, 2000);
  };

  const handleNumberClick = (number: number) => {
    if (phase !== 'recall') return;
    
    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      // Check if sequence is correct
      const isCorrect = newUserSequence.every((num, index) => num === sequence[index]);
      
      if (isCorrect) {
        setScore(score + currentLevel * 10);
        setCorrectAttempts(correctAttempts + 1);
        
        if (currentLevel < 7) {
          setCurrentLevel(currentLevel + 1);
        } else {
          // Test complete
          completeTest();
        }
      } else {
        // Try again with same level
        if (attempts < 5) {
          setTimeout(() => startNewSequence(), 1000);
        } else {
          completeTest();
        }
      }
      
      setAttempts(attempts + 1);
    }
  };

  const completeTest = () => {
    const finalScore = Math.min(100, score);
    onComplete({
      testId: 'working-memory',
      score: finalScore,
      completionTime: Date.now() - startTime,
      correctAnswers: correctAttempts,
      totalQuestions: attempts
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Working Memory Test</h2>
        <p className="text-gray-300 mb-4">
          {phase === 'memorize' ? 'Memorize the sequence' : 'Click the numbers in the same order'}
        </p>
        <div className="text-yellow-400 font-semibold">Level: {currentLevel} | Score: {score}</div>
      </div>

      {phase === 'memorize' && (
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-4">
            {sequence.map((number, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {number}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-300">Remember this sequence...</p>
        </div>
      )}

      {phase === 'recall' && (
        <div className="text-center mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <motion.button
                key={number}
                onClick={() => handleNumberClick(number)}
                className="w-16 h-16 bg-gray-600 hover:bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {number}
              </motion.button>
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 mb-4">
            {userSequence.map((number, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
              >
                {number}
              </div>
            ))}
          </div>
          
          <p className="text-gray-300">
            Click the numbers in order: {userSequence.length}/{sequence.length}
          </p>
        </div>
      )}
    </div>
  );
}

// 3D Working Memory Test Component
interface MemoryObject {
  id: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone';
  color: string;
  position: [number, number, number];
  isActive: boolean;
  isCorrect?: boolean;
}

function WorkingMemory3DTest({ educationLevel, onComplete }: { educationLevel: string; onComplete: (result: TestResult) => void }) {
  const [gamePhase, setGamePhase] = useState<'instructions' | 'memorize' | 'recall' | 'feedback'>('instructions');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState<MemoryObject[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSequence, setShowSequence] = useState(false);

  const shapes = ['box', 'sphere', 'cylinder', 'cone'] as const;
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE', '#58D68D'];
  const maxLevels = 5;

  // Generate sequence based on difficulty
  const generateSequence = (level: number): MemoryObject[] => {
    const sequenceLength = Math.min(3 + level, 8);
    const objects: MemoryObject[] = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      const angle = (i / sequenceLength) * Math.PI * 2;
      const radius = 3;
      objects.push({
        id: `obj-${i}`,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 2,
          Math.sin(angle) * radius
        ],
        isActive: false
      });
    }
    return objects;
  };

  // Start memorization phase
  const startMemorization = () => {
    const newSequence = generateSequence(currentLevel);
    setSequence(newSequence);
    setGamePhase('memorize');
    setTimeLeft(3000 + currentLevel * 1000); // 3-8 seconds based on level
    setShowSequence(true);

    // Show sequence with timing
    let currentIndex = 0;
    const showNext = () => {
      if (currentIndex < newSequence.length) {
        setSequence(prev => prev.map((obj, idx) => ({
          ...obj,
          isActive: idx === currentIndex
        })));
        currentIndex++;
        setTimeout(showNext, 800 + currentLevel * 100);
      } else {
        // End memorization phase
        setTimeout(() => {
          setSequence(prev => prev.map(obj => ({ ...obj, isActive: false })));
          setGamePhase('recall');
          setUserSequence([]);
        }, 1000);
      }
    };
    
    setTimeout(showNext, 500);
  };

  // Handle object click during recall
  const handleObjectClick = (objectId: string) => {
    if (gamePhase !== 'recall') return;
    
    const newUserSequence = [...userSequence, objectId];
    setUserSequence(newUserSequence);
    
    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      checkAnswer(newUserSequence);
    }
  };

  // Check user's answer
  const checkAnswer = (userSeq: string[]) => {
    const correctSequence = sequence.map(obj => obj.id);
    const isCorrect = JSON.stringify(userSeq) === JSON.stringify(correctSequence);
    
    // Update sequence with feedback
    setSequence(prev => prev.map(obj => ({
      ...obj,
      isCorrect: userSeq.includes(obj.id) && correctSequence.includes(obj.id)
    })));
    
    if (isCorrect) {
      setScore(score + (20 * currentLevel));
      setCorrectAnswers(correctAnswers + 1);
    }
    
    setGamePhase('feedback');
    
    setTimeout(() => {
      if (currentLevel < maxLevels) {
        setCurrentLevel(currentLevel + 1);
        setGamePhase('instructions');
      } else {
        // Game complete
        const result: TestResult = {
          testId: 'working-memory',
          score: Math.min(100, score + (isCorrect ? 20 * currentLevel : 0)),
          completionTime: Date.now() - startTime,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: maxLevels
        };
        onComplete(result);
      }
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">3D Memory Challenge</h3>
          <p className="text-sm text-gray-300">Level {currentLevel} of {maxLevels}</p>
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-semibold">Score: {score}</div>
          <div className="text-xs text-gray-400">Correct: {correctAnswers}/{currentLevel - 1}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <motion.div 
          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentLevel / maxLevels) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Game Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {gamePhase === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <Brain className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-4">
                Level {currentLevel}: Remember the Sequence
              </h4>
              <p className="text-gray-300 mb-6">
                Watch carefully as objects light up in sequence. Then click them in the same order!
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <Timer className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-gray-300">{Math.round((3000 + currentLevel * 1000) / 1000)}s to memorize</div>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-gray-300">{3 + currentLevel} objects</div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-gray-300">3D interaction</div>
                </div>
              </div>
              <motion.button
                onClick={startMemorization}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4 mr-2 inline" />
                Start Level {currentLevel}
              </motion.button>
            </motion.div>
          )}

          {(gamePhase === 'memorize' || gamePhase === 'recall') && (
            <motion.div
              key="3d-scene"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-96 relative"
            >
              {/* Phase indicator */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 rounded-lg px-3 py-2">
                <div className="text-white font-semibold">
                  {gamePhase === 'memorize' ? '👀 Watch & Remember' : '🎯 Click in Order'}
                </div>
                {gamePhase === 'recall' && (
                  <div className="text-xs text-gray-300 mt-1">
                    Selected: {userSequence.length}/{sequence.length}
                  </div>
                )}
              </div>

              {/* 3D Canvas */}
              <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  
                  {sequence.map((obj, index) => (
                    <MemoryObject3D
                      key={obj.id}
                      object={obj}
                      onClick={() => handleObjectClick(obj.id)}
                      isClickable={gamePhase === 'recall'}
                      sequenceIndex={index}
                    />
                  ))}
                  
                  <OrbitControls 
                    enablePan={false} 
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 4}
                  />
                </Suspense>
              </Canvas>
            </motion.div>
          )}

          {gamePhase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center py-8"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                JSON.stringify(userSequence) === JSON.stringify(sequence.map(obj => obj.id))
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {JSON.stringify(userSequence) === JSON.stringify(sequence.map(obj => obj.id)) ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <RotateCcw className="w-8 h-8" />
                )}
              </div>
              
              <h4 className={`text-lg font-bold mb-2 ${
                JSON.stringify(userSequence) === JSON.stringify(sequence.map(obj => obj.id))
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {JSON.stringify(userSequence) === JSON.stringify(sequence.map(obj => obj.id))
                  ? 'Perfect! 🎉'
                  : 'Not quite right 🤔'
                }
              </h4>
              
              <p className="text-gray-300 mb-4">
                {currentLevel < maxLevels 
                  ? `Get ready for level ${currentLevel + 1}!`
                  : 'Memory challenge complete!'
                }
              </p>
              
              <div className="text-sm text-gray-400">
                Points earned: +{JSON.stringify(userSequence) === JSON.stringify(sequence.map(obj => obj.id)) ? 20 * currentLevel : 0}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 3D Object Component
function MemoryObject3D({ 
  object, 
  onClick, 
  isClickable, 
  sequenceIndex 
}: { 
  object: MemoryObject; 
  onClick: () => void; 
  isClickable: boolean;
  sequenceIndex: number;
}) {
  const meshRef = useRef<any>();
  
  useEffect(() => {
    if (object.isActive && meshRef.current) {
      // Animate active object
      const mesh = meshRef.current;
      mesh.scale.setScalar(1.3);
      setTimeout(() => {
        if (mesh) mesh.scale.setScalar(1);
      }, 600);
    }
  }, [object.isActive]);

  const handleClick = () => {
    if (isClickable) {
      onClick();
      // Visual feedback
      if (meshRef.current) {
        meshRef.current.scale.setScalar(0.8);
        setTimeout(() => {
          if (meshRef.current) meshRef.current.scale.setScalar(1);
        }, 150);
      }
    }
  };

  const opacity = object.isActive ? 1 : 0.7;
  const emissive = object.isActive ? object.color : '#000000';
  const emissiveIntensity = object.isActive ? 0.3 : 0;

  return (
    <group position={object.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e: any) => {
          if (isClickable) {
            e.object.scale.setScalar(1.1);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e: any) => {
          if (isClickable) {
            e.object.scale.setScalar(1);
            document.body.style.cursor = 'default';
          }
        }}
      >
        {object.shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {object.shape === 'sphere' && <sphereGeometry args={[0.6, 32, 32]} />}
        {object.shape === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {object.shape === 'cone' && <coneGeometry args={[0.6, 1, 32]} />}
        
        <meshStandardMaterial
          color={object.color}
          transparent
          opacity={opacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Sequence number indicator */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {sequenceIndex + 1}
      </Text>
      
      {/* Feedback indicator */}
      {object.isCorrect !== undefined && (
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color={object.isCorrect ? '#4ECDC4' : '#FF6B6B'}
            emissive={object.isCorrect ? '#4ECDC4' : '#FF6B6B'}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Cognitive Results Display Component
function CognitiveResultsDisplay({ results }: { results: CognitiveResults }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center max-w-4xl mx-auto"
    >
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-white mb-4">Cognitive Assessment Complete! 🧠</h2>
      <p className="text-gray-300 mb-6">
        Excellent work! Your cognitive profile has been analyzed.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{results.logicalReasoning}</div>
          <div className="text-xs text-gray-300">Logical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{results.numericalReasoning}</div>
          <div className="text-xs text-gray-300">Numerical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{results.verbalReasoning}</div>
          <div className="text-xs text-gray-300">Verbal</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{results.spatialReasoning}</div>
          <div className="text-xs text-gray-300">Spatial</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{results.workingMemory}</div>
          <div className="text-xs text-gray-300">Memory</div>
        </div>
      </div>

      <div className="text-lg font-semibold text-white mb-2">
        Overall Score: {results.overallScore}/100
      </div>
      
      {results.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-green-400 font-semibold mb-2">Cognitive Strengths:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {results.strengths.map((strength, index) => (
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
    </motion.div>
  );
}
