import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import NeonDatabaseService from '../../../../../lib/neon-service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subjectId,
      topicId,
      educationLevelId,
      contentType, // 'study', 'assessment', 'hybrid'
      difficulty, // 1-10
      timeAllocation, // in minutes
      learningObjectives,
      customRequirements,
    } = body;

    // Get user profile and assessment data for personalization
    const userProfile = await NeonDatabaseService.getUserProfile(userId);
    const cognitiveAssessment = await NeonDatabaseService.getUserComprehensiveProfile(userId);

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get subject and topic information
    const subjects = await NeonDatabaseService.getSubjects();
    const educationLevels = await NeonDatabaseService.getEducationLevels();
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    const selectedEducationLevel = educationLevels.find(l => l.id === educationLevelId);

    let selectedTopic = null;
    if (topicId) {
      const topics = await NeonDatabaseService.getTopicsBySubjectAndLevel(subjectId, educationLevelId);
      selectedTopic = topics.find(t => t.id === topicId);
    }

    // Generate personalized course content using AI
    const courseContent = await generatePersonalizedCourse({
      subject: selectedSubject,
      topic: selectedTopic,
      educationLevel: selectedEducationLevel,
      contentType,
      difficulty,
      timeAllocation,
      learningObjectives,
      customRequirements,
      userProfile,
      cognitiveAssessment: cognitiveAssessment.cognitiveAssessment,
      personalityAssessment: cognitiveAssessment.personalityAssessment,
      learningPreferences: cognitiveAssessment.learningPreferences,
    });

    // Save course to database
    const savedCourse = await NeonDatabaseService.createCourse({
      userId,
      title: courseContent.title,
      description: courseContent.description,
      subjectId,
      topicId,
      educationLevelId,
      difficulty,
      estimatedDuration: timeAllocation,
      contentType,
      generationPrompt: courseContent.generationPrompt,
    });

    // Create course modules
    const modulePromises = courseContent.modules.map(async (module: any, index: number) => {
      // In a full implementation, you'd save each module to the database
      // For now, we'll return the structured content
      return {
        title: module.title,
        content: module.content,
        contentType: module.type,
        orderIndex: index,
        duration: module.estimatedDuration,
        difficulty: module.difficulty,
        learningObjectives: module.learningObjectives,
      };
    });

    const modules = await Promise.all(modulePromises);

    // Award XP for course generation
    await NeonDatabaseService.addXpTransaction(
      userId,
      50,
      'course_generation',
      savedCourse.id,
      'course'
    );

    return NextResponse.json({
      success: true,
      course: {
        ...savedCourse,
        modules,
      },
      message: 'Personalized course generated successfully!',
    });
  } catch (error) {
    console.error('Error generating course:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate course',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function generatePersonalizedCourse(params: {
  subject: any;
  topic: any;
  educationLevel: any;
  contentType: string;
  difficulty: number;
  timeAllocation: number;
  learningObjectives: string[];
  customRequirements?: string;
  userProfile: any;
  cognitiveAssessment: any;
  personalityAssessment: any;
  learningPreferences: any;
}) {
  const {
    subject,
    topic,
    educationLevel,
    contentType,
    difficulty,
    timeAllocation,
    learningObjectives,
    customRequirements,
    userProfile,
    cognitiveAssessment,
    personalityAssessment,
    learningPreferences,
  } = params;

  // Build personalization context
  const personalizationContext = {
    educationLevel: userProfile.educationLevel || 'high_school',
    location: userProfile.location || 'Global',
    careerGoals: userProfile.careerGoals || 'STEM career',
    cognitiveStrengths: cognitiveAssessment?.detailedResults?.strengths || ['analytical thinking'],
    learningStyle: learningPreferences?.learningStyle || 'visual',
    preferredPace: learningPreferences?.pacePreference || 'moderate',
    attentionSpan: learningPreferences?.attentionSpan || 30,
    personalityType: personalityAssessment?.jungType || 'INTJ',
  };

  const prompt = `
  Create a comprehensive, personalized learning course with the following specifications:

  COURSE REQUIREMENTS:
  - Subject: ${subject?.displayName || 'General STEM'}
  - Topic: ${topic?.name || 'Foundational concepts'}
  - Education Level: ${educationLevel?.displayName || 'High School'}
  - Content Type: ${contentType}
  - Difficulty: ${difficulty}/10
  - Time Allocation: ${timeAllocation} minutes
  - Learning Objectives: ${learningObjectives.join(', ')}
  ${customRequirements ? `- Custom Requirements: ${customRequirements}` : ''}

  PERSONALIZATION CONTEXT:
  - Student's Education Level: ${personalizationContext.educationLevel}
  - Location: ${personalizationContext.location}
  - Career Goals: ${personalizationContext.careerGoals}
  - Cognitive Strengths: ${personalizationContext.cognitiveStrengths.join(', ')}
  - Learning Style: ${personalizationContext.learningStyle}
  - Preferred Pace: ${personalizationContext.preferredPace}
  - Attention Span: ${personalizationContext.attentionSpan} minutes
  - Personality Type: ${personalizationContext.personalityType}

  Generate a course structure with:
  1. Course title and description
  2. 3-6 learning modules (each 5-15 minutes)
  3. Each module should include:
     - Title and learning objectives
     - Content (explanations, examples, activities)
     - Content type (text, interactive, quiz, video-script)
     - Estimated duration
     - Difficulty level
  4. Assessment components if contentType includes assessment
  5. Real-world applications relevant to student's location and career goals

  Format as JSON with clear structure. Make content engaging, age-appropriate, and aligned with the student's learning preferences.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in personalized STEM education. Create engaging, pedagogically sound learning materials tailored to individual student needs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const contentText = completion.choices[0]?.message?.content;
    if (!contentText) {
      throw new Error('No content generated');
    }

    try {
      const parsedContent = JSON.parse(contentText);
      return {
        ...parsedContent,
        generationPrompt: prompt,
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        title: `${subject?.displayName || 'STEM'} Course: ${topic?.name || 'Fundamentals'}`,
        description: `Personalized ${contentType} course covering ${topic?.name || 'key concepts'} at ${educationLevel?.displayName || 'appropriate'} level.`,
        modules: [
          {
            title: 'Introduction and Fundamentals',
            content: contentText.substring(0, 1000) + '...',
            type: 'text',
            estimatedDuration: Math.floor(timeAllocation / 3),
            difficulty: difficulty,
            learningObjectives: learningObjectives.slice(0, 2),
          },
          {
            title: 'Core Concepts and Applications',
            content: 'Detailed exploration of key concepts with practical examples...',
            type: 'interactive',
            estimatedDuration: Math.floor(timeAllocation / 2),
            difficulty: difficulty,
            learningObjectives: learningObjectives.slice(2, 4),
          },
          {
            title: 'Assessment and Review',
            content: 'Practice problems and knowledge check...',
            type: 'quiz',
            estimatedDuration: Math.floor(timeAllocation / 6),
            difficulty: difficulty,
            learningObjectives: ['Apply learned concepts', 'Self-assessment'],
          },
        ],
        generationPrompt: prompt,
      };
    }
  } catch (error) {
    console.error('Error generating course content:', error);
    
    // Fallback course structure
    return {
      title: `${subject?.displayName || 'STEM'} Course: ${topic?.name || 'Fundamentals'}`,
      description: `A personalized learning experience covering ${topic?.name || 'essential concepts'}.`,
      modules: [
        {
          title: 'Getting Started',
          content: `Welcome to your personalized ${subject?.displayName || 'STEM'} course! This course is designed specifically for your learning style and goals.`,
          type: 'text',
          estimatedDuration: 10,
          difficulty: Math.max(1, difficulty - 1),
          learningObjectives: ['Understand course structure', 'Set learning goals'],
        },
        {
          title: 'Core Learning',
          content: `Let's dive into the main concepts of ${topic?.name || 'this subject'}. We'll explore key ideas with examples relevant to your interests.`,
          type: 'interactive',
          estimatedDuration: timeAllocation - 20,
          difficulty: difficulty,
          learningObjectives: learningObjectives,
        },
        {
          title: 'Practice and Review',
          content: 'Test your understanding with practice exercises and review key concepts.',
          type: 'quiz',
          estimatedDuration: 10,
          difficulty: difficulty,
          learningObjectives: ['Apply knowledge', 'Self-assessment'],
        },
      ],
      generationPrompt: prompt,
    };
  }
}
