'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  emoji?: string;
  xpReward?: number;
  achievement?: string;
}

export default function ChatMessage({ 
  message, 
  isUser, 
  timestamp, 
  emoji, 
  xpReward, 
  achievement 
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-neural-blue/20 border-2 border-neural-blue' 
          : 'bg-cyber-green/20 border-2 border-cyber-green'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-neural-blue" />
        ) : (
          <Bot className="w-5 h-5 text-cyber-green" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-neural-blue/10 border border-neural-blue/20 text-white'
          : 'bg-gray-800/50 border border-gray-600/30 text-gray-100'
      }`}>
        {/* Emoji if provided */}
        {emoji && (
          <div className="text-2xl mb-2">{emoji}</div>
        )}
        
        {/* Message text */}
        <p className="text-sm leading-relaxed">
          {message}
        </p>

        {/* XP Reward */}
        {xpReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-2 inline-flex items-center space-x-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2 py-1"
          >
            <span className="text-xs text-yellow-400 font-semibold">+{xpReward} XP</span>
            <span className="text-xs">✨</span>
          </motion.div>
        )}

        {/* Achievement */}
        {achievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="mt-2 inline-flex items-center space-x-1 bg-purple-400/20 border border-purple-400/30 rounded-full px-2 py-1"
          >
            <span className="text-xs text-purple-400 font-semibold">🏆 {achievement}</span>
          </motion.div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className="mt-2 text-xs text-gray-500">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
