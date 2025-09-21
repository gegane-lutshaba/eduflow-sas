'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  ChevronDown,
  RefreshCw,
  Settings,
  LogOut
} from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'student' | 'teacher' | 'researcher';
  availableRoles: ('student' | 'teacher' | 'researcher')[];
  onRoleChange: (role: 'student' | 'teacher' | 'researcher') => void;
  onManageRoles?: () => void;
  userName?: string;
  userEmail?: string;
}

const roleConfig = {
  student: {
    title: 'Student',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Learning Mode'
  },
  teacher: {
    title: 'Teacher',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Teaching Mode'
  },
  researcher: {
    title: 'Researcher',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Research Mode'
  }
};

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  availableRoles,
  onRoleChange,
  onManageRoles,
  userName,
  userEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currentRoleConfig = roleConfig[currentRole];
  const CurrentIcon = currentRoleConfig.icon;

  const handleRoleChange = async (newRole: 'student' | 'teacher' | 'researcher') => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    try {
      await onRoleChange(newRole);
      setIsOpen(false);
    } catch (error) {
      console.error('Role change failed:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="relative">
      {/* Current Role Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        disabled={isChanging}
      >
        {/* Role Icon */}
        <div className={`w-10 h-10 rounded-lg ${currentRoleConfig.bgColor} flex items-center justify-center`}>
          {isChanging ? (
            <RefreshCw className="w-5 h-5 text-gray-600 animate-spin" />
          ) : (
            <CurrentIcon className={`w-5 h-5 ${currentRoleConfig.color}`} />
          )}
        </div>

        {/* Role Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{currentRoleConfig.title}</span>
            {availableRoles.length > 1 && (
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </div>
          <p className="text-xs text-gray-500">{currentRoleConfig.description}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && availableRoles.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          >
            {/* User Info Header */}
            {(userName || userEmail) && (
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">{userName}</p>
                {userEmail && <p className="text-sm text-gray-500">{userEmail}</p>}
              </div>
            )}

            {/* Role Options */}
            <div className="py-2">
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Switch Role
                </p>
              </div>

              {availableRoles.map((role) => {
                const roleInfo = roleConfig[role];
                const RoleIcon = roleInfo.icon;
                const isCurrent = role === currentRole;
                const isComingSoon = role === 'researcher'; // Temporary

                return (
                  <button
                    key={role}
                    onClick={() => !isComingSoon && handleRoleChange(role)}
                    disabled={isCurrent || isComingSoon}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 cursor-default'
                        : isComingSoon
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${roleInfo.bgColor} flex items-center justify-center`}>
                      <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{roleInfo.title}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Current
                          </span>
                        )}
                        {isComingSoon && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{roleInfo.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 py-2">
              {onManageRoles && (
                <button
                  onClick={() => {
                    onManageRoles();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Manage Roles</span>
                </button>
              )}

              <div className="px-4 py-2">
                <p className="text-xs text-gray-500">
                  Switching roles will refresh the app to apply changes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RoleSwitcher;
