/**
 * Enhanced Onboarding Page
 *
 * Comprehensive onboarding flow for new PeerChamps customers.
 * Checks user authentication status and redirects appropriately.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

function OnboardingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  const companyId = searchParams.get('company');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (loading) return;

      if (!user) {
        // User not authenticated, redirect to sign in
        router.push('/auth/signin?redirect=/onboarding');
        return;
      }

      // Check if user has already completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      if (hasCompletedOnboarding) {
        // User already completed onboarding, redirect to dashboard
        router.push('/dashboard');
        return;
      }

      // Check if user has a company associated
      if (user.user_metadata?.company_id) {
        // User already has a company, might have completed onboarding
        // Check with the server to be sure
        try {
          const response = await fetch('/api/onboarding/progress', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.completed) {
              localStorage.setItem('onboarding_completed', 'true');
              router.push('/dashboard');
              return;
            }
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }

      setIsChecking(false);
    };

    checkOnboardingStatus();
  }, [user, loading, router]);

  // Show loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking your onboarding status...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if redirecting
  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithNav
      title="Welcome to PeerChamps"
      subtitle="Let's get your customer reference platform set up"
    >
      <OnboardingFlow />
    </DashboardLayoutWithNav>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
