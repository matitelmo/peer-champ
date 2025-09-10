'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { validateMagicLink } from '@/lib/services/bookingLinkService';
import { getAdvocate } from '@/lib/services/advocateService';
import AvailabilityCalendar, { TimeSlot } from '@/components/booking/AvailabilityCalendar';
import ProspectForm from '@/components/booking/ProspectForm';
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Schedule a call</h1>
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <p className="text-gray-700 dark:text-gray-300 mb-2">Opportunity: {linkData.opportunityId}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">Advocate: {linkData.advocateId}</p>
          {advocate ? (
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">{advocate.name}</h2>
              <p className="text-gray-700 dark:text-gray-300">{advocate.title}{advocate.company_name ? ` · ${advocate.company_name}` : ''}</p>
              {advocate.industry && (
                <p className="text-gray-600 dark:text-gray-400">Industry: {advocate.industry}</p>
              )}
              {advocate.geographic_region && (
                <p className="text-gray-600 dark:text-gray-400">Region: {advocate.geographic_region}</p>
              )}
              {Array.isArray(advocate.expertise_areas) && advocate.expertise_areas.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400">Expertise: {advocate.expertise_areas.join(', ')}</p>
              )}
              {typeof advocate.average_rating === 'number' && (
                <p className="text-gray-600 dark:text-gray-400">Avg. Rating: {advocate.average_rating.toFixed(1)} / 5</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Loading advocate details…</p>
          )}
          <div className="mt-6">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Select a time</h3>
            <AvailabilityCalendar
              slots={getMockSlots(5)}
              onSelect={(slot) => {
                setSelectedSlot(slot);
                track('booking_slot_selected', { start: slot.start, end: slot.end });
              }}
            />
            {selectedSlot && (
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                Selected: {new Date(selectedSlot.start).toLocaleString()} -{' '}
                {new Date(selectedSlot.end).toLocaleString()}
              </div>
            )}
          </div>
          <div className="mt-8">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Your information</h3>
            {submitted ? (
              <div className="text-green-700 dark:text-green-400">Thanks! We saved your details.</div>
            ) : (
              <ProspectForm token={token} onSubmitted={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


