/**
 * Content Generation Service
 * Handles AI-powered content generation for educational modules
 */

interface ContentGenerationRequest {
  contentType: 'core' | 'bite-sized' | 'video-script' | 'image-prompts' | 'voice-script' | 'assessments';
  moduleData: {
    id: string;
    title: string;
    description: string;
    learningObjectives: string[];
    estimatedDuration: number;
    contentType: string;
  };
  courseContext?: {
    title: string;
    subject: string;
    educationLevel: string;
    difficulty: number;
  };
  userPreferences?: {
    region?: string;
    language?: string;
    teachingStyle?: string;
  };
}

interface ContentGenerationResponse {
  success: boolean;
  content?: any;
  error?: string;
  metadata?: {
    generationTime: number;
    tokensUsed: number;
    qualityScore: number;
  };
}

class ContentGenerationService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    const startTime = Date.now();

    try {
      switch (request.contentType) {
        case 'core':
          return await this.generateCoreContent(request, startTime);
        case 'bite-sized':
          return await this.generateBiteSizedContent(request, startTime);
        case 'video-script':
          return await this.generateVideoScript(request, startTime);
        case 'image-prompts':
          return await this.generateImagePrompts(request, startTime);
        case 'voice-script':
          return await this.generateVoiceScript(request, startTime);
        case 'assessments':
          return await this.generateAssessments(request, startTime);
        default:
          throw new Error(`Unsupported content type: ${request.contentType}`);
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async generateCoreContent(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildCoreContentPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'core')
      }
    };
  }

  private async generateBiteSizedContent(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildBiteSizedContentPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'bite-sized')
      }
    };
  }

  private async generateVideoScript(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildVideoScriptPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'video-script')
      }
    };
  }

  private async generateImagePrompts(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildImagePromptsPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.8,
      max_tokens: 2000
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'image-prompts')
      }
    };
  }

  private async generateVoiceScript(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildVoiceScriptPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'voice-script')
      }
    };
  }

  private async generateAssessments(request: ContentGenerationRequest, startTime: number): Promise<ContentGenerationResponse> {
    const prompt = this.buildAssessmentsPrompt(request);
    
    const response = await this.callOpenAI(prompt, {
      model: 'gpt-4',
      temperature: 0.6,
      max_tokens: 3500
    });

    const content = this.extractJSONFromResponse(response.content);
    const generationTime = Date.now() - startTime;

    return {
      success: true,
      content,
      metadata: {
        generationTime,
        tokensUsed: response.usage?.total_tokens || 0,
        qualityScore: this.assessContentQuality(content, 'assessments')
      }
    };
  }

  private buildCoreContentPrompt(request: ContentGenerationRequest): string {
    const { moduleData, courseContext, userPreferences } = request;
    
    return `
Create comprehensive core educational content for a module titled "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}
- Estimated Duration: ${moduleData.estimatedDuration} minutes
- Content Type: ${moduleData.contentType}

${courseContext ? `
COURSE CONTEXT:
- Course: ${courseContext.title}
- Subject: ${courseContext.subject}
- Education Level: ${courseContext.educationLevel}
- Difficulty: ${courseContext.difficulty}/10
` : ''}

${userPreferences ? `
USER PREFERENCES:
- Region: ${userPreferences.region || 'International'}
- Language: ${userPreferences.language || 'English'}
- Teaching Style: ${userPreferences.teachingStyle || 'Balanced'}
` : ''}

Create detailed educational content with the following structure:

{
  "introduction": {
    "overview": "Engaging introduction to the topic",
    "importance": "Why this topic matters",
    "realWorldApplications": ["Application 1", "Application 2", "Application 3"]
  },
  "mainContent": {
    "sections": [
      {
        "title": "Section Title",
        "content": "Detailed explanation with examples",
        "keyConcepts": ["Concept 1", "Concept 2"],
        "examples": [
          {
            "title": "Example Title",
            "description": "Step-by-step example",
            "solution": "Detailed solution"
          }
        ],
        "commonMisconceptions": ["Misconception and correction"]
      }
    ]
  },
  "practicalApplications": {
    "exercises": [
      {
        "title": "Exercise Title",
        "description": "What students need to do",
        "difficulty": "easy/medium/hard",
        "estimatedTime": "X minutes"
      }
    ],
    "projects": [
      {
        "title": "Project Title",
        "description": "Project overview",
        "deliverables": ["Deliverable 1", "Deliverable 2"],
        "assessmentCriteria": ["Criteria 1", "Criteria 2"]
      }
    ]
  },
  "summary": {
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "nextSteps": "What students should do next",
    "additionalResources": ["Resource 1", "Resource 2"]
  },
  "engagementElements": {
    "discussionQuestions": ["Question 1", "Question 2"],
    "interactiveActivities": ["Activity 1", "Activity 2"],
    "reflectionPrompts": ["Prompt 1", "Prompt 2"]
  }
}

Ensure content is:
1. Age-appropriate and educationally sound
2. Engaging and interactive
3. Includes diverse examples and perspectives
4. Optimized for modern attention spans
5. Aligned with learning objectives
`;
  }

  private buildBiteSizedContentPrompt(request: ContentGenerationRequest): string {
    const { moduleData } = request;
    
    return `
Create bite-sized, digestible content chunks for the module "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}

Create content optimized for quick consumption and retention:

{
  "microLessons": [
    {
      "title": "Micro Lesson Title",
      "duration": "2-3 minutes",
      "keyPoint": "Single main concept",
      "content": "Concise explanation",
      "visualCue": "Suggested visual element",
      "actionItem": "What student should do"
    }
  ],
  "quickFacts": [
    {
      "fact": "Interesting fact",
      "explanation": "Brief explanation",
      "relevance": "Why this matters"
    }
  ],
  "keyTerms": [
    {
      "term": "Important term",
      "definition": "Clear, simple definition",
      "example": "Real-world example"
    }
  ],
  "quickQuizzes": [
    {
      "question": "Quick check question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "Why this is correct"
    }
  ],
  "mnemonics": [
    {
      "concept": "Concept to remember",
      "mnemonic": "Memory aid",
      "explanation": "How to use it"
    }
  ]
}

Focus on:
- Single concept per chunk
- 2-3 minute consumption time
- Clear, simple language
- Memorable elements
- Immediate application
`;
  }

  private buildVideoScriptPrompt(request: ContentGenerationRequest): string {
    const { moduleData } = request;
    
    return `
Create a video script for the module "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}
- Duration: ${moduleData.estimatedDuration} minutes

Create a script optimized for video content:

{
  "mainVideo": {
    "title": "Main Video Title",
    "totalDuration": "${moduleData.estimatedDuration} minutes",
    "scenes": [
      {
        "timestamp": "00:00-00:30",
        "sceneType": "introduction/explanation/demonstration/conclusion",
        "narration": "What the narrator says",
        "visuals": "What appears on screen",
        "animations": "Any animations or transitions",
        "engagementHook": "How to keep viewers engaged"
      }
    ],
    "callToAction": "What students should do after watching"
  },
  "microVideos": [
    {
      "title": "Micro Video Title",
      "duration": "2-3 minutes",
      "focus": "Specific concept focus",
      "script": [
        {
          "timestamp": "00:00-00:15",
          "narration": "Narrator text",
          "visuals": "Visual elements",
          "keyPoint": "Main learning point"
        }
      ]
    }
  ],
  "interactiveElements": [
    {
      "timestamp": "02:30",
      "type": "quiz_question/poll/discussion",
      "content": "Interactive element content",
      "purpose": "Why this interaction is included"
    }
  ],
  "productionNotes": {
    "style": "Animation/live-action/mixed",
    "tone": "Professional/casual/enthusiastic",
    "pacing": "Fast/medium/slow",
    "specialRequirements": ["Any special production needs"]
  }
}

Ensure scripts are:
- Conversational and engaging
- Include natural pauses and emphasis
- Optimized for video format
- Include clear learning objectives
- Maintain viewer attention
`;
  }

  private buildImagePromptsPrompt(request: ContentGenerationRequest): string {
    const { moduleData } = request;
    
    return `
Generate detailed image prompts for educational illustrations for the module "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}

Create prompts for DALL-E 3 that will generate educational visuals:

{
  "conceptIllustrations": [
    {
      "title": "Illustration Title",
      "prompt": "Detailed DALL-E prompt for educational illustration",
      "purpose": "Educational purpose",
      "placement": "Where in content this should appear",
      "style": "Professional, clean, educational"
    }
  ],
  "diagrams": [
    {
      "title": "Diagram Title",
      "prompt": "Detailed DALL-E prompt for diagram",
      "type": "flowchart/process/comparison/concept map",
      "complexity": "simple/medium/complex"
    }
  ],
  "realWorldExamples": [
    {
      "title": "Example Title",
      "prompt": "DALL-E prompt for real-world example",
      "context": "How this relates to the lesson"
    }
  ],
  "infographics": [
    {
      "title": "Infographic Title",
      "prompt": "DALL-E prompt for infographic",
      "dataFocus": "What data/information to highlight"
    }
  ]
}

Each prompt should be:
- Detailed and specific
- Educational and informative
- Professional and clean style
- Suitable for the target audience
- Culturally appropriate
`;
  }

  private buildVoiceScriptPrompt(request: ContentGenerationRequest): string {
    const { moduleData } = request;
    
    return `
Create voice scripts optimized for audio learning for the module "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}
- Duration: ${moduleData.estimatedDuration} minutes

Create scripts optimized for audio-only learning:

{
  "mainNarration": {
    "title": "Main Lesson Audio",
    "duration": "${moduleData.estimatedDuration} minutes",
    "script": "Full narration script with [PAUSE] and [EMPHASIS] markers",
    "voiceNotes": "Tone, pace, and delivery instructions",
    "pronunciationGuide": {"difficult_word": "pronunciation"},
    "backgroundMusic": "Suggested background music style"
  },
  "conceptExplanations": [
    {
      "concept": "Concept Name",
      "script": "Clear explanation script",
      "duration": "2-3 minutes",
      "voiceStyle": "Conversational/formal/enthusiastic",
      "keyEmphasis": ["Word 1", "Word 2"]
    }
  ],
  "exampleWalkthroughs": [
    {
      "example": "Example Title",
      "script": "Step-by-step audio walkthrough",
      "duration": "3-4 minutes",
      "pacing": "Slow/medium/fast",
      "interactionCues": ["When to pause for thinking"]
    }
  ],
  "summaryReview": {
    "script": "Comprehensive review script",
    "duration": "3-5 minutes",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "callToAction": "What students should do next"
  },
  "productionSpecs": {
    "voiceType": "Professional, clear, engaging",
    "speakingRate": "150-160 words per minute",
    "audioQuality": "Studio quality specifications"
  }
}

Ensure scripts:
- Use conversational, natural language
- Include clear transitions between topics
- Provide audio cues for important information
- Include engagement techniques for audio learning
- Are optimized for comprehension without visuals
`;
  }

  private buildAssessmentsPrompt(request: ContentGenerationRequest): string {
    const { moduleData } = request;
    
    return `
Create comprehensive assessments for the module "${moduleData.title}".

MODULE DETAILS:
- Title: ${moduleData.title}
- Description: ${moduleData.description}
- Learning Objectives: ${moduleData.learningObjectives.join(', ')}

Create assessments including multiple question types:

{
  "formativeAssessments": [
    {
      "type": "quick_check",
      "title": "Understanding Check",
      "questions": [
        {
          "question": "Question text",
          "type": "mcq/short_answer/true_false",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "B",
          "explanation": "Why this is correct",
          "difficulty": "easy/medium/hard",
          "learningObjective": "Which objective this assesses"
        }
      ],
      "estimatedTime": 10
    }
  ],
  "summativeAssessments": [
    {
      "type": "module_test",
      "title": "Module Assessment",
      "sections": [
        {
          "sectionName": "Multiple Choice",
          "instructions": "Choose the best answer",
          "questions": [
            {
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "explanation": "Detailed explanation",
              "marks": 2,
              "difficulty": "medium"
            }
          ]
        },
        {
          "sectionName": "Short Answer",
          "instructions": "Answer in 2-3 sentences",
          "questions": [
            {
              "question": "Question text",
              "sampleAnswer": "Model answer",
              "markingCriteria": ["Criterion 1", "Criterion 2"],
              "marks": 5,
              "difficulty": "medium"
            }
          ]
        }
      ],
      "totalMarks": 50,
      "estimatedTime": 60
    }
  ],
  "practicalAssessments": [
    {
      "type": "hands_on_activity",
      "title": "Practical Application",
      "description": "Real-world application task",
      "materialsNeeded": ["Material 1", "Material 2"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "assessmentCriteria": ["Criteria 1", "Criteria 2"],
      "marks": 20,
      "estimatedTime": 45
    }
  ],
  "rubrics": {
    "knowledgeUnderstanding": {
      "excellent": "Demonstrates comprehensive understanding",
      "good": "Shows solid understanding with minor gaps",
      "satisfactory": "Basic understanding evident",
      "needsImprovement": "Limited understanding shown"
    },
    "application": {
      "excellent": "Applies knowledge effectively in new contexts",
      "good": "Good application with some guidance",
      "satisfactory": "Basic application skills",
      "needsImprovement": "Struggles to apply knowledge"
    }
  }
}

Ensure assessments:
- Are fair and unbiased
- Include diverse question types
- Have clear marking criteria
- Are age-appropriate
- Align with learning objectives
`;
  }

  private async callOpenAI(prompt: string, options: any) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in curriculum development. Create engaging, pedagogically sound content that promotes effective learning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature,
        max_tokens: options.max_tokens
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  }

  private extractJSONFromResponse(content: string): any {
    try {
      // Find JSON content between curly braces
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON content found in response');
      }
      
      const jsonContent = content.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Failed to extract JSON from response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  private assessContentQuality(content: any, contentType: string): number {
    let score = 0;
    
    switch (contentType) {
      case 'core':
        if (content.introduction) score += 0.2;
        if (content.mainContent && content.mainContent.sections) score += 0.3;
        if (content.practicalApplications) score += 0.2;
        if (content.summary) score += 0.2;
        if (content.engagementElements) score += 0.1;
        break;
        
      case 'bite-sized':
        if (content.microLessons && content.microLessons.length > 0) score += 0.3;
        if (content.quickFacts && content.quickFacts.length > 0) score += 0.2;
        if (content.keyTerms && content.keyTerms.length > 0) score += 0.2;
        if (content.quickQuizzes && content.quickQuizzes.length > 0) score += 0.2;
        if (content.mnemonics && content.mnemonics.length > 0) score += 0.1;
        break;
        
      case 'video-script':
        if (content.mainVideo) score += 0.4;
        if (content.microVideos && content.microVideos.length > 0) score += 0.3;
        if (content.interactiveElements && content.interactiveElements.length > 0) score += 0.2;
        if (content.productionNotes) score += 0.1;
        break;
        
      case 'image-prompts':
        if (content.conceptIllustrations && content.conceptIllustrations.length > 0) score += 0.25;
        if (content.diagrams && content.diagrams.length > 0) score += 0.25;
        if (content.realWorldExamples && content.realWorldExamples.length > 0) score += 0.25;
        if (content.infographics && content.infographics.length > 0) score += 0.25;
        break;
        
      case 'voice-script':
        if (content.mainNarration) score += 0.4;
        if (content.conceptExplanations && content.conceptExplanations.length > 0) score += 0.3;
        if (content.exampleWalkthroughs && content.exampleWalkthroughs.length > 0) score += 0.2;
        if (content.summaryReview) score += 0.1;
        break;
        
      case 'assessments':
        if (content.formativeAssessments && content.formativeAssessments.length > 0) score += 0.3;
        if (content.summativeAssessments && content.summativeAssessments.length > 0) score += 0.3;
        if (content.practicalAssessments && content.practicalAssessments.length > 0) score += 0.2;
        if (content.rubrics) score += 0.2;
        break;
    }
    
    return Math.min(score, 1.0);
  }
}

export default ContentGenerationService;
export type { ContentGenerationRequest, ContentGenerationResponse };
