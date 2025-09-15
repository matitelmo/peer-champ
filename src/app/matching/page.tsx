/**
 * Matching Page
 *
 * Main page for advocate-opportunity matching functionality.
 * Provides access to the matching interface and results.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { withAuth } from '@/hooks/useAuth';
import { MatchingInterface } from '@/components/matching/MatchingInterface';

function MatchingPage() {
  return (
    <DashboardLayoutWithNav
      title="Advocate Matching"
      subtitle="Find the best advocates for your opportunities using AI-powered matching"
    >
      <MatchingInterface />
    </DashboardLayoutWithNav>
  );
}

export default withAuth(MatchingPage);
