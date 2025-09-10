/**
 * Main Layout Component
 * 
 * The primary layout component that integrates authentication, tenant isolation,
 * and role-based access control. Provides the main structure for the application.
 */

'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { RBACProvider } from '@/hooks/useRBAC';
import { ProfileProvider } from '@/hooks/useProfile';
import { TenantProvider } from '@/hooks/useTenant';
import { Navigation } from '@/components/Navigation';
import { CompanySwitcher } from '@/components/tenant/CompanySwitcher';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showCompanySwitcher?: boolean;
  className?: string;
}

// Inner component that uses the hooks
const MainLayoutContent: React.FC<MainLayoutProps> = ({
  children,
  showNavigation = true,
  showCompanySwitcher = true,
  className = '',
}) => {
  const { user, loading: authLoading } = useAuth();
  const { company, loading: tenantLoading } = useTenant();
  const { userRole, loading: rbacLoading } = useRBAC();

  // Show loading state while authentication and tenant data is loading
  if (authLoading || tenantLoading || rbacLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please sign in to access the application.
            </p>
            <a
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                PeerChamps
              </h1>
              {company && (
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                  {company.name}
                </span>
              )}
            </div>

            {/* Company Switcher (Admin only) */}
            {showCompanySwitcher && (
              <div className="flex items-center space-x-4">
                <CompanySwitcher showLabel={false} size="sm" />
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.user_metadata?.first_name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole && userRole.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {(user.user_metadata?.first_name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        {showNavigation && (
          <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
            <Navigation />
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showNavigation ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Main Layout Component with Providers
export const MainLayout: React.FC<MainLayoutProps> = (props) => {
  return (
    <AuthProvider>
      <RBACProvider>
        <ProfileProvider>
          <TenantProvider>
            <MainLayoutContent {...props} />
          </TenantProvider>
        </ProfileProvider>
      </RBACProvider>
    </AuthProvider>
  );
};

export default MainLayout;
