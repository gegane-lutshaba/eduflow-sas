'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Achievement } from '../../lib/gamification';

interface AchievementDisplayProps {
  achievements: Achievement[];
  showAll?: boolean;
  maxDisplay?: number;
}

export default function AchievementDisplay({ 
  achievements, 
  showAll = false, 
  maxDisplay = 6 
}: AchievementDisplayProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const displayAchievements = showAll 
    ? achievements 
    : unlockedAchievements.slice(0, maxDisplay);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>Achievements</span>
        </h3>
        <div className="text-sm text-gray-400">
          {unlockedAchievements.length} / {achievements.length}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <AnimatePresence>
          {displayAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                  : 'border-gray-600 bg-gray-800/50 opacity-60'
              }`}
            >
              {achievement.unlocked && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="w-6 h-6 bg-cyber-green rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              )}

              <div className="text-center">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className={`text-xs font-medium ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {achievement.xp} XP
                  </span>
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {achievement.unlocked && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.1) 50%, transparent 70%)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!showAll && achievements.length > maxDisplay && (
        <div className="text-center">
          <button className="text-neural-blue hover:text-neural-purple transition-colors text-sm">
            View All Achievements ({achievements.length})
          </button>
        </div>
      )}
    </div>
  );
}
