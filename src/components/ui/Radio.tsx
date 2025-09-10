/**
 * Radio Component
 *
 * A comprehensive radio button component with validation states and accessibility features.
 * Supports both individual radio buttons and radio groups.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, InfoIcon } from './icons';

// Radio variants using class-variance-authority
const radioVariants = cva(
  [
    'peer h-4 w-4 shrink-0 rounded-full border border-secondary-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
    'data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600',
    'data-[state=checked]:text-white',
    'dark:border-secondary-600 dark:focus:ring-primary-400',
    'dark:data-[state=checked]:bg-primary-500 dark:data-[state=checked]:border-primary-500',
  ],
  {
    variants: {
      variant: {
        default: [
          'focus:ring-primary-500',
          'data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600',
        ],
        error: [
          'border-error-300 focus:ring-error-500',
          'data-[state=checked]:bg-error-600 data-[state=checked]:border-error-600',
        ],
        success: [
          'border-success-300 focus:ring-success-500',
          'data-[state=checked]:bg-success-600 data-[state=checked]:border-success-600',
        ],
        warning: [
          'border-warning-300 focus:ring-warning-500',
          'data-[state=checked]:bg-warning-600 data-[state=checked]:border-warning-600',
        ],
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Radio size */
  size?: 'sm' | 'md' | 'lg';
  /** Validation state */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Label text */
  label?: string;
  /** Help text displayed below the radio */
  helpText?: string;
  /** Error message displayed below the radio */
  errorMessage?: string;
  /** Success message displayed below the radio */
  successMessage?: string;
  /** Warning message displayed below the radio */
  warningMessage?: string;
  /** Whether the radio is required */
  required?: boolean;
  /** Whether to show validation icons */
  showValidationIcon?: boolean;
  /** Ref forwarding */
  ref?: React.Ref<HTMLInputElement>;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
      disabled,
      id,
      name,
      value,
      checked,
      onChange,
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
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const helpId = `${radioId}-help`;
    const errorId = `${radioId}-error`;

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

    return (
      <div className="w-full">
        <div className="flex items-start space-x-3">
          {/* Radio Container */}
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={radioId}
              type="radio"
              name={name}
              value={value}
              className={cn(
                radioVariants({ variant: actualVariant, size }),
                'peer sr-only'
              )}
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              aria-describedby={cn(helpText && helpId, message && errorId)}
              aria-invalid={actualVariant === 'error'}
              {...props}
            />

            {/* Custom Radio Visual */}
            <label
              htmlFor={radioId}
              className={cn(
                'flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-secondary-300',
                'transition-colors duration-200',
                'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                'peer-checked:bg-primary-600 peer-checked:border-primary-600',
                'dark:border-secondary-600 dark:peer-focus:ring-primary-400',
                'dark:peer-checked:bg-primary-500 dark:peer-checked:border-primary-500',
                // Size variants
                size === 'sm' && 'h-3 w-3',
                size === 'md' && 'h-4 w-4',
                size === 'lg' && 'h-5 w-5',
                // Variant styles
                actualVariant === 'error' && [
                  'border-error-300 peer-focus:ring-error-500',
                  'peer-checked:bg-error-600 peer-checked:border-error-600',
                ],
                actualVariant === 'success' && [
                  'border-success-300 peer-focus:ring-success-500',
                  'peer-checked:bg-success-600 peer-checked:border-success-600',
                ],
                actualVariant === 'warning' && [
                  'border-warning-300 peer-focus:ring-warning-500',
                  'peer-checked:bg-warning-600 peer-checked:border-warning-600',
                ],
                className
              )}
            >
              {/* Radio Dot */}
              <div
                className={cn(
                  'rounded-full bg-white opacity-0 transition-opacity duration-200',
                  'peer-checked:opacity-100',
                  size === 'sm' && 'h-1 w-1',
                  size === 'md' && 'h-2 w-2',
                  size === 'lg' && 'h-2.5 w-2.5'
                )}
              />
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
                htmlFor={radioId}
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

Radio.displayName = 'Radio';

export { Radio, radioVariants };
