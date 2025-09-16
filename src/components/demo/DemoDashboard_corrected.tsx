/**
 * Demo Dashboard Component
 *
 * Interactive demo section that showcases the platform capabilities
 * using dummy data. This is displayed on the landing page.
 */

'use client';

import React from 'react';
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
  const demoData = getDemoDashboardData();
  const formattedStats = getFormattedDemoStats();
  const insights = getDemoQuickInsights();

  const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => (
    <Card className="bg-white border border-gray-200">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
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
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" 
      onClick={() => alert("📅 This would normally open the call details or join the meeting.")}
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
      </div>
    </div>
  );

  const AdvocateItem = ({ advocate }: any) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" 
      onClick={() => alert("👤 This would normally show advocate profile and performance details.")}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
          {advocate.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="ml-3">
          <h4 className="font-medium text-gray-900">{advocate.name}</h4>
          <p className="text-sm text-gray-600">{advocate.company}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{advocate.calls_completed}</p>
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
          <p className="text-xl text-regalBlue-700 max-w-3xl mx-auto">
            Explore our interactive demo to see how PeerChamps transforms your reference call process
          </p>
        </div>

        {/* Demo Dashboard */}
        <div className="bg-white rounded-xl shadow-lg border border-medium-gray overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Demo Dashboard</h3>
              <p className="text-sm text-gray-600">Interactive preview of your reference call management</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>

          {/* Tabs for different views */}
          <div className="px-8 py-6">
            <TabsNew defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="calls">Upcoming Calls</TabsTrigger>
                <TabsTrigger value="advocates">Top Advocates</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Opportunities"
                      value={formattedStats.totalOpportunities.value}
                      icon={<BuildingOfficeIcon size={24} className="text-blue-600" />}
                      color="blue"
                      trend="12"
                    />
                    <StatCard
                      title="Active Advocates"
                      value={formattedStats.activeAdvocates.value}
                      icon={<UsersIcon size={24} className="text-green-600" />}
                      color="green"
                      trend="8"
                    />
                    <StatCard
                      title="Upcoming Calls"
                      value={formattedStats.upcomingCalls.value}
                      icon={<PhoneIcon size={24} className="text-purple-600" />}
                      color="purple"
                      trend="15"
                    />
                    <StatCard
                      title="Conversion Rate"
                      value={formattedStats.conversionRate.value}
                      subtitle="vs last month"
                      icon={<TrendingUpIcon size={24} className="text-orange-600" />}
                      color="orange"
                      trend="5"
                    />
                  </div>

                  {/* Quick Insights */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <Alert
                          key={index}
                          variant={insight.type === 'success' ? 'default' : 'default'}
                          className={`${
                            insight.type === 'success' 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}
                        >
                          <div className="flex items-center">
                            {insight.type === 'success' && (
                              <CheckCircleIcon size={20} className="text-green-500 mt-0.5" />
                            )}
                            {insight.type === 'info' && (
                              <ChartBarIcon size={20} className="text-blue-500 mt-0.5" />
                            )}
                            <div className="ml-3">
                              <h4 className="font-medium">{insight.title}</h4>
                              <p className="text-sm mt-1">{insight.message}</p>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calls">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Reference Calls</h3>
                  <div className="space-y-3">
                    {demoData.upcomingCalls.map((call, index) => (
                      <UpcomingCallItem key={index} call={call} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advocates">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Advocates</h3>
                  <div className="space-y-3">
                    {demoData.topAdvocates.map((advocate, index) => (
                      <AdvocateItem key={index} advocate={advocate} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <div className="space-y-3">
                    {demoData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <CalendarIcon size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                        <Badge variant="secondary">{activity.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </TabsNew>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amaranth to-duskSundown hover:from-deepAmaranth hover:to-amaranth text-white px-8 py-3"
            onClick={() => {
              // TODO: Navigate to booking page
              alert('🚀 Starting your free trial! This would normally redirect to the signup page.');
            }}
            rightIcon={<ArrowRightIcon size={20} />}
          >
            Start Free Trial
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="px-8 py-3"
            onClick={() => {
              // TODO: Navigate to contact
              alert('📞 Contacting sales team! This would normally open a calendar booking or contact form.');
            }}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};
