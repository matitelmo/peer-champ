/**
 * Spinner Component
 *
 * A loading spinner component with size variants and customizable styling.
 * Provides visual feedback during loading states.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Spinner variants using class-variance-authority
const spinnerVariants = cva(
  [
    'animate-spin rounded-full border-solid',
    'border-primary-200 dark:border-primary-800',
    'border-t-primary-600 dark:border-t-primary-400',
  ],
  {
    variants: {
      size: {
        xs: 'h-3 w-3 border',
        sm: 'h-4 w-4 border',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        default:
          'border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400',
        secondary:
          'border-secondary-200 border-t-secondary-600 dark:border-secondary-700 dark:border-t-secondary-400',
        success:
          'border-green-200 border-t-green-600 dark:border-green-800 dark:border-t-green-400',
        warning:
          'border-yellow-200 border-t-yellow-600 dark:border-yellow-800 dark:border-t-yellow-400',
        error:
          'border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-400',
        white: 'border-white/20 border-t-white',
        gray: 'border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-400',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Whether the spinner is visible */
  visible?: boolean;
  /** Custom label for screen readers */
  label?: string;
}

// Main Spinner component
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size,
      variant,
      visible = true,
      label = 'Loading...',
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
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
