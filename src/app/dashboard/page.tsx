'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import XPDisplay from '../../components/gamification/XPDisplay';
import AchievementDisplay from '../../components/gamification/AchievementDisplay';
import ProfileModal from '../../components/profile/ProfileModal';
import { gamificationService, GamificationProfile } from '../../lib/gamification';
import { NeonDatabaseService } from '../../lib/neon-service';
import { aiService } from '../../lib/ai-service';
import { courseService, Course } from '../../lib/course-service';
import CourseCard from '../../components/courses/CourseCard';
import CareerRecommendations from '../../components/career/CareerRecommendations';
import LearningRoadmap from '../../components/roadmap/LearningRoadmap';
import {
  Brain,
  Shield,
  Target,
  Clock,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Play,
  Settings,
  BarChart3,
  Calendar,
  MessageCircle,
  Zap,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Cpu,
  Network,
  Eye,
  Layers,
  Activity,
  X,
  GraduationCap,
  Calculator,
  Atom,
  Microscope,
  Beaker
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// STEM Subjects Modal Component
function STEMSubjectsModal({
  isOpen,
  onClose,
  subjects,
  educationLevels,
  selectedSubject,
  onSubjectSelect,
  onLevelSelect,
  userId
}: {
  isOpen: boolean;
  onClose: () => void;
  subjects: any[];
  educationLevels: any[];
  selectedSubject: any;
  onSubjectSelect: (subject: any) => void;
  onLevelSelect: (level: any) => void;
  userId: string;
}) {
  const [currentStep, setCurrentStep] = useState<'subjects' | 'levels' | 'topics' | 'preferences'>('subjects');
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [studyTime, setStudyTime] = useState('1-2 hours');
  const [studyGoal, setStudyGoal] = useState<'study' | 'assessment'>('study');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubjectSelect = (subject: any) => {
    onSubjectSelect(subject);
    setCurrentStep('levels');
  };

  const handleLevelSelect = (level: any) => {
    setSelectedLevel(level);
    onLevelSelect(level);
    setCurrentStep('preferences');
  };

  const handleGenerateCourse = async () => {
    if (!selectedSubject || !selectedLevel) {
      console.warn('⚠️ Cannot generate course: Missing subject or level selection');
      return;
    }
    
    console.log('🚀 Starting course generation...', {
      subject: selectedSubject.displayName,
      level: selectedLevel.displayName,
      studyTime,
      studyGoal,
      userId
    });
    
    setIsGenerating(true);
    try {
      const requestBody = {
        userId,
        subjectId: selectedSubject.id,
        educationLevelId: selectedLevel.id,
        studyTime,
        studyGoal,
        preferences: {
          contentType: studyGoal,
          timeCommitment: studyTime
        }
      };

      console.log('📤 Sending course generation request:', requestBody);

      const response = await fetch('/api/v1/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Course generation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const courseData = await response.json();
      console.log('✅ Course generated successfully:', courseData);
      
      // Close modal and refresh
      onClose();
      console.log('🔄 Refreshing page to show new course...');
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error generating course:', error);
      
      // Show user-friendly error message
      alert(`Failed to generate course: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsGenerating(false);
      console.log('🏁 Course generation process completed');
    }
  };

  const resetModal = () => {
    setCurrentStep('subjects');
    setSelectedLevel(null);
    onSubjectSelect(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-orange-400/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-orange-400" />
                <span>STEM Learning Hub</span>
              </h2>
              <p className="text-gray-300 mt-2">Choose your subject and create personalized learning content</p>
            </div>
            <motion.button
              onClick={() => {
                resetModal();
                onClose();
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['subjects', 'levels', 'preferences'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === step ? 'bg-orange-500 text-white' :
                    ['subjects', 'levels', 'preferences'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-1 mx-2 ${
                      ['subjects', 'levels', 'preferences'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'subjects' && (
              <motion.div
                key="subjects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Select a STEM Subject</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <motion.button
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject)}
                      className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 rounded-xl transition-all group text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          {subject.name === 'mathematics' && <Calculator className="w-6 h-6 text-white" />}
                          {subject.name === 'physics' && <Atom className="w-6 h-6 text-white" />}
                          {subject.name === 'chemistry' && <Beaker className="w-6 h-6 text-white" />}
                          {subject.name === 'biology' && <Microscope className="w-6 h-6 text-white" />}
                          {!['mathematics', 'physics', 'chemistry', 'biology'].includes(subject.name) && (
                            <span className="text-white text-sm font-bold">
                              {subject.name?.charAt(0)?.toUpperCase() || 'S'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{subject.displayName || subject.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{subject.description || 'Explore this subject'}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 'levels' && selectedSubject && (
              <motion.div
                key="levels"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <motion.button
                    onClick={() => setCurrentStep('subjects')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </motion.button>
                  <div>
                    <h3 className="text-xl font-bold text-white">Select Education Level</h3>
                    <p className="text-gray-300">for {selectedSubject.displayName || selectedSubject.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educationLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      onClick={() => handleLevelSelect(level)}
                      className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 hover:border-blue-400/40 rounded-xl transition-all group text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{level.displayName || level.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{level.description || `${level.name} level content`}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 'preferences' && selectedSubject && selectedLevel && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <motion.button
                    onClick={() => setCurrentStep('levels')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </motion.button>
                  <div>
                    <h3 className="text-xl font-bold text-white">Learning Preferences</h3>
                    <p className="text-gray-300">
                      {selectedSubject.displayName} • {selectedLevel.displayName}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Study Goal */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">What's your goal?</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        onClick={() => setStudyGoal('study')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          studyGoal === 'study' 
                            ? 'border-green-400 bg-green-400/20' 
                            : 'border-gray-600 hover:border-green-400/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-white font-semibold">Study & Learn</p>
                        <p className="text-xs text-gray-400 mt-1">Interactive lessons and content</p>
                      </motion.button>

                      <motion.button
                        onClick={() => setStudyGoal('assessment')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          studyGoal === 'assessment' 
                            ? 'border-blue-400 bg-blue-400/20' 
                            : 'border-gray-600 hover:border-blue-400/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-white font-semibold">Take Assessment</p>
                        <p className="text-xs text-gray-400 mt-1">Test your knowledge</p>
                      </motion.button>
                    </div>
                  </div>

                  {/* Study Time */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">How much time can you dedicate?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['30 min', '1-2 hours', '2-4 hours', '4+ hours'].map((time) => (
                        <motion.button
                          key={time}
                          onClick={() => setStudyTime(time)}
                          className={`p-3 rounded-lg border transition-all ${
                            studyTime === time 
                              ? 'border-purple-400 bg-purple-400/20 text-white' 
                              : 'border-gray-600 hover:border-purple-400/50 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Clock className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-sm font-medium">{time}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-6 border-t border-gray-600/30">
                    <motion.button
                      onClick={handleGenerateCourse}
                      disabled={isGenerating}
                      className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                      whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center space-x-3">
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Generating AI Course...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <Sparkles className="w-5 h-5" />
                          <span>Generate AI Course</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user && isClient) {
      console.log('🔍 Checking user profile completeness...');
      // Check profile from database first, then fallback to Clerk metadata
      checkUserProfileFromDatabase(user.id);

      // Initialize gamification profile from user metadata or create new one
      if (user?.unsafeMetadata?.assessmentData) {
        const profile = gamificationService.initializeProfile();
        // Award XP for completing assessment
        const updatedProfile = gamificationService.awardXP(profile, {
          amount: 100,
          reason: 'Completed career assessment',
          category: 'assessment'
        });
        
        // Check for achievements
        const { profile: finalProfile } = gamificationService.checkAchievements(
          updatedProfile, 
          user.unsafeMetadata.assessmentData
        );
        
        setGamificationProfile(finalProfile);
        setAssessmentResults(user.unsafeMetadata.assessmentData);
      }

      // Load subjects and education levels
      loadSubjectsAndLevels();
    }
  }, [user, isClient]);

  const checkUserProfileFromDatabase = async (userId: string) => {
    try {
      console.log('📡 Fetching user profile from database...');
      const response = await fetch('/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User profile data retrieved:', userData);
        
        // Simple logic: if profile exists, don't show modal
        if (userData.profile) {
          console.log('✅ Profile exists - hiding modal');
          setProfileData(userData.profile);
          setShowProfileModal(false);
          // Generate courses if profile exists
          generateCoursesIfNeeded(userId, userData.profile);
        } else {
          console.log('⚠️ No profile found, showing profile modal');
          setShowProfileModal(true);
        }
      } else {
        console.log('⚠️ No profile found in database, checking Clerk metadata...');
        // Fallback to Clerk metadata
        const profileCompleted = user?.unsafeMetadata?.profileCompleted;
        const profileDataFromUser = user?.unsafeMetadata?.profileData;
        
        if (!profileCompleted) {
          console.log('⚠️ No profile in Clerk either, showing profile modal');
          setShowProfileModal(true);
        } else {
          console.log('✅ Found profile in Clerk metadata');
          setProfileData(profileDataFromUser);
          generateCoursesIfNeeded(userId, profileDataFromUser);
        }
      }
    } catch (error) {
      console.error('❌ Error checking user profile:', error);
      // Fallback to showing profile modal
      setShowProfileModal(true);
    }
  };

  const loadSubjectsAndLevels = async () => {
    try {
      console.log('🔄 Loading subjects and education levels...');
      const response = await fetch('/api/v1/subjects');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Successfully loaded subjects:', data.subjects?.length || 0);
      console.log('✅ Successfully loaded education levels:', data.educationLevels?.length || 0);
      
      setSubjects(data.subjects || []);
      setEducationLevels(data.educationLevels || []);
    } catch (error) {
      console.error('❌ Error loading subjects and education levels:', error);
      // Set fallback data if API fails
      setSubjects([
        { id: 1, name: 'mathematics', displayName: 'Mathematics', description: 'Mathematical concepts and problem solving' },
        { id: 2, name: 'physics', displayName: 'Physics', description: 'Physical sciences and natural phenomena' },
        { id: 3, name: 'chemistry', displayName: 'Chemistry', description: 'Chemical reactions and molecular science' },
        { id: 4, name: 'biology', displayName: 'Biology', description: 'Life sciences and biological systems' }
      ]);
      setEducationLevels([
        { id: 1, name: 'primary', displayName: 'Primary School', description: 'Elementary education level' },
        { id: 2, name: 'secondary', displayName: 'Secondary School', description: 'High school education level' },
        { id: 3, name: 'undergraduate', displayName: 'Undergraduate', description: 'University bachelor degree level' }
      ]);
    }
  };

  // Initialize neural network animation
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
      }> = [];

      // Create neural network particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
          
          // Draw connections
          particles.forEach((other, j) => {
            if (i !== j) {
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 150) {
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          });
          
          // Draw particle
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
    }
  }, []);

  const generateCoursesIfNeeded = async (userId: string, profileData: any) => {
    try {
      setIsLoadingCourses(true);
      
      // Check if user already has courses
      const existingCourses = await courseService.getUserCourses(userId);
      
      if (existingCourses.length === 0 && profileData) {
        setIsGeneratingCourses(true);
        // Generate personalized courses based on profile
        const newCourses = await courseService.generateCoursesForProfile(userId, profileData);
        setUserCourses(newCourses);
        setIsGeneratingCourses(false);
      } else {
        setUserCourses(existingCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setIsGeneratingCourses(false);
      // Show fallback courses or error message
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const hasCompletedAssessment = user?.unsafeMetadata?.assessmentData;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* STEM Subjects Modal */}
      <STEMSubjectsModal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        subjects={subjects}
        educationLevels={educationLevels}
        selectedSubject={selectedSubject}
        onSubjectSelect={setSelectedSubject}
        onLevelSelect={setSelectedLevel}
        userId={user?.id || ''}
      />

      {/* Neural Network Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
      />

      {/* Animated AI Particles */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${(i * 5.26) % 100}%`,
                top: `${(i * 7.89) % 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/20 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CogniFlow
              </span>
              <motion.div
                className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-xs text-blue-300 font-medium">AI POWERED</span>
              </motion.div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Dashboard
              </Link>
              <Link href="/learning" className="text-gray-300 hover:text-white transition-colors relative group">
                3D Learning
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/progress" className="text-gray-300 hover:text-white transition-colors relative group">
                Progress
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/community" className="text-gray-300 hover:text-white transition-colors relative group">
                Community
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Welcome Section */}
          <motion.div 
            className="mb-16 text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/30 rounded-full"
                animate={{
                  y: [-10, 10, -10]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -top-2 -right-6 w-6 h-6 bg-purple-500/30 rounded-full"
                animate={{
                  y: [-10, 10, -10]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Welcome back,
                </span>
                <br />
                <motion.span 
                  className="text-white"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(59, 130, 246, 0.8)",
                      "0 0 20px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {user?.firstName}!
                </motion.span>
              </h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              >
                Your AI-powered career transformation continues. Step into the future of learning with 
                <span className="text-blue-400 font-semibold"> immersive 3D environments</span> and 
                <span className="text-purple-400 font-semibold"> intelligent personalization</span>.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/learning"
                    className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg flex items-center space-x-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Play className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Enter AI Learning World</span>
                    <ChevronRight className="w-6 h-6 relative z-10" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Assessment Status Banner */}
          {!hasCompletedAssessment && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 p-8"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5" />
                <div className="relative z-10 flex items-center space-x-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">🚀 Unlock Your AI-Powered Learning Journey</h3>
                    <p className="text-gray-300 mb-4">
                      Complete our advanced AI assessment to unlock personalized courses, career recommendations, and your custom learning path.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/onboarding"
                        className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        <Cpu className="w-5 h-5" />
                        <span>Start AI Assessment</span>
                        <Sparkles className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* STEM Subjects Section */}
              <motion.div 
                className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-orange-400/30 p-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-orange-400" />
                    <span>STEM Learning Hub</span>
                  </h2>
                  
                  <div className="space-y-6">
                    {subjects.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {subjects.slice(0, 6).map((subject, index) => (
                            <motion.button
                              key={subject.id}
                              onClick={() => {
                                setSelectedSubject(subject);
                                setShowSubjectModal(true);
                              }}
                              className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 transition-all group text-left"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  {subject.name === 'mathematics' && <Calculator className="w-5 h-5 text-white" />}
                                  {subject.name === 'physics' && <Atom className="w-5 h-5 text-white" />}
                                  {subject.name === 'chemistry' && <Beaker className="w-5 h-5 text-white" />}
                                  {subject.name === 'biology' && <Microscope className="w-5 h-5 text-white" />}
                                  {!['mathematics', 'physics', 'chemistry', 'biology'].includes(subject.name) && (
                                    <span className="text-white text-xs font-bold">
                                      {subject.name?.charAt(0)?.toUpperCase() || 'S'}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{subject.displayName || subject.name}</p>
                                  <p className="text-xs text-gray-400">Click to start</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        
                        <motion.button
                          onClick={() => setShowSubjectModal(true)}
                          className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <Sparkles className="w-5 h-5" />
                            <span>Explore All STEM Subjects</span>
                          </div>
                        </motion.button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Loading STEM Subjects</h3>
                        <p className="text-gray-300">
                          Fetching available subjects for your learning journey...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Assessment Status Card */}
              <motion.div 
                className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-cyan-400/30 p-6"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-cyan-400" />
                    <span>AI Assessment Status</span>
                  </h3>
                  
                  {hasCompletedAssessment ? (
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-white font-bold">Assessment Complete</p>
                          <p className="text-xs text-gray-300">AI courses unlocked</p>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-bold">Assessment Pending</p>
                          <p className="text-xs text-gray-300">Complete to unlock AI features</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link 
                          href="/onboarding"
                          className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white font-bold hover:from-yellow-600 hover:to-orange-600 transition-all"
                        >
                          <Cpu className="w-5 h-5" />
                          <span>Start Assessment</span>
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profile Management */}
              <motion.div 
                className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-400/30 p-6"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
              >
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Settings className="w-6 h-6 text-purple-400" />
                    <span>Profile Management</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {profileData ? (
                      <div className="space-y-3">
                        <motion.div 
                          className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20"
                          animate={{ scale: [1, 1.01, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium text-sm">Profile Complete</p>
                            <p className="text-xs text-gray-300">{profileData.firstName} {profileData.lastName}</p>
                          </div>
                        </motion.div>
                        
                        <motion.button
                          onClick={() => setShowProfileModal(true)}
                          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl text-white font-medium hover:border-purple-400/50 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <motion.div 
                          className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium text-sm">Profile Incomplete</p>
                            <p className="text-xs text-gray-300">Complete your profile to get started</p>
                          </div>
                        </motion.div>
                        
                        <motion.button
                          onClick={() => setShowProfileModal(true)}
                          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white font-bold hover:from-yellow-600 hover:to-orange-600 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Complete Profile</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-green-400/30 p-6"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-cyan-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Network className="w-6 h-6 text-green-400" />
                    <span>Quick Actions</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href="/learning"
                        className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 hover:border-blue-400/40 transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-semibold">3D Learning</span>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href="/onboarding"
                        className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-400/20 hover:border-green-400/40 transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-semibold">Assessment</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
