/**
 * Advocate List Component
 *
 * Displays a list of advocates with filtering, search, and management capabilities.
 * Includes advocate cards with key information and action buttons.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useAdvocates } from '@/hooks/useAdvocates';
import { Advocate, AdvocateStatus, CompanySize } from '@/types/database';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  EmptyState,
  Alert,
  Modal,
  ConfirmModal,
} from '@/components/ui';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
} from '@/components/ui/icons';

interface AdvocateListProps {
  onEdit?: (advocate: Advocate) => void;
  onView?: (advocate: Advocate) => void;
  onCreate?: () => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const COMPANY_SIZE_OPTIONS = [
  { value: 'all', label: 'All Sizes' },
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Availability' },
  { value: 'high', label: 'High (80-100)' },
  { value: 'medium', label: 'Medium (50-79)' },
  { value: 'low', label: 'Low (0-49)' },
];

export const AdvocateList: React.FC<AdvocateListProps> = ({
  onEdit,
  onView,
  onCreate,
  className = '',
}) => {
  const {
    advocates,
    loading,
    error,
    fetchAdvocates,
    deleteAdvocateData,
    deleting,
  } = useAdvocates();

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as string,
    companySize: 'all' as string,
    availability: 'all' as string,
  });

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [advocateToDelete, setAdvocateToDelete] = useState<Advocate | null>(
    null
  );

  // Filter advocates based on current filters
  const filteredAdvocates = useMemo(() => {
    return advocates.filter((advocate) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          advocate.name.toLowerCase().includes(searchLower) ||
          advocate.email.toLowerCase().includes(searchLower) ||
          advocate.company_name?.toLowerCase().includes(searchLower) ||
          advocate.industry?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && advocate.status !== filters.status) {
        return false;
      }

      // Company size filter
      if (
        filters.companySize !== 'all' &&
        advocate.company_size !== filters.companySize
      ) {
        return false;
      }

      // Availability filter
      if (filters.availability !== 'all') {
        const score = advocate.availability_score;
        switch (filters.availability) {
          case 'high':
            if (score < 80) return false;
            break;
          case 'medium':
            if (score < 50 || score >= 80) return false;
            break;
          case 'low':
            if (score >= 50) return false;
            break;
        }
      }

      return true;
    });
  }, [advocates, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle advocate deletion
  const handleDeleteClick = (advocate: Advocate) => {
    setAdvocateToDelete(advocate);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!advocateToDelete) return;

    try {
      await deleteAdvocateData(advocateToDelete.id);
      setDeleteModalOpen(false);
      setAdvocateToDelete(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: AdvocateStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'blacklisted':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Get availability badge variant
  const getAvailabilityBadgeVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'destructive';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advocates</h2>
          <p className="text-gray-600">
            Manage your customer advocates and their participation in reference
            calls.
          </p>
        </div>

        {onCreate && (
          <Button onClick={onCreate} leftIcon={<PlusIcon size={20} />}>
            Add Advocate
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search advocates..."
                leftIcon={<MagnifyingGlassIcon size={20} />}
              />
            </div>

            <div>
              <Select
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={STATUS_OPTIONS}
              />
            </div>

            <div>
              <Select
                label="Company Size"
                value={filters.companySize}
                onChange={(value) => handleFilterChange('companySize', value)}
                options={COMPANY_SIZE_OPTIONS}
              />
            </div>

            <div>
              <Select
                label="Availability"
                value={filters.availability}
                onChange={(value) => handleFilterChange('availability', value)}
                options={AVAILABILITY_OPTIONS}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredAdvocates.length} of {advocates.length} advocates
        </p>
      </div>

      {/* Advocate Grid */}
      {filteredAdvocates.length === 0 ? (
        <EmptyState
          icon={<UserIcon size={48} />}
          title="No advocates found"
          description="No advocates match your current filters. Try adjusting your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvocates.map((advocate) => (
            <Card
              key={advocate.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{advocate.name}</CardTitle>
                    <p className="text-sm text-gray-600">{advocate.title}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Badge variant={getStatusBadgeVariant(advocate.status)}>
                      {advocate.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0">
                <div className="space-y-3">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon size={16} className="mr-2" />
                      {advocate.email}
                    </div>

                    {advocate.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon size={16} className="mr-2" />
                        {advocate.phone}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <BuildingOfficeIcon size={16} className="mr-2" />
                      {advocate.company_name}
                    </div>

                    {advocate.geographic_region && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon size={16} className="mr-2" />
                        {advocate.geographic_region}
                      </div>
                    )}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Availability</p>
                      <Badge
                        variant={getAvailabilityBadgeVariant(
                          advocate.availability_score
                        )}
                      >
                        {advocate.availability_score}%
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Calls Completed</p>
                      <p className="text-sm font-medium">
                        {advocate.total_calls_completed}
                      </p>
                    </div>
                  </div>

                  {/* Use Cases */}
                  {advocate.use_cases && advocate.use_cases.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Use Cases</p>
                      <div className="flex flex-wrap gap-1">
                        {advocate.use_cases.slice(0, 3).map((useCase) => (
                          <Badge key={useCase} variant="secondary" size="sm">
                            {useCase}
                          </Badge>
                        ))}
                        {advocate.use_cases.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{advocate.use_cases.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-3 border-t">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(advocate)}
                        className="flex-1"
                      >
                        View
                      </Button>
                    )}

                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(advocate)}
                        leftIcon={<PencilIcon size={16} />}
                      >
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(advocate)}
                      leftIcon={<TrashIcon size={16} />}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Advocate"
        description={`Are you sure you want to delete ${advocateToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        loading={deleting}
      />
    </div>
  );
};
