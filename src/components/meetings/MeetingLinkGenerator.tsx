/**
 * Meeting Link Generator Component
 *
 * Allows users to generate meeting links for reference calls with options
 * for automatic generation or manual entry.
 */

'use client';

import React, { useState } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import { CreateMeetingOptions, createMeetingWithFallback } from '@/lib/services/meetingService';
import { MeetingNotifications } from './MeetingNotifications';
import { ManualMeetingEntry } from './ManualMeetingEntry';
import { MeetingNotificationData } from '@/lib/services/emailService';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Textarea, Alert, TabsNew, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { 
  VideoCameraIcon, 
  LinkIcon, 
  CalendarIcon, 
  UserIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MailIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface MeetingLinkGeneratorProps {
  onMeetingGenerated?: (meetingUrl: string, meetingId: string) => void;
  className?: string;
}

export const MeetingLinkGenerator: React.FC<MeetingLinkGeneratorProps> = ({
  onMeetingGenerated,
  className = '',
}) => {
  const { 
    generateMeetingLink, 
    validateLink, 
    getPlatform, 
    generating, 
    error, 
    clearError 
  } = useMeetings();

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(30);
  const [hostEmail, setHostEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [requiresManualEntry, setRequiresManualEntry] = useState(false);
  const [fallbackError, setFallbackError] = useState('');

  const handleGenerateMeeting = async () => {
    if (!meetingTitle.trim() || !scheduledAt) {
      setLinkError('Please provide meeting title and scheduled time');
      return;
    }

    clearError();
    setLinkError('');
    setRequiresManualEntry(false);
    setFallbackError('');

    try {
      const options: CreateMeetingOptions = {
        title: meetingTitle,
        description: meetingDescription,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
        host_email: hostEmail || undefined,
      };

      const result = await createMeetingWithFallback(options, (error) => {
        setFallbackError(error);
        setRequiresManualEntry(true);
      });

      if (result.meeting) {
        setGeneratedLink(result.meeting.meeting_url);
        onMeetingGenerated?.(result.meeting.meeting_url, result.meeting.meeting_id);
      } else if (result.requiresManualEntry) {
        setFallbackError(result.error || 'Automatic generation failed');
        setRequiresManualEntry(true);
      }
    } catch (err) {
      console.error('Failed to generate meeting:', err);
      setLinkError('Failed to generate meeting link. Please try manual entry.');
      setRequiresManualEntry(true);
    }
  };

  const handleManualLinkSubmit = () => {
    if (!manualLink.trim()) {
      setLinkError('Please enter a meeting link');
      return;
    }

    if (!validateLink(manualLink)) {
      setLinkError('Please enter a valid meeting link (Google Meet, Zoom, Teams, etc.)');
      return;
    }

    setLinkError('');
    setGeneratedLink(manualLink);
    onMeetingGenerated?.(manualLink, getPlatform(manualLink));
  };

  const handleReset = () => {
    setMeetingTitle('');
    setMeetingDescription('');
    setScheduledAt('');
    setDuration(30);
    setHostEmail('');
    setGeneratedLink('');
    setManualLink('');
    setUseManualEntry(false);
    setLinkError('');
    setRequiresManualEntry(false);
    setFallbackError('');
    clearError();
  };

  const meetingNotificationData: MeetingNotificationData | null = generatedLink ? {
    meetingTitle,
    meetingLink: generatedLink,
    scheduledAt,
    duration,
    hostEmail,
    prospectName: meetingTitle.split(': ')[1] || '',
    prospectEmail: hostEmail,
    timezone: 'UTC',
    meetingDescription
  } : null;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generate Meeting Link</h2>
          <p className="text-gray-600">Create a meeting link for your reference call</p>
        </div>
        <div className="flex items-center space-x-2">
          <VideoCameraIcon size={20} className="text-gray-400" />
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

      <TabsNew defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Meeting</TabsTrigger>
          <TabsTrigger value="notifications" disabled={!generatedLink}>
            <MailIcon size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Configuration</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g., Reference Call: Acme Corp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                placeholder="Brief description of the meeting"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Time *
                </label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  min="15"
                  max="120"
                  step="15"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host Email
              </label>
              <Input
                type="email"
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
                placeholder="host@company.com"
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleGenerateMeeting}
                disabled={generating || !meetingTitle.trim() || !scheduledAt}
                className="flex-1"
              >
                <VideoCameraIcon size={16} className="mr-2" />
                {generating ? 'Generating...' : 'Generate Meeting Link'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={generating}
              >
                Reset
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Manual Entry */}
        <ManualMeetingEntry 
          onMeetingLinkSet={(link, platform) => {
            setGeneratedLink(link);
            onMeetingGenerated?.(link, platform);
            setRequiresManualEntry(false);
            setFallbackError('');
          }}
        />
      </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          {meetingNotificationData && (
            <MeetingNotifications meetingData={meetingNotificationData} />
          )}
        </TabsContent>
      </TabsNew>

      {/* Generated Link Display */}
      {generatedLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckIcon size={20} className="mr-2 text-green-600" />
              Meeting Link Generated
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Platform: {getPlatform(generatedLink)}
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {generatedLink}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(generatedLink)}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {linkError && (
        <Alert variant="error">
          <ExclamationTriangleIcon size={16} className="mr-2" />
          {linkError}
        </Alert>
      )}
    </div>
  );
};
