'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Sparkles,
  Heart,
  Star,
  Zap
} from 'lucide-react';
import { novaAudioService } from '../../lib/nova-audio-service';

interface NovaCompanionProps {
  currentStep: string;
  message?: string;
  emotion?: 'excited' | 'encouraging' | 'celebratory' | 'thoughtful' | 'warm';
  isVisible?: boolean;
  audioId?: string;
  onAudioComplete?: () => void;
}

export default function NovaCompanion({
  currentStep,
  message,
  emotion = 'encouraging',
  isVisible = true,
  audioId,
  onAudioComplete
}: NovaCompanionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string>(emotion);

  // Play audio when audioId changes
  useEffect(() => {
    if (audioId && audioEnabled) {
      playAudio();
    }
  }, [audioId, audioEnabled]);

  // Show message when provided
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      setIsAnimating(true);
      
      // Hide message after 4 seconds
      setTimeout(() => {
        setShowMessage(false);
        setIsAnimating(false);
      }, 4000);
    }
  }, [message]);

  // Update emotion state
  useEffect(() => {
    setCurrentEmotion(emotion);
    if (emotion === 'excited' || emotion === 'celebratory') {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [emotion]);

  const playAudio = async () => {
    if (!audioId) return;
    
    setIsAnimating(true);
    
    try {
      await novaAudioService.playAudio(audioId, message, {
        emotion: currentEmotion,
        onComplete: () => {
          setIsAnimating(false);
          onAudioComplete?.();
        }
      });
    } catch (error) {
      console.warn('Audio playback failed:', error);
      setIsAnimating(false);
    }
  };

  const toggleAudio = () => {
    const newEnabled = !audioEnabled;
    setAudioEnabled(newEnabled);
    novaAudioService.setPreferences({ enabled: newEnabled });
    
    if (!newEnabled) {
      novaAudioService.stopCurrentAudio();
    }
  };

  const getAvatarAnimation = () => {
    switch (currentEmotion) {
      case 'excited':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.6, repeat: isAnimating ? 3 : 0 }
        };
      case 'celebratory':
        return {
          y: [0, -10, 0],
          scale: [1, 1.15, 1],
          transition: { duration: 0.8, repeat: isAnimating ? 2 : 0 }
        };
      case 'thoughtful':
        return {
          rotate: [0, 3, -3, 0],
          transition: { duration: 2, repeat: isAnimating ? Infinity : 0 }
        };
      default:
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Infinity }
        };
    }
  };

  const getEmotionColor = () => {
    switch (currentEmotion) {
      case 'excited':
        return 'from-yellow-400 to-orange-500';
      case 'celebratory':
        return 'from-pink-400 to-purple-500';
      case 'thoughtful':
        return 'from-blue-400 to-indigo-500';
      case 'warm':
        return 'from-rose-400 to-pink-500';
      default:
        return 'from-cyan-400 to-blue-500';
    }
  };

  const getEmotionParticles = () => {
    switch (currentEmotion) {
      case 'excited':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'celebratory':
        return <Star className="w-4 h-4 text-pink-400" />;
      case 'warm':
        return <Heart className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Nova Avatar */}
      <motion.div
        className="relative"
        animate={getAvatarAnimation()}
      >
        {/* Avatar Container */}
        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getEmotionColor()} p-1 shadow-lg`}>
          <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              className="text-2xl"
              animate={isAnimating ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.3, repeat: isAnimating ? 3 : 0 }}
            >
              🤖
            </motion.div>
          </div>
        </div>

        {/* Emotion Particles */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                {getEmotionParticles()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Indicator */}
        <AnimatePresence>
          {isAnimating && audioEnabled && (
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${getEmotionColor()} opacity-30`}
          animate={isAnimating ? {
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          } : {}}
          transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
        />
      </motion.div>

      {/* Message Bubble */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-24 left-0 max-w-xs"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm leading-relaxed">{message}</p>
              </div>
              
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white/10 border-r border-b border-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Control */}
      <motion.button
        onClick={toggleAudio}
        className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          audioEnabled 
            ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </motion.button>

      {/* Step Progress Indicator */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs text-white font-medium">
            {currentStep.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Nova Companion Hook for easy integration
export function useNovaCompanion() {
  const [novaState, setNovaState] = useState<{
    message: string;
    emotion: 'excited' | 'encouraging' | 'celebratory' | 'thoughtful' | 'warm';
    isVisible: boolean;
    audioId: string;
  }>({
    message: '',
    emotion: 'encouraging',
    isVisible: true,
    audioId: ''
  });

  const showNovaMessage = (
    message: string, 
    emotion: 'excited' | 'encouraging' | 'celebratory' | 'thoughtful' | 'warm' = 'encouraging',
    audioId?: string
  ) => {
    setNovaState({
      message,
      emotion,
      isVisible: true,
      audioId: audioId || ''
    });
  };

  const hideNova = () => {
    setNovaState(prev => ({ ...prev, isVisible: false }));
  };

  const celebrateWithNova = (message: string, audioId?: string) => {
    showNovaMessage(message, 'celebratory', audioId);
  };

  const encourageWithNova = (message: string, audioId?: string) => {
    showNovaMessage(message, 'encouraging', audioId);
  };

  const exciteWithNova = (message: string, audioId?: string) => {
    showNovaMessage(message, 'excited', audioId);
  };

  return {
    novaState,
    showNovaMessage,
    hideNova,
    celebrateWithNova,
    encourageWithNova,
    exciteWithNova
  };
}
