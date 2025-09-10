/**
 * Opportunities Page
 *
 * Main page for managing sales opportunities and reference requests.
 * Provides access to opportunity creation, listing, and management.
 */

'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { withAuth } from '@/hooks/useAuth';
import { OpportunityList } from '@/components/opportunity/OpportunityList';

function OpportunitiesPage() {
  return (
    <AuthLayout
      title="Opportunities"
      subtitle="Manage your sales opportunities and reference requests"
    >
      <OpportunityList />
    </AuthLayout>
  );
}

export default withAuth(OpportunitiesPage);
