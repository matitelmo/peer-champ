/**
 * PeerChamps Homepage - High Converting B2B SaaS Landing Page
 *
 * A comprehensive landing page designed for maximum conversion with all essential B2B SaaS sections.
 * Optimized for demo bookings and clear value proposition communication.
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  StarIcon,
  // ArrowRightIcon, // TODO: Add this icon
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
              Stop Losing Deals to{' '}
              <span className="text-gradient-brand">
                Reference Chaos
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-xl text-hippie-blue-600 leading-relaxed">
              The average B2B sales team wastes <strong>8 hours per week</strong> hunting for customer references. 
              PeerChamps eliminates this chaos with AI-powered matching and automated scheduling, helping teams 
              close <strong>40% more deals</strong> in half the time.
            </p>

            {/* Key Metrics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-medium-gray">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUpIcon size={24} className="text-green-600 mr-2" />
                  <span className="text-3xl font-bold text-regalBlue-700">40%</span>
                </div>
                <p className="text-sm text-hippie-blue-600">Increase in close rate</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-medium-gray">
                <div className="flex items-center justify-center mb-3">
                  <ClockIcon size={24} className="text-blue-600 mr-2" />
                  <span className="text-3xl font-bold text-regalBlue-700">8 hrs</span>
                </div>
                <p className="text-sm text-hippie-blue-600">Saved per rep each week</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-medium-gray">
                <div className="flex items-center justify-center mb-3">
                  <UsersIcon size={24} className="text-purple-600 mr-2" />
                  <span className="text-3xl font-bold text-regalBlue-700">300%</span>
                </div>
                <p className="text-sm text-hippie-blue-600">More reference calls</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-hippie-blue-600">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-amaranth-400 to-sundown-400 border-2 border-white"></div>
                  ))}
                </div>
                <span className="ml-3">Join 500+ companies</span>
              </div>
              <div className="flex items-center">
                <StarIcon size={16} className="text-yellow-400 mr-1" />
                <span>4.9/5 rating</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#demo-booking" prefetch aria-label="Book a free demo of PeerChamps">
                <Button size="lg" leftIcon={<CalendarIcon size={20} />} className="w-full sm:w-auto" aria-label="Book Free Demo">
                  Book Free Demo
                </Button>
              </Link>
              <Link href="/auth/signup" prefetch aria-label="Start free trial of PeerChamps">
                <Button variant="outline" size="lg" leftIcon={<PlusIcon size={20} />} className="w-full sm:w-auto" aria-label="Start Free Trial">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-hippie-blue-600">
              No credit card required • 14-day free trial • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-hippie-blue-600 mb-8">
            Trusted by leading companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Atlassian'].map((company) => (
              <div key={company} className="text-center">
                <div className="h-12 w-32 mx-auto bg-gradient-to-r from-regalBlue-200 to-hippie-blue-200 rounded flex items-center justify-center">
                  <span className="text-regalBlue-600 font-semibold text-sm">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-tutu-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">The Hidden Cost of Reference Chaos</h2>
            <p className="text-xl text-hippie-blue-600">Sales teams lose deals when the right customer reference isn’t ready on time.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <ClockIcon size={28} className="text-amaranth-500" />, title: '8 hours lost weekly', desc: 'Reps hunt through spreadsheets and Slack threads' },
              { icon: <ExclamationTriangleIcon size={28} className="text-orange-500" />, title: '30% deal delays', desc: 'Critical cycles stall awaiting references' },
              { icon: <UsersIcon size={28} className="text-purple-600" />, title: 'Advocate burnout', desc: 'Same 3–4 customers overused and fatigued' },
              { icon: <ChartBarIcon size={28} className="text-blue-600" />, title: 'Lost intelligence', desc: 'Conversation insights vanish into email' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-medium-gray">
                <div className="mb-3">{item.icon}</div>
                <div className="font-semibold text-regalBlue-700">{item.title}</div>
                <div className="text-sm text-hippie-blue-600 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Booking Section */}
      <section id="demo-booking" className="py-24 bg-gradient-to-br from-regalBlue-50 to-tutu-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">See PeerChamps in Action</h2>
            <p className="text-xl text-hippie-blue-600">Book a 15-minute personalized demo. No sales pitch — just value.</p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-regalBlue-700 mb-4">What you’ll see</h3>
                <ul className="space-y-3">
                  {[
                    'AI-powered advocate matching',
                    'Automated scheduling workflows',
                    'Salesforce/HubSpot sync',
                    'ROI analytics dashboard',
                  ].map((line, i) => (
                    <li key={i} className="flex items-center">
                      <CheckIcon size={18} className="text-green-600 mr-2" />
                      <span className="text-hippie-blue-600 text-sm">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-regalBlue-700 mb-4">Pick your format</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center p-3 border border-medium-gray rounded-lg hover:bg-tutu-50 transition-colors">
                    <VideoCameraIcon size={20} className="text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-regalBlue-700">Live Demo</div>
                      <div className="text-xs text-hippie-blue-600">15 minutes</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center p-3 border border-medium-gray rounded-lg hover:bg-tutu-50 transition-colors">
                    <PhoneIcon size={20} className="text-green-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-regalBlue-700">Phone Call</div>
                      <div className="text-xs text-hippie-blue-600">30 minutes</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button size="lg" className="w-full" leftIcon={<CalendarIcon size={20} />}>Schedule Your Demo</Button>
              <p className="mt-2 text-xs text-hippie-blue-600 text-center">No credit card • SOC 2 • 99.9% uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-tutu-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">
              Everything you need to scale customer advocacy
            </h2>
            <p className="text-xl text-hippie-blue-600 max-w-3xl mx-auto">
              From intelligent matching to automated scheduling, PeerChamps handles every aspect 
              of your customer reference program so you can focus on closing deals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-amaranth-100 to-sundown-100">
                <UsersIcon size={28} className="text-amaranth-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                AI-Powered Matching
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                Our intelligent algorithm matches prospects with your best advocates based on 
                industry, company size, use case, and success metrics.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ 95% match accuracy</li>
                <li>✓ Prevents advocate overuse</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-100 to-emerald-100">
                <CalendarIcon size={28} className="text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                Automated Scheduling
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                Seamless calendar integration with Google Calendar and Outlook. 
                Automated booking links and reminder sequences.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ 80% time savings</li>
                <li>✓ Auto reminders reduce no-shows</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-violet-100">
                <ChartBarIcon size={28} className="text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                Revenue Analytics
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                Track reference call ROI, deal velocity, and advocate performance 
                with comprehensive analytics and reporting.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ 40% faster closes</li>
                <li>✓ Prove pipeline impact</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100">
                <ShieldCheckIcon size={28} className="text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                CRM Integration
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                Native integrations with Salesforce, HubSpot, and Pipedrive. 
                Automatic data sync and opportunity tracking.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ 1-click setup</li>
                <li>✓ Zero manual updates</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-orange-100 to-amber-100">
                <CheckIcon size={28} className="text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                Compliance & Rewards
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                Built-in compliance tracking and automated reward management 
                to keep your advocates engaged and compliant.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ 100% compliance coverage</li>
                <li>✓ Automated stipend/rewards</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray hover:shadow-md transition-shadow">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100">
                <UsersIcon size={28} className="text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-regalBlue-700">
                Call Intelligence
              </h3>
              <p className="text-hippie-blue-600 leading-relaxed mb-4">
                AI-powered call insights and follow-up recommendations 
                to maximize the value of every reference interaction.
              </p>
              <ul className="text-sm text-green-600 space-y-1">
                <li>✓ Key moments auto-summarized</li>
                <li>✓ Smart follow-ups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tour */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">How PeerChamps Works</h2>
            <p className="text-xl text-hippie-blue-600">A fast, focused tour of the core workflow</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Match', desc: 'AI suggests perfect-fit advocates in seconds', color: 'from-amaranth-100 to-sundown-100' },
              { title: 'Schedule', desc: 'Send booking links and auto reminders', color: 'from-green-100 to-emerald-100' },
              { title: 'Measure', desc: 'See ROI, velocity, and revenue impact', color: 'from-purple-100 to-violet-100' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-medium-gray shadow-sm">
                <div className={`h-40 rounded-lg mb-4 bg-gradient-to-r ${card.color}`}></div>
                <div className="text-lg font-semibold text-regalBlue-700 mb-1">{card.title}</div>
                <div className="text-hippie-blue-600 text-sm">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">
              Loved by sales teams worldwide
            </h2>
            <p className="text-xl text-hippie-blue-600">
              See how PeerChamps is transforming customer advocacy programs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "PeerChamps increased our reference call success rate by 300%. The AI matching is incredibly accurate.",
                author: "Sarah Chen",
                title: "VP of Sales, TechFlow",
                avatar: "SC"
              },
              {
                quote: "We went from 2-3 reference calls per month to 15+ calls. The automated scheduling is a game-changer.",
                author: "Michael Rodriguez",
                title: "Sales Director, DataSync",
                avatar: "MR"
              },
              {
                quote: "The analytics help us prove ROI to leadership. We can see exactly how references impact our pipeline.",
                author: "Emily Watson",
                title: "Head of Revenue, CloudBase",
                avatar: "EW"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-tutu-50 rounded-xl p-8 border border-medium-gray">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={20} className="text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-regalBlue-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amaranth-400 to-sundown-400 flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-regalBlue-700">{testimonial.author}</div>
                    <div className="text-sm text-hippie-blue-600">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-tutu-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">Customer Results</h2>
            <p className="text-xl text-hippie-blue-600">Proof that references drive revenue when operationalized</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { company: 'TechFlow', result: '300% more reference calls in 60 days', quote: 'AI matching and automated scheduling unlocked our advocates without burning them out.' },
              { company: 'DataSync', result: '40% faster deal velocity', quote: 'The pipeline impact is finally measurable — leadership loves the clarity.' },
            ].map((cs, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-medium-gray shadow-sm">
                <div className="text-sm font-semibold text-amaranth-600 mb-2">{cs.company}</div>
                <div className="text-2xl font-bold text-regalBlue-700 mb-3">{cs.result}</div>
                <p className="text-hippie-blue-600">“{cs.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-regalBlue-50 to-tutu-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-hippie-blue-600">
              Choose the plan that fits your team size and needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-regalBlue-700 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-regalBlue-700 mb-2">$99</div>
                <div className="text-hippie-blue-600">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Up to 5 advocates',
                  '50 reference calls/month',
                  'Basic CRM integration',
                  'Email support',
                  'Standard analytics'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon size={20} className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-hippie-blue-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Start Free Trial
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-amaranth-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amaranth-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-regalBlue-700 mb-2">Professional</h3>
                <div className="text-4xl font-bold text-regalBlue-700 mb-2">$299</div>
                <div className="text-hippie-blue-600">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Up to 25 advocates',
                  '200 reference calls/month',
                  'Advanced CRM integration',
                  'Priority support',
                  'Advanced analytics',
                  'Custom reporting',
                  'API access'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon size={20} className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-hippie-blue-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                Start Free Trial
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-regalBlue-700 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-regalBlue-700 mb-2">Custom</div>
                <div className="text-hippie-blue-600">contact sales</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited advocates',
                  'Unlimited reference calls',
                  'Full CRM integration',
                  'Dedicated support',
                  'Custom analytics',
                  'White-label options',
                  'SSO & advanced security'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon size={20} className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-hippie-blue-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-hippie-blue-600 mb-4">
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
            <Link href="#contact" className="text-amaranth-500 hover:text-amaranth-600 font-medium">
              Need a custom plan? Contact our sales team
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-regalBlue-700 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-hippie-blue-600">
              Everything you need to know about PeerChamps
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "How does the AI matching work?",
                answer: "Our AI analyzes prospect data including industry, company size, use case, and success metrics to match them with your most relevant advocates. The algorithm learns from each interaction to improve matching accuracy over time."
              },
              {
                question: "Can I integrate with my existing CRM?",
                answer: "Yes! PeerChamps integrates natively with Salesforce, HubSpot, and Pipedrive. We also offer API access for custom integrations with other systems."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data is always yours. We provide full data export capabilities and will work with you to ensure a smooth transition if you decide to cancel your subscription."
              },
              {
                question: "How quickly can I get started?",
                answer: "Most teams are up and running within 5 minutes. Our onboarding process guides you through advocate setup, CRM integration, and your first reference call scheduling."
              },
              {
                question: "Do you offer training and support?",
                answer: "Yes! All plans include email support, and Professional and Enterprise plans include priority support. We also offer training sessions and documentation to help your team succeed."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-medium-gray pb-6">
                <h3 className="text-lg font-semibold text-regalBlue-700 mb-3">
                  {faq.question}
                </h3>
                <p className="text-hippie-blue-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-tutu-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold text-regalBlue-700 mb-6">
                Built by sales teams, for sales teams
              </h2>
              <p className="text-xl text-hippie-blue-600 mb-8 leading-relaxed">
                PeerChamps was born from the frustration of managing customer references manually. 
                We've helped over 500 companies transform their advocacy programs and close more deals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckIcon size={20} className="text-green-500 mr-3" />
                  <span className="text-regalBlue-700">Founded by former sales leaders</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={20} className="text-green-500 mr-3" />
                  <span className="text-regalBlue-700">500+ companies trust us</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={20} className="text-green-500 mr-3" />
                  <span className="text-regalBlue-700">SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={20} className="text-green-500 mr-3" />
                  <span className="text-regalBlue-700">99.9% uptime SLA</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-medium-gray">
              <div className="text-center">
                <div className="h-32 w-32 mx-auto bg-gradient-to-r from-amaranth-100 to-sundown-100 rounded-full flex items-center justify-center mb-6">
                  <UsersIcon size={48} className="text-amaranth-600" />
                </div>
                <h3 className="text-2xl font-bold text-regalBlue-700 mb-4">
                  Join the PeerChamps community
                </h3>
                <p className="text-hippie-blue-600 mb-6">
                  Connect with other sales leaders and learn best practices for customer advocacy.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-brand py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your customer advocacy?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join 500+ companies using PeerChamps to close more deals with customer references.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<PlusIcon size={20} />}
                className="w-full sm:w-auto"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-amaranth-500"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            No credit card required • 14-day free trial • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-regalBlue-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-2xl font-bold text-white">PeerChamps</span>
              </div>
              <p className="text-white/80 mb-6 max-w-md">
                The comprehensive customer reference and advocate management platform 
                that streamlines connecting prospects with customer advocates.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  YouTube
                </Button>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Integrations', 'API', 'Security'].map((link) => (
                  <li key={link}>
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white p-0 h-auto">
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {['About', 'Careers', 'Blog', 'Contact', 'Support'].map((link) => (
                  <li key={link}>
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white p-0 h-auto">
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm">
                © 2024 PeerChamps. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-0 h-auto">
                  Privacy Policy
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-0 h-auto">
                  Terms of Service
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-0 h-auto">
                  Cookie Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}