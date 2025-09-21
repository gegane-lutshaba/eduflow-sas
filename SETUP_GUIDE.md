# STEM Quest Platform - Setup Guide

## 🚀 Complete Architecture Migration

This guide will help you set up the newly migrated STEM Quest platform that has been transformed from a Python backend + Supabase architecture to a fully integrated Next.js application with Neon PostgreSQL.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon PostgreSQL account
- Clerk account for authentication
- OpenAI API account

## 🛠️ Setup Instructions

### 1. Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Configure your environment variables in `.env.local`:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Neon Database (Required)
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# OpenAI API (Required)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 2. Database Setup

#### Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string to your `.env.local`

#### Run Database Migration

```bash
# Install dependencies first
npm install

# Run the database migration
npx drizzle-kit push:pg
```

#### Seed Initial Data

```bash
# Run the seeding script
npx tsx scripts/seed-database.ts
```

This will populate your database with:
- 5 Education levels (Primary, O Level, A Level, Undergraduate, Postgraduate)
- 10 STEM subjects (Mathematics, Physics, Chemistry, Biology, Computer Science, etc.)
- 6 Career paths (Software Engineer, Data Scientist, Cybersecurity Analyst, etc.)
- 6 Achievement types for gamification
- Sample mathematics topics for O Level

### 3. Authentication Setup

#### Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key to your `.env.local`
4. Configure the redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`

### 4. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add it to your `.env.local`

### 5. Install Dependencies and Run

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Architecture Overview

### New Architecture Benefits

✅ **Simplified Stack**: Single Next.js application instead of multiple services
✅ **Better Performance**: Direct database access without API layer overhead
✅ **Enhanced Security**: Server-side authentication and data processing
✅ **Improved Scalability**: Serverless functions with automatic scaling
✅ **Cost Efficiency**: Reduced infrastructure complexity
✅ **Type Safety**: Full TypeScript integration with Drizzle ORM

### Key Components

#### Database Layer
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations
- **20+ Tables**: Comprehensive schema for all platform features

#### API Layer
- **Next.js API Routes**: Server-side endpoints
- **OpenAI Integration**: AI-powered content generation and analysis
- **Clerk Authentication**: Secure user management

#### Frontend Layer
- **React Components**: Modern UI with TypeScript
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling

## 🎯 Key Features

### ✅ Completed Features

1. **User Management**
   - Profile creation and management
   - Profile completeness checking
   - Gamification profiles with XP tracking

2. **Assessment System**
   - Cognitive assessment with 3D games
   - Personality assessment (Jung typology, Big Five)
   - Learning preferences analysis
   - AI-powered analysis and recommendations

3. **Career Guidance**
   - AI-generated career recommendations
   - Personalized learning roadmaps
   - Skill gap analysis

4. **Course Generation**
   - AI-powered personalized course creation
   - Subject-agnostic content generation
   - Modular course structure

5. **Gamification**
   - XP system with achievements
   - Progress tracking
   - Streak counters

### 🔄 API Endpoints

- `GET/POST /api/v1/users/profile` - User profile management
- `POST /api/v1/assessment/analyze` - Assessment analysis with AI
- `GET /api/v1/subjects` - STEM subjects and education levels
- `POST /api/v1/courses/generate` - AI course generation

## 🧪 Testing the Platform

### 1. User Registration Flow
1. Visit `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Complete the onboarding process
4. Fill out your profile information

### 2. Assessment Flow
1. Navigate to the assessment section
2. Complete the cognitive assessment (3D games)
3. Complete the personality assessment
4. Complete the learning preferences
5. View your AI-generated analysis and career recommendations

### 3. Course Generation
1. Go to the dashboard
2. Select a STEM subject and education level
3. Generate a personalized course
4. View the AI-generated content modules

### 4. Gamification
1. Complete various activities to earn XP
2. View your achievements and progress
3. Track your learning streaks

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
# Production URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-domain.vercel.app

# Database (use production Neon database)
DATABASE_URL=postgresql://prod_user:password@prod-endpoint.neon.tech/prod_db

# Same Clerk and OpenAI keys work for production
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx drizzle-kit push:pg

# Generate database types
npx drizzle-kit generate:pg

# Seed database
npx tsx scripts/seed-database.ts

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Database Schema

The platform uses a comprehensive database schema with 20+ tables:

- **Users & Profiles**: User management and extended profiles
- **Assessments**: Cognitive, personality, and learning preferences
- **Education**: Subjects, topics, education levels, examination boards
- **Careers**: Career paths and personalized recommendations
- **Learning**: Courses, modules, progress tracking, roadmaps
- **Gamification**: XP, achievements, streaks, transactions

## 🎯 Next Steps

1. **Set up your Neon database** and run migrations
2. **Configure Clerk authentication** with your keys
3. **Add your OpenAI API key** for AI features
4. **Run the seeding script** to populate initial data
5. **Test the complete user journey** from registration to course generation
6. **Deploy to production** when ready

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure your Neon database is active
   - Check network connectivity

2. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check redirect URLs match your configuration
   - Ensure environment variables are loaded

3. **OpenAI API Errors**
   - Verify your API key is valid
   - Check you have sufficient credits
   - Ensure the key has proper permissions

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run type-check`
   - Verify environment variables are set

## 📞 Support

If you encounter any issues during setup:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure your database is properly migrated and seeded
4. Test API endpoints individually

The platform is now ready for subject-agnostic STEM education with comprehensive personalization, AI-powered content generation, and modern scalable architecture!
