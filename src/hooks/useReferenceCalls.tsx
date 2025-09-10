/**
 * Reference Calls Hook
 *
 * React hook for managing reference call data and operations.
 * Provides methods for CRUD operations, status updates, and feedback submission.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReferenceCall } from '@/types/database';
import {
  getReferenceCalls,
  getReferenceCallById,
  createReferenceCall,
  updateReferenceCall,
  deleteReferenceCall,
  getReferenceCallsByStatus,
  getUpcomingReferenceCalls,
  getReferenceCallsForAdvocate,
  getReferenceCallsForOpportunity,
  updateCallStatus,
  startReferenceCall,
  endReferenceCall,
  cancelReferenceCall,
  rescheduleReferenceCall,
  submitCallFeedback,
  getCallStatistics,
  CreateReferenceCallData,
  UpdateReferenceCallData,
  CallFeedback,
} from '@/lib/services/referenceCallService';
import { useAuth } from './useAuth';

interface UseReferenceCallsOptions {
  companyId?: string;
  advocateId?: string;
  opportunityId?: string;
  status?: string;
  autoFetch?: boolean;
}

export const useReferenceCalls = (options: UseReferenceCallsOptions = {}) => {
  const { user } = useAuth();
  const [calls, setCalls] = useState<ReferenceCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const {
    companyId,
    advocateId,
    opportunityId,
    status,
    autoFetch = true,
  } = options;

  // Fetch reference calls based on options
  const fetchCalls = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: ReferenceCall[] = [];

      if (advocateId) {
        data = await getReferenceCallsForAdvocate(advocateId);
      } else if (opportunityId) {
        data = await getReferenceCallsForOpportunity(opportunityId);
      } else if (status) {
        data = await getReferenceCallsByStatus(companyId || '', status);
      } else if (companyId) {
        data = await getReferenceCalls(companyId);
      }

      setCalls(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reference calls');
      console.error('Error fetching reference calls:', err);
    } finally {
      setLoading(false);
    }
  }, [user, companyId, advocateId, opportunityId, status]);

  // Fetch upcoming calls
  const fetchUpcomingCalls = useCallback(
    async (limit: number = 10) => {
      if (!companyId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getUpcomingReferenceCalls(companyId, limit);
        setCalls(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch upcoming calls');
        console.error('Error fetching upcoming calls:', err);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  // Fetch call statistics
  const fetchStatistics = useCallback(async () => {
    if (!companyId) return;

    try {
      const stats = await getCallStatistics(companyId);
      setStatistics(stats);
    } catch (err: any) {
      console.error('Error fetching call statistics:', err);
    }
  }, [companyId]);

  // Auto-fetch calls when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCalls();
    }
  }, [fetchCalls, autoFetch]);

  // Auto-fetch statistics when companyId changes
  useEffect(() => {
    if (companyId) {
      fetchStatistics();
    }
  }, [companyId, fetchStatistics]);

  // Create a new reference call
  const createNewCall = async (
    callData: CreateReferenceCallData
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const newCall = await createReferenceCall(callData);
      setCalls((prev) => [newCall, ...prev]);
      return newCall;
    } catch (err: any) {
      setError(err.message || 'Failed to create reference call');
      console.error('Error creating reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a reference call
  const updateCall = async (
    id: string,
    callData: UpdateReferenceCallData
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await updateReferenceCall(id, callData);
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to update reference call');
      console.error('Error updating reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a reference call
  const deleteCall = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await deleteReferenceCall(id);
      setCalls((prev) => prev.filter((call) => call.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete reference call');
      console.error('Error deleting reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update call status
  const updateStatus = async (
    id: string,
    newStatus: string,
    additionalData?: Partial<UpdateReferenceCallData>
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await updateCallStatus(id, newStatus, additionalData);
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to update call status');
      console.error('Error updating call status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start a reference call
  const startCall = async (id: string): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await startReferenceCall(id);
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to start reference call');
      console.error('Error starting reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // End a reference call
  const endCall = async (
    id: string,
    endTime?: string
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await endReferenceCall(id, endTime);
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to end reference call');
      console.error('Error ending reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a reference call
  const cancelCall = async (
    id: string,
    reason: string
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await cancelReferenceCall(id, reason);
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel reference call');
      console.error('Error cancelling reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reschedule a reference call
  const rescheduleCall = async (
    id: string,
    newScheduledAt: string,
    reason?: string
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await rescheduleReferenceCall(
        id,
        newScheduledAt,
        reason
      );
      setCalls((prev) =>
        prev.map((call) => (call.id === id ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule reference call');
      console.error('Error rescheduling reference call:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit call feedback
  const submitFeedback = async (
    feedback: CallFeedback
  ): Promise<ReferenceCall> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCall = await submitCallFeedback(feedback);
      setCalls((prev) =>
        prev.map((call) => (call.id === feedback.callId ? updatedCall : call))
      );
      return updatedCall;
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
      console.error('Error submitting feedback:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific call by ID
  const getCall = async (id: string): Promise<ReferenceCall | null> => {
    try {
      return await getReferenceCallById(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reference call');
      console.error('Error fetching reference call:', err);
      return null;
    }
  };

  // Filter calls by status
  const getCallsByStatus = (status: string): ReferenceCall[] => {
    return calls.filter((call) => call.status === status);
  };

  // Get upcoming calls (from current data)
  const getUpcomingCalls = (): ReferenceCall[] => {
    const now = new Date();
    return calls.filter(
      (call) =>
        call.status === 'scheduled' &&
        call.scheduled_at &&
        new Date(call.scheduled_at) > now
    );
  };

  // Get completed calls
  const getCompletedCalls = (): ReferenceCall[] => {
    return calls.filter((call) => call.status === 'completed');
  };

  // Get cancelled calls
  const getCancelledCalls = (): ReferenceCall[] => {
    return calls.filter((call) => call.status === 'cancelled');
  };

  return {
    // State
    calls,
    loading,
    error,
    statistics,

    // Actions
    fetchCalls,
    fetchUpcomingCalls,
    fetchStatistics,
    createNewCall,
    updateCall,
    deleteCall,
    updateStatus,
    startCall,
    endCall,
    cancelCall,
    rescheduleCall,
    submitFeedback,
    getCall,

    // Filters and utilities
    getCallsByStatus,
    getUpcomingCalls,
    getCompletedCalls,
    getCancelledCalls,

    // Computed values
    hasCalls: calls.length > 0,
    callCount: calls.length,
    upcomingCalls: getUpcomingCalls(),
    completedCalls: getCompletedCalls(),
    cancelledCalls: getCancelledCalls(),
  };
};
