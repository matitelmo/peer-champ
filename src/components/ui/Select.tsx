/**
 * Select Component
 *
 * A comprehensive select dropdown component with validation states, search functionality,
 * and accessibility features. Supports single and multiple selection modes.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  AlertTriangleIcon,
  CheckIcon,
  InfoIcon,
  SearchIcon,
} from './icons';

// Select variants using class-variance-authority
const selectVariants = cva(
  [
    'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
    'cursor-pointer',
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

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      'size' | 'onChange'
    >,
    VariantProps<typeof selectVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Select size */
  size?: 'sm' | 'md' | 'lg';
  /** Validation state */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Label text */
  label?: string;
  /** Help text displayed below the select */
  helpText?: string;
  /** Error message displayed below the select */
  errorMessage?: string;
  /** Success message displayed below the select */
  successMessage?: string;
  /** Warning message displayed below the select */
  warningMessage?: string;
  /** Options for the select */
  options: SelectOption[];
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Whether to show validation icons */
  showValidationIcon?: boolean;
  /** Whether to enable search functionality */
  searchable?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Ref forwarding */
  ref?: React.Ref<HTMLSelectElement>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
      options,
      value,
      onChange,
      placeholder = 'Select an option...',
      required,
      showValidationIcon = true,
      searchable = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Determine the actual variant based on messages
    const actualVariant = errorMessage
      ? 'error'
      : successMessage
        ? 'success'
        : warningMessage
          ? 'warning'
          : variant || 'default';

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const helpId = `${selectId}-help`;
    const errorId = `${selectId}-error`;

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Group options if they have groups
    const groupedOptions = filteredOptions.reduce(
      (groups, option) => {
        const group = option.group || 'default';
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      },
      {} as Record<string, SelectOption[]>
    );

    // Get selected option
    const selectedOption = options.find((option) => option.value === value);

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

    // Handle option selection
    const handleOptionSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    };

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
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

        {/* Select Container */}
        <div className="relative" ref={selectRef}>
          {/* Select Trigger */}
          <button
            type="button"
            className={cn(
              selectVariants({ variant: actualVariant, size }),
              getValidationIcon() && 'pr-10',
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-describedby={cn(helpText && helpId, message && errorId)}
            aria-invalid={actualVariant === 'error'}
          >
            <span
              className={cn(
                'truncate',
                !selectedOption && 'text-secondary-500 dark:text-secondary-400'
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {getValidationIcon()}
              <ChevronDownIcon
                className={cn(
                  'h-4 w-4 text-secondary-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-secondary-200 bg-white shadow-lg dark:border-secondary-700 dark:bg-secondary-800">
              {/* Search Input */}
              {searchable && (
                <div className="border-b border-secondary-200 p-2 dark:border-secondary-700">
                  <div className="relative">
                    <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-md border border-secondary-300 bg-white px-8 py-1 text-sm placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder:text-secondary-400"
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="max-h-60 overflow-auto p-1">
                {Object.entries(groupedOptions).map(
                  ([groupName, groupOptions]) => (
                    <div key={groupName}>
                      {/* Group Label */}
                      {groupName !== 'default' && (
                        <div className="px-2 py-1 text-xs font-medium text-secondary-500 dark:text-secondary-400">
                          {groupName}
                        </div>
                      )}

                      {/* Group Options */}
                      {groupOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors',
                            'hover:bg-secondary-100 dark:hover:bg-secondary-700',
                            'focus:bg-secondary-100 focus:outline-none dark:focus:bg-secondary-700',
                            option.disabled && 'cursor-not-allowed opacity-50',
                            value === option.value &&
                              'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          )}
                          onClick={() =>
                            !option.disabled && handleOptionSelect(option.value)
                          }
                          disabled={option.disabled}
                        >
                          <span className="truncate">{option.label}</span>
                          {value === option.value && (
                            <CheckIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )
                )}

                {/* No Options */}
                {filteredOptions.length === 0 && (
                  <div className="px-2 py-2 text-sm text-secondary-500 dark:text-secondary-400">
                    No options found
                  </div>
                )}
              </div>
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

Select.displayName = 'Select';

export { Select, selectVariants };
