/**
 * Advocates Page
 *
 * Main page for managing customer advocates.
 * Includes advocate list, registration form, and profile management.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Advocate } from '@/types/database';
import { AdvocateList } from '@/components/advocate/AdvocateList';
import { AdvocateRegistrationForm } from '@/components/advocate/AdvocateRegistrationForm';
import { AdvocateProfileForm } from '@/components/advocate/AdvocateProfileForm';
import { Modal, Button } from '@/components/ui';
import { PlusIcon, ArrowLeftIcon } from '@/components/ui/icons';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export default function AdvocatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(
    null
  );

  // Handle navigation
  const handleCreate = () => {
    setSelectedAdvocate(null);
    setViewMode('create');
  };

  const handleEdit = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setViewMode('edit');
  };

  const handleView = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setViewMode('view');
  };

  const handleBackToList = () => {
    setSelectedAdvocate(null);
    setViewMode('list');
  };

  const handleCreateSuccess = (advocateId: string) => {
    // Could show success message or redirect to the new advocate
    setViewMode('list');
  };

  const handleEditSuccess = () => {
    setViewMode('list');
  };

  const handleCancel = () => {
    setViewMode('list');
  };

  // Render based on current view mode
  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToList}
                leftIcon={<ArrowLeftIcon size={20} />}
              >
                Back to Advocates
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Advocate
              </h1>
            </div>

            <AdvocateRegistrationForm
              onSuccess={handleCreateSuccess}
              onCancel={handleCancel}
            />
          </div>
        );

      case 'edit':
        return selectedAdvocate ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToList}
                leftIcon={<ArrowLeftIcon size={20} />}
              >
                Back to Advocates
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Advocate
              </h1>
            </div>

            <AdvocateProfileForm
              advocateId={selectedAdvocate.id}
              onSuccess={handleEditSuccess}
              onCancel={handleCancel}
            />
          </div>
        ) : null;

      case 'view':
        return selectedAdvocate ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToList}
                leftIcon={<ArrowLeftIcon size={20} />}
              >
                Back to Advocates
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Advocate Profile
              </h1>
            </div>

            <AdvocateProfileForm
              advocateId={selectedAdvocate.id}
              onCancel={handleCancel}
            />
          </div>
        ) : null;

      case 'list':
      default:
        return (
          <AdvocateList
            onEdit={handleEdit}
            onView={handleView}
            onCreate={handleCreate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
