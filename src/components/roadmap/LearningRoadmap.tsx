'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Target,
  ChevronDown,
  ChevronRight,
  Play,
  Award,
  Calendar,
  BarChart3,
  Lightbulb,
  ExternalLink,
  Star
} from 'lucide-react';
import { 
  LearningRoadmapWithMilestones, 
  RoadmapMilestone, 
  RoadmapContent,
  Subject 
} from '../../lib/supabase-types';

interface LearningRoadmapProps {
  roadmap: LearningRoadmapWithMilestones;
  subjects: Subject[];
  onStartContent: (content: RoadmapContent) => void;
  onMarkComplete: (milestoneId: string, contentId?: string) => void;
}

export default function LearningRoadmap({ 
  roadmap, 
  subjects,
  onStartContent,
  onMarkComplete 
}: LearningRoadmapProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const getSubjectInfo = (subjectName: string) => {
    return subjects.find(s => s.name === subjectName);
  };

  const getMilestoneTypeColor = (type: string) => {
    switch (type) {
      case 'education': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'skill': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'certification': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'experience': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDuration = (months: number) => {
    if (months < 1) return `${Math.round(months * 4)} weeks`;
    if (months === 1) return '1 month';
    return `${months} months`;
  };

  const calculateProgress = () => {
    const totalMilestones = roadmap.milestones.length;
    const completedMilestones = roadmap.milestones.filter(m => m.is_completed).length;
    return totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  };

  const getNextMilestone = () => {
    return roadmap.milestones.find(m => !m.is_completed);
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Map className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{roadmap.title}</h1>
                <p className="text-sm text-gray-400">
                  {roadmap.current_education_level} → {roadmap.target_career}
                </p>
              </div>
            </div>
            
            {roadmap.description && (
              <p className="text-gray-300 mb-4">{roadmap.description}</p>
            )}
          </div>

          {/* Progress Circle */}
          <div className="text-center ml-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - calculateProgress() / 100)}`}
                  className="text-blue-400 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{Math.round(calculateProgress())}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Complete</p>
          </div>
        </div>

        {/* Roadmap Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-black/20 rounded-lg">
            <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-white">{roadmap.milestones.length}</div>
            <div className="text-xs text-gray-400">Milestones</div>
          </div>

          <div className="text-center p-3 bg-black/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-white">
              {roadmap.milestones.filter(m => m.is_completed).length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>

          <div className="text-center p-3 bg-black/20 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-white">
              {roadmap.estimated_duration_months ? formatDuration(roadmap.estimated_duration_months) : 'TBD'}
            </div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>

          <div className="text-center p-3 bg-black/20 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-white">
              {roadmap.target_completion_date 
                ? new Date(roadmap.target_completion_date).toLocaleDateString()
                : 'Flexible'
              }
            </div>
            <div className="text-xs text-gray-400">Target Date</div>
          </div>
        </div>

        {/* Next Milestone CTA */}
        {getNextMilestone() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white mb-1">Next Up:</h4>
                <p className="text-blue-300">{getNextMilestone()?.title}</p>
              </div>
              <motion.button
                onClick={() => setExpandedMilestone(getNextMilestone()?.id || null)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-4">
        {roadmap.milestones
          .sort((a, b) => a.order_index - b.order_index)
          .map((milestone, index) => {
            const isExpanded = expandedMilestone === milestone.id;
            const isCompleted = milestone.is_completed;
            const isNext = !isCompleted && roadmap.milestones.slice(0, index).every(m => m.is_completed);
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-400/50 bg-green-400/5' 
                    : isNext 
                    ? 'border-blue-400/50 bg-blue-400/5' 
                    : 'border-white/20'
                }`}
              >
                {/* Milestone Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Timeline Indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isNext 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        {index < roadmap.milestones.length - 1 && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            isCompleted ? 'bg-green-400' : 'bg-gray-600'
                          }`} />
                        )}
                      </div>

                      {/* Milestone Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                          {milestone.milestone_type && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMilestoneTypeColor(milestone.milestone_type)}`}>
                              {milestone.milestone_type}
                            </span>
                          )}
                        </div>

                        {milestone.description && (
                          <p className="text-gray-300 mb-3">{milestone.description}</p>
                        )}

                        {/* Milestone Metadata */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {milestone.estimated_duration_months && (
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDuration(milestone.estimated_duration_months)}
                            </div>
                          )}
                          
                          {milestone.difficulty_level && (
                            <div className="flex items-center">
                              <BarChart3 className={`w-4 h-4 mr-1 ${getDifficultyColor(milestone.difficulty_level)}`} />
                              <span className={getDifficultyColor(milestone.difficulty_level)}>
                                {milestone.difficulty_level}
                              </span>
                            </div>
                          )}

                          {milestone.subjects_covered && milestone.subjects_covered.length > 0 && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                              <div className="flex gap-1">
                                {milestone.subjects_covered.slice(0, 3).map((subjectName, idx) => {
                                  const subject = getSubjectInfo(subjectName);
                                  return (
                                    <span key={idx} className="text-blue-300">
                                      {subject?.icon || '📚'}
                                    </span>
                                  );
                                })}
                                {milestone.subjects_covered.length > 3 && (
                                  <span className="text-gray-400">+{milestone.subjects_covered.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {milestone.skills_developed && milestone.skills_developed.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {milestone.skills_developed.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {milestone.skills_developed.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                              +{milestone.skills_developed.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!isCompleted && (
                        <motion.button
                          onClick={() => onMarkComplete(milestone.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Mark Complete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-6">
                        {/* Learning Content */}
                        {milestone.content && milestone.content.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                              Learning Content
                            </h4>
                            <div className="space-y-3">
                              {milestone.content
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((content, idx) => (
                                  <div
                                    key={content.id}
                                    className={`p-4 rounded-lg border transition-all ${
                                      content.is_completed
                                        ? 'bg-green-500/10 border-green-400/20'
                                        : 'bg-black/20 border-gray-600 hover:border-blue-400/50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            content.is_completed
                                              ? 'bg-green-500 text-white'
                                              : 'bg-gray-600 text-gray-300'
                                          }`}>
                                            {content.is_completed ? '✓' : idx + 1}
                                          </div>
                                          <h5 className="font-semibold text-white">{content.title}</h5>
                                          {content.content_type && (
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                                              {content.content_type}
                                            </span>
                                          )}
                                        </div>
                                        
                                        {content.description && (
                                          <p className="text-gray-300 text-sm mb-2">{content.description}</p>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                          {content.estimated_study_time && (
                                            <div className="flex items-center">
                                              <Clock className="w-3 h-3 mr-1" />
                                              {content.estimated_study_time} min
                                            </div>
                                          )}
                                          
                                          {content.learning_objectives && content.learning_objectives.length > 0 && (
                                            <div className="flex items-center">
                                              <Target className="w-3 h-3 mr-1" />
                                              {content.learning_objectives.length} objectives
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-2 ml-4">
                                        {!content.is_completed && (
                                          <motion.button
                                            onClick={() => onStartContent(content)}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm font-medium transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <Play className="w-4 h-4" />
                                          </motion.button>
                                        )}
                                        
                                        {!content.is_completed && (
                                          <motion.button
                                            onClick={() => onMarkComplete(milestone.id, content.id)}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm font-medium transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            ✓
                                          </motion.button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Learning Objectives */}
                                    {content.learning_objectives && content.learning_objectives.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-gray-600">
                                        <div className="flex flex-wrap gap-1">
                                          {content.learning_objectives.map((objective, objIdx) => (
                                            <span
                                              key={objIdx}
                                              className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded"
                                            >
                                              {objective}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        {milestone.resources && milestone.resources.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <ExternalLink className="w-5 h-5 text-green-400 mr-2" />
                              Additional Resources
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {milestone.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-3 bg-black/20 hover:bg-black/30 border border-gray-600 hover:border-green-400/50 rounded-lg transition-all"
                                >
                                  <ExternalLink className="w-4 h-4 text-green-400 mr-2" />
                                  <span className="text-sm text-gray-300 truncate">{resource}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Prerequisites */}
                        {milestone.prerequisites && milestone.prerequisites.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                              Prerequisites
                            </h4>
                            <div className="space-y-2">
                              {milestone.prerequisites.map((prereq, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg"
                                >
                                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                                  <span className="text-sm text-yellow-300">{prereq}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>

      {/* Completion Celebration */}
      {calculateProgress() === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/50 rounded-2xl p-8 text-center"
        >
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Congratulations! 🎉</h2>
          <p className="text-gray-300 mb-4">
            You've completed your learning roadmap for {roadmap.target_career}!
          </p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore New Opportunities
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
