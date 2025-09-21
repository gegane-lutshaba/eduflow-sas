import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import UnifiedDatabaseService from '../../../../../lib/unified-database-service';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get teacher courses from database
    const courses = await UnifiedDatabaseService.getTeacherCourses(userId);

    console.log(`Retrieved ${courses.length} courses for teacher ${userId}`);

    return NextResponse.json({
      success: true,
      courses: courses,
      total: courses.length
    });

  } catch (error) {
    console.error('Error retrieving teacher courses:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve courses', details: error.message },
      { status: 500 }
    );
  }
}
