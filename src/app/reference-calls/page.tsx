/**
 * Reference Calls Page
 *
 * Main page for managing reference calls including scheduling,
 * viewing, editing, and tracking call sessions.
 */

'use client';

import React, { useState } from 'react';
import { withAuth } from '@/hooks/useAuth';
import { ReferenceCall } from '@/lib/services/referenceCallService';
import { ReferenceCallList } from '@/components/reference-calls/ReferenceCallList';
import { ReferenceCallForm } from '@/components/reference-calls/ReferenceCallForm';
import { ReferenceCallDetails } from '@/components/reference-calls/ReferenceCallDetails';
import { Modal } from '@/components/ui';
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
} from '@/components/ui/icons';

const ReferenceCallsPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCall, setSelectedCall] = useState<ReferenceCall | null>(null);

  // Handle creating a new call
  const handleCreateCall = () => {
    setSelectedCall(null);
    setShowCreateForm(true);
  };

  // Handle viewing call details
  const handleViewCall = (call: ReferenceCall) => {
    setSelectedCall(call);
    setShowDetails(true);
  };

  // Handle editing a call
  const handleEditCall = (call: ReferenceCall) => {
    setSelectedCall(call);
    setShowEditForm(true);
  };

  // Handle deleting a call
  const handleDeleteCall = (call: ReferenceCall) => {
    // The deletion is handled by the ReferenceCallList component
    // This is just for any additional cleanup or notifications
    console.log('Call deleted:', call.id);
  };

  // Handle successful form submission
  const handleFormSuccess = (callId: string) => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDetails(false);
    setSelectedCall(null);

    // Optionally show a success message or refresh data
    console.log('Call saved successfully:', callId);
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedCall(null);
  };

  // Handle closing details
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedCall(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Reference Calls
                </h1>
                <p className="mt-2 text-gray-600">
                  Schedule, manage, and track reference call sessions between
                  advocates and prospects
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1" />
                    <span>Schedule calls</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon size={16} className="mr-1" />
                    <span>Manage participants</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon size={16} className="mr-1" />
                    <span>Track sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReferenceCallList
          onViewCall={handleViewCall}
          onEditCall={handleEditCall}
          onDeleteCall={handleDeleteCall}
          onCreateCall={handleCreateCall}
        />
      </div>

      {/* Create Call Modal */}
      <Modal
        isOpen={showCreateForm}
        onClose={handleFormCancel}
        title="Schedule Reference Call"
        size="xl"
      >
        <ReferenceCallForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Edit Call Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={handleFormCancel}
        title="Edit Reference Call"
        size="xl"
      >
        {selectedCall && (
          <ReferenceCallForm
            call={selectedCall}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </Modal>

      {/* Call Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetails}
        title="Reference Call Details"
        size="xl"
      >
        {selectedCall && (
          <ReferenceCallDetails
            callId={selectedCall.id}
            onEdit={handleEditCall}
            onClose={handleCloseDetails}
          />
        )}
      </Modal>
    </div>
  );
};

export default withAuth(ReferenceCallsPage);
