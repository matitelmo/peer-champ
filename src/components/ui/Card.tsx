/**
 * Card Component
 *
 * A flexible card component with header, body, and footer sections.
 * Supports various style variants and interactive states.
 */

'use client';

import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Card variants using class-variance-authority
const cardVariants = cva(
  [
    'rounded-lg border bg-white shadow-sm transition-all duration-200',
    'dark:bg-secondary-800 dark:border-secondary-700',
  ],
  {
    variants: {
      variant: {
        default: 'border-secondary-200',
        outlined: 'border-2 border-secondary-300 dark:border-secondary-600',
        elevated: 'shadow-lg border-secondary-100 dark:border-secondary-700',
        flat: 'shadow-none border-secondary-100 dark:border-secondary-700',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        false: '',
      },
      clickable: {
        true: 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
      clickable: false,
    },
  }
);

// Card header variants
const cardHeaderVariants = cva(
  [
    'flex flex-col space-y-1.5',
    'border-b border-secondary-200 dark:border-secondary-700',
  ],
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  }
);

// Card body variants
const cardBodyVariants = cva(['flex-1'], {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

// Card footer variants
const cardFooterVariants = cva(
  [
    'flex items-center',
    'border-t border-secondary-200 dark:border-secondary-700',
  ],
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      padding: 'md',
      justify: 'end',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Whether the card is interactive (hover effects) */
  interactive?: boolean;
  /** Whether the card is clickable (focus states) */
  clickable?: boolean;
  /** Click handler for clickable cards */
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardBodyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBodyVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Optional description text */
  children?: React.ReactNode;
}

// Main Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, padding, interactive, clickable, onClick, ...props },
    ref
  ) => {
    if (clickable) {
      // Extract only the props that are safe for button elements
      const {
        id,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        tabIndex,
        role,
        style,
        title,
        ...restProps
      } = props;

      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={cn(
            cardVariants({ variant, padding, interactive, clickable }),
            className
          )}
          onClick={onClick}
          type="button"
          id={id}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={tabIndex}
          role={role}
          style={style}
          title={title}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, interactive, clickable }),
          className
        )}
        onClick={onClick}
        {...props}
      />
    );
  }
);

// Card Header component
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ padding }), className)}
      {...props}
    />
  )
);

// Card Body component
const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardBodyVariants({ padding }), className)}
      {...props}
    />
  )
);

// Card Footer component
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ padding, justify }), className)}
      {...props}
    />
  )
);

// Card Title component
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-secondary-900 dark:text-secondary-100',
        className
      )}
      {...props}
    />
  )
);

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-secondary-600 dark:text-secondary-400',
      className
    )}
    {...props}
  />
));

// Set display names
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  cardVariants,
  cardHeaderVariants,
  cardBodyVariants,
  cardFooterVariants,
};
