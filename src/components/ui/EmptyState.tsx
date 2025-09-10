/**
 * Empty State Component
 *
 * A component for displaying empty states with illustrations, messages, and actions.
 * Used when there's no data to display or when guiding users to take action.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// Empty state variants using class-variance-authority
const emptyStateVariants = cva(
  ['flex flex-col items-center justify-center text-center', 'p-8 space-y-4'],
  {
    variants: {
      size: {
        sm: 'p-4 space-y-3',
        md: 'p-8 space-y-4',
        lg: 'p-12 space-y-6',
      },
      variant: {
        default: 'text-secondary-600 dark:text-secondary-400',
        primary: 'text-primary-600 dark:text-primary-400',
        muted: 'text-secondary-500 dark:text-secondary-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Main title for the empty state */
  title: string;
  /** Description text */
  description?: string;
  /** Custom illustration or icon */
  illustration?: React.ReactNode;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?:
      | 'primary'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'success'
      | 'warning'
      | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?:
      | 'primary'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'success'
      | 'warning'
      | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  };
  /** Whether to show a default illustration */
  showDefaultIllustration?: boolean;
}

// Default illustrations for common empty states
const DefaultIllustrations = {
  search: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  ),
  inbox: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </div>
  ),
  folder: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  ),
  users: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  ),
  chart: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    </div>
  ),
  settings: (
    <div className="w-16 h-16 mx-auto mb-4 text-secondary-400 dark:text-secondary-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  ),
};

// Main EmptyState component
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      variant,
      title,
      description,
      illustration,
      action,
      secondaryAction,
      showDefaultIllustration = true,
      ...props
    },
    ref
  ) => {
    const displayIllustration =
      illustration ||
      (showDefaultIllustration ? DefaultIllustrations.inbox : null);

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, variant }), className)}
        {...props}
      >
        {/* Illustration */}
        {displayIllustration && (
          <div className="flex-shrink-0">{displayIllustration}</div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-secondary-600 dark:text-secondary-400 max-w-sm">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
                size={secondaryAction.size || 'md'}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

// Export default illustrations for reuse
export { DefaultIllustrations };

export { EmptyState, emptyStateVariants };
