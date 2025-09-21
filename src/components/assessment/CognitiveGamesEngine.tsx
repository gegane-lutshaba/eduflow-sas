'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Cone } from '@react-three/drei';
import { 
  Brain, 
  Target, 
  Zap, 
  Code, 
  Sparkles, 
  CheckCircle, 
  Trophy,
  Timer,
  Star,
  ArrowRight,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { animationEngine } from '../../lib/animation-engine';

export interface GameResult {
  gameId: string;
  score: number;
  completionTime: number;
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface CognitiveProfile {
  logicalReasoning: number;
  numericalReasoning: number;
  verbalReasoning: number;
  spatialReasoning: number;
  workingMemory: number;
}

interface CognitiveGamesEngineProps {
  educationLevel: 'primary' | 'high-school' | 'college' | 'professional';
  onGameComplete: (result: GameResult) => void;
  onAllGamesComplete: (profile: CognitiveProfile) => void;
}

const games = [
  { 
    id: 'logical-reasoning', 
    title: 'Logic Labyrinth', 
    icon: Brain, 
    color: 'from-neural-blue to-neural-purple',
    description: 'Pattern recognition and logical thinking'
  },
  { 
    id: 'numerical-reasoning', 
    title: 'Number Ninja', 
    icon: Target, 
    color: 'from-cyber-green to-neural-blue',
    description: 'Mathematical problem solving'
  },
  { 
    id: 'verbal-reasoning', 
    title: 'Word Wizard', 
    icon: Sparkles, 
    color: 'from-neural-purple to-cyber-green',
    description: 'Language comprehension and reasoning'
  },
  { 
    id: 'spatial-reasoning', 
    title: 'Space Explorer', 
    icon: Code, 
    color: 'from-neural-blue to-neural-purple',
    description: 'Visual-spatial problem solving'
  },
  { 
    id: 'working-memory', 
    title: 'Memory Master', 
    icon: Zap, 
    color: 'from-cyber-green to-neural-purple',
    description: 'Information retention and manipulation'
  }
];

export default function CognitiveGamesEngine({ 
  educationLevel, 
  onGameComplete, 
  onAllGamesComplete 
}: CognitiveGamesEngineProps) {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      animationEngine.initialize(canvasRef.current);
    }
    return () => animationEngine.destroy();
  }, []);

  const handleGameComplete = (result: GameResult) => {
    const newResults = [...gameResults, result];
    setGameResults(newResults);
    onGameComplete(result);

    // Trigger celebration animation
    animationEngine.triggerAnimation({
      type: 'celebration',
      intensity: 'medium',
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    });

    if (currentGameIndex < games.length - 1) {
      setTimeout(() => {
        setCurrentGameIndex(currentGameIndex + 1);
        setIsGameActive(false);
      }, 2000);
    } else {
      // All games completed
      setTimeout(() => {
        const profile = calculateCognitiveProfile(newResults);
        onAllGamesComplete(profile);
        setShowResults(true);
      }, 2000);
    }
  };

  const calculateCognitiveProfile = (results: GameResult[]): CognitiveProfile => {
    const profile: CognitiveProfile = {
      logicalReasoning: 0,
      numericalReasoning: 0,
      verbalReasoning: 0,
      spatialReasoning: 0,
      workingMemory: 0
    };

    results.forEach(result => {
      switch (result.gameId) {
        case 'logical-reasoning':
          profile.logicalReasoning = result.score;
          break;
        case 'numerical-reasoning':
          profile.numericalReasoning = result.score;
          break;
        case 'verbal-reasoning':
          profile.verbalReasoning = result.score;
          break;
        case 'spatial-reasoning':
          profile.spatialReasoning = result.score;
          break;
        case 'working-memory':
          profile.workingMemory = result.score;
          break;
      }
    });

    return profile;
  };

  const startGame = () => {
    setIsGameActive(true);
    animationEngine.triggerAnimation({
      type: 'excitement',
      intensity: 'high'
    });
  };

  if (showResults) {
    return <ResultsDisplay results={gameResults} />;
  }

  const currentGame = games[currentGameIndex];
  const Icon = currentGame.icon;
  const isCompleted = gameResults.some(r => r.gameId === currentGame.id);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {/* Animated Background */}
      <div className="neural-bg-animated absolute inset-0" />
      
      <div className="relative z-10 p-6">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Cognitive Assessment Games</h1>
            <div className="text-sm text-gray-300">
              Game {currentGameIndex + 1} of {games.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-neural-blue to-cyber-green h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentGameIndex + (isGameActive ? 0.5 : 0)) / games.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Game Selection Grid */}
          <div className="grid grid-cols-5 gap-4">
            {games.map((game, index) => {
              const GameIcon = game.icon;
              const isActive = index === currentGameIndex;
              const isCompleted = gameResults.some(r => r.gameId === game.id);
              const isLocked = index > currentGameIndex;

              return (
                <motion.div
                  key={game.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-neural-blue bg-neural-blue/20 shadow-lg'
                      : isCompleted
                      ? 'border-cyber-green bg-cyber-green/20'
                      : isLocked
                      ? 'border-gray-600 bg-gray-800/30 opacity-50'
                      : 'border-gray-600'
                  }`}
                  whileHover={!isLocked ? { scale: 1.05 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                >
                  {isCompleted && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-green rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  <div className="text-center">
                    <GameIcon className={`w-8 h-8 mx-auto mb-2 ${
                      isActive ? 'text-neural-blue' : 
                      isCompleted ? 'text-cyber-green' : 
                      isLocked ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <div className="text-xs text-white font-medium">{game.title}</div>
                    {isCompleted && (
                      <div className="text-xs text-cyber-green mt-1">
                        {gameResults.find(r => r.gameId === game.id)?.score}/100
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Current Game Display */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!isGameActive ? (
              <motion.div
                key="game-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 text-center"
              >
                <motion.div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentGame.color} flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{currentGame.title}</h2>
                <p className="text-gray-300 mb-6 text-lg">{currentGame.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <Timer className="w-6 h-6 text-neural-blue mx-auto mb-2" />
                    <div className="text-sm text-gray-300">~3 minutes</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 text-cyber-green mx-auto mb-2" />
                    <div className="text-sm text-gray-300">Adaptive difficulty</div>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 text-neural-purple mx-auto mb-2" />
                    <div className="text-sm text-gray-300">Instant feedback</div>
                  </div>
                </div>

                <motion.button
                  onClick={startGame}
                  className="neural-button text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Game</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="active-game"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
              >
                {currentGame.id === 'logical-reasoning' && (
                  <LogicalReasoningGame 
                    educationLevel={educationLevel}
                    onComplete={handleGameComplete}
                  />
                )}
                {currentGame.id === 'numerical-reasoning' && (
                  <NumericalReasoningGame 
                    educationLevel={educationLevel}
                    onComplete={handleGameComplete}
                  />
                )}
                {currentGame.id === 'verbal-reasoning' && (
                  <VerbalReasoningGame 
                    educationLevel={educationLevel}
                    onComplete={handleGameComplete}
                  />
                )}
                {currentGame.id === 'spatial-reasoning' && (
                  <SpatialReasoningGame 
                    educationLevel={educationLevel}
                    onComplete={handleGameComplete}
                  />
                )}
                {currentGame.id === 'working-memory' && (
                  <WorkingMemoryGame 
                    educationLevel={educationLevel}
                    onComplete={handleGameComplete}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Individual Game Components
function LogicalReasoningGame({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: GameResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

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
      question: "Which shape completes the pattern?",
      options: ["Circle", "Square", "Triangle", "Diamond"],
      correct: "Triangle",
      explanation: "The pattern alternates between curved and angular shapes"
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
      
      // Trigger success animation
      animationEngine.triggerAnimation({
        type: 'achievement',
        intensity: 'medium'
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const result: GameResult = {
          gameId: 'logical-reasoning',
          score: Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0)),
          completionTime: Date.now() - startTime,
          attempts: 1,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length
        };
        onComplete(result);
      }
    }, 2500);
  };

  return (
    <div className="glass-card p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Question {currentQuestion + 1} of {questions.length}</h3>
          <div className="text-neural-blue font-semibold">Score: {score}</div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <motion.div 
            className="bg-gradient-to-r from-neural-blue to-neural-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg text-white mb-6">{questions[currentQuestion].question}</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                showResult
                  ? option === questions[currentQuestion].correct
                    ? 'border-cyber-green bg-cyber-green/20 text-white'
                    : option === selectedAnswer
                    ? 'border-red-500 bg-red-500/20 text-white'
                    : 'border-gray-600 bg-gray-800/30 text-gray-400'
                  : 'border-gray-600 hover:border-neural-blue hover:bg-neural-blue/10 text-white'
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
              className="mt-6 p-4 rounded-lg bg-neural-blue/10 border border-neural-blue/20"
            >
              <p className="text-sm text-gray-300">{questions[currentQuestion].explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NumericalReasoningGame({ 
  educationLevel, 
  onComplete 
}: { 
  educationLevel: string; 
  onComplete: (result: GameResult) => void; 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const questions = [
    {
      question: "A dataset has 1000 samples. If 70% are for training and 20% for validation, how many are for testing?",
      answer: 100,
      explanation: "Training: 700, Validation: 200, Testing: 1000 - 700 - 200 = 100"
    },
    {
      question: "If a model has 95% accuracy on 1000 samples, how many predictions were correct?",
      answer: 950,
      explanation: "95% of 1000 = 0.95 × 1000 = 950 correct predictions"
    },
    {
      question: "A security system has a 2% false positive rate. In 10,000 legitimate requests, how many false alarms?",
      answer: 200,
      explanation: "2% of 10,000 = 0.02 × 10,000 = 200 false alarms"
    }
  ];

  const handleSubmit = () => {
    const userNum = parseFloat(userAnswer);
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = Math.abs(userNum - correctAnswer) < 0.01;
    
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + Math.round(100 / questions.length));
      setCorrectAnswers(correctAnswers + 1);
      
      animationEngine.triggerAnimation({
        type: 'celebration',
        intensity: 'medium'
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        const result: GameResult = {
          gameId: 'numerical-reasoning',
          score: Math.max(0, score + (isCorrect ? Math.round(100 / questions.length) : 0)),
          completionTime: Date.now() - startTime,
          attempts: 1,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: questions.length
        };
        onComplete(result);
      }
    }, 2500);
  };

  return (
    <div className="glass-card p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Question {currentQuestion + 1} of {questions.length}</h3>
          <div className="text-cyber-green font-semibold">Score: {score}</div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <motion.div 
            className="bg-gradient-to-r from-cyber-green to-neural-blue h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg text-white mb-6">{questions[currentQuestion].question}</h4>
        
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="number"
            step="0.01"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            disabled={showResult}
            className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white text-center focus:border-cyber-green focus:outline-none"
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!userAnswer || showResult}
            className="neural-button px-6 py-3 disabled:opacity-50"
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
                  ? 'bg-cyber-green/10 border border-cyber-green/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <p className={`font-semibold mb-2 ${
                Math.abs(parseFloat(userAnswer) - questions[currentQuestion].answer) < 0.01 
                  ? 'text-cyber-green' 
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

// Placeholder components for other games
function VerbalReasoningGame({ educationLevel, onComplete }: { educationLevel: string; onComplete: (result: GameResult) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete({
        gameId: 'verbal-reasoning',
        score: 75 + Math.floor(Math.random() * 20),
        completionTime: 120000,
        attempts: 1,
        correctAnswers: 3,
        totalQuestions: 4
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Verbal Reasoning</h3>
      <div className="animate-pulse text-gray-300">Processing language comprehension test...</div>
    </div>
  );
}

function SpatialReasoningGame({ educationLevel, onComplete }: { educationLevel: string; onComplete: (result: GameResult) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete({
        gameId: 'spatial-reasoning',
        score: 70 + Math.floor(Math.random() * 25),
        completionTime: 150000,
        attempts: 1,
        correctAnswers: 4,
        totalQuestions: 5
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Spatial Reasoning</h3>
      <div className="animate-pulse text-gray-300">Loading 3D visualization puzzles...</div>
    </div>
  );
}

function WorkingMemoryGame({ educationLevel, onComplete }: { educationLevel: string; onComplete: (result: GameResult) => void }) {
  return <Memory3DGame educationLevel={educationLevel} onComplete={onComplete} />;
}

// 3D Memory Game Component
interface MemoryObject {
  id: string;
  shape: 'box' | 'sphere' | 'cylinder' | 'cone';
  color: string;
  position: [number, number, number];
  isActive: boolean;
  isCorrect?: boolean;
}

function Memory3DGame({ educationLevel, onComplete }: { educationLevel: string; onComplete: (result: GameResult) => void }) {
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
      
      animationEngine.triggerAnimation({
        type: 'celebration',
        intensity: 'medium'
      });
    }
    
    setGamePhase('feedback');
    
    setTimeout(() => {
      if (currentLevel < maxLevels) {
        setCurrentLevel(currentLevel + 1);
        setGamePhase('instructions');
      } else {
        // Game complete
        const result: GameResult = {
          gameId: 'working-memory',
          score: Math.min(100, score + (isCorrect ? 20 * currentLevel : 0)),
          completionTime: Date.now() - startTime,
          attempts: 1,
          correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
          totalQuestions: maxLevels
        };
        onComplete(result);
      }
    }, 2500);
  };

  return (
    <div className="glass-card p-6 h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">3D Memory Challenge</h3>
          <p className="text-sm text-gray-300">Level {currentLevel} of {maxLevels}</p>
        </div>
        <div className="text-right">
          <div className="text-cyber-green font-semibold">Score: {score}</div>
          <div className="text-xs text-gray-400">Correct: {correctAnswers}/{currentLevel - 1}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <motion.div 
          className="bg-gradient-to-r from-cyber-green to-neural-purple h-2 rounded-full"
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
              <Brain className="w-16 h-16 text-neural-blue mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-4">
                Level {currentLevel}: Remember the Sequence
              </h4>
              <p className="text-gray-300 mb-6">
                Watch carefully as objects light up in sequence. Then click them in the same order!
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <Timer className="w-5 h-5 text-neural-blue mx-auto mb-1" />
                  <div className="text-gray-300">{Math.round((3000 + currentLevel * 1000) / 1000)}s to memorize</div>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 text-cyber-green mx-auto mb-1" />
                  <div className="text-gray-300">{3 + currentLevel} objects</div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-neural-purple mx-auto mb-1" />
                  <div className="text-gray-300">3D interaction</div>
                </div>
              </div>
              <motion.button
                onClick={startMemorization}
                className="neural-button px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4 mr-2" />
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
                  ? 'bg-cyber-green/20 text-cyber-green'
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
                  ? 'text-cyber-green'
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

function ResultsDisplay({ results }: { results: GameResult[] }) {
  const averageScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center max-w-2xl mx-auto"
    >
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete! 🧠</h2>
      <p className="text-gray-300 mb-6">
        Excellent work! Your cognitive profile has been analyzed and will be used to 
        create your personalized learning experience.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {results.map((result) => {
          const game = games.find(g => g.id === result.gameId);
          return (
            <div key={result.gameId} className="text-center">
              <div className="text-2xl font-bold text-neural-blue">{result.score}</div>
              <div className="text-xs text-gray-300">{game?.title}</div>
            </div>
          );
        })}
      </div>

      <div className="text-lg font-semibold text-white mb-2">
        Overall Score: {averageScore}/100
      </div>
      <div className="text-sm text-gray-400">
        Your cognitive strengths have been identified and will guide your learning path!
      </div>
    </motion.div>
  );
}
