/**
 * Auth Callback Page
 *
 * Handles OAuth callbacks and email verification redirects from Supabase.
 * This page processes the authentication tokens and redirects users appropriately.
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { AuthLayoutSimple } from '@/components/layouts/AuthLayoutSimple';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParamsObj = new URLSearchParams(window.location.search);
        
        // Check for error in URL
        const error = hashParams.get('error') || searchParamsObj.get('error');
        const errorDescription = hashParams.get('error_description') || searchParamsObj.get('error_description');
        
        if (error) {
          setError(errorDescription || error);
          setLoading(false);
          return;
        }

        // Handle the auth callback
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error('Auth callback error:', authError);
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // Check if this is an email verification
          const user = data.session.user;
          
          if (user.email_confirmed_at) {
            // Email is verified, redirect to dashboard
            router.push('/dashboard');
          } else {
            // Email not verified, redirect to verification page
            router.push('/auth/verify-email');
          }
        } else {
          // No session, redirect to sign in
          router.push('/auth/signin');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <AuthLayoutSimple
        title="Verifying..."
        subtitle="Please wait while we verify your account"
      >
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Processing your verification...
          </p>
        </div>
      </AuthLayoutSimple>
    );
  }

  if (error) {
    return (
      <AuthLayoutSimple
        title="Verification Failed"
        subtitle="There was an issue verifying your account"
      >
        <div className="space-y-6">
          <Alert variant="error">
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Verification Error
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </Alert>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Sign In
            </button>
            
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Try Signing Up Again
            </button>
          </div>
        </div>
      </AuthLayoutSimple>
    );
  }

  return null;
}


export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
