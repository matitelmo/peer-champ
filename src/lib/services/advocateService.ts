/**
 * Advocate Service
 *
 * Service functions for managing advocate data and operations.
 * Handles CRUD operations, availability tracking, and advocate matching.
 */

import { supabase } from '@/lib/supabase';
import {
  Advocate,
  AdvocateStatus,
  CompanySize,
  RewardType,
} from '@/types/database';

export interface CreateAdvocateData {
  name: string;
  email: string;
  title?: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  company_size?: CompanySize;
  geographic_region?: string;
  use_cases?: string[];
  expertise_areas?: string[];
  success_stories?: string[];
  max_calls_per_month?: number;
  preferred_call_times?: string[];
  timezone?: string;
  languages?: string[];
  call_duration_preference?: number;
  preferred_reward_type?: RewardType;
  internal_notes?: string;
  tags?: string[];
}

export interface UpdateAdvocateData extends Partial<CreateAdvocateData> {
  status?: AdvocateStatus;
  availability_score?: number;
  total_calls_completed?: number;
  last_call_date?: string | null;
  average_rating?: number;
  total_ratings?: number;
  total_rewards_earned?: number;
}

export interface AdvocateFilters {
  status?: AdvocateStatus[];
  industry?: string[];
  company_size?: CompanySize[];
  geographic_region?: string[];
  use_cases?: string[];
  expertise_areas?: string[];
  availability_score_min?: number;
  availability_score_max?: number;
  tags?: string[];
  search?: string;
}

export interface AdvocateMatchCriteria {
  industry?: string;
  company_size?: CompanySize;
  geographic_region?: string;
  use_cases?: string[];
  expertise_areas?: string[];
  exclude_advocate_ids?: string[];
  min_availability_score?: number;
}

/**
 * Create a new advocate
 */
export const createAdvocate = async (
  advocateData: CreateAdvocateData
): Promise<Advocate> => {
  const { data, error } = await supabase
    .from('advocates')
    .insert({
      ...advocateData,
      company_id: await getCurrentUserCompanyId(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create advocate: ${error.message}`);
  }

  return data;
};

/**
 * Get all advocates for the current user's company
 */
export const getAdvocates = async (
  filters?: AdvocateFilters
): Promise<Advocate[]> => {
  const companyId = await getCurrentUserCompanyId();

  let query = supabase
    .from('advocates')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters.industry && filters.industry.length > 0) {
      query = query.in('industry', filters.industry);
    }

    if (filters.company_size && filters.company_size.length > 0) {
      query = query.in('company_size', filters.company_size);
    }

    if (filters.geographic_region && filters.geographic_region.length > 0) {
      query = query.in('geographic_region', filters.geographic_region);
    }

    if (filters.availability_score_min !== undefined) {
      query = query.gte('availability_score', filters.availability_score_min);
    }

    if (filters.availability_score_max !== undefined) {
      query = query.lte('availability_score', filters.availability_score_max);
    }

    if (filters.use_cases && filters.use_cases.length > 0) {
      query = query.overlaps('use_cases', filters.use_cases);
    }

    if (filters.expertise_areas && filters.expertise_areas.length > 0) {
      query = query.overlaps('expertise_areas', filters.expertise_areas);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch advocates: ${error.message}`);
  }

  return data || [];
};

/**
 * Get a single advocate by ID
 */
export const getAdvocate = async (id: string): Promise<Advocate | null> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('advocates')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch advocate: ${error.message}`);
  }

  return data;
};

/**
 * Update an advocate
 */
export const updateAdvocate = async (
  id: string,
  updates: UpdateAdvocateData
): Promise<Advocate> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('advocates')
    .update(updates)
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update advocate: ${error.message}`);
  }

  return data;
};

/**
 * Delete an advocate (soft delete by setting status to inactive)
 */
export const deleteAdvocate = async (id: string): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('advocates')
    .update({ status: 'inactive' })
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to delete advocate: ${error.message}`);
  }
};

/**
 * Find matching advocates for an opportunity
 */
export const findMatchingAdvocates = async (
  criteria: AdvocateMatchCriteria
): Promise<Advocate[]> => {
  const companyId = await getCurrentUserCompanyId();

  let query = supabase
    .from('advocates')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .order('availability_score', { ascending: false });

  // Apply matching criteria
  if (criteria.industry) {
    query = query.eq('industry', criteria.industry);
  }

  if (criteria.company_size) {
    query = query.eq('company_size', criteria.company_size);
  }

  if (criteria.geographic_region) {
    query = query.eq('geographic_region', criteria.geographic_region);
  }

  if (criteria.use_cases && criteria.use_cases.length > 0) {
    query = query.overlaps('use_cases', criteria.use_cases);
  }

  if (criteria.expertise_areas && criteria.expertise_areas.length > 0) {
    query = query.overlaps('expertise_areas', criteria.expertise_areas);
  }

  if (criteria.min_availability_score !== undefined) {
    query = query.gte('availability_score', criteria.min_availability_score);
  }

  if (
    criteria.exclude_advocate_ids &&
    criteria.exclude_advocate_ids.length > 0
  ) {
    query = query.not(
      'id',
      'in',
      `(${criteria.exclude_advocate_ids.join(',')})`
    );
  }

  const { data, error } = await query.limit(10);

  if (error) {
    throw new Error(`Failed to find matching advocates: ${error.message}`);
  }

  return data || [];
};

/**
 * Update advocate availability score
 */
export const updateAdvocateAvailability = async (
  id: string,
  score: number
): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('advocates')
    .update({
      availability_score: Math.max(0, Math.min(100, score)),
      last_activity_date: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to update advocate availability: ${error.message}`);
  }
};

/**
 * Get advocate statistics
 */
export const getAdvocateStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
  pending: number;
  averageAvailability: number;
  totalCallsCompleted: number;
}> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('advocates')
    .select('status, availability_score, total_calls_completed')
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to fetch advocate stats: ${error.message}`);
  }

  const stats = {
    total: data.length,
    active: data.filter((a) => a.status === 'active').length,
    inactive: data.filter((a) => a.status === 'inactive').length,
    pending: data.filter((a) => a.status === 'pending').length,
    averageAvailability:
      data.length > 0
        ? data.reduce((sum, a) => sum + (a.availability_score || 0), 0) /
          data.length
        : 0,
    totalCallsCompleted: data.reduce(
      (sum, a) => sum + (a.total_calls_completed || 0),
      0
    ),
  };

  return stats;
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
