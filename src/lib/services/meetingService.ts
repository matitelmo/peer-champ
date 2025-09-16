/**
 * Meeting Service
 *
 * Provides functions for generating meeting links and managing video conferencing
 * integrations including Google Meet, Zoom, and Teams.
 */

import { supabase } from '@/lib/supabase';

export interface MeetingPreferences {
  waiting_room: boolean;
  recording_enabled: boolean;
  default_duration: number; // minutes
  auto_mute_participants: boolean;
  screen_sharing_enabled: boolean;
}

export interface MeetingLink {
  meeting_url: string;
  meeting_id: string;
  password?: string;
  platform: 'google_meet' | 'zoom' | 'teams' | 'webex' | 'other';
  expires_at?: string;
  host_email?: string;
}

export interface CreateMeetingOptions {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
  host_email?: string;
  participants?: string[];
  preferences?: Partial<MeetingPreferences>;
}

/**
 * Generate a Google Meet link for a scheduled call
 * For MVP, we'll use the simple Google Meet link format
 */
export async function generateGoogleMeetLink(
  options: CreateMeetingOptions
): Promise<MeetingLink> {
  try {
    // For MVP, we'll generate a simple Google Meet link
    // In production, this would integrate with Google Meet API
    
    const meetingId = generateMeetingId();
    const meetingUrl = `https://meet.google.com/${meetingId}`;
    
    // Generate a simple meeting ID (in production, this would come from Google API)
    const meetingLink: MeetingLink = {
      meeting_url: meetingUrl,
      meeting_id: meetingId,
      platform: 'google_meet',
      host_email: options.host_email,
    };

    // Log the meeting creation for debugging
    console.log('Generated Google Meet link:', {
      meetingId,
      meetingUrl,
      title: options.title,
      scheduled_at: options.scheduled_at,
    });

    return meetingLink;
  } catch (error) {
    console.error('Error generating Google Meet link:', error);
    throw new Error('Failed to generate meeting link');
  }
}

/**
 * Generate a simple meeting ID for Google Meet
 * In production, this would be replaced with actual Google Meet API calls
 */
function generateMeetingId(): string {
  // Generate a random string that looks like a Google Meet ID
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a meeting with automatic link generation and fallback options
 */
export async function createMeeting(
  options: CreateMeetingOptions,
  fallbackOptions?: {
    allowManualEntry?: boolean;
    preferredPlatform?: string;
    retryAttempts?: number;
  }
): Promise<MeetingLink> {
  const { allowManualEntry = true, preferredPlatform = 'google_meet', retryAttempts = 1 } = fallbackOptions || {};
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      // For MVP, we'll use Google Meet as the default platform
      return await generateGoogleMeetLink(options);
    } catch (error) {
      lastError = error as Error;
      console.error(`Meeting creation attempt ${attempt} failed:`, error);
      
      if (attempt < retryAttempts) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // If all attempts failed and manual entry is allowed, throw a specific error
  if (allowManualEntry) {
    throw new Error(`Failed to generate meeting link automatically. Please use manual entry. Original error: ${lastError?.message}`);
  }
  
  throw lastError || new Error('Failed to create meeting');
}

/**
 * Create a meeting with fallback to manual entry
 */
export async function createMeetingWithFallback(
  options: CreateMeetingOptions,
  onFallbackRequired?: (error: string) => void
): Promise<{ meeting: MeetingLink | null; requiresManualEntry: boolean; error?: string }> {
  try {
    const meeting = await createMeeting(options, { allowManualEntry: true, retryAttempts: 2 });
    return { meeting, requiresManualEntry: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('Automatic meeting generation failed, fallback to manual entry required');
    
    if (onFallbackRequired) {
      onFallbackRequired(errorMessage);
    }
    
    return { 
      meeting: null, 
      requiresManualEntry: true, 
      error: errorMessage 
    };
  }
}

export interface UpdateMeetingOptions {
  title?: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  host_email?: string;
  participants?: string[];
}

export interface MeetingUpdateResult {
  success: boolean;
  meeting?: MeetingLink;
  requiresNewLink?: boolean;
  error?: string;
}

/**
 * Update meeting details
 */
export async function updateMeeting(
  meetingId: string,
  platform: string,
  updates: UpdateMeetingOptions
): Promise<MeetingUpdateResult> {
  try {
    console.log('Updating meeting:', { meetingId, platform, updates });

    // For MVP, we'll handle updates differently based on platform
    if (platform === 'google_meet') {
      // Google Meet links are generally static, but we can regenerate if needed
      if (updates.scheduled_at || updates.duration_minutes) {
        // For time changes, we might need to regenerate the link
        return {
          success: true,
          requiresNewLink: true,
          meeting: {
            meeting_url: `https://meet.google.com/${meetingId}`,
            meeting_id: meetingId,
            platform: 'google_meet' as const,
            host_email: updates.host_email,
          }
        };
      }
    }

    // For other platforms or simple updates, return success
    return {
      success: true,
      meeting: {
        meeting_url: `https://meet.google.com/${meetingId}`,
        meeting_id: meetingId,
        platform: platform as any,
        host_email: updates.host_email,
      }
    };
  } catch (error) {
    console.error('Error updating meeting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Cancel a meeting
 */
export async function cancelMeeting(
  meetingId: string,
  platform: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Cancelling meeting:', { meetingId, platform });

    // For MVP, we'll just log the cancellation
    // In production, this would cancel the meeting via the platform API
    
    // Log the cancellation for audit purposes
    const { error: logError } = await supabase
      .from('meeting_logs')
      .insert({
        meeting_id: meetingId,
        platform,
        action: 'cancelled',
        timestamp: new Date().toISOString(),
      });

    if (logError) {
      console.error('Error logging meeting cancellation:', logError);
      // Don't fail the cancellation if logging fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling meeting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get user meeting preferences
 */
export async function getUserMeetingPreferences(
  userId: string
): Promise<MeetingPreferences> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('meeting_preferences')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    // Return default preferences if none exist
    const defaultPreferences: MeetingPreferences = {
      waiting_room: true,
      recording_enabled: false,
      default_duration: 30,
      auto_mute_participants: false,
      screen_sharing_enabled: true,
    };

    return data?.meeting_preferences || defaultPreferences;
  } catch (error) {
    console.error('Error getting user meeting preferences:', error);
    // Return default preferences on error
    return {
      waiting_room: true,
      recording_enabled: false,
      default_duration: 30,
      auto_mute_participants: false,
      screen_sharing_enabled: true,
    };
  }
}

/**
 * Save user meeting preferences
 */
export async function saveUserMeetingPreferences(
  userId: string,
  preferences: MeetingPreferences
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        meeting_preferences: preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving user meeting preferences:', error);
    throw error;
  }
}

/**
 * Validate meeting link format
 */
export function validateMeetingLink(link: string): boolean {
  try {
    const url = new URL(link);
    
    // Check if it's a valid meeting platform URL
    const validDomains = [
      'meet.google.com',
      'zoom.us',
      'teams.microsoft.com',
      'webex.com',
    ];
    
    return validDomains.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Extract platform from meeting URL
 */
export function getPlatformFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname.includes('meet.google.com')) return 'google_meet';
    if (hostname.includes('zoom.us')) return 'zoom';
    if (hostname.includes('teams.microsoft.com')) return 'teams';
    if (hostname.includes('webex.com')) return 'webex';
    
    return 'other';
  } catch {
    return 'other';
  }
}
