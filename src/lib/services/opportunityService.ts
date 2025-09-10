/**
 * Opportunity Service
 *
 * Service functions for managing opportunity data and operations.
 * Handles CRUD operations, filtering, and opportunity-advocate matching.
 */

import { supabase } from '@/lib/supabase';
import { Opportunity, CompanySize } from '@/types/database';

export interface CreateOpportunityData {
  prospect_company: string;
  prospect_contact_name?: string;
  prospect_contact_email?: string;
  prospect_contact_title?: string;
  prospect_phone?: string;
  prospect_website?: string;
  prospect_industry?: string;
  prospect_size?: CompanySize;
  geographic_region?: string;
  opportunity_name: string;
  use_case?: string;
  product_interest?: string[];
  technical_requirements?: string[];
  business_challenges?: string[];
  deal_value?: number;
  currency?: string;
  deal_stage?:
    | 'discovery'
    | 'qualification'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  probability?: number;
  expected_close_date?: string;
  reference_request_status?:
    | 'not_requested'
    | 'requested'
    | 'in_progress'
    | 'completed'
    | 'declined';
  reference_urgency?: 'low' | 'medium' | 'high' | 'urgent';
  reference_type_needed?:
    | 'general'
    | 'technical'
    | 'executive'
    | 'peer_to_peer'
    | 'roi_focused';
  desired_advocate_industry?: string;
  desired_advocate_size?: CompanySize;
  desired_advocate_region?: string;
  desired_use_cases?: string[];
  desired_expertise_areas?: string[];
  external_crm_id?: string;
  external_crm_type?: 'salesforce' | 'hubspot' | 'pipedrive' | 'other';
  external_crm_url?: string;
  reference_needed_by?: string;
  follow_up_date?: string;
  internal_notes?: string;
  sales_notes?: string;
  competitive_situation?: string;
  decision_criteria?: string[];
  key_stakeholders?: string[];
  tags?: string[];
  priority_score?: number;
}

export interface UpdateOpportunityData extends Partial<CreateOpportunityData> {
  last_activity_date?: string;
}

export interface OpportunityFilters {
  deal_stage?: string[];
  reference_request_status?: string[];
  reference_urgency?: string[];
  prospect_industry?: string[];
  prospect_size?: CompanySize[];
  geographic_region?: string[];
  sales_rep_id?: string[];
  tags?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
  deal_value_min?: number;
  deal_value_max?: number;
}

/**
 * Create a new opportunity
 */
export const createOpportunity = async (
  opportunityData: CreateOpportunityData
): Promise<Opportunity> => {
  const { data, error } = await supabase
    .from('opportunities')
    .insert({
      ...opportunityData,
      company_id: await getCurrentUserCompanyId(),
      sales_rep_id: await getCurrentUserId(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create opportunity: ${error.message}`);
  }

  return data;
};

/**
 * Get all opportunities for the current user's company
 */
export const getOpportunities = async (
  filters?: OpportunityFilters
): Promise<Opportunity[]> => {
  const companyId = await getCurrentUserCompanyId();

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters) {
    if (filters.deal_stage && filters.deal_stage.length > 0) {
      query = query.in('deal_stage', filters.deal_stage);
    }

    if (
      filters.reference_request_status &&
      filters.reference_request_status.length > 0
    ) {
      query = query.in(
        'reference_request_status',
        filters.reference_request_status
      );
    }

    if (filters.reference_urgency && filters.reference_urgency.length > 0) {
      query = query.in('reference_urgency', filters.reference_urgency);
    }

    if (filters.prospect_industry && filters.prospect_industry.length > 0) {
      query = query.in('prospect_industry', filters.prospect_industry);
    }

    if (filters.prospect_size && filters.prospect_size.length > 0) {
      query = query.in('prospect_size', filters.prospect_size);
    }

    if (filters.geographic_region && filters.geographic_region.length > 0) {
      query = query.in('geographic_region', filters.geographic_region);
    }

    if (filters.sales_rep_id && filters.sales_rep_id.length > 0) {
      query = query.in('sales_rep_id', filters.sales_rep_id);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.deal_value_min !== undefined) {
      query = query.gte('deal_value', filters.deal_value_min);
    }

    if (filters.deal_value_max !== undefined) {
      query = query.lte('deal_value', filters.deal_value_max);
    }

    if (filters.date_from) {
      query = query.gte('created_date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_date', filters.date_to);
    }

    if (filters.search) {
      query = query.or(
        `prospect_company.ilike.%${filters.search}%,opportunity_name.ilike.%${filters.search}%,prospect_contact_name.ilike.%${filters.search}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch opportunities: ${error.message}`);
  }

  return data || [];
};

/**
 * Get a single opportunity by ID
 */
export const getOpportunity = async (
  id: string
): Promise<Opportunity | null> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch opportunity: ${error.message}`);
  }

  return data;
};

/**
 * Update an opportunity
 */
export const updateOpportunity = async (
  id: string,
  updates: UpdateOpportunityData
): Promise<Opportunity> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('opportunities')
    .update(updates)
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update opportunity: ${error.message}`);
  }

  return data;
};

/**
 * Delete an opportunity
 */
export const deleteOpportunity = async (id: string): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('opportunities')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to delete opportunity: ${error.message}`);
  }
};

/**
 * Update opportunity reference request status
 */
export const updateReferenceRequestStatus = async (
  id: string,
  status:
    | 'not_requested'
    | 'requested'
    | 'in_progress'
    | 'completed'
    | 'declined'
): Promise<Opportunity> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('opportunities')
    .update({
      reference_request_status: status,
      last_activity_date: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update reference request status: ${error.message}`
    );
  }

  return data;
};

/**
 * Get opportunity statistics
 */
export const getOpportunityStats = async (): Promise<{
  total: number;
  byStage: Record<string, number>;
  byReferenceStatus: Record<string, number>;
  totalValue: number;
  averageValue: number;
  referenceRequests: number;
  completedReferences: number;
}> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('opportunities')
    .select('deal_stage, reference_request_status, deal_value')
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to fetch opportunity stats: ${error.message}`);
  }

  const stats = {
    total: data.length,
    byStage: {} as Record<string, number>,
    byReferenceStatus: {} as Record<string, number>,
    totalValue: 0,
    averageValue: 0,
    referenceRequests: 0,
    completedReferences: 0,
  };

  data.forEach((opportunity) => {
    // Count by stage
    const stage = opportunity.deal_stage || 'unknown';
    stats.byStage[stage] = (stats.byStage[stage] || 0) + 1;

    // Count by reference status
    const refStatus = opportunity.reference_request_status || 'not_requested';
    stats.byReferenceStatus[refStatus] =
      (stats.byReferenceStatus[refStatus] || 0) + 1;

    // Sum deal values
    if (opportunity.deal_value) {
      stats.totalValue += opportunity.deal_value;
    }

    // Count reference requests
    if (refStatus !== 'not_requested') {
      stats.referenceRequests++;
    }

    // Count completed references
    if (refStatus === 'completed') {
      stats.completedReferences++;
    }
  });

  stats.averageValue = stats.total > 0 ? stats.totalValue / stats.total : 0;

  return stats;
};

/**
 * Get opportunities needing references
 */
export const getOpportunitiesNeedingReferences = async (): Promise<
  Opportunity[]
> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('company_id', companyId)
    .in('reference_request_status', ['requested', 'in_progress'])
    .order('reference_urgency', { ascending: false })
    .order('expected_close_date', { ascending: true });

  if (error) {
    throw new Error(
      `Failed to fetch opportunities needing references: ${error.message}`
    );
  }

  return data || [];
};

/**
 * Helper function to get current user's company ID
 */
const getCurrentUserCompanyId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single();

  if (!userData) {
    throw new Error('User not found in database');
  }

  return userData.company_id;
};

/**
 * Helper function to get current user ID
 */
const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user.id;
};
