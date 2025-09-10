/**
 * Input Component
 *
 * A comprehensive input component with validation states, icons, and accessibility features.
 * Supports various input types and integrates with form validation libraries.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon } from './icons';

// Input variants using class-variance-authority
const inputVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2 text-sm',
    'placeholder:text-secondary-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-300 bg-white text-secondary-900',
          'focus:border-primary-500 focus:ring-primary-500',
          'dark:border-secondary-600 dark:bg-secondary-900 dark:text-secondary-100',
          'dark:focus:border-primary-400 dark:focus:ring-primary-400',
        ],
        error: [
          'border-error-300 bg-white text-secondary-900',
          'focus:border-error-500 focus:ring-error-500',
          'dark:border-error-600 dark:bg-secondary-900 dark:text-secondary-100',
          'dark:focus:border-error-400 dark:focus:ring-error-400',
        ],
        success: [
          'border-success-300 bg-white text-secondary-900',
          'focus:border-success-500 focus:ring-success-500',
          'dark:border-success-600 dark:bg-secondary-900 dark:text-secondary-100',
          'dark:focus:border-success-400 dark:focus:ring-success-400',
        ],
        warning: [
          'border-warning-300 bg-white text-secondary-900',
          'focus:border-warning-500 focus:ring-warning-500',
          'dark:border-warning-600 dark:bg-secondary-900 dark:text-secondary-100',
          'dark:focus:border-warning-400 dark:focus:ring-warning-400',
        ],
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 py-2',
        lg: 'h-11 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Validation state */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Label text */
  label?: string;
  /** Help text displayed below the input */
  helpText?: string;
  /** Error message displayed below the input */
  errorMessage?: string;
  /** Success message displayed below the input */
  successMessage?: string;
  /** Warning message displayed below the input */
  warningMessage?: string;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Whether the input is required */
  required?: boolean;
  /** Whether to show validation icons */
  showValidationIcon?: boolean;
  /** Ref forwarding */
  ref?: React.Ref<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      leftIcon,
      rightIcon,
      required,
      showValidationIcon = true,
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
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    // Get validation icon
    const getValidationIcon = () => {
      if (!showValidationIcon) return null;

      switch (actualVariant) {
        case 'error':
          return <AlertTriangleIcon className="h-4 w-4 text-error-500" />;
        case 'success':
          return <CheckIcon className="h-4 w-4 text-success-500" />;
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
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant: actualVariant, size }),
              leftIcon && 'pl-10',
              (rightIcon || getValidationIcon()) && 'pr-10',
              className
            )}
            disabled={disabled}
            aria-describedby={cn(helpText && helpId, message && errorId)}
            aria-invalid={actualVariant === 'error'}
            {...props}
          />

          {/* Right Icon or Validation Icon */}
          {(rightIcon || getValidationIcon()) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
              {rightIcon || getValidationIcon()}
            </div>
          )}
        </div>

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
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
