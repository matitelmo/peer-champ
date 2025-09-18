/**
 * Welcome Banner Component
 * 
 * Personalized welcome banner that appears after signup/onboarding completion,
 * showing setup progress and next steps with contextual actions.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@/components/ui/icons';
import { usePostSignupStore, getConfigurationProgress, getNextIncompleteStep } from '@/lib/stores/postSignupStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
  className?: string;
  onStartConfiguration?: () => void;
  onDismiss?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  className = '',
  onStartConfiguration,
  onDismiss,
}) => {
  const { user } = useAuth();
  const { 
    showWelcomeBanner, 
    toggleWelcomeBanner,
    configurationSteps,
    completedSteps 
  } = usePostSignupStore();

  const progress = getConfigurationProgress(usePostSignupStore.getState());
  const nextStep = getNextIncompleteStep(usePostSignupStore.getState());

  // Don't render if banner is hidden
  if (!showWelcomeBanner) {
    return null;
  }

  const handleDismiss = () => {
    toggleWelcomeBanner();
    onDismiss?.();
  };

  const handleStartConfiguration = () => {
    onStartConfiguration?.();
  };

  const getGreeting = () => {
    const firstName = user?.user_metadata?.first_name || 'there';
    const hour = new Date().getHours();
    
    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 18) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  const getNextStepAction = () => {
    if (!nextStep) return null;

    const actionMap: Record<string, { icon: React.ReactNode; action: string }> = {
      profile_completion: { icon: <UserIcon size={16} />, action: 'Complete Profile' },
      team_setup: { icon: <UsersIcon size={16} />, action: 'Invite Team' },
      data_import: { icon: <ChartBarIcon size={16} />, action: 'Import Data' },
      crm_integration: { icon: <ChartBarIcon size={16} />, action: 'Connect CRM' },
      calendar_integration: { icon: <CalendarIcon size={16} />, action: 'Connect Calendar' },
      notification_setup: { icon: <UserIcon size={16} />, action: 'Setup Notifications' },
      success_metrics: { icon: <ChartBarIcon size={16} />, action: 'Set Goals' },
      first_advocate: { icon: <UsersIcon size={16} />, action: 'Add Advocate' },
      first_opportunity: { icon: <ChartBarIcon size={16} />, action: 'Create Opportunity' },
      first_reference_call: { icon: <CalendarIcon size={16} />, action: 'Schedule Call' },
    };

    return actionMap[nextStep.id] || { icon: <ArrowRightIcon size={16} />, action: 'Continue Setup' };
  };

  const nextStepAction = getNextStepAction();

  return (
    <Card className={cn('welcome-banner bg-gradient-to-r from-amaranth-50 to-sundown-50 border-amaranth-200', className)}>
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Greeting */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center">
                <SparklesIcon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {getGreeting()}
                </h2>
                <p className="text-sm text-gray-600">
                  Welcome to PeerChamps! Let's get you set up for success.
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Setup Progress
                </span>
                <span className="text-sm text-gray-600">
                  {progress.completed} of {progress.total} steps completed
                </span>
              </div>
              
              <Progress 
                value={progress.percentage} 
                className="h-2 mb-3"
              />
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircleIcon size={16} className="text-green-600" />
                <span>
                  {progress.percentage}% complete
                </span>
              </div>
            </div>

            {/* Next Step */}
            {nextStep && nextStepAction && (
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {nextStepAction.icon}
                  <h3 className="font-medium text-gray-900">
                    Next: {nextStep.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {nextStep.description}
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleStartConfiguration}
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  {nextStepAction.action}
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-lg font-semibold text-gray-900">
                  {progress.completed}
                </div>
                <div className="text-xs text-gray-600">
                  Completed
                </div>
              </div>
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-lg font-semibold text-gray-900">
                  {progress.total - progress.completed}
                </div>
                <div className="text-xs text-gray-600">
                  Remaining
                </div>
              </div>
              <div className="bg-white/40 rounded-lg p-3">
                <div className="text-lg font-semibold text-gray-900">
                  {progress.percentage}%
                </div>
                <div className="text-xs text-gray-600">
                  Progress
                </div>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss welcome banner"
          >
            <XMarkIcon size={20} />
          </button>
        </div>
      </CardBody>
    </Card>
  );
};
