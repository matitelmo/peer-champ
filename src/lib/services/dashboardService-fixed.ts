/**
 * Dashboard Service
 *
 * Service functions for dashboard data management and analytics.
 * Handles data fetching, caching, and error management for dashboard components.
 */

import { supabase } from '@/lib/supabase';

// Types
export interface DashboardStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalAdvocates: number;
  activeAdvocates: number;
  totalCalls: number;
  upcomingCalls: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface UpcomingCall {
  id: string;
  opportunity_name: string;
  prospect_company: string;
  advocate_name: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_platform: string;
  meeting_link?: string;
}

export interface TopAdvocate {
  id: string;
  name: string;
  total_calls: number;
  success_rate: number;
  average_rating: number;
}

export interface RecentActivity {
  id: string;
  type: 'call' | 'opportunity' | 'advocate';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingCalls: UpcomingCall[];
  topAdvocates: TopAdvocate[];
  recentActivity: RecentActivity[];
}

/**
 * Get dashboard data for a specific company and user role
 */
export async function getDashboardData(
  companyId: string,
  userRole: string
): Promise<DashboardData> {
  try {
    const [stats, upcomingCalls, topAdvocates, recentActivity] = await Promise.all([
      getDashboardStats(companyId, userRole),
      getUpcomingCalls(companyId, userRole),
      getTopPerformingAdvocates(companyId, userRole),
      getRecentActivity(companyId, userRole),
    ]);

    return {
      stats,
      upcomingCalls,
      topAdvocates,
      recentActivity,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty dashboard data instead of throwing
    return {
      stats: {
        totalOpportunities: 0,
        activeOpportunities: 0,
        totalAdvocates: 0,
        activeAdvocates: 0,
        totalCalls: 0,
        upcomingCalls: 0,
        conversionRate: 0,
        averageDealSize: 0,
      },
      upcomingCalls: [],
      topAdvocates: [],
      recentActivity: [],
    };
  }
}

/**
 * Get dashboard statistics
 */
async function getDashboardStats(
  companyId: string,
  userRole: string
): Promise<DashboardStats> {
  try {
    // Check if tables exist by trying to query them
    const [opportunitiesResult, advocatesResult, callsResult] = await Promise.allSettled([
      supabase
        .from('opportunities')
        .select('id, status, estimated_value')
        .eq('company_id', companyId),
      supabase
        .from('advocates')
        .select('id, status')
        .eq('company_id', companyId),
      supabase
        .from('reference_calls')
        .select('id, status')
        .eq('company_id', companyId),
    ]);

    const opportunities = opportunitiesResult.status === 'fulfilled' ? opportunitiesResult.value.data || [] : [];
    const advocates = advocatesResult.status === 'fulfilled' ? advocatesResult.value.data || [] : [];
    const calls = callsResult.status === 'fulfilled' ? callsResult.value.data || [] : [];

    const totalOpportunities = opportunities.length;
    const activeOpportunities = opportunities.filter((opp: any) => opp.status === 'active').length;
    const totalAdvocates = advocates.length;
    const activeAdvocates = advocates.filter((adv: any) => adv.status === 'active').length;
    const totalCalls = calls.length;
    const upcomingCalls = calls.filter((call: any) => call.status === 'scheduled').length;

    // Calculate conversion rate (simplified)
    const conversionRate = totalOpportunities > 0 ? (activeOpportunities / totalOpportunities) * 100 : 0;

    // Calculate average deal size
    const totalValue = opportunities.reduce((sum: number, opp: any) => sum + (opp.estimated_value || 0), 0);
    const averageDealSize = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;

    return {
      totalOpportunities,
      activeOpportunities,
      totalAdvocates,
      activeAdvocates,
      totalCalls,
      upcomingCalls,
      conversionRate,
      averageDealSize,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalOpportunities: 0,
      activeOpportunities: 0,
      totalAdvocates: 0,
      activeAdvocates: 0,
      totalCalls: 0,
      upcomingCalls: 0,
      conversionRate: 0,
      averageDealSize: 0,
    };
  }
}

/**
 * Get upcoming calls
 */
async function getUpcomingCalls(
  companyId: string,
  userRole: string
): Promise<UpcomingCall[]> {
  try {
    // First check if the table exists
    const { data, error } = await supabase
      .from('reference_calls')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Reference calls table not found or accessible:', error.message);
      return [];
    }

    // If table exists, try to get the full data
    const { data: callsData, error: callsError } = await supabase
      .from('reference_calls')
      .select(`
        id,
        scheduled_at,
        duration_minutes,
        meeting_platform,
        meeting_link,
        opportunities(opportunity_name, prospect_company),
        advocates(name)
      `)
      .eq('company_id', companyId)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10);

    if (callsError) {
      console.warn('Error fetching upcoming calls:', callsError.message);
      return [];
    }

    return (callsData || []).map((call: any) => ({
      id: call.id,
      opportunity_name: call.opportunities?.opportunity_name || 'Unknown Opportunity',
      prospect_company: call.opportunities?.prospect_company || 'Unknown Company',
      advocate_name: call.advocates?.name || 'Unknown Advocate',
      scheduled_at: call.scheduled_at,
      duration_minutes: call.duration_minutes || 30,
      meeting_platform: call.meeting_platform || 'Zoom',
      meeting_link: call.meeting_link,
    }));
  } catch (error) {
    console.warn('Error fetching upcoming calls:', error);
    return [];
  }
}

/**
 * Get top performing advocates
 */
async function getTopPerformingAdvocates(
  companyId: string,
  userRole: string
): Promise<TopAdvocate[]> {
  try {
    // Check if advocates table exists
    const { data, error } = await supabase
      .from('advocates')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Advocates table not found or accessible:', error.message);
      return [];
    }

    // For now, return mock data since we don't have call history yet
    return [
      {
        id: '1',
        name: 'John Smith',
        total_calls: 12,
        success_rate: 85,
        average_rating: 4.8,
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        total_calls: 8,
        success_rate: 75,
        average_rating: 4.6,
      },
      {
        id: '3',
        name: 'Mike Davis',
        total_calls: 15,
        success_rate: 90,
        average_rating: 4.9,
      },
    ];
  } catch (error) {
    console.warn('Error fetching top advocates:', error);
    return [];
  }
}

/**
 * Get recent activity
 */
async function getRecentActivity(
  companyId: string,
  userRole: string
): Promise<RecentActivity[]> {
  try {
    // Return mock data for now since we don't have activity tracking yet
    return [
      {
        id: '1',
        type: 'call',
        title: 'Reference call completed',
        description: 'Call with Acme Corp completed successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'completed',
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'New opportunity created',
        description: 'Opportunity "Enterprise Deal" created for TechCorp',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: 'active',
      },
      {
        id: '3',
        type: 'advocate',
        title: 'Advocate registered',
        description: 'New advocate John Smith joined the platform',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        status: 'active',
      },
    ];
  } catch (error) {
    console.warn('Error fetching recent activity:', error);
    return [];
  }
}
