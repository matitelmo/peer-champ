/**
 * Dashboard Page
 *
 * Main dashboard page that displays role-specific layouts
 * for sales reps, advocates, and admins.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { withAuth } from '@/hooks/useAuth';
import { SalesRepDashboard } from '@/components/dashboard/SalesRepDashboard';

type UserRole = 'sales_rep';
function DashboardPage() {
  // TODO: Determine user role from user context and render appropriate dashboard
  // For now, defaulting to sales rep dashboard
  const userRole: UserRole = 'sales_rep'; // This should come from user context

  const renderDashboard = () => {
    switch (userRole) {
      case 'sales_rep':
        return <SalesRepDashboard />;
      default:
        return <SalesRepDashboard />;
    }
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome to your PeerChamps dashboard"
    >
      {renderDashboard()}
    </DashboardLayout>
  );
}

export default withAuth(DashboardPage);
