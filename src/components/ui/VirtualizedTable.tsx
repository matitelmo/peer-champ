/**
 * Virtualized Table Component
 * 
 * A high-performance table component for large datasets using virtualization.
 * Renders only visible rows to maintain performance with thousands of records.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { Column } from './Table';

// Types
export interface VirtualizedTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
  overscan?: number;
  loading?: boolean;
  className?: string;
  rowKey?: keyof T | ((record: T) => string);
  rowClassName?: (record: T, index: number) => string;
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  emptyText?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
}

export const VirtualizedTable = <T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  rowHeight = 40,
  overscan = 5,
  loading = false,
  className = '',
  rowKey = 'id',
  rowClassName,
  onRow,
  emptyText = 'No data available',
  showHeader = true,
  stickyHeader = true,
}: VirtualizedTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / rowHeight) + overscan,
      data.length
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex,
    };
  }, [scrollTop, containerHeight, rowHeight, overscan, data.length]);

  // Get visible data
  const visibleData = useMemo(() => {
    return data.slice(visibleRange.start, visibleRange.end);
  }, [data, visibleRange]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Render header
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <div
        className={`
          flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
          ${stickyHeader ? 'sticky top-0 z-10' : ''}
        `}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={`
              px-4 py-3 text-${column.align || 'left'} font-medium text-gray-900 dark:text-white
              ${column.headerClassName || ''}
            `}
            style={{ width: column.width || 'auto', minWidth: column.width || 'auto' }}
          >
            {column.title}
          </div>
        ))}
      </div>
    );
  };

  // Render row
  const renderRow = (record: T, index: number) => {
    const actualIndex = visibleRange.start + index;
    const key = getRowKey(record, actualIndex);
    const rowProps = onRow?.(record, actualIndex) || {};

    return (
      <div
        key={key}
        className={`
          flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50
          ${rowClassName?.(record, actualIndex) || ''}
          ${rowProps.onClick ? 'cursor-pointer' : ''}
        `}
        style={{ height: rowHeight }}
        onClick={rowProps.onClick}
        onDoubleClick={rowProps.onDoubleClick}
        onMouseEnter={rowProps.onMouseEnter}
        onMouseLeave={rowProps.onMouseLeave}
      >
        {columns.map((column) => {
          const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
          const content = column.render ? column.render(value, record, actualIndex) : value;

          return (
            <div
              key={column.key}
              className={`
                px-4 py-3 text-${column.align || 'left'} text-gray-900 dark:text-white
                ${column.className || ''}
              `}
              style={{ width: column.width || 'auto', minWidth: column.width || 'auto' }}
            >
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  // Render loading state
  const renderLoading = () => {
    if (!loading) return null;

    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading || data.length > 0) return null;

    return (
      <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        {emptyText}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      {/* Header */}
      {renderHeader()}

      {/* Content */}
      <div
        style={{
          height: data.length * rowHeight,
          position: 'relative',
        }}
      >
        {/* Spacer for items before visible range */}
        <div
          style={{
            height: visibleRange.start * rowHeight,
          }}
        />

        {/* Visible rows */}
        <div
          style={{
            position: 'absolute',
            top: visibleRange.start * rowHeight,
            left: 0,
            right: 0,
          }}
        >
          {loading ? (
            renderLoading()
          ) : data.length === 0 ? (
            renderEmpty()
          ) : (
            visibleData.map((record, index) => renderRow(record, index))
          )}
        </div>
      </div>
    </div>
  );
};

// Infinite Scroll Table Component
export interface InfiniteScrollTableProps<T = any> extends VirtualizedTableProps<T> {
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  threshold?: number;
}

export const InfiniteScrollTable = <T extends Record<string, any>>({
  data,
  columns,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  threshold = 100,
  ...props
}: InfiniteScrollTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(props.height || 400);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: newScrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setScrollTop(newScrollTop);

    // Check if we need to load more data
    if (
      hasMore &&
      onLoadMore &&
      !loadingMore &&
      scrollHeight - newScrollTop - clientHeight < threshold
    ) {
      onLoadMore();
    }
  };

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="space-y-4">
      <VirtualizedTable
        {...props}
        data={data}
        columns={columns}
        height={containerHeight}
        className={props.className}
        onScroll={handleScroll}
      />
      
      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Loading more...
          </span>
        </div>
      )}
    </div>
  );
};

export default VirtualizedTable;
