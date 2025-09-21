import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ContentGenerationService from '../../../../../../../lib/content-generation-service';
import { UnifiedDatabaseService } from '../../../../../../../lib/unified-database-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const body = await request.json();
    const { contentType, moduleData, courseContext, userPreferences } = body;

    // Validate required fields
    if (!contentType || !moduleData) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType and moduleData' },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = ['core', 'bite-sized', 'video-script', 'image-prompts', 'voice-script', 'assessments'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify module exists and belongs to the teacher
    const moduleExists = await UnifiedDatabaseService.getModuleById(moduleId);
    if (!moduleExists) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the module belongs to a course owned by the authenticated teacher
    const courseData = await UnifiedDatabaseService.getCourseById(moduleExists.courseId);
    if (!courseData || courseData.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    console.log(`Generating ${contentType} content for module ${moduleId}`);

    // Initialize content generation service
    const contentGenerator = new ContentGenerationService();

    // Generate content
    const generationResult = await contentGenerator.generateContent({
      contentType: contentType as any,
      moduleData: {
        id: moduleId,
        title: moduleData.title || moduleExists.title,
        description: moduleData.description || moduleExists.description,
        learningObjectives: moduleData.learningObjectives || moduleExists.learningObjectives || [],
        estimatedDuration: moduleData.estimatedDuration || moduleExists.estimatedDuration || 60,
        contentType: moduleData.contentType || moduleExists.contentType || 'text'
      },
      courseContext: courseContext || {
        title: courseData.title,
        subject: courseData.subjectId || 'General',
        educationLevel: courseData.educationLevelId || 'intermediate',
        difficulty: courseData.difficulty || 5
      },
      userPreferences: userPreferences || {
        region: 'International',
        language: 'English',
        teachingStyle: 'Balanced'
      }
    });

    if (!generationResult.success) {
      console.error('Content generation failed:', generationResult.error);
      return NextResponse.json(
        { 
          error: 'Content generation failed', 
          details: generationResult.error 
        },
        { status: 500 }
      );
    }

    // Save generated content to database
    const contentKey = contentType === 'core' ? 'coreContent' : 
                      contentType === 'bite-sized' ? 'biteSizedContent' :
                      contentType === 'video-script' ? 'videoScript' :
                      contentType === 'image-prompts' ? 'imagePrompts' :
                      contentType === 'voice-script' ? 'voiceScript' :
                      'assessments';

    const updatedContentData = {
      ...moduleExists.contentData,
      [contentKey]: generationResult.content
    };

    // Update module with generated content
    await UnifiedDatabaseService.updateModuleContent(moduleId, {
      contentData: updatedContentData,
      generationMetadata: {
        ...moduleExists.generationMetadata,
        [contentType]: {
          generatedAt: new Date().toISOString(),
          generationTime: generationResult.metadata?.generationTime,
          tokensUsed: generationResult.metadata?.tokensUsed,
          qualityScore: generationResult.metadata?.qualityScore,
          version: 1
        }
      }
    });

    console.log(`Successfully generated and saved ${contentType} content for module ${moduleId}`);

    return NextResponse.json({
      success: true,
      content: generationResult.content,
      metadata: generationResult.metadata,
      message: `${contentType} content generated successfully`
    });

  } catch (error) {
    console.error('Error in content generation API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve existing content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');

    // Verify module exists and belongs to the teacher
    const moduleData = await UnifiedDatabaseService.getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the module belongs to a course owned by the authenticated teacher
    const courseData = await UnifiedDatabaseService.getCourseById(moduleData.courseId);
    if (!courseData || courseData.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (contentType) {
      // Return specific content type
      const contentKey = contentType === 'core' ? 'coreContent' : 
                        contentType === 'bite-sized' ? 'biteSizedContent' :
                        contentType === 'video-script' ? 'videoScript' :
                        contentType === 'image-prompts' ? 'imagePrompts' :
                        contentType === 'voice-script' ? 'voiceScript' :
                        'assessments';

      const content = moduleData.contentData[contentKey];
      const metadata = moduleData.generationMetadata?.[contentType];

      return NextResponse.json({
        success: true,
        contentType,
        content,
        metadata,
        hasContent: !!content
      });
    } else {
      // Return all content types status
      const contentStatus = {
        core: !!moduleData.contentData.coreContent,
        'bite-sized': !!moduleData.contentData.biteSizedContent,
        'video-script': !!moduleData.contentData.videoScript,
        'image-prompts': !!moduleData.contentData.imagePrompts,
        'voice-script': !!moduleData.contentData.voiceScript,
        assessments: !!moduleData.contentData.assessments
      };

      return NextResponse.json({
        success: true,
        moduleId,
        contentStatus,
        generationMetadata: moduleData.generationMetadata || {}
      });
    }

  } catch (error) {
    console.error('Error retrieving module content:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update existing content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const body = await request.json();
    const { contentType, content } = body;

    // Validate required fields
    if (!contentType || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType and content' },
        { status: 400 }
      );
    }

    // Verify module exists and belongs to the teacher
    const moduleData = await UnifiedDatabaseService.getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the module belongs to a course owned by the authenticated teacher
    const courseData = await UnifiedDatabaseService.getCourseById(moduleData.courseId);
    if (!courseData || courseData.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update content
    const contentKey = contentType === 'core' ? 'coreContent' : 
                      contentType === 'bite-sized' ? 'biteSizedContent' :
                      contentType === 'video-script' ? 'videoScript' :
                      contentType === 'image-prompts' ? 'imagePrompts' :
                      contentType === 'voice-script' ? 'voiceScript' :
                      'assessments';

    const updatedContentData = {
      ...moduleData.contentData,
      [contentKey]: content
    };

    // Update module with new content
    await UnifiedDatabaseService.updateModuleContent(moduleId, {
      contentData: updatedContentData,
      generationMetadata: {
        ...moduleData.generationMetadata,
        [contentType]: {
          ...moduleData.generationMetadata?.[contentType],
          lastModified: new Date().toISOString(),
          manuallyEdited: true
        }
      }
    });

    console.log(`Successfully updated ${contentType} content for module ${moduleId}`);

    return NextResponse.json({
      success: true,
      message: `${contentType} content updated successfully`
    });

  } catch (error) {
    console.error('Error updating module content:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');

    if (!contentType) {
      return NextResponse.json(
        { error: 'Missing required parameter: contentType' },
        { status: 400 }
      );
    }

    // Verify module exists and belongs to the teacher
    const moduleData = await UnifiedDatabaseService.getModuleById(moduleId);
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the module belongs to a course owned by the authenticated teacher
    const courseData = await UnifiedDatabaseService.getCourseById(moduleData.courseId);
    if (!courseData || courseData.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Remove content
    const contentKey = contentType === 'core' ? 'coreContent' : 
                      contentType === 'bite-sized' ? 'biteSizedContent' :
                      contentType === 'video-script' ? 'videoScript' :
                      contentType === 'image-prompts' ? 'imagePrompts' :
                      contentType === 'voice-script' ? 'voiceScript' :
                      'assessments';

    const updatedContentData = { ...moduleData.contentData };
    delete updatedContentData[contentKey];

    const updatedGenerationMetadata = { ...moduleData.generationMetadata };
    delete updatedGenerationMetadata[contentType];

    // Update module without the deleted content
    await UnifiedDatabaseService.updateModuleContent(moduleId, {
      contentData: updatedContentData,
      generationMetadata: updatedGenerationMetadata
    });

    console.log(`Successfully deleted ${contentType} content for module ${moduleId}`);

    return NextResponse.json({
      success: true,
      message: `${contentType} content deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting module content:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
