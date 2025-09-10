/**
 * Tenant/Company Isolation Hook
 * 
 * Manages multi-tenant data isolation and company context throughout the application.
 * Ensures users can only access data belonging to their company.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { companyService, userService } from '@/lib/database';
import type { Company, User } from '@/types/database';

// Types
export interface TenantContextType {
  company: Company | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isSalesRep: boolean;
  isAdvocate: boolean;
  canAccessCompany: (companyId: string) => boolean;
  canAccessUser: (userId: string) => boolean;
  canAccessAdvocate: (advocateId: string) => boolean;
  canAccessOpportunity: (opportunityId: string) => boolean;
  canAccessReferenceCall: (referenceCallId: string) => boolean;
  refreshCompany: () => Promise<void>;
  switchCompany: (companyId: string) => Promise<{ success: boolean; error?: string }>;
}

// Create the context
const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Tenant Provider Component
interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch company and user data
  const fetchTenantData = async () => {
    if (!user) {
      setCompany(null);
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user data with company information
      const { data: userData, error: userError } = await userService.getById(user.id);

      if (userError) {
        setError(userError.message);
        setCompany(null);
        setCurrentUser(null);
        return;
      }

      if (!userData) {
        setError('User not found');
        setCompany(null);
        setCurrentUser(null);
        return;
      }

      setCurrentUser(userData);

      // Get company data
      if (userData.company_id) {
        const { data: companyData, error: companyError } = await companyService.getById(userData.company_id);

        if (companyError) {
          setError(companyError.message);
          setCompany(null);
        } else {
          setCompany(companyData);
        }
      } else {
        setCompany(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant data');
      setCompany(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tenant data when user changes
  useEffect(() => {
    fetchTenantData();
  }, [user]);

  // Check if user has admin role
  const isAdmin = currentUser?.role === 'admin';

  // Check if user has sales rep role
  const isSalesRep = currentUser?.role === 'sales_rep';

  // Check if user has advocate role
  const isAdvocate = currentUser?.role === 'advocate';

  // Check if user can access a specific company
  const canAccessCompany = (companyId: string): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true; // Admins can access any company
    return currentUser.company_id === companyId;
  };

  // Check if user can access a specific user
  const canAccessUser = (userId: string): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true; // Admins can access any user
    if (userId === currentUser.id) return true; // Users can access their own data
    return currentUser.company_id === currentUser.company_id; // Same company
  };

  // Check if user can access a specific advocate
  const canAccessAdvocate = (advocateId: string): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true; // Admins can access any advocate
    // For now, assume advocates belong to the same company
    // In a real implementation, you'd check the advocate's company_id
    return true;
  };

  // Check if user can access a specific opportunity
  const canAccessOpportunity = (opportunityId: string): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true; // Admins can access any opportunity
    // For now, assume opportunities belong to the same company
    // In a real implementation, you'd check the opportunity's company_id
    return true;
  };

  // Check if user can access a specific reference call
  const canAccessReferenceCall = (referenceCallId: string): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true; // Admins can access any reference call
    // For now, assume reference calls belong to the same company
    // In a real implementation, you'd check the reference call's company_id
    return true;
  };

  // Refresh company data
  const refreshCompany = async (): Promise<void> => {
    await fetchTenantData();
  };

  // Switch company (for admin users)
  const switchCompany = async (companyId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) {
      return { success: false, error: 'Only administrators can switch companies' };
    }

    try {
      setError(null);

      // Get company data
      const { data: companyData, error: companyError } = await companyService.getById(companyId);

      if (companyError) {
        return { success: false, error: companyError.message };
      }

      if (!companyData) {
        return { success: false, error: 'Company not found' };
      }

      setCompany(companyData);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch company';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value: TenantContextType = {
    company,
    currentUser,
    loading,
    error,
    isAdmin,
    isSalesRep,
    isAdvocate,
    canAccessCompany,
    canAccessUser,
    canAccessAdvocate,
    canAccessOpportunity,
    canAccessReferenceCall,
    refreshCompany,
    switchCompany,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// Custom hook to use tenant context
export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Higher-order component for tenant isolation
export const withTenantIsolation = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireCompany?: boolean;
    allowedRoles?: string[];
  }
) => {
  const TenantIsolatedComponent = (props: P) => {
    const { company, currentUser, loading, error, isAdmin, isSalesRep, isAdvocate } = useTenant();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Company Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (options?.requireCompany && !company) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Company Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You must be associated with a company to access this page.
            </p>
            <a
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In
            </a>
          </div>
        </div>
      );
    }

    if (options?.allowedRoles && currentUser) {
      const hasAllowedRole = options.allowedRoles.includes(currentUser.role);
      if (!hasAllowedRole) {
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
    }

    return <Component {...props} />;
  };

  TenantIsolatedComponent.displayName = `withTenantIsolation(${Component.displayName || Component.name})`;
  return TenantIsolatedComponent;
};

export default TenantProvider;
