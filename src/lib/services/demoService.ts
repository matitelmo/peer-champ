/**
 * Demo Service
 *
 * Service that provides demo/dummy data for showcasing the platform capabilities.
 * This data is used in the demo section of the landing page.
 */

// Types (reusing from dashboardService)
export interface DemoStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalAdvocates: number;
  activeAdvocates: number;
  totalCalls: number;
  upcomingCalls: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface DemoUpcomingCall {
  id: string;
  opportunity_name: string;
  prospect_company: string;
  advocate_name: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_platform: string;
  meeting_link?: string;
}

export interface DemoTopAdvocate {
  id: string;
  name: string;
  total_calls: number;
  success_rate: number;
  average_rating: number;
}

export interface DemoRecentActivity {
  id: string;
  type: 'call' | 'opportunity' | 'advocate';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface DemoOpportunityPipeline {
  id: string;
  stage: string;
  count: number;
  value: number;
  color: string;
}

export interface DemoDashboardData {
  stats: DemoStats;
  upcomingCalls: DemoUpcomingCall[];
  topAdvocates: DemoTopAdvocate[];
  recentActivity: DemoRecentActivity[];
  opportunityPipeline: DemoOpportunityPipeline[];
}

/**
 * Get demo dashboard data for showcasing platform capabilities
 */
export function getDemoDashboardData(): DemoDashboardData {
  return {
    stats: {
      totalOpportunities: 28,
      activeOpportunities: 18,
      totalAdvocates: 45,
      activeAdvocates: 38,
      totalCalls: 156,
      upcomingCalls: 12,
      conversionRate: 64.3,
      averageDealSize: 45000,
    },
    upcomingCalls: [
      {
        id: '1',
        opportunity_name: 'Enterprise Security Upgrade',
        prospect_company: 'TechCorp Solutions',
        advocate_name: 'Sarah Johnson',
        scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        duration_minutes: 45,
        meeting_platform: 'Zoom',
        meeting_link: 'https://zoom.us/j/123456789',
      },
      {
        id: '2',
        opportunity_name: 'Digital Transformation',
        prospect_company: 'Global Industries Inc',
        advocate_name: 'Mike Davis',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        duration_minutes: 60,
        meeting_platform: 'Microsoft Teams',
        meeting_link: 'https://teams.microsoft.com/l/meetup-join/...',
      },
      {
        id: '3',
        opportunity_name: 'Cloud Migration Project',
        prospect_company: 'StartupXYZ',
        advocate_name: 'John Smith',
        scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
        duration_minutes: 30,
        meeting_platform: 'Google Meet',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
      },
    ],
    topAdvocates: [
      {
        id: '1',
        name: 'Sarah Johnson',
        total_calls: 24,
        success_rate: 92,
        average_rating: 4.9,
      },
      {
        id: '2',
        name: 'Mike Davis',
        total_calls: 18,
        success_rate: 89,
        average_rating: 4.8,
      },
      {
        id: '3',
        name: 'John Smith',
        total_calls: 31,
        success_rate: 87,
        average_rating: 4.7,
      },
      {
        id: '4',
        name: 'Emily Chen',
        total_calls: 15,
        success_rate: 93,
        average_rating: 4.9,
      },
      {
        id: '5',
        name: 'David Wilson',
        total_calls: 22,
        success_rate: 86,
        average_rating: 4.6,
      },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'call',
        title: 'Reference call completed',
        description: 'Call with Acme Corp completed successfully - 5/5 rating',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: 'completed',
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'New opportunity created',
        description: 'Opportunity "Enterprise Security Upgrade" created for TechCorp Solutions',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'active',
      },
      {
        id: '3',
        type: 'advocate',
        title: 'New advocate onboarded',
        description: 'Emily Chen completed onboarding and is ready for calls',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: 'active',
      },
      {
        id: '4',
        type: 'call',
        title: 'Reference call scheduled',
        description: 'Call with Global Industries Inc scheduled for tomorrow',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        status: 'scheduled',
      },
      {
        id: '5',
        type: 'opportunity',
        title: 'Opportunity moved to proposal stage',
        description: 'Digital Transformation opportunity advanced to proposal stage',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        status: 'updated',
      },
    ],
    opportunityPipeline: [
      {
        id: '1',
        stage: 'Lead',
        count: 12,
        value: 240000,
        color: '#3B82F6',
      },
      {
        id: '2',
        stage: 'Qualified',
        count: 8,
        value: 360000,
        color: '#10B981',
      },
      {
        id: '3',
        stage: 'Proposal',
        count: 5,
        value: 225000,
        color: '#F59E0B',
      },
      {
        id: '4',
        stage: 'Negotiation',
        count: 3,
        value: 180000,
        color: '#EF4444',
      },
      {
        id: '5',
        stage: 'Closed Won',
        count: 2,
        value: 120000,
        color: '#8B5CF6',
      },
    ],
  };
}

/**
 * Get formatted demo stats for display
 */
export function getFormattedDemoStats() {
  const demoData = getDemoDashboardData();
  const stats = demoData.stats;

  return {
    totalAdvocates: {
      value: stats.totalAdvocates,
      label: 'Total Advocates',
      change: null,
    },
    activeAdvocates: {
      value: stats.activeAdvocates,
      label: 'Active Advocates',
      percentage: stats.totalAdvocates > 0
        ? Math.round((stats.activeAdvocates / stats.totalAdvocates) * 100)
        : 0,
    },
    totalOpportunities: {
      value: stats.totalOpportunities,
      label: 'Total Opportunities',
      change: null,
    },
    activeOpportunities: {
      value: stats.activeOpportunities,
      label: 'Open Opportunities',
      percentage: stats.totalOpportunities > 0
        ? Math.round((stats.activeOpportunities / stats.totalOpportunities) * 100)
        : 0,
    },
    totalCalls: {
      value: stats.totalCalls,
      label: 'Total Reference Calls',
      change: null,
    },
    upcomingCalls: {
      value: stats.upcomingCalls,
      label: 'Upcoming Calls',
      change: null,
    },
    completedCalls: {
      value: stats.totalCalls - stats.upcomingCalls,
      label: 'Completed Calls',
      percentage: stats.totalCalls > 0
        ? Math.round(((stats.totalCalls - stats.upcomingCalls) / stats.totalCalls) * 100)
        : 0,
    },
    averageCallRating: {
      value: 4.7,
      label: 'Average Call Rating',
      maxValue: 5,
      unit: 'stars',
    },
    totalDealValue: {
      value: stats.averageDealSize * stats.totalOpportunities,
      label: 'Total Deal Value',
      format: 'currency',
      change: null,
    },
    closedDealsValue: {
      value: stats.averageDealSize * (stats.totalOpportunities - stats.activeOpportunities),
      label: 'Closed Deals Value',
      format: 'currency',
      percentage: stats.totalOpportunities > 0
        ? Math.round(((stats.totalOpportunities - stats.activeOpportunities) / stats.totalOpportunities) * 100)
        : 0,
    },
    conversionRate: {
      value: stats.conversionRate,
      label: 'Conversion Rate',
      unit: '%',
      change: null,
    },
  };
}

/**
 * Get demo quick insights
 */
export function getDemoQuickInsights() {
  return [
    {
      type: 'success' as const,
      title: 'Excellent Performance',
      message: 'Your team has a 92% average call success rate this month',
    },
    {
      type: 'info' as const,
      title: 'High Activity',
      message: '12 reference calls scheduled for this week',
    },
    {
      type: 'success' as const,
      title: 'Strong Pipeline',
      message: '18 active opportunities worth $810,000 in potential revenue',
    },
  ];
}
