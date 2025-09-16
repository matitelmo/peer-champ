-- Migration: Create user_settings table
-- This migration creates the user_settings table for storing user preferences and configurations

-- User Settings table
-- Stores user-specific preferences and settings including meeting preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Meeting preferences
  meeting_preferences JSONB DEFAULT '{
    "waiting_room": true,
    "recording_enabled": false,
    "default_duration": 30,
    "auto_mute_participants": false,
    "screen_sharing_enabled": true
  }',
  
  -- General preferences
  notification_preferences JSONB DEFAULT '{
    "email_notifications": true,
    "push_notifications": true,
    "meeting_reminders": true,
    "call_updates": true
  }',
  
  -- UI preferences
  ui_preferences JSONB DEFAULT '{
    "theme": "light",
    "timezone": "UTC",
    "date_format": "MM/DD/YYYY",
    "time_format": "12h"
  }',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one settings record per user
  UNIQUE(user_id)
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "users_can_view_own_settings" ON user_settings
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "users_can_update_own_settings" ON user_settings
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "users_can_insert_own_settings" ON user_settings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Comments for documentation
COMMENT ON TABLE user_settings IS 'User-specific preferences and settings including meeting configurations';
COMMENT ON COLUMN user_settings.meeting_preferences IS 'Meeting-related preferences like waiting room, recording, etc.';
COMMENT ON COLUMN user_settings.notification_preferences IS 'User notification preferences for emails, pushes, etc.';
COMMENT ON COLUMN user_settings.ui_preferences IS 'UI customization preferences like theme, timezone, etc.';
