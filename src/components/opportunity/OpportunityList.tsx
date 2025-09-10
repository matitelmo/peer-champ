/**
 * Opportunity List Component
 *
 * Displays a list of opportunities with filtering, sorting, and action capabilities.
 * Includes search functionality and status-based filtering.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/types/database';
import {
  Button,
  Input,
  Select,
  Table,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  Spinner,
  Badge,
  Modal,
  LoadingButton,
} from '@/components/ui';
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserIcon,
  TagIcon,
} from '@/components/ui/icons';
import { OpportunityForm } from './OpportunityForm';
import { OpportunityDetails } from './OpportunityDetails';

interface OpportunityListProps {
  className?: string;
}

const DEAL_STAGE_OPTIONS = [
  { value: '', label: 'All Stages' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const REFERENCE_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'not_requested', label: 'Not Requested' },
  { value: 'requested', label: 'Requested' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
];

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'deal_value_desc', label: 'Highest Value' },
  { value: 'deal_value_asc', label: 'Lowest Value' },
  { value: 'expected_close_date_asc', label: 'Closest Close Date' },
  { value: 'expected_close_date_desc', label: 'Farthest Close Date' },
  { value: 'priority_score_desc', label: 'Highest Priority' },
  { value: 'priority_score_asc', label: 'Lowest Priority' },
];

export const OpportunityList: React.FC<OpportunityListProps> = ({
  className = '',
}) => {
  const { opportunities, loading, error, deleteOpportunity, deleting } =
    useOpportunities();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [dealStageFilter, setDealStageFilter] = useState('');
  const [referenceStatusFilter, setReferenceStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at_desc');

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  // Filter and sort opportunities
  const filteredAndSortedOpportunities = useMemo(() => {
    const filtered = opportunities.filter((opportunity) => {
      const matchesSearch =
        searchTerm === '' ||
        opportunity.prospect_company
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.opportunity_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.prospect_contact_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.prospect_contact_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDealStage =
        dealStageFilter === '' || opportunity.deal_stage === dealStageFilter;
      const matchesReferenceStatus =
        referenceStatusFilter === '' ||
        opportunity.reference_request_status === referenceStatusFilter;

      return matchesSearch && matchesDealStage && matchesReferenceStatus;
    });

    // Sort opportunities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'created_at_asc':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case 'deal_value_desc':
          return (b.deal_value || 0) - (a.deal_value || 0);
        case 'deal_value_asc':
          return (a.deal_value || 0) - (b.deal_value || 0);
        case 'expected_close_date_asc':
          if (!a.expected_close_date && !b.expected_close_date) return 0;
          if (!a.expected_close_date) return 1;
          if (!b.expected_close_date) return -1;
          return (
            new Date(a.expected_close_date).getTime() -
            new Date(b.expected_close_date).getTime()
          );
        case 'expected_close_date_desc':
          if (!a.expected_close_date && !b.expected_close_date) return 0;
          if (!a.expected_close_date) return -1;
          if (!b.expected_close_date) return 1;
          return (
            new Date(b.expected_close_date).getTime() -
            new Date(a.expected_close_date).getTime()
          );
        case 'priority_score_desc':
          return (b.priority_score || 0) - (a.priority_score || 0);
        case 'priority_score_asc':
          return (a.priority_score || 0) - (b.priority_score || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    opportunities,
    searchTerm,
    dealStageFilter,
    referenceStatusFilter,
    sortBy,
  ]);

  // Handle opportunity actions
  const handleView = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailsModal(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowEditModal(true);
  };

  const handleDelete = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedOpportunity) {
      try {
        await deleteOpportunity(selectedOpportunity.id);
        setShowDeleteModal(false);
        setSelectedOpportunity(null);
      } catch (err) {
        console.error('Failed to delete opportunity:', err);
      }
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedOpportunity(null);
  };

  // Get badge variant for deal stage
  const getDealStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case 'discovery':
        return 'secondary';
      case 'qualification':
        return 'default';
      case 'proposal':
        return 'default';
      case 'negotiation':
        return 'warning';
      case 'closed_won':
        return 'success';
      case 'closed_lost':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Get badge variant for reference status
  const getReferenceStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'not_requested':
        return 'secondary';
      case 'requested':
        return 'default';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'declined':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Format currency
  const formatCurrency = (
    value: number | undefined,
    currency: string = 'USD'
  ) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns
  const columns = [
    {
      header: 'Company',
      accessor: 'prospect_company',
      render: (opportunity: Opportunity) => (
        <div className="flex items-center space-x-2">
          <BuildingOfficeIcon size={16} className="text-gray-400" />
          <span className="font-medium">{opportunity.prospect_company}</span>
        </div>
      ),
    },
    {
      header: 'Opportunity',
      accessor: 'opportunity_name',
      render: (opportunity: Opportunity) => (
        <div>
          <div className="font-medium">{opportunity.opportunity_name}</div>
          {opportunity.prospect_contact_name && (
            <div className="text-sm text-gray-500 flex items-center">
              <UserIcon size={12} className="mr-1" />
              {opportunity.prospect_contact_name}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Deal Value',
      accessor: 'deal_value',
      render: (opportunity: Opportunity) => (
        <div className="flex items-center space-x-1">
          <CurrencyDollarIcon size={16} className="text-gray-400" />
          <span>
            {formatCurrency(opportunity.deal_value, opportunity.currency)}
          </span>
        </div>
      ),
    },
    {
      header: 'Stage',
      accessor: 'deal_stage',
      render: (opportunity: Opportunity) => (
        <Badge variant={getDealStageBadgeVariant(opportunity.deal_stage)}>
          {opportunity.deal_stage.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Probability',
      accessor: 'probability',
      render: (opportunity: Opportunity) => (
        <span>
          {opportunity.probability ? `${opportunity.probability}%` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Close Date',
      accessor: 'expected_close_date',
      render: (opportunity: Opportunity) => (
        <div className="flex items-center space-x-1">
          <CalendarIcon size={16} className="text-gray-400" />
          <span>{formatDate(opportunity.expected_close_date)}</span>
        </div>
      ),
    },
    {
      header: 'Reference Status',
      accessor: 'reference_request_status',
      render: (opportunity: Opportunity) => (
        <Badge
          variant={getReferenceStatusBadgeVariant(
            opportunity.reference_request_status
          )}
        >
          {opportunity.reference_request_status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority_score',
      render: (opportunity: Opportunity) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${opportunity.priority_score || 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {opportunity.priority_score || 0}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (opportunity: Opportunity) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(opportunity)}
            title="View Details"
          >
            <EyeIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(opportunity)}
            title="Edit"
          >
            <PencilIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(opportunity)}
            title="Delete"
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>
                Manage your sales opportunities and reference requests
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<PlusIcon size={20} />}
            >
              Create Opportunity
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={dealStageFilter}
              onChange={setDealStageFilter}
              options={DEAL_STAGE_OPTIONS}
              placeholder="Filter by stage"
            />

            <Select
              value={referenceStatusFilter}
              onChange={setReferenceStatusFilter}
              options={REFERENCE_STATUS_OPTIONS}
              placeholder="Filter by reference status"
            />

            <Select
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              placeholder="Sort by"
            />
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredAndSortedOpportunities.length} of{' '}
            {opportunities.length} opportunities
          </div>

          {/* Opportunities Table */}
          {filteredAndSortedOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {opportunities.length === 0 ? (
                  <>
                    <BuildingOfficeIcon
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p className="text-lg font-medium">No opportunities yet</p>
                    <p className="text-sm">
                      Create your first opportunity to get started
                    </p>
                  </>
                ) : (
                  <>
                    <SearchIcon
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p className="text-lg font-medium">
                      No opportunities match your filters
                    </p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </>
                )}
              </div>
              {opportunities.length === 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={<PlusIcon size={20} />}
                >
                  Create First Opportunity
                </Button>
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredAndSortedOpportunities}
              className="min-w-full"
            />
          )}
        </CardBody>
      </Card>

      {/* Create Opportunity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Opportunity"
        size="xl"
      >
        <OpportunityForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Opportunity Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Opportunity"
        size="xl"
      >
        {selectedOpportunity && (
          <OpportunityForm
            opportunity={selectedOpportunity}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      {/* Opportunity Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Opportunity Details"
        size="xl"
      >
        {selectedOpportunity && (
          <OpportunityDetails
            opportunity={selectedOpportunity}
            onEdit={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
            onDelete={() => {
              setShowDetailsModal(false);
              setShowDeleteModal(true);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Opportunity"
      >
        {selectedOpportunity && (
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Opportunity
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the opportunity "
                {selectedOpportunity.opportunity_name}"? This action cannot be
                undone.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="destructive"
                  onClick={confirmDelete}
                  loading={deleting}
                >
                  Delete
                </LoadingButton>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
