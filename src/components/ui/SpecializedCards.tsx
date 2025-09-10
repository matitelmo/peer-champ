/**
 * Specialized Card Components
 *
 * Pre-built card components for common use cases like stats, profiles, and feature cards.
 * These components extend the base Card component with specific layouts and styling.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from './Card';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  CheckIcon,
  AlertTriangleIcon,
  InfoIcon,
} from './icons';

// Stat Card Props
export interface StatCardProps {
  /** Stat title */
  title: string;
  /** Stat value */
  value: string | number;
  /** Stat description or subtitle */
  description?: string;
  /** Change value (positive or negative) */
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  /** Icon to display */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the card is loading */
  loading?: boolean;
}

// Stat Card component
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  change,
  icon,
  className,
  onClick,
  loading = false,
}) => {
  const getChangeIcon = () => {
    if (!change) return null;

    switch (change.type) {
      case 'increase':
        return <TrendingUpIcon className="h-4 w-4 text-success-500" />;
      case 'decrease':
        return <TrendingDownIcon className="h-4 w-4 text-error-500" />;
      default:
        return <InfoIcon className="h-4 w-4 text-secondary-500" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';

    switch (change.type) {
      case 'increase':
        return 'text-success-600 dark:text-success-400';
      case 'decrease':
        return 'text-error-600 dark:text-error-400';
      default:
        return 'text-secondary-600 dark:text-secondary-400';
    }
  };

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-20"></div>
              <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-16"></div>
            </div>
            <div className="h-8 w-8 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              {value}
            </p>
            {description && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {description}
              </p>
            )}
            {change && (
              <div
                className={cn(
                  'flex items-center space-x-1 text-sm',
                  getChangeColor()
                )}
              >
                {getChangeIcon()}
                <span>{change.value}</span>
                {change.period && (
                  <span className="text-secondary-500 dark:text-secondary-400">
                    {change.period}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="h-8 w-8 text-secondary-400 dark:text-secondary-500">
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// Profile Card Props
export interface ProfileCardProps {
  /** User name */
  name: string;
  /** User title or role */
  title?: string;
  /** User email */
  email?: string;
  /** Avatar image URL */
  avatar?: string;
  /** Avatar fallback text */
  avatarFallback?: string;
  /** User status */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Additional info */
  info?: string;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// Profile Card component
export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  email,
  avatar,
  avatarFallback,
  status,
  info,
  actions,
  className,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-success-500';
      case 'away':
        return 'bg-warning-500';
      case 'busy':
        return 'bg-error-500';
      default:
        return 'bg-secondary-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={cn(
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <CardBody>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {avatarFallback || getInitials(name)}
                </span>
              </div>
            )}
            {status && (
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-secondary-800',
                  getStatusColor()
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
              {name}
            </h3>
            {title && (
              <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate">
                {title}
              </p>
            )}
            {email && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                {email}
              </p>
            )}
            {info && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                {info}
              </p>
            )}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      </CardBody>
    </Card>
  );
};

// Feature Card Props
export interface FeatureCardProps {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Feature icon */
  icon?: React.ReactNode;
  /** Feature status */
  status?: 'available' | 'coming-soon' | 'beta' | 'deprecated';
  /** Feature benefits */
  benefits?: string[];
  /** Action button */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// Feature Card component
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  status = 'available',
  benefits,
  action,
  className,
  onClick,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400">
            Coming Soon
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
            Beta
          </span>
        );
      case 'deprecated':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400">
            Deprecated
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        'h-full',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        status === 'deprecated' && 'opacity-60',
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="h-8 w-8 text-primary-600 dark:text-primary-400">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <CardDescription className="mb-4">{description}</CardDescription>
        {benefits && benefits.length > 0 && (
          <ul className="space-y-2 mb-4">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400"
              >
                <CheckIcon className="h-4 w-4 text-success-500 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
      {action && <div className="px-6 pb-6">{action}</div>}
    </Card>
  );
};

// Alert Card Props
export interface AlertCardProps {
  /** Alert title */
  title: string;
  /** Alert message */
  message: string;
  /** Alert type */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Alert actions */
  actions?: React.ReactNode;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// Alert Card component
export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  message,
  type = 'info',
  actions,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-success-200 dark:border-success-800',
          background: 'bg-success-50 dark:bg-success-900/20',
          icon: <CheckIcon className="h-5 w-5 text-success-500" />,
          title: 'text-success-800 dark:text-success-200',
          message: 'text-success-700 dark:text-success-300',
        };
      case 'warning':
        return {
          border: 'border-warning-200 dark:border-warning-800',
          background: 'bg-warning-50 dark:bg-warning-900/20',
          icon: <AlertTriangleIcon className="h-5 w-5 text-warning-500" />,
          title: 'text-warning-800 dark:text-warning-200',
          message: 'text-warning-700 dark:text-warning-300',
        };
      case 'error':
        return {
          border: 'border-error-200 dark:border-error-800',
          background: 'bg-error-50 dark:bg-error-900/20',
          icon: <AlertTriangleIcon className="h-5 w-5 text-error-500" />,
          title: 'text-error-800 dark:text-error-200',
          message: 'text-error-700 dark:text-error-300',
        };
      default:
        return {
          border: 'border-primary-200 dark:border-primary-800',
          background: 'bg-primary-50 dark:bg-primary-900/20',
          icon: <InfoIcon className="h-5 w-5 text-primary-500" />,
          title: 'text-primary-800 dark:text-primary-200',
          message: 'text-primary-700 dark:text-primary-300',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card className={cn(styles.border, styles.background, className)}>
      <CardBody>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-sm font-medium', styles.title)}>{title}</h3>
            <p className={cn('mt-1 text-sm', styles.message)}>{message}</p>
            {actions && <div className="mt-3">{actions}</div>}
          </div>
          {dismissible && onDismiss && (
            <div className="flex-shrink-0">
              <button
                onClick={onDismiss}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5',
                  'hover:bg-secondary-100 dark:hover:bg-secondary-800',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  styles.title
                )}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
