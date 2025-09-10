/**
 * Toast Component
 *
 * A toast notification component for displaying temporary messages.
 * Supports auto-dismiss, manual dismissal, and different variants.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from './icons';

// Toast variants using class-variance-authority
const toastVariants = cva(
  [
    'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg',
    'transition-all duration-300 ease-in-out',
    'max-w-sm w-full',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-200 bg-white text-secondary-900',
          'dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100',
        ],
        info: [
          'border-blue-200 bg-white text-blue-900',
          'dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100',
        ],
        success: [
          'border-green-200 bg-white text-green-900',
          'dark:border-green-800 dark:bg-green-900 dark:text-green-100',
        ],
        warning: [
          'border-yellow-200 bg-white text-yellow-900',
          'dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        ],
        error: [
          'border-red-200 bg-white text-red-900',
          'dark:border-red-800 dark:bg-red-900 dark:text-red-100',
        ],
      },
      position: {
        'top-left': 'animate-in slide-in-from-left-full',
        'top-center': 'animate-in slide-in-from-top-full',
        'top-right': 'animate-in slide-in-from-right-full',
        'bottom-left': 'animate-in slide-in-from-left-full',
        'bottom-center': 'animate-in slide-in-from-bottom-full',
        'bottom-right': 'animate-in slide-in-from-right-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
);

// Icon variants for different toast types
const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-secondary-600 dark:text-secondary-400',
      info: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** Toast title */
  title?: string;
  /** Toast description */
  description?: string;
  /** Whether the toast can be dismissed */
  dismissible?: boolean;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Whether to show the default icon for the variant */
  showIcon?: boolean;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Toast ID for tracking */
  id?: string;
}

// Get default icon for variant
const getDefaultIcon = (
  variant: 'default' | 'info' | 'success' | 'warning' | 'error'
) => {
  const iconProps = { className: iconVariants({ variant }) };

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

// Main Toast component
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      position,
      title,
      description,
      dismissible = true,
      onDismiss,
      icon,
      showIcon = true,
      actions,
      duration = 5000,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [isExiting, setIsExiting] = React.useState(false);

    const handleDismiss = React.useCallback(() => {
      setIsExiting(true);
      // Wait for animation to complete before calling onDismiss
      setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 300);
    }, [onDismiss]);

    // Auto-dismiss functionality
    React.useEffect(() => {
      if (duration > 0 && isVisible && !isExiting) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, isVisible, isExiting, handleDismiss]);

    if (!isVisible) {
      return null;
    }

    const displayIcon =
      icon || (showIcon ? getDefaultIcon(variant || 'default') : null);

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          toastVariants({ variant, position }),
          isExiting && 'animate-out fade-out-0 slide-out-to-right-full',
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        {displayIcon && <div className="flex-shrink-0">{displayIcon}</div>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm leading-tight mb-1">
              {title}
            </h4>
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
              variant === 'error' && 'focus:ring-red-500'
            )}
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            <XIcon
              className={cn(
                'h-4 w-4',
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

Toast.displayName = 'Toast';

export { Toast, toastVariants };
