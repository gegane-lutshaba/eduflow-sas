'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TeacherProfileWizard from '../../../components/profile/TeacherProfileWizard';

interface TeacherProfile {
  phone: string;
  location: string;
  qualifications: string[];
  teachingExperience: number;
  currentInstitution: string;
  subjects: string[];
  educationLevels: string[];
  targetRegions: string[];
  preferredLanguages: string[];
  revenueGoals: string;
  contentTypes: string[];
  bio: string;
  motivation: string;
}

export default function TeacherProfileSetupPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileComplete = async (profile: TeacherProfile) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save profile to database with user's name from Clerk
      const response = await fetch('/api/v1/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'teacher',
          profile: {
            ...profile,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
          },
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Redirect to teacher dashboard
      router.push('/teacher');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Neural Background */}
      <div className="neural-bg"></div>
      
      <TeacherProfileWizard
        isOpen={true}
        onClose={() => router.push('/welcome')}
        onComplete={handleProfileComplete}
      />
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 max-w-md mx-4">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Saving Profile</h3>
                <p className="text-sm text-gray-300">Creating your teacher account...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
