'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  GraduationCap, 
  Users, 
  BarChart3, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Globe,
  Zap,
  Award,
  TrendingUp,
  BookOpen,
  Mic,
  Video,
  Image,
  Sparkles,
  Target,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

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

export default function HomePage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen relative">
      {/* Animated Neural Background */}
      <div className="neural-bg"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-nav z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 neural-button rounded-lg flex items-center justify-center pulse-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold holographic-text">EduFlow AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors relative neural-connections">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors relative neural-connections">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Success Stories
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <Link 
                  href="/dashboard"
                  className="neural-button"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-300 hover:text-white transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="neural-button">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              variants={fadeInUp}
            >
              The Future of Education is{' '}
              <span className="holographic-text">
                AI-Powered & Multi-Modal
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Whether you're a Student, Teacher, or Researcher - experience revolutionary 
              learning with AI-generated content across text, images, videos, and voice. 
              Serving Zimbabwe, South Africa, UAE, UK, and USA with localized curricula.
            </motion.p>

            {/* User Type Selection */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={fadeInUp}
            >
              <div className="glass-card p-4 flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium">I'm a Student</span>
              </div>
              <div className="glass-card p-4 flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">I'm a Teacher</span>
              </div>
              <div className="glass-card p-4 flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <span className="text-white font-medium">I'm a Researcher</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              variants={fadeInUp}
            >
              <SignUpButton mode="modal">
                <button className="neural-button text-lg px-8 py-4 flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors glass-card px-6 py-3">
                <Play className="w-5 h-5" />
                <span>Watch Demo (2 min)</span>
              </button>
            </motion.div>

            {/* Regional Focus */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-8"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-2 glass-card px-3 py-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Zimbabwe</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-3 py-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">South Africa</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-3 py-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">UAE</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-3 py-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">UK</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-3 py-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">USA</span>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              <div className="text-center glass-card p-4 float-animation">
                <div className="text-3xl font-bold holographic-text">80%</div>
                <div className="text-sm text-gray-300">Faster Course Creation</div>
              </div>
              <div className="text-center glass-card p-4 float-animation" style={{animationDelay: '0.5s'}}>
                <div className="text-3xl font-bold holographic-text">95%</div>
                <div className="text-sm text-gray-300">Content Approval Rate</div>
              </div>
              <div className="text-center glass-card p-4 float-animation" style={{animationDelay: '1s'}}>
                <div className="text-3xl font-bold holographic-text">100K+</div>
                <div className="text-sm text-gray-300">Target Users</div>
              </div>
              <div className="text-center glass-card p-4 float-animation" style={{animationDelay: '1.5s'}}>
                <div className="text-3xl font-bold holographic-text">5</div>
                <div className="text-sm text-gray-300">Global Regions</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI-Powered Multi-Modal Learning Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary content generation across text, images, videos, and voice. 
              Empowering students, teachers, and researchers with cutting-edge AI technology.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 neural-button rounded-xl flex items-center justify-center mb-6 pulse-glow">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                For Students: Personalized Learning Journeys
              </h3>
              <p className="text-gray-300">
                AI-powered assessments create personalized roadmaps with multi-modal content. 
                Study through text, images, videos, and voice across all subjects and levels.
              </p>
              <div className="ai-badge mt-4">Adaptive Learning</div>
            </motion.div>

            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 cyber-button rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                For Teachers: AI Content Creation Studio
              </h3>
              <p className="text-gray-300">
                Create complete courses in hours, not weeks. AI generates text, images, videos, 
                and voice content aligned with regional curricula and examination boards.
              </p>
              <div className="ai-badge mt-4">Content Generation</div>
            </motion.div>

            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 neural-button rounded-xl flex items-center justify-center mb-6 pulse-glow">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                For Researchers: Educational Analytics
              </h3>
              <p className="text-gray-300">
                Comprehensive analytics across 5 regions. Track learning effectiveness, 
                curriculum gaps, and AI content impact on educational outcomes.
              </p>
              <div className="ai-badge mt-4">Data Intelligence</div>
            </motion.div>

            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 cyber-button rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Multi-Modal AI Content Generation
              </h3>
              <p className="text-gray-300">
                Advanced AI pipeline creates text, images (DALL-E), videos (Veo3), 
                and voice content. Quality-controlled and curriculum-aligned.
              </p>
              <div className="ai-badge mt-4">GPT-4 + Veo3</div>
            </motion.div>

            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 neural-button rounded-xl flex items-center justify-center mb-6 pulse-glow">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Regional Curriculum Alignment
              </h3>
              <p className="text-gray-300">
                Official syllabi integration for ZIMSEC, CAPS, MOE, AQA, OCR, and Common Core. 
                Content automatically aligned with regional educational standards.
              </p>
              <div className="ai-badge mt-4">Curriculum AI</div>
            </motion.div>

            <motion.div 
              className="glass-card feature-card p-8"
              variants={fadeInUp}
            >
              <div className="w-12 h-12 cyber-button rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                3D Research Environment
              </h3>
              <p className="text-gray-300">
                Immersive 3D classrooms with agentic RAG for research. Upload sources, 
                converse with AI through text and voice in engaging virtual spaces.
              </p>
              <div className="ai-badge mt-4">Agentic RAG</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role & Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing for Students, Teachers, and Researchers. 
              AI-powered content generation with regional curriculum alignment.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Student Tier */}
            <motion.div 
              className="bg-white p-8 rounded-2xl border border-gray-200 relative"
              variants={fadeInUp}
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $9<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for learners</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">AI-powered assessments</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Multi-modal content access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Personalized learning paths</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Regional curriculum alignment</span>
                </li>
              </ul>

              <SignUpButton mode="modal">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Learning
                </button>
              </SignUpButton>
            </motion.div>

            {/* Teacher Tier */}
            <motion.div 
              className="bg-white p-8 rounded-2xl border-2 border-green-500 relative"
              variants={fadeInUp}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Teacher Studio</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">+ 70% revenue share</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">AI content generation studio</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Multi-modal content creation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Regional curriculum alignment</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Student analytics dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Revenue tracking & payments</span>
                </li>
              </ul>

              <SignUpButton mode="modal">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Start Teaching
                </button>
              </SignUpButton>
            </motion.div>

            {/* Researcher Tier */}
            <motion.div 
              className="bg-white p-8 rounded-2xl border border-gray-200 relative"
              variants={fadeInUp}
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Research Analytics</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $99<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Educational insights</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Cross-regional analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Learning effectiveness data</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Curriculum gap analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Custom research reports</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Data export capabilities</span>
                </li>
              </ul>

              <SignUpButton mode="modal">
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Start Research
                </button>
              </SignUpButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories Across All Roles
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Students, teachers, and researchers are transforming education with 
              EduFlow AI's revolutionary multi-modal learning platform.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="testimonial-card p-8"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The AI-generated content and personalized learning paths helped me master 
                advanced mathematics. I improved my grades by 40% and got into my dream university!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 neural-button rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Tendai Mukamuri</div>
                  <div className="text-sm text-gray-400">Student, Zimbabwe</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="testimonial-card p-8"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "Creating courses is now effortless! AI generates all my content - text, images, 
                videos, and voice. My students love the engaging multi-modal lessons."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 cyber-button rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="font-semibold text-white">Dr. Sarah Al-Rashid</div>
                  <div className="text-sm text-gray-400">Physics Teacher, UAE</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="testimonial-card p-8"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The cross-regional analytics provide unprecedented insights into learning patterns. 
                Our research on AI content effectiveness has been published in 3 journals!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 neural-button rounded-full flex items-center justify-center pulse-glow">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Prof. James Mitchell</div>
                  <div className="text-sm text-gray-400">Education Researcher, UK</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Education with AI?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the revolution in AI-powered education. Whether you're learning, 
              teaching, or researching - EduFlow AI has the perfect solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduFlow AI</span>
              </div>
              <p className="text-gray-400">
                Transforming education through AI-powered multi-modal content generation 
                across Zimbabwe, South Africa, UAE, UK, and USA.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Personalized Learning</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">AI Assessments</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Career Roadmaps</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Multi-Modal Content</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Teachers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Content Creation Studio</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">AI Course Generator</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Student Analytics</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Revenue Sharing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Researchers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Educational Analytics</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cross-Regional Data</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Research Reports</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Data Export</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
