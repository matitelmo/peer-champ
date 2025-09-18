/**
 * Sign In Page - Enhanced Version
 *
 * Authentication page for user sign-in with email and password.
 * Supports pre-filled email from query parameters.
 */

'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayoutSimple } from '@/components/layouts/AuthLayoutSimple';
import { EnhancedSignInForm } from '@/components/auth/EnhancedSignInForm';
import { Spinner } from '@/components/ui/Spinner';

function SignInContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const email = searchParams.get('email');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      if (hasCompletedOnboarding) {
        router.push(redirectTo);
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <AuthLayoutSimple
      title="Welcome Back"
      subtitle="Sign in to your PeerChamps account"
    >
      <EnhancedSignInForm 
        redirectTo={redirectTo} 
        prefillEmail={email || undefined}
      />
    </AuthLayoutSimple>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
