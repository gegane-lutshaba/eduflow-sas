import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import UnifiedDatabaseService from '../../../../../../lib/unified-database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    // Get course with modules from database
    const courseData = await UnifiedDatabaseService.getCourseWithModules(courseId);

    if (!courseData) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify the course belongs to the authenticated teacher
    if (courseData.course.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    console.log(`Retrieved course ${courseId} with ${courseData.modules.length} modules`);

    return NextResponse.json({
      success: true,
      course: courseData.course,
      modules: courseData.modules
    });

  } catch (error) {
    console.error('Error retrieving course:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
