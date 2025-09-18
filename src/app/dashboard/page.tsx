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
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedDashboard } from '@/components/dashboard/EnhancedDashboard';
import { SalesRepDashboard } from '@/components/dashboard/SalesRepDashboard';
import { Spinner } from '@/components/ui/Spinner';

type UserRole = 'sales_rep' | 'advocate' | 'admin';

function DashboardPage() {
  const { user, loading } = useAuth();

  // Show loading state while determining user role
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Determine user role from user metadata or default to sales_rep
  const userRole: UserRole = (user?.user_metadata?.role as UserRole) || 'sales_rep';

  const renderDashboard = () => {
    switch (userRole) {
      case 'sales_rep':
        return <EnhancedDashboard />;
      case 'advocate':
        // TODO: Implement AdvocateDashboard component
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Advocate Dashboard
            </h2>
            <p className="text-gray-600">
              Advocate dashboard coming soon...
            </p>
          </div>
        );
      case 'admin':
        // TODO: Implement AdminDashboard component
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h2>
            <p className="text-gray-600">
              Admin dashboard coming soon...
            </p>
          </div>
        );
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <DashboardLayoutWithNav
      title="Dashboard"
      subtitle={`Welcome to your PeerChamps dashboard, ${user?.email || 'User'}`}
    >
      {renderDashboard()}
    </DashboardLayoutWithNav>
  );
}

export default DashboardPage;
