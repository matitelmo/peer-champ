/**
 * Database Access Utility Functions
 *
 * This file contains utility functions for database operations with proper
 * type safety, error handling, and RLS compliance. All functions respect
 * the multi-tenant architecture and Row Level Security policies.
 */

import { supabase } from './supabase';
import type {
  Company,
  User,
  Advocate,
  Opportunity,
  ReferenceCall,
  // InsertCompany,
  UpdateCompany,
  InsertUser,
  UpdateUser,
  InsertAdvocate,
  UpdateAdvocate,
  InsertOpportunity,
  UpdateOpportunity,
  InsertReferenceCall,
  UpdateReferenceCall,
  DatabaseResponse,
  DatabaseListResponse,
  QueryOptions,
  AdvocateFilters,
  OpportunityFilters,
  ReferenceCallFilters,
} from '../types';

// ============================================================================
// ERROR HANDLING
// ============================================================================

class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// const handleDatabaseError = (error: unknown, operation: string): never => {
//   console.error(`Database error during ${operation}:`, error);
//   throw new DatabaseError(`Failed to ${operation}`, error);
// };

// ============================================================================
// COMPANY OPERATIONS
// ============================================================================

export const getCompany = async (
  id: string
): Promise<DatabaseResponse<Company>> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getCurrentUserCompany = async (): Promise<
  DatabaseResponse<Company>
> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('No authenticated user') };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!userData?.company_id) {
      return { data: null, error: new Error('User has no associated company') };
    }

    return getCompany(userData.company_id);
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateCompany = async (
  id: string,
  updates: UpdateCompany
): Promise<DatabaseResponse<Company>> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const getUser = async (id: string): Promise<DatabaseResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getUsersByCompany = async (
  companyId?: string,
  options: QueryOptions = {}
): Promise<DatabaseListResponse<User>> => {
  try {
    let query = supabase.from('users').select('*', { count: 'exact' });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (options.limit) query = query.limit(options.limit);
    if (options.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection === 'asc',
      });
    }

    const { data, error, count } = await query;

    return { data: data || [], error, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

export const createUser = async (
  user: InsertUser
): Promise<DatabaseResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateUser = async (
  id: string,
  updates: UpdateUser
): Promise<DatabaseResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// ============================================================================
// ADVOCATE OPERATIONS
// ============================================================================

export const getAdvocate = async (
  id: string
): Promise<DatabaseResponse<Advocate>> => {
  try {
    const { data, error } = await supabase
      .from('advocates')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getAdvocates = async (
  filters: AdvocateFilters = {},
  options: QueryOptions = {}
): Promise<DatabaseListResponse<Advocate>> => {
  try {
    let query = supabase.from('advocates').select('*', { count: 'exact' });

    // Apply filters
    if (filters.company_id) query = query.eq('company_id', filters.company_id);
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }
    if (filters.industry) query = query.eq('industry', filters.industry);
    if (filters.company_size)
      query = query.eq('company_size', filters.company_size);
    if (filters.geographic_region)
      query = query.eq('geographic_region', filters.geographic_region);
    if (filters.availability_score_min) {
      query = query.gte('availability_score', filters.availability_score_min);
    }
    if (filters.use_cases?.length) {
      query = query.overlaps('use_cases', filters.use_cases);
    }
    if (filters.expertise_areas?.length) {
      query = query.overlaps('expertise_areas', filters.expertise_areas);
    }
    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags);
    }

    // Apply options
    if (options.limit) query = query.limit(options.limit);
    if (options.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection === 'asc',
      });
    } else {
      // Default sort by availability score descending
      query = query.order('availability_score', { ascending: false });
    }

    const { data, error, count } = await query;

    return { data: data || [], error, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

export const createAdvocate = async (
  advocate: InsertAdvocate
): Promise<DatabaseResponse<Advocate>> => {
  try {
    const { data, error } = await supabase
      .from('advocates')
      .insert(advocate)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateAdvocate = async (
  id: string,
  updates: UpdateAdvocate
): Promise<DatabaseResponse<Advocate>> => {
  try {
    const { data, error } = await supabase
      .from('advocates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const deleteAdvocate = async (
  id: string
): Promise<DatabaseResponse<null>> => {
  try {
    const { error } = await supabase.from('advocates').delete().eq('id', id);

    return { data: null, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// ============================================================================
// OPPORTUNITY OPERATIONS
// ============================================================================

export const getOpportunity = async (
  id: string
): Promise<DatabaseResponse<Opportunity>> => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getOpportunities = async (
  filters: OpportunityFilters = {},
  options: QueryOptions = {}
): Promise<DatabaseListResponse<Opportunity>> => {
  try {
    let query = supabase.from('opportunities').select('*', { count: 'exact' });

    // Apply filters
    if (filters.company_id) query = query.eq('company_id', filters.company_id);
    if (filters.sales_rep_id)
      query = query.eq('sales_rep_id', filters.sales_rep_id);
    if (filters.deal_stage) {
      if (Array.isArray(filters.deal_stage)) {
        query = query.in('deal_stage', filters.deal_stage);
      } else {
        query = query.eq('deal_stage', filters.deal_stage);
      }
    }
    if (filters.reference_request_status) {
      if (Array.isArray(filters.reference_request_status)) {
        query = query.in(
          'reference_request_status',
          filters.reference_request_status
        );
      } else {
        query = query.eq(
          'reference_request_status',
          filters.reference_request_status
        );
      }
    }
    if (filters.reference_urgency) {
      if (Array.isArray(filters.reference_urgency)) {
        query = query.in('reference_urgency', filters.reference_urgency);
      } else {
        query = query.eq('reference_urgency', filters.reference_urgency);
      }
    }
    if (filters.prospect_industry)
      query = query.eq('prospect_industry', filters.prospect_industry);
    if (filters.prospect_size)
      query = query.eq('prospect_size', filters.prospect_size);
    if (filters.expected_close_date_before) {
      query = query.lte(
        'expected_close_date',
        filters.expected_close_date_before
      );
    }
    if (filters.expected_close_date_after) {
      query = query.gte(
        'expected_close_date',
        filters.expected_close_date_after
      );
    }
    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags);
    }

    // Apply options
    if (options.limit) query = query.limit(options.limit);
    if (options.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection === 'asc',
      });
    } else {
      // Default sort by priority score descending, then by created date
      query = query
        .order('priority_score', { ascending: false })
        .order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    return { data: data || [], error, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

export const createOpportunity = async (
  opportunity: InsertOpportunity
): Promise<DatabaseResponse<Opportunity>> => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .insert(opportunity)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateOpportunity = async (
  id: string,
  updates: UpdateOpportunity
): Promise<DatabaseResponse<Opportunity>> => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const deleteOpportunity = async (
  id: string
): Promise<DatabaseResponse<null>> => {
  try {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    return { data: null, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// ============================================================================
// REFERENCE CALL OPERATIONS
// ============================================================================

export const getReferenceCall = async (
  id: string
): Promise<DatabaseResponse<ReferenceCall>> => {
  try {
    const { data, error } = await supabase
      .from('reference_calls')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getReferenceCalls = async (
  filters: ReferenceCallFilters = {},
  options: QueryOptions = {}
): Promise<DatabaseListResponse<ReferenceCall>> => {
  try {
    let query = supabase
      .from('reference_calls')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.advocate_id)
      query = query.eq('advocate_id', filters.advocate_id);
    if (filters.sales_rep_id)
      query = query.eq('sales_rep_id', filters.sales_rep_id);
    if (filters.opportunity_id)
      query = query.eq('opportunity_id', filters.opportunity_id);
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }
    if (filters.call_outcome) {
      if (Array.isArray(filters.call_outcome)) {
        query = query.in('call_outcome', filters.call_outcome);
      } else {
        query = query.eq('call_outcome', filters.call_outcome);
      }
    }
    if (filters.deal_impact) {
      if (Array.isArray(filters.deal_impact)) {
        query = query.in('deal_impact', filters.deal_impact);
      } else {
        query = query.eq('deal_impact', filters.deal_impact);
      }
    }
    if (filters.scheduled_after) {
      query = query.gte('scheduled_at', filters.scheduled_after);
    }
    if (filters.scheduled_before) {
      query = query.lte('scheduled_at', filters.scheduled_before);
    }
    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags);
    }

    // Apply options
    if (options.limit) query = query.limit(options.limit);
    if (options.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection === 'asc',
      });
    } else {
      // Default sort by scheduled date descending
      query = query.order('scheduled_at', { ascending: false });
    }

    const { data, error, count } = await query;

    return { data: data || [], error, count: count || 0 };
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

export const createReferenceCall = async (
  call: InsertReferenceCall
): Promise<DatabaseResponse<ReferenceCall>> => {
  try {
    const { data, error } = await supabase
      .from('reference_calls')
      .insert(call)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateReferenceCall = async (
  id: string,
  updates: UpdateReferenceCall
): Promise<DatabaseResponse<ReferenceCall>> => {
  try {
    const { data, error } = await supabase
      .from('reference_calls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const deleteReferenceCall = async (
  id: string
): Promise<DatabaseResponse<null>> => {
  try {
    const { error } = await supabase
      .from('reference_calls')
      .delete()
      .eq('id', id);

    return { data: null, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// ============================================================================
// ADVANCED QUERIES
// ============================================================================

/**
 * Find advocates that match opportunity requirements
 */
export const findMatchingAdvocates = async (
  opportunityId: string,
  limit: number = 10
): Promise<DatabaseListResponse<Advocate>> => {
  try {
    // First get the opportunity details
    const { data: opportunity } = await getOpportunity(opportunityId);

    if (!opportunity) {
      return { data: [], error: new Error('Opportunity not found') };
    }

    const filters: AdvocateFilters = {
      company_id: opportunity.company_id,
      status: ['active'],
      availability_score_min: 50, // Minimum availability threshold
    };

    // Add matching criteria from opportunity
    if (opportunity.desired_advocate_industry) {
      filters.industry = opportunity.desired_advocate_industry;
    }
    if (opportunity.desired_advocate_size) {
      filters.company_size = opportunity.desired_advocate_size;
    }
    if (opportunity.desired_advocate_region) {
      filters.geographic_region = opportunity.desired_advocate_region;
    }
    if (opportunity.desired_use_cases?.length) {
      filters.use_cases = opportunity.desired_use_cases;
    }
    if (opportunity.desired_expertise_areas?.length) {
      filters.expertise_areas = opportunity.desired_expertise_areas;
    }

    return getAdvocates(filters, {
      limit,
      orderBy: 'availability_score',
      orderDirection: 'desc',
    });
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

/**
 * Get upcoming reference calls for a user
 */
export const getUpcomingCalls = async (
  userId: string,
  limit: number = 20
): Promise<DatabaseListResponse<ReferenceCall>> => {
  const filters: ReferenceCallFilters = {
    status: ['scheduled', 'confirmed'],
    scheduled_after: new Date().toISOString(),
  };

  // Check if user is an advocate
  const { data: advocates } = await getAdvocates({ company_id: undefined }); // Will be filtered by RLS
  const userAdvocate = advocates.find((a) => a.user_id === userId);

  if (userAdvocate) {
    filters.advocate_id = userAdvocate.id;
  } else {
    filters.sales_rep_id = userId;
  }

  return getReferenceCalls(filters, {
    limit,
    orderBy: 'scheduled_at',
    orderDirection: 'asc',
  });
};

/**
 * Get call history for an advocate
 */
export const getAdvocateCallHistory = async (
  advocateId: string,
  limit: number = 50
): Promise<DatabaseListResponse<ReferenceCall>> => {
  return getReferenceCalls(
    {
      advocate_id: advocateId,
      status: ['completed', 'cancelled', 'no_show'],
    },
    {
      limit,
      orderBy: 'actual_start_time',
      orderDirection: 'desc',
    }
  );
};

/**
 * Get dashboard statistics for current user's company
 */
export const getDashboardStats = async () => {
  try {
    const { data: company } = await getCurrentUserCompany();

    if (!company) {
      throw new Error('No company found for user');
    }

    const [
      { count: totalAdvocates },
      { count: activeOpportunities },
      { count: scheduledCalls },
      { count: completedCallsThisMonth },
    ] = await Promise.all([
      getAdvocates({ company_id: company.id }),
      getOpportunities({
        company_id: company.id,
        deal_stage: ['discovery', 'qualification', 'proposal', 'negotiation'],
      }),
      getReferenceCalls({
        status: ['scheduled', 'confirmed'],
        scheduled_after: new Date().toISOString(),
      }),
      getReferenceCalls({
        status: ['completed'],
        scheduled_after: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString(),
      }),
    ]);

    return {
      data: {
        totalAdvocates: totalAdvocates || 0,
        activeOpportunities: activeOpportunities || 0,
        scheduledCalls: scheduledCalls || 0,
        completedCallsThisMonth: completedCallsThisMonth || 0,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};
