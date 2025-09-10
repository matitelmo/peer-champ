/**
 * Dashboard Page
 *
 * Main dashboard page that displays role-specific layouts
 * for sales reps, advocates, and admins.
 */

'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { withAuth } from '@/hooks/useAuth';
import { SalesRepDashboard } from '@/components/dashboard/SalesRepDashboard';

function DashboardPage() {
  // TODO: Determine user role from user context and render appropriate dashboard
  // For now, defaulting to sales rep dashboard
  const userRole = 'sales_rep'; // This should come from user context

  const renderDashboard = () => {
    switch (userRole) {
      case 'sales_rep':
        return <SalesRepDashboard />;
      case 'advocate':
        // TODO: Implement advocate dashboard
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Advocate Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Advocate dashboard coming soon...
            </p>
          </div>
        );
      case 'admin':
        // TODO: Implement admin dashboard
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Admin dashboard coming soon...
            </p>
          </div>
        );
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
