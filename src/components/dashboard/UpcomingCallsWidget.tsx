/**
 * Upcoming Calls Widget Component
 *
 * Displays upcoming reference calls with scheduling information
 * and quick access to call details.
 */

'use client';

import React from 'react';
import { UpcomingCall } from '@/lib/services/dashboardService';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Button,
} from '@/components/ui';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  ExternalLinkIcon,
  PhoneIcon,
  UserIcon,
} from '@/components/ui/icons';

interface UpcomingCallsWidgetProps {
  calls: UpcomingCall[];
  maxItems?: number;
  className?: string;
}

export const UpcomingCallsWidget: React.FC<UpcomingCallsWidgetProps> = ({
  calls,
  maxItems = 5,
  className = '',
}) => {
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Format date
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    // Format time
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Add relative time
    let relativeTime = '';
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      relativeTime = `in ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      relativeTime = `in ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      relativeTime = 'tomorrow';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      relativeTime = `in ${diffInDays}d`;
    }

    return {
      date: dateStr,
      time: timeStr,
      relative: relativeTime,
    };
  };

  // Get urgency badge variant
  const getUrgencyBadgeVariant = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 2) {
      return 'destructive'; // Urgent - less than 2 hours
    } else if (diffInHours < 24) {
      return 'warning'; // Soon - less than 24 hours
    } else {
      return 'secondary'; // Normal
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'zoom':
      case 'teams':
      case 'google meet':
      case 'webex':
        return <VideoCameraIcon size={16} />;
      default:
        return <PhoneIcon size={16} />;
    }
  };

  // Limit calls to maxItems
  const displayCalls = calls.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon size={20} className="mr-2" />
          Upcoming Calls
        </CardTitle>
      </CardHeader>
      <CardBody>
        {displayCalls.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No upcoming calls
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Reference calls will appear here when scheduled
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayCalls.map((call) => {
              const dateTime = formatDateTime(call.scheduled_at);

              return (
                <div
                  key={call.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {call.opportunity_name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {call.prospect_company}
                      </p>
                    </div>
                    <Badge variant={getUrgencyBadgeVariant(call.scheduled_at)}>
                      {dateTime.relative}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <UserIcon size={14} />
                      <span>Advocate: {call.advocate_name}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <ClockIcon size={14} />
                      <span>
                        {dateTime.date} at {dateTime.time}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      {getPlatformIcon(call.meeting_platform)}
                      <span>
                        {call.meeting_platform} • {call.duration_minutes} min
                      </span>
                    </div>
                  </div>

                  {call.meeting_link && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<ExternalLinkIcon size={14} />}
                        onClick={() => window.open(call.meeting_link, '_blank')}
                      >
                        Join Call
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
