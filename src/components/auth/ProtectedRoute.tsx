/**
 * Protected Route Component
 *
 * Wraps routes that require authentication. Redirects unauthenticated users
 * to the sign-in page and shows loading states during auth checks.
 */

'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/auth/signin',
  requireEmailVerification = false,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to sign-in
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.push(redirectUrl);
      } else if (requireEmailVerification && !user.email_confirmed_at) {
        // User is authenticated but email is not verified
        router.push('/auth/verify-email');
      }
    }
  }, [user, loading, router, pathname, redirectTo, requireEmailVerification]);

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // Show nothing while redirecting to email verification
  if (requireEmailVerification && !user.email_confirmed_at) {
    return null;
  }

  // User is authenticated and verified, show protected content
  return <>{children}</>;
};

// Higher-order component for protecting pages
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  const ProtectedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;
  return ProtectedComponent;
};

// Role-based protection
interface RoleProtectedRouteProps extends ProtectedRouteProps {
  allowedRoles?: string[];
  userRole?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  userRole,
  fallback,
  ...props
}) => {
  const { user, loading } = useAuth();

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!allowedRoles.length) return true;
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };

  if (!loading && user && !hasRequiredRole()) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    );
  }

  return <ProtectedRoute {...props}>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
