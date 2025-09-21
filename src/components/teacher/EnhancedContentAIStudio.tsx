'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import ContentEditor from './ContentEditor';
import { 
  BookOpen, 
  Edit3, 
  Eye, 
  Play, 
  Image, 
  Video, 
  Mic, 
  FileText, 
  CheckCircle,
  Clock,
  Users,
  Star,
  TrendingUp,
  Settings,
  Download,
  Share2,
  ArrowLeft,
  Wand2,
  Brain,
  Zap,
  Layers,
  Target,
  Sparkles,
  RefreshCw,
  Save,
  Plus,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedDuration: number;
  contentType: string;
  status: string;
  enrollmentCount: number;
  averageRating: string;
  totalRatings: number;
  aiContentStatus: {
    text: string;
    images: string;
    videos: string;
    voice: string;
    assessments: string;
  };
  generatedContent: any;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  contentType: string;
  contentData: {
    coreContent?: string;
    biteSizedContent?: string;
    videoScript?: string;
    imagePrompts?: string[];
    voiceScript?: string;
    assessments?: any;
  };
  aiGenerated: boolean;
  estimatedDuration: number;
  learningObjectives: string[];
  isPublished: boolean;
}

interface ContentVariation {
  type: 'core' | 'bite-sized' | 'video-script' | 'image-prompts' | 'voice-script' | 'assessments';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  status: 'empty' | 'generating' | 'completed' | 'error';
}

interface EnhancedContentAIStudioProps {
  className?: string;
}

export default function EnhancedContentAIStudio({ className }: EnhancedContentAIStudioProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<{
    moduleId: string;
    contentType: 'core' | 'bite-sized' | 'video-script' | 'image-prompts' | 'voice-script' | 'assessments';
    initialContent: string;
  } | null>(null);
  const [contentVariations, setContentVariations] = useState<ContentVariation[]>([
    {
      type: 'core',
      label: 'Core Content',
      icon: FileText,
      description: 'Main educational content aligned with learning objectives',
      status: 'empty'
    },
    {
      type: 'bite-sized',
      label: 'Bite-sized Content',
      icon: Layers,
      description: 'Summarized, digestible chunks for quick learning',
      status: 'empty'
    },
    {
      type: 'video-script',
      label: 'Video Script',
      icon: Video,
      description: 'Optimized script for video content generation',
      status: 'empty'
    },
    {
      type: 'image-prompts',
      label: 'Image Prompts',
      icon: Image,
      description: 'DALL-E prompts for visual educational content',
      status: 'empty'
    },
    {
      type: 'voice-script',
      label: 'Voice Script',
      icon: Mic,
      description: 'Audio-optimized content for voice agents',
      status: 'empty'
    },
    {
      type: 'assessments',
      label: 'Assessments',
      icon: Target,
      description: 'Quizzes and evaluation materials',
      status: 'empty'
    }
  ]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      updateContentVariationStatus();
    }
  }, [selectedModule]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/teacher/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`/api/v1/teacher/courses/${courseId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCourse(data.course);
        setModules(data.modules);
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    }
  };

  const updateContentVariationStatus = () => {
    if (!selectedModule) return;

    const updatedVariations = contentVariations.map(variation => {
      const hasContent = selectedModule.contentData[variation.type === 'core' ? 'coreContent' : 
                         variation.type === 'bite-sized' ? 'biteSizedContent' :
                         variation.type === 'video-script' ? 'videoScript' :
                         variation.type === 'image-prompts' ? 'imagePrompts' :
                         variation.type === 'voice-script' ? 'voiceScript' :
                         'assessments'];
      
      return {
        ...variation,
        status: hasContent ? 'completed' : 'empty'
      } as ContentVariation;
    });

    setContentVariations(updatedVariations);
  };

  const generateContent = async (variationType: string) => {
    if (!selectedModule) return;

    try {
      setGenerating(variationType);
      setError(null);
      setSuccess(null);
      
      // Update status to generating
      setContentVariations(prev => prev.map(v => 
        v.type === variationType ? { ...v, status: 'generating' } : v
      ));

      const response = await fetch(`/api/v1/teacher/modules/${selectedModule.id}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: variationType,
          moduleData: selectedModule
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update module with new content
        setSelectedModule(prev => prev ? {
          ...prev,
          contentData: {
            ...prev.contentData,
            [variationType === 'core' ? 'coreContent' : 
             variationType === 'bite-sized' ? 'biteSizedContent' :
             variationType === 'video-script' ? 'videoScript' :
             variationType === 'image-prompts' ? 'imagePrompts' :
             variationType === 'voice-script' ? 'voiceScript' :
             'assessments']: data.content
          }
        } : null);

        // Update status to completed
        setContentVariations(prev => prev.map(v => 
          v.type === variationType ? { ...v, status: 'completed' } : v
        ));

        setSuccess(`${variationType} content generated successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        // Update status to error
        setContentVariations(prev => prev.map(v => 
          v.type === variationType ? { ...v, status: 'error' } : v
        ));
        
        setError(data.details || `Failed to generate ${variationType} content`);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setContentVariations(prev => prev.map(v => 
        v.type === variationType ? { ...v, status: 'error' } : v
      ));
      
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setGenerating(null);
    }
  };

  // Clear error/success messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'generating': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case 'error': return 'from-red-500/20 to-pink-500/20 border-red-400/30';
      default: return 'from-gray-500/10 to-slate-500/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'generating': return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Plus className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error/Success Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-medium">Error</h4>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 ml-auto"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-green-400 font-medium">Success</h4>
                  <p className="text-green-300 text-sm mt-1">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="text-green-400 hover:text-green-300 ml-auto"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          {(selectedCourse || selectedModule) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (selectedModule) {
                  setSelectedModule(null);
                } else {
                  setSelectedCourse(null);
                  setSelectedModule(null);
                }
              }}
              className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Content AI Studio
            </h1>
            <p className="text-gray-400 mt-1">
              {selectedModule ? `Editing: ${selectedModule.title}` :
               selectedCourse ? `Managing: ${selectedCourse.title}` :
               'Create and manage AI-powered educational content'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {editingContent ? (
          /* Content Editor */
          <ContentEditor
            key="content-editor"
            moduleId={editingContent.moduleId}
            contentType={editingContent.contentType}
            initialContent={editingContent.initialContent}
            onBack={() => setEditingContent(null)}
            onSave={(content) => {
              // Update the module content locally
              if (selectedModule) {
                const contentKey = editingContent.contentType === 'core' ? 'coreContent' : 
                                 editingContent.contentType === 'bite-sized' ? 'biteSizedContent' :
                                 editingContent.contentType === 'video-script' ? 'videoScript' :
                                 editingContent.contentType === 'image-prompts' ? 'imagePrompts' :
                                 editingContent.contentType === 'voice-script' ? 'voiceScript' :
                                 'assessments';
                
                setSelectedModule(prev => prev ? {
                  ...prev,
                  contentData: {
                    ...prev.contentData,
                    [contentKey]: content
                  }
                } : null);
              }
              
              setSuccess('Content saved successfully!');
              setTimeout(() => setSuccess(null), 3000);
            }}
          />
        ) : !selectedCourse ? (
          /* Course Selection Grid */
          <motion.div
            key="course-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => loadCourseDetails(course.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
                      <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* AI Content Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(course.aiContentStatus).map(([type, status]) => (
                    <Badge 
                      key={type} 
                      variant="secondary" 
                      className={`text-xs ${
                        status === 'generated' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                        status === 'generating' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-400/30'
                      }`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(course.estimatedDuration)}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    {course.enrollmentCount}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    {course.averageRating}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Level {course.difficulty}
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Manage Content
                </Button>
              </motion.div>
            ))}

            {courses.length === 0 && (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
                <p className="text-gray-400 mb-4">Create your first course to get started with the Content AI Studio</p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Course
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : !selectedModule ? (
          /* Course Detail View */
          <motion.div
            key="course-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Course Header */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                    <p className="text-gray-400">{selectedCourse.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatDuration(selectedCourse.estimatedDuration)}</div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Level {selectedCourse.difficulty}</div>
                  <div className="text-sm text-gray-400">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{modules.length}</div>
                  <div className="text-sm text-gray-400">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{selectedCourse.enrollmentCount}</div>
                  <div className="text-sm text-gray-400">Students</div>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Course Modules ({modules.length})</h3>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedModule(module)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-500/20 text-blue-400 text-sm font-medium px-3 py-1 rounded-full border border-blue-400/30">
                            Module {index + 1}
                          </span>
                          <h4 className="font-bold text-white">{module.title}</h4>
                          {module.aiGenerated && (
                            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400 border-purple-400/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(module.estimatedDuration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {module.learningObjectives.length} objectives
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {module.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
                          <Wand2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No modules found for this course</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Module Content Editor */
          <motion.div
            key="module-editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Module Header */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedModule.title}</h2>
                    <p className="text-gray-400">{selectedModule.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="flex flex-wrap gap-2">
                {selectedModule.learningObjectives.map((objective, index) => (
                  <Badge key={index} variant="outline" className="border-blue-400/30 text-blue-400">
                    {objective}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Variations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentVariations.map((variation, index) => {
                const IconComponent = variation.icon;
                return (
                  <motion.div
                    key={variation.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br ${getStatusColor(variation.status)}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{variation.label}</h4>
                          <p className="text-xs text-gray-400 mt-1">{variation.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(variation.status)}
                    </div>

                    <div className="space-y-3">
                      {variation.status === 'completed' && (
                        <div className="text-sm text-gray-300 bg-black/20 rounded p-2">
                          Content available
                        </div>
                      )}
                      
                      {variation.status === 'generating' && (
                        <div className="text-sm text-blue-400 bg-blue-500/10 rounded p-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating content...
                        </div>
                      )}

                      {variation.status === 'error' && (
                        <div className="text-sm text-red-400 bg-red-500/10 rounded p-2">
                          Generation failed
                        </div>
                      )}

                      <div className="flex gap-2">
                        {variation.status === 'empty' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                            onClick={() => generateContent(variation.type)}
                            disabled={generating !== null}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Generate
                          </Button>
                        )}
                        
                        {variation.status === 'completed' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 glass-card border-gray-600 hover:border-green-400 text-gray-300 hover:text-white"
                              onClick={() => {
                                const contentKey = variation.type === 'core' ? 'coreContent' : 
                                                 variation.type === 'bite-sized' ? 'biteSizedContent' :
                                                 variation.type === 'video-script' ? 'videoScript' :
                                                 variation.type === 'image-prompts' ? 'imagePrompts' :
                                                 variation.type === 'voice-script' ? 'voiceScript' :
                                                 'assessments';
                                const content = selectedModule?.contentData[contentKey] || '';
                                setEditingContent({
                                  moduleId: selectedModule!.id,
                                  contentType: variation.type,
                                  initialContent: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
                                });
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white"
                              onClick={() => generateContent(variation.type)}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Regenerate
                            </Button>
                          </>
                        )}
                        
                        {variation.status === 'error' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                            onClick={() => generateContent(variation.type)}
                            disabled={generating !== null}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
