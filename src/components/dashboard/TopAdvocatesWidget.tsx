/**
 * Top Advocates Widget Component
 *
 * Displays top performing advocates with their key metrics
 * and performance indicators.
 */

'use client';

import React from 'react';
import { TopAdvocate } from '@/lib/services/dashboardService';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Button,
} from '@/components/ui';
import {
  UsersIcon,
  StarIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EyeIcon,
} from '@/components/ui/icons';

interface TopAdvocatesWidgetProps {
  advocates: TopAdvocate[];
  maxItems?: number;
  className?: string;
}

export const TopAdvocatesWidget: React.FC<TopAdvocatesWidgetProps> = ({
  advocates,
  maxItems = 5,
  className = '',
}) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get performance badge variant based on rating
  const getPerformanceBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 4.0) return 'default';
    if (rating >= 3.0) return 'warning';
    return 'destructive';
  };

  // Get availability badge variant
  const getAvailabilityBadgeVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'default';
    if (score >= 40) return 'warning';
    return 'destructive';
  };

  // Limit advocates to maxItems
  const displayAdvocates = advocates.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UsersIcon size={20} className="mr-2" />
          Top Performing Advocates
        </CardTitle>
      </CardHeader>
      <CardBody>
        {displayAdvocates.length === 0 ? (
          <div className="text-center py-8">
            <UsersIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No advocates yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Top performing advocates will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayAdvocates.map((advocate, index) => (
              <div
                key={advocate.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {advocate.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Company Name
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<EyeIcon size={14} />}
                  >
                    View
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon size={16} className="text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {advocate.total_calls}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Calls Completed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StarIcon size={16} className="text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {advocate.average_rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Average Rating
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(0)} earned
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getPerformanceBadgeVariant(
                        advocate.average_rating
                      )}
                    >
                      {advocate.average_rating.toFixed(1)}★
                    </Badge>
                    <Badge
                      variant={getAvailabilityBadgeVariant(
                        85
                      )}
                    >
                      {85}% available
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
