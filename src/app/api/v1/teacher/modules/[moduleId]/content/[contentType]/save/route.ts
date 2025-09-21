import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; contentType: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, contentType } = await params;
    const body = await request.json();
    const { content, creationMethod = 'manual', changeSummary } = body;

    // Validate content type
    const validContentTypes = ['core', 'bite-sized', 'video-script', 'image-prompts', 'voice-script', 'assessments'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid content type' 
      }, { status: 400 });
    }

    // Verify module exists and user has access
    const moduleResult = await sql`
      SELECT id, content_data FROM course_modules 
      WHERE id = ${moduleId}
      LIMIT 1
    `;

    if (moduleResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Module not found' 
      }, { status: 404 });
    }

    const module = moduleResult[0];

    // Get the current version number
    const existingVersionsResult = await sql`
      SELECT version_number FROM content_versions 
      WHERE module_id = ${moduleId} AND content_type = ${contentType}
      ORDER BY version_number DESC
      LIMIT 1
    `;

    const nextVersionNumber = existingVersionsResult.length > 0 
      ? existingVersionsResult[0].version_number + 1 
      : 1;

    // Create new version
    const newVersionResult = await sql`
      INSERT INTO content_versions (
        module_id, content_type, version_number, content, 
        creation_method, created_by, is_published, summary
      ) VALUES (
        ${moduleId}, ${contentType}, ${nextVersionNumber}, ${content},
        ${creationMethod}, ${userId}, false, ${changeSummary || `${creationMethod} content update`}
      )
      RETURNING id, version_number, created_at
    `;

    // Update the module's content data
    const contentKey = contentType === 'core' ? 'coreContent' : 
                      contentType === 'bite-sized' ? 'biteSizedContent' :
                      contentType === 'video-script' ? 'videoScript' :
                      contentType === 'image-prompts' ? 'imagePrompts' :
                      contentType === 'voice-script' ? 'voiceScript' :
                      'assessments';

    const currentContentData = module.content_data || {};
    const updatedContentData = {
      ...currentContentData,
      [contentKey]: content
    };

    await sql`
      UPDATE course_modules 
      SET content_data = ${JSON.stringify(updatedContentData)}, updated_at = NOW()
      WHERE id = ${moduleId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      version: newVersionResult[0]
    });

  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
