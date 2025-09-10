/**
 * Sales Rep Dashboard Component
 *
 * Dashboard layout specifically designed for sales representatives.
 * Shows opportunities, pipeline, upcoming calls, and performance metrics.
 */

'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  Spinner,
  Badge,
  Button,
  Separator,
} from '@/components/ui';
import {
  TrendingUpIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhoneIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@/components/ui/icons';
import { StatCard } from './StatCard';
import { ActivityFeed } from './ActivityFeed';
import { UpcomingCallsWidget } from './UpcomingCallsWidget';
import { OpportunityPipelineWidget } from './OpportunityPipelineWidget';
import { TopAdvocatesWidget } from './TopAdvocatesWidget';

interface SalesRepDashboardProps {
  className?: string;
}

export const SalesRepDashboard: React.FC<SalesRepDashboardProps> = ({
  className = '',
}) => {
  const {
    loading,
    error,
    getFormattedStats,
    getRecentActivity,
    getUpcomingCalls,
    getTopPerformingAdvocates,
    getOpportunityPipeline,
    getQuickInsights,
    refreshDashboard,
    lastUpdated,
  } = useDashboard();

  const stats = getFormattedStats();
  const recentActivity = getRecentActivity();
  const upcomingCalls = getUpcomingCalls();
  const topAdvocates = getTopPerformingAdvocates();
  const opportunityPipeline = getOpportunityPipeline();
  const insights = getQuickInsights();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sales Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your opportunities, pipeline, and advocate performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshDashboard}
            leftIcon={<ClockIcon size={16} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <Alert
              key={index}
              variant={
                insight.type === 'success'
                  ? 'default'
                  : insight.type === 'warning'
                    ? 'destructive'
                    : 'secondary'
              }
              className="p-4"
            >
              <div className="flex items-start space-x-3">
                {insight.type === 'success' && (
                  <CheckCircleIcon
                    size={20}
                    className="text-green-500 mt-0.5"
                  />
                )}
                {insight.type === 'warning' && (
                  <ExclamationTriangleIcon
                    size={20}
                    className="text-yellow-500 mt-0.5"
                  />
                )}
                {insight.type === 'info' && (
                  <ChartBarIcon size={20} className="text-blue-500 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {insight.message}
                  </p>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Open Opportunities"
          value={stats?.openOpportunities.value || 0}
          subtitle={`${stats?.openOpportunities.percentage || 0}% of total`}
          icon={<BuildingOfficeIcon size={24} />}
          trend={stats?.openOpportunities.change}
          color="blue"
        />

        <StatCard
          title="Total Deal Value"
          value={stats?.totalDealValue.value || 0}
          subtitle="Pipeline value"
          icon={<CurrencyDollarIcon size={24} />}
          format="currency"
          trend={stats?.totalDealValue.change}
          color="green"
        />

        <StatCard
          title="Upcoming Calls"
          value={stats?.upcomingCalls.value || 0}
          subtitle="Reference calls scheduled"
          icon={<PhoneIcon size={24} />}
          trend={stats?.upcomingCalls.change}
          color="purple"
        />

        <StatCard
          title="Call Rating"
          value={stats?.averageCallRating.value || 0}
          subtitle="Average advocate rating"
          icon={<StarIcon size={24} />}
          maxValue={stats?.averageCallRating.maxValue}
          unit={stats?.averageCallRating.unit}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Pipeline and Advocates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Pipeline */}
          <OpportunityPipelineWidget
            pipeline={opportunityPipeline}
            totalValue={stats?.totalDealValue.value || 0}
          />

          {/* Top Performing Advocates */}
          <TopAdvocatesWidget advocates={topAdvocates} />
        </div>

        {/* Right Column - Activity and Calls */}
        <div className="space-y-6">
          {/* Upcoming Calls */}
          <UpcomingCallsWidget calls={upcomingCalls} />

          {/* Recent Activity */}
          <ActivityFeed activities={recentActivity} />
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Advocates"
          value={stats?.activeAdvocates.value || 0}
          subtitle={`${stats?.activeAdvocates.percentage || 0}% of total`}
          icon={<UsersIcon size={24} />}
          color="indigo"
        />

        <StatCard
          title="Completed Calls"
          value={stats?.completedCalls.value || 0}
          subtitle={`${stats?.completedCalls.percentage || 0}% of total`}
          icon={<CheckCircleIcon size={24} />}
          color="green"
        />

        <StatCard
          title="Closed Deals"
          value={stats?.closedDealsValue.value || 0}
          subtitle={`${stats?.closedDealsValue.percentage || 0}% of pipeline`}
          icon={<TrendingUpIcon size={24} />}
          format="currency"
          color="emerald"
        />
      </div>
    </div>
  );
};
