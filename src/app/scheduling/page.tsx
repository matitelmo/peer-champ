/**
 * Scheduling Page
 *
 * Main page for scheduling reference calls.
 * Provides simple scheduling interface without calendar integration.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { SimpleCallScheduler } from '@/components/scheduling/SimpleCallScheduler';
import { Button } from '@/components/ui/Button';
import { CalendarIcon } from '@/components/ui/icons';

function SchedulingPage() {
  const [showScheduler, setShowScheduler] = useState(false);

  const handleScheduleCall = () => {
    setShowScheduler(true);
  };

  const handleSchedulingSuccess = (callId: string) => {
    setShowScheduler(false);
    // TODO: Show success message
    console.log('Call scheduled:', callId);
  };

  const handleCancelScheduling = () => {
    setShowScheduler(false);
  };

  if (showScheduler) {
    return (
      <DashboardLayoutWithNav
        title="Schedule Reference Call"
        subtitle="Set up a new reference call between an advocate and prospect"
        showBackButton
        onBack={handleCancelScheduling}
        backLabel="Back to Scheduling"
      >
        <SimpleCallScheduler
          onSuccess={handleSchedulingSuccess}
          onCancel={handleCancelScheduling}
        />
      </DashboardLayoutWithNav>
    );
  }

  return (
    <DashboardLayoutWithNav
      title="Call Scheduling"
      subtitle="Schedule and manage reference calls between advocates and prospects"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon size={24} className="text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Schedule New Call
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up a reference call between an advocate and prospect
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleScheduleCall} className="w-full">
                Schedule Call
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Upcoming Calls
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and manage scheduled calls
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View Calls
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon size={24} className="text-purple-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Call History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review completed reference calls
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Scheduling Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recent activity
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by scheduling your first reference call.
              </p>
              <Button onClick={handleScheduleCall}>
                Schedule Your First Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutWithNav>
  );
}

export default SchedulingPage;
