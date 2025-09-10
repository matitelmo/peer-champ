/**
 * AuthLayout Component
 *
 * A layout component for authentication pages with centered content, branding,
 * and responsive behavior. Provides a consistent layout for login, register,
 * forgot password, and other authentication flows.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

// Auth layout variants using class-variance-authority
const authLayoutVariants = cva(
  [
    'min-h-screen flex flex-col',
    'bg-gradient-to-br from-primary-50 to-secondary-50',
    'dark:from-gray-900 dark:to-gray-800',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800',
        minimal: 'bg-white dark:bg-gray-900',
        gradient:
          'bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
        dark: 'bg-gray-900 dark:bg-black',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface AuthLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof authLayoutVariants> {
  /** Main content to display in the auth form */
  children: React.ReactNode;
  /** Title for the auth page */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Logo or branding element */
  logo?: React.ReactNode;
  /** Additional information section */
  additionalInfo?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Back button click handler */
  onBack?: () => void;
  /** Back button label */
  backLabel?: string;
  /** Whether to show the help/support link */
  showHelp?: boolean;
  /** Help link URL */
  helpUrl?: string;
  /** Help link label */
  helpLabel?: string;
  /** Custom header content */
  header?: React.ReactNode;
  /** Whether to center the content vertically */
  centerContent?: boolean;
}

// Default logo component
const DefaultLogo = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-xl">P</span>
    </div>
    <div className="ml-3">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        PeerChamps
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Connect. Learn. Grow.
      </p>
    </div>
  </div>
);

// Main AuthLayout component
const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  (
    {
      className,
      variant,
      size,
      children,
      title,
      subtitle,
      logo,
      additionalInfo,
      footer,
      showBackButton = false,
      onBack,
      backLabel = 'Back',
      showHelp = false,
      helpUrl = '/help',
      helpLabel = 'Need help?',
      header,
      centerContent = true,
      ...props
    },
    ref
  ) => {
    const displayLogo = logo || <DefaultLogo />;

    return (
      <div
        ref={ref}
        className={cn(authLayoutVariants({ variant }), className)}
        {...props}
      >
        {/* Header with back button and help link */}
        {(showBackButton || showHelp || header) && (
          <header className="flex items-center justify-between p-6">
            <div className="flex items-center">
              {showBackButton && onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ← {backLabel}
                </Button>
              )}
            </div>

            {header && (
              <div className="flex-1 flex justify-center">{header}</div>
            )}

            <div className="flex items-center">
              {showHelp && (
                <a
                  href={helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                >
                  {helpLabel}
                </a>
              )}
            </div>
          </header>
        )}

        {/* Main content area */}
        <main
          className={cn(
            'flex-1 flex flex-col',
            centerContent && 'justify-center',
            !centerContent && 'pt-8'
          )}
        >
          <Container className="w-full">
            <div className="flex justify-center">
              <div className={cn('w-full', size)}>
                {/* Logo/Branding */}
                {displayLogo}

                {/* Auth Card */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    {title && (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {subtitle}
                      </p>
                    )}
                  </CardHeader>

                  <CardBody className="px-6 pb-6">{children}</CardBody>
                </Card>

                {/* Additional Information */}
                {additionalInfo && (
                  <div className="mt-6 text-center">{additionalInfo}</div>
                )}

                {/* Footer */}
                {footer && <div className="mt-8 text-center">{footer}</div>}
              </div>
            </div>
          </Container>
        </main>

        {/* Global Footer */}
        <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 PeerChamps. All rights reserved.</p>
        </footer>
      </div>
    );
  }
);

AuthLayout.displayName = 'AuthLayout';

// Auth navigation component for switching between auth flows
export const AuthNavigation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Current auth step */
    currentStep?: 'login' | 'register' | 'forgot-password' | 'reset-password';
    /** Navigation items */
    items?: Array<{
      key: string;
      label: string;
      href: string;
      active?: boolean;
    }>;
  }
>(({ className, currentStep, items, ...props }, ref) => {
  const defaultItems = [
    { key: 'login', label: 'Sign In', href: '/auth/login' },
    { key: 'register', label: 'Sign Up', href: '/auth/register' },
  ];

  const navigationItems = items || defaultItems;

  return (
    <div
      ref={ref}
      className={cn(
        'flex justify-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1',
        className
      )}
      {...props}
    >
      {navigationItems.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={cn(
            'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            ('active' in item && item.active === true) ||
              item.key === currentStep
              ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
          )}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
});

AuthNavigation.displayName = 'AuthNavigation';

// Auth form wrapper component
export const AuthForm = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement> & {
    /** Form title */
    title?: string;
    /** Form description */
    description?: string;
    /** Submit button text */
    submitText?: string;
    /** Whether the form is submitting */
    isSubmitting?: boolean;
    /** Additional form actions */
    actions?: React.ReactNode;
  }
>(
  (
    {
      className,
      title,
      description,
      submitText = 'Submit',
      isSubmitting = false,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <form ref={ref} className={cn('space-y-6', className)} {...props}>
        {(title || description) && (
          <div className="text-center mb-6">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">{children}</div>

        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : submitText}
          </Button>

          {actions && <div className="text-center">{actions}</div>}
        </div>
      </form>
    );
  }
);

AuthForm.displayName = 'AuthForm';

export { AuthLayout, authLayoutVariants };
