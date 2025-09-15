/**
 * Opportunities Page
 *
 * Main page for managing sales opportunities and reference requests.
 * Provides access to opportunity creation, listing, and management.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { withAuth } from '@/hooks/useAuth';
import { OpportunityList } from '@/components/opportunity/OpportunityList';

function OpportunitiesPage() {
  return (
    <DashboardLayoutWithNav
      title="Opportunities"
      subtitle="Manage your sales opportunities and reference requests"
    >
      <OpportunityList />
    </DashboardLayoutWithNav>
  );
}

export default withAuth(OpportunitiesPage);
