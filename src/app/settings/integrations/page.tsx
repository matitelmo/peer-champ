/**
 * Integrations Settings Page
 * 
 * Page for configuring third-party integrations and OAuth connections.
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { IntegrationConfiguration } from '@/components/integrations/IntegrationConfiguration';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

function IntegrationsPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfiguration, setShowConfiguration] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (!loading && user) {
      setShowConfiguration(true);
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

  const handleIntegrationComplete = (integration: any) => {
    console.log('Integration completed:', integration);
    // Show success message or redirect
    // Could also update the URL to show success state
  };

  return (
    <DashboardLayoutWithNav
      title="Integration Settings"
      subtitle="Connect your favorite tools to streamline your workflow"
    >
      {showConfiguration && (
        <IntegrationConfiguration
          onIntegrationComplete={handleIntegrationComplete}
        />
      )}
    </DashboardLayoutWithNav>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    }>
      <IntegrationsPageContent />
    </Suspense>
  );
}
