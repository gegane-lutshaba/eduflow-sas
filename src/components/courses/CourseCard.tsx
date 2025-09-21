'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Clock, 
  Target, 
  Play, 
  BookOpen,
  Star,
  TrendingUp,
  CheckCircle,
  Lock
} from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    track: 'ai' | 'cybersecurity';
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration: number;
    learning_objectives: string[];
    tags: string[];
    progress?: {
      completion_percentage: number;
      current_module_id?: string;
      time_spent: number;
    };
    modules: Array<{
      id: string;
      title: string;
      module_type: string;
      estimated_duration: number;
    }>;
  };
  onStart?: () => void;
  onContinue?: () => void;
  className?: string;
}

export default function CourseCard({ course, onStart, onContinue, className = '' }: CourseCardProps) {
  const isStarted = course.progress && course.progress.completion_percentage > 0;
  const isCompleted = course.progress && course.progress.completion_percentage >= 100;
  
  const getTrackIcon = () => {
    return course.track === 'ai' ? Brain : Shield;
  };

  const getTrackColor = () => {
    return course.track === 'ai' 
      ? 'from-blue-500 to-purple-600' 
      : 'from-green-500 to-cyan-500';
  };

  const getDifficultyColor = () => {
    switch (course.difficulty_level) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const TrackIcon = getTrackIcon();

  return (
    <motion.div
      className={`glass-card p-6 hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${getTrackColor()}`}>
            <TrackIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${getDifficultyColor()}`}>
                {course.difficulty_level.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{course.track.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        {isCompleted && (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Progress Bar */}
      {isStarted && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs text-blue-400 font-medium">
              {Math.round(course.progress?.completion_percentage || 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full bg-gradient-to-r ${getTrackColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${course.progress?.completion_percentage || 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Course Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-400">Duration</div>
          <div className="text-sm font-medium text-white">
            {formatDuration(course.estimated_duration)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BookOpen className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-400">Modules</div>
          <div className="text-sm font-medium text-white">
            {course.modules.length}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-400">Objectives</div>
          <div className="text-sm font-medium text-white">
            {course.learning_objectives.length}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {course.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
        {course.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-xs text-gray-400">
            +{course.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Action Button */}
      <motion.button
        onClick={isStarted ? onContinue : onStart}
        className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${
          isCompleted
            ? 'bg-green-500/20 border border-green-400 text-green-400 hover:bg-green-500/30'
            : isStarted
            ? `bg-gradient-to-r ${getTrackColor()} text-white hover:shadow-lg`
            : `bg-gradient-to-r ${getTrackColor()} text-white hover:shadow-lg`
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isCompleted ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Review Course</span>
          </>
        ) : isStarted ? (
          <>
            <Play className="w-4 h-4" />
            <span>Continue Learning</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Course</span>
          </>
        )}
      </motion.button>

      {/* Time Spent (if started) */}
      {isStarted && course.progress && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">
            Time spent: {formatDuration(course.progress.time_spent)}
          </span>
        </div>
      )}
    </motion.div>
  );
}
