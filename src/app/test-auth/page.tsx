/**
 * Authentication Test Page
 * 
 * This page provides a testing interface for the authentication system.
 * Only available in development mode.
 */

'use client';

import React from 'react';
import { AuthTest } from '@/components/auth/AuthTest';
import { AuthLayout } from '@/components/layouts/AuthLayout';

export default function TestAuthPage() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            This page is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      variant="default"
      size="4xl"
      title="Authentication Testing"
      subtitle="Test the authentication system during development"
    >
      <AuthTest />
    </AuthLayout>
  );
}
