/**
 * Meeting Update Service
 *
 * Handles meeting updates, cancellations, and notifications for all participants.
 */

import { supabase } from '@/lib/supabase';
import { updateMeeting, cancelMeeting, UpdateMeetingOptions, MeetingUpdateResult } from './meetingService';
import { sendMeetingNotifications, MeetingNotificationData } from './emailService';
import { ReferenceCall } from '@/types/database';

export interface MeetingUpdateData {
  referenceCallId: string;
  meetingId: string;
  platform: string;
  updates: UpdateMeetingOptions;
  notifyParticipants?: boolean;
}

export interface MeetingCancellationData {
  referenceCallId: string;
  meetingId: string;
  platform: string;
  reason?: string;
  notifyParticipants?: boolean;
}

export interface MeetingUpdateNotification {
  type: 'update' | 'cancellation';
  referenceCall: ReferenceCall;
  meetingId: string;
  platform: string;
  changes?: UpdateMeetingOptions;
  reason?: string;
}

/**
 * Update a meeting and notify all participants
 */
export async function updateMeetingWithNotifications(
  updateData: MeetingUpdateData
): Promise<{ success: boolean; error?: string; requiresNewLink?: boolean }> {
  try {
    const { referenceCallId, meetingId, platform, updates, notifyParticipants = true } = updateData;

    // Get the reference call details
    const { data: referenceCall, error: callError } = await supabase
      .from('reference_calls')
      .select('*')
      .eq('id', referenceCallId)
      .single();

    if (callError || !referenceCall) {
      throw new Error('Reference call not found');
    }

    // Update the meeting
    const updateResult = await updateMeeting(meetingId, platform, updates);
    
    if (!updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update meeting');
    }

    // Update the reference call in the database
    const { error: dbError } = await supabase
      .from('reference_calls')
      .update({
        scheduled_at: updates.scheduled_at || referenceCall.scheduled_at,
        duration_minutes: updates.duration_minutes || referenceCall.duration_minutes,
        meeting_link: updateResult.meeting?.meeting_url || referenceCall.meeting_link,
        updated_at: new Date().toISOString(),
      })
      .eq('id', referenceCallId);

    if (dbError) {
      throw new Error('Failed to update reference call in database');
    }

    // Log the update
    await logMeetingAction(meetingId, platform, 'updated', referenceCallId, {
      changes: updates,
      previousData: {
        scheduled_at: referenceCall.scheduled_at,
        duration_minutes: referenceCall.duration_minutes,
      }
    });

    // Send notifications if requested
    if (notifyParticipants) {
      await sendMeetingUpdateNotifications({
        type: 'update',
        referenceCall,
        meetingId,
        platform,
        changes: updates,
      });
    }

    return {
      success: true,
      requiresNewLink: updateResult.requiresNewLink,
    };
  } catch (error) {
    console.error('Error updating meeting with notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cancel a meeting and notify all participants
 */
export async function cancelMeetingWithNotifications(
  cancellationData: MeetingCancellationData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { referenceCallId, meetingId, platform, reason, notifyParticipants = true } = cancellationData;

    // Get the reference call details
    const { data: referenceCall, error: callError } = await supabase
      .from('reference_calls')
      .select('*')
      .eq('id', referenceCallId)
      .single();

    if (callError || !referenceCall) {
      throw new Error('Reference call not found');
    }

    // Cancel the meeting
    const cancelResult = await cancelMeeting(meetingId, platform);
    
    if (!cancelResult.success) {
      throw new Error(cancelResult.error || 'Failed to cancel meeting');
    }

    // Update the reference call status
    const { error: dbError } = await supabase
      .from('reference_calls')
      .update({
        status: 'cancelled',
        internal_notes: `Meeting cancelled${reason ? `: ${reason}` : ''}. Original notes: ${referenceCall.internal_notes || ''}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', referenceCallId);

    if (dbError) {
      throw new Error('Failed to update reference call status');
    }

    // Log the cancellation
    await logMeetingAction(meetingId, platform, 'cancelled', referenceCallId, {
      reason,
    });

    // Send notifications if requested
    if (notifyParticipants) {
      await sendMeetingUpdateNotifications({
        type: 'cancellation',
        referenceCall,
        meetingId,
        platform,
        reason,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling meeting with notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send notifications for meeting updates or cancellations
 */
async function sendMeetingUpdateNotifications(
  notification: MeetingUpdateNotification
): Promise<void> {
  try {
    const { type, referenceCall, meetingId, platform } = notification;

    // Prepare notification data
    const notificationData: MeetingNotificationData = {
      meetingTitle: `Reference Call: ${referenceCall.prospect_company}`,
      meetingLink: referenceCall.meeting_link || '',
      scheduledAt: referenceCall.scheduled_at || new Date().toISOString(),
      duration: referenceCall.duration_minutes || 30,
      timezone: referenceCall.timezone || 'UTC',
      meetingDescription: `Reference call between ${referenceCall.prospect_name} and advocate`,
      prospectName: referenceCall.prospect_name || undefined,
      prospectEmail: referenceCall.prospect_email || undefined,
      prospectCompany: referenceCall.prospect_company || undefined,
      // Add advocate and sales rep details if available
    };

    // Send different types of notifications based on the action
    if (type === 'update') {
      await sendMeetingUpdateNotification(notificationData, notification.changes);
    } else if (type === 'cancellation') {
      await sendMeetingCancellationNotification(notificationData, notification.reason);
    }
  } catch (error) {
    console.error('Error sending meeting update notifications:', error);
    // Don't throw - notifications are not critical for the main operation
  }
}

/**
 * Send meeting update notification
 */
async function sendMeetingUpdateNotification(
  meetingData: MeetingNotificationData,
  changes?: UpdateMeetingOptions
): Promise<void> {
  // For MVP, we'll just log the notification
  // In production, this would send actual email notifications
  console.log('Meeting update notification:', {
    meetingData,
    changes,
  });

  // TODO: Implement actual email sending for meeting updates
  // This would involve:
  // 1. Generating updated iCalendar invites
  // 2. Sending emails to all participants
  // 3. Including change summary in the email body
}

/**
 * Send meeting cancellation notification
 */
async function sendMeetingCancellationNotification(
  meetingData: MeetingNotificationData,
  reason?: string
): Promise<void> {
  // For MVP, we'll just log the notification
  // In production, this would send actual cancellation emails
  console.log('Meeting cancellation notification:', {
    meetingData,
    reason,
  });

  // TODO: Implement actual email sending for meeting cancellations
  // This would involve:
  // 1. Sending cancellation emails to all participants
  // 2. Including reason for cancellation
  // 3. Offering rescheduling options if appropriate
}

/**
 * Log meeting actions for audit purposes
 */
async function logMeetingAction(
  meetingId: string,
  platform: string,
  action: string,
  referenceCallId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('meeting_logs')
      .insert({
        meeting_id: meetingId,
        platform,
        action,
        reference_call_id: referenceCallId,
        details: details || {},
      });

    if (error) {
      console.error('Error logging meeting action:', error);
      // Don't throw - logging is not critical for the main operation
    }
  } catch (error) {
    console.error('Error logging meeting action:', error);
    // Don't throw - logging is not critical for the main operation
  }
}

/**
 * Get meeting history for a reference call
 */
export async function getMeetingHistory(referenceCallId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('meeting_logs')
      .select('*')
      .eq('reference_call_id', referenceCallId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting meeting history:', error);
    return [];
  }
}
