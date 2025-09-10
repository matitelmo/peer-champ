'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/utils';

interface ProspectFormProps {
  token: string;
  onSubmitted: () => void;
}

export const ProspectForm: React.FC<ProspectFormProps> = ({ token, onSubmitted }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValid = name.trim().length > 1 && /.+@.+\..+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      track('booking_form_submitted', { name, email });
      const { error } = await supabase
        .from('magic_links')
        .update({
          metadata: {
            prospect_name: name,
            prospect_notes: notes,
          },
          prospect_email: email,
          used_at: new Date().toISOString(),
        })
        .eq('token', token);
      if (error) throw error;
      onSubmitted();
      router.push('/booking/confirmed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your name</label>
        <input
          type="text"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Work email</label>
        <input
          type="email"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-invalid={email.length > 0 && !/.+@.+\..+/.test(email)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Context / preferences (optional)</label>
        <textarea
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white disabled:opacity-50"
        disabled={submitting || !isValid}
        aria-disabled={submitting || !isValid}
      >
        {submitting ? 'Submitting…' : 'Continue'}
      </button>
    </form>
  );
};

export default ProspectForm;


