/**
 * Loading Button Component
 *
 * A button component with built-in loading state support.
 * Shows a spinner and disables interaction while loading.
 */

'use client';

import React from 'react';
import { Button, type ButtonProps } from './Button';
import { Spinner } from './Spinner';

export interface LoadingButtonProps extends ButtonProps {
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Loading text to display */
  loadingText?: string;
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
}

// Main LoadingButton component
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      spinnerSize = 'sm',
      spinnerVariant = 'white',
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button ref={ref} disabled={isDisabled} {...props}>
        {loading && (
          <Spinner
            size={spinnerSize}
            variant={spinnerVariant}
            className="mr-2"
          />
        )}
        {loading ? loadingText || children : children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
