/**
 * Meeting Notifications Hook
 *
 * Custom hook for managing meeting notifications, calendar invites,
 * and email communications for reference calls.
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  sendMeetingNotifications,
  sendCalendarInvite,
  generateCalendarInvite,
  MeetingNotificationData,
  CalendarInviteData,
  EmailRecipient
} from '@/lib/services/emailService';

export interface NotificationResult {
  recipient: string;
  success: boolean;
  error?: string;
}

export interface UseMeetingNotificationsReturn {
  // Data
  lastNotificationResults: NotificationResult[] | null;
  
  // Loading states
  sending: boolean;
  sendingCalendar: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  sendNotifications: (data: MeetingNotificationData) => Promise<boolean>;
  sendCalendarInvites: (data: CalendarInviteData, recipients: EmailRecipient[]) => Promise<boolean>;
  generateInviteContent: (data: CalendarInviteData) => string;
  clearError: () => void;
}

export const useMeetingNotifications = (): UseMeetingNotificationsReturn => {
  const [lastNotificationResults, setLastNotificationResults] = useState<NotificationResult[] | null>(null);
  const [sending, setSending] = useState(false);
  const [sendingCalendar, setSendingCalendar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotifications = useCallback(async (data: MeetingNotificationData): Promise<boolean> => {
    setSending(true);
    setError(null);
    
    try {
      const result = await sendMeetingNotifications(data);
      setLastNotificationResults(result.results);
      
      if (!result.success) {
        const failedRecipients = result.results
          .filter(r => !r.success)
          .map(r => r.recipient)
          .join(', ');
        setError(`Failed to send notifications to: ${failedRecipients}`);
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send meeting notifications';
      setError(errorMessage);
      console.error('Error sending meeting notifications:', err);
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  const sendCalendarInvites = useCallback(async (
    data: CalendarInviteData, 
    recipients: EmailRecipient[]
  ): Promise<boolean> => {
    setSendingCalendar(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        recipients.map(recipient => sendCalendarInvite(data, recipient))
      );
      
      const allSuccessful = results.every(result => result.success);
      
      if (!allSuccessful) {
        const failedResults = results
          .map((result, index) => ({ 
            recipient: recipients[index].email, 
            success: result.success, 
            error: result.error 
          }))
          .filter(result => !result.success);
        
        setLastNotificationResults(failedResults);
        const failedRecipients = failedResults.map(r => r.recipient).join(', ');
        setError(`Failed to send calendar invites to: ${failedRecipients}`);
      }
      
      return allSuccessful;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send calendar invites';
      setError(errorMessage);
      console.error('Error sending calendar invites:', err);
      return false;
    } finally {
      setSendingCalendar(false);
    }
  }, []);

  const generateInviteContent = useCallback((data: CalendarInviteData): string => {
    return generateCalendarInvite(data);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    lastNotificationResults,
    sending,
    sendingCalendar,
    error,
    sendNotifications,
    sendCalendarInvites,
    generateInviteContent,
    clearError,
  };
};
