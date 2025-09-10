/**
 * Dashboard Hook
 *
 * React hook for managing dashboard data and state.
 * Provides role-specific dashboard information and metrics.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  DashboardData,
  DashboardStats,
  RecentActivity,
  UpcomingCall,
  TopPerformingAdvocate,
  OpportunityPipeline,
  getDashboardData,
} from '@/lib/services/dashboardService';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Get user's company_id and role from the users table
      // For now, using placeholder values
      const companyId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Placeholder
      const userRole = 'sales_rep'; // Placeholder - should be determined from user data

      const data = await getDashboardData(user.id, companyId, userRole);
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh dashboard data
  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Get stats with loading state
  const getStats = useCallback((): DashboardStats | null => {
    return dashboardData?.stats || null;
  }, [dashboardData]);

  // Get recent activity with loading state
  const getRecentActivity = useCallback((): RecentActivity[] => {
    return dashboardData?.recentActivity || [];
  }, [dashboardData]);

  // Get upcoming calls with loading state
  const getUpcomingCalls = useCallback((): UpcomingCall[] => {
    return dashboardData?.upcomingCalls || [];
  }, [dashboardData]);

  // Get top performing advocates with loading state
  const getTopPerformingAdvocates = useCallback((): TopPerformingAdvocate[] => {
    return dashboardData?.topPerformingAdvocates || [];
  }, [dashboardData]);

  // Get opportunity pipeline with loading state
  const getOpportunityPipeline = useCallback((): OpportunityPipeline[] => {
    return dashboardData?.opportunityPipeline || [];
  }, [dashboardData]);

  // Get formatted stats for display
  const getFormattedStats = useCallback(() => {
    const stats = getStats();
    if (!stats) return null;

    return {
      totalAdvocates: {
        value: stats.totalAdvocates,
        label: 'Total Advocates',
        change: null, // TODO: Calculate change from previous period
      },
      activeAdvocates: {
        value: stats.activeAdvocates,
        label: 'Active Advocates',
        percentage:
          stats.totalAdvocates > 0
            ? Math.round((stats.activeAdvocates / stats.totalAdvocates) * 100)
            : 0,
      },
      totalOpportunities: {
        value: stats.totalOpportunities,
        label: 'Total Opportunities',
        change: null, // TODO: Calculate change from previous period
      },
      openOpportunities: {
        value: stats.openOpportunities,
        label: 'Open Opportunities',
        percentage:
          stats.totalOpportunities > 0
            ? Math.round(
                (stats.openOpportunities / stats.totalOpportunities) * 100
              )
            : 0,
      },
      totalReferenceCalls: {
        value: stats.totalReferenceCalls,
        label: 'Total Reference Calls',
        change: null, // TODO: Calculate change from previous period
      },
      upcomingCalls: {
        value: stats.upcomingCalls,
        label: 'Upcoming Calls',
        change: null, // TODO: Calculate change from previous period
      },
      completedCalls: {
        value: stats.completedCalls,
        label: 'Completed Calls',
        percentage:
          stats.totalReferenceCalls > 0
            ? Math.round(
                (stats.completedCalls / stats.totalReferenceCalls) * 100
              )
            : 0,
      },
      averageCallRating: {
        value: stats.averageCallRating,
        label: 'Average Call Rating',
        maxValue: 5,
        unit: 'stars',
      },
      totalDealValue: {
        value: stats.totalDealValue,
        label: 'Total Deal Value',
        format: 'currency',
        change: null, // TODO: Calculate change from previous period
      },
      closedDealsValue: {
        value: stats.closedDealsValue,
        label: 'Closed Deals Value',
        format: 'currency',
        percentage:
          stats.totalDealValue > 0
            ? Math.round((stats.closedDealsValue / stats.totalDealValue) * 100)
            : 0,
      },
    };
  }, [getStats]);

  // Get quick insights
  const getQuickInsights = useCallback(() => {
    const stats = getStats();
    if (!stats) return [];

    const insights = [];

    // Advocate insights
    if (stats.activeAdvocates < stats.totalAdvocates * 0.8) {
      insights.push({
        type: 'warning',
        title: 'Low Advocate Activity',
        message: `${stats.totalAdvocates - stats.activeAdvocates} advocates are inactive`,
      });
    }

    // Opportunity insights
    if (stats.openOpportunities > stats.totalOpportunities * 0.7) {
      insights.push({
        type: 'info',
        title: 'High Open Opportunities',
        message: `${stats.openOpportunities} opportunities are still open`,
      });
    }

    // Call insights
    if (stats.upcomingCalls > 0) {
      insights.push({
        type: 'success',
        title: 'Upcoming Calls',
        message: `${stats.upcomingCalls} reference calls scheduled`,
      });
    }

    // Rating insights
    if (stats.averageCallRating > 4) {
      insights.push({
        type: 'success',
        title: 'Excellent Call Quality',
        message: `Average rating of ${stats.averageCallRating} stars`,
      });
    } else if (stats.averageCallRating < 3) {
      insights.push({
        type: 'warning',
        title: 'Call Quality Needs Improvement',
        message: `Average rating of ${stats.averageCallRating} stars`,
      });
    }

    return insights;
  }, [getStats]);

  return {
    // State
    dashboardData,
    loading,
    error,
    lastUpdated,

    // Actions
    refreshDashboard,
    fetchDashboardData,

    // Data getters
    getStats,
    getRecentActivity,
    getUpcomingCalls,
    getTopPerformingAdvocates,
    getOpportunityPipeline,
    getFormattedStats,
    getQuickInsights,

    // Computed values
    hasData: !!dashboardData,
    isStale: lastUpdated
      ? Date.now() - lastUpdated.getTime() > 10 * 60 * 1000
      : false, // 10 minutes
  };
};
