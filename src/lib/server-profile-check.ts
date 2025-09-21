import { UnifiedDatabaseService } from './unified-database-service';

export async function checkUserProfileStatus(userId: string) {
  try {
    const user = await UnifiedDatabaseService.getUser(userId);
    
    if (!user) {
      return { hasCompleteProfile: false, currentRole: null };
    }

    // Check if user has a current role and profile is marked complete
    if (user.currentRole && user.isProfileComplete) {
      // Verify role-specific profile exists
      let roleProfileExists = false;
      
      if (user.currentRole === 'student') {
        const studentProfile = await UnifiedDatabaseService.getStudentProfile(userId);
        roleProfileExists = !!studentProfile;
      } else if (user.currentRole === 'teacher') {
        const teacherProfile = await UnifiedDatabaseService.getTeacherProfile(userId);
        roleProfileExists = !!teacherProfile;
      } else if (user.currentRole === 'researcher') {
        // Add researcher profile check when implemented
        roleProfileExists = true; // For now, assume researcher profiles are complete
      }

      if (roleProfileExists) {
        return {
          hasCompleteProfile: true,
          currentRole: user.currentRole,
        };
      }
    }

    return { hasCompleteProfile: false, currentRole: user.currentRole || null };
  } catch (error) {
    console.error('Error checking user profile status:', error);
    return { hasCompleteProfile: false, currentRole: null };
  }
}
