import { SignIn } from '@clerk/nextjs';
import { Brain } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
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
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Continue your immersive learning journey
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignIn 
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
            redirectUrl="/dashboard"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
