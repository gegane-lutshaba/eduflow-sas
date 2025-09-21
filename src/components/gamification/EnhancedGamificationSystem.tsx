'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  completedCourses: number;
  completedModules: number;
  achievements: Achievement[];
  badges: Badge[];
  skillTrees: SkillTree[];
  leaderboardRank: number;
  weeklyXP: number;
  monthlyXP: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  xpReward: number;
  category: 'knowledge' | 'practice' | 'social' | 'streak' | 'speed';
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  progress: number;
  category: string;
}

interface SkillTree {
  id: string;
  name: string;
  category: 'ai' | 'cybersecurity' | 'general';
  nodes: SkillNode[];
  totalProgress: number;
}

interface SkillNode {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisites: string[];
  xpRequired: number;
  position: { x: number; y: number };
}

interface EnhancedGamificationSystemProps {
  userProgress: UserProgress;
  onAchievementClick: (achievement: Achievement) => void;
  onSkillNodeClick: (node: SkillNode) => void;
  className?: string;
}

// 3D XP Orb Component
const XPOrb: React.FC<{ xp: number; level: number }> = ({ xp, level }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const orbColor = level < 10 ? "#4ade80" : level < 25 ? "#3b82f6" : level < 50 ? "#8b5cf6" : "#f59e0b";

  return (
    <group>
      <Sphere ref={meshRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Text
        position={[0, 0, 0.9]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {level}
      </Text>
    </group>
  );
};

// Achievement Notification Component
const AchievementNotification: React.FC<{
  achievement: Achievement;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      className={`fixed top-20 right-6 z-50 bg-gradient-to-r ${rarityColors[achievement.rarity]} p-4 rounded-lg shadow-2xl border-2 border-white/20 max-w-sm`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
          <p className="text-white/80 text-sm">{achievement.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-yellow-300 text-sm font-semibold">+{achievement.xpReward} XP</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
              achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {achievement.rarity.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Skill Tree Visualization Component
const SkillTreeVisualization: React.FC<{
  skillTree: SkillTree;
  onNodeClick: (node: SkillNode) => void;
}> = ({ skillTree, onNodeClick }) => {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/30 overflow-hidden">
      <div className="absolute inset-0 p-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center">{skillTree.name}</h3>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>{Math.round(skillTree.totalProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${skillTree.totalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Skill Nodes */}
        <div className="relative h-64">
          {skillTree.nodes.map((node, index) => (
            <motion.div
              key={node.id}
              className={`absolute w-12 h-12 rounded-full border-2 cursor-pointer transition-all ${
                node.isCompleted
                  ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                  : node.isUnlocked
                  ? 'bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50 hover:scale-110'
                  : 'bg-gray-600 border-gray-500 opacity-50'
              }`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => node.isUnlocked && onNodeClick(node)}
              whileHover={node.isUnlocked ? { scale: 1.1 } : {}}
              whileTap={node.isUnlocked ? { scale: 0.95 } : {}}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                {node.isCompleted ? '✓' : index + 1}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {node.title}
              </div>
            </motion.div>
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {skillTree.nodes.map((node) =>
              node.prerequisites.map((prereqId) => {
                const prereqNode = skillTree.nodes.find(n => n.id === prereqId);
                if (!prereqNode) return null;
                
                return (
                  <line
                    key={`${prereqId}-${node.id}`}
                    x1={`${prereqNode.position.x}%`}
                    y1={`${prereqNode.position.y}%`}
                    x2={`${node.position.x}%`}
                    y2={`${node.position.y}%`}
                    stroke={prereqNode.isCompleted ? "#10b981" : "#6b7280"}
                    strokeWidth="2"
                    strokeDasharray={prereqNode.isCompleted ? "0" : "5,5"}
                    opacity={0.6}
                  />
                );
              })
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard: React.FC<{
  userRank: number;
  weeklyXP: number;
  monthlyXP: number;
}> = ({ userRank, weeklyXP, monthlyXP }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Leaderboard</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              timeframe === 'weekly'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              timeframe === 'monthly'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
              #{userRank}
            </div>
            <div>
              <div className="text-white font-semibold">You</div>
              <div className="text-yellow-300 text-sm">
                {timeframe === 'weekly' ? weeklyXP : monthlyXP} XP
              </div>
            </div>
          </div>
          <div className="text-yellow-400 font-bold">
            {userRank <= 3 ? '🏆' : userRank <= 10 ? '🥉' : '⭐'}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          Keep learning to climb the ranks!
        </div>
      </div>
    </div>
  );
};

// Main Enhanced Gamification System Component
const EnhancedGamificationSystem: React.FC<EnhancedGamificationSystemProps> = ({
  userProgress,
  onAchievementClick,
  onSkillNodeClick,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'skills' | 'leaderboard'>('overview');
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  // Calculate level progress
  const xpForCurrentLevel = userProgress.level * 1000;
  const xpForNextLevel = (userProgress.level + 1) * 1000;
  const levelProgress = ((userProgress.totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Simulate new achievement (in real app, this would come from props/context)
  useEffect(() => {
    // This would be triggered by actual achievement unlocks
    const checkForNewAchievements = () => {
      const latestAchievement = userProgress.achievements[userProgress.achievements.length - 1];
      if (latestAchievement && !newAchievement) {
        setNewAchievement(latestAchievement);
      }
    };

    checkForNewAchievements();
  }, [userProgress.achievements, newAchievement]);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* XP and Level Display */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Level Progress</h3>
          <div className="text-2xl font-bold text-indigo-400">Lv.{userProgress.level}</div>
        </div>
        
        <div className="h-32 mb-4">
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <XPOrb xp={userProgress.totalXP} level={userProgress.level} />
          </Canvas>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>XP Progress</span>
            <span>{userProgress.totalXP.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-gray-400 text-center">
            {Math.round(levelProgress)}% to Level {userProgress.level + 1}
          </div>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Learning Streak</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-400 mb-2">
            {userProgress.currentStreak}
          </div>
          <div className="text-orange-300 mb-2">Days</div>
          <div className="text-sm text-gray-400">
            Best: {userProgress.longestStreak} days
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="text-2xl">
            {userProgress.currentStreak >= 7 ? '🔥' : userProgress.currentStreak >= 3 ? '⚡' : '💪'}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Courses Completed</span>
            <span className="text-green-400 font-semibold">{userProgress.completedCourses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Modules Finished</span>
            <span className="text-green-400 font-semibold">{userProgress.completedModules}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Achievements</span>
            <span className="text-green-400 font-semibold">{userProgress.achievements.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Badges</span>
            <span className="text-green-400 font-semibold">{userProgress.badges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProgress.achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          className={`bg-gradient-to-br backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all hover:scale-105 ${
            achievement.rarity === 'legendary'
              ? 'from-yellow-900/20 to-orange-900/20 border-yellow-500/30'
              : achievement.rarity === 'epic'
              ? 'from-purple-900/20 to-pink-900/20 border-purple-500/30'
              : achievement.rarity === 'rare'
              ? 'from-blue-900/20 to-indigo-900/20 border-blue-500/30'
              : 'from-gray-900/20 to-slate-900/20 border-gray-500/30'
          }`}
          onClick={() => onAchievementClick(achievement)}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-3xl">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{achievement.title}</h4>
              <p className="text-sm text-gray-300">{achievement.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-sm font-semibold">
              +{achievement.xpReward} XP
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
              achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {achievement.rarity.toUpperCase()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSkillTrees = () => (
    <div className="space-y-6">
      {userProgress.skillTrees.map((skillTree) => (
        <SkillTreeVisualization
          key={skillTree.id}
          skillTree={skillTree}
          onNodeClick={onSkillNodeClick}
        />
      ))}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'achievements', label: 'Achievements', icon: '🏆' },
          { key: 'skills', label: 'Skill Trees', icon: '🌳' },
          { key: 'leaderboard', label: 'Leaderboard', icon: '👑' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-500 text-white border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'skills' && renderSkillTrees()}
          {activeTab === 'leaderboard' && (
            <Leaderboard
              userRank={userProgress.leaderboardRank}
              weeklyXP={userProgress.weeklyXP}
              monthlyXP={userProgress.monthlyXP}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedGamificationSystem;
export type { UserProgress, Achievement, Badge, SkillTree, SkillNode };
