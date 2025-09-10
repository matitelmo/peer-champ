/**
 * Email Verification Page
 *
 * Page shown to users who need to verify their email address.
 * Provides instructions and resend functionality.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Redirect if user is not authenticated or email is already verified
  useEffect(() => {
    if (!loading && user) {
      if (user.email_confirmed_at) {
        router.push('/dashboard');
      }
    } else if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!user?.email) return;

    try {
      setResending(true);
      setResendError(null);
      setResendSuccess(false);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        setResendError(error.message);
      } else {
        setResendSuccess(true);
      }
    } catch (error) {
      setResendError('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render if user is not authenticated or email is verified
  if (!user || user.email_confirmed_at) {
    return null;
  }

  return (
    <AuthLayout
      variant="centered"
      size="md"
      title="Verify Your Email"
      subtitle="We've sent a verification link to your email address"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
            <svg
              className="h-6 w-6 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Check your email
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've sent a verification link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {user.email}
            </span>
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the link in the email to verify your account. The link will
            expire in 24 hours.
          </p>
        </div>

        {/* Resend Success */}
        {resendSuccess && (
          <Alert variant="success">
            Verification email sent successfully! Please check your inbox.
          </Alert>
        )}

        {/* Resend Error */}
        {resendError && <Alert variant="error">{resendError}</Alert>}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleResendVerification}
            disabled={resending}
            variant="outline"
            fullWidth
          >
            {resending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the email?{' '}
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Resend
              </button>
            </p>
          </div>
        </div>

        {/* Back to Sign In */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Wrong email address?{' '}
            <a
              href="/auth/signin"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign in with a different account
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
