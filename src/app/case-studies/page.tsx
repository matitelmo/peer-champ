/**
 * Case Studies Page
 *
 * Main page for managing case studies across all advocates.
 * Provides overview, filtering, and management capabilities.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { CaseStudyList } from '@/components/case-study/CaseStudyList';
import { CaseStudyUpload } from '@/components/case-study/CaseStudyUpload';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons';

function CaseStudiesPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedAdvocateId, setSelectedAdvocateId] = useState<string | undefined>();

  const handleCreateCaseStudy = () => {
    setShowUploadForm(true);
  };

  const handleUploadSuccess = (caseStudyId: string) => {
    setShowUploadForm(false);
    setSelectedAdvocateId(undefined);
    // TODO: Show success message
    console.log('Case study created:', caseStudyId);
  };

  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setSelectedAdvocateId(undefined);
  };

  if (showUploadForm) {
    return (
      <DashboardLayoutWithNav
        title="Upload Case Study"
        subtitle="Add a new case study to your advocate repository"
        showBackButton
        onBack={handleCancelUpload}
        backLabel="Back to Case Studies"
      >
        <CaseStudyUpload
          advocateId={selectedAdvocateId || ''} // TODO: Get from context or selection
          onSuccess={handleUploadSuccess}
          onCancel={handleCancelUpload}
        />
      </DashboardLayoutWithNav>
    );
  }

  return (
    <DashboardLayoutWithNav
      title="Case Studies"
      subtitle="Manage case studies and success stories from your advocates"
    >
      <CaseStudyList
        onEdit={(caseStudyId) => {
          // TODO: Implement case study editing
          console.log('Edit case study:', caseStudyId);
        }}
        onView={(caseStudyId) => {
          // TODO: Implement case study viewing
          console.log('View case study:', caseStudyId);
        }}
        onCreate={handleCreateCaseStudy}
      />
    </DashboardLayoutWithNav>
  );
}

export default CaseStudiesPage;
