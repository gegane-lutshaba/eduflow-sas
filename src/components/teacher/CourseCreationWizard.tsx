'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Globe,
  Target,
  Clock,
  Users,
  Wand2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  Image,
  Video,
  Mic,
  BarChart3,
  X
} from 'lucide-react';

interface CourseCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: any) => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  learningOutcomes: string[];
  notes: string;
  estimatedDuration: number;
  orderIndex: number;
}

interface CourseData {
  title: string;
  description: string;
  subject: string;
  educationLevel: string;
  region: string;
  examinationBoard: string;
  difficulty: number;
  estimatedDuration: number;
  learningObjectives: string[];
  contentTypes: string[];
  syllabusAlignment: string;
  syllabusOverview: string;
  modules: Module[];
}

const CourseCreationWizard: React.FC<CourseCreationWizardProps> = ({
  isOpen,
  onClose,
  onCourseCreated
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    subject: '',
    educationLevel: '',
    region: '',
    examinationBoard: '',
    difficulty: 5,
    estimatedDuration: 60,
    learningObjectives: [''],
    contentTypes: ['text', 'images', 'videos', 'voice', 'assessments'],
    syllabusAlignment: '',
    syllabusOverview: '',
    modules: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const steps = [
    { title: 'Basic Information', icon: BookOpen },
    { title: 'Regional Settings', icon: Globe },
    { title: 'Learning Objectives', icon: Target },
    { title: 'Syllabus Structure', icon: FileText },
    { title: 'Content Configuration', icon: Sparkles },
    { title: 'Review & Generate', icon: Wand2 }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Economics', 'Business Studies'
  ];

  const educationLevels = [
    'Primary', 'O-Level', 'A-Level', 'Undergraduate', 'Postgraduate'
  ];

  const regions = [
    { value: 'zimbabwe', label: 'Zimbabwe', boards: ['ZIMSEC'] },
    { value: 'south_africa', label: 'South Africa', boards: ['DBE', 'IEB'] },
    { value: 'uae', label: 'UAE', boards: ['MOE', 'IB'] },
    { value: 'uk', label: 'United Kingdom', boards: ['AQA', 'OCR', 'WJEC', 'Edexcel'] },
    { value: 'usa', label: 'United States', boards: ['College Board', 'Common Core'] }
  ];

  const contentTypeOptions = [
    { id: 'text', label: 'Text Content', icon: FileText, description: 'Comprehensive written materials' },
    { id: 'images', label: 'Images & Diagrams', icon: Image, description: 'AI-generated educational visuals' },
    { id: 'videos', label: 'Video Content', icon: Video, description: 'Educational video scripts and content' },
    { id: 'voice', label: 'Audio Content', icon: Mic, description: 'Narrated lessons and explanations' },
    { id: 'assessments', label: 'Assessments', icon: BarChart3, description: 'Quizzes and evaluation materials' }
  ];

  const updateCourseData = (field: keyof CourseData, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const addLearningObjective = () => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateLearningObjective = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const removeLearningObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const toggleContentType = (contentType: string) => {
    setCourseData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter(type => type !== contentType)
        : [...prev.contentTypes, contentType]
    }));
  };

  // Module management functions
  const addModule = () => {
    const newModule: Module = {
      id: `module_${Date.now()}`,
      title: '',
      description: '',
      learningOutcomes: [''],
      notes: '',
      estimatedDuration: 30,
      orderIndex: courseData.modules.length
    };
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const updateModule = (moduleId: string, field: keyof Module, value: any) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    }));
  };

  const removeModule = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
        .map((module, index) => ({ ...module, orderIndex: index }))
    }));
  };

  const addLearningOutcome = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, learningOutcomes: [...module.learningOutcomes, ''] }
          : module
      )
    }));
  };

  const updateLearningOutcome = (moduleId: string, outcomeIndex: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              learningOutcomes: module.learningOutcomes.map((outcome, index) =>
                index === outcomeIndex ? value : outcome
              )
            }
          : module
      )
    }));
  };

  const removeLearningOutcome = (moduleId: string, outcomeIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              learningOutcomes: module.learningOutcomes.filter((_, index) => index !== outcomeIndex)
            }
          : module
      )
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateCourse = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Show progress updates
      const progressSteps = [
        { step: 20, message: 'Analyzing curriculum requirements...' },
        { step: 40, message: 'Generating text content...' },
        { step: 60, message: 'Creating image prompts...' },
        { step: 80, message: 'Generating video scripts...' },
        { step: 100, message: 'Finalizing course structure...' }
      ];

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const nextStep = progressSteps.find(step => step.step > prev);
          return nextStep ? nextStep.step : prev;
        });
      }, 1000);

      // Call the API endpoint
      const response = await fetch('/api/v1/teacher/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          subject: courseData.subject,
          educationLevel: courseData.educationLevel,
          region: courseData.region,
          examinationBoard: courseData.examinationBoard,
          difficulty: courseData.difficulty,
          estimatedDuration: courseData.estimatedDuration,
          learningObjectives: courseData.learningObjectives.filter(obj => obj.trim()),
          contentTypes: courseData.contentTypes,
          syllabusAlignment: courseData.syllabusAlignment,
          syllabusOverview: courseData.syllabusOverview,
          modules: courseData.modules.map(module => ({
            id: module.id,
            title: module.title,
            description: module.description,
            learningOutcomes: module.learningOutcomes.filter(outcome => outcome.trim()),
            notes: module.notes,
            estimatedDuration: module.estimatedDuration,
            orderIndex: module.orderIndex
          }))
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Course generation failed');
      }

      setGenerationProgress(100);

      // Create the course object for the UI
      const newCourse = {
        id: result.course.id,
        title: result.course.title,
        description: result.course.description,
        subject: result.course.subject,
        educationLevel: result.course.educationLevel,
        region: result.course.region,
        examinationBoard: result.course.examinationBoard,
        status: result.course.status,
        enrollmentCount: result.course.enrollmentCount,
        revenueGenerated: result.course.revenueGenerated,
        createdAt: result.course.createdAt,
        updatedAt: result.course.updatedAt,
        modules: result.course.modules || [],
        aiContentStatus: result.course.aiContentStatus,
        generatedContent: result.course.generatedContent,
        generationMetadata: result.generationMetadata
      };

      onCourseCreated(newCourse);
      onClose();
    } catch (error) {
      console.error('Course generation failed:', error);
      // Show error to user (you might want to add error state)
      alert('Course generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return courseData.title && courseData.description && courseData.subject;
      case 1:
        return courseData.region && courseData.examinationBoard && courseData.educationLevel;
      case 2:
        return courseData.learningObjectives.some(obj => obj.trim());
      case 3:
        return courseData.syllabusOverview.trim() && courseData.modules.length > 0 && 
               courseData.modules.every(module => 
                 module.title.trim() && module.description.trim() && 
                 module.learningOutcomes.some(outcome => outcome.trim())
               );
      case 4:
        return courseData.contentTypes.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => updateCourseData('title', e.target.value)}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white placeholder-gray-400 neural-connections"
                placeholder="e.g., Introduction to Algebra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => updateCourseData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white placeholder-gray-400 neural-connections"
                placeholder="Describe what students will learn in this course..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <select
                value={courseData.subject}
                onChange={(e) => updateCourseData('subject', e.target.value)}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white neural-connections"
              >
                <option value="" className="bg-gray-900 text-gray-300">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="bg-gray-900 text-white">{subject}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Easy</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={courseData.difficulty}
                    onChange={(e) => updateCourseData('difficulty', parseInt(e.target.value))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-sm text-gray-400">Hard</span>
                  <span className="text-sm font-medium holographic-text w-8">
                    {courseData.difficulty}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={courseData.estimatedDuration}
                  onChange={(e) => updateCourseData('estimatedDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white placeholder-gray-400 neural-connections"
                  min="30"
                  max="480"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Region *
              </label>
              <select
                value={courseData.region}
                onChange={(e) => {
                  updateCourseData('region', e.target.value);
                  updateCourseData('examinationBoard', '');
                }}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white neural-connections"
              >
                <option value="" className="bg-gray-900 text-gray-300">Select a region</option>
                {regions.map(region => (
                  <option key={region.value} value={region.value} className="bg-gray-900 text-white">
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Education Level *
              </label>
              <select
                value={courseData.educationLevel}
                onChange={(e) => updateCourseData('educationLevel', e.target.value)}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white neural-connections"
              >
                <option value="" className="bg-gray-900 text-gray-300">Select education level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level} className="bg-gray-900 text-white">{level}</option>
                ))}
              </select>
            </div>

            {courseData.region && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Examination Board *
                </label>
                <select
                  value={courseData.examinationBoard}
                  onChange={(e) => updateCourseData('examinationBoard', e.target.value)}
                  className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white neural-connections"
                >
                  <option value="" className="bg-gray-900 text-gray-300">Select examination board</option>
                  {regions.find(r => r.value === courseData.region)?.boards.map(board => (
                    <option key={board} value={board} className="bg-gray-900 text-white">{board}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Syllabus Alignment (Optional)
              </label>
              <textarea
                value={courseData.syllabusAlignment}
                onChange={(e) => updateCourseData('syllabusAlignment', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-white/5 text-white placeholder-gray-400 neural-connections"
                placeholder="Specify any particular syllabus requirements or topics to focus on..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Define what students will be able to do after completing this course.
              </p>
              
              <div className="space-y-3">
                {courseData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Learning objective ${index + 1}`}
                    />
                    {courseData.learningObjectives.length > 1 && (
                      <button
                        onClick={() => removeLearningObjective(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addLearningObjective}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add another objective
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Syllabus Overview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syllabus Overview *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Provide a general description and scope of your course syllabus.
              </p>
              <textarea
                value={courseData.syllabusOverview}
                onChange={(e) => updateCourseData('syllabusOverview', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the overall structure and scope of your course syllabus..."
              />
            </div>

            {/* Modules Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course Modules *
                  </label>
                  <p className="text-sm text-gray-500">
                    Define the modules that make up your course syllabus.
                  </p>
                </div>
                <button
                  onClick={addModule}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  + Add Module
                </button>
              </div>

              {courseData.modules.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No modules added yet</p>
                  <button
                    onClick={addModule}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add your first module
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseData.modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Module {index + 1}
                        </h4>
                        <button
                          onClick={() => removeModule(module.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Module Title *
                          </label>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Introduction to Functions"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={module.estimatedDuration}
                            onChange={(e) => updateModule(module.id, 'estimatedDuration', parseInt(e.target.value) || 30)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            min="15"
                            max="180"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Module Description *
                        </label>
                        <textarea
                          value={module.description}
                          onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe what this module covers..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Learning Outcomes *
                        </label>
                        <div className="space-y-2">
                          {module.learningOutcomes.map((outcome, outcomeIndex) => (
                            <div key={outcomeIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={outcome}
                                onChange={(e) => updateLearningOutcome(module.id, outcomeIndex, e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Learning outcome ${outcomeIndex + 1}`}
                              />
                              {module.learningOutcomes.length > 1 && (
                                <button
                                  onClick={() => removeLearningOutcome(module.id, outcomeIndex)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addLearningOutcome(module.id)}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                          >
                            + Add outcome
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Teaching Notes (Optional)
                        </label>
                        <textarea
                          value={module.notes}
                          onChange={(e) => updateModule(module.id, 'notes', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Additional notes for teaching this module..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Types to Generate *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Select the types of content you want AI to generate for your course.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypeOptions.map(option => (
                  <div
                    key={option.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      courseData.contentTypes.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleContentType(option.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        courseData.contentTypes.includes(option.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                      {courseData.contentTypes.includes(option.id) && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="text-gray-900">{courseData.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Subject:</span>
                  <p className="text-gray-900">{courseData.subject}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Region:</span>
                  <p className="text-gray-900">
                    {regions.find(r => r.value === courseData.region)?.label}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Board:</span>
                  <p className="text-gray-900">{courseData.examinationBoard}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <p className="text-gray-900">{courseData.educationLevel}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-900">{courseData.estimatedDuration} minutes</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-medium text-gray-700">Learning Objectives:</span>
                <ul className="list-disc list-inside text-gray-900 mt-1">
                  {courseData.learningObjectives.filter(obj => obj.trim()).map((objective, index) => (
                    <li key={index} className="text-sm">{objective}</li>
                  ))}
                </ul>
              </div>

              {courseData.modules.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Course Modules ({courseData.modules.length}):</span>
                  <div className="mt-2 space-y-2">
                    {courseData.modules.map((module, index) => (
                      <div key={module.id} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {index + 1}. {module.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">{module.description}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {module.learningOutcomes.filter(outcome => outcome.trim()).length} learning outcomes • {module.estimatedDuration} min
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <span className="font-medium text-gray-700">Content Types:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {courseData.contentTypes.map(type => (
                    <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {contentTypeOptions.find(opt => opt.id === type)?.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">AI Content Generation</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Our AI will generate comprehensive multi-modal content based on your specifications and syllabus structure. 
                    You'll be able to review and approve all generated content before publishing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Animated Neural Background */}
      <div className="neural-bg fixed inset-0"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 neural-button rounded-lg flex items-center justify-center pulse-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold holographic-text">Create New Course</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep
                    ? 'neural-button text-white pulse-glow'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'holographic-text' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleGenerateCourse}
                disabled={!isStepValid() || isGenerating}
                className="flex items-center space-x-2 neural-button text-white px-6 py-2 rounded-lg pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Course'}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center space-x-2 neural-button text-white px-4 py-2 rounded-lg pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Generation Progress Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generating AI Content
                </h3>
                <p className="text-gray-600 mb-4">
                  Creating your multi-modal educational content...
                </p>
                <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{generationProgress}% complete</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CourseCreationWizard;
