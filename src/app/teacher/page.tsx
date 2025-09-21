'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import TeacherCMS from '../../components/teacher/TeacherCMS';

const TeacherDashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hasTeacherRole, setHasTeacherRole] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTeacherRole = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has teacher role
        const response = await fetch('/api/v1/auth/roles');
        if (response.ok) {
          const data = await response.json();
          const hasRole = data.roles?.some((role: any) => role.role === 'teacher');
          setHasTeacherRole(hasRole);
          
          if (!hasRole) {
            // Redirect to welcome page if no teacher role
            router.push('/welcome');
            return;
          }
        } else {
          // If no roles found, redirect to welcome
          router.push('/welcome');
          return;
        }
      } catch (error) {
        console.error('Error checking teacher role:', error);
        router.push('/welcome');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkTeacherRole();
  }, [user, isLoaded, router]);

  // Show loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="neural-bg"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="glass-card p-8">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Loading...</h3>
                <p className="text-sm text-gray-300">Verifying teacher access...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  // Show access denied if no teacher role
  if (hasTeacherRole === false) {
    return (
      <div className="min-h-screen relative">
        <div className="neural-bg"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="glass-card p-8 max-w-md mx-4 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Access Denied</h3>
            <p className="text-gray-300 mb-6">
              You need to have a teacher role to access this page.
            </p>
            <button
              onClick={() => router.push('/welcome')}
              className="neural-button px-6 py-2"
            >
              Go to Welcome Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render teacher dashboard if user has teacher role
  return <TeacherCMS />;
};

export default TeacherDashboard;
