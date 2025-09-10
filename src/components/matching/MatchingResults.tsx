/**
 * Matching Results Component
 *
 * Displays the results of advocate-opportunity matching with detailed
 * scoring information and match reasons.
 */

'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/types/database';
import { MatchResult } from '@/lib/services/matchingService';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Button,
  Modal,
  Separator,
  Alert,
} from '@/components/ui';
import {
  StarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  TrendingUpIcon,
  TagIcon,
} from '@/components/ui/icons';

interface MatchingResultsProps {
  matches: MatchResult[];
  opportunity: Opportunity | null;
  className?: string;
}

export const MatchingResults: React.FC<MatchingResultsProps> = ({
  matches,
  opportunity,
  className = '',
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get confidence icon
  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'medium':
        return (
          <ExclamationTriangleIcon size={16} className="text-yellow-500" />
        );
      case 'low':
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  // Get confidence badge variant
  const getConfidenceBadgeVariant = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  // Handle view details
  const handleViewDetails = (match: MatchResult) => {
    setSelectedMatch(match);
    setShowDetailsModal(true);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (matches.length === 0) {
    return (
      <Card className={className}>
        <CardBody className="text-center py-12">
          <StarIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No matches found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your matching criteria or check back later
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <StarIcon size={20} className="mr-2" />
            Matching Results
            {opportunity && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                for {opportunity.opportunity_name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {matches.map((match, index) => (
              <div
                key={match.advocate.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <UserIcon size={20} className="text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {match.advocate.name}
                        </h3>
                      </div>
                      <Badge
                        variant={getConfidenceBadgeVariant(match.confidence)}
                      >
                        {getConfidenceIcon(match.confidence)}
                        <span className="ml-1">
                          {match.confidence.toUpperCase()} CONFIDENCE
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <BuildingOfficeIcon
                          size={16}
                          className="text-gray-400"
                        />
                        <span className="text-sm text-gray-600">
                          {match.advocate.company_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {match.advocate.geographic_region}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUpIcon size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {match.advocate.availability_score || 0}% Available
                        </span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {match.reasons
                          .slice(0, 3)
                          .map((reason, reasonIndex) => (
                            <Badge
                              key={reasonIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {reason}
                            </Badge>
                          ))}
                        {match.reasons.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.reasons.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {match.advocate.email && (
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon size={14} />
                          <span>{match.advocate.email}</span>
                        </div>
                      )}
                      {match.advocate.title && (
                        <div className="flex items-center space-x-1">
                          <TagIcon size={14} />
                          <span>{match.advocate.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {/* Score */}
                    <div
                      className={`px-3 py-1 rounded-full ${getScoreBgColor(match.score)}`}
                    >
                      <div
                        className={`text-2xl font-bold ${getScoreColor(match.score)}`}
                      >
                        {match.score}%
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(match)}
                      leftIcon={<EyeIcon size={16} />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Match Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Match Details"
        size="xl"
      >
        {selectedMatch && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedMatch.advocate.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedMatch.advocate.company_name}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${getScoreColor(selectedMatch.score)}`}
                >
                  {selectedMatch.score}%
                </div>
                <Badge
                  variant={getConfidenceBadgeVariant(selectedMatch.confidence)}
                >
                  {getConfidenceIcon(selectedMatch.confidence)}
                  <span className="ml-1">
                    {selectedMatch.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Advocate Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Advocate Profile
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Company:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.company_name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Industry:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.industry || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Company Size:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.company_size || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Region:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.geographic_region}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Title:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.title || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.email}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Availability & Performance
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">
                      Availability Score:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.availability_score || 0}%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Total Calls:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.total_calls_completed || 0}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Average Rating:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.average_rating || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Status:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedMatch.advocate.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Last Call:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {formatDate(selectedMatch.advocate.last_call_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases and Expertise */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Use Cases & Expertise
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMatch.advocate.use_cases &&
                  selectedMatch.advocate.use_cases.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Use Cases
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedMatch.advocate.use_cases.map(
                          (useCase, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {useCase}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {selectedMatch.advocate.expertise_areas &&
                  selectedMatch.advocate.expertise_areas.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">
                        Expertise Areas
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedMatch.advocate.expertise_areas.map(
                          (expertise, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {expertise}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Match Reasons */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Why This Match?
              </h4>
              <div className="space-y-2">
                {selectedMatch.reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button>Contact Advocate</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
