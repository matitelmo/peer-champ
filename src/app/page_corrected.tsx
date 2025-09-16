/**
 * PeerChamps Homepage - High Converting B2B SaaS Landing Page
 *
 * A comprehensive landing page designed for maximum conversion with all essential B2B SaaS sections.
 * Optimized for demo bookings and clear value proposition communication.
 */

import React from 'react';
import Link from 'next/link';
import { DemoDashboard } from '@/components/demo/DemoDashboard';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  StarIcon,
  PlayIcon,
  TrendingUpIcon,
  ClockIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-tutu-50 sm:bg-gradient-to-br sm:from-tutu-50 sm:to-pale-sundown-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Urgency Banner */}
            <div className="mb-6 inline-flex items-center rounded-full bg-gradient-brand px-6 py-2 text-white shadow-lg">
              <ExclamationTriangleIcon size={16} className="mr-2" />
              <span className="text-sm font-semibold">Limited time: 50% off first 3 months for new customers</span>
            </div>
            {/* Trust Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-white px-4 py-2 shadow-sm border border-medium-gray">
              <ShieldCheckIcon size={16} className="text-amaranth-500 mr-2" />
              <span className="text-sm font-medium text-regalBlue-700">
                Trusted by 500+ companies • SOC 2 Certified
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-regalBlue-700 sm:text-6xl lg:text-7xl">
              Transform Your Reference Program with{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Call Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-regalBlue-600">
              Streamline your reference calls, boost conversion rates, and close more deals with PeerChamps' 
              intelligent advocate matching and automated scheduling platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-brand text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/auth/signup" className="flex items-center">
                  Start Free Trial
                  <PlayIcon size={20} className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 border-regalBlue-200 hover:border-regalBlue-300"
              >
                <Link href="/booking" className="flex items-center">
                  <VideoCameraIcon size={20} className="mr-2" />
                  Book a Demo
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12">
              <p className="text-sm font-medium text-hippie-blue-600 mb-4">Trusted by leading sales teams</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Atlassian'].map((company) => (
                  <div key={company} className="text-center">
                    <div className="h-8 w-24 mx-auto bg-gradient-to-r from-regalBlue-200 to-hippie-blue-200 rounded flex items-center justify-center">
                      <span className="text-regalBlue-600 font-semibold text-xs">{company}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-900 mb-4">
              Everything You Need to Scale Your Reference Program
            </h2>
            <p className="text-xl text-regalBlue-700 max-w-3xl mx-auto">
              From intelligent advocate matching to automated scheduling, PeerChamps provides all the tools 
              you need to turn your customers into powerful sales assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center mb-6">
                <UsersIcon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-regalBlue-900 mb-4">Smart Advocate Matching</h3>
              <p className="text-regalBlue-600 mb-6">
                Our AI algorithm matches prospects with the perfect customer advocates based on industry, 
                company size, use case, and success metrics.
              </p>
              <ul className="space-y-2 text-sm text-regalBlue-600">
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Industry-specific matching
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Success rate optimization
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Availability management
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center mb-6">
                <CalendarIcon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-regalBlue-900 mb-4">Automated Scheduling</h3>
              <p className="text-regalBlue-600 mb-6">
                Streamline your reference call process with intelligent scheduling that handles time zones, 
                availability, and follow-up reminders automatically.
              </p>
              <ul className="space-y-2 text-sm text-regalBlue-600">
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Multi-timezone support
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Calendar integration
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Automated reminders
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-regalBlue-900 mb-4">Performance Analytics</h3>
              <p className="text-regalBlue-600 mb-6">
                Track the success of your reference program with detailed analytics on conversion rates, 
                advocate performance, and ROI metrics.
              </p>
              <ul className="space-y-2 text-sm text-regalBlue-600">
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Conversion tracking
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  ROI measurement
                </li>
                <li className="flex items-center">
                  <CheckIcon size={16} className="text-amaranth-500 mr-2" />
                  Performance insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <DemoDashboard />

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-900 mb-4">
              Loved by Sales Teams Worldwide
            </h2>
            <p className="text-xl text-regalBlue-700 max-w-3xl mx-auto">
              See how leading companies are using PeerChamps to transform their reference programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={20} className="fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-regalBlue-700">5.0</span>
              </div>
              <p className="text-regalBlue-600 mb-6 italic">
                "PeerChamps has completely transformed our reference program. We've seen a 40% increase 
                in conversion rates since implementing their advocate matching system."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amaranth-400 to-sundown-300 rounded-full flex items-center justify-center text-white font-semibold">
                  SJ
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-regalBlue-900">Sarah Johnson</p>
                  <p className="text-sm text-regalBlue-600">VP of Sales, TechCorp</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={20} className="fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-regalBlue-700">5.0</span>
              </div>
              <p className="text-regalBlue-600 mb-6 italic">
                "The automated scheduling feature alone has saved us 10 hours per week. Our advocates 
                love how easy it is to participate in reference calls now."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amaranth-400 to-sundown-300 rounded-full flex items-center justify-center text-white font-semibold">
                  MD
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-regalBlue-900">Mike Davis</p>
                  <p className="text-sm text-regalBlue-600">Sales Director, GlobalTech</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={20} className="fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-regalBlue-700">5.0</span>
              </div>
              <p className="text-regalBlue-600 mb-6 italic">
                "The analytics dashboard gives us incredible insights into our reference program performance. 
                We can now measure ROI and optimize our approach in real-time."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amaranth-400 to-sundown-300 rounded-full flex items-center justify-center text-white font-semibold">
                  EC
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-regalBlue-900">Emily Chen</p>
                  <p className="text-sm text-regalBlue-600">Head of Sales Ops, StartupXYZ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-regalBlue-50 to-tutu-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-regalBlue-900 mb-6">
            Ready to Transform Your Reference Program?
          </h2>
          <p className="text-xl text-regalBlue-700 mb-12 max-w-3xl mx-auto">
            Join hundreds of sales teams already using PeerChamps to close more deals with 
            powerful reference management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-brand text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/auth/signup" className="flex items-center">
                Start Your Free Trial
                <PlayIcon size={20} className="ml-2" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 border-regalBlue-200 hover:border-regalBlue-300"
            >
              <Link href="/booking" className="flex items-center">
                <VideoCameraIcon size={20} className="mr-2" />
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-regalBlue-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">PeerChamps</h3>
              <p className="text-regalBlue-200 mb-6 max-w-md">
                Transform your reference program with AI-powered advocate matching and automated scheduling. 
                Close more deals with intelligent reference call management.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-regalBlue-800 rounded-lg flex items-center justify-center hover:bg-regalBlue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">LI</span>
                </div>
                <div className="w-10 h-10 bg-regalBlue-800 rounded-lg flex items-center justify-center hover:bg-regalBlue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">TW</span>
                </div>
                <div className="w-10 h-10 bg-regalBlue-800 rounded-lg flex items-center justify-center hover:bg-regalBlue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">FB</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-regalBlue-200">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-regalBlue-200">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-regalBlue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-regalBlue-200 text-sm">
              © 2024 PeerChamps. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-regalBlue-200 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-regalBlue-200 text-sm hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
