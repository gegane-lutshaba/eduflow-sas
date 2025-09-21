'use client';

import { motion } from 'framer-motion';
import { Star, Zap, Trophy } from 'lucide-react';
import { GamificationProfile, gamificationService } from '../../lib/gamification';

interface XPDisplayProps {
  profile: GamificationProfile;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function XPDisplay({ profile, showDetails = true, size = 'md' }: XPDisplayProps) {
  const progress = gamificationService.getProgressToNextLevel(profile.totalXp);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.div 
      className="glass-card p-4 bg-gradient-to-r from-neural-blue/10 to-neural-purple/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Star className={`${iconSizes[size]} text-neural-blue`} />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className={`font-bold text-white ${sizeClasses[size]}`}>
            Level {profile.level}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Zap className={`${iconSizes[size]} text-yellow-400`} />
          <span className={`font-semibold text-yellow-400 ${sizeClasses[size]}`}>
            {profile.totalXp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Progress to Level {profile.level + 1}</span>
              <span>{progress.current}/{progress.needed} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neural-blue to-cyber-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>{profile.achievements.filter(a => a.unlocked).length} Achievements</span>
            </div>
            <span>{Math.round(progress.percentage)}% Complete</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
