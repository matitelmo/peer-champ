/**
 * Advocates Hook
 *
 * Custom hook for managing advocate data and operations.
 * Provides state management and CRUD operations for advocates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Advocate,
  AdvocateStatus,
  CompanySize,
  RewardType,
} from '@/types/database';
import {
  createAdvocate,
  getAdvocates,
  getAdvocate,
  updateAdvocate,
  deleteAdvocate,
  findMatchingAdvocates,
  updateAdvocateAvailability,
  getAdvocateStats,
  CreateAdvocateData,
  UpdateAdvocate,
  AdvocateFilters,
  AdvocateMatchCriteria,
} from '@/lib/services/advocateService';

export interface UseAdvocatesReturn {
  // Data
  advocates: Advocate[];
  currentAdvocate: Advocate | null;
  stats: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    averageAvailability: number;
    totalCallsCompleted: number;
  } | null;

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchAdvocates: (filters?: AdvocateFilters) => Promise<void>;
  fetchAdvocate: (id: string) => Promise<void>;
  createNewAdvocate: (data: CreateAdvocateData) => Promise<Advocate>;
  updateAdvocateData: (
    id: string,
    data: UpdateAdvocate
  ) => Promise<Advocate>;
  deleteAdvocateData: (id: string) => Promise<void>;
  findMatches: (criteria: AdvocateMatchCriteria) => Promise<Advocate[]>;
  updateAvailability: (id: string, score: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
  clearCurrentAdvocate: () => void;
}

export const useAdvocates = (): UseAdvocatesReturn => {
  // State
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [currentAdvocate, setCurrentAdvocate] = useState<Advocate | null>(null);
  const [stats, setStats] = useState<UseAdvocatesReturn['stats']>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all advocates
  const fetchAdvocates = useCallback(async (filters?: AdvocateFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdvocates(filters);
      setAdvocates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch advocates'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single advocate
  const fetchAdvocate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdvocate(id);
      setCurrentAdvocate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch advocate');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new advocate
  const createNewAdvocate = useCallback(
    async (data: CreateAdvocateData): Promise<Advocate> => {
      try {
        setCreating(true);
        setError(null);
        const newAdvocate = await createAdvocate(data);
        setAdvocates((prev) => [newAdvocate, ...prev]);
        return newAdvocate;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create advocate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setCreating(false);
      }
    },
    []
  );

  // Update advocate
  const updateAdvocateData = useCallback(
    async (id: string, data: UpdateAdvocate): Promise<Advocate> => {
      try {
        setUpdating(true);
        setError(null);
        const updatedAdvocate = await updateAdvocate(id, data);

        // Update in advocates list
        setAdvocates((prev) =>
          prev.map((advocate) =>
            advocate.id === id ? updatedAdvocate : advocate
          )
        );

        // Update current advocate if it's the same one
        if (currentAdvocate?.id === id) {
          setCurrentAdvocate(updatedAdvocate);
        }

        return updatedAdvocate;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update advocate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [currentAdvocate]
  );

  // Delete advocate
  const deleteAdvocateData = useCallback(
    async (id: string) => {
      try {
        setDeleting(true);
        setError(null);
        await deleteAdvocate(id);

        // Remove from advocates list
        setAdvocates((prev) => prev.filter((advocate) => advocate.id !== id));

        // Clear current advocate if it's the same one
        if (currentAdvocate?.id === id) {
          setCurrentAdvocate(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete advocate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setDeleting(false);
      }
    },
    [currentAdvocate]
  );

  // Find matching advocates
  const findMatches = useCallback(
    async (criteria: AdvocateMatchCriteria): Promise<Advocate[]> => {
      try {
        setError(null);
        return await findMatchingAdvocates(criteria);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to find matching advocates';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Update availability
  const updateAvailability = useCallback(
    async (id: string, score: number) => {
      try {
        setError(null);
        await updateAdvocateAvailability(id, score);

        // Update in advocates list
        setAdvocates((prev) =>
          prev.map((advocate) =>
            advocate.id === id
              ? {
                  ...advocate,
                  availability_score: score,
                  last_activity_date: new Date().toISOString(),
                }
              : advocate
          )
        );

        // Update current advocate if it's the same one
        if (currentAdvocate?.id === id) {
          setCurrentAdvocate((prev) =>
            prev
              ? {
                  ...prev,
                  availability_score: score,
                  last_activity_date: new Date().toISOString(),
                }
              : null
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update availability';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [currentAdvocate]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await getAdvocateStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current advocate
  const clearCurrentAdvocate = useCallback(() => {
    setCurrentAdvocate(null);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchAdvocates();
    fetchStats();
  }, [fetchAdvocates, fetchStats]);

  return {
    // Data
    advocates,
    currentAdvocate,
    stats,

    // Loading states
    loading,
    creating,
    updating,
    deleting,

    // Error state
    error,

    // Actions
    fetchAdvocates,
    fetchAdvocate,
    createNewAdvocate,
    updateAdvocateData,
    deleteAdvocateData,
    findMatches,
    updateAvailability,
    fetchStats,
    clearError,
    clearCurrentAdvocate,
  };
};
