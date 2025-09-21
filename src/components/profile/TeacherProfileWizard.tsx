'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  MapPin,
  BookOpen,
  Award,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TeacherProfile {
  // Personal Information (firstName and lastName come from Clerk)
  phone: string;
  location: string;
  
  // Professional Information
  qualifications: string[];
  teachingExperience: number;
  currentInstitution: string;
  subjects: string[];
  educationLevels: string[];
  
  // Platform Preferences
  targetRegions: string[];
  preferredLanguages: string[];
  revenueGoals: string;
  contentTypes: string[];
  
  // Bio and Motivation
  bio: string;
  motivation: string;
}

interface TeacherProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: TeacherProfile) => void;
}

const TeacherProfileWizard: React.FC<TeacherProfileWizardProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<TeacherProfile>({
    phone: '',
    location: '',
    qualifications: [],
    teachingExperience: 0,
    currentInstitution: '',
    subjects: [],
    educationLevels: [],
    targetRegions: [],
    preferredLanguages: [],
    revenueGoals: '',
    contentTypes: [],
    bio: '',
    motivation: ''
  });

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User
    },
    {
      title: 'Teaching Background',
      description: 'Your qualifications and experience',
      icon: GraduationCap
    },
    {
      title: 'Subject Expertise',
      description: 'What subjects do you teach?',
      icon: BookOpen
    },
    {
      title: 'Platform Preferences',
      description: 'Customize your teaching experience',
      icon: Globe
    },
    {
      title: 'Goals & Motivation',
      description: 'What drives your teaching?',
      icon: Award
    }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'History', 'Geography', 'Computer Science', 'Economics', 'Business Studies',
    'Art', 'Music', 'Physical Education', 'Foreign Languages'
  ];

  const educationLevels = [
    'Primary School', 'O-Level/GCSE', 'A-Level', 'Undergraduate', 'Postgraduate'
  ];

  const regions = [
    'Zimbabwe', 'South Africa', 'UAE', 'United Kingdom', 'United States'
  ];

  const qualifications = [
    'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Teaching Certificate',
    'Professional Certification', 'Diploma in Education'
  ];

  const contentTypes = [
    'Text-based lessons', 'Interactive videos', 'Voice narrations',
    'Visual diagrams', 'Practical exercises', 'Assessment quizzes'
  ];

  const updateProfile = (field: keyof TeacherProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof TeacherProfile, item: string) => {
    const currentArray = profile[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateProfile(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(profile);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm">
                Your name will be automatically retrieved from your account information.
              </p>
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => updateProfile('location', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="City, Country"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Qualifications (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {qualifications.map((qual) => (
                  <button
                    key={qual}
                    onClick={() => toggleArrayItem('qualifications', qual)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.qualifications.includes(qual)
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Years of Teaching Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={profile.teachingExperience}
                onChange={(e) => updateProfile('teachingExperience', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Institution (Optional)
              </label>
              <input
                type="text"
                value={profile.currentInstitution}
                onChange={(e) => updateProfile('currentInstitution', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="School/University name"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Subjects You Teach
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleArrayItem('subjects', subject)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.subjects.includes(subject)
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Education Levels You Teach
              </label>
              <div className="grid grid-cols-2 gap-3">
                {educationLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleArrayItem('educationLevels', level)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.educationLevels.includes(level)
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Target Regions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleArrayItem('targetRegions', region)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.targetRegions.includes(region)
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Content Types You Want to Create
              </label>
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem('contentTypes', type)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.contentTypes.includes(type)
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Revenue Goal
              </label>
              <select
                value={profile.revenueGoals}
                onChange={(e) => updateProfile('revenueGoals', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select a goal</option>
                <option value="$100-500">$100 - $500</option>
                <option value="$500-1000">$500 - $1,000</option>
                <option value="$1000-2500">$1,000 - $2,500</option>
                <option value="$2500-5000">$2,500 - $5,000</option>
                <option value="$5000+">$5,000+</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professional Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateProfile('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Tell students about your background, expertise, and teaching philosophy..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What motivates you to teach?
              </label>
              <textarea
                value={profile.motivation}
                onChange={(e) => updateProfile('motivation', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Share what drives your passion for education and helping students succeed..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 neural-button rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold holographic-text mb-2">
              Complete Your Teacher Profile
            </h2>
            <p className="text-gray-300">
              Help us create the perfect teaching experience for you
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      index <= currentStep
                        ? 'bg-cyan-400 border-cyan-400 text-black'
                        : 'border-white/20 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        index < currentStep ? 'bg-cyan-400' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-1">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-400">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="neural-button flex items-center space-x-2"
              >
                <span>Complete Profile</span>
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="neural-button flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherProfileWizard;
