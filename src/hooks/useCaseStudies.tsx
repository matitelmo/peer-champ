/**
 * useCaseStudies Hook
 *
 * React hook for managing case study data and operations.
 * Provides state management and CRUD operations for case studies.
 */

import { useState, useEffect, useCallback } from 'react';
import { CaseStudy } from '@/types/database';
import {
  
  CreateCaseStudyData,
  UpdateCaseStudyData,
  CaseStudyFilters,
  createCaseStudy,
  getCaseStudies,
  getCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudiesByAdvocate,
  incrementViewCount,
  incrementDownloadCount,
  getCaseStudyStats,
  uploadCaseStudyFile,
  deleteCaseStudyFile,
} from '@/lib/services/caseStudyService';

export interface UseCaseStudiesOptions {
  advocateId?: string;
  filters?: CaseStudyFilters;
  autoFetch?: boolean;
}

export interface UseCaseStudiesReturn {
  // Data
  caseStudies: CaseStudy[];
  currentCaseStudy: CaseStudy | null;
  stats: {
    total: number;
    byCategory: Record<string, number>;
    byApprovalStatus: Record<string, number>;
    totalViews: number;
    totalDownloads: number;
    featuredCount: number;
    publicCount: number;
  } | null;

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  uploading: boolean;

  // Error state
  error: string | null;

  // CRUD operations
  createCaseStudyData: (data: CreateCaseStudyData) => Promise<CaseStudy>;
  updateCaseStudyData: (id: string, data: UpdateCaseStudyData) => Promise<CaseStudy>;
  deleteCaseStudyData: (id: string) => Promise<void>;
  fetchCaseStudies: (filters?: CaseStudyFilters) => Promise<void>;
  fetchCaseStudy: (id: string) => Promise<CaseStudy | null>;
  fetchCaseStudiesByAdvocate: (advocateId: string) => Promise<CaseStudy[]>;
  fetchStats: () => Promise<void>;

  // File operations
  uploadFile: (file: File, advocateId: string, caseStudyId: string) => Promise<string>;
  deleteFile: (fileUrl: string) => Promise<void>;

  // View/Download tracking
  trackView: (id: string) => Promise<void>;
  trackDownload: (id: string) => Promise<void>;

  // Utility functions
  clearError: () => void;
  setCurrentCaseStudy: (caseStudy: CaseStudy | null) => void;
}

export const useCaseStudies = (options: UseCaseStudiesOptions = {}): UseCaseStudiesReturn => {
  const { advocateId, filters, autoFetch = true } = options;

  // State
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [currentCaseStudy, setCurrentCaseStudy] = useState<CaseStudy | null>(null);
  const [stats, setStats] = useState<UseCaseStudiesReturn['stats']>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch case studies
  const fetchCaseStudies = useCallback(async (customFilters?: CaseStudyFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = customFilters || filters;
      const data = await getCaseStudies(queryFilters);
      setCaseStudies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case studies';
      setError(errorMessage);
      console.error('Error fetching case studies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single case study
  const fetchCaseStudy = useCallback(async (id: string): Promise<CaseStudy | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCaseStudy(id);
      setCurrentCaseStudy(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case study';
      setError(errorMessage);
      console.error('Error fetching case study:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch case studies by advocate
  const fetchCaseStudiesByAdvocate = useCallback(async (advocateId: string): Promise<CaseStudy[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCaseStudiesByAdvocate(advocateId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch advocate case studies';
      setError(errorMessage);
      console.error('Error fetching advocate case studies:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await getCaseStudyStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case study stats';
      setError(errorMessage);
      console.error('Error fetching case study stats:', err);
    }
  }, []);

  // Create case study
  const createCaseStudyData = useCallback(async (data: CreateCaseStudyData): Promise<CaseStudy> => {
    try {
      setCreating(true);
      setError(null);
      
      const newCaseStudy = await createCaseStudy(data);
      setCaseStudies(prev => [newCaseStudy, ...prev]);
      return newCaseStudy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create case study';
      setError(errorMessage);
      console.error('Error creating case study:', err);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  // Update case study
  const updateCaseStudyData = useCallback(async (id: string, data: UpdateCaseStudyData): Promise<CaseStudy> => {
    try {
      setUpdating(true);
      setError(null);
      
      const updatedCaseStudy = await updateCaseStudy(id, data);
      setCaseStudies(prev => prev.map(cs => cs.id === id ? updatedCaseStudy : cs));
      
      if (currentCaseStudy?.id === id) {
        setCurrentCaseStudy(updatedCaseStudy);
      }
      
      return updatedCaseStudy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update case study';
      setError(errorMessage);
      console.error('Error updating case study:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [currentCaseStudy]);

  // Delete case study
  const deleteCaseStudyData = useCallback(async (id: string): Promise<void> => {
    try {
      setDeleting(true);
      setError(null);
      
      await deleteCaseStudy(id);
      setCaseStudies(prev => prev.filter(cs => cs.id !== id));
      
      if (currentCaseStudy?.id === id) {
        setCurrentCaseStudy(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete case study';
      setError(errorMessage);
      console.error('Error deleting case study:', err);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [currentCaseStudy]);

  // Upload file
  const uploadFile = useCallback(async (file: File, advocateId: string, caseStudyId: string): Promise<string> => {
    try {
      setUploading(true);
      setError(null);
      
      const fileUrl = await uploadCaseStudyFile(file, advocateId, caseStudyId);
      return fileUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  // Delete file
  const deleteFile = useCallback(async (fileUrl: string): Promise<void> => {
    try {
      setError(null);
      await deleteCaseStudyFile(fileUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      console.error('Error deleting file:', err);
      throw err;
    }
  }, []);

  // Track view
  const trackView = useCallback(async (id: string): Promise<void> => {
    try {
      await incrementViewCount(id);
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  }, []);

  // Track download
  const trackDownload = useCallback(async (id: string): Promise<void> => {
    try {
      await incrementDownloadCount(id);
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCaseStudies();
      fetchStats();
    }
  }, [autoFetch, fetchCaseStudies, fetchStats]);

  // Auto-fetch when advocateId changes
  useEffect(() => {
    if (advocateId && autoFetch) {
      fetchCaseStudiesByAdvocate(advocateId);
    }
  }, [advocateId, autoFetch, fetchCaseStudiesByAdvocate]);

  return {
    // Data
    caseStudies,
    currentCaseStudy,
    stats,

    // Loading states
    loading,
    creating,
    updating,
    deleting,
    uploading,

    // Error state
    error,

    // CRUD operations
    createCaseStudyData,
    updateCaseStudyData,
    deleteCaseStudyData,
    fetchCaseStudies,
    fetchCaseStudy,
    fetchCaseStudiesByAdvocate,
    fetchStats,

    // File operations
    uploadFile,
    deleteFile,

    // View/Download tracking
    trackView,
    trackDownload,

    // Utility functions
    clearError,
    setCurrentCaseStudy,
  };
};
