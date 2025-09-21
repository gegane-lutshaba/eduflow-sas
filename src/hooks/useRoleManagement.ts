'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { roleService, type UserRole, type RoleData } from '../lib/role-service';

interface UseRoleManagementReturn {
  // Role data
  currentRole: UserRole | null;
  availableRoles: UserRole[];
  roleData: RoleData | null;
  
  // Loading states
  isLoading: boolean;
  isChangingRole: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  switchRole: (role: UserRole) => Promise<void>;
  addRole: (role: UserRole, preferences?: any) => Promise<void>;
  removeRole: (role: UserRole) => Promise<void>;
  refreshRoles: () => Promise<void>;
  
  // Utilities
  hasRole: (role: UserRole) => boolean;
  canAccessRoute: (route: string) => boolean;
  getRoleDashboardUrl: (role?: UserRole) => string;
}

export function useRoleManagement(): UseRoleManagementReturn {
  const { user, isLoaded } = useUser();
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user roles
  const fetchRoles = useCallback(async () => {
    if (!user?.id || !isLoaded) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await roleService.getUserRoles();
      
      if (response.success && response.data) {
        setRoleData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch roles');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoaded]);

  // Initialize roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Switch role function
  const switchRole = useCallback(async (role: UserRole) => {
    if (!roleData || role === roleData.currentRole) return;

    try {
      setIsChangingRole(true);
      setError(null);

      await roleService.switchRoleWithRefresh(role);
      
      // The page will refresh, so we don't need to update state here
    } catch (err) {
      console.error('Error switching role:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch role');
      setIsChangingRole(false);
    }
  }, [roleData]);

  // Add role function
  const addRole = useCallback(async (role: UserRole, preferences?: any) => {
    try {
      setError(null);
      
      const response = await roleService.addRole(role, preferences);
      
      if (response.success) {
        await fetchRoles(); // Refresh role data
      } else {
        throw new Error(response.error || 'Failed to add role');
      }
    } catch (err) {
      console.error('Error adding role:', err);
      setError(err instanceof Error ? err.message : 'Failed to add role');
    }
  }, [fetchRoles]);

  // Remove role function
  const removeRole = useCallback(async (role: UserRole) => {
    try {
      setError(null);
      
      const response = await roleService.removeRole(role);
      
      if (response.success) {
        await fetchRoles(); // Refresh role data
      } else {
        throw new Error(response.error || 'Failed to remove role');
      }
    } catch (err) {
      console.error('Error removing role:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove role');
    }
  }, [fetchRoles]);

  // Refresh roles function
  const refreshRoles = useCallback(async () => {
    await fetchRoles();
  }, [fetchRoles]);

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    return roleData?.availableRoles.includes(role) || false;
  }, [roleData]);

  // Check if user can access specific route
  const canAccessRoute = useCallback((route: string): boolean => {
    if (!roleData) return false;

    if (route.startsWith('/teacher')) {
      return hasRole('teacher');
    }
    if (route.startsWith('/researcher')) {
      return hasRole('researcher');
    }
    
    // Dashboard and other routes are accessible to all authenticated users
    return true;
  }, [roleData, hasRole]);

  // Get dashboard URL for role
  const getRoleDashboardUrl = useCallback((role?: UserRole): string => {
    const targetRole = role || roleData?.currentRole;
    return roleService.getRoleDashboardUrl(targetRole || 'student');
  }, [roleData]);

  return {
    // Role data
    currentRole: roleData?.currentRole || null,
    availableRoles: roleData?.availableRoles || [],
    roleData,
    
    // Loading states
    isLoading,
    isChangingRole,
    
    // Error handling
    error,
    
    // Actions
    switchRole,
    addRole,
    removeRole,
    refreshRoles,
    
    // Utilities
    hasRole,
    canAccessRoute,
    getRoleDashboardUrl
  };
}

export default useRoleManagement;
