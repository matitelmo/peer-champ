/**
 * Alert Component
 *
 * A flexible alert component for displaying system messages, errors, warnings, and success states.
 * Supports dismissible functionality, icons, and actions.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from './icons';

// Alert variants using class-variance-authority
const alertVariants = cva(
  [
    'relative flex items-start gap-3 rounded-lg border p-4',
    'transition-all duration-200 ease-in-out',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-200 bg-secondary-50 text-secondary-900',
          'dark:border-secondary-700 dark:bg-secondary-800/50 dark:text-secondary-100',
        ],
        info: [
          'border-blue-200 bg-blue-50 text-blue-900',
          'dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100',
        ],
        success: [
          'border-green-200 bg-green-50 text-green-900',
          'dark:border-green-800 dark:bg-green-900/20 dark:text-green-100',
        ],
        warning: [
          'border-yellow-200 bg-yellow-50 text-yellow-900',
          'dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100',
        ],
        error: [
          'border-red-200 bg-red-50 text-red-900',
          'dark:border-red-800 dark:bg-red-900/20 dark:text-red-100',
        ],
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-sm',
        lg: 'p-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Icon variants for different alert types
const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-secondary-600 dark:text-secondary-400',
      info: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Alert title */
  title?: string;
  /** Alert description */
  description?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Whether to show the default icon for the variant */
  showIcon?: boolean;
  /** Action buttons */
  actions?: React.ReactNode;
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

// Main Alert component
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      dismissible = false,
      onDismiss,
      icon,
      showIcon = true,
      actions,
      children,
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
        className={cn(alertVariants({ variant, size }), className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        {displayIcon && <div className="flex-shrink-0">{displayIcon}</div>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold leading-tight mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm opacity-90 leading-relaxed">{description}</p>
          )}
          {children && <div className="mt-2">{children}</div>}
          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            className={cn(
              'flex-shrink-0 rounded-md p-1 transition-colors',
              'hover:bg-black/5 dark:hover:bg-white/5',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'default' && 'focus:ring-secondary-500',
              variant === 'info' && 'focus:ring-blue-500',
              variant === 'success' && 'focus:ring-green-500',
              variant === 'warning' && 'focus:ring-yellow-500',
              variant === 'error' && 'focus:ring-red-500',
              size === 'sm' && 'p-0.5',
              size === 'lg' && 'p-1.5'
            )}
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <XIcon
              className={cn(
                'h-4 w-4',
                size === 'sm' && 'h-3 w-3',
                size === 'lg' && 'h-5 w-5',
                variant === 'default' &&
                  'text-secondary-500 dark:text-secondary-400',
                variant === 'info' && 'text-blue-500 dark:text-blue-400',
                variant === 'success' && 'text-green-500 dark:text-green-400',
                variant === 'warning' && 'text-yellow-500 dark:text-yellow-400',
                variant === 'error' && 'text-red-500 dark:text-red-400'
              )}
            />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };
