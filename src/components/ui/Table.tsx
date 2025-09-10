/**
 * Table Component
 *
 * A comprehensive table component with sorting, pagination, filtering, and selection.
 * Supports different variants, responsive design, and accessibility features.
 */

'use client';

import React, { useState, useMemo, ReactNode } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Spinner } from './Spinner';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Types
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
  };
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };
  selection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  filters?: Record<string, any>;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  rowKey?: keyof T | ((record: T) => string);
  rowClassName?: (record: T, index: number) => string;
  onRow?: (
    record: T,
    index: number
  ) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'bordered' | 'striped';
  className?: string;
  emptyText?: string;
  showHeader?: boolean;
  sticky?: boolean;
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  sorting,
  selection,
  filters = {},
  onSort,
  onFilter,
  onPaginationChange,
  rowKey = 'id',
  rowClassName,
  onRow,
  size = 'middle',
  variant = 'default',
  className = '',
  emptyText = 'No data available',
  showHeader = true,
  sticky = false,
}: TableProps<T>) => {
  const [localSorting, setLocalSorting] = useState<{
    field: string;
    order: 'asc' | 'desc';
  } | null>(null);
  const [localFilters, setLocalFilters] =
    useState<Record<string, any>>(filters);

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    const column = columns.find((col) => col.key === field);
    if (!column?.sortable) return;

    let newOrder: 'asc' | 'desc' = 'asc';
    if (sorting?.field === field && sorting?.order === 'asc') {
      newOrder = 'desc';
    } else if (sorting?.field === field && sorting?.order === 'desc') {
      newOrder = 'asc';
    }

    if (onSort) {
      onSort(field, newOrder);
    } else {
      setLocalSorting({ field, order: newOrder });
    }
  };

  // Handle filtering
  const handleFilter = (field: string, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Clear filter
  const clearFilter = (field: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[field];
    setLocalFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply local sorting if no external sorting
    if (!onSort && localSorting) {
      result.sort((a, b) => {
        const column = columns.find((col) => col.key === localSorting.field);
        if (!column) return 0;

        const aValue = column.dataIndex
          ? a[column.dataIndex]
          : a[localSorting.field];
        const bValue = column.dataIndex
          ? b[column.dataIndex]
          : b[localSorting.field];

        if (aValue < bValue) return localSorting.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return localSorting.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply local filtering if no external filtering
    if (!onFilter) {
      result = result.filter((record) => {
        return Object.entries(localFilters).every(([field, value]) => {
          if (!value) return true;
          const recordValue = record[field];
          return String(recordValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      });
    }

    return result;
  }, [data, localSorting, localFilters, columns, onSort, onFilter]);

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 dark:border-gray-700';
      case 'striped':
        return 'divide-y divide-gray-200 dark:divide-gray-700';
      default:
        return '';
    }
  };

  // Render sort icon
  const renderSortIcon = (field: string) => {
    const currentSorting = sorting || localSorting;
    if (currentSorting?.field !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    return currentSorting.order === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-primary-600" />
    );
  };

  // Render filter input
  const renderFilter = (column: Column<T>) => {
    if (!column.filterable) return null;

    return (
      <div className="mt-2">
        <Input
          size="sm"
          placeholder={`Filter ${column.title.toLowerCase()}...`}
          value={localFilters[column.key] || ''}
          onChange={(e) => handleFilter(column.key, e.target.value)}
          className="w-full"
        />
        {localFilters[column.key] && (
          <button
            onClick={() => clearFilter(column.key)}
            className="mt-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear filter
          </button>
        )}
      </div>
    );
  };

  // Render header
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <thead
        className={`bg-gray-50 dark:bg-gray-800 ${sticky ? 'sticky top-0 z-10' : ''}`}
      >
        <tr>
          {selection && (
            <th className="px-4 py-3 text-left">
              <Checkbox
                checked={
                  selection.selectedRowKeys.length === processedData.length &&
                  processedData.length > 0
                }
                indeterminate={
                  selection.selectedRowKeys.length > 0 &&
                  selection.selectedRowKeys.length < processedData.length
                }
                onChange={(checked) => {
                  if (checked) {
                    const allKeys = processedData.map((record, index) =>
                      getRowKey(record, index)
                    );
                    selection.onChange(allKeys, processedData);
                  } else {
                    selection.onChange([], []);
                  }
                }}
              />
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={`
                px-4 py-3 text-${column.align || 'left'} font-medium text-gray-900 dark:text-white
                ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                ${column.headerClassName || ''}
              `}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.title}</span>
                {column.sortable && renderSortIcon(column.key)}
                {column.filterable && (
                  <FunnelIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
              {column.filterable && renderFilter(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  // Render body
  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length + (selection ? 1 : 0)}
              className="px-4 py-8 text-center"
            >
              <Spinner size="lg" />
            </td>
          </tr>
        </tbody>
      );
    }

    if (processedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length + (selection ? 1 : 0)}
              className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
            >
              {emptyText}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {processedData.map((record, index) => {
          const key = getRowKey(record, index);
          const isSelected = selection?.selectedRowKeys.includes(key);
          const rowProps = onRow?.(record, index) || {};

          return (
            <tr
              key={key}
              className={`
                ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                ${rowClassName?.(record, index) || ''}
                ${rowProps.onClick ? 'cursor-pointer' : ''}
              `}
              onClick={rowProps.onClick}
              onDoubleClick={rowProps.onDoubleClick}
              onMouseEnter={rowProps.onMouseEnter}
              onMouseLeave={rowProps.onMouseLeave}
            >
              {selection && (
                <td className="px-4 py-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={(checked) => {
                      const newSelectedKeys = checked
                        ? [...selection.selectedRowKeys, key]
                        : selection.selectedRowKeys.filter((k) => k !== key);
                      const newSelectedRows = processedData.filter((_, i) =>
                        newSelectedKeys.includes(getRowKey(processedData[i], i))
                      );
                      selection.onChange(newSelectedKeys, newSelectedRows);
                    }}
                    {...selection.getCheckboxProps?.(record)}
                  />
                </td>
              )}
              {columns.map((column) => {
                const value = column.dataIndex
                  ? record[column.dataIndex]
                  : record[column.key];
                const content = column.render
                  ? column.render(value, record, index)
                  : value;

                return (
                  <td
                    key={column.key}
                    className={`
                      px-4 py-3 text-${column.align || 'left'} text-gray-900 dark:text-white
                      ${column.className || ''}
                    `}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const {
      current,
      pageSize,
      total,
      showSizeChanger,
      showQuickJumper,
      showTotal,
    } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {showTotal && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {(current - 1) * pageSize + 1} to{' '}
              {Math.min(current * pageSize, total)} of {total} entries
            </span>
          )}
          {showSizeChanger && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show:
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(e) =>
                  onPaginationChange?.(1, parseInt(e.target.value))
                }
                className="w-20"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange?.(current - 1, pageSize)}
            disabled={current <= 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={current === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onPaginationChange?.(page, pageSize)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange?.(current + 1, pageSize)}
            disabled={current >= totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-hidden ${getVariantClasses()} ${className}`}>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${getSizeClasses()}`}
        >
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default Table;
