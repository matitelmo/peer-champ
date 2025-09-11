/**
 * Reference Call List Component
 *
 * Displays a list of reference calls with filtering, sorting, and actions.
 * Shows call status, participants, and scheduling information.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useReferenceCalls } from '@/hooks/useReferenceCalls';
import { ReferenceCall } from '@/types/database';
import {
  Table,
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Alert,
  LoadingOverlay,
  EmptyState,
  ErrorState,
} from '@/components/ui';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
} from '@/components/ui/icons';

interface ReferenceCallListProps {
  onViewCall?: (call: ReferenceCall) => void;
  onEditCall?: (call: ReferenceCall) => void;
  onDeleteCall?: (call: ReferenceCall) => void;
  onCreateCall?: () => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

const SORT_OPTIONS = [
  { value: 'scheduled_at_desc', label: 'Scheduled Date (Newest)' },
  { value: 'scheduled_at_asc', label: 'Scheduled Date (Oldest)' },
  { value: 'created_at_desc', label: 'Created Date (Newest)' },
  { value: 'created_at_asc', label: 'Created Date (Oldest)' },
  { value: 'prospect_company_asc', label: 'Prospect Company (A-Z)' },
  { value: 'advocate_id_asc', label: 'Advocate ID (A-Z)' },
];

export const ReferenceCallList: React.FC<ReferenceCallListProps> = ({
  onViewCall,
  onEditCall,
  onDeleteCall,
  onCreateCall,
  className = '',
}) => {
  const { calls, loading, error, deleteCall } = useReferenceCalls();

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('scheduled_at_desc');

  // Filter and sort calls
  const filteredAndSortedCalls = useMemo(() => {
    let filtered = calls;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (call) =>
          call.prospect_name?.toLowerCase().includes(term) ||
          call.prospect_company?.toLowerCase().includes(term) ||
          call.prospect_email?.toLowerCase().includes(term) ||
          call.advocate_id?.toLowerCase().includes(term) ||
          "Unknown Company"?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((call) => call.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'scheduled_at_desc':
          return (
            new Date(b.scheduled_at || 0).getTime() -
            new Date(a.scheduled_at || 0).getTime()
          );
        case 'scheduled_at_asc':
          return (
            new Date(a.scheduled_at || 0).getTime() -
            new Date(b.scheduled_at || 0).getTime()
          );
        case 'created_at_desc':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'created_at_asc':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case 'prospect_company_asc':
          return (a.prospect_company || '').localeCompare(
            b.prospect_company || ''
          );
        case 'advocate_id_asc':
          return (a.advocate_id || '').localeCompare(b.advocate_id || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [calls, searchTerm, statusFilter, sortBy]);

  // Handle delete confirmation
  const handleDeleteCall = async (call: ReferenceCall) => {
    if (
      window.confirm(
        `Are you sure you want to delete the reference call with ${call.prospect_name}?`
      )
    ) {
      try {
        await deleteCall(call.id);
        onDeleteCall?.(call);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get meeting platform icon
  const getMeetingPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
      case 'teams':
      case 'google_meet':
      case 'webex':
        return <VideoCameraIcon size={16} />;
      case 'phone':
        return <PhoneIcon size={16} />;
      default:
        return <VideoCameraIcon size={16} />;
    }
  };

  // Table columns
  const columns = [
    {
      key: 'scheduled_at',
      title: 'Scheduled',
      render: (call: ReferenceCall) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon size={16} className="text-gray-500" />
          <span className="text-sm">{call.scheduled_at ? formatDate(call.scheduled_at) : "Not scheduled"}</span>
        </div>
      ),
    },
    {
      key: 'prospect',
      title: 'Prospect',
      render: (call: ReferenceCall) => (
        <div>
          <div className="font-medium">{call.prospect_name}</div>
          <div className="text-sm text-gray-500">{call.prospect_company}</div>
          <div className="text-sm text-gray-400">{call.prospect_email}</div>
        </div>
      ),
    },
    {
      key: 'advocate',
      title: 'Advocate',
      render: (call: ReferenceCall) => (
        <div>
          <div className="font-medium">{call.advocate_id}</div>
          <div className="text-sm text-gray-500">{"Unknown Company"}</div>
        </div>
      ),
    },
    {
      key: 'meeting',
      title: 'Meeting',
      render: (call: ReferenceCall) => (
        <div className="flex items-center space-x-2">
          {getMeetingPlatformIcon(call.meeting_platform || 'zoom')}
          <span className="text-sm capitalize">{call.meeting_platform}</span>
          {call.duration_minutes && (
            <div className="flex items-center space-x-1 text-gray-500">
              <ClockIcon size={14} />
              <span className="text-xs">{call.duration_minutes}m</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (call: ReferenceCall) => (
        <Badge variant={getStatusBadgeVariant(call.status)}>
          {call.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (call: ReferenceCall) => (
        <div className="flex items-center space-x-2">
          {onViewCall && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewCall(call)}
              title="View details"
            >
              <EyeIcon size={16} />
            </Button>
          )}
          {onEditCall && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditCall(call)}
              title="Edit call"
            >
              <PencilIcon size={16} />
            </Button>
          )}
          {onDeleteCall && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteCall(call)}
              title="Delete call"
            >
              <TrashIcon size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <ErrorState
        title="Failed to load reference calls"
        description={error}
        onRetry={() => window.location.reload()} retryLabel="Try Again"/>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reference Calls</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track reference call sessions
            </p>
          </div>
          {onCreateCall && (
            <Button onClick={onCreateCall}>
              <PlusIcon size={16} className="mr-2" />
              Schedule Call
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search calls by prospect, advocate, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS}
              className="w-40"
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              className="w-48"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredAndSortedCalls.length} call
            {filteredAndSortedCalls.length !== 1 ? 's' : ''} found
          </p>
          {(searchTerm || statusFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Calls Table */}
        <div className="relative">
          <LoadingOverlay visible={loading} />

          {filteredAndSortedCalls.length === 0 ? (
            <EmptyState
              title="No reference calls found"
              description={
                searchTerm || statusFilter
                  ? 'No calls match your current filters. Try adjusting your search criteria.'
                  : 'No reference calls have been scheduled yet. Create your first call to get started.'
              }
              action={
                onCreateCall ? {
                  label: "Schedule First Call",
                  onClick: onCreateCall
                } : undefined
              }
            />
          ) : (
            <Table
              data={filteredAndSortedCalls}
              columns={columns}
              className="w-full"
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
