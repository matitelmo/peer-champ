/**
 * Opportunity Pipeline Component
 * 
 * Visual pipeline management system with Kanban-style board view,
 * drag-and-drop functionality, and pipeline analytics.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/types/database';
import { Button, Card, CardHeader, CardTitle, CardBody, Badge, Select, Input, Alert } from '@/components/ui';
import { 
  ChartBarIcon, 
  FunnelIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  opportunities: Opportunity[];
  totalValue: number;
  count: number;
}

interface OpportunityPipelineProps {
  onOpportunityClick?: (opportunity: Opportunity) => void;
  onOpportunityEdit?: (opportunity: Opportunity) => void;
  className?: string;
}

const DEFAULT_STAGES = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100 text-gray-800' },
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Opportunities' },
  { value: 'my', label: 'My Opportunities' },
  { value: 'high-value', label: 'High Value (>$50K)' },
  { value: 'recent', label: 'Recent (Last 30 days)' },
  { value: 'stale', label: 'Stale (>90 days)' },
];

// Sortable Opportunity Item Component
interface SortableOpportunityItemProps {
  opportunity: Opportunity;
  onOpportunityClick?: (opportunity: Opportunity) => void;
  onOpportunityEdit?: (opportunity: Opportunity) => void;
}

const SortableOpportunityItem: React.FC<SortableOpportunityItemProps> = ({
  opportunity,
  onOpportunityClick,
  onOpportunityEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysSinceUpdate = (updatedAt: string) => {
    const days = Math.floor((new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getAgeColor = (days: number) => {
    if (days > 90) return 'text-red-600';
    if (days > 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow',
        isDragging && 'shadow-lg rotate-2 opacity-50'
      )}
      onClick={() => onOpportunityClick?.(opportunity)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900 text-sm">
            {opportunity.prospect_company}
          </h4>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpportunityEdit?.(opportunity);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <PencilIcon size={14} />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {opportunity.opportunity_name}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <CurrencyDollarIcon size={12} />
            <span className="font-medium">
              {formatCurrency(opportunity.deal_value || 0)}
            </span>
          </div>
          <div className={cn(
            'flex items-center space-x-1',
            getAgeColor(getDaysSinceUpdate(opportunity.updated_at || opportunity.created_at))
          )}>
            <CalendarIcon size={12} />
            <span>
              {getDaysSinceUpdate(opportunity.updated_at || opportunity.created_at)}d
            </span>
          </div>
        </div>
        
        {opportunity.prospect_contact_name && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <UserIcon size={12} />
            <span>{opportunity.prospect_contact_name}</span>
          </div>
        )}
        
        {opportunity.prospect_industry && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <BuildingOfficeIcon size={12} />
            <span>{opportunity.prospect_industry}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const OpportunityPipeline: React.FC<OpportunityPipelineProps> = ({
  onOpportunityClick,
  onOpportunityEdit,
  className = '',
}) => {
  const { opportunities, updateOpportunityData, loading, error } = useOpportunities();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Initialize stages with opportunities
  useEffect(() => {
    initializeStages();
  }, [opportunities, filter, searchTerm]);

  const initializeStages = () => {
    const filteredOpportunities = filterOpportunities(opportunities);
    
    const newStages = DEFAULT_STAGES.map(stage => {
      const stageOpportunities = filteredOpportunities.filter(opp => 
        opp.deal_stage?.toLowerCase().replace(/\s+/g, '-') === stage.id
      );
      
      const totalValue = stageOpportunities.reduce((sum, opp) => 
        sum + (opp.deal_value || 0), 0
      );

      return {
        ...stage,
        opportunities: stageOpportunities,
        totalValue,
        count: stageOpportunities.length,
      };
    });

    setStages(newStages);
  };

  const filterOpportunities = (opps: Opportunity[]) => {
    let filtered = opps;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(opp =>
        opp.prospect_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.opportunity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.prospect_contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    switch (filter) {
      case 'my':
        // TODO: Filter by current user when user context is available
        break;
      case 'high-value':
        filtered = filtered.filter(opp => (opp.deal_value || 0) > 50000);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(opp => 
          opp.created_at && new Date(opp.created_at) > thirtyDaysAgo
        );
        break;
      case 'stale':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        filtered = filtered.filter(opp => 
          opp.updated_at && new Date(opp.updated_at) < ninetyDaysAgo
        );
        break;
    }

    return filtered;
  };

  // Map stage names to database values
  const mapStageToDbValue = (stageName: string) => {
    const mapping: Record<string, string> = {
      'prospecting': 'qualification',
      'qualification': 'qualification', 
      'proposal': 'proposal',
      'negotiation': 'negotiation',
      'closed-won': 'closed_won',
      'closed-lost': 'closed_lost',
    };
    return mapping[stageName.toLowerCase()] || 'qualification';
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source stage (where the item was dragged from)
    const sourceStage = stages.find(stage => 
      stage.opportunities.some(opp => opp.id === activeId)
    );
    
    // Find the destination stage (where the item was dropped)
    const destStage = stages.find(stage => stage.id === overId);
    
    if (!sourceStage || !destStage || sourceStage.id === destStage.id) return;

    const opportunity = sourceStage.opportunities.find(opp => opp.id === activeId);
    if (!opportunity) return;

    // Update opportunity stage
    try {
      await updateOpportunityData(opportunity.id, {
        deal_stage: mapStageToDbValue(destStage.id) as any,
      });
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate pipeline metrics
  const pipelineMetrics = useMemo(() => {
    const totalValue = stages.reduce((sum, stage) => sum + stage.totalValue, 0);
    const totalCount = stages.reduce((sum, stage) => sum + stage.count, 0);
    const wonValue = stages.find(s => s.id === 'closed-won')?.totalValue || 0;
    const wonCount = stages.find(s => s.id === 'closed-won')?.count || 0;
    const winRate = totalCount > 0 ? (wonCount / totalCount) * 100 : 0;

    return {
      totalValue,
      totalCount,
      wonValue,
      wonCount,
      winRate,
    };
  }, [stages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pipeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading pipeline">
        {error}
      </Alert>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Opportunity Pipeline</h2>
          <p className="text-gray-600">Manage and track your sales opportunities</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            leftIcon={<ChartBarIcon size={16} />}
          >
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </Button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Analytics</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(pipelineMetrics.totalValue)}
                </div>
                <div className="text-sm text-gray-600">Total Pipeline Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {pipelineMetrics.totalCount}
                </div>
                <div className="text-sm text-gray-600">Total Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(pipelineMetrics.wonValue)}
                </div>
                <div className="text-sm text-gray-600">Won Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pipelineMetrics.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FunnelIcon size={16} />}
          />
        </div>
        <Select
          value={filter}
          onChange={setFilter}
          options={FILTER_OPTIONS}
          placeholder="Filter opportunities"
        />
      </div>

      {/* Pipeline Board */}
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={stage.color}>
                        {stage.name}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {stage.count}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(stage.totalValue)}
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <SortableContext 
                    id={stage.id}
                    items={stage.opportunities.map(opp => opp.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="min-h-96 space-y-3">
                      {stage.opportunities.map((opportunity) => (
                        <SortableOpportunityItem
                          key={opportunity.id}
                          opportunity={opportunity}
                          onOpportunityClick={onOpportunityClick}
                          onOpportunityEdit={onOpportunityEdit}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg opacity-90 rotate-2">
              <div className="font-medium text-gray-900 text-sm">
                {stages.find(stage => 
                  stage.opportunities.some(opp => opp.id === activeId)
                )?.opportunities.find(opp => opp.id === activeId)?.prospect_company}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {pipelineMetrics.totalCount === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-gray-500">
              <FunnelIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by creating your first opportunity.'
                }
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default OpportunityPipeline;
