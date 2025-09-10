/**
 * Textarea Component
 *
 * A comprehensive textarea component with validation states and accessibility features.
 * Supports resizing, character counting, and integrates with form validation libraries.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon } from './icons';

// Textarea variants using class-variance-authority
const textareaVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2 text-sm',
    'placeholder:text-secondary-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
    'resize-y min-h-[80px]',
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
        sm: 'min-h-[60px] px-2 py-1 text-xs',
        md: 'min-h-[80px] px-3 py-2',
        lg: 'min-h-[120px] px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Textarea size */
  size?: 'sm' | 'md' | 'lg';
  /** Validation state */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Label text */
  label?: string;
  /** Help text displayed below the textarea */
  helpText?: string;
  /** Error message displayed below the textarea */
  errorMessage?: string;
  /** Success message displayed below the textarea */
  successMessage?: string;
  /** Warning message displayed below the textarea */
  warningMessage?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Whether to show validation icons */
  showValidationIcon?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Ref forwarding */
  ref?: React.Ref<HTMLTextAreaElement>;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      maxLength,
      showCharCount = false,
      disabled,
      id,
      value,
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
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const helpId = `${textareaId}-help`;
    const errorId = `${textareaId}-error`;

    // Get current character count
    const currentLength = typeof value === 'string' ? value.length : 0;
    const shouldShowCharCount = showCharCount && maxLength;

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
            htmlFor={textareaId}
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

        {/* Textarea Container */}
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              textareaVariants({ variant: actualVariant, size }),
              getValidationIcon() && 'pr-10',
              className
            )}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            aria-describedby={cn(
              helpText && helpId,
              message && errorId,
              shouldShowCharCount && `${textareaId}-char-count`
            )}
            aria-invalid={actualVariant === 'error'}
            {...props}
          />

          {/* Validation Icon */}
          {getValidationIcon() && (
            <div className="absolute right-3 top-3 text-secondary-400 pointer-events-none">
              {getValidationIcon()}
            </div>
          )}
        </div>

        {/* Character Count */}
        {shouldShowCharCount && (
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-secondary-500 dark:text-secondary-400">
              {currentLength} / {maxLength} characters
            </span>
            {currentLength > maxLength * 0.9 && (
              <span
                className={cn(
                  'text-warning-600 dark:text-warning-400',
                  currentLength >= maxLength &&
                    'text-error-600 dark:text-error-400'
                )}
              >
                {currentLength >= maxLength
                  ? 'Character limit reached'
                  : 'Approaching limit'}
              </span>
            )}
          </div>
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
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
