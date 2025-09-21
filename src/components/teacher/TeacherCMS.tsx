'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import {
  BookOpen,
  Plus,
  Wand2,
  Eye,
  Edit,
  Trash2,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Image,
  Video,
  Mic,
  FileText,
  Globe,
  Star,
  TrendingUp,
  Settings,
  Upload,
  Download
} from 'lucide-react';
import CourseCreationWizard from './CourseCreationWizard';
import EnhancedContentAIStudio from './EnhancedContentAIStudio';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  educationLevel: string;
  region: string;
  examinationBoard: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  enrollmentCount: number;
  revenueGenerated: number;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
  aiContentStatus: {
    text: 'pending' | 'generated' | 'approved';
    images: 'pending' | 'generated' | 'approved';
    videos: 'pending' | 'generated' | 'approved';
    voice: 'pending' | 'generated' | 'approved';
    assessments: 'pending' | 'generated' | 'approved';
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: number;
  moduleType: 'lesson' | 'assessment' | 'project' | 'discussion';
  isPublished: boolean;
  aiContent?: {
    text?: any;
    images?: any;
    videos?: any;
    voice?: any;
    assessments?: any;
  };
}

interface RegionalSyllabus {
  id: string;
  name: string;
  region: string;
  examinationBoard: string;
  educationLevel: string;
  syllabusContent: any;
}

const TeacherCMS: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'studio' | 'analytics' | 'settings'>('overview');

  const handleCourseCreated = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setShowCourseCreator(false);
  };

  // Mock data for demonstration
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Introduction to Algebra',
      description: 'Comprehensive algebra course for O-Level students',
      subject: 'Mathematics',
      educationLevel: 'O-Level',
      region: 'Zimbabwe',
      examinationBoard: 'ZIMSEC',
      status: 'published',
      enrollmentCount: 245,
      revenueGenerated: 1225.50,
      createdAt: '2024-01-15',
      updatedAt: '2024-02-20',
      modules: [],
      aiContentStatus: {
        text: 'approved',
        images: 'approved',
        videos: 'generated',
        voice: 'approved',
        assessments: 'approved'
      }
    },
    {
      id: '2',
      title: 'Physics Mechanics',
      description: 'Advanced mechanics for A-Level physics students',
      subject: 'Physics',
      educationLevel: 'A-Level',
      region: 'South Africa',
      examinationBoard: 'IEB',
      status: 'draft',
      enrollmentCount: 0,
      revenueGenerated: 0,
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      modules: [],
      aiContentStatus: {
        text: 'pending',
        images: 'pending',
        videos: 'pending',
        voice: 'pending',
        assessments: 'pending'
      }
    }
  ];

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  const handleGenerateContent = async (courseId: string) => {
    setLoading(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              aiContentStatus: {
                text: 'generated',
                images: 'generated',
                videos: 'generated',
                voice: 'generated',
                assessments: 'generated'
              }
            }
          : course
      ));
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-blue-600 bg-blue-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getContentStatusIcon = (status: 'pending' | 'generated' | 'approved') => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generated': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="glass-card p-6 float-animation"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Courses</p>
              <p className="text-2xl font-bold holographic-text">{courses.length}</p>
            </div>
            <div className="neural-button p-2 rounded-lg pulse-glow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-6 float-animation"
          style={{animationDelay: '0.2s'}}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Students</p>
              <p className="text-2xl font-bold holographic-text">
                {courses.reduce((sum, course) => sum + course.enrollmentCount, 0)}
              </p>
            </div>
            <div className="cyber-button p-2 rounded-lg">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-6 float-animation"
          style={{animationDelay: '0.4s'}}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Revenue</p>
              <p className="text-2xl font-bold holographic-text">
                ${courses.reduce((sum, course) => sum + course.revenueGenerated, 0).toFixed(2)}
              </p>
            </div>
            <div className="neural-button p-2 rounded-lg pulse-glow">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-6 float-animation"
          style={{animationDelay: '0.6s'}}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Avg Rating</p>
              <p className="text-2xl font-bold holographic-text">4.8</p>
            </div>
            <div className="cyber-button p-2 rounded-lg">
              <Star className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 holographic-text">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
            <span className="text-sm text-gray-300">Course "Introduction to Algebra" received 5 new enrollments</span>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-glow"></div>
            <span className="text-sm text-gray-300">AI content generated for "Physics Mechanics"</span>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full pulse-glow"></div>
            <span className="text-sm text-gray-300">Revenue milestone: $1000 reached</span>
            <span className="text-xs text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const CoursesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold holographic-text">My Courses</h2>
        <motion.button
          onClick={() => setShowCourseCreator(true)}
          className="neural-button px-4 py-2 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </motion.button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            className="glass-card p-6 float-animation"
            style={{animationDelay: `${index * 0.1}s`}}
            whileHover={{ scale: 1.02 }}
            layout
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white line-clamp-2 holographic-text">
                {course.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {course.status}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-xs text-gray-400">
                <Globe className="w-3 h-3 mr-1 text-cyan-400" />
                {course.region} • {course.examinationBoard}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Users className="w-3 h-3 mr-1 text-green-400" />
                {course.enrollmentCount} students
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <DollarSign className="w-3 h-3 mr-1 text-purple-400" />
                ${course.revenueGenerated.toFixed(2)} earned
              </div>
            </div>

            {/* AI Content Status */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">AI Content Status:</p>
              <div className="grid grid-cols-5 gap-1">
                <div className="flex flex-col items-center">
                  {getContentStatusIcon(course.aiContentStatus.text)}
                  <FileText className="w-3 h-3 text-gray-500 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  {getContentStatusIcon(course.aiContentStatus.images)}
                  <Image className="w-3 h-3 text-gray-500 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  {getContentStatusIcon(course.aiContentStatus.videos)}
                  <Video className="w-3 h-3 text-gray-500 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  {getContentStatusIcon(course.aiContentStatus.voice)}
                  <Mic className="w-3 h-3 text-gray-500 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  {getContentStatusIcon(course.aiContentStatus.assessments)}
                  <BarChart3 className="w-3 h-3 text-gray-500 mt-1" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <motion.button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 glass-card px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-1 neural-connections"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </motion.button>
              
              <motion.button
                onClick={() => handleGenerateContent(course.id)}
                disabled={loading}
                className="flex-1 cyber-button px-3 py-2 text-sm text-black hover:bg-cyan-300 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="w-3 h-3" />
                <span>AI Generate</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <TrendingUp className="w-16 h-16 mb-2" />
          </div>
          <p className="text-sm text-gray-600 text-center">Revenue analytics coming soon</p>
        </div>

        {/* Student Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-16 h-16 mb-2" />
          </div>
          <p className="text-sm text-gray-600 text-center">Engagement metrics coming soon</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Completion Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{course.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{course.enrollmentCount}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">85%</td>
                  <td className="py-3 px-4 text-sm text-gray-600">4.8 ⭐</td>
                  <td className="py-3 px-4 text-sm text-gray-600">${course.revenueGenerated.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization Subjects
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Mathematics</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Physics</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Chemistry</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Regions
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Zimbabwe</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">South Africa</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">UAE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Content Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-generate images</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-generate videos</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-generate voice content</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Animated Neural Background */}
      <div className="neural-bg"></div>
      
      {/* Header */}
      <div className="glass-nav border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 neural-button rounded-lg flex items-center justify-center pulse-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold holographic-text">EduFlow AI Studio</h1>
              <span className="text-sm text-gray-300">AI-Powered Content Creation</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome back, Teacher
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-gray-900 border border-gray-700",
                    userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-800",
                    userButtonPopoverActionButtonText: "text-gray-300",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
                afterSignOutUrl="/"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-nav border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'studio', label: 'Content Studio', icon: Wand2 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors neural-connections ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 holographic-text'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'courses' && <CoursesTab />}
            {activeTab === 'studio' && <EnhancedContentAIStudio />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Course Creation Wizard */}
      <CourseCreationWizard
        isOpen={showCourseCreator}
        onClose={() => setShowCourseCreator(false)}
        onCourseCreated={handleCourseCreated}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-8 max-w-md mx-4">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Generating AI Content</h3>
                  <p className="text-sm text-gray-600">Creating multi-modal educational content...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherCMS;
