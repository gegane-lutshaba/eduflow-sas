'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
  Clock,
  ChevronRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface ProfileData {
  firstName: string;
  lastName: string;
  currentRole: string;
  experience: string;
  education: string;
  educationLevel: 'primary' | 'high-school' | 'college' | 'professional';
  location: string;
  ageRange: string;
  careerGoals: string;
  timeline: string;
  salaryExpectations: string;
  workEnvironment: string;
  personalMotivation: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    currentRole: '',
    experience: '',
    education: '',
    educationLevel: 'high-school',
    location: '',
    ageRange: '',
    careerGoals: '',
    timeline: '',
    salaryExpectations: '',
    workEnvironment: '',
    personalMotivation: ''
  });

  const steps = [
    { id: 'basic-info', title: 'Basic Information', icon: User },
    { id: 'career-goals', title: 'Career Goals', icon: Target },
    { id: 'preferences', title: 'Work Preferences', icon: Star }
  ];

  // Check if user already has profile data
  useEffect(() => {
    if (user?.unsafeMetadata?.profileCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const updateProfileData = (field: keyof ProfileData, value: string) => {
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
    
    try {
      // Save profile data to user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          profileCompleted: true,
          profileData: profileData,
          profileCompletedAt: new Date().toISOString()
        }
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profileData.firstName && profileData.lastName && profileData.currentRole && profileData.experience && profileData.education && profileData.location && profileData.ageRange;
      case 1:
        return profileData.careerGoals && profileData.timeline && profileData.salaryExpectations;
      case 2:
        return profileData.workEnvironment && profileData.personalMotivation;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Neural Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      
      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white">Complete Your Profile</h1>
            <span className="text-sm text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <motion.div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isCompleted ? 'text-cyan-400' : 
                    isCurrent ? 'text-blue-400' : 'text-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    isCompleted ? 'bg-cyan-500/20 border-2 border-cyan-400' :
                    isCurrent ? 'bg-blue-500/20 border-2 border-blue-400' :
                    'bg-gray-600/20 border-2 border-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block font-medium">{step.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 shadow-xl"
            >
              {currentStep === 0 && <BasicInfoStep data={profileData} onUpdate={updateProfileData} />}
              {currentStep === 1 && <CareerGoalsStep data={profileData} onUpdate={updateProfileData} />}
              {currentStep === 2 && <PreferencesStep data={profileData} onUpdate={updateProfileData} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Previous</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{currentStep === steps.length - 1 ? (isSubmitting ? 'Saving...' : 'Complete Profile') : 'Next'}</span>
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
              {isSubmitting && <Zap className="w-5 h-5 animate-spin" />}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Basic Info Step Component
function BasicInfoStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string) => void }) {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Tell us about yourself</h2>
        <p className="text-gray-300">Help us understand your current background and experience level.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">First Name *</label>
          <input 
            type="text"
            value={data.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="Enter your first name"
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Last Name *</label>
          <input 
            type="text"
            value={data.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="Enter your last name"
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Current Role/Status *</label>
          <select 
            value={data.currentRole}
            onChange={(e) => onUpdate('currentRole', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your current status</option>
            <option value="student">Student</option>
            <option value="entry-level">Entry-level Professional</option>
            <option value="mid-level">Mid-level Professional</option>
            <option value="senior-level">Senior Professional</option>
            <option value="career-changer">Career Changer</option>
            <option value="unemployed">Currently Unemployed</option>
            <option value="entrepreneur">Entrepreneur</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Years of Experience *</label>
          <select 
            value={data.experience}
            onChange={(e) => onUpdate('experience', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years</option>
            <option value="2-3">2-3 years</option>
            <option value="4-6">4-6 years</option>
            <option value="7-10">7-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Highest Education Level *</label>
          <select 
            value={data.education}
            onChange={(e) => {
              onUpdate('education', e.target.value);
              // Set education level for assessments
              let level: 'primary' | 'high-school' | 'college' | 'professional' = 'high-school';
              if (e.target.value === 'high-school') level = 'high-school';
              else if (['associate', 'bachelor'].includes(e.target.value)) level = 'college';
              else if (['master', 'phd'].includes(e.target.value)) level = 'professional';
              onUpdate('educationLevel', level);
            }}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select education level</option>
            <option value="high-school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="bootcamp">Coding Bootcamp</option>
            <option value="self-taught">Self-taught</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Location *</label>
          <select 
            value={data.location}
            onChange={(e) => onUpdate('location', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your location</option>
            <optgroup label="North America">
              <option value="us-west">US - West Coast</option>
              <option value="us-east">US - East Coast</option>
              <option value="canada">Canada</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="uk">United Kingdom</option>
              <option value="germany">Germany</option>
              <option value="france">France</option>
            </optgroup>
            <optgroup label="Africa">
              <option value="south-africa">South Africa</option>
              <option value="nigeria">Nigeria</option>
              <option value="kenya">Kenya</option>
            </optgroup>
            <optgroup label="Asia Pacific">
              <option value="india">India</option>
              <option value="australia">Australia</option>
              <option value="singapore">Singapore</option>
            </optgroup>
            <option value="other">Other</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp} className="md:col-span-2">
          <label className="block text-white font-medium mb-2">Age Range *</label>
          <select 
            value={data.ageRange}
            onChange={(e) => onUpdate('ageRange', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your age range</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55+">55+</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Career Goals Step Component
function CareerGoalsStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string) => void }) {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Your Career Goals</h2>
        <p className="text-gray-300">Help us understand what you want to achieve in your career.</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Target Career Path *</label>
          <select 
            value={data.careerGoals}
            onChange={(e) => onUpdate('careerGoals', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your target career</option>
            <optgroup label="AI & Machine Learning">
              <option value="machine-learning-engineer">Machine Learning Engineer</option>
              <option value="data-scientist">Data Scientist</option>
              <option value="ai-product-manager">AI Product Manager</option>
              <option value="computer-vision-engineer">Computer Vision Engineer</option>
              <option value="nlp-engineer">NLP Engineer</option>
              <option value="ai-research-scientist">AI Research Scientist</option>
            </optgroup>
            <optgroup label="Cybersecurity">
              <option value="security-analyst">Security Analyst</option>
              <option value="penetration-tester">Penetration Tester</option>
              <option value="security-manager">Security Manager/CISO</option>
              <option value="cloud-security-engineer">Cloud Security Engineer</option>
              <option value="digital-forensics-analyst">Digital Forensics Analyst</option>
              <option value="security-architect">Security Architect</option>
            </optgroup>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Timeline for Career Transition *</label>
          <select 
            value={data.timeline}
            onChange={(e) => onUpdate('timeline', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your timeline</option>
            <option value="3-6-months">3-6 months</option>
            <option value="6-12-months">6-12 months</option>
            <option value="1-2-years">1-2 years</option>
            <option value="2-3-years">2-3 years</option>
            <option value="flexible">Flexible timeline</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Salary Expectations *</label>
          <select 
            value={data.salaryExpectations}
            onChange={(e) => onUpdate('salaryExpectations', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select salary range</option>
            <option value="50k-80k">$50k - $80k</option>
            <option value="80k-120k">$80k - $120k</option>
            <option value="120k-180k">$120k - $180k</option>
            <option value="180k-250k">$180k - $250k</option>
            <option value="250k+">$250k+</option>
            <option value="not-sure">Not sure</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Preferences Step Component
function PreferencesStep({ data, onUpdate }: { data: ProfileData; onUpdate: (field: keyof ProfileData, value: string) => void }) {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Work Preferences</h2>
        <p className="text-gray-300">Tell us about your ideal work environment and motivation.</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">Preferred Work Environment *</label>
          <select 
            value={data.workEnvironment}
            onChange={(e) => onUpdate('workEnvironment', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select work environment</option>
            <option value="remote">Fully Remote</option>
            <option value="hybrid">Hybrid (Remote + Office)</option>
            <option value="office">Traditional Office</option>
            <option value="startup">Startup Environment</option>
            <option value="enterprise">Large Enterprise</option>
            <option value="consulting">Consulting/Client-facing</option>
            <option value="freelance">Freelance/Contract</option>
          </select>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <label className="block text-white font-medium mb-2">What motivates you most? *</label>
          <select 
            value={data.personalMotivation}
            onChange={(e) => onUpdate('personalMotivation', e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your primary motivation</option>
            <option value="financial-growth">Financial Growth & Security</option>
            <option value="technical-mastery">Technical Mastery & Expertise</option>
            <option value="impact-innovation">Making an Impact & Innovation</option>
            <option value="work-life-balance">Work-Life Balance</option>
            <option value="leadership-growth">Leadership & Career Growth</option>
            <option value="continuous-learning">Continuous Learning & Development</option>
            <option value="problem-solving">Complex Problem Solving</option>
            <option value="team-collaboration">Team Collaboration & Mentoring</option>
          </select>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-white mb-3">🎉 Almost Done!</h3>
        <p className="text-gray-300 mb-4">
          Once you complete your profile, you'll get access to:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Personalized AI & Cybersecurity courses</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Career assessment and recommendations</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Customized learning path based on your goals</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Job market insights and salary data</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
