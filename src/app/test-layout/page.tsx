'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';

export default function TestLayoutPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Layout Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current AuthLayout (size="4xl")</h2>
            <div className="border-2 border-dashed border-gray-300 p-4">
              <AuthLayout
                variant="default"
                size="4xl"
                title="Test Layout"
                subtitle="Testing the current layout"
              >
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </AuthLayout>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Expected Layout</h2>
            <div className="border-2 border-dashed border-blue-300 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-2">Test Layout</h3>
                  <p className="text-gray-600 mb-4">Testing the expected layout</p>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
