/**
 * Sign Up Page
 * 
 * Registration page for new users to create accounts.
 * Includes form validation, error handling, and email verification flow.
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Spinner } from '@/components/ui/Spinner';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <AuthLayout
      variant="centered"
      size="md"
      title="Join PeerChamps"
      subtitle="Create your account to start connecting with advocates"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
