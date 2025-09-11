/**
 * Dashboard Service
 *
 * Provides role-specific data and metrics for dashboard layouts.
 * Handles data aggregation and filtering based on user roles.
 */

import { supabase } from '@/lib/supabase';
import { User, Advocate, Opportunity, ReferenceCall } from '@/types/database';

export interface DashboardStats {
  totalAdvocates: number;
  activeAdvocates: number;
  totalOpportunities: number;
  openOpportunities: number;
  totalReferenceCalls: number;
  upcomingCalls: number;
  completedCalls: number;
  averageCallRating: number;
  totalDealValue: number;
  closedDealsValue: number;
}

export interface RecentActivity {
  id: string;
  type:
    | 'advocate_registered'
    | 'opportunity_created'
    | 'call_scheduled'
    | 'call_completed'
    | 'deal_closed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
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

export interface TopPerformingAdvocate {
  id: string;
  name: string;
  company_name: string;
  total_calls_completed: number;
  average_rating: number;
  total_rewards_earned: number;
  availability_score: number;
}

export interface OpportunityPipeline {
  stage: string;
  count: number;
  total_value: number;
  average_value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  upcomingCalls: UpcomingCall[];
  topPerformingAdvocates: TopPerformingAdvocate[];
  opportunityPipeline: OpportunityPipeline[];
}

/**
 * Get dashboard data for a specific user role and company
 */
export async function getDashboardData(
  userId: string,
  companyId: string,
  userRole: string
): Promise<DashboardData> {
  try {
    // Get basic stats with fallback
    const stats = await getDashboardStats(companyId, userRole).catch((err) => {
      console.warn('Failed to fetch dashboard stats:', err);
      return {
        totalAdvocates: 0,
        activeAdvocates: 0,
        totalOpportunities: 0,
        openOpportunities: 0,
        totalReferenceCalls: 0,
        upcomingCalls: 0,
        completedCalls: 0,
        averageCallRating: 0,
        totalDealValue: 0,
        closedDealsValue: 0,
      };    });

    // Get recent activity with fallback
    const recentActivity = await getRecentActivity(companyId, userRole).catch(
      (err) => {
        console.warn('Failed to fetch recent activity:', err);
        return [];
      }
    );

    // Get upcoming calls with fallback
    const upcomingCalls = await getUpcomingCalls(companyId, userRole).catch(
      (err) => {
        console.warn('Failed to fetch upcoming calls:', err);
        return [];
      }
    );

    // Get top performing advocates with fallback
    const topPerformingAdvocates = await getTopPerformingAdvocates(
      companyId,
      userRole
    ).catch((err) => {
      console.warn('Failed to fetch top advocates:', err);
      return [];
    });

    // Get opportunity pipeline with fallback
    const opportunityPipeline = await getOpportunityPipeline(
      companyId,
      userRole
    ).catch((err) => {
      console.warn('Failed to fetch opportunity pipeline:', err);
      return [];
    });

    return {
      stats,
      recentActivity,
      upcomingCalls,
      topPerformingAdvocates,
      opportunityPipeline,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty dashboard data instead of throwing
    return {
      stats: {
        totalAdvocates: 0,
        activeAdvocates: 0,
        totalOpportunities: 0,
        openOpportunities: 0,
        totalReferenceCalls: 0,
        upcomingCalls: 0,
        completedCalls: 0,
        averageCallRating: 0,
        totalDealValue: 0,
        closedDealsValue: 0,      },
      recentActivity: [],
      upcomingCalls: [],
      topPerformingAdvocates: [],
      opportunityPipeline: [],
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
  const [
    advocatesResult,
    opportunitiesResult,
    referenceCallsResult,
    dealValueResult,
  ] = await Promise.all([
    // Advocates stats
    supabase
      .from('advocates')
      .select('id, status, availability_score')
      .eq('company_id', companyId),

    // Opportunities stats
    supabase
      .from('opportunities')
      .select('id, deal_stage, deal_value, probability')
      .eq('company_id', companyId),

    // Reference calls stats
    supabase
      .from('reference_calls')
      .select('id, status, scheduled_at, actual_start_time, advocate_rating')
      .eq('company_id', companyId),

    // Deal value stats
    supabase
      .from('opportunities')
      .select('deal_value, deal_stage')
      .eq('company_id', companyId)
      .not('deal_value', 'is', null),
  ]);

  if (advocatesResult.error) throw advocatesResult.error;
  if (opportunitiesResult.error) throw opportunitiesResult.error;
  if (referenceCallsResult.error) throw referenceCallsResult.error;
  if (dealValueResult.error) throw dealValueResult.error;

  const advocates = advocatesResult.data;
  const opportunities = opportunitiesResult.data;
  const referenceCalls = referenceCallsResult.data;
  const dealValues = dealValueResult.data;

  // Calculate advocate stats
  const totalAdvocates = advocates.length;
  const activeAdvocates = advocates.filter((a) => a.status === 'active').length;

  // Calculate opportunity stats
  const totalOpportunities = opportunities.length;
  const openOpportunities = opportunities.filter(
    (o) => !['closed_won', 'closed_lost'].includes(o.deal_stage)
  ).length;

  // Calculate reference call stats
  const totalReferenceCalls = referenceCalls.length;
  const upcomingCalls = referenceCalls.filter(
    (c) =>
      c.status === 'scheduled' &&
      c.scheduled_at &&
      new Date(c.scheduled_at) > new Date()
  ).length;
  const completedCalls = referenceCalls.filter(
    (c) => c.status === 'completed'
  ).length;

  const ratings = referenceCalls
    .filter((c) => c.advocate_rating !== null)
    .map((c) => c.advocate_rating);
  const averageCallRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  // Calculate deal value stats
  const totalDealValue = dealValues.reduce(
    (sum, deal) => sum + (deal.deal_value || 0),
    0
  );
  const closedDealsValue = dealValues
    .filter((deal) => deal.deal_stage === 'closed_won')
    .reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

  return {
    totalAdvocates,
    activeAdvocates,
    totalOpportunities,
    openOpportunities,
    totalReferenceCalls,
    upcomingCalls,
    completedCalls,
    averageCallRating: Math.round(averageCallRating * 10) / 10,
    totalDealValue,
    closedDealsValue,
  };
}

/**
 * Get recent activity
 */
async function getRecentActivity(
  companyId: string,
  userRole: string
): Promise<RecentActivity[]> {
  const activities: RecentActivity[] = [];

  try {
    // Get recent advocates
    const advocatesResult = await supabase
      .from('advocates')
      .select('id, name, company_name, created_at')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!advocatesResult.error && advocatesResult.data) {
      advocatesResult.data.forEach((advocate) => {
        activities.push({
          id: `advocate-${advocate.id}`,
          type: 'advocate_registered',
          title: 'New Advocate Registered',
          description: `${advocate.name} from ${advocate.company_name} joined the program`,
          timestamp: advocate.created_at,
          metadata: { advocateId: advocate.id },
        });
      });
    }

    // Get recent opportunities
    const opportunitiesResult = await supabase
      .from('opportunities')
      .select('id, opportunity_name, prospect_company, created_at')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!opportunitiesResult.error && opportunitiesResult.data) {
      opportunitiesResult.data.forEach((opportunity) => {
        activities.push({
          id: `opportunity-${opportunity.id}`,
          type: 'opportunity_created',
          title: 'New Opportunity Created',
          description: `${opportunity.opportunity_name} for ${opportunity.prospect_company}`,
          timestamp: opportunity.created_at,
          metadata: { opportunityId: opportunity.id },
        });
      });
    }

    // Get recent reference calls
    const callsResult = await supabase
      .from('reference_calls')
      .select(
        `
        id, 
        scheduled_at, 
        actual_start_time, 
        status,
        opportunities!inner(opportunity_name, prospect_company),
        advocates!inner(name)
      `
      )
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!callsResult.error && callsResult.data) {
      callsResult.data.forEach((call) => {
        const opportunity = call.opportunities;
        const advocate = call.advocates;

        if (call.status === 'completed') {
          activities.push({
            id: `call-completed-${call.id}`,
            type: 'call_completed',
            title: 'Reference Call Completed',
            description: `Call between ${advocate?.[0]?.name || "Unknown"} and ${opportunity?.[0]?.prospect_company || "Unknown"} completed`,
            timestamp: call.actual_start_time || call.scheduled_at,
            metadata: { callId: call.id },
          });
        } else if (call.status === 'scheduled') {
          activities.push({
            id: `call-scheduled-${call.id}`,
            type: 'call_scheduled',
            title: 'Reference Call Scheduled',
            description: `Call scheduled between ${advocate?.[0]?.name || "Unknown"} and ${opportunity?.[0]?.prospect_company || "Unknown"}`,
            timestamp: call.scheduled_at,
            metadata: { callId: call.id },
          });
        }
      });
    }

    // Sort by timestamp and return top 10
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
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
    const { data, error } = await supabase
      .from('reference_calls')
      .select(
        `
        id,
        scheduled_at,
        duration_minutes,
        meeting_platform,
        meeting_link,
        opportunities!inner(opportunity_name, prospect_company),
        advocates!inner(name)
      `
      )
      .eq('company_id', companyId)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10);

    if (error) throw error;

    return data.map((call) => ({
      id: call.id,
      opportunity_name:
        call.opportunities?.[0]?.opportunity_name || 'Unknown Opportunity',
      prospect_company:
        call.opportunities?.[0]?.prospect_company || 'Unknown Company',
      advocate_name: call.advocates?.[0]?.name || 'Unknown Advocate',
      scheduled_at: call.scheduled_at,
      duration_minutes: call.duration_minutes || 30,
      meeting_platform: call.meeting_platform || 'Zoom',
      meeting_link: call.meeting_link,
    }));
  } catch (error) {
    console.error('Error fetching upcoming calls:', error);
    return [];
  }
}

/**
 * Get top performing advocates
 */
async function getTopPerformingAdvocates(
  companyId: string,
  userRole: string
): Promise<TopPerformingAdvocate[]> {
  try {
    const { data, error } = await supabase
      .from('advocates')
      .select(
        `
        id,
        name,
        company_name,
        total_calls_completed,
        average_rating,
        total_rewards_earned,
        availability_score
      `
      )
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('total_calls_completed', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data.map((advocate) => ({
      id: advocate.id,
      name: advocate.name,
      company_name: advocate.company_name,
      total_calls_completed: advocate.total_calls_completed || 0,
      average_rating: advocate.average_rating || 0,
      total_rewards_earned: advocate.total_rewards_earned || 0,
      availability_score: advocate.availability_score || 0,
    }));
  } catch (error) {
    console.error('Error fetching top performing advocates:', error);
    return [];
  }
}

/**
 * Get opportunity pipeline data
 */
async function getOpportunityPipeline(
  companyId: string,
  userRole: string
): Promise<OpportunityPipeline[]> {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('deal_stage, deal_value')
      .eq('company_id', companyId)
      .not('deal_stage', 'is', null);

    if (error) throw error;

    // Group by deal stage
    const stageGroups = data.reduce(
      (acc, opportunity) => {
        const stage = opportunity.deal_stage;
        if (!acc[stage]) {
          acc[stage] = {
            count: 0,
            total_value: 0,
            opportunities: [],
          };
        }
        acc[stage].count++;
        acc[stage].total_value += opportunity.deal_value || 0;
        acc[stage].opportunities.push(opportunity);
        return acc;
      },
      {} as Record<
        string,
        { count: number; total_value: number; opportunities: any[] }
      >
    );

    // Convert to pipeline format
    return Object.entries(stageGroups).map(([stage, data]) => ({
      stage,
      count: data.count,
      total_value: data.total_value,
      average_value: data.count > 0 ? data.total_value / data.count : 0,
    }));
  } catch (error) {
    console.error('Error fetching opportunity pipeline:', error);
    return [];
  }
}
