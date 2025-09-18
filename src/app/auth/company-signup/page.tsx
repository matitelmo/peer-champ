/**
 * Company Signup Page
 *
 * Multi-step company signup flow that collects company information,
 * sets up admin accounts, handles subscription selection, and properly
 * initializes the company before redirecting to the detailed onboarding flow.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayoutSimple } from '@/components/layouts/AuthLayoutSimple';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function CompanySignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const handleSignupSuccess = (companyId: string) => {
    setShowSuccess(true);
    // Redirect to onboarding after showing success message
    setTimeout(() => {
      router.push(`/onboarding?company=${companyId}`);
    }, 3000);
  };

  return (
    <AuthLayoutSimple
      title="Get Started with PeerChamps"
      subtitle="Set up your company account and start connecting with advocates"
    >
      {showSuccess ? (
        <div className="w-full max-w-md mx-auto">
          <Alert variant="success" className="text-center">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                🎉 Company Account Created Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Your company account has been set up. We're now redirecting you to the onboarding process to complete your setup.
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Redirecting to onboarding in a moment...
              </p>
            </div>
          </Alert>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <Alert variant="info" className="text-center">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Company Signup Coming Soon
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                The company signup flow is currently under development. Please use the regular signup process for now.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/auth/signup')}
                className="w-full"
              >
                Go to Signup
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </AuthLayoutSimple>
  );
}
