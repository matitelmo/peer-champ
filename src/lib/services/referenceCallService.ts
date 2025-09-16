/**
 * Reference Call Service
 *
 * Provides functions for managing reference calls including scheduling,
 * tracking, feedback collection, and call management.
 */

import { supabase } from '@/lib/supabase';
import { ReferenceCall } from '@/types/database';
import { createMeeting, CreateMeetingOptions } from './meetingService';

export interface CreateReferenceCallData {
  opportunity_id: string;
  advocate_id: string;
  sales_rep_id: string;
  prospect_name: string;
  prospect_email: string;
  prospect_title?: string;
  prospect_company: string;
  scheduled_at: string;
  duration_minutes?: number;
  timezone?: string;
  meeting_link?: string;
  meeting_platform?: string;
  meeting_id?: string;
  meeting_password?: string;
  calendar_event_id?: string;
  briefing_materials?: string[];
  talking_points?: string[];
  questions_to_cover?: string[];
  advocate_briefed?: boolean;
  prospect_briefed?: boolean;
  internal_notes?: string;
  tags?: string[];
}

export interface UpdateReferenceCallData {
  prospect_name?: string;
  prospect_email?: string;
  prospect_title?: string;
  prospect_company?: string;
  scheduled_at?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  duration_minutes?: number;
  timezone?: string;
  meeting_link?: string;
  meeting_platform?: string;
  meeting_id?: string;
  meeting_password?: string;
  calendar_event_id?: string;
  status?: string;
  cancellation_reason?: string;
  reschedule_count?: number;
  briefing_materials?: string[];
  talking_points?: string[];
  questions_to_cover?: string[];
  advocate_briefed?: boolean;
  prospect_briefed?: boolean;
  call_recording_url?: string;
  call_transcript?: string;
  call_intelligence?: Record<string, any>;
  ai_summary?: string;
  key_topics_discussed?: string[];
  sentiment_score?: number;
  advocate_feedback?: Record<string, any>;
  prospect_feedback?: Record<string, any>;
  sales_rep_feedback?: Record<string, any>;
  advocate_rating?: number;
  call_quality_rating?: number;
  technical_quality_score?: number;
  business_value_score?: number;
  follow_up_required?: boolean;
  follow_up_actions?: string[];
  follow_up_completed?: boolean;
  next_steps?: string;
  reward_amount?: number;
  reward_type?: string;
  reward_status?: string;
  reward_notes?: string;
  call_outcome?: string;
  deal_impact?: string;
  next_call_recommended?: boolean;
  reference_strength?: string;
  internal_notes?: string;
  tags?: string[];
  call_preparation_time_minutes?: number;
  total_effort_score?: number;
  external_meeting_id?: string;
  external_recording_id?: string;
  crm_activity_id?: string;
}

export interface CallFeedback {
  callId: string;
  feedbackType: 'advocate' | 'prospect' | 'sales_rep';
  rating?: number;
  comments?: string;
  topics?: string[];
  challenges?: string[];
  recommendations?: string[];
  wouldRecommend?: boolean;
  additionalNotes?: string;
}

/**
 * Get all reference calls for a company
 */
export async function getReferenceCalls(
  companyId: string
): Promise<ReferenceCall[]> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('opportunities.company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
/**
 * Create a new reference call with automatic meeting link generation
 */
export async function createReferenceCallWithMeeting(
  callData: CreateReferenceCallData,
  autoGenerateMeeting: boolean = true
): Promise<ReferenceCall> {
  let meetingLink: string | undefined;
  let meetingPlatform: string | undefined;
  let meetingId: string | undefined;

  // Auto-generate meeting link if requested and not already provided
  if (autoGenerateMeeting && !callData.meeting_link) {
    try {
      const meetingOptions: CreateMeetingOptions = {
        title: `Reference Call: ${callData.prospect_company}`,
        description: `Reference call between ${callData.prospect_name} and advocate`,
        scheduled_at: callData.scheduled_at,
        duration_minutes: callData.duration_minutes || 30,
        host_email: callData.prospect_email, // Use prospect email as host
      };

      const meeting = await createMeeting(meetingOptions);
      meetingLink = meeting.meeting_url;
      meetingPlatform = meeting.platform;
      meetingId = meeting.meeting_id;
    } catch (error) {
      console.error('Failed to generate meeting link:', error);
      // Continue without meeting link - user can add manually later
    }
  }

  // Create the reference call with meeting details
  const callDataWithMeeting = {
    ...callData,
    meeting_link: meetingLink || callData.meeting_link,
    meeting_platform: meetingPlatform || callData.meeting_platform,
    meeting_id: meetingId || callData.meeting_id,
  };

  return createReferenceCall(callDataWithMeeting);
}



/**
 * Get reference call by ID
 */
export async function getReferenceCallById(
  id: string
): Promise<ReferenceCall | null> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new reference call
 */
export async function createReferenceCall(
  callData: CreateReferenceCallData
): Promise<ReferenceCall> {
  const { data, error } = await supabase
    .from('reference_calls')
    .insert(callData)
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a reference call
 */
export async function updateReferenceCall(
  id: string,
  callData: UpdateReferenceCallData
): Promise<ReferenceCall> {
  const { data, error } = await supabase
    .from('reference_calls')
    .update(callData)
    .eq('id', id)
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a reference call
 */
export async function deleteReferenceCall(id: string): Promise<void> {
  const { error } = await supabase
    .from('reference_calls')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get reference calls by status
 */
export async function getReferenceCallsByStatus(
  companyId: string,
  status: string
): Promise<ReferenceCall[]> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('opportunities.company_id', companyId)
    .eq('status', status)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get upcoming reference calls
 */
export async function getUpcomingReferenceCalls(
  companyId: string,
  limit: number = 10
): Promise<ReferenceCall[]> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('opportunities.company_id', companyId)
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get reference calls for a specific advocate
 */
export async function getReferenceCallsForAdvocate(
  advocateId: string
): Promise<ReferenceCall[]> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('advocate_id', advocateId)
    .order('scheduled_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get reference calls for a specific opportunity
 */
export async function getReferenceCallsForOpportunity(
  opportunityId: string
): Promise<ReferenceCall[]> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      *,
      opportunities!inner(opportunity_name, prospect_company, company_id),
      advocates!inner(name, company_name, company_id)
    `
    )
    .eq('opportunity_id', opportunityId)
    .order('scheduled_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Update call status
 */
export async function updateCallStatus(
  id: string,
  status: string,
  additionalData?: Partial<UpdateReferenceCallData>
): Promise<ReferenceCall> {
  const updateData: UpdateReferenceCallData = {
    status,
    ...additionalData,
  };

  return updateReferenceCall(id, updateData);
}

/**
 * Start a reference call
 */
export async function startReferenceCall(id: string): Promise<ReferenceCall> {
  return updateCallStatus(id, 'in_progress', {
    actual_start_time: new Date().toISOString(),
  });
}

/**
 * End a reference call
 */
export async function endReferenceCall(
  id: string,
  endTime?: string
): Promise<ReferenceCall> {
  return updateCallStatus(id, 'completed', {
    actual_end_time: endTime || new Date().toISOString(),
  });
}

/**
 * Cancel a reference call
 */
export async function cancelReferenceCall(
  id: string,
  reason: string
): Promise<ReferenceCall> {
  return updateCallStatus(id, 'cancelled', {
    cancellation_reason: reason,
  });
}

/**
 * Reschedule a reference call
 */
export async function rescheduleReferenceCall(
  id: string,
  newScheduledAt: string,
  reason?: string
): Promise<ReferenceCall> {
  // Get current call to increment reschedule count
  const currentCall = await getReferenceCallById(id);
  const rescheduleCount = (currentCall?.reschedule_count || 0) + 1;

  return updateReferenceCall(id, {
    scheduled_at: newScheduledAt,
    reschedule_count: rescheduleCount,
    status: 'scheduled',
    cancellation_reason: reason,
  });
}

/**
 * Submit call feedback
 */
export async function submitCallFeedback(
  feedback: CallFeedback
): Promise<ReferenceCall> {
  const { callId, feedbackType, ...feedbackData } = feedback;

  const updateData: UpdateReferenceCallData = {};

  switch (feedbackType) {
    case 'advocate':
      updateData.advocate_feedback = feedbackData;
      if (feedback.rating) updateData.advocate_rating = feedback.rating;
      break;
    case 'prospect':
      updateData.prospect_feedback = feedbackData;
      break;
    case 'sales_rep':
      updateData.sales_rep_feedback = feedbackData;
      if (feedback.rating) updateData.call_quality_rating = feedback.rating;
      break;
  }

  return updateReferenceCall(callId, updateData);
}

/**
 * Get call statistics for a company
 */
export async function getCallStatistics(companyId: string): Promise<{
  totalCalls: number;
  completedCalls: number;
  cancelledCalls: number;
  upcomingCalls: number;
  averageRating: number;
  averageDuration: number;
  totalDuration: number;
}> {
  const { data, error } = await supabase
    .from('reference_calls')
    .select(
      `
      status,
      advocate_rating,
      duration_minutes,
      actual_start_time,
      actual_end_time,
      opportunities!inner(company_id)
    `
    )
    .eq('opportunities.company_id', companyId);

  if (error) throw error;

  const totalCalls = data.length;
  const completedCalls = data.filter(
    (call) => call.status === 'completed'
  ).length;
  const cancelledCalls = data.filter(
    (call) => call.status === 'cancelled'
  ).length;
  const upcomingCalls = data.filter(
    (call) => call.status === 'scheduled'
  ).length;

  const ratings = data
    .filter((call) => call.advocate_rating !== null)
    .map((call) => call.advocate_rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  const durations = data
    .filter((call) => call.duration_minutes !== null)
    .map((call) => call.duration_minutes);
  const averageDuration =
    durations.length > 0
      ? durations.reduce((sum, duration) => sum + duration, 0) /
        durations.length
      : 0;

  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

  return {
    totalCalls,
    completedCalls,
    cancelledCalls,
    upcomingCalls,
    averageRating: Math.round(averageRating * 10) / 10,
    averageDuration: Math.round(averageDuration),
    totalDuration,
  };
}
