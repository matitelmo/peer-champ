/**
 * Matching Insights Component
 *
 * Provides detailed insights and analytics about matching results,
 * including confidence distribution, top reasons, and performance metrics.
 */

'use client';

import React from 'react';
import { MatchResult, MatchingStats } from '@/lib/services/matchingService';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Separator,
} from '@/components/ui';
import {
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TagIcon,
} from '@/components/ui/icons';

interface MatchingInsightsProps {
  matches: MatchResult[];
  stats: MatchingStats | null;
  insights: {
    highConfidenceCount: number;
    mediumConfidenceCount: number;
    lowConfidenceCount: number;
    averageScore: number;
    topReasons: string[];
  };
  className?: string;
}

export const MatchingInsights: React.FC<MatchingInsightsProps> = ({
  matches,
  stats,
  insights,
  className = '',
}) => {
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

  // Calculate score distribution
  const scoreDistribution = {
    excellent: matches.filter((m) => m.score >= 80).length,
    good: matches.filter((m) => m.score >= 60 && m.score < 80).length,
    fair: matches.filter((m) => m.score >= 40 && m.score < 60).length,
    poor: matches.filter((m) => m.score < 40).length,
  };

  // Get top advocates by score
  const topAdvocates = matches.sort((a, b) => b.score - a.score).slice(0, 5);

  // Calculate industry distribution
  const industryDistribution = matches.reduce(
    (acc, match) => {
      const industry = match.advocate.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate region distribution
  const regionDistribution = matches.reduce(
    (acc, match) => {
      const region = match.advocate.geographic_region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {matches.length}
            </div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {insights.averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {insights.highConfidenceCount}
            </div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats?.topScore || 0}%
            </div>
            <div className="text-sm text-gray-600">Top Score</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBarIcon size={20} className="mr-2" />
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getConfidenceIcon('high')}
                  <span className="text-sm font-medium">High Confidence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {insights.highConfidenceCount} matches
                  </span>
                  <Badge variant={getConfidenceBadgeVariant('high')}>
                    {matches.length > 0
                      ? Math.round(
                          (insights.highConfidenceCount / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (insights.highConfidenceCount / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getConfidenceIcon('medium')}
                  <span className="text-sm font-medium">Medium Confidence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {insights.mediumConfidenceCount} matches
                  </span>
                  <Badge variant={getConfidenceBadgeVariant('medium')}>
                    {matches.length > 0
                      ? Math.round(
                          (insights.mediumConfidenceCount / matches.length) *
                            100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (insights.mediumConfidenceCount / matches.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getConfidenceIcon('low')}
                  <span className="text-sm font-medium">Low Confidence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {insights.lowConfidenceCount} matches
                  </span>
                  <Badge variant={getConfidenceBadgeVariant('low')}>
                    {matches.length > 0
                      ? Math.round(
                          (insights.lowConfidenceCount / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (insights.lowConfidenceCount / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUpIcon size={20} className="mr-2" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Excellent (80-100%)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {scoreDistribution.excellent}
                  </span>
                  <Badge variant="success">
                    {matches.length > 0
                      ? Math.round(
                          (scoreDistribution.excellent / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (scoreDistribution.excellent / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-600">
                  Good (60-79%)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {scoreDistribution.good}
                  </span>
                  <Badge variant="warning">
                    {matches.length > 0
                      ? Math.round(
                          (scoreDistribution.good / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (scoreDistribution.good / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-600">
                  Fair (40-59%)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {scoreDistribution.fair}
                  </span>
                  <Badge variant="default">
                    {matches.length > 0
                      ? Math.round(
                          (scoreDistribution.fair / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (scoreDistribution.fair / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">
                  Poor (0-39%)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {scoreDistribution.poor}
                  </span>
                  <Badge variant="destructive">
                    {matches.length > 0
                      ? Math.round(
                          (scoreDistribution.poor / matches.length) * 100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${
                      matches.length > 0
                        ? (scoreDistribution.poor / matches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Reasons and Top Advocates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Match Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TagIcon size={20} className="mr-2" />
              Top Match Reasons
            </CardTitle>
          </CardHeader>
          <CardBody>
            {insights.topReasons.length > 0 ? (
              <div className="space-y-3">
                {insights.topReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {reason}
                    </span>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No match reasons available
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top Advocates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <StarIcon size={20} className="mr-2" />
              Top Performing Advocates
            </CardTitle>
          </CardHeader>
          <CardBody>
            {topAdvocates.length > 0 ? (
              <div className="space-y-3">
                {topAdvocates.map((match, index) => (
                  <div
                    key={match.advocate.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {match.advocate.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {match.advocate.company_name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {match.score}%
                      </div>
                      <Badge
                        variant={getConfidenceBadgeVariant(match.confidence)}
                        className="text-xs"
                      >
                        {match.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No advocates available
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Industry and Region Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon size={20} className="mr-2" />
              Industry Distribution
            </CardTitle>
          </CardHeader>
          <CardBody>
            {Object.keys(industryDistribution).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(industryDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => (
                    <div
                      key={industry}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {industry}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <Badge variant="outline">
                          {matches.length > 0
                            ? Math.round((count / matches.length) * 100)
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No industry data available
              </div>
            )}
          </CardBody>
        </Card>

        {/* Region Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon size={20} className="mr-2" />
              Region Distribution
            </CardTitle>
          </CardHeader>
          <CardBody>
            {Object.keys(regionDistribution).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(regionDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([region, count]) => (
                    <div
                      key={region}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {region}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <Badge variant="outline">
                          {matches.length > 0
                            ? Math.round((count / matches.length) * 100)
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No region data available
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Matching Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Matching Statistics</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalAdvocates}
                </div>
                <div className="text-sm text-gray-600">Total Advocates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.eligibleAdvocates}
                </div>
                <div className="text-sm text-gray-600">Eligible Advocates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.matchesFound}
                </div>
                <div className="text-sm text-gray-600">Matches Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
