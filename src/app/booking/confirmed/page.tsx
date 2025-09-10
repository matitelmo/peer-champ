'use client';

import React from 'react';

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-6 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-700 text-xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">You're all set!</h1>
        <p className="text-gray-600 mb-6">
          Thanks for submitting your details. We'll send a confirmation email with the
          meeting information shortly.
        </p>
        <a href="/" className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white">
          Back to home
        </a>
      </div>
    </div>
  );
}


