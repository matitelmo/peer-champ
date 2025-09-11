/**
 * Data Table Component
 *
 * An advanced data table component with built-in state management,
 * search, filtering, and export functionality.
 */

'use client';

import React, { useState, useMemo, useCallback, ReactNode } from 'react';
import { Table, Column } from './Table';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Drawer } from './Drawer';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Types
export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  exportFileName?: string;
  onExport?: (data: T[]) => void;
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onBulkDelete?: (records: T[]) => void;
  rowKey?: keyof T | ((record: T) => string);
  pageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  emptyText?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFields,
  filterable = true,
  selectable = true,
  exportable = true,
  exportFileName = 'data',
  onExport,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  rowKey = 'id',
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
  title,
  description,
  actions,
  emptyText = 'No data available',
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sorting, setSorting] = useState<{
    field: string;
    order: 'asc' | 'desc';
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchable) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((record) => {
        if (searchFields) {
          return searchFields.some((field) => {
            const value = record[field];
            return String(value).toLowerCase().includes(searchLower);
          });
        } else {
          return Object.values(record).some((value) =>
            String(value).toLowerCase().includes(searchLower)
          );
        }
      });
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter((record) => {
        return Object.entries(filters).every(([field, value]) => {
          if (!value) return true;
          const recordValue = record[field];
          return String(recordValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      });
    }

    return result;
  }, [data, searchTerm, filters, searchable, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sorting) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sorting.field);
      if (!column) return 0;

      const aValue = column.dataIndex ? a[column.dataIndex] : a[sorting.field];
      const bValue = column.dataIndex ? b[column.dataIndex] : b[sorting.field];

      if (aValue < bValue) return sorting.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sorting, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, currentPageSize]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Clear filter
  const clearFilter = (field: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSorting({ field, order });
  };

  // Handle selection
  const handleSelectionChange = (keys: string[], rows: T[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  // Handle pagination
  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setCurrentPageSize(size);
  };

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
    } else {
      // Default CSV export
      const csvContent = [
        columns.map((col) => col.title).join(','),
        ...sortedData.map((record) =>
          columns
            .map((col) => {
              const value = col.dataIndex
                ? record[col.dataIndex]
                : record[col.key];
              return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportFileName}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.length > 0) {
      onBulkDelete(selectedRows);
      setSelectedRows([]);
      setSelectedRowKeys([]);
    }
  };

  // Get filterable columns
  const filterableColumns = columns.filter((col) => col.filterable);

  // Render search and filters
  const renderSearchAndFilters = () => {
    if (!searchable && !filterable) return null;

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {searchable && (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}

          {filterable && filterableColumns.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {Object.keys(filters).length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
          )}

          {(searchTerm || Object.keys(filters).length > 0) && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {exportable && (
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Export</span>
            </Button>
          )}

          {onAdd && (
            <Button onClick={onAdd} className="flex items-center space-x-2">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
          )}

          {actions}
        </div>
      </div>
    );
  };

  // Render bulk actions
  const renderBulkActions = () => {
    if (!selectable || selectedRows.length === 0) return null;

    return (
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-700 dark:text-primary-300">
              {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''}{' '}
              selected
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedRows([]);
                setSelectedRowKeys([]);
              }}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear selection
            </Button>
          </div>

          {onBulkDelete && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center space-x-2"
            >
              <span>Delete Selected</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Render filters drawer
  const renderFiltersDrawer = () => {
    if (!filterable || filterableColumns.length === 0) return null;

    return (
      <Drawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        position="right"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All
            </Button>
            <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </div>
        }
      >
        <div className="space-y-6">
          {filterableColumns.map((column) => (
            <div key={column.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {column.title}
              </label>
              <Input
                placeholder={`Filter ${column.title.toLowerCase()}...`}
                value={filters[column.key] || ''}
                onChange={(e) => handleFilter(column.key, e.target.value)}
              />
              {filters[column.key] && (
                <button
                  onClick={() => clearFilter(column.key)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (loading || sortedData.length > 0) return null;

    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          {emptyText}
        </h3>
        {emptyDescription && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {emptyDescription}
          </p>
        )}
        {emptyAction && (
          <div className="mt-6">
            <Button onClick={emptyAction.onClick}>{emptyAction.label}</Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Search and Filters */}
      {renderSearchAndFilters()}

      {/* Bulk Actions */}
      {renderBulkActions()}

      {/* Table */}
      {sortedData.length > 0 ? (
        <Table
          data={paginatedData}
          columns={columns}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: currentPageSize,
            total: sortedData.length,
            showSizeChanger: true,
            showTotal: true,
          }}
          sorting={sorting || undefined}
          selection={
            selectable
              ? {
                  selectedRowKeys,
                  onChange: handleSelectionChange,
                }
              : undefined
          }
          onSort={handleSort}
          onPaginationChange={handlePaginationChange}
          rowKey={rowKey}
          onRow={(record) => ({
            onClick: onEdit ? () => onEdit(record) : undefined,
          })}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Filters Drawer */}
      {renderFiltersDrawer()}
    </div>
  );
};

export default DataTable;
