'use client';

/**
 * Meetings Page
 *
 * Page for generating and managing meeting links for reference calls.
 * This demonstrates the meeting link generation functionality.
 */

import React from 'react';
import { MeetingLinkGenerator } from '@/components/meetings/MeetingLinkGenerator';

export default function MeetingsPage() {
  const handleMeetingGenerated = (meetingUrl: string, meetingId: string) => {
    console.log('Meeting generated:', { meetingUrl, meetingId });
    // In a real app, this would save to the reference call or show a success message
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
          <p className="mt-2 text-gray-600">
            Generate meeting links for your reference calls
          </p>
        </div>

        <MeetingLinkGenerator onMeetingGenerated={handleMeetingGenerated} />
      </div>
    </div>
  );
}
