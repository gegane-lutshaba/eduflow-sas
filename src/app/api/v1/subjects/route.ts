import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import NeonDatabaseService from '../../../../lib/neon-service';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjects = await NeonDatabaseService.getSubjects();
    const educationLevels = await NeonDatabaseService.getEducationLevels();

    return NextResponse.json({
      subjects,
      educationLevels,
    });
  } catch (error) {
    console.error('Error getting subjects:', error);
    return NextResponse.json(
      { error: 'Failed to get subjects' },
      { status: 500 }
    );
  }
}
