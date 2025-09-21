import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UnifiedDatabaseService } from '../../../../../lib/unified-database-service';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comprehensiveProfile = await UnifiedDatabaseService.getUserComprehensiveProfile(userId);
    const completeness = await UnifiedDatabaseService.checkProfileCompleteness(userId);

    // Return the user data as the main profile for compatibility
    return NextResponse.json({
      profile: comprehensiveProfile.user,
      completeness,
      comprehensiveProfile, // Include full profile for detailed views
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      location,
      educationLevel,
      currentInstitution,
      fieldOfStudy,
      learningObjectives,
      timeAvailability,
      preferredStudyTime,
    } = body;

    // Ensure user exists in database first
    let user = await UnifiedDatabaseService.getUser(userId);
    if (!user) {
      // Create user if doesn't exist
      user = await UnifiedDatabaseService.createUser({
        id: userId,
        email: 'unknown@example.com', // This should come from Clerk
        firstName,
        lastName,
      });
    } else {
      // Update existing user
      await UnifiedDatabaseService.updateUser(userId, {
        firstName,
        lastName,
      });
    }

    // Check if student profile exists, create if not
    let profile = await UnifiedDatabaseService.getStudentProfile(userId);
    if (!profile) {
      // Create student profile if doesn't exist
      profile = await UnifiedDatabaseService.createStudentProfile(userId, {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        location,
        educationLevel,
        currentInstitution,
        fieldOfStudy,
        learningObjectives,
        timeAvailability,
        preferredStudyTime,
      });
    } else {
      // Update existing profile
      profile = await UnifiedDatabaseService.updateStudentProfile(userId, {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        location,
        educationLevel,
        currentInstitution,
        fieldOfStudy,
        learningObjectives,
        timeAvailability,
        preferredStudyTime,
      });
    }

    // Check completeness after update
    const completeness = await UnifiedDatabaseService.checkProfileCompleteness(userId);

    // Update user profile completeness status
    if (completeness.isComplete) {
      await UnifiedDatabaseService.updateUser(userId, {
        isProfileComplete: true,
        profileCompletionStatus: {
          basic_info: true,
          education: true,
          goals: true,
          preferences: true,
        },
      });

      // Award XP for completing profile
      await UnifiedDatabaseService.addXpTransaction(
        userId,
        100,
        'profile_completion',
        profile.id,
        'profile'
      );
    }

    return NextResponse.json({
      profile,
      completeness,
      message: completeness.isComplete ? 'Profile completed successfully!' : 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, profile: profileData } = body;

    // Get user info from Clerk
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Check if user exists, if not create them with proper Clerk data
    let user = await UnifiedDatabaseService.getUser(userId);
    
    if (!user) {
      // Create user with actual Clerk data
      user = await UnifiedDatabaseService.createUser({
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown@example.com',
        firstName: clerkUser.firstName || profileData.firstName || '',
        lastName: clerkUser.lastName || profileData.lastName || '',
        imageUrl: clerkUser.imageUrl,
        currentRole: role || 'student',
        availableRoles: [role || 'student'],
      });
    } else {
      // Update existing user with latest Clerk data
      await UnifiedDatabaseService.updateUser(userId, {
        email: clerkUser.emailAddresses[0]?.emailAddress || user.email,
        firstName: clerkUser.firstName || profileData.firstName || user.firstName,
        lastName: clerkUser.lastName || profileData.lastName || user.lastName,
        imageUrl: clerkUser.imageUrl || user.imageUrl,
      });
    }

    // Handle role-specific profile creation
    if (role === 'teacher') {
      // Add teacher role to user
      await UnifiedDatabaseService.addRoleToUser(userId, 'teacher');

      // Create teacher profile with proper field mapping
      const displayName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Teacher';
      await UnifiedDatabaseService.createTeacherProfile(userId, {
        displayName,
        phone: profileData.phone || '',
        location: profileData.location || '',
        bio: profileData.bio || '',
        qualifications: profileData.qualifications || [],
        teachingExperienceYears: profileData.teachingExperience || 0,
        currentInstitution: profileData.currentInstitution || '',
        subjects: profileData.subjects || [],
        educationLevels: profileData.educationLevels || [],
        targetRegions: profileData.targetRegions || [],
        preferredLanguages: profileData.preferredLanguages || ['English'],
        contentTypes: profileData.contentTypes || [],
        revenueGoals: profileData.revenueGoals || '',
        motivation: profileData.motivation || '',
      });

      // Switch to teacher role
      await UnifiedDatabaseService.switchUserRole(userId, 'teacher');

      // Mark profile as complete
      await UnifiedDatabaseService.updateUser(userId, {
        isProfileComplete: true,
        profileCompletionStatus: {
          basic_info: true,
          professional: true,
          preferences: true,
          goals: true,
        },
      });

      // Award XP for completing profile
      await UnifiedDatabaseService.addXpTransaction(
        userId,
        100,
        'profile_completion',
        userId,
        'profile'
      );

    } else if (role === 'student') {
      // Create student profile
      await UnifiedDatabaseService.createStudentProfile(userId, {
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
        location: profileData.location || '',
        phone: profileData.phone || '',
        educationLevel: profileData.educationLevel || '',
        currentInstitution: profileData.currentInstitution || '',
        fieldOfStudy: profileData.fieldOfStudy || '',
        careerGoals: profileData.careerGoals || '',
        learningObjectives: profileData.learningObjectives || [],
        timeAvailability: profileData.timeAvailability || 60,
        preferredStudyTime: profileData.preferredStudyTime || 'evening',
      });

      // Mark profile as complete
      await UnifiedDatabaseService.updateUser(userId, {
        isProfileComplete: true,
        profileCompletionStatus: {
          basic_info: true,
          education: true,
          goals: true,
          preferences: true,
        },
      });

      // Award XP for completing profile
      await UnifiedDatabaseService.addXpTransaction(
        userId,
        100,
        'profile_completion',
        userId,
        'profile'
      );
    }

    const updatedProfile = await UnifiedDatabaseService.getUserComprehensiveProfile(userId);
    const completeness = await UnifiedDatabaseService.checkProfileCompleteness(userId);

    return NextResponse.json({
      user,
      profile: updatedProfile,
      completeness,
      message: 'Profile created successfully',
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    );
  }
}
