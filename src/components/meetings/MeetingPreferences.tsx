/**
 * Meeting Preferences Component
 *
 * Allows users to configure their meeting preferences including platform settings,
 * recording options, and default meeting configurations.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMeetings } from '@/hooks/useMeetings';
import { MeetingPreferences } from '@/lib/services/meetingService';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Select, Alert } from '@/components/ui';
import { SaveIcon, SettingsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface MeetingPreferencesProps {
  className?: string;
}

export const MeetingPreferencesComponent: React.FC<MeetingPreferencesProps> = ({
  className = '',
}) => {
  const { user } = useAuth();
  const { 
    meetingPreferences, 
    loading, 
    saving, 
    error, 
    loadPreferences, 
    savePreferences, 
    clearError 
  } = useMeetings(user?.id);

  const [preferences, setPreferences] = useState<MeetingPreferences>({
    waiting_room: true,
    recording_enabled: false,
    default_duration: 30,
    auto_mute_participants: false,
    screen_sharing_enabled: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id, loadPreferences]);

  useEffect(() => {
    if (meetingPreferences) {
      setPreferences(meetingPreferences);
    }
  }, [meetingPreferences]);

  const handlePreferenceChange = (key: keyof MeetingPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await savePreferences(preferences);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  const handleReset = () => {
    if (meetingPreferences) {
      setPreferences(meetingPreferences);
      setHasChanges(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Preferences</h2>
          <p className="text-gray-600">Configure your default meeting settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <SettingsIcon size={20} className="text-gray-400" />
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearError}
            className="ml-2"
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Default Meeting Settings</CardTitle>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Default Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Meeting Duration (minutes)
            </label>
            <Input
              type="number"
              value={preferences.default_duration}
              onChange={(e) => handlePreferenceChange('default_duration', parseInt(e.target.value) || 30)}
              min="15"
              max="120"
              step="15"
            />
          </div>

          {/* Meeting Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Meeting Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.waiting_room}
                  onChange={(e) => handlePreferenceChange('waiting_room', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Waiting Room</span>
                  <p className="text-xs text-gray-500">Host must admit participants manually</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.recording_enabled}
                  onChange={(e) => handlePreferenceChange('recording_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Recording</span>
                  <p className="text-xs text-gray-500">Allow meeting recordings by default</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.auto_mute_participants}
                  onChange={(e) => handlePreferenceChange('auto_mute_participants', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Auto-mute Participants</span>
                  <p className="text-xs text-gray-500">Mute all participants by default</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.screen_sharing_enabled}
                  onChange={(e) => handlePreferenceChange('screen_sharing_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Screen Sharing</span>
                  <p className="text-xs text-gray-500">Allow participants to share their screen</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!hasChanges || saving}
            >
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              <SaveIcon size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
