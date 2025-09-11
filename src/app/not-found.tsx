import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SearchIcon, HomeIcon } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <SearchIcon className="w-12 h-12 text-gray-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full" leftIcon={<HomeIcon size={16} />}>
              Go Home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? <Link href="/contact" className="text-primary-600 hover:text-primary-500">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
}
