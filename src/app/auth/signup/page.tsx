/**
 * Sign Up Page - Enhanced Version
 *
 * Registration page for new users to create accounts.
 * Uses the enhanced form that handles existing users better.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayoutSimple } from '@/components/layouts/AuthLayoutSimple';
import { EnhancedSignUpForm } from '@/components/auth/EnhancedSignUpForm';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if user is already authenticated and has completed onboarding
  useEffect(() => {
    if (!loading && user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      if (hasCompletedOnboarding) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
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

  const handleSignupSuccess = () => {
    setShowSuccess(true);
    // Redirect after showing success message
    setTimeout(() => {
      router.push('/auth/verify-email');
    }, 3000);
  };

  return (
    <AuthLayoutSimple
      title="Join PeerChamps"
      subtitle="Create your account to start connecting with advocates"
    >
      {showSuccess ? (
        <div className="w-full max-w-md mx-auto">
          <Alert variant="success" className="text-center">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                🎉 Account Created Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Redirecting to verification page in a moment...
              </p>
            </div>
          </Alert>
        </div>
      ) : (
        <EnhancedSignUpForm 
          onSuccess={handleSignupSuccess}
          redirectTo="/auth/verify-email"
        />
      )}
    </AuthLayoutSimple>
  );
}
