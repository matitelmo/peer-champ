/**
 * Skeleton Components
 *
 * Loading skeleton components for various content types.
 * Provides visual placeholders while content is loading.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Base skeleton animation
const skeletonVariants = cva(
  ['animate-pulse rounded-md', 'bg-secondary-200 dark:bg-secondary-700'],
  {
    variants: {
      variant: {
        default: 'bg-secondary-200 dark:bg-secondary-700',
        primary: 'bg-primary-200 dark:bg-primary-800',
        secondary: 'bg-secondary-200 dark:bg-secondary-700',
        accent: 'bg-accent-200 dark:bg-accent-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Whether the skeleton is visible */
  visible?: boolean;
}

// Base Skeleton component
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, visible = true, ...props }, ref) => {
    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Text skeleton variants
export const SkeletonText = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    lines?: number;
    lastLineWidth?: string;
  }
>(({ className, lines = 1, lastLineWidth = '75%', ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-4',
            index === lines - 1 &&
              lastLineWidth !== '100%' &&
              `w-[${lastLineWidth}]`
          )}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';

// Avatar skeleton
export const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-full', sizeClasses[size], className)}
      {...props}
    />
  );
});

SkeletonAvatar.displayName = 'SkeletonAvatar';

// Button skeleton
export const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    size?: 'sm' | 'md' | 'lg';
    width?: string;
  }
>(({ className, size = 'md', width = '80px', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-md', sizeClasses[size], className)}
      style={{ width }}
      {...props}
    />
  );
});

SkeletonButton.displayName = 'SkeletonButton';

// Card skeleton
export const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    showAvatar?: boolean;
    showActions?: boolean;
  }
>(({ className, showAvatar = false, showActions = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('rounded-lg border p-6 space-y-4', className)}
      {...props}
    >
      {/* Header with optional avatar */}
      <div className="flex items-center space-x-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Optional actions */}
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <SkeletonButton size="sm" width="60px" />
          <SkeletonButton size="sm" width="80px" />
        </div>
      )}
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

// Table skeleton
export const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    rows?: number;
    columns?: number;
  }
>(({ className, rows = 5, columns = 4, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      {/* Table header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-4 w-full" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
});

SkeletonTable.displayName = 'SkeletonTable';

// List skeleton
export const SkeletonList = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    items?: number;
    showAvatar?: boolean;
  }
>(({ className, items = 5, showAvatar = false, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {showAvatar && <SkeletonAvatar size="sm" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
});

SkeletonList.displayName = 'SkeletonList';

export { Skeleton, skeletonVariants };
