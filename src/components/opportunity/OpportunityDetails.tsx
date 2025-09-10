/**
 * Opportunity Details Component
 *
 * Displays detailed information about an opportunity including all fields,
 * reference requirements, and action buttons.
 */

'use client';

import React from 'react';
import { Opportunity } from '@/types/database';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Separator,
} from '@/components/ui';
import {
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@/components/ui/icons';

interface OpportunityDetailsProps {
  opportunity: Opportunity;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({
  opportunity,
  onEdit,
  onDelete,
  className = '',
}) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format date with time
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  // Get badge variant for reference urgency
  const getReferenceUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'declined':
        return <XCircleIcon size={16} className="text-red-500" />;
      case 'in_progress':
        return <ClockIcon size={16} className="text-yellow-500" />;
      case 'requested':
        return <ExclamationTriangleIcon size={16} className="text-blue-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {opportunity.opportunity_name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {opportunity.prospect_company}
          </p>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              leftIcon={<PencilIcon size={16} />}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              leftIcon={<TrashIcon size={16} />}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={getDealStageBadgeVariant(opportunity.deal_stage)}>
          {opportunity.deal_stage.replace('_', ' ').toUpperCase()}
        </Badge>
        <Badge
          variant={getReferenceStatusBadgeVariant(
            opportunity.reference_request_status
          )}
        >
          {getStatusIcon(opportunity.reference_request_status)}
          <span className="ml-1">
            {opportunity.reference_request_status
              .replace('_', ' ')
              .toUpperCase()}
          </span>
        </Badge>
        <Badge
          variant={getReferenceUrgencyBadgeVariant(
            opportunity.reference_urgency
          )}
        >
          {opportunity.reference_urgency.toUpperCase()} PRIORITY
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Prospect Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BuildingOfficeIcon size={20} className="mr-2" />
                Prospect Information
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_company}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Industry
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_industry || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company Size
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_size || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Region
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.geographic_region || 'N/A'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon size={20} className="mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_contact_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Title
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_contact_title || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_contact_email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.prospect_phone || 'N/A'}
                  </p>
                </div>
              </div>
              {opportunity.prospect_website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Website
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <a
                      href={opportunity.prospect_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {opportunity.prospect_website}
                    </a>
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Deal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyDollarIcon size={20} className="mr-2" />
                Deal Information
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Deal Value
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      opportunity.deal_value,
                      opportunity.currency
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Probability
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {opportunity.probability
                      ? `${opportunity.probability}%`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Expected Close Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(opportunity.expected_close_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Priority Score
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${opportunity.priority_score || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {opportunity.priority_score || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Reference Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TagIcon size={20} className="mr-2" />
                Reference Requirements
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reference Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.reference_type_needed
                      .replace('_', ' ')
                      .toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reference Needed By
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(opportunity.reference_needed_by)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Follow-up Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(opportunity.follow_up_date)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Desired Advocate Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Desired Advocate Profile</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Industry
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.desired_advocate_industry || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company Size
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.desired_advocate_size || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Region
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.desired_advocate_region || 'N/A'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* CRM Integration */}
          <Card>
            <CardHeader>
              <CardTitle>CRM Integration</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    CRM Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.external_crm_type || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    CRM ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {opportunity.external_crm_id || 'N/A'}
                  </p>
                </div>
              </div>
              {opportunity.external_crm_url && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    CRM URL
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <a
                      href={opportunity.external_crm_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View in CRM
                    </a>
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-6">
        {/* Use Case and Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Use Case & Requirements</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Use Case
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {opportunity.use_case || 'N/A'}
              </p>
            </div>

            {opportunity.product_interest &&
              opportunity.product_interest.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Product Interest
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.product_interest.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {opportunity.technical_requirements &&
              opportunity.technical_requirements.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Technical Requirements
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.technical_requirements.map(
                      (requirement, index) => (
                        <Badge key={index} variant="outline">
                          {requirement}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

            {opportunity.business_challenges &&
              opportunity.business_challenges.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Business Challenges
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.business_challenges.map((challenge, index) => (
                      <Badge key={index} variant="destructive">
                        {challenge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardBody>
        </Card>

        {/* Desired Use Cases and Expertise */}
        <Card>
          <CardHeader>
            <CardTitle>Desired Advocate Expertise</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {opportunity.desired_use_cases &&
              opportunity.desired_use_cases.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Desired Use Cases
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.desired_use_cases.map((useCase, index) => (
                      <Badge key={index} variant="secondary">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {opportunity.desired_expertise_areas &&
              opportunity.desired_expertise_areas.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Desired Expertise Areas
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.desired_expertise_areas.map(
                      (expertise, index) => (
                        <Badge key={index} variant="outline">
                          {expertise}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
          </CardBody>
        </Card>

        {/* Decision Criteria and Stakeholders */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Process</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {opportunity.decision_criteria &&
              opportunity.decision_criteria.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Decision Criteria
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.decision_criteria.map((criteria, index) => (
                      <Badge key={index} variant="default">
                        {criteria}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {opportunity.key_stakeholders &&
              opportunity.key_stakeholders.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Key Stakeholders
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.key_stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="secondary">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardBody>
        </Card>

        {/* Notes and Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Additional Information</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {opportunity.internal_notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Internal Notes
                </label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {opportunity.internal_notes}
                </p>
              </div>
            )}

            {opportunity.sales_notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Sales Notes
                </label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {opportunity.sales_notes}
                </p>
              </div>
            )}

            {opportunity.competitive_situation && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Competitive Situation
                </label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {opportunity.competitive_situation}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDateTime(opportunity.created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDateTime(opportunity.updated_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created Date
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(opportunity.created_date)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Activity
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(opportunity.last_activity_date)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
