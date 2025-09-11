'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { RefreshIcon } from '@/components/ui/icons';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <RefreshIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>

          <Alert variant="error" className="mb-6 text-left">
            <div className="text-sm">
              <strong>Error Details:</strong>
              <pre className="mt-2 text-xs overflow-auto">
                {error.message}
              </pre>
            </div>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
              leftIcon={<RefreshIcon size={16} />}
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
