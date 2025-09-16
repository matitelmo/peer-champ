/**
 * Settings Page
 *
 * User settings and preferences management page including meeting preferences,
 * notification settings, and UI customization.
 */

import React from 'react';
import { MeetingPreferencesComponent } from '@/components/meetings/MeetingPreferences';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="space-y-8">
          {/* Meeting Preferences Section */}
          <MeetingPreferencesComponent />
          
          {/* Future sections can be added here */}
          {/* 
          <NotificationPreferences />
          <UIPreferences />
          <AccountSettings />
          */}
        </div>
      </div>
    </div>
  );
}
