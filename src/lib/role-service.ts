'use client';

export type UserRole = 'student' | 'teacher' | 'researcher';

export interface RoleData {
  currentRole: UserRole;
  availableRoles: UserRole[];
  rolePreferences: {
    [role: string]: {
      lastAccessed: Date;
      preferences: any;
    }
  };
}

export interface RoleServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class RoleService {
  private baseUrl = '/api/v1/auth/roles';

  /**
   * Get current user's role information
   */
  async getUserRoles(): Promise<RoleServiceResponse<RoleData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user roles');
      }

      return result;
    } catch (error) {
      console.error('Get user roles error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Switch to a different role
   */
  async switchRole(role: UserRole): Promise<RoleServiceResponse<RoleData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'switch_role',
          role
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to switch role');
      }

      // Store current role in session storage for immediate access
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('currentRole', role);
      }

      return result;
    } catch (error) {
      console.error('Switch role error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add a new role to user's available roles
   */
  async addRole(role: UserRole, preferences?: any): Promise<RoleServiceResponse<RoleData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_role',
          role,
          preferences
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add role');
      }

      return result;
    } catch (error) {
      console.error('Add role error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Remove a role from user's available roles
   */
  async removeRole(role: UserRole): Promise<RoleServiceResponse<RoleData>> {
    try {
      if (role === 'student') {
        throw new Error('Cannot remove student role');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove_role',
          role
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove role');
      }

      return result;
    } catch (error) {
      console.error('Remove role error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update preferences for a specific role
   */
  async updateRolePreferences(role: UserRole, preferences: any): Promise<RoleServiceResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_preferences',
          role,
          preferences
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update preferences');
      }

      return result;
    } catch (error) {
      console.error('Update preferences error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get current role from session storage (for immediate access)
   */
  getCurrentRoleFromSession(): UserRole | null {
    if (typeof window === 'undefined') return null;
    
    const role = sessionStorage.getItem('currentRole');
    return role as UserRole || null;
  }

  /**
   * Clear role session data
   */
  clearRoleSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentRole');
    }
  }

  /**
   * Get role-specific dashboard URL
   */
  getRoleDashboardUrl(role: UserRole): string {
    switch (role) {
      case 'student':
        return '/dashboard';
      case 'teacher':
        return '/teacher';
      case 'researcher':
        return '/researcher'; // Future implementation
      default:
        return '/dashboard';
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: UserRole): Promise<boolean> {
    try {
      const response = await this.getUserRoles();
      if (!response.success || !response.data) return false;
      
      return response.data.availableRoles.includes(role);
    } catch (error) {
      console.error('Check role error:', error);
      return false;
    }
  }

  /**
   * Get role display information
   */
  getRoleInfo(role: UserRole) {
    const roleConfig = {
      student: {
        title: 'Student',
        description: 'Learn with AI-powered personalized education',
        color: 'blue',
        icon: '🎓'
      },
      teacher: {
        title: 'Teacher',
        description: 'Create courses with AI-powered content generation',
        color: 'purple',
        icon: '📚'
      },
      researcher: {
        title: 'Researcher',
        description: 'Access educational data and analytics',
        color: 'green',
        icon: '📊'
      }
    };

    return roleConfig[role];
  }

  /**
   * Handle role switch with app refresh
   */
  async switchRoleWithRefresh(role: UserRole): Promise<void> {
    try {
      const response = await this.switchRole(role);
      
      if (response.success) {
        // Get the appropriate dashboard URL
        const dashboardUrl = this.getRoleDashboardUrl(role);
        
        // Refresh the app by navigating to the new dashboard
        if (typeof window !== 'undefined') {
          window.location.href = dashboardUrl;
        }
      } else {
        throw new Error(response.error || 'Failed to switch role');
      }
    } catch (error) {
      console.error('Role switch with refresh error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const roleService = new RoleService();
export default roleService;
