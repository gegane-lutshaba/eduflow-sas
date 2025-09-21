'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Users, 
  DollarSign, 
  Brain,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface RoleOption {
  id: 'student' | 'teacher' | 'researcher';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  benefits: string[];
  color: string;
  gradient: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Learn and grow with AI-powered personalized education',
    icon: GraduationCap,
    features: [
      'AI-powered cognitive assessments',
      'Personalized learning paths',
      'Career guidance and roadmaps',
      'Interactive course content',
      'Progress tracking and analytics'
    ],
    benefits: [
      'Discover your learning style',
      'Get career recommendations',
      'Access to all subjects',
      'Gamified learning experience'
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Create courses and earn revenue through our platform',
    icon: BookOpen,
    features: [
      'AI-powered content generation',
      'Course creation wizard',
      'Student analytics dashboard',
      'Revenue tracking (70% share)',
      'Multi-modal content support'
    ],
    benefits: [
      'Monetize your expertise',
      'Reach global students',
      'AI-assisted course creation',
      'Comprehensive analytics'
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'researcher',
    title: 'Researcher',
    description: 'Access learning analytics and educational data insights',
    icon: BarChart3,
    features: [
      'Learning analytics access',
      'Educational research tools',
      'Anonymized student data',
      'Research collaboration',
      'Publication support'
    ],
    benefits: [
      'Advance educational research',
      'Access rich datasets',
      'Collaborate with peers',
      'Publish findings'
    ],
    color: 'green',
    gradient: 'from-green-500 to-emerald-500'
  }
];

export default function WelcomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }
  }, [user, isLoaded, router]);

  const handleRoleSelection = async (roleId: string) => {
    if (!user) {
      alert('No user found. Please refresh and try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/auth/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: roleId,
          isDefault: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create user role: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Redirect to profile setup based on role
      switch (roleId) {
        case 'student':
          router.push('/profile-setup/student');
          break;
        case 'teacher':
          router.push('/profile-setup/teacher');
          break;
        case 'researcher':
          router.push('/profile-setup/researcher');
          break;
        default:
          router.push('/dashboard');
      }

    } catch (error) {
      console.error('Error creating user role:', error);
      alert(`Error creating user role: ${error.message}`);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduFlow AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            Choose your role to get started with personalized learning and teaching experiences
          </p>
          <p className="text-sm text-gray-500">
            Hello {user.firstName || user.emailAddresses[0].emailAddress}! Let&apos;s set up your account.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-xl transform -translate-y-1' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-r ${role.gradient} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-blue-600" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-purple-600" />
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.benefits.map((benefit, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Special badges */}
                  {role.id === 'teacher' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center text-green-800">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-semibold text-sm">70% Revenue Share</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Earn money from your courses with our generous revenue sharing model
                      </p>
                    </div>
                  )}

                  {role.id === 'student' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center text-blue-800">
                        <Brain className="h-4 w-4 mr-2" />
                        <span className="font-semibold text-sm">AI-Powered Learning</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Get personalized learning paths based on your cognitive profile
                      </p>
                    </div>
                  )}

                  {role.id === 'researcher' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-center text-purple-800">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-semibold text-sm">Research Access</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">
                        Access anonymized learning data for educational research
                      </p>
                    </div>
                  )}
                </CardContent>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center">
            <Button
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up your account...
                </div>
              ) : (
                <div className="flex items-center">
                  Continue as {roleOptions.find(r => r.id === selectedRole)?.title}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              You can always add more roles or switch between them later
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>
            Need help choosing? Contact our support team or start as a Student and explore other roles later.
          </p>
        </div>
      </div>
    </div>
  );
}
