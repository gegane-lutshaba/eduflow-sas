import { SignUp } from '@clerk/nextjs';
import { Brain } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CogniFlow</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Start Your Journey
          </h1>
          <p className="text-gray-600">
            Transform your career with immersive 3D learning
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full",
                card: "shadow-none border-0",
                headerTitle: "text-2xl font-bold text-gray-900 text-center",
                headerSubtitle: "text-gray-600 text-center",
                socialButtonsBlockButton: 
                  "border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200",
                formFieldInput: 
                  "border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
              },
            }}
            redirectUrl="/onboarding"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white/50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            What you'll get:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Complete career assessment</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>5 hours monthly 3D learning access</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>AI-powered personalized learning path</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span>Community forum access</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
