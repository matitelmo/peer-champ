/**
 * Error State Component
 *
 * A component for displaying error states with retry functionality.
 * Used when something goes wrong and users need to take action.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { AlertTriangleIcon, RefreshIcon, XIcon } from './icons';

// Error state variants using class-variance-authority
const errorStateVariants = cva(
  ['flex flex-col items-center justify-center text-center', 'p-8 space-y-4'],
  {
    variants: {
      size: {
        sm: 'p-4 space-y-3',
        md: 'p-8 space-y-4',
        lg: 'p-12 space-y-6',
      },
      variant: {
        default: 'text-red-600 dark:text-red-400',
        destructive: 'text-red-600 dark:text-red-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        muted: 'text-secondary-500 dark:text-secondary-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface ErrorStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorStateVariants> {
  /** Main title for the error state */
  title: string;
  /** Error description */
  description?: string;
  /** Error details (technical information) */
  details?: string;
  /** Custom error icon */
  icon?: React.ReactNode;
  /** Retry action */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  /** Whether retry is in progress */
  isRetrying?: boolean;
  /** Dismiss action */
  onDismiss?: () => void;
  /** Whether the error can be dismissed */
  dismissible?: boolean;
  /** Additional actions */
  actions?: React.ReactNode;
  /** Error code or ID */
  errorCode?: string;
  /** Whether to show error details by default */
  showDetails?: boolean;
}

// Default error icon
const DefaultErrorIcon = ({ className }: { className?: string }) => (
  <div className={cn('w-16 h-16 mx-auto mb-4 text-red-500', className)}>
    <AlertTriangleIcon className="w-full h-full" />
  </div>
);

// Main ErrorState component
const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      size,
      variant,
      title,
      description,
      details,
      icon,
      onRetry,
      retryLabel = 'Try Again',
      isRetrying = false,
      onDismiss,
      dismissible = false,
      actions,
      errorCode,
      showDetails = false,
      ...props
    },
    ref
  ) => {
    const [showErrorDetails, setShowErrorDetails] = React.useState(showDetails);

    const displayIcon = icon || <DefaultErrorIcon />;

    return (
      <div
        ref={ref}
        className={cn(errorStateVariants({ size, variant }), className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <button
            type="button"
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <XIcon className="h-4 w-4 text-secondary-500" />
          </button>
        )}

        {/* Icon */}
        <div className="flex-shrink-0">{displayIcon}</div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-red-700 dark:text-red-300 max-w-sm">
              {description}
            </p>
          )}
          {errorCode && (
            <p className="text-xs text-red-600 dark:text-red-400 font-mono">
              Error Code: {errorCode}
            </p>
          )}
        </div>

        {/* Error Details */}
        {details && (
          <div className="w-full max-w-md">
            <button
              type="button"
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              onClick={() => setShowErrorDetails(!showErrorDetails)}
            >
              {showErrorDetails ? 'Hide' : 'Show'} Details
            </button>
            {showErrorDetails && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <pre className="text-xs text-red-800 dark:text-red-200 whitespace-pre-wrap break-words">
                  {details}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="md"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshIcon className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  {retryLabel}
                </>
              )}
            </Button>
          )}
          {actions}
        </div>
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';

// Inline error state for forms and smaller areas
export const InlineErrorState = React.forwardRef<
  HTMLDivElement,
  Omit<ErrorStateProps, 'size' | 'icon'> & {
    /** Custom icon size */
    iconSize?: 'sm' | 'md' | 'lg';
  }
>(({ className, iconSize = 'sm', ...props }, ref) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const customIcon = (
    <div className={cn('mx-auto mb-2 text-red-500', iconSizeClasses[iconSize])}>
      <AlertTriangleIcon className="w-full h-full" />
    </div>
  );

  return (
    <ErrorState
      ref={ref}
      className={cn('p-4 space-y-2', className)}
      size="sm"
      icon={customIcon}
      {...props}
    />
  );
});

InlineErrorState.displayName = 'InlineErrorState';

// Full screen error state
export const FullScreenErrorState = React.forwardRef<
  HTMLDivElement,
  ErrorStateProps & {
    /** Custom className for the full screen container */
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900',
        className
      )}
      {...props}
    >
      <ErrorState {...props} />
    </div>
  );
});

FullScreenErrorState.displayName = 'FullScreenErrorState';

export { ErrorState, errorStateVariants };
