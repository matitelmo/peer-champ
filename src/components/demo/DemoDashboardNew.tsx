/**
 * Demo Dashboard Component - Simplified and Fixed
 * 
 * Interactive demo section that showcases the platform capabilities
 * using dummy data. This is displayed on the landing page.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Badge,
  Alert,
  TabsNew,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import {
  TrendingUpIcon,
  UsersIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  StarIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@/components/ui/icons';
import {
  getDemoDashboardData,
  getFormattedDemoStats,
  getDemoQuickInsights,
} from '@/lib/services/demoService';

interface DemoDashboardProps {
  className?: string;
}

export const DemoDashboard: React.FC<DemoDashboardProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const demoData = getDemoDashboardData();
  const formattedStats = getFormattedDemoStats();
  const insights = getDemoQuickInsights();

  // Simple click handlers with console.log for debugging
  const handleCallClick = (callId: string) => {
    console.log('Call clicked:', callId);
    alert("📅 This would normally open the call details or join the meeting.");
  };

  const handleAdvocateClick = (advocateId: string) => {
    console.log('Advocate clicked:', advocateId);
    alert("👤 This would normally show advocate profile and performance details.");
  };

  const handleStartTrial = () => {
    console.log('Start trial clicked');
    alert('🚀 Starting your free trial! This would normally redirect to the signup page.');
  };

  const handleContactSales = () => {
    console.log('Contact sales clicked');
    alert('📞 Contacting sales team! This would normally open a calendar booking or contact form.');
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUpIcon size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{trend}%</span>
          </div>
        )}
      </CardBody>
    </Card>
  );

  const UpcomingCallItem = ({ call }: any) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCallClick(call.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCallClick(call.id);
        }
      }}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{call.opportunity_name}</h4>
        <p className="text-sm text-gray-600">{call.prospect_company}</p>
        <p className="text-xs text-gray-500">
          with {call.advocate_name} • {call.duration_minutes} min
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {new Date(call.scheduled_at).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(call.scheduled_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        <Badge variant="secondary" className="mt-1">
          {call.meeting_platform}
        </Badge>
      </div>
    </div>
  );

  const AdvocateItem = ({ advocate }: any) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAdvocateClick(advocate.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvocateClick(advocate.id);
        }
      }}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-amaranth-400 to-sundown-300 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {advocate.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="ml-3">
          <h4 className="font-medium text-gray-900">{advocate.name}</h4>
          <p className="text-sm text-gray-600">{advocate.success_rate}% success rate</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{advocate.total_calls}</p>
        <p className="text-xs text-gray-500">calls completed</p>
      </div>
    </div>
  );

  return (
    <section className={`py-24 bg-gradient-to-br from-regalBlue-50 to-tutu-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-regalBlue-900 mb-4">
            See PeerChamps in Action
          </h2>
          <p className="text-xl text-regalBlue-700 max-w-3xl mx-auto mb-8">
            Explore our interactive demo dashboard to see how PeerChamps can transform your reference program. 
            Click on any element to experience the platform firsthand.
          </p>
          <div className="inline-flex items-center rounded-full bg-gradient-brand px-6 py-2 text-white shadow-lg">
            <PlayIcon size={16} className="mr-2" />
            <span className="text-sm font-semibold">Interactive Demo - Click to Explore</span>
          </div>
        </div>

        {/* Demo Dashboard */}
        <div className="bg-white rounded-xl shadow-lg border border-medium-gray overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Sales Dashboard</h3>
              <p className="text-gray-600">Demo Company • Last updated 2 minutes ago</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live Demo
            </Badge>
          </div>

          {/* Tabs for different views */}
          <div className="px-8 py-6">
            <TabsNew defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="calls">Upcoming Calls</TabsTrigger>
                <TabsTrigger value="advocates">Top Advocates</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {/* Quick Insights */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h4>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <Alert
                        key={index}
                        variant={insight.type === 'success' ? 'success' : 'info'}
                        className="border-l-4 border-l-blue-500"
                      >
                        <div>
                          <h5 className="font-medium">{insight.title}</h5>
                          <p className="text-sm mt-1">{insight.message}</p>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Opportunities"
                    value={formattedStats.totalOpportunities.value}
                    subtitle="vs last month"
                    icon={<ChartBarIcon size={24} className="text-blue-600" />}
                    color="blue"
                    trend={12}
                  />
                  <StatCard
                    title="Active Advocates"
                    value={formattedStats.activeAdvocates.value}
                    subtitle="currently engaged"
                    icon={<UsersIcon size={24} className="text-green-600" />}
                    color="green"
                    trend={8}
                  />
                  <StatCard
                    title="Upcoming Calls"
                    value={formattedStats.upcomingCalls.value}
                    subtitle="this week"
                    icon={<CalendarIcon size={24} className="text-purple-600" />}
                    color="purple"
                    trend={15}
                  />
                  <StatCard
                    title="Average Rating"
                    value={formattedStats.averageCallRating.value}
                    subtitle="out of 5 stars"
                    icon={<TrendingUpIcon size={24} className="text-orange-600" />}
                    color="orange"
                    trend={5}
                  />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amaranth to-duskSundown hover:from-deepAmaranth hover:to-amaranth text-white px-8 py-3"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartTrial();
                    }}
                  >
                    Start Free Trial
                    <ArrowRightIcon size={20} className="ml-2" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="px-8 py-3"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleContactSales();
                    }}
                  >
                    <PhoneIcon size={20} className="mr-2" />
                    Contact Sales
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="calls">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reference Calls</h4>
                  {demoData.upcomingCalls.map((call) => (
                    <UpcomingCallItem key={call.id} call={call} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advocates">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Advocates</h4>
                  {demoData.topAdvocates.map((advocate) => (
                    <AdvocateItem key={advocate.id} advocate={advocate} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="text-center py-12 text-gray-500">
                    <ChartBarIcon size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Recent activity data would be displayed here</p>
                    <p className="text-sm mt-2">This demo shows the structure of the activity feed</p>
                  </div>
                </div>
              </TabsContent>
            </TabsNew>
          </div>
        </div>
      </div>
    </section>
  );
};
