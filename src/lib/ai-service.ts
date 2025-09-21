import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Types for AI providers
export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface AssessmentAnalysis {
  personalityProfile: {
    bigFive: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    workStyle: string;
    communicationStyle: string;
    leadershipPotential: number;
  };
  technicalAptitude: {
    logicalReasoning: number;
    analyticalThinking: number;
    problemSolving: number;
    creativity: number;
    technicalComfort: number;
  };
  careerRecommendations: Array<{
    title: string;
    fitScore: number;
    reasoning: string;
    timeline: string;
    salary: string;
    skills: string[];
    description: string;
  }>;
  learningPath: {
    style: string;
    pace: string;
    supportLevel: string;
    recommendedModules: string[];
  };
  gamificationProfile: {
    level: number;
    xp: number;
    achievements: string[];
    strengths: string[];
    growthAreas: string[];
  };
}

class AIService {
  private openai?: OpenAI;
  private gemini?: GoogleGenerativeAI;
  private currentProvider: AIProvider = 'openai';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }

    // Initialize Gemini
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    }
  }

  async analyzeAssessment(assessmentData: any): Promise<AssessmentAnalysis> {
    const prompt = this.buildAnalysisPrompt(assessmentData);
    
    try {
      let response: string;
      
      switch (this.currentProvider) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'gemini':
          response = await this.callGemini(prompt);
          break;
        default:
          response = await this.callOpenAI(prompt);
      }

      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return this.getFallbackAnalysis(assessmentData);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not initialized');
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor and psychologist specializing in AI and Cybersecurity career development. Analyze assessment data and provide comprehensive, personalized recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return completion.choices[0]?.message?.content || '';
  }

  private async callGemini(prompt: string): Promise<string> {
    if (!this.gemini) throw new Error('Gemini not initialized');
    
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private buildAnalysisPrompt(data: any): string {
    return `
Analyze this comprehensive career assessment data and provide detailed insights:

BASIC INFORMATION:
- Current Role: ${data.basicInfo?.currentRole}
- Experience: ${data.basicInfo?.experience}
- Education: ${data.basicInfo?.education}
- Location: ${data.basicInfo?.location}
- Age Range: ${data.basicInfo?.ageRange}
- Cultural Background: ${data.basicInfo?.culturalBackground}

TECHNICAL INTERESTS & APTITUDE:
- Technology Comfort: ${data.technicalInterests?.technologyComfort}
- Problem Solving Approach: ${data.technicalInterests?.problemSolvingApproach}
- Interest Areas: ${data.technicalInterests?.interestAreas?.join(', ')}
- Analytical Thinking: ${data.technicalInterests?.analyticalThinking}

TECHNICAL ASSESSMENT SCORES:
- Logic Score: ${data.technicalAptitude?.logicScore}
- Math Score: ${data.technicalAptitude?.mathScore}
- Systems Score: ${data.technicalAptitude?.systemsScore}
- Problem Solving Score: ${data.technicalAptitude?.problemSolvingScore}
- Creativity Score: ${data.technicalAptitude?.creativityScore}

LEARNING STYLE:
- Modality: ${data.learningStyle?.modality}
- Pace: ${data.learningStyle?.pace}
- Support: ${data.learningStyle?.support}
- Schedule: ${data.learningStyle?.schedule}

PERSONALITY PROFILE:
- Risk Tolerance: ${data.personalityProfile?.riskTolerance}
- Communication Style: ${data.personalityProfile?.communicationStyle}
- Work Style: ${data.personalityProfile?.workStyle}
- Motivation Drivers: ${data.personalityProfile?.motivationDrivers?.join(', ')}

GOALS & ASPIRATIONS:
- Career Goals: ${data.goals?.careerGoals}
- Timeline: ${data.goals?.timeline}
- Salary Expectations: ${data.goals?.salaryExpectations}
- Work Environment: ${data.goals?.workEnvironment}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "personalityProfile": {
    "bigFive": {
      "openness": 0-100,
      "conscientiousness": 0-100,
      "extraversion": 0-100,
      "agreeableness": 0-100,
      "neuroticism": 0-100
    },
    "workStyle": "description",
    "communicationStyle": "description",
    "leadershipPotential": 0-100
  },
  "technicalAptitude": {
    "logicalReasoning": 0-100,
    "analyticalThinking": 0-100,
    "problemSolving": 0-100,
    "creativity": 0-100,
    "technicalComfort": 0-100
  },
  "careerRecommendations": [
    {
      "title": "Career Title",
      "fitScore": 0-100,
      "reasoning": "Why this career fits",
      "timeline": "6-12 months",
      "salary": "$XXk-$XXXk",
      "skills": ["skill1", "skill2"],
      "description": "Career description"
    }
  ],
  "learningPath": {
    "style": "Recommended learning approach",
    "pace": "Recommended pace",
    "supportLevel": "Recommended support",
    "recommendedModules": ["module1", "module2"]
  },
  "gamificationProfile": {
    "level": 1-10,
    "xp": 0-1000,
    "achievements": ["achievement1", "achievement2"],
    "strengths": ["strength1", "strength2"],
    "growthAreas": ["area1", "area2"]
  }
}

Focus on AI and Cybersecurity career paths. Be specific, actionable, and encouraging.
`;
  }

  private parseAnalysisResponse(response: string): AssessmentAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
    
    // Return fallback if parsing fails
    return this.getFallbackAnalysis({});
  }

  private getFallbackAnalysis(data: any): AssessmentAnalysis {
    return {
      personalityProfile: {
        bigFive: {
          openness: 75,
          conscientiousness: 80,
          extraversion: 60,
          agreeableness: 70,
          neuroticism: 30
        },
        workStyle: "Collaborative and analytical",
        communicationStyle: "Clear and direct",
        leadershipPotential: 75
      },
      technicalAptitude: {
        logicalReasoning: 85,
        analyticalThinking: 80,
        problemSolving: 88,
        creativity: 75,
        technicalComfort: 82
      },
      careerRecommendations: [
        {
          title: "Machine Learning Engineer",
          fitScore: 92,
          reasoning: "Strong analytical skills and technical aptitude make you ideal for ML engineering",
          timeline: "8-12 months",
          salary: "$140k-$240k",
          skills: ["Python", "TensorFlow", "PyTorch", "Statistics", "Cloud Platforms"],
          description: "Build and deploy AI models that solve real-world problems"
        },
        {
          title: "Cybersecurity Analyst",
          fitScore: 85,
          reasoning: "Your systematic approach and attention to detail are perfect for security analysis",
          timeline: "6-9 months",
          salary: "$80k-$140k",
          skills: ["Network Security", "SIEM Tools", "Incident Response", "Risk Assessment"],
          description: "Protect organizations from cyber threats and vulnerabilities"
        }
      ],
      learningPath: {
        style: "Visual and hands-on learning",
        pace: "Self-paced with structure",
        supportLevel: "Moderate guidance",
        recommendedModules: ["Python Fundamentals", "Machine Learning Basics", "Data Analysis"]
      },
      gamificationProfile: {
        level: 3,
        xp: 250,
        achievements: ["Assessment Complete", "Tech Explorer", "Goal Setter"],
        strengths: ["Analytical Thinking", "Problem Solving", "Technical Aptitude"],
        growthAreas: ["Communication Skills", "Leadership Development"]
      }
    };
  }

  setProvider(provider: AIProvider) {
    this.currentProvider = provider;
  }

  getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];
    if (this.openai) providers.push('openai');
    if (this.gemini) providers.push('gemini');
    return providers;
  }
}

export const aiService = new AIService();
