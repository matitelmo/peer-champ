/**
 * Opportunities Hook
 *
 * Custom hook for managing opportunity data and operations.
 * Provides state management and CRUD operations for opportunities.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Opportunity, CompanySize } from '@/types/database';
import {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  updateOpportunity,
  deleteOpportunity,
  updateReferenceRequestStatus,
  getOpportunityStats,
  getOpportunitiesNeedingReferences,
  CreateOpportunityData,
  UpdateOpportunityData,
  OpportunityFilters,
} from '@/lib/services/opportunityService';

export interface UseOpportunitiesReturn {
  // Data
  opportunities: Opportunity[];
  currentOpportunity: Opportunity | null;
  opportunitiesNeedingReferences: Opportunity[];
  stats: {
    total: number;
    byStage: Record<string, number>;
    byReferenceStatus: Record<string, number>;
    totalValue: number;
    averageValue: number;
    referenceRequests: number;
    completedReferences: number;
  } | null;

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchOpportunities: (filters?: OpportunityFilters) => Promise<void>;
  fetchOpportunity: (id: string) => Promise<void>;
  createNewOpportunity: (data: CreateOpportunityData) => Promise<Opportunity>;
  updateOpportunityData: (
    id: string,
    data: UpdateOpportunityData
  ) => Promise<Opportunity>;
  deleteOpportunityData: (id: string) => Promise<void>;
  updateReferenceStatus: (
    id: string,
    status:
      | 'not_requested'
      | 'requested'
      | 'in_progress'
      | 'completed'
      | 'declined'
  ) => Promise<Opportunity>;
  fetchStats: () => Promise<void>;
  fetchOpportunitiesNeedingReferences: () => Promise<void>;
  clearError: () => void;
  clearCurrentOpportunity: () => void;
}

export const useOpportunities = (): UseOpportunitiesReturn => {
  // State
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentOpportunity, setCurrentOpportunity] =
    useState<Opportunity | null>(null);
  const [opportunitiesNeedingReferences, setOpportunitiesNeedingReferences] =
    useState<Opportunity[]>([]);
  const [stats, setStats] = useState<UseOpportunitiesReturn['stats']>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all opportunities
  const fetchOpportunities = useCallback(
    async (filters?: OpportunityFilters) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOpportunities(filters);
        setOpportunities(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch opportunities'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch single opportunity
  const fetchOpportunity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOpportunity(id);
      setCurrentOpportunity(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch opportunity'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new opportunity
  const createNewOpportunity = useCallback(
    async (data: CreateOpportunityData): Promise<Opportunity> => {
      try {
        setCreating(true);
        setError(null);
        const newOpportunity = await createOpportunity(data);
        setOpportunities((prev) => [newOpportunity, ...prev]);
        return newOpportunity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create opportunity';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setCreating(false);
      }
    },
    []
  );

  // Update opportunity
  const updateOpportunityData = useCallback(
    async (id: string, data: UpdateOpportunityData): Promise<Opportunity> => {
      try {
        setUpdating(true);
        setError(null);
        const updatedOpportunity = await updateOpportunity(id, data);

        // Update in opportunities list
        setOpportunities((prev) =>
          prev.map((opportunity) =>
            opportunity.id === id ? updatedOpportunity : opportunity
          )
        );

        // Update current opportunity if it's the same one
        if (currentOpportunity?.id === id) {
          setCurrentOpportunity(updatedOpportunity);
        }

        return updatedOpportunity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update opportunity';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [currentOpportunity]
  );

  // Delete opportunity
  const deleteOpportunityData = useCallback(
    async (id: string) => {
      try {
        setDeleting(true);
        setError(null);
        await deleteOpportunity(id);

        // Remove from opportunities list
        setOpportunities((prev) =>
          prev.filter((opportunity) => opportunity.id !== id)
        );

        // Clear current opportunity if it's the same one
        if (currentOpportunity?.id === id) {
          setCurrentOpportunity(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete opportunity';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setDeleting(false);
      }
    },
    [currentOpportunity]
  );

  // Update reference request status
  const updateReferenceStatus = useCallback(
    async (
      id: string,
      status:
        | 'not_requested'
        | 'requested'
        | 'in_progress'
        | 'completed'
        | 'declined'
    ): Promise<Opportunity> => {
      try {
        setError(null);
        const updatedOpportunity = await updateReferenceRequestStatus(
          id,
          status
        );

        // Update in opportunities list
        setOpportunities((prev) =>
          prev.map((opportunity) =>
            opportunity.id === id ? updatedOpportunity : opportunity
          )
        );

        // Update current opportunity if it's the same one
        if (currentOpportunity?.id === id) {
          setCurrentOpportunity(updatedOpportunity);
        }

        return updatedOpportunity;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to update reference status';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [currentOpportunity]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await getOpportunityStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  // Fetch opportunities needing references
  const fetchOpportunitiesNeedingReferences = useCallback(async () => {
    try {
      setError(null);
      const data = await getOpportunitiesNeedingReferences();
      setOpportunitiesNeedingReferences(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch opportunities needing references'
      );
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current opportunity
  const clearCurrentOpportunity = useCallback(() => {
    setCurrentOpportunity(null);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchOpportunities();
    fetchStats();
    fetchOpportunitiesNeedingReferences();
  }, [fetchOpportunities, fetchStats, fetchOpportunitiesNeedingReferences]);

  return {
    // Data
    opportunities,
    currentOpportunity,
    opportunitiesNeedingReferences,
    stats,

    // Loading states
    loading,
    creating,
    updating,
    deleting,

    // Error state
    error,

    // Actions
    fetchOpportunities,
    fetchOpportunity,
    createNewOpportunity,
    updateOpportunityData,
    deleteOpportunityData,
    updateReferenceStatus,
    fetchStats,
    fetchOpportunitiesNeedingReferences,
    clearError,
    clearCurrentOpportunity,
  };
};
