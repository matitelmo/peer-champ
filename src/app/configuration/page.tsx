/**
 * Configuration Page
 * 
 * Hosts the Account Configuration Wizard for new users
 * to complete their account setup.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { AccountConfigurationWizard } from '@/components/configuration/AccountConfigurationWizard';
import { Spinner } from '@/components/ui/Spinner';

export default function ConfigurationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (!loading && user) {
      setShowWizard(true);
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleWizardComplete = () => {
    // Redirect to dashboard after completion
    router.push('/dashboard');
  };

  const handleWizardCancel = () => {
    // Redirect to dashboard if cancelled
    router.push('/dashboard');
  };

  return (
    <DashboardLayoutWithNav
      title="Account Configuration"
      subtitle="Complete your account setup to get started"
    >
      {showWizard && (
        <AccountConfigurationWizard
          onComplete={handleWizardComplete}
          onCancel={handleWizardCancel}
        />
      )}
    </DashboardLayoutWithNav>
  );
}
