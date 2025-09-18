/**
 * Quick Actions Component
 * 
 * Contextual call-to-action cards for key setup tasks and features,
 * dynamically shown based on user progress and needs.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { 
  PlusIcon,
  ArrowRightIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  TargetIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CogIcon,
} from '@/components/ui/icons';
import { usePostSignupStore, getIncompleteSteps } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
  onActionClick?: (actionId: string) => void;
  maxActions?: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = '',
  onActionClick,
  maxActions = 3,
}) => {
  const { configurationSteps } = usePostSignupStore();
  const incompleteSteps = getIncompleteSteps(usePostSignupStore.getState());

  const getActionConfig = (stepId: string) => {
    const actionMap: Record<string, {
      icon: React.ReactNode;
      title: string;
      description: string;
      buttonText: string;
      variant: 'primary' | 'secondary' | 'outline';
      priority: number;
    }> = {
      profile_completion: {
        icon: <UserIcon size={20} />,
        title: 'Complete Your Profile',
        description: 'Add your photo, bio, and contact information to personalize your account.',
        buttonText: 'Complete Profile',
        variant: 'primary',
        priority: 1,
      },
      team_setup: {
        icon: <UsersIcon size={20} />,
        title: 'Invite Your Team',
        description: 'Add sales team members and set up roles for better collaboration.',
        buttonText: 'Invite Team',
        variant: 'primary',
        priority: 2,
      },
      first_advocate: {
        icon: <UsersIcon size={20} />,
        title: 'Add Your First Advocate',
        description: 'Onboard a customer advocate to start building your reference network.',
        buttonText: 'Add Advocate',
        variant: 'primary',
        priority: 3,
      },
      first_opportunity: {
        icon: <BuildingOfficeIcon size={20} />,
        title: 'Create Your First Opportunity',
        description: 'Set up your first sales opportunity to track and manage.',
        buttonText: 'Create Opportunity',
        variant: 'primary',
        priority: 4,
      },
      first_reference_call: {
        icon: <PhoneIcon size={20} />,
        title: 'Schedule Your First Reference Call',
        description: 'Connect a prospect with an advocate for a reference call.',
        buttonText: 'Schedule Call',
        variant: 'primary',
        priority: 5,
      },
      crm_integration: {
        icon: <ChartBarIcon size={20} />,
        title: 'Connect Your CRM',
        description: 'Link Salesforce or HubSpot for seamless workflow integration.',
        buttonText: 'Connect CRM',
        variant: 'secondary',
        priority: 6,
      },
      calendar_integration: {
        icon: <CalendarIcon size={20} />,
        title: 'Connect Your Calendar',
        description: 'Link Google Calendar or Outlook for easy scheduling.',
        buttonText: 'Connect Calendar',
        variant: 'secondary',
        priority: 7,
      },
      data_import: {
        icon: <ChartBarIcon size={20} />,
        title: 'Import Your Data',
        description: 'Upload existing advocates and opportunities from CSV files.',
        buttonText: 'Import Data',
        variant: 'secondary',
        priority: 8,
      },
      notification_setup: {
        icon: <BellIcon size={20} />,
        title: 'Configure Notifications',
        description: 'Set up email and in-app notification preferences.',
        buttonText: 'Setup Notifications',
        variant: 'outline',
        priority: 9,
      },
      success_metrics: {
        icon: <TargetIcon size={20} />,
        title: 'Set Success Goals',
        description: 'Define your reference program success metrics and targets.',
        buttonText: 'Set Goals',
        variant: 'outline',
        priority: 10,
      },
    };

    return actionMap[stepId];
  };

  // Get actions for incomplete steps, sorted by priority
  const actions = incompleteSteps
    .map(step => ({
      ...step,
      ...getActionConfig(step.id),
    }))
    .filter(action => action.title) // Filter out steps without config
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxActions);

  // If no incomplete steps, show general actions
  const generalActions = [
    {
      id: 'view_dashboard',
      icon: <ChartBarIcon size={20} />,
      title: 'Explore Dashboard',
      description: 'Take a look at your dashboard and explore the available features.',
      buttonText: 'View Dashboard',
      variant: 'outline' as const,
    },
    {
      id: 'view_help',
      icon: <CogIcon size={20} />,
      title: 'Get Help',
      description: 'Access tutorials, documentation, and support resources.',
      buttonText: 'View Help',
      variant: 'outline' as const,
    },
  ];

  const displayActions = actions.length > 0 ? actions : generalActions.slice(0, maxActions);

  if (displayActions.length === 0) {
    return null;
  }

  return (
    <div className={cn('quick-actions', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Actions
        </h3>
        <p className="text-sm text-gray-600">
          {actions.length > 0 
            ? 'Complete these steps to get the most out of PeerChamps'
            : 'Explore these features to enhance your experience'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayActions.map((action) => (
          <Card
            key={action.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onActionClick?.(action.id)}
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                  action.variant === 'primary' && 'bg-gradient-to-br from-amaranth-500 to-sundown-400 text-white',
                  action.variant === 'secondary' && 'bg-blue-100 text-blue-600',
                  action.variant === 'outline' && 'bg-gray-100 text-gray-600',
                )}>
                  {action.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 group-hover:text-amaranth-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {action.description}
                  </p>
                  
                  <Button
                    size="sm"
                    variant={action.variant}
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick?.(action.id);
                    }}
                    rightIcon={<ArrowRightIcon size={14} />}
                    className="w-full"
                  >
                    {action.buttonText}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {actions.length > maxActions && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onActionClick?.('view_all_steps')}
            rightIcon={<ArrowRightIcon size={16} />}
          >
            View All {actions.length - maxActions} More Steps
          </Button>
        </div>
      )}
    </div>
  );
};
