/**
 * Dashboard Page
 *
 * The main dashboard for authenticated users to manage their customer advocacy program.
 */

import React from 'react';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@/components/ui/icons';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome to your customer advocacy management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <UsersIcon
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Active Advocates
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  24
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <CalendarIcon
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Scheduled Calls
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  8
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <ChartBarIcon
                size={24}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Success Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                94%
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                <PlusIcon
                  size={24}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  New Opportunities
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  12
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<PlusIcon size={16} />}>Add New Advocate</Button>
            <Button variant="secondary" leftIcon={<CalendarIcon size={16} />}>
              Schedule Call
            </Button>
            <Button variant="outline" leftIcon={<UsersIcon size={16} />}>
              Manage Advocates
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Reference call completed with Acme Corp
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  New advocate John Smith added to program
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  4 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Call scheduled for tomorrow with TechStart Inc
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  6 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
