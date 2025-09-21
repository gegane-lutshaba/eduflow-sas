'use client';

import { motion } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';
import { Achievement } from '../../lib/gamification';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  delay?: number;
}

export default function AchievementNotification({ 
  achievement, 
  onClose, 
  delay = 0 
}: AchievementNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="fixed top-24 right-4 z-50 glass-card p-4 border-2 border-yellow-400 bg-yellow-400/10 max-w-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h4 className="font-bold text-white">Achievement Unlocked!</h4>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{achievement.icon}</div>
        <div className="flex-1">
          <p className="text-sm text-yellow-400 font-semibold">{achievement.title}</p>
          <p className="text-xs text-gray-300">{achievement.description}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400">+{achievement.xp} XP</span>
          </div>
        </div>
      </div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.1) 50%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
