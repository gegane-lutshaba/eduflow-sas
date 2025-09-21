'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-3 mb-4"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyber-green/20 border-2 border-cyber-green">
        <Bot className="w-5 h-5 text-cyber-green" />
      </div>

      {/* Typing Bubble */}
      <div className="bg-gray-800/50 border border-gray-600/30 rounded-2xl px-4 py-3">
        <div className="flex items-center space-x-1">
          <span className="text-gray-300 text-sm">Nova is thinking</span>
          <div className="flex space-x-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-1 h-1 bg-cyber-green rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-1 h-1 bg-cyber-green rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-1 h-1 bg-cyber-green rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
