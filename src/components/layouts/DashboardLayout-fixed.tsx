/**
 * Dashboard Layout Component
 *
 * Full-width layout specifically designed for dashboard pages.
 * Provides proper spacing and structure without width constraints.
 * Includes user info and sign-out functionality.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Main content to display */
  children: React.ReactNode;
  /** Page title */
  title?: string;
  /** Page subtitle or description */
  subtitle?: string;
  /** Whether to add top padding */
  spacing?: boolean;
  /** Custom header content */
  header?: React.ReactNode;
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Back button click handler */
  onBack?: () => void;
  /** Back button label */
  backLabel?: string;
  /** Whether to show user info and sign out */
  showUserInfo?: boolean;
}

// Main DashboardLayout component
const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      className,
      children,
      title,
      subtitle,
      spacing = true,
      header,
      showBackButton = false,
      onBack,
      backLabel = 'Back',
      showUserInfo = true,
      ...props
    },
    ref
  ) => {
    const { user, signOut } = useAuth();

    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}
        {...props}
      >
        {/* Header with back button, custom header, and user info */}
        {(showBackButton || header || showUserInfo) && (
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  {showBackButton && onBack && (
                    <button
                      onClick={onBack}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
                    >
                      ← {backLabel}
                    </button>
                  )}
                </div>

                {header && (
                  <div className="flex-1 flex justify-center">{header}</div>
                )}

                {/* User Info and Sign Out */}
                {showUserInfo && user && (
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Main content area */}
        <main className={cn('w-full', spacing && 'py-8')}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            {(title || subtitle) && (
              <div className="mb-8">
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
