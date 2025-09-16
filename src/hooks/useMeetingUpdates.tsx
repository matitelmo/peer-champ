/**
 * Hook for managing meeting updates and cancellations
 */

import { useState, useCallback } from 'react';
import { 
  updateMeetingWithNotifications, 
  cancelMeetingWithNotifications,
  getMeetingHistory,
  MeetingUpdateData,
  MeetingCancellationData 
} from '@/lib/services/meetingUpdateService';

export interface UseMeetingUpdatesReturn {
  // Update functions
  updateMeeting: (data: MeetingUpdateData) => Promise<{ success: boolean; error?: string; requiresNewLink?: boolean }>;
  cancelMeeting: (data: MeetingCancellationData) => Promise<{ success: boolean; error?: string }>;
  
  // History functions
  getMeetingHistory: (referenceCallId: string) => Promise<any[]>;
  
  // Loading states
  isUpdating: boolean;
  isCancelling: boolean;
  isLoadingHistory: boolean;
  
  // Error states
  updateError: string | null;
  cancellationError: string | null;
  
  // Clear functions
  clearUpdateError: () => void;
  clearCancellationError: () => void;
}

export function useMeetingUpdates(): UseMeetingUpdatesReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [cancellationError, setCancellationError] = useState<string | null>(null);

  const updateMeeting = useCallback(async (data: MeetingUpdateData) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const result = await updateMeetingWithNotifications(data);
      if (!result.success) {
        setUpdateError(result.error || 'Failed to update meeting');
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUpdateError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const cancelMeeting = useCallback(async (data: MeetingCancellationData) => {
    setIsCancelling(true);
    setCancellationError(null);
    
    try {
      const result = await cancelMeetingWithNotifications(data);
      if (!result.success) {
        setCancellationError(result.error || 'Failed to cancel meeting');
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCancellationError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCancelling(false);
    }
  }, []);

  const getMeetingHistory = useCallback(async (referenceCallId: string) => {
    setIsLoadingHistory(true);
    
    try {
      return await getMeetingHistory(referenceCallId);
    } catch (error) {
      console.error('Error getting meeting history:', error);
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const clearUpdateError = useCallback(() => {
    setUpdateError(null);
  }, []);

  const clearCancellationError = useCallback(() => {
    setCancellationError(null);
  }, []);

  return {
    updateMeeting,
    cancelMeeting,
    getMeetingHistory,
    isUpdating,
    isCancelling,
    isLoadingHistory,
    updateError,
    cancellationError,
    clearUpdateError,
    clearCancellationError,
  };
}
