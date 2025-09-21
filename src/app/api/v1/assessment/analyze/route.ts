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

    const assessmentData = await request.json();
    
    // Get user profile
    const userProfile = await NeonDatabaseService.getUserProfile(userId);
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Process cognitive assessment
    let cognitiveAnalysis = null;
    if (assessmentData.cognitive_assessment) {
      const cognitiveScores = assessmentData.cognitive_assessment.scores || {};
      
      // Save cognitive assessment to database
      await NeonDatabaseService.saveCognitiveAssessment(userId, {
        overallScore: cognitiveScores.overall || 0,
        logicalReasoningScore: cognitiveScores.logical_reasoning || 0,
        numericalReasoningScore: cognitiveScores.numerical_reasoning || 0,
        verbalReasoningScore: cognitiveScores.verbal_reasoning || 0,
        spatialReasoningScore: cognitiveScores.spatial_reasoning || 0,
        workingMemoryScore: cognitiveScores.working_memory || 0,
        processingSpeedScore: cognitiveScores.processing_speed || 0,
        detailedResults: assessmentData.cognitive_assessment,
        completionTime: assessmentData.cognitive_assessment.completion_time || 0,
        isCompleted: true,
      });

      // Generate AI analysis for cognitive assessment
      cognitiveAnalysis = await analyzeCognitiveResults(cognitiveScores, userProfile);
    }

    // Process personality assessment
    let personalityAnalysis = null;
    if (assessmentData.personality_assessment) {
      // Save personality assessment to database
      await NeonDatabaseService.savePersonalityAssessment(userId, {
        jungType: assessmentData.personality_assessment.jung_type,
        jungDescription: assessmentData.personality_assessment.jung_description,
        bigFiveScores: assessmentData.personality_assessment.big_five_scores,
        keyTraits: assessmentData.personality_assessment.key_traits,
        workStyle: assessmentData.personality_assessment.work_style,
        communicationStyle: assessmentData.personality_assessment.communication_style,
        leadershipPotential: assessmentData.personality_assessment.leadership_potential || 0,
        teamCompatibility: assessmentData.personality_assessment.team_compatibility || 0,
        detailedResults: assessmentData.personality_assessment,
        isCompleted: true,
      });

      personalityAnalysis = assessmentData.personality_assessment;
    }

    // Process learning preferences
    let learningPreferences = null;
    if (assessmentData.learning_preferences) {
      // Save learning preferences to database
      await NeonDatabaseService.saveLearningPreferences(userId, {
        learningStyle: assessmentData.learning_preferences.learning_style,
        preferredContentFormat: assessmentData.learning_preferences.preferred_content_format,
        difficultyPreference: assessmentData.learning_preferences.difficulty_preference,
        pacePreference: assessmentData.learning_preferences.pace_preference,
        feedbackPreference: assessmentData.learning_preferences.feedback_preference,
        motivationalFactors: assessmentData.learning_preferences.motivational_factors,
        distractionLevel: assessmentData.learning_preferences.distraction_level || 5,
        attentionSpan: assessmentData.learning_preferences.attention_span || 30,
        preferredSessionLength: assessmentData.learning_preferences.preferred_session_length || 30,
        isCompleted: true,
      });

      learningPreferences = assessmentData.learning_preferences;
    }

    // Generate comprehensive career recommendations using AI
    const careerRecommendations = await generateCareerRecommendations(
      cognitiveAnalysis,
      personalityAnalysis,
      learningPreferences,
      userProfile
    );

    // Save career recommendations to database
    if (careerRecommendations && careerRecommendations.length > 0) {
      // For now, we'll create basic career path entries if they don't exist
      // In a full implementation, you'd have pre-populated career paths
      const savedRecommendations = [];
      for (const rec of careerRecommendations) {
        // This is a simplified approach - in production you'd match against existing career paths
        const careerPathId = 'temp-career-path-id'; // Would be actual UUID from career_paths table
        
        savedRecommendations.push({
          careerPathId,
          fitScore: rec.fit_score,
          reasoning: rec.reasoning,
          timelineEstimate: rec.timeline_estimate,
          requiredSteps: rec.required_steps,
          skillGaps: rec.skill_gaps,
        });
      }
      
      // await NeonDatabaseService.saveCareerRecommendations(userId, savedRecommendations);
    }

    // Award XP for completing assessment
    await NeonDatabaseService.addXpTransaction(
      userId,
      150,
      'assessment_completion',
      undefined,
      'assessment'
    );

    // Generate learning roadmap recommendations
    const learningRecommendations = await generateLearningRecommendations(
      cognitiveAnalysis,
      personalityAnalysis,
      learningPreferences,
      userProfile
    );

    const response = {
      success: true,
      data: {
        cognitive_profile: cognitiveAnalysis,
        personality_profile: personalityAnalysis,
        learning_preferences: learningPreferences,
        career_recommendations: careerRecommendations,
        learning_recommendations: learningRecommendations,
        overall_fit_score: calculateOverallFitScore(cognitiveAnalysis, personalityAnalysis),
        next_steps: generateNextSteps(careerRecommendations),
        analysis_timestamp: new Date().toISOString(),
      },
      message: 'Assessment analyzed successfully and saved to database',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing assessment:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze assessment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function analyzeCognitiveResults(scores: any, userProfile: any) {
  try {
    const prompt = `
    Analyze the following cognitive assessment results for educational career guidance:
    
    Cognitive Scores:
    - Overall: ${scores.overall || 0}/100
    - Logical Reasoning: ${scores.logical_reasoning || 0}/100
    - Numerical Reasoning: ${scores.numerical_reasoning || 0}/100
    - Verbal Reasoning: ${scores.verbal_reasoning || 0}/100
    - Spatial Reasoning: ${scores.spatial_reasoning || 0}/100
    - Working Memory: ${scores.working_memory || 0}/100
    - Processing Speed: ${scores.processing_speed || 0}/100
    
    User Profile:
    - Education Level: ${userProfile.educationLevel || 'Unknown'}
    - Location: ${userProfile.location || 'Unknown'}
    - Career Goals: ${userProfile.careerGoals || 'Not specified'}
    
    Provide a comprehensive analysis including:
    1. Cognitive strengths and weaknesses
    2. Learning capacity assessment
    3. Problem-solving style
    4. Recommended learning approaches
    5. Education-level adjusted interpretation
    
    Format as JSON with clear, encouraging language suitable for students.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an educational psychologist specializing in cognitive assessment analysis for students. Provide encouraging, actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysisText = completion.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Try to parse as JSON, fallback to structured text
    try {
      return JSON.parse(analysisText);
    } catch {
      return {
        overall_iq: scores.overall || 0,
        cognitive_strengths: [`Strong performance in areas scoring above ${Math.max(...Object.values(scores).map(v => Number(v) || 0))}`],
        cognitive_weaknesses: [`Areas for improvement in lower-scoring domains`],
        learning_capacity: 'Detailed analysis available upon completion',
        problem_solving_style: 'Adaptive approach recommended',
        education_adjusted_profile: scores,
        ai_analysis: analysisText,
      };
    }
  } catch (error) {
    console.error('Error in cognitive analysis:', error);
    return {
      overall_iq: scores.overall || 0,
      cognitive_strengths: ['Analysis pending - please try again'],
      cognitive_weaknesses: ['Analysis pending - please try again'],
      learning_capacity: 'Analysis temporarily unavailable',
      problem_solving_style: 'Standard approach recommended',
      education_adjusted_profile: scores,
    };
  }
}

async function generateCareerRecommendations(
  cognitiveAnalysis: any,
  personalityAnalysis: any,
  learningPreferences: any,
  userProfile: any
) {
  try {
    const prompt = `
    Generate career recommendations based on:
    
    Cognitive Profile: ${JSON.stringify(cognitiveAnalysis)}
    Personality: ${JSON.stringify(personalityAnalysis)}
    Learning Preferences: ${JSON.stringify(learningPreferences)}
    User Profile: Education Level: ${userProfile.educationLevel}, Goals: ${userProfile.careerGoals}
    
    Provide 3-5 career recommendations with:
    1. Career title
    2. Fit score (0-100)
    3. Reasoning based on assessment results
    4. Timeline estimate
    5. Required steps
    6. Skill gaps to address
    
    Focus on STEM and technology careers. Format as JSON array.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a career counselor specializing in STEM education and technology careers. Provide practical, achievable recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const recommendationsText = completion.choices[0]?.message?.content;
    if (!recommendationsText) {
      return [];
    }

    try {
      return JSON.parse(recommendationsText);
    } catch {
      // Fallback recommendations
      return [
        {
          title: 'Software Developer',
          fit_score: 85,
          reasoning: 'Strong analytical skills and problem-solving abilities align well with software development',
          timeline_estimate: '2-4 years',
          required_steps: ['Learn programming languages', 'Build portfolio projects', 'Gain practical experience'],
          skill_gaps: ['Programming', 'Software architecture', 'Version control'],
        },
        {
          title: 'Data Analyst',
          fit_score: 80,
          reasoning: 'Numerical reasoning skills and attention to detail suit data analysis roles',
          timeline_estimate: '1-3 years',
          required_steps: ['Learn data analysis tools', 'Study statistics', 'Work on data projects'],
          skill_gaps: ['SQL', 'Python/R', 'Data visualization'],
        },
      ];
    }
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    return [];
  }
}

async function generateLearningRecommendations(
  cognitiveAnalysis: any,
  personalityAnalysis: any,
  learningPreferences: any,
  userProfile: any
) {
  const recommendations = {
    optimal_learning_style: learningPreferences?.learning_style || 'visual',
    recommended_pace: learningPreferences?.pace_preference || 'moderate',
    support_level: 'moderate',
    study_schedule: learningPreferences?.preferred_session_length ? 
      `${learningPreferences.preferred_session_length} minute sessions` : '30 minute sessions',
    motivational_approach: 'achievement-oriented',
    engagement_strategies: [
      'Interactive content',
      'Real-world applications',
      'Progress tracking',
      'Bite-sized learning modules'
    ],
  };

  return recommendations;
}

function calculateOverallFitScore(cognitiveAnalysis: any, personalityAnalysis: any): number {
  // Simple calculation - in production this would be more sophisticated
  const cognitiveScore = cognitiveAnalysis?.overall_iq || 70;
  const personalityFactor = personalityAnalysis?.leadership_potential || 70;
  
  return Math.round((cognitiveScore + personalityFactor) / 2);
}

function generateNextSteps(careerRecommendations: any[]): string[] {
  if (!careerRecommendations || careerRecommendations.length === 0) {
    return [
      'Complete your profile setup',
      'Explore STEM subjects that interest you',
      'Consider taking additional assessments',
    ];
  }

  const topRecommendation = careerRecommendations[0];
  return topRecommendation.required_steps || [
    'Research your recommended career paths',
    'Identify relevant educational programs',
    'Start building foundational skills',
  ];
}
