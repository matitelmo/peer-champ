/**
 * Import Page
 * 
 * Hosts the Data Import Wizard for importing data from CSV/Excel files.
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { DataImportWizard } from '@/components/import/DataImportWizard';
import { Spinner } from '@/components/ui/Spinner';

function ImportPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWizard, setShowWizard] = useState(false);

  const importType = (searchParams.get('type') as 'advocates' | 'opportunities' | 'contacts') || 'advocates';

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

  const handleImportComplete = (results: any) => {
    console.log('Import completed:', results);
    // Redirect to the appropriate page based on import type
    switch (importType) {
      case 'advocates':
        router.push('/advocates?imported=true');
        break;
      case 'opportunities':
        router.push('/opportunities?imported=true');
        break;
      case 'contacts':
        router.push('/contacts?imported=true');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const handleImportCancel = () => {
    // Redirect back to the appropriate page
    switch (importType) {
      case 'advocates':
        router.push('/advocates');
        break;
      case 'opportunities':
        router.push('/opportunities');
        break;
      case 'contacts':
        router.push('/contacts');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const getPageTitle = () => {
    switch (importType) {
      case 'advocates':
        return 'Import Advocates';
      case 'opportunities':
        return 'Import Opportunities';
      case 'contacts':
        return 'Import Contacts';
      default:
        return 'Import Data';
    }
  };

  const getPageSubtitle = () => {
    switch (importType) {
      case 'advocates':
        return 'Import customer advocates from CSV or Excel files';
      case 'opportunities':
        return 'Import sales opportunities from CSV or Excel files';
      case 'contacts':
        return 'Import contacts from CSV or Excel files';
      default:
        return 'Import data from CSV or Excel files';
    }
  };

  return (
    <DashboardLayoutWithNav
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
    >
      {showWizard && (
        <DataImportWizard
          importType={importType}
          onComplete={handleImportComplete}
          onCancel={handleImportCancel}
        />
      )}
    </DashboardLayoutWithNav>
  );
}

export default function ImportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    }>
      <ImportPageContent />
    </Suspense>
  );
}
