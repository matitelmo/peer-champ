/**
 * Matching Interface Component
 *
 * Provides a comprehensive interface for matching advocates to opportunities.
 * Includes filtering, scoring, and recommendation features.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Opportunity, Advocate } from '@/types/database';
import { MatchResult } from '@/lib/services/matchingService';
import { useMatching } from '@/hooks/useMatching';
import { useAdvocates } from '@/hooks/useAdvocates';
import { useOpportunities } from '@/hooks/useOpportunities';
import {
  Button,
  Select,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  Spinner,
  Badge,
  Modal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from '@/components/ui';
import {
  SearchIcon,
  FilterIcon,
  StarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@/components/ui/icons';
import { MatchingResults } from './MatchingResults';
import { MatchingInsights } from './MatchingInsights';

interface MatchingInterfaceProps {
  className?: string;
}

const CONFIDENCE_OPTIONS = [
  { value: '', label: 'All Confidence Levels' },
  { value: 'high', label: 'High Confidence' },
  { value: 'medium', label: 'Medium Confidence' },
  { value: 'low', label: 'Low Confidence' },
];

const SCORE_RANGE_OPTIONS = [
  { value: '', label: 'All Scores' },
  { value: '80-100', label: '80-100 (Excellent)' },
  { value: '60-79', label: '60-79 (Good)' },
  { value: '40-59', label: '40-59 (Fair)' },
  { value: '30-39', label: '30-39 (Poor)' },
];

export const MatchingInterface: React.FC<MatchingInterfaceProps> = ({
  className = '',
}) => {
  const { advocates, loading: advocatesLoading } = useAdvocates();
  const { opportunities, loading: opportunitiesLoading } = useOpportunities();

  const {
    matches,
    stats,
    loading: matchingLoading,
    error: matchingError,
    findMatches,
    getInsights,
    filterMatchesByConfidence,
    filterMatchesByScore,
    clearMatches,
  } = useMatching({ advocates, opportunities });

  // State for filters and selection
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState('');
  const [scoreRangeFilter, setScoreRangeFilter] = useState('');
  const [minScore, setMinScore] = useState(30);
  const [maxResults, setMaxResults] = useState(10);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Filtered matches based on current filters
  const filteredMatches = React.useMemo(() => {
    let filtered = matches;

    // Filter by confidence
    if (confidenceFilter) {
      filtered = filterMatchesByConfidence(
        confidenceFilter as 'low' | 'medium' | 'high'
      );
    }

    // Filter by score range
    if (scoreRangeFilter) {
      const [min, max] = scoreRangeFilter.split('-').map(Number);
      filtered = filtered.filter(
        (match) => match.score >= min && match.score <= max
      );
    }

    return filtered;
  }, [matches, confidenceFilter, scoreRangeFilter, filterMatchesByConfidence]);

  // Handle opportunity selection and matching
  const handleFindMatches = async () => {
    if (!selectedOpportunity) {
      return;
    }

    await findMatches(selectedOpportunity, {
      maxResults,
      minScore,
      includeInactive,
    });
  };

  // Get insights for current matches
  const insights = getInsights();

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

  if (advocatesLoading || opportunitiesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advocate Matching
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find the best advocates for your opportunities
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowInsights(true)}
            leftIcon={<ChartBarIcon size={16} />}
          >
            View Insights
          </Button>
          <Button
            variant="outline"
            onClick={clearMatches}
            disabled={matches.length === 0}
          >
            Clear Results
          </Button>
        </div>
      </div>

      {/* Matching Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SearchIcon size={20} className="mr-2" />
            Find Matches
          </CardTitle>
          <CardDescription>
            Select an opportunity and configure matching criteria
          </CardDescription>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Select
                label="Select Opportunity"
                value={selectedOpportunity?.id || ''}
                onChange={(value) => {
                  const opportunity = opportunities.find(
                    (opp) => opp.id === value
                  );
                  setSelectedOpportunity(opportunity || null);
                }}
                options={[
                  { value: '', label: 'Choose an opportunity...' },
                  ...opportunities.map((opp) => ({
                    value: opp.id,
                    label: `${opp.opportunity_name} (${opp.prospect_company})`,
                  })),
                ]}
                placeholder="Select opportunity"
              />
            </div>

            <div>
              <Input
                label="Max Results"
                type="number"
                min="1"
                max="50"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
              />
            </div>

            <div>
              <Input
                label="Minimum Score"
                type="number"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleFindMatches}
                disabled={!selectedOpportunity || matchingLoading}
                loading={matchingLoading}
                className="w-full"
              >
                Find Matches
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include inactive advocates
              </span>
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Error Display */}
      {matchingError && <Alert variant="destructive">{matchingError}</Alert>}

      {/* Results Summary */}
      {stats && (
        <Card>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.matchesFound}
                </div>
                <div className="text-sm text-gray-600">Matches Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.topScore}%
                </div>
                <div className="text-sm text-gray-600">Top Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.eligibleAdvocates}
                </div>
                <div className="text-sm text-gray-600">Eligible Advocates</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Filters */}
      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilterIcon size={20} className="mr-2" />
              Filter Results
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Confidence Level"
                value={confidenceFilter}
                onChange={setConfidenceFilter}
                options={CONFIDENCE_OPTIONS}
              />
              <Select
                label="Score Range"
                value={scoreRangeFilter}
                onChange={setScoreRangeFilter}
                options={SCORE_RANGE_OPTIONS}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredMatches.length} of {matches.length} matches
            </div>
          </CardBody>
        </Card>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <MatchingResults
          matches={filteredMatches}
          opportunity={selectedOpportunity}
        />
      )}

      {/* Empty State */}
      {matches.length === 0 && !matchingLoading && (
        <Card>
          <CardBody className="text-center py-12">
            <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No matches found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select an opportunity and click "Find Matches" to get started
            </p>
            {selectedOpportunity && (
              <Button onClick={handleFindMatches} disabled={matchingLoading}>
                Find Matches
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Insights Modal */}
      <Modal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        title="Matching Insights"
        size="xl"
      >
        <MatchingInsights matches={matches} stats={stats} insights={insights} />
      </Modal>
    </div>
  );
};
