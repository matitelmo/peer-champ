/**
 * Button Component
 *
 * A comprehensive button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and full accessibility features.
 */

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using class-variance-authority for better maintainability
const buttonVariants = cva(
  // Base classes that apply to all buttons
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        // Primary button - main call-to-action
        primary: [
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700',
          'active:bg-primary-800 focus-visible:ring-primary-500',
          'dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700',
        ],
        // Secondary button - secondary actions
        secondary: [
          'bg-secondary-100 text-secondary-900 shadow-sm hover:bg-secondary-200',
          'active:bg-secondary-300 focus-visible:ring-secondary-500',
          'dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
          'dark:active:bg-secondary-600',
        ],
        // Outline button - subtle actions
        outline: [
          'border border-secondary-300 bg-white text-secondary-700 shadow-sm hover:bg-secondary-50',
          'active:bg-secondary-100 focus-visible:ring-secondary-500',
          'dark:border-secondary-600 dark:bg-secondary-900 dark:text-secondary-100',
          'dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
        ],
        // Ghost button - minimal styling
        ghost: [
          'text-secondary-700 hover:bg-secondary-100 active:bg-secondary-200',
          'focus-visible:ring-secondary-500',
          'dark:text-secondary-300 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
        ],
        // Success button - positive actions
        success: [
          'bg-success-600 text-white shadow-sm hover:bg-success-700',
          'active:bg-success-800 focus-visible:ring-success-500',
          'dark:bg-success-500 dark:hover:bg-success-600',
        ],
        // Warning button - caution actions
        warning: [
          'bg-warning-500 text-white shadow-sm hover:bg-warning-600',
          'active:bg-warning-700 focus-visible:ring-warning-500',
          'dark:bg-warning-500 dark:hover:bg-warning-600',
        ],
        // Error/Destructive button - dangerous actions
        destructive: [
          'bg-error-600 text-white shadow-sm hover:bg-error-700',
          'active:bg-error-800 focus-visible:ring-error-500',
          'dark:bg-error-500 dark:hover:bg-error-600',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-10 px-6 py-2 text-base',
        xl: 'h-12 px-8 py-3 text-lg',
        icon: 'h-9 w-9',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Icon to display before the text */
  leftIcon?: React.ReactNode;
  /** Icon to display after the text */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
  /** Custom loading text */
  loadingText?: string;
  /** Ref forwarding */
  ref?: React.Ref<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      loadingText,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const showSpinner = loading;
    const buttonText = loading && loadingText ? loadingText : children;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        type="button"
        ref={ref}
        {...props}
      >
        {/* Loading spinner */}
        {showSpinner && <LoadingSpinner className="mr-2 h-4 w-4 shrink-0" />}

        {/* Left icon */}
        {!showSpinner && leftIcon && (
          <span className="mr-2 shrink-0">{leftIcon}</span>
        )}

        {/* Button text */}
        {buttonText && <span className="truncate">{buttonText}</span>}

        {/* Right icon */}
        {!showSpinner && rightIcon && (
          <span className="ml-2 shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { VariantProps };
