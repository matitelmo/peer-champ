/**
 * Enhanced Onboarding Page
 *
 * Comprehensive onboarding flow for new PeerChamps customers.
 * Provides step-by-step setup with progress tracking and data persistence.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

function OnboardingPage() {
  return (
    <DashboardLayoutWithNav
      title="Welcome to PeerChamps"
      subtitle="Let's get your customer reference platform set up"
    >
      <OnboardingFlow />
    </DashboardLayoutWithNav>
  );
}

export default OnboardingPage;
