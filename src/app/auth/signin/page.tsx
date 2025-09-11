/**
 * Sign In Page
 *
 * Authentication page for user sign-in with email and password.
 * Includes form validation, error handling, and redirect functionality.
 */

'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';
import { Spinner } from '@/components/ui/Spinner';

function SignInContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
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
    <AuthLayout
      variant="default"
      size="4xl"
      title="Welcome Back"
      subtitle="Sign in to your PeerChamps account"
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
