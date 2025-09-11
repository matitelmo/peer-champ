'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { validateMagicLink } from '@/lib/services/bookingLinkService';
import { getAdvocate } from '@/lib/services/advocateService';
import AvailabilityCalendar, { TimeSlot } from '@/components/booking/AvailabilityCalendar';
import ProspectForm from '@/components/booking/ProspectForm';
import { AdvocateProfile } from '@/components/booking/AdvocateProfile';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Toast, ToastContainer } from '@/components/ui/ToastContainer';
import { getMockSlots } from '@/lib/services/mockAvailability';
import { track } from '@/lib/utils';

export default function BookingTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<{ opportunityId: string; advocateId: string } | null>(
    null
  );
  const [advocate, setAdvocate] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await validateMagicLink(token);
        setLinkData(data);
        const adv = await getAdvocate(data.advocateId);
        setAdvocate(adv);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Invalid booking link';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
    track('booking_view', { token });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-xl mx-auto">
          <ErrorState
            title="Booking link error"
            description={error || 'Invalid or expired booking link.'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Schedule a Reference Call
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with a customer advocate who can share their experience
          </p>
        </div>

        {/* Enhanced Advocate Profile */}
        {advocate ? (
          <AdvocateProfile advocate={advocate} />
        ) : (
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <p className="text-gray-600 dark:text-gray-400">Loading advocate details…</p>
          </div>
        )}

        {/* Scheduling Section */}
        {advocate && (
          <div className="mt-8 space-y-6">
            {/* Availability Calendar */}
            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Select a Time
              </h3>
              <AvailabilityCalendar
                slots={getMockSlots(5)}
                onSelect={(slot) => {
                  setSelectedSlot(slot);
                  track('booking_slot_selected', { start: slot.start, end: slot.end });
                }}
              />
              {selectedSlot && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Selected Time
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {new Date(selectedSlot.start).toLocaleString()} -{' '}
                        {new Date(selectedSlot.end).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prospect Information Form */}
            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Your Information
              </h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Thank you!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your booking request has been submitted. You'll receive a confirmation email shortly.
                  </p>
                </div>
              ) : (
                <ProspectForm 
                  token={token} 
                  onSubmitted={() => setSubmitted(true)}
                  selectedSlot={selectedSlot}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
