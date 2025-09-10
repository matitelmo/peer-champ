/**
 * Loading Overlay Component
 *
 * A full-screen or container overlay that blocks interactions while content is loading.
 * Provides visual feedback and prevents user interaction during loading states.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';
import { XIcon } from './icons';

// Loading overlay variants using class-variance-authority
const loadingOverlayVariants = cva(
  [
    'absolute inset-0 flex items-center justify-center',
    'bg-white/80 dark:bg-gray-900/80',
    'backdrop-blur-sm transition-opacity duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'bg-white/80 dark:bg-gray-900/80',
        transparent: 'bg-transparent',
        blur: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md',
        solid: 'bg-white dark:bg-gray-900',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingOverlayVariants> {
  /** Whether the overlay is visible */
  visible?: boolean;
  /** Loading message to display */
  message?: string;
  /** Custom spinner size */
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom spinner variant */
  spinnerVariant?:
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'white'
    | 'gray';
  /** Whether to show the spinner */
  showSpinner?: boolean;
  /** Custom loading content */
  children?: React.ReactNode;
  /** Whether the overlay should block pointer events */
  blocking?: boolean;
  /** Callback when overlay is dismissed */
  onDismiss?: () => void;
  /** Whether the overlay can be dismissed */
  dismissible?: boolean;
}

// Main LoadingOverlay component
const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      className,
      variant,
      size,
      visible = true,
      message,
      spinnerSize = 'lg',
      spinnerVariant = 'default',
      showSpinner = true,
      children,
      blocking = true,
      onDismiss,
      dismissible = false,
      ...props
    },
    ref
  ) => {
    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          loadingOverlayVariants({ variant, size }),
          blocking && 'pointer-events-auto',
          !blocking && 'pointer-events-none',
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={message || 'Loading...'}
        {...props}
      >
        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <button
            type="button"
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            onClick={onDismiss}
            aria-label="Dismiss loading"
          >
            <XIcon className="h-4 w-4 text-secondary-500" />
          </button>
        )}

        <div className="flex flex-col items-center space-y-4 text-center">
          {showSpinner && (
            <Spinner
              size={spinnerSize}
              variant={spinnerVariant}
              label={message || 'Loading...'}
            />
          )}

          {message && (
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {message}
            </p>
          )}

          {children}
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// Full screen loading overlay
export const FullScreenLoadingOverlay = React.forwardRef<
  HTMLDivElement,
  Omit<LoadingOverlayProps, 'className'> & {
    /** Custom className for the full screen container */
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('fixed inset-0 z-50', className)} {...props}>
      <LoadingOverlay {...props} />
    </div>
  );
});

FullScreenLoadingOverlay.displayName = 'FullScreenLoadingOverlay';

// Container loading overlay (for relative positioned containers)
export const ContainerLoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <LoadingOverlay
      ref={ref}
      className={cn('relative', className)}
      {...props}
    />
  );
});

ContainerLoadingOverlay.displayName = 'ContainerLoadingOverlay';

export { LoadingOverlay, loadingOverlayVariants };
