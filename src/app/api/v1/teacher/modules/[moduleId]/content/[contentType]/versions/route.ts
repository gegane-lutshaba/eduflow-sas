import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; contentType: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, contentType } = await params;

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
      SELECT id FROM course_modules 
      WHERE id = ${moduleId}
      LIMIT 1
    `;

    if (moduleResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Module not found' 
      }, { status: 404 });
    }

    // Get all versions for this content type
    const versionsResult = await sql`
      SELECT 
        cv.id,
        cv.version_number as version,
        cv.content,
        cv.creation_method,
        cv.created_by,
        cv.is_published,
        cv.summary,
        cv.created_at,
        cv.updated_at,
        COALESCE(u.first_name || ' ' || u.last_name, u.first_name, 'Unknown User') as created_by_name
      FROM content_versions cv
      LEFT JOIN users u ON cv.created_by = u.id
      WHERE cv.module_id = ${moduleId} AND cv.content_type = ${contentType}
      ORDER BY cv.version_number DESC
    `;

    // Transform the results to match the expected interface
    const versions = versionsResult.map(row => ({
      id: row.id,
      version: row.version,
      content: row.content || '',
      createdAt: row.created_at,
      createdBy: row.created_by_name,
      creationMethod: row.creation_method,
      isCurrent: row.is_current,
      isPublished: row.is_published,
      changeSummary: row.change_summary
    }));

    return NextResponse.json({
      success: true,
      versions
    });

  } catch (error) {
    console.error('Error loading content versions:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load content versions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
