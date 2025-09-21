'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Clock,
  Star,
  ChevronRight,
  Users,
  Award,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';
import { CareerRecommendationWithPath, Subject } from '../../lib/supabase-types';

interface CareerRecommendationsProps {
  recommendations: CareerRecommendationWithPath[];
  subjects: Subject[];
  onSelectCareer: (career: CareerRecommendationWithPath) => void;
}

export default function CareerRecommendations({ 
  recommendations, 
  subjects,
  onSelectCareer 
}: CareerRecommendationsProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendationWithPath | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'text-green-400 bg-green-400/10';
      case 'high': return 'text-blue-400 bg-blue-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0.2) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (rate > 0.1) return <TrendingUp className="w-4 h-4 text-blue-400" />;
    return <TrendingUp className="w-4 h-4 text-yellow-400" />;
  };

  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
      return `$${num}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getSubjectInfo = (subjectName: string) => {
    return subjects.find(s => s.name === subjectName);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Your Career Recommendations 🎯
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Based on your assessment results, here are personalized career paths that match your 
          cognitive strengths, personality, and interests.
        </p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => {
          const career = recommendation.career_path;
          const isExpanded = expandedCard === recommendation.id;
          
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-blue-400/50 transition-all duration-300"
            >
              {/* Main Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{career.title}</h3>
                        <p className="text-sm text-gray-400">{career.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {career.description}
                    </p>
                  </div>

                  {/* Fit Score */}
                  <div className="text-center ml-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-700"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - recommendation.fit_score / 100)}`}
                          className="text-blue-400 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{recommendation.fit_score}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Fit Score</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-white">
                      {formatSalary(career.average_salary_min || 0, career.average_salary_max || 0)}
                    </div>
                    <div className="text-xs text-gray-400">Salary Range</div>
                  </div>

                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      {getGrowthIcon(career.job_growth_rate || 0)}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {((career.job_growth_rate || 0) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">Growth Rate</div>
                  </div>

                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(career.demand_level || 'medium')}`}>
                      {career.demand_level?.replace('-', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Demand</div>
                  </div>

                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-white">
                      {recommendation.timeline_estimate || '6-12 months'}
                    </div>
                    <div className="text-xs text-gray-400">Timeline</div>
                  </div>
                </div>

                {/* Required Subjects */}
                {career.required_subjects && career.required_subjects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Required Subjects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {career.required_subjects.map((subjectName, idx) => {
                        const subject = getSubjectInfo(subjectName);
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-300"
                          >
                            {subject?.icon && <span className="mr-1">{subject.icon}</span>}
                            {subject?.display_name || subjectName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : recommendation.id)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {isExpanded ? 'Show Less' : 'Learn More'}
                    </span>
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <motion.button
                    onClick={() => onSelectCareer(recommendation)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Roadmap
                  </motion.button>
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
                      {/* Reasoning */}
                      {recommendation.reasoning && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Target className="w-5 h-5 text-blue-400 mr-2" />
                            Why This Career Fits You
                          </h4>
                          <p className="text-gray-300 leading-relaxed">
                            {recommendation.reasoning}
                          </p>
                        </div>
                      )}

                      {/* Skills Required */}
                      {career.skills_required && career.skills_required.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                            Key Skills Required
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {career.skills_required.map((skill, idx) => (
                              <div
                                key={idx}
                                className="flex items-center p-2 bg-black/20 rounded-lg"
                              >
                                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                                <span className="text-sm text-gray-300">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {recommendation.missing_skills && recommendation.missing_skills.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <BookOpen className="w-5 h-5 text-orange-400 mr-2" />
                            Skills to Develop
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {recommendation.missing_skills.map((skill, idx) => (
                              <div
                                key={idx}
                                className="flex items-center p-2 bg-orange-500/10 border border-orange-400/20 rounded-lg"
                              >
                                <Award className="w-4 h-4 text-orange-400 mr-2" />
                                <span className="text-sm text-orange-300">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      {recommendation.next_steps && recommendation.next_steps.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <ChevronRight className="w-5 h-5 text-green-400 mr-2" />
                            Next Steps
                          </h4>
                          <div className="space-y-2">
                            {recommendation.next_steps.map((step, idx) => (
                              <div
                                key={idx}
                                className="flex items-start p-3 bg-green-500/10 border border-green-400/20 rounded-lg"
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                  {idx + 1}
                                </div>
                                <span className="text-sm text-green-300">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Environment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg">
                          <h5 className="font-semibold text-white mb-2 flex items-center">
                            <MapPin className="w-4 h-4 text-blue-400 mr-2" />
                            Work Locations
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {career.available_locations?.map((location, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 rounded-lg">
                          <h5 className="font-semibold text-white mb-2 flex items-center">
                            <Users className="w-4 h-4 text-purple-400 mr-2" />
                            Remote Work
                          </h5>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            career.remote_friendly 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {career.remote_friendly ? 'Remote Friendly' : 'On-site Required'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400">
            Complete your assessment to get personalized career recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
