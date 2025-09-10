/**
 * Loading Input Component
 *
 * An input component with built-in loading state support.
 * Shows a spinner and can be disabled while loading.
 */

'use client';

import React from 'react';
import { Input, type InputProps } from './Input';
import { Spinner } from './Spinner';
import { cn } from '@/lib/utils';

export interface LoadingInputProps extends InputProps {
  /** Whether the input is in loading state */
  loading?: boolean;
  /** Spinner size when loading */
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Spinner variant when loading */
  spinnerVariant?:
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'white'
    | 'gray';
  /** Position of the loading spinner */
  spinnerPosition?: 'left' | 'right';
}

// Main LoadingInput component
const LoadingInput = React.forwardRef<HTMLInputElement, LoadingInputProps>(
  (
    {
      loading = false,
      spinnerSize = 'sm',
      spinnerVariant = 'default',
      spinnerPosition = 'right',
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <div className="relative">
        <Input
          ref={ref}
          disabled={isDisabled}
          className={cn(
            loading && spinnerPosition === 'right' && 'pr-10',
            loading && spinnerPosition === 'left' && 'pl-10',
            className
          )}
          {...props}
        />
        {loading && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2',
              spinnerPosition === 'right' ? 'right-3' : 'left-3'
            )}
          >
            <Spinner size={spinnerSize} variant={spinnerVariant} />
          </div>
        )}
      </div>
    );
  }
);

LoadingInput.displayName = 'LoadingInput';

export { LoadingInput };
