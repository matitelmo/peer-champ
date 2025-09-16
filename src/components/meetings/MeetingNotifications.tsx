/**
 * Meeting Notifications Component
 *
 * Component for sending meeting notifications and calendar invites
 * to all participants in a reference call.
 */

'use client';

import React, { useState } from 'react';
import { useMeetingNotifications } from '@/hooks/useMeetingNotifications';
import { MeetingNotificationData, CalendarInviteData, EmailRecipient } from '@/lib/services/emailService';
import { Button, Card, CardHeader, CardTitle, CardBody, Alert, Badge } from '@/components/ui';
import { 
  MailIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  UserIcon,
  ClockIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface MeetingNotificationsProps {
  meetingData: MeetingNotificationData;
  className?: string;
}

export const MeetingNotifications: React.FC<MeetingNotificationsProps> = ({
  meetingData,
  className = '',
}) => {
  const {
    lastNotificationResults,
    sending,
    sendingCalendar,
    error,
    sendNotifications,
    sendCalendarInvites,
    clearError,
  } = useMeetingNotifications();

  const [notificationsSent, setNotificationsSent] = useState(false);
  const [calendarInvitesSent, setCalendarInvitesSent] = useState(false);

  const handleSendNotifications = async () => {
    const success = await sendNotifications(meetingData);
    if (success) {
      setNotificationsSent(true);
    }
  };

  const handleSendCalendarInvites = async () => {
    const recipients: EmailRecipient[] = [];
    
    if (meetingData.prospectEmail) {
      recipients.push({ email: meetingData.prospectEmail, name: meetingData.prospectName });
    }
    if (meetingData.advocateEmail) {
      recipients.push({ email: meetingData.advocateEmail, name: meetingData.advocateName });
    }
    if (meetingData.salesRepEmail) {
      recipients.push({ email: meetingData.salesRepEmail, name: meetingData.salesRepName });
    }

    if (recipients.length === 0) {
      return;
    }

    const calendarData: CalendarInviteData = {
      title: meetingData.meetingTitle,
      description: meetingData.meetingDescription || `Reference call between ${meetingData.prospectName} and ${meetingData.advocateName}`,
      startTime: meetingData.scheduledAt,
      endTime: new Date(new Date(meetingData.scheduledAt).getTime() + meetingData.duration * 60000).toISOString(),
      meetingLink: meetingData.meetingLink,
      attendees: recipients,
      organizer: { email: meetingData.salesRepEmail || 'noreply@peerchamps.com', name: meetingData.salesRepName },
      timezone: meetingData.timezone,
    };

    const success = await sendCalendarInvites(calendarData, recipients);
    if (success) {
      setCalendarInvitesSent(true);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircleIcon size={16} className="text-green-600" />
    ) : (
      <ExclamationTriangleIcon size={16} className="text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'success' : 'destructive'} className="ml-2">
        {success ? 'Sent' : 'Failed'}
      </Badge>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Notifications</h2>
          <p className="text-gray-600">Send meeting details and calendar invites to participants</p>
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

      {/* Meeting Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClockIcon size={20} className="mr-2" />
            Meeting Details
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Title</p>
              <p className="text-gray-900">{meetingData.meetingTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
              <p className="text-gray-900">
                {new Date(meetingData.scheduledAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Duration</p>
              <p className="text-gray-900">{meetingData.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Meeting Link</p>
              <p className="text-blue-600 break-all">{meetingData.meetingLink}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Participants</p>
            <div className="space-y-2">
              {meetingData.prospectEmail && (
                <div className="flex items-center">
                  <UserIcon size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm">{meetingData.prospectName} ({meetingData.prospectEmail})</span>
                  <Badge variant="default" className="ml-2">Prospect</Badge>
                </div>
              )}
              {meetingData.advocateEmail && (
                <div className="flex items-center">
                  <UserIcon size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm">{meetingData.advocateName} ({meetingData.advocateEmail})</span>
                  <Badge variant="default" className="ml-2">Advocate</Badge>
                </div>
              )}
              {meetingData.salesRepEmail && (
                <div className="flex items-center">
                  <UserIcon size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm">{meetingData.salesRepName} ({meetingData.salesRepEmail})</span>
                  <Badge variant="default" className="ml-2">Sales Rep</Badge>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notification Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MailIcon size={20} className="mr-2" />
              Email Notifications
              {notificationsSent && (
                <Badge variant="success" className="ml-2">Sent</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600 mb-4">
              Send detailed meeting information to all participants via email.
            </p>
            <Button 
              onClick={handleSendNotifications}
              disabled={sending || notificationsSent}
              className="w-full"
            >
              <MailIcon size={16} className="mr-2" />
              {sending ? 'Sending...' : notificationsSent ? 'Notifications Sent' : 'Send Email Notifications'}
            </Button>
          </CardBody>
        </Card>

        {/* Calendar Invites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              Calendar Invites
              {calendarInvitesSent && (
                <Badge variant="success" className="ml-2">Sent</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600 mb-4">
              Send calendar invites to add the meeting to participants' calendars.
            </p>
            <Button 
              onClick={handleSendCalendarInvites}
              disabled={sendingCalendar || calendarInvitesSent}
              className="w-full"
            >
              <CalendarIcon size={16} className="mr-2" />
              {sendingCalendar ? 'Sending...' : calendarInvitesSent ? 'Invites Sent' : 'Send Calendar Invites'}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Notification Results */}
      {lastNotificationResults && lastNotificationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Results</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {lastNotificationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(result.success)}
                    <span className="ml-2 text-sm font-medium">
                      {result.recipient}
                    </span>
                  </div>
                  {getStatusBadge(result.success)}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
