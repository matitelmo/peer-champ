/**
 * Container Component
 *
 * A flexible container component for page section wrapping with responsive padding and margin utilities.
 * Provides consistent spacing and layout organization across the application.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Container variants using class-variance-authority
const containerVariants = cva(
  ['mx-auto w-full', 'transition-all duration-200'],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
        screen: 'max-w-screen-xl',
        prose: 'max-w-prose',
      },
      padding: {
        none: 'p-0',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-12',
        '3xl': 'p-16',
      },
      paddingX: {
        none: 'px-0',
        xs: 'px-1',
        sm: 'px-2',
        md: 'px-4',
        lg: 'px-6',
        xl: 'px-8',
        '2xl': 'px-12',
        '3xl': 'px-16',
      },
      paddingY: {
        none: 'py-0',
        xs: 'py-1',
        sm: 'py-2',
        md: 'py-4',
        lg: 'py-6',
        xl: 'py-8',
        '2xl': 'py-12',
        '3xl': 'py-16',
      },
      margin: {
        none: 'm-0',
        xs: 'm-1',
        sm: 'm-2',
        md: 'm-4',
        lg: 'm-6',
        xl: 'm-8',
        '2xl': 'm-12',
        '3xl': 'm-16',
      },
      marginX: {
        none: 'mx-0',
        auto: 'mx-auto',
        xs: 'mx-1',
        sm: 'mx-2',
        md: 'mx-4',
        lg: 'mx-6',
        xl: 'mx-8',
        '2xl': 'mx-12',
        '3xl': 'mx-16',
      },
      marginY: {
        none: 'my-0',
        xs: 'my-1',
        sm: 'my-2',
        md: 'my-4',
        lg: 'my-6',
        xl: 'my-8',
        '2xl': 'my-12',
        '3xl': 'my-16',
      },
      background: {
        none: '',
        default: 'bg-white dark:bg-secondary-900',
        secondary: 'bg-secondary-50 dark:bg-secondary-800',
        primary: 'bg-primary-50 dark:bg-primary-900/20',
        accent: 'bg-accent-50 dark:bg-accent-900/20',
        muted: 'bg-secondary-100 dark:bg-secondary-800',
      },
      border: {
        none: '',
        default: 'border border-secondary-200 dark:border-secondary-700',
        primary: 'border border-primary-200 dark:border-primary-700',
        accent: 'border border-accent-200 dark:border-accent-700',
        dashed:
          'border border-dashed border-secondary-300 dark:border-secondary-600',
      },
      rounded: {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
        inner: 'shadow-inner',
      },
      center: {
        true: 'flex items-center justify-center',
        false: '',
      },
      fluid: {
        true: 'w-full max-w-none',
        false: '',
      },
    },
    defaultVariants: {
      size: 'screen',
      padding: 'md',
      paddingX: 'md',
      paddingY: 'md',
      margin: 'none',
      marginX: 'auto',
      marginY: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
      center: false,
      fluid: false,
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /** Whether the container should be a semantic section element */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  /** Whether to apply responsive padding that adjusts on different screen sizes */
  responsive?: boolean;
  /** Custom responsive padding configuration */
  responsivePadding?: {
    mobile?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    tablet?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    desktop?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  };
}

// Main Container component
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      as: Component = 'div',
      size,
      padding,
      paddingX,
      paddingY,
      margin,
      marginX,
      marginY,
      background,
      border,
      rounded,
      shadow,
      center,
      fluid,
      responsive = false,
      responsivePadding,
      ...props
    },
    ref
  ) => {
    // Handle responsive padding
    const getResponsiveClasses = () => {
      if (!responsive && !responsivePadding) return '';

      const classes = [];

      if (responsivePadding) {
        const { mobile, tablet, desktop } = responsivePadding;

        if (mobile) {
          classes.push(
            `p-${mobile === 'xs' ? '1' : mobile === 'sm' ? '2' : mobile === 'md' ? '4' : mobile === 'lg' ? '6' : mobile === 'xl' ? '8' : mobile === '2xl' ? '12' : '16'}`
          );
        }

        if (tablet) {
          classes.push(
            `sm:p-${tablet === 'xs' ? '1' : tablet === 'sm' ? '2' : tablet === 'md' ? '4' : tablet === 'lg' ? '6' : tablet === 'xl' ? '8' : tablet === '2xl' ? '12' : '16'}`
          );
        }

        if (desktop) {
          classes.push(
            `lg:p-${desktop === 'xs' ? '1' : desktop === 'sm' ? '2' : desktop === 'md' ? '4' : desktop === 'lg' ? '6' : desktop === 'xl' ? '8' : desktop === '2xl' ? '12' : '16'}`
          );
        }
      } else if (responsive) {
        // Default responsive padding
        classes.push('p-4 sm:p-6 lg:p-8');
      }

      return classes.join(' ');
    };

    return (
      <Component
        ref={ref}
        className={cn(
          containerVariants({
            size,
            padding: responsive || responsivePadding ? 'none' : padding,
            paddingX,
            paddingY,
            margin,
            marginX,
            marginY,
            background,
            border,
            rounded,
            shadow,
            center,
            fluid,
          }),
          getResponsiveClasses(),
          className
        )}
        {...props}
      />
    );
  }
);

// Specialized container variants for common use cases
export interface SectionProps extends Omit<ContainerProps, 'as'> {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Whether to add top margin for section spacing */
  spacing?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    { className, title, description, spacing = true, children, ...props },
    ref
  ) => (
    <Container
      ref={ref as React.Ref<HTMLDivElement>}
      as="section"
      className={cn(spacing && 'mt-8 first:mt-0', className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-secondary-600 dark:text-secondary-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Container>
  )
);

export interface PageProps extends Omit<ContainerProps, 'as'> {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Whether to add top padding for page spacing */
  spacing?: boolean;
}

const Page = React.forwardRef<HTMLElement, PageProps>(
  (
    { className, title, description, spacing = true, children, ...props },
    ref
  ) => (
    <Container
      ref={ref as React.Ref<HTMLDivElement>}
      as="main"
      className={cn(spacing && 'pt-8 pb-16', className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Container>
  )
);

// Set display names
Container.displayName = 'Container';
Section.displayName = 'Section';
Page.displayName = 'Page';

export { Container, Section, Page, containerVariants };
