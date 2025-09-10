/**
 * PeerChamps Homepage
 *
 * The main landing page for the PeerChamps application.
 * Showcases the application's purpose and features.
 */

import React from 'react';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  SaveIcon,
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PeerChamps
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              The comprehensive customer reference and advocate management
              platform that streamlines connecting prospects with customer
              advocates.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" leftIcon={<PlusIcon size={20} />}>
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Powerful Features for Customer Advocacy
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need to manage customer references and build strong
              advocate relationships
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <UsersIcon
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intelligent advocate matching for prospects using advanced AI
                algorithms to find the perfect customer advocates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <CalendarIcon
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Seamless Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Calendar integration with Google Calendar and Microsoft Outlook
                for effortless reference call scheduling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <ChartBarIcon
                  size={24}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Analytics & Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive analytics and reporting to track program
                performance and measure success.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                <CheckIcon
                  size={24}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                CRM Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seamless synchronization with Salesforce and HubSpot for unified
                customer data management.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                <SaveIcon
                  size={24}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Compliance First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built-in compliance features and rewards management to ensure
                regulatory adherence.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                <UsersIcon
                  size={24}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Call Intelligence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced call intelligence and insights extraction to maximize
                the value of every reference call.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Customer Advocacy?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of companies using PeerChamps to build stronger
              customer relationships.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<PlusIcon size={20} />}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">PeerChamps</h3>
            <p className="mt-2 text-gray-400">
              Empowering customer advocacy through intelligent technology
            </p>
            <div className="mt-6 flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Terms of Service
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
