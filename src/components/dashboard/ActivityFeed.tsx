/**
 * Activity Feed Component
 *
 * Displays recent activity and events in a timeline format.
 * Shows advocate registrations, opportunity creation, call scheduling, etc.
 */

'use client';

import React from 'react';
import { RecentActivity } from '@/lib/services/dashboardService';
import { Card, CardHeader, CardBody, CardTitle, Badge } from '@/components/ui';
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
} from '@/components/ui/icons';

interface ActivityFeedProps {
  activities: RecentActivity[];
  maxItems?: number;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 10,
  className = '',
}) => {
  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'advocate_registered':
        return <UserIcon size={16} className="text-green-500" />;
      case 'opportunity_created':
        return <BuildingOfficeIcon size={16} className="text-blue-500" />;
      case 'call_scheduled':
        return <CalendarIcon size={16} className="text-purple-500" />;
      case 'call_completed':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'deal_closed':
        return <CheckCircleIcon size={16} className="text-emerald-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };

  // Get activity badge variant based on type
  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'advocate_registered':
        return 'success';
      case 'opportunity_created':
        return 'default';
      case 'call_scheduled':
        return 'secondary';
      case 'call_completed':
        return 'success';
      case 'deal_closed':
        return 'success';
      default:
        return 'outline';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Limit activities to maxItems
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClockIcon size={20} className="mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardBody>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Activity will appear here as things happen
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <Badge
                      variant={getActivityBadgeVariant(activity.type)}
                      className="text-xs"
                    >
                      {formatTimestamp(activity.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
