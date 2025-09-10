/**
 * Inline Notification Component
 *
 * A compact inline notification component for displaying contextual messages.
 * Designed to be embedded within forms, pages, or other content areas.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from './icons';

// Inline notification variants using class-variance-authority
const inlineNotificationVariants = cva(
  [
    'relative flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
    'transition-all duration-200 ease-in-out',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-200 bg-secondary-50 text-secondary-700',
          'dark:border-secondary-700 dark:bg-secondary-800/50 dark:text-secondary-300',
        ],
        info: [
          'border-blue-200 bg-blue-50 text-blue-700',
          'dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        ],
        success: [
          'border-green-200 bg-green-50 text-green-700',
          'dark:border-green-800 dark:bg-green-900/20 dark:text-green-300',
        ],
        warning: [
          'border-yellow-200 bg-yellow-50 text-yellow-700',
          'dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        ],
        error: [
          'border-red-200 bg-red-50 text-red-700',
          'dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
        ],
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Icon variants for different notification types
const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-secondary-500 dark:text-secondary-400',
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      error: 'text-red-500 dark:text-red-400',
    },
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface InlineNotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineNotificationVariants> {
  /** Notification message */
  message: string;
  /** Whether the notification can be dismissed */
  dismissible?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Whether to show the default icon for the variant */
  showIcon?: boolean;
  /** Action button */
  action?: React.ReactNode;
}

// Get default icon for variant
const getDefaultIcon = (
  variant: 'default' | 'info' | 'success' | 'warning' | 'error',
  size: 'sm' | 'md' | 'lg'
) => {
  const iconProps = {
    className: iconVariants({ variant, size }),
  };

  switch (variant) {
    case 'success':
      return <CheckIcon {...iconProps} />;
    case 'warning':
    case 'error':
      return <AlertTriangleIcon {...iconProps} />;
    case 'info':
    default:
      return <InfoIcon {...iconProps} />;
  }
};

// Main InlineNotification component
const InlineNotification = React.forwardRef<
  HTMLDivElement,
  InlineNotificationProps
>(
  (
    {
      className,
      variant,
      size,
      message,
      dismissible = false,
      onDismiss,
      icon,
      showIcon = true,
      action,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) {
      return null;
    }

    const displayIcon =
      icon ||
      (showIcon ? getDefaultIcon(variant || 'default', size || 'md') : null);

    return (
      <div
        ref={ref}
        className={cn(inlineNotificationVariants({ variant, size }), className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        {displayIcon && <div className="flex-shrink-0">{displayIcon}</div>}

        {/* Message */}
        <span className="flex-1">{message}</span>

        {/* Action */}
        {action && <div className="flex-shrink-0">{action}</div>}

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            className={cn(
              'flex-shrink-0 rounded-sm p-0.5 transition-colors',
              'hover:bg-black/5 dark:hover:bg-white/5',
              'focus:outline-none focus:ring-1 focus:ring-offset-1',
              variant === 'default' && 'focus:ring-secondary-500',
              variant === 'info' && 'focus:ring-blue-500',
              variant === 'success' && 'focus:ring-green-500',
              variant === 'warning' && 'focus:ring-yellow-500',
              variant === 'error' && 'focus:ring-red-500',
              size === 'sm' && 'p-0',
              size === 'lg' && 'p-1'
            )}
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            <XIcon
              className={cn(
                'h-3 w-3',
                size === 'sm' && 'h-2 w-2',
                size === 'lg' && 'h-4 w-4',
                variant === 'default' &&
                  'text-secondary-400 dark:text-secondary-500',
                variant === 'info' && 'text-blue-400 dark:text-blue-500',
                variant === 'success' && 'text-green-400 dark:text-green-500',
                variant === 'warning' && 'text-yellow-400 dark:text-yellow-500',
                variant === 'error' && 'text-red-400 dark:text-red-500'
              )}
            />
          </button>
        )}
      </div>
    );
  }
);

InlineNotification.displayName = 'InlineNotification';

export { InlineNotification, inlineNotificationVariants };
