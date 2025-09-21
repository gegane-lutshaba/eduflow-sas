'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  GraduationCap,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar,
  MapPin,
  BookOpen,
  Target
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
  educationLevel: 'primary' | 'high_school' | 'college' | 'professional';
  currentInstitution: string;
  fieldOfStudy: string;
  learningObjectives: string[];
  timeAvailability: number; // minutes per day
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
}

const LEARNING_OBJECTIVES = [
  'Improve problem-solving skills',
  'Prepare for exams',
  'Learn new concepts',
  'Build practical skills',
  'Enhance critical thinking',
  'Develop research abilities',
  'Master fundamentals',
  'Advance to next level'
];

const TIME_AVAILABILITY_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3+ hours' }
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    location: '',
    educationLevel: 'high_school',
    currentInstitution: '',
    fieldOfStudy: '',
    learningObjectives: [],
    timeAvailability: 60,
    preferredStudyTime: 'evening'
  });

  // Pre-populate with Clerk user data if available
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }));
    }
  }, [user]);

  const steps = [
    { id: 'basic-info', title: 'Basic Info', icon: User },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'learning-prefs', title: 'Learning', icon: Target }
  ];

  const updateProfileData = (field: keyof ProfileData, value: string | string[] | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('🚀 Submitting profile data:', profileData);

      const requestBody = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        location: profileData.location,
        educationLevel: profileData.educationLevel,
        currentInstitution: profileData.currentInstitution || null,
        fieldOfStudy: profileData.fieldOfStudy || null,
        learningObjectives: profileData.learningObjectives,
        timeAvailability: profileData.timeAvailability,
        preferredStudyTime: profileData.preferredStudyTime,
      };

      console.log('📤 Sending request body:', requestBody);

      // Save profile data to database via API (including firstName/lastName)
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to save profile`);
      }

      const result = await response.json();
      console.log('✅ Profile saved successfully:', result);
      
      // Verify the profile was actually saved
      if (result.profile) {
        console.log('✅ Profile data in response:', result.profile);
      } else {
        console.warn('⚠️ No profile data in response');
      }
      
      // Close modal and refresh page to update dashboard
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save profile');
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return profileData.firstName.trim() && 
               profileData.lastName.trim() && 
               profileData.dateOfBirth && 
               profileData.location;
      case 1: // Education
        return profileData.educationLevel;
      case 2: // Learning Preferences
        return profileData.learningObjectives.length > 0 && 
               profileData.timeAvailability > 0;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                  <p className="text-sm text-gray-300">Help us personalize your learning experience</p>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-blue-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center mt-4 space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === index ? 'bg-cyan-500 text-white' :
                    currentStep > index ? 'bg-green-500 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {currentStep > index ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      currentStep > index ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            {submitError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-300">{submitError}</p>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <BasicInfoStep data={profileData} onUpdate={updateProfileData} />}
                {currentStep === 1 && <EducationStep data={profileData} onUpdate={updateProfileData} />}
                {currentStep === 2 && <LearningPreferencesStep data={profileData} onUpdate={updateProfileData} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="flex justify-between">
              <motion.button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Previous</span>
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{currentStep === steps.length - 1 ? (isSubmitting ? 'Saving...' : 'Complete Profile') : 'Next'}</span>
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                {isSubmitting && <Zap className="w-4 h-4 animate-spin" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Step 1: Basic Information
function BasicInfoStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>
        <p className="text-sm text-gray-300">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-1" />
            First Name *
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="Enter your first name"
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Last Name *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="Enter your last name"
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Date of Birth *
        </label>
        <input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location *
        </label>
        <select 
          value={data.location}
          onChange={(e) => onUpdate('location', e.target.value)}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
        >
          <option value="">Select your location</option>
          <option value="zimbabwe">Zimbabwe</option>
          <option value="south-africa">South Africa</option>
          <option value="botswana">Botswana</option>
          <option value="zambia">Zambia</option>
          <option value="uk">United Kingdom</option>
          <option value="us">United States</option>
          <option value="canada">Canada</option>
          <option value="australia">Australia</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}

// Step 2: Education Information
function EducationStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <GraduationCap className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-white">Education Background</h3>
        <p className="text-sm text-gray-300">Help us understand your academic level</p>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <GraduationCap className="w-4 h-4 inline mr-1" />
          Current Education Level *
        </label>
        <select 
          value={data.educationLevel}
          onChange={(e) => onUpdate('educationLevel', e.target.value)}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
        >
          <option value="primary">Primary School</option>
          <option value="high_school">High School / Secondary</option>
          <option value="college">College / University</option>
          <option value="professional">Professional / Graduate</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <BookOpen className="w-4 h-4 inline mr-1" />
          Current Institution (Optional)
        </label>
        <input
          type="text"
          value={data.currentInstitution}
          onChange={(e) => onUpdate('currentInstitution', e.target.value)}
          placeholder="e.g., University of Zimbabwe, Harare High School"
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          <Target className="w-4 h-4 inline mr-1" />
          Field of Study (Optional)
        </label>
        <input
          type="text"
          value={data.fieldOfStudy}
          onChange={(e) => onUpdate('fieldOfStudy', e.target.value)}
          placeholder="e.g., Mathematics, Sciences, Engineering"
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder-gray-400"
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">📚 Why we ask this</h4>
        <p className="text-xs text-gray-300">
          This helps us recommend appropriate STEM subjects and difficulty levels for your learning journey.
        </p>
      </div>
    </div>
  );
}

// Step 3: Learning Preferences
function LearningPreferencesStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string | string[] | number) => void }) {
  const toggleLearningObjective = (objective: string) => {
    const current = data.learningObjectives;
    if (current.includes(objective)) {
      onUpdate('learningObjectives', current.filter(obj => obj !== objective));
    } else {
      onUpdate('learningObjectives', [...current, objective]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-white">Learning Preferences</h3>
        <p className="text-sm text-gray-300">Customize your learning experience</p>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-3">
          <Target className="w-4 h-4 inline mr-1" />
          Learning Objectives * (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LEARNING_OBJECTIVES.map((objective) => (
            <motion.button
              key={objective}
              onClick={() => toggleLearningObjective(objective)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                data.learningObjectives.includes(objective)
                  ? 'border-purple-400 bg-purple-400/20 text-white'
                  : 'border-gray-600 hover:border-purple-400/50 text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {objective}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Daily Study Time *
          </label>
          <select 
            value={data.timeAvailability}
            onChange={(e) => onUpdate('timeAvailability', parseInt(e.target.value))}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
          >
            {TIME_AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Preferred Study Time *
          </label>
          <select 
            value={data.preferredStudyTime}
            onChange={(e) => onUpdate('preferredStudyTime', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
          >
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 10PM)</option>
            <option value="night">Night (10PM - 6AM)</option>
          </select>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">🎯 Almost Done!</h4>
        <p className="text-xs text-gray-300">
          Your personalized STEM learning dashboard will be ready after completing this profile. 
          We'll use this information to recommend the best subjects and create custom learning paths for you.
        </p>
      </div>
    </div>
  );
}
