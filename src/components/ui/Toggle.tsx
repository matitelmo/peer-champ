/**
 * Toggle Component
 *
 * A comprehensive toggle/switch component with validation states and accessibility features.
 * Supports both controlled and uncontrolled modes with smooth animations.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, InfoIcon } from './icons';

// Toggle variants using class-variance-authority
const toggleVariants = cva(
  [
    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-secondary-200',
    'dark:data-[state=checked]:bg-primary-500 dark:data-[state=unchecked]:bg-secondary-700',
  ],
  {
    variants: {
      variant: {
        default: [
          'focus:ring-primary-500',
          'data-[state=checked]:bg-primary-600',
          'dark:data-[state=checked]:bg-primary-500',
        ],
        error: [
          'focus:ring-error-500',
          'data-[state=checked]:bg-error-600',
          'dark:data-[state=checked]:bg-error-500',
        ],
        success: [
          'focus:ring-success-500',
          'data-[state=checked]:bg-success-600',
          'dark:data-[state=checked]:bg-success-500',
        ],
        warning: [
          'focus:ring-warning-500',
          'data-[state=checked]:bg-warning-600',
          'dark:data-[state=checked]:bg-warning-500',
        ],
      },
      size: {
        sm: 'h-4 w-7',
        md: 'h-6 w-11',
        lg: 'h-8 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Toggle thumb variants
const toggleThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform',
    'data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5',
  ],
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5',
        lg: 'h-7 w-7 data-[state=checked]:translate-x-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ToggleProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'type' | 'onChange'
    >,
    VariantProps<typeof toggleVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Toggle size */
  size?: 'sm' | 'md' | 'lg';
  /** Validation state */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Label text */
  label?: string;
  /** Help text displayed below the toggle */
  helpText?: string;
  /** Error message displayed below the toggle */
  errorMessage?: string;
  /** Success message displayed below the toggle */
  successMessage?: string;
  /** Warning message displayed below the toggle */
  warningMessage?: string;
  /** Whether the toggle is required */
  required?: boolean;
  /** Whether to show validation icons */
  showValidationIcon?: boolean;
  /** Whether the toggle is checked */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Ref forwarding */
  ref?: React.Ref<HTMLInputElement>;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      label,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      required,
      showValidationIcon = true,
      checked,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Determine the actual variant based on messages
    const actualVariant = errorMessage
      ? 'error'
      : successMessage
        ? 'success'
        : warningMessage
          ? 'warning'
          : variant || 'default';

    // Generate unique ID if not provided
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    const helpId = `${toggleId}-help`;
    const errorId = `${toggleId}-error`;

    // Get validation icon
    const getValidationIcon = () => {
      if (!showValidationIcon) return null;

      switch (actualVariant) {
        case 'error':
          return <AlertTriangleIcon className="h-4 w-4 text-error-500" />;
        case 'warning':
          return <InfoIcon className="h-4 w-4 text-warning-500" />;
        default:
          return null;
      }
    };

    // Get the message to display
    const message = errorMessage || successMessage || warningMessage;

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked);
    };

    return (
      <div className="w-full">
        <div className="flex items-start space-x-3">
          {/* Toggle Container */}
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={toggleId}
              type="checkbox"
              className="peer sr-only"
              disabled={disabled}
              checked={checked}
              onChange={handleChange}
              aria-describedby={cn(helpText && helpId, message && errorId)}
              aria-invalid={actualVariant === 'error'}
              {...props}
            />

            {/* Toggle Track */}
            <label
              htmlFor={toggleId}
              className={cn(
                toggleVariants({ variant: actualVariant, size }),
                // Variant styles
                actualVariant === 'error' && [
                  'focus:ring-error-500',
                  'data-[state=checked]:bg-error-600',
                  'dark:data-[state=checked]:bg-error-500',
                ],
                actualVariant === 'success' && [
                  'focus:ring-success-500',
                  'data-[state=checked]:bg-success-600',
                  'dark:data-[state=checked]:bg-success-500',
                ],
                actualVariant === 'warning' && [
                  'focus:ring-warning-500',
                  'data-[state=checked]:bg-warning-600',
                  'dark:data-[state=checked]:bg-warning-500',
                ],
                className
              )}
            >
              {/* Toggle Thumb */}
              <span className={cn(toggleThumbVariants({ size }))} />
            </label>

            {/* Validation Icon */}
            {getValidationIcon() && (
              <div className="absolute -right-6 top-0 text-secondary-400">
                {getValidationIcon()}
              </div>
            )}
          </div>

          {/* Label and Content */}
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={toggleId}
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 cursor-pointer"
              >
                {label}
                {required && (
                  <span className="text-error-500 ml-1" aria-label="required">
                    *
                  </span>
                )}
              </label>
            )}

            {/* Help Text */}
            {helpText && !message && (
              <p
                id={helpId}
                className="mt-1 text-xs text-secondary-500 dark:text-secondary-400"
              >
                {helpText}
              </p>
            )}

            {/* Error Message */}
            {errorMessage && (
              <p
                id={errorId}
                className="mt-1 text-xs text-error-600 dark:text-error-400"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            {/* Success Message */}
            {successMessage && (
              <p
                id={errorId}
                className="mt-1 text-xs text-success-600 dark:text-success-400"
              >
                {successMessage}
              </p>
            )}

            {/* Warning Message */}
            {warningMessage && (
              <p
                id={errorId}
                className="mt-1 text-xs text-warning-600 dark:text-warning-400"
              >
                {warningMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants, toggleThumbVariants };
