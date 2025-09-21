import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface UserRole {
  clerkId: string;
  availableRoles: ('student' | 'teacher' | 'researcher')[];
  currentRole: 'student' | 'teacher' | 'researcher';
  rolePreferences: {
    [role: string]: {
      lastAccessed: Date;
      preferences: any;
    }
  };
}

// Mock database - in production, this would be your actual database
const mockUserRoles: { [clerkId: string]: UserRole } = {};

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if this is a query from middleware (with userId parameter)
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    const targetUserId = queryUserId || userId;

    // Get user roles from database (mock implementation)
    const userRole = mockUserRoles[targetUserId];
    
    // If user doesn't exist, return 404 (indicates first-time user)
    if (!userRole) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      currentRole: userRole.currentRole,
      roles: userRole.availableRoles,
      rolePreferences: userRole.rolePreferences
    });

  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, role, preferences, isDefault } = body;

    // Handle first-time user role creation (from welcome page)
    if (!action && role && isDefault) {
      // Create new user with selected role
      const userRole: UserRole = {
        clerkId: userId,
        availableRoles: [role],
        currentRole: role,
        rolePreferences: {
          [role]: {
            lastAccessed: new Date(),
            preferences: preferences || {}
          }
        }
      };

      mockUserRoles[userId] = userRole;

      return NextResponse.json({
        success: true,
        message: 'User role created successfully',
        data: {
          currentRole: userRole.currentRole,
          availableRoles: userRole.availableRoles
        }
      });
    }

    // Get or create user role for existing users
    let userRole = mockUserRoles[userId];
    if (!userRole) {
      userRole = {
        clerkId: userId,
        availableRoles: ['student'],
        currentRole: 'student',
        rolePreferences: {
          student: {
            lastAccessed: new Date(),
            preferences: {}
          }
        }
      };
      mockUserRoles[userId] = userRole;
    }

    switch (action) {
      case 'switch_role':
        if (!role || !userRole.availableRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Invalid role or role not available' },
            { status: 400 }
          );
        }

        // Update current role and last accessed time
        userRole.currentRole = role;
        userRole.rolePreferences[role] = {
          ...userRole.rolePreferences[role],
          lastAccessed: new Date()
        };

        mockUserRoles[userId] = userRole;

        return NextResponse.json({
          success: true,
          message: 'Role switched successfully',
          data: {
            currentRole: userRole.currentRole,
            availableRoles: userRole.availableRoles
          }
        });

      case 'add_role':
        if (!role || userRole.availableRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Invalid role or role already exists' },
            { status: 400 }
          );
        }

        // Add new role
        userRole.availableRoles.push(role);
        userRole.rolePreferences[role] = {
          lastAccessed: new Date(),
          preferences: preferences || {}
        };

        mockUserRoles[userId] = userRole;

        return NextResponse.json({
          success: true,
          message: 'Role added successfully',
          data: {
            currentRole: userRole.currentRole,
            availableRoles: userRole.availableRoles
          }
        });

      case 'remove_role':
        if (!role || role === 'student' || !userRole.availableRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Cannot remove student role or role not found' },
            { status: 400 }
          );
        }

        // Remove role
        userRole.availableRoles = userRole.availableRoles.filter(r => r !== role);
        delete userRole.rolePreferences[role];

        // If current role was removed, switch to student
        if (userRole.currentRole === role) {
          userRole.currentRole = 'student';
        }

        mockUserRoles[userId] = userRole;

        return NextResponse.json({
          success: true,
          message: 'Role removed successfully',
          data: {
            currentRole: userRole.currentRole,
            availableRoles: userRole.availableRoles
          }
        });

      case 'update_preferences':
        if (!role || !userRole.availableRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
          );
        }

        // Update role preferences
        userRole.rolePreferences[role] = {
          ...userRole.rolePreferences[role],
          preferences: { ...userRole.rolePreferences[role]?.preferences, ...preferences }
        };

        mockUserRoles[userId] = userRole;

        return NextResponse.json({
          success: true,
          message: 'Preferences updated successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Role management error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentRole, availableRoles, rolePreferences } = body;

    // Validate input
    if (!currentRole || !availableRoles || !Array.isArray(availableRoles)) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Ensure student role is always available
    if (!availableRoles.includes('student')) {
      availableRoles.push('student');
    }

    // Ensure current role is in available roles
    if (!availableRoles.includes(currentRole)) {
      return NextResponse.json(
        { error: 'Current role must be in available roles' },
        { status: 400 }
      );
    }

    // Update user role data
    const userRole: UserRole = {
      clerkId: userId,
      availableRoles,
      currentRole,
      rolePreferences: rolePreferences || {}
    };

    mockUserRoles[userId] = userRole;

    return NextResponse.json({
      success: true,
      message: 'User roles updated successfully',
      data: {
        currentRole: userRole.currentRole,
        availableRoles: userRole.availableRoles,
        rolePreferences: userRole.rolePreferences
      }
    });

  } catch (error) {
    console.error('Update roles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
