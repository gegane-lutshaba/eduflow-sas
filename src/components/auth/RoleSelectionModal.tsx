'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Users,
  Sparkles,
  TrendingUp,
  X,
  ArrowRight,
  Check
} from 'lucide-react';

interface RoleOption {
  id: 'student' | 'teacher' | 'researcher';
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  comingSoon?: boolean;
}

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: 'student' | 'teacher' | 'researcher') => void;
  availableRoles: ('student' | 'teacher' | 'researcher')[];
  currentRole?: 'student' | 'teacher' | 'researcher';
  isFirstTime?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Learn with AI-powered personalized education',
    features: [
      'Personalized learning paths',
      'AI-powered assessments',
      'Career guidance',
      'Interactive content',
      'Progress tracking'
    ],
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Create courses with AI-powered content generation',
    features: [
      'AI content generation',
      'Multi-modal course creation',
      'Student analytics',
      '70% revenue sharing',
      'Global reach'
    ],
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'researcher',
    title: 'Researcher',
    description: 'Access educational data and analytics',
    features: [
      'Learning analytics',
      'Research datasets',
      'Cross-regional insights',
      'Publication tools',
      'Collaboration features'
    ],
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    comingSoon: true
  }
];

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onRoleSelect,
  availableRoles,
  currentRole,
  isFirstTime = false
}) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'researcher' | null>(
    currentRole || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (role: 'student' | 'teacher' | 'researcher') => {
    if (roleOptions.find(r => r.id === role)?.comingSoon) {
      return;
    }

    setIsLoading(true);
    try {
      await onRoleSelect(role);
    } catch (error) {
      console.error('Role selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = roleOptions.filter(role => availableRoles.includes(role.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isFirstTime ? 'Welcome to EduFlow AI!' : 'Switch Role'}
              </h2>
              <p className="text-blue-100 mt-1">
                {isFirstTime 
                  ? 'Choose your role to get started with personalized features'
                  : 'Select the role you want to use for this session'
                }
              </p>
            </div>
            {!isFirstTime && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              const isCurrentRole = currentRole === role.id;
              const isDisabled = role.comingSoon;

              return (
                <motion.div
                  key={role.id}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => !isDisabled && setSelectedRole(role.id)}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                >
                  {/* Coming Soon Badge */}
                  {role.comingSoon && (
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </div>
                  )}

                  {/* Current Role Badge */}
                  {isCurrentRole && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Current</span>
                    </div>
                  )}

                  {/* Role Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Role Info */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {role.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                    {role.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{role.features.length - 3} more features
                      </li>
                    )}
                  </ul>

                  {/* Selection Indicator */}
                  {isSelected && !isDisabled && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 left-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isFirstTime 
                ? 'You can change your role anytime from your profile'
                : 'Your app will refresh to apply the new role'
              }
            </div>

            <div className="flex space-x-3">
              {!isFirstTime && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              )}

              <motion.button
                onClick={() => selectedRole && handleRoleSelect(selectedRole)}
                disabled={!selectedRole || isLoading || roleOptions.find(r => r.id === selectedRole)?.comingSoon}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>{isFirstTime ? 'Get Started' : 'Switch Role'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionModal;
