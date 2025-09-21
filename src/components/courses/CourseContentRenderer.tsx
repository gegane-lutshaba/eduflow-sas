'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Plane } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface CourseModule {
  type: string;
  title: string;
  description: string;
  duration: number;
  content: {
    format: string;
    sections: Array<{
      title: string;
      content_type: string;
      duration: number;
      key_points: string[];
      activities: string[];
      infographics: string[];
      images: string[];
    }>;
    practical_exercises?: Array<{
      title: string;
      description: string;
      tools_needed: string[];
      expected_outcome: string;
    }>;
  };
  learning_objectives: string[];
  quiz_questions: Array<{
    question: string;
    type: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: string;
    points: number;
  }>;
  gamification: {
    xp_reward: number;
    achievements: string[];
    badges: string[];
    progress_milestones: string[];
  };
  three_d_elements: {
    visualizations: string[];
    interactive_objects: string[];
    simulations: string[];
    virtual_environments: string[];
  };
}

interface CourseContentRendererProps {
  module: CourseModule;
  onComplete: () => void;
  onQuizAnswer: (questionIndex: number, answer: string) => void;
  userProgress: {
    currentSection: number;
    completedSections: number[];
    quizScores: { [key: number]: number };
    totalXP: number;
  };
}

// 3D Neural Network Visualization Component
const NeuralNetworkVisualization: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [nodes] = useState(() => {
    const nodePositions = [];
    // Input layer
    for (let i = 0; i < 4; i++) {
      nodePositions.push([-3, i * 1.5 - 2.25, 0]);
    }
    // Hidden layer 1
    for (let i = 0; i < 6; i++) {
      nodePositions.push([-1, i * 1 - 2.5, 0]);
    }
    // Hidden layer 2
    for (let i = 0; i < 4; i++) {
      nodePositions.push([1, i * 1.5 - 2.25, 0]);
    }
    // Output layer
    for (let i = 0; i < 2; i++) {
      nodePositions.push([3, i * 2 - 1, 0]);
    }
    return nodePositions;
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((position, index) => (
        <Sphere key={index} position={position} args={[0.1, 16, 16]}>
          <meshStandardMaterial 
            color={isActive ? "#00ff88" : "#4a90e2"} 
            emissive={isActive ? "#002211" : "#000000"}
          />
        </Sphere>
      ))}
      
      {/* Connections */}
      {nodes.slice(0, 4).map((startPos, i) =>
        nodes.slice(4, 10).map((endPos, j) => (
          <Line3D 
            key={`${i}-${j}`} 
            start={startPos} 
            end={endPos} 
            color={isActive ? "#00ff88" : "#4a90e2"}
            opacity={isActive ? 0.8 : 0.3}
          />
        ))
      )}
    </group>
  );
};

// 3D Line Component
const Line3D: React.FC<{ 
  start: number[]; 
  end: number[]; 
  color: string; 
  opacity: number; 
}> = ({ start, end, color, opacity }) => {
  const ref = useRef<THREE.BufferGeometry>(null);
  
  useEffect(() => {
    if (ref.current) {
      const points = [
        new THREE.Vector3(start[0], start[1], start[2]),
        new THREE.Vector3(end[0], end[1], end[2])
      ];
      ref.current.setFromPoints(points);
    }
  }, [start, end]);

  return (
    <line>
      <bufferGeometry ref={ref} />
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
};

// Cybersecurity Network Visualization
const NetworkVisualization: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central server */}
      <Box position={[0, 0, 0]} args={[0.5, 0.8, 0.3]}>
        <meshStandardMaterial 
          color={isActive ? "#ff4444" : "#666666"} 
          emissive={isActive ? "#220000" : "#000000"}
        />
      </Box>
      
      {/* Client nodes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={i}>
            <Cylinder position={[x, 0, z]} args={[0.1, 0.1, 0.3, 8]}>
              <meshStandardMaterial 
                color={isActive ? "#44ff44" : "#444444"} 
                emissive={isActive ? "#002200" : "#000000"}
              />
            </Cylinder>
            <Line3D 
              start={[0, 0, 0]} 
              end={[x, 0, z]} 
              color={isActive ? "#ffff44" : "#666666"}
              opacity={isActive ? 0.6 : 0.2}
            />
          </group>
        );
      })}
    </group>
  );
};

// Interactive Quiz Component
const InteractiveQuiz: React.FC<{
  questions: CourseModule['quiz_questions'];
  onAnswer: (questionIndex: number, answer: string) => void;
  currentQuestion: number;
  userAnswers: { [key: number]: string };
}> = ({ questions, onAnswer, currentQuestion, userAnswers }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const question = questions[currentQuestion];
  if (!question) return null;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(currentQuestion, answer);
    setShowExplanation(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-purple-300">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-yellow-400">
              {question.points} XP
            </span>
            <div className={`px-2 py-1 rounded text-xs ${
              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {question.difficulty}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(option)}
            disabled={showExplanation}
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              selectedAnswer === option
                ? option === question.correct_answer
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : 'bg-red-500/20 border-red-500 text-red-300'
                : showExplanation && option === question.correct_answer
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30"
          >
            <h4 className="font-semibold text-blue-300 mb-2">Explanation:</h4>
            <p className="text-gray-300 text-sm">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Course Content Renderer Component
const CourseContentRenderer: React.FC<CourseContentRendererProps> = ({
  module,
  onComplete,
  onQuizAnswer,
  userProgress
}) => {
  const [currentView, setCurrentView] = useState<'content' | 'quiz' | '3d'>('content');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showXPGain, setShowXPGain] = useState(false);

  const isAITrack = module.three_d_elements.visualizations.some(v => 
    v.includes('neural') || v.includes('ai') || v.includes('ml')
  );

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    onQuizAnswer(questionIndex, answer);
    
    // Show XP gain animation
    setShowXPGain(true);
    setTimeout(() => setShowXPGain(false), 2000);
    
    // Auto-advance to next question after delay
    setTimeout(() => {
      if (questionIndex < module.quiz_questions.length - 1) {
        setCurrentQuizQuestion(questionIndex + 1);
      } else {
        // Quiz completed
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, 3000);
  };

  const renderContent = () => {
    const section = module.content.sections[currentSection];
    if (!section) return null;

    return (
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-indigo-300 mb-3">Key Points</h4>
              <ul className="space-y-2">
                {section.key_points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-2 text-gray-300"
                  >
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-3">Activities</h4>
              <div className="space-y-2">
                {section.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20"
                  >
                    <span className="text-purple-300 text-sm">{activity}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {section.infographics.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-green-300 mb-3">Visual Learning</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.infographics.map((infographic, index) => (
                  <div
                    key={index}
                    className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 text-center"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-green-300 text-sm">📊 {infographic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Practical Exercises */}
        {module.content.practical_exercises && module.content.practical_exercises.length > 0 && (
          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <h4 className="text-xl font-bold text-orange-300 mb-4">Hands-On Practice</h4>
            {module.content.practical_exercises.map((exercise, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h5 className="text-lg font-semibold text-white mb-2">{exercise.title}</h5>
                <p className="text-gray-300 mb-3">{exercise.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-orange-300 mb-2">Tools Needed:</h6>
                    <div className="flex flex-wrap gap-2">
                      {exercise.tools_needed.map((tool, toolIndex) => (
                        <span
                          key={toolIndex}
                          className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="font-medium text-red-300 mb-2">Expected Outcome:</h6>
                    <p className="text-gray-300 text-sm">{exercise.expected_outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXPGain && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-bold"
          >
            +{module.quiz_questions[currentQuizQuestion]?.points || 10} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
              <p className="text-gray-300">{module.description}</p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {userProgress.totalXP} XP
              </div>
              <div className="text-sm text-gray-400">
                {module.duration} minutes
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4">
            {['content', '3d', 'quiz'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentView(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === tab
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {tab === '3d' ? '3D Visualization' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderContent()}
              
              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Previous Section
                </button>
                
                <button
                  onClick={() => {
                    if (currentSection < module.content.sections.length - 1) {
                      setCurrentSection(currentSection + 1);
                    } else {
                      setCurrentView('quiz');
                    }
                  }}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  {currentSection < module.content.sections.length - 1 ? 'Next Section' : 'Take Quiz'}
                </button>
              </div>
            </motion.div>
          )}

          {currentView === '3d' && (
            <motion.div
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-96 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                
                {isAITrack ? (
                  <NeuralNetworkVisualization isActive={true} />
                ) : (
                  <NetworkVisualization isActive={true} />
                )}
                
                <Text
                  position={[0, -3, 0]}
                  fontSize={0.5}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {isAITrack ? 'Neural Network Architecture' : 'Network Security Topology'}
                </Text>
              </Canvas>
            </motion.div>
          )}

          {currentView === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InteractiveQuiz
                questions={module.quiz_questions}
                onAnswer={handleQuizAnswer}
                currentQuestion={currentQuizQuestion}
                userAnswers={userAnswers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseContentRenderer;
