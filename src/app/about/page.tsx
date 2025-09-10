/**
 * About Page
 *
 * Information about PeerChamps and the team behind it.
 */

import React from 'react';
import { Button } from '@/components/ui';
import { PlusIcon } from '@/components/ui/icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            About PeerChamps
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            We&apos;re revolutionizing customer advocacy through intelligent
            technology and human connections.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                At PeerChamps, we believe that the best sales come from
                authentic customer stories. Our platform bridges the gap between
                your happiest customers and your prospects, creating meaningful
                connections that drive business growth.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We&apos;re not just another CRM tool – we&apos;re your customer
                advocacy partner, helping you build stronger relationships and
                close more deals through the power of peer-to-peer
                conversations.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Why Customer Advocacy Matters
              </h3>
              <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  92% of customers trust peer recommendations over advertising
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  Reference calls increase deal closure rates by 40%
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  Customer advocates generate 5x more revenue than traditional
                  marketing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our Values
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Authenticity
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We believe in genuine connections and authentic customer stories
                that build trust.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Innovation
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We leverage cutting-edge AI and technology to make customer
                advocacy effortless.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Impact
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We measure success by the meaningful connections and business
                growth we enable.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
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
  );
}
