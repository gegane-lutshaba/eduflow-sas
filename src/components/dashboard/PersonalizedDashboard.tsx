'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import NeonDatabaseService from '../../lib/neon-service';
import { 
  Brain, 
  Target, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PersonalizedDashboardProps {
  className?: string;
}

export default function PersonalizedDashboard({ className = '' }: PersonalizedDashboardProps) {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<any[]>([]);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [gamificationProfile, setGamificationProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get comprehensive user profile from Neon database via API
      const response = await fetch('/api/v1/users/profile');
      if (!response.ok) {
        throw new Error('Failed to load user profile');
      }
      
      const { profile, completeness } = await response.json();
      
      // Get comprehensive data using Neon service
      const comprehensiveProfile = await NeonDatabaseService.getUserComprehensiveProfile(user!.id);
      
      setUserProfile(comprehensiveProfile.profile);
      setAssessmentData(comprehensiveProfile.cognitiveAssessment);
      setCareerRecommendations(comprehensiveProfile.careerRecommendations);
      setUserCourses(comprehensiveProfile.courses);
      setGamificationProfile(comprehensiveProfile.gamification);

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load personalized data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async (careerRecommendation: any) => {
    try {
      // Call backend to generate roadmap
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/v1/assessment/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: {
            cognitive_assessment: assessmentData,
            personality_assessment: userProfile?.personality,
            learning_preferences: userProfile?.learningPreferences,
            current_education: userProfile?.education_level || 'high_school'
          },
          career_choice: {
            title: careerRecommendation.career_paths?.title || 'Professional',
            timeline: careerRecommendation.timeline_estimate || '12 months'
          },
          current_education: userProfile?.education_level || 'high_school',
          location: userProfile?.location || 'Global'
        })
      });

      if (response.ok) {
        const roadmapData = await response.json();
        
        // Save roadmap to Neon database
        await NeonDatabaseService.saveLearningRoadmap({
          userId: user!.id,
          careerPathId: careerRecommendation.career_path_id,
          title: roadmapData.roadmap.title,
          description: roadmapData.roadmap.description,
          currentEducationLevel: userProfile?.education_level || 'high_school',
          targetCareer: careerRecommendation.career_paths?.title || 'Professional',
          estimatedDurationMonths: roadmapData.roadmap.estimated_duration_months,
          totalMilestones: roadmapData.roadmap.milestones?.length || 0,
        });

        // Reload user data to show new roadmap
        await loadUserData();
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Your Personalized Dashboard</h3>
          <p className="text-gray-300">Retrieving your data from Supabase...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={loadUserData}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasCompletedAssessment = assessmentData && assessmentData.is_completed;

  return (
    <div className={className}>
      {/* Assessment Status */}
      {!hasCompletedAssessment && (
        <motion.div 
          className="mb-8 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Complete Your Assessment</h3>
              <p className="text-gray-300">Unlock personalized career recommendations and learning paths</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white font-semibold">
              Start Assessment
            </button>
          </div>
        </motion.div>
      )}

      {/* Assessment Results */}
      {hasCompletedAssessment && (
        <motion.div 
          className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <span>Assessment Complete</span>
            </h3>
            <div className="text-green-400 font-bold">
              {new Date(assessmentData.completed_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-center">
              <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{assessmentData.overall_score || 'N/A'}</div>
              <div className="text-sm text-blue-300">Overall Score</div>
            </div>
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{assessmentData.logical_reasoning_score || 'N/A'}</div>
              <div className="text-sm text-green-300">Logical Reasoning</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{assessmentData.working_memory_score || 'N/A'}</div>
              <div className="text-sm text-purple-300">Working Memory</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Career Recommendations */}
      {careerRecommendations.length > 0 && (
        <motion.div 
          className="mb-8 p-6 bg-black/40 backdrop-blur-xl border border-green-400/30 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Target className="w-6 h-6 text-green-400" />
            <span>Your Career Recommendations</span>
          </h3>
          
          <div className="space-y-3">
            {careerRecommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={rec.id}
                className="flex items-center justify-between p-4 bg-green-500/10 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all cursor-pointer"
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => handleGenerateRoadmap(rec)}
              >
                <div>
                  <div className="text-white font-semibold">
                    {rec.career_paths?.title || 'Career Path'}
                  </div>
                  <div className="text-sm text-gray-300">
                    {rec.fit_score}% match • {rec.timeline_estimate || '6-12 months'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-green-400 font-bold">{rec.fit_score}%</div>
                  <ChevronRight className="w-5 h-5 text-green-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* User Courses */}
      {userCourses.length > 0 && (
        <motion.div 
          className="mb-8 p-6 bg-black/40 backdrop-blur-xl border border-blue-400/30 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Your Personalized Courses</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {userCourses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course.id}
                className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg hover:border-blue-400/40 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{course.title}</h4>
                  <div className="text-blue-400 text-sm">{course.progress_percentage || 0}%</div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {course.subjects?.display_name || course.subject}
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Continue →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gamification Stats */}
      {gamificationProfile && (
        <motion.div 
          className="grid md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg text-center">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{gamificationProfile.total_xp}</div>
            <div className="text-sm text-purple-300">Total XP</div>
          </div>
          <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{gamificationProfile.current_level}</div>
            <div className="text-sm text-cyan-300">Level</div>
          </div>
          <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
            <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{gamificationProfile.current_streak}</div>
            <div className="text-sm text-green-300">Day Streak</div>
          </div>
          <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{Math.round(gamificationProfile.total_study_time / 60) || 0}h</div>
            <div className="text-sm text-yellow-300">Study Time</div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        className="grid md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg hover:border-blue-400/50 transition-all text-left">
          <Brain className="w-8 h-8 text-blue-400 mb-2" />
          <h4 className="font-semibold text-white mb-1">Continue Learning</h4>
          <p className="text-sm text-gray-300">Resume your AI-powered courses</p>
        </button>
        
        <button className="p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg hover:border-green-400/50 transition-all text-left">
          <Target className="w-8 h-8 text-green-400 mb-2" />
          <h4 className="font-semibold text-white mb-1">View Roadmaps</h4>
          <p className="text-sm text-gray-300">Check your learning progress</p>
        </button>
        
        <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-all text-left">
          <Sparkles className="w-8 h-8 text-purple-400 mb-2" />
          <h4 className="font-semibold text-white mb-1">Generate Content</h4>
          <p className="text-sm text-gray-300">Create new personalized courses</p>
        </button>
      </motion.div>
    </div>
  );
}
