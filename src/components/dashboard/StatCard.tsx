/**
 * Stat Card Component
 *
 * Reusable component for displaying key metrics and statistics
 * with optional trend indicators and formatting.
 */

'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui';
import { TrendingUpIcon, TrendingDownIcon } from '@/components/ui/icons';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  } | null;
  format?: 'number' | 'currency' | 'percentage';
  maxValue?: number;
  unit?: string;
  color?:
    | 'blue'
    | 'green'
    | 'purple'
    | 'yellow'
    | 'red'
    | 'indigo'
    | 'emerald'
    | 'orange';
  className?: string;
}

const colorClasses = {
  blue: {
    icon: 'text-blue-600',
    value: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  green: {
    icon: 'text-green-600',
    value: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  purple: {
    icon: 'text-purple-600',
    value: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  yellow: {
    icon: 'text-yellow-600',
    value: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  red: {
    icon: 'text-red-600',
    value: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  indigo: {
    icon: 'text-indigo-600',
    value: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  emerald: {
    icon: 'text-emerald-600',
    value: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  orange: {
    icon: 'text-orange-600',
    value: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  format = 'number',
  maxValue,
  unit,
  color = 'blue',
  className = '',
}) => {
  // Format the value based on the format type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'number':
      default:
        if (unit) {
          return `${val} ${unit}`;
        }
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  // Calculate percentage if maxValue is provided
  const percentage = maxValue ? (value / maxValue) * 100 : null;

  const colorClass = colorClasses[color];

  return (
    <Card className={`${className}`}>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {icon && (
                <div
                  className={`p-2 rounded-lg ${colorClass.bg} ${colorClass.border} border`}
                >
                  <div className={colorClass.icon}>{icon}</div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold ${colorClass.value}`}>
                {formatValue(value)}
              </span>
              {trend && (
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    trend.direction === 'up'
                      ? 'text-green-600'
                      : trend.direction === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {trend.direction === 'up' && <TrendingUpIcon size={16} />}
                  {trend.direction === 'down' && <TrendingDownIcon size={16} />}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            {/* Progress bar for percentage-based values */}
            {percentage !== null && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colorClass.bg.replace('50', '500')}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{maxValue}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
