/**
 * Opportunity Pipeline Widget Component
 *
 * Displays the sales pipeline with stages, counts, and values.
 * Shows the flow of opportunities through different deal stages.
 */

'use client';

import React from 'react';
import { OpportunityPipeline } from '@/lib/services/dashboardService';
import { Card, CardHeader, CardBody, CardTitle, Badge } from '@/components/ui';
import {
  ChartBarIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
} from '@/components/ui/icons';

interface OpportunityPipelineWidgetProps {
  pipeline: OpportunityPipeline[];
  totalValue: number;
  className?: string;
}

export const OpportunityPipelineWidget: React.FC<
  OpportunityPipelineWidgetProps
> = ({ pipeline, totalValue, className = '' }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get stage badge variant
  const getStageBadgeVariant = (stage: string) => {
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
        return 'outline';
    }
  };

  // Get stage display name
  const getStageDisplayName = (stage: string) => {
    return stage
      .replace('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Sort pipeline by typical sales flow
  const stageOrder = [
    'discovery',
    'qualification',
    'proposal',
    'negotiation',
    'closed_won',
    'closed_lost',
  ];
  const sortedPipeline = [...pipeline].sort((a, b) => {
    const aIndex = stageOrder.indexOf(a.stage);
    const bIndex = stageOrder.indexOf(b.stage);
    return aIndex - bIndex;
  });

  // Calculate total count and value
  const totalCount = pipeline.reduce((sum, stage) => sum + stage.count, 0);
  const totalPipelineValue = pipeline.reduce(
    (sum, stage) => sum + stage.value,
    0
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartBarIcon size={20} className="mr-2" />
          Opportunity Pipeline
        </CardTitle>
      </CardHeader>
      <CardBody>
        {pipeline.length === 0 ? (
          <div className="text-center py-8">
            <ChartBarIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No opportunities in pipeline
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Opportunities will appear here as they're created
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pipeline Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Opportunities
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPipelineValue)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pipeline Value
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totalCount > 0
                    ? formatCurrency(totalPipelineValue / totalCount)
                    : '$0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average Deal Size
                </div>
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="space-y-4">
              {sortedPipeline.map((stage) => {
                const percentage =
                  totalCount > 0 ? (stage.count / totalCount) * 100 : 0;
                const valuePercentage =
                  totalPipelineValue > 0
                    ? (stage.value / totalPipelineValue) * 100
                    : 0;

                return (
                  <div key={stage.stage} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStageBadgeVariant(stage.stage)}>
                          {getStageDisplayName(stage.stage)}
                        </Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stage.count} opportunities
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(stage.value)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(stage.value / stage.count)} avg
                        </div>
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Count</span>
                          <span>{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Value</span>
                          <span>{Math.round(valuePercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${valuePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Flow Visualization */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pipeline Flow
              </h4>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {sortedPipeline.map((stage, index) => (
                  <React.Fragment key={stage.stage}>
                    <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {stage.count}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {getStageDisplayName(stage.stage).split(' ')[0]}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-center text-gray-600 dark:text-gray-400">
                        {formatCurrency(stage.value)}
                      </div>
                    </div>
                    {index < sortedPipeline.length - 1 && (
                      <div className="flex-shrink-0">
                        <TrendingUpIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
