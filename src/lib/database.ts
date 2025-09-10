/**
 * Database Utility Functions
 *
 * Provides type-safe database operations and utility functions
 * for common database operations throughout the application.
 */

import { supabase, getServiceSupabase } from './supabase';
import type {
  Company,
  User,
  Advocate,
  Opportunity,
  ReferenceCall,
  InsertCompany,
  UpdateCompany,
  InsertUser,
  UpdateUser,
  InsertAdvocate,
  UpdateAdvocate,
  InsertOpportunity,
  UpdateOpportunity,
  InsertReferenceCall,
  UpdateReferenceCall,
  QueryOptions,
  AdvocateFilters,
  OpportunityFilters,
  ReferenceCallFilters,
} from '@/types/database';

// Generic database response type
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DatabaseListResponse<T> {
  data: T[];
  error: Error | null;
  count?: number;
}

// Company Operations
export const companyService = {
  // Get all companies (admin only)
  async getAll(options?: QueryOptions): Promise<DatabaseListResponse<Company>> {
    try {
      const query = supabase.from('companies').select('*', { count: 'exact' });

      if (options?.orderBy) {
        query.order(options.orderBy, {
          ascending: options.orderDirection === 'asc',
        });
      }

      if (options?.limit) {
        query.limit(options.limit);
      }

      if (options?.offset) {
        query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Get company by ID
  async getById(id: string): Promise<DatabaseResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Create new company
  async create(company: InsertCompany): Promise<DatabaseResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Update company
  async update(
    id: string,
    updates: UpdateCompany
  ): Promise<DatabaseResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Delete company
  async delete(id: string): Promise<DatabaseResponse<void>> {
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id);

      return {
        data: null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

// User Operations
export const userService = {
  // Get all users for a company
  async getByCompany(
    companyId: string,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<User>> {
    try {
      const query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('company_id', companyId);

      if (options?.orderBy) {
        query.order(options.orderBy, {
          ascending: options.orderDirection === 'asc',
        });
      }

      if (options?.limit) {
        query.limit(options.limit);
      }

      if (options?.offset) {
        query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Get user by ID
  async getById(id: string): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Create new user
  async create(user: InsertUser): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Update user
  async update(
    id: string,
    updates: UpdateUser
  ): Promise<DatabaseResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

// Advocate Operations
export const advocateService = {
  // Get advocates with filters
  async getFiltered(
    filters: AdvocateFilters,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<Advocate>> {
    try {
      let query = supabase.from('advocates').select('*', { count: 'exact' });

      // Apply filters
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id);
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters.company_size) {
        query = query.eq('company_size', filters.company_size);
      }

      if (filters.geographic_region) {
        query = query.eq('geographic_region', filters.geographic_region);
      }

      if (filters.availability_score_min) {
        query = query.gte('availability_score', filters.availability_score_min);
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

      // Apply ordering and pagination
      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options.orderDirection === 'asc',
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Get advocate by ID
  async getById(id: string): Promise<DatabaseResponse<Advocate>> {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Create new advocate
  async create(advocate: InsertAdvocate): Promise<DatabaseResponse<Advocate>> {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .insert(advocate)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Update advocate
  async update(
    id: string,
    updates: UpdateAdvocate
  ): Promise<DatabaseResponse<Advocate>> {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

// Opportunity Operations
export const opportunityService = {
  // Get opportunities with filters
  async getFiltered(
    filters: OpportunityFilters,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<Opportunity>> {
    try {
      let query = supabase
        .from('opportunities')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id);
      }

      if (filters.sales_rep_id) {
        query = query.eq('sales_rep_id', filters.sales_rep_id);
      }

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

      if (filters.prospect_industry) {
        query = query.eq('prospect_industry', filters.prospect_industry);
      }

      if (filters.prospect_size) {
        query = query.eq('prospect_size', filters.prospect_size);
      }

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

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply ordering and pagination
      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options.orderDirection === 'asc',
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Get opportunity by ID
  async getById(id: string): Promise<DatabaseResponse<Opportunity>> {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Create new opportunity
  async create(
    opportunity: InsertOpportunity
  ): Promise<DatabaseResponse<Opportunity>> {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert(opportunity)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Update opportunity
  async update(
    id: string,
    updates: UpdateOpportunity
  ): Promise<DatabaseResponse<Opportunity>> {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

// Reference Call Operations
export const referenceCallService = {
  // Get reference calls with filters
  async getFiltered(
    filters: ReferenceCallFilters,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<ReferenceCall>> {
    try {
      let query = supabase
        .from('reference_calls')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id);
      }

      if (filters.advocate_id) {
        query = query.eq('advocate_id', filters.advocate_id);
      }

      if (filters.sales_rep_id) {
        query = query.eq('sales_rep_id', filters.sales_rep_id);
      }

      if (filters.opportunity_id) {
        query = query.eq('opportunity_id', filters.opportunity_id);
      }

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

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply ordering and pagination
      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options.orderDirection === 'asc',
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Get reference call by ID
  async getById(id: string): Promise<DatabaseResponse<ReferenceCall>> {
    try {
      const { data, error } = await supabase
        .from('reference_calls')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Create new reference call
  async create(
    referenceCall: InsertReferenceCall
  ): Promise<DatabaseResponse<ReferenceCall>> {
    try {
      const { data, error } = await supabase
        .from('reference_calls')
        .insert(referenceCall)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  // Update reference call
  async update(
    id: string,
    updates: UpdateReferenceCall
  ): Promise<DatabaseResponse<ReferenceCall>> {
    try {
      const { data, error } = await supabase
        .from('reference_calls')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return {
        data: data || null,
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

// Utility functions
export const databaseUtils = {
  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('companies').select('id').limit(1);

      return !error;
    } catch {
      return false;
    }
  },

  // Get current user's company ID
  async getCurrentUserCompanyId(): Promise<string | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      return data?.company_id || null;
    } catch {
      return null;
    }
  },

  // Batch operations
  async batchInsert<T>(
    table: string,
    items: T[]
  ): Promise<DatabaseListResponse<T>> {
    try {
      const { data, error } = await supabase.from(table).insert(items).select();

      return {
        data: data || [],
        error: error ? new Error(error.message) : null,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },
};

export default {
  companyService,
  userService,
  advocateService,
  opportunityService,
  referenceCallService,
  databaseUtils,
};
