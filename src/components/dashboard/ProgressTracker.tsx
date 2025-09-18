/**
 * Progress Tracker Component
 * 
 * Shows configuration completion status with expandable details
 * and quick actions for each step.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  TargetIcon,
} from '@/components/ui/icons';
import { usePostSignupStore, getConfigurationProgress, getCompletedSteps, getIncompleteSteps } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  className?: string;
  onStepClick?: (stepId: string) => void;
  compact?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  className = '',
  onStepClick,
  compact = false,
}) => {
  const { 
    showProgressTracker, 
    toggleProgressTracker,
    configurationSteps 
  } = usePostSignupStore();
  
  const [expanded, setExpanded] = useState(!compact);
  const [showAll, setShowAll] = useState(false);

  const progress = getConfigurationProgress(usePostSignupStore.getState());
  const completedSteps = getCompletedSteps(usePostSignupStore.getState());
  const incompleteSteps = getIncompleteSteps(usePostSignupStore.getState());

  // Don't render if tracker is hidden
  if (!showProgressTracker) {
    return null;
  }

  const getStepIcon = (stepId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      profile_completion: <UserIcon size={16} />,
      team_setup: <UsersIcon size={16} />,
      data_import: <ChartBarIcon size={16} />,
      crm_integration: <ChartBarIcon size={16} />,
      calendar_integration: <CalendarIcon size={16} />,
      notification_setup: <BellIcon size={16} />,
      success_metrics: <TargetIcon size={16} />,
      first_advocate: <UsersIcon size={16} />,
      first_opportunity: <ChartBarIcon size={16} />,
      first_reference_call: <CalendarIcon size={16} />,
    };
    return iconMap[stepId] || <ArrowRightIcon size={16} />;
  };

  const getStepStatus = (step: any) => {
    if (step.completed) {
      return {
        icon: <CheckCircleIcon size={16} className="text-green-600" />,
        text: 'Completed',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    } else if (step.optional) {
      return {
        icon: <ClockIcon size={16} className="text-gray-400" />,
        text: 'Optional',
        textColor: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
    } else {
      return {
        icon: <ClockIcon size={16} className="text-amber-500" />,
        text: 'Required',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    }
  };

  const displaySteps = showAll ? configurationSteps : [...completedSteps, ...incompleteSteps.slice(0, 3)];

  return (
    <Card className={cn('progress-tracker', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Configuration Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {progress.completed}/{progress.total}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {progress.percentage}% Complete
            </span>
            <span className="text-sm text-gray-600">
              {incompleteSteps.length} remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amaranth-500 to-sundown-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardBody className="pt-0">
          <div className="space-y-3">
            {displaySteps.map((step) => {
              const status = getStepStatus(step);
              const stepIcon = getStepIcon(step.id);
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
                    status.bgColor,
                    status.borderColor,
                    'hover:shadow-sm'
                  )}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div className="flex-shrink-0">
                    {status.icon}
                  </div>
                  
                  <div className="flex-shrink-0">
                    {stepIcon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {step.title}
                      </h4>
                      {step.optional && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <span className={cn('text-xs font-medium', status.textColor)}>
                      {status.text}
                    </span>
                  </div>
                  
                  {!step.completed && (
                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepClick?.(step.id);
                        }}
                        rightIcon={<ArrowRightIcon size={14} />}
                      >
                        {step.completed ? 'View' : 'Start'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            
            {!showAll && incompleteSteps.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(true)}
                  rightIcon={<ChevronDownIcon size={16} />}
                >
                  Show {incompleteSteps.length - 3} more steps
                </Button>
              </div>
            )}
            
            {showAll && incompleteSteps.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(false)}
                  rightIcon={<ChevronUpIcon size={16} />}
                >
                  Show less
                </Button>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          {incompleteSteps.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStepClick?.(incompleteSteps[0]?.id)}
                  rightIcon={<ArrowRightIcon size={16} />}
                  className="flex-1"
                >
                  Continue Setup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="flex-1"
                >
                  {showAll ? 'Show Summary' : 'View All Steps'}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};
