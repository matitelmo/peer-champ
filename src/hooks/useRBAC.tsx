/**
 * Role-Based Access Control Hook
 * 
 * Provides role-based permissions and access control throughout the application.
 * Manages user roles, permissions, and provides utility functions for checking access.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

// Types
export type UserRole = 'admin' | 'sales_rep' | 'advocate';

export interface Permission {
  action: string;
  resource: string;
}

export interface RolePermissions {
  [role: string]: Permission[];
}

export interface RBACContextType {
  userRole: UserRole | null;
  loading: boolean;
  hasPermission: (action: string, resource: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccess: (resource: string, action?: string) => boolean;
}

// Default permissions for each role
const defaultPermissions: RolePermissions = {
  admin: [
    { action: '*', resource: '*' }, // Admin has access to everything
  ],
  sales_rep: [
    { action: 'read', resource: 'advocates' },
    { action: 'read', resource: 'opportunities' },
    { action: 'create', resource: 'opportunities' },
    { action: 'update', resource: 'opportunities' },
    { action: 'delete', resource: 'opportunities' },
    { action: 'create', resource: 'reference_calls' },
    { action: 'read', resource: 'reference_calls' },
    { action: 'update', resource: 'reference_calls' },
    { action: 'read', resource: 'companies' },
    { action: 'update', resource: 'companies' },
    { action: 'read', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'read', resource: 'profile' },
    { action: 'update', resource: 'profile' },
  ],
  advocate: [
    { action: 'read', resource: 'profile' },
    { action: 'update', resource: 'profile' },
    { action: 'read', resource: 'reference_calls' },
    { action: 'update', resource: 'reference_calls' },
    { action: 'read', resource: 'availability' },
    { action: 'update', resource: 'availability' },
    { action: 'read', resource: 'rewards' },
  ],
};

// Create the context
const RBACContext = createContext<RBACContextType | undefined>(undefined);

// RBAC Provider Component
interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // Get user role from the users table
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        } else {
          setUserRole(data?.role as UserRole || null);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = (action: string, resource: string): boolean => {
    if (!userRole) return false;

    const permissions = defaultPermissions[userRole] || [];

    return permissions.some(permission => 
      (permission.action === '*' || permission.action === action) &&
      (permission.resource === '*' || permission.resource === resource)
    );
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return userRole ? roles.includes(userRole) : false;
  };

  // Check if user can access a resource (with optional action)
  const canAccess = (resource: string, action: string = 'read'): boolean => {
    return hasPermission(action, resource);
  };

  const value: RBACContextType = {
    userRole,
    loading,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccess,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

// Custom hook to use RBAC context
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

// Permission Gate Component
interface PermissionGateProps {
  action: string;
  resource: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  action,
  resource,
  children,
  fallback = null,
  loading = null,
}) => {
  const { hasPermission, loading: rbacLoading } = useRBAC();

  if (rbacLoading) {
    return <>{loading}</>;
  }

  return hasPermission(action, resource) ? <>{children}</> : <>{fallback}</>;
};

// Role Gate Component
interface RoleGateProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  roles,
  children,
  fallback = null,
  loading = null,
}) => {
  const { hasAnyRole, loading: rbacLoading } = useRBAC();

  if (rbacLoading) {
    return <>{loading}</>;
  }

  return hasAnyRole(roles) ? <>{children}</> : <>{fallback}</>;
};

// Higher-order component for role-based protection
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  const RoleProtectedComponent = (props: P) => {
    const { hasAnyRole, loading } = useRBAC();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!hasAnyRole(allowedRoles)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  RoleProtectedComponent.displayName = `withRole(${Component.displayName || Component.name})`;
  return RoleProtectedComponent;
};

export default RBACProvider;
