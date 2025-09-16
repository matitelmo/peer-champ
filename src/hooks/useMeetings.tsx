/**
 * Meetings Hook
 *
 * Custom hook for managing meeting links and video conferencing integration.
 * Provides functions for generating meeting links, managing preferences, and handling meeting operations.
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  createMeeting, 
  getUserMeetingPreferences, 
  saveUserMeetingPreferences,
  validateMeetingLink,
  getPlatformFromUrl,
  CreateMeetingOptions,
  MeetingPreferences,
  MeetingLink 
} from '@/lib/services/meetingService';

export interface UseMeetingsReturn {
  // Data
  meetingPreferences: MeetingPreferences | null;
  
  // Loading states
  loading: boolean;
  generating: boolean;
  saving: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  generateMeetingLink: (options: CreateMeetingOptions) => Promise<MeetingLink>;
  loadPreferences: () => Promise<void>;
  savePreferences: (preferences: MeetingPreferences) => Promise<void>;
  validateLink: (link: string) => boolean;
  getPlatform: (url: string) => string;
  clearError: () => void;
}

export const useMeetings = (userId?: string): UseMeetingsReturn => {
  const [meetingPreferences, setMeetingPreferences] = useState<MeetingPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMeetingLink = useCallback(async (options: CreateMeetingOptions): Promise<MeetingLink> => {
    setGenerating(true);
    setError(null);
    
    try {
      const meeting = await createMeeting(options);
      return meeting;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate meeting link';
      setError(errorMessage);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const loadPreferences = useCallback(async (): Promise<void> => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const preferences = await getUserMeetingPreferences(userId);
      setMeetingPreferences(preferences);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load meeting preferences';
      setError(errorMessage);
      console.error('Error loading meeting preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const savePreferences = useCallback(async (preferences: MeetingPreferences): Promise<void> => {
    if (!userId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await saveUserMeetingPreferences(userId, preferences);
      setMeetingPreferences(preferences);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save meeting preferences';
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [userId]);

  const validateLink = useCallback((link: string): boolean => {
    return validateMeetingLink(link);
  }, []);

  const getPlatform = useCallback((url: string): string => {
    return getPlatformFromUrl(url);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    meetingPreferences,
    loading,
    generating,
    saving,
    error,
    generateMeetingLink,
    loadPreferences,
    savePreferences,
    validateLink,
    getPlatform,
    clearError,
  };
};
