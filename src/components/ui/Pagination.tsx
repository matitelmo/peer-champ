/**
 * Pagination Component
 *
 * A flexible pagination component with different variants and features.
 * Supports page navigation, page size selection, and customizable styling.
 */

'use client';

import React, { ReactNode } from 'react';
import { Button } from './Button';
import { Select } from './Select';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

// Types
export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  totalText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'bordered';
  className?: string;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  showPrevNextJump?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal = false,
  pageSizeOptions = [10, 20, 50, 100],
  totalText = 'items',
  size = 'md',
  variant = 'default',
  className = '',
  disabled = false,
  hideOnSinglePage = true,
  showPrevNextJump = false,
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  // Don't render if there's only one page and hideOnSinglePage is true
  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent';
      case 'bordered':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  // Get button size
  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'md';
    }
  };

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > halfVisible + 2) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - halfVisible);
      const end = Math.min(totalPages - 1, current + halfVisible);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - halfVisible - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === current) {
      return;
    }
    onPageChange(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Handle quick jumper
  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(e.currentTarget.value);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
        e.currentTarget.value = '';
      }
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex items-center justify-between ${getSizeClasses()} ${className}`}
    >
      {/* Left side - Total info and page size changer */}
      <div className="flex items-center space-x-4">
        {showTotal && (
          <span className="text-gray-700 dark:text-gray-300">
            Showing {startItem} to {endItem} of {total} {totalText}
          </span>
        )}

        {showSizeChanger && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 dark:text-gray-300">Show:</span>
            <Select
              value={pageSize.toString()}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              disabled={disabled}
              className="w-20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {/* Center - Page navigation */}
      <div
        className={`flex items-center space-x-1 ${getVariantClasses()} rounded-lg p-1`}
      >
        {/* First page button */}
        {showPrevNextJump && (
          <Button
            variant="ghost"
            size={getButtonSize()}
            onClick={() => handlePageChange(1)}
            disabled={disabled || current === 1}
            className="p-2"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </Button>
        )}

        {/* Previous page button */}
        <Button
          variant="ghost"
          size={getButtonSize()}
          onClick={() => handlePageChange(current - 1)}
          disabled={disabled || current === 1}
          className="p-2"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : (
              <Button
                variant={page === current ? 'primary' : 'ghost'}
                size={getButtonSize()}
                onClick={() => handlePageChange(page as number)}
                disabled={disabled}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Next page button */}
        <Button
          variant="ghost"
          size={getButtonSize()}
          onClick={() => handlePageChange(current + 1)}
          disabled={disabled || current === totalPages}
          className="p-2"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        {/* Last page button */}
        {showPrevNextJump && (
          <Button
            variant="ghost"
            size={getButtonSize()}
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || current === totalPages}
            className="p-2"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side - Quick jumper */}
      {showQuickJumper && (
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onKeyDown={handleQuickJump}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

// Simple Pagination Component
export interface SimplePaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  showLabels?: boolean;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  current,
  total,
  onPageChange,
  size = 'md',
  className = '',
  disabled = false,
  showLabels = true,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'md';
    }
  };

  return (
    <div
      className={`flex items-center justify-center space-x-2 ${getSizeClasses()} ${className}`}
    >
      <Button
        variant="outline"
        size={getButtonSize()}
        onClick={() => onPageChange(current - 1)}
        disabled={disabled || current === 1}
        className="flex items-center space-x-1"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {showLabels && <span>Previous</span>}
      </Button>

      <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
        Page {current} of {total}
      </span>

      <Button
        variant="outline"
        size={getButtonSize()}
        onClick={() => onPageChange(current + 1)}
        disabled={disabled || current === total}
        className="flex items-center space-x-1"
      >
        {showLabels && <span>Next</span>}
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
