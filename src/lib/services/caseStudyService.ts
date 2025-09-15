/**
 * Case Study Service
 *
 * Service functions for managing case study data and operations.
 * Handles CRUD operations, file uploads, and case study management.
 */

import { supabase } from '@/lib/supabase';
import { CaseStudy } from '@/types/database';

export interface CreateCaseStudyData {
  advocate_id: string;
  title: string;
  description?: string;
  content?: string;
  file_name?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  category?: 'success_story' | 'case_study' | 'testimonial' | 'documentation' | 'presentation';
  tags?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateCaseStudyData extends Partial<CreateCaseStudyData> {
  view_count?: number;
  download_count?: number;
  last_accessed_at?: string | null;
}

export interface CaseStudyFilters {
  advocate_id?: string;
  category?: string[];
  approval_status?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

/**
 * Create a new case study
 */
export const createCaseStudy = async (
  caseStudyData: CreateCaseStudyData
): Promise<CaseStudy> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('case_studies')
    .insert({
      ...caseStudyData,
      company_id: companyId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create case study: ${error.message}`);
  }

  return data;
};

/**
 * Get all case studies for the current user's company
 */
export const getCaseStudies = async (
  filters?: CaseStudyFilters
): Promise<CaseStudy[]> => {
  const companyId = await getCurrentUserCompanyId();

  let query = supabase
    .from('case_studies')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters) {
    if (filters.advocate_id) {
      query = query.eq('advocate_id', filters.advocate_id);
    }

    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    if (filters.approval_status && filters.approval_status.length > 0) {
      query = query.in('approval_status', filters.approval_status);
    }

    if (filters.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch case studies: ${error.message}`);
  }

  return data || [];
};

/**
 * Get a single case study by ID
 */
export const getCaseStudy = async (id: string): Promise<CaseStudy | null> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch case study: ${error.message}`);
  }

  return data;
};

/**
 * Update a case study
 */
export const updateCaseStudy = async (
  id: string,
  updates: UpdateCaseStudyData
): Promise<CaseStudy> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('case_studies')
    .update(updates)
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update case study: ${error.message}`);
  }

  return data;
};

/**
 * Delete a case study
 */
export const deleteCaseStudy = async (id: string): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('case_studies')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to delete case study: ${error.message}`);
  }
};

/**
 * Get case studies for a specific advocate
 */
export const getCaseStudiesByAdvocate = async (
  advocateId: string
): Promise<CaseStudy[]> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('advocate_id', advocateId)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch advocate case studies: ${error.message}`);
  }

  return data || [];
};

/**
 * Update case study view count
 */
export const incrementViewCount = async (id: string): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('case_studies')
    .update({
      view_count: 1,
      last_accessed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to update view count: ${error.message}`);
  }
};

/**
 * Update case study download count
 */
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const companyId = await getCurrentUserCompanyId();

  const { error } = await supabase
    .from('case_studies')
    .update({
      download_count: 1,
      last_accessed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to update download count: ${error.message}`);
  }
};

/**
 * Get case study statistics
 */
export const getCaseStudyStats = async (): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byApprovalStatus: Record<string, number>;
  totalViews: number;
  totalDownloads: number;
  featuredCount: number;
  publicCount: number;
}> => {
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from('case_studies')
    .select('category, approval_status, view_count, download_count, is_featured, is_public')
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to fetch case study stats: ${error.message}`);
  }

  const stats = {
    total: data.length,
    byCategory: {} as Record<string, number>,
    byApprovalStatus: {} as Record<string, number>,
    totalViews: 0,
    totalDownloads: 0,
    featuredCount: 0,
    publicCount: 0,
  };

  data.forEach((caseStudy) => {
    // Count by category
    const category = caseStudy.category || 'unknown';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // Count by approval status
    const approvalStatus = caseStudy.approval_status || 'unknown';
    stats.byApprovalStatus[approvalStatus] = (stats.byApprovalStatus[approvalStatus] || 0) + 1;

    // Sum view and download counts
    stats.totalViews += caseStudy.view_count || 0;
    stats.totalDownloads += caseStudy.download_count || 0;

    // Count featured and public
    if (caseStudy.is_featured) {
      stats.featuredCount++;
    }
    if (caseStudy.is_public) {
      stats.publicCount++;
    }
  });

  return stats;
};

/**
 * Upload file to Supabase Storage
 */
export const uploadCaseStudyFile = async (
  file: File,
  advocateId: string,
  caseStudyId: string
): Promise<string> => {
  const companyId = await getCurrentUserCompanyId();
  const fileExt = file.name.split('.').pop();
  const fileName = `${companyId}/${advocateId}/${caseStudyId}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('case-studies')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('case-studies')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

/**
 * Delete file from Supabase Storage
 */
export const deleteCaseStudyFile = async (fileUrl: string): Promise<void> => {
  // Extract file path from URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const folderPath = pathParts.slice(-3, -1).join('/');
  const fullPath = `${folderPath}/${fileName}`;

  const { error } = await supabase.storage
    .from('case-studies')
    .remove([fullPath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
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
