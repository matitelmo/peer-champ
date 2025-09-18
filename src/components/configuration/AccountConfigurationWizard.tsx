/**
 * Account Configuration Wizard Component
 * 
 * Multi-step wizard for completing account setup, including profile completion,
 * notification preferences, and team member invitation.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon,
  UserIcon,
  BellIcon,
  UsersIcon,
} from '@/components/ui/icons';
import { ProfileCompletionStep } from './steps/ProfileCompletionStep';
import { NotificationSetupStep } from './steps/NotificationSetupStep';
import { TeamInvitationStep } from './steps/TeamInvitationStep';
import { usePostSignupStore } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface AccountConfigurationWizardProps {
  className?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  icon: React.ReactNode;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'profile_completion',
    title: 'Complete Your Profile',
    description: 'Add your photo, bio, and contact information',
    component: ProfileCompletionStep,
    icon: <UserIcon size={20} />,
  },
  {
    id: 'notification_setup',
    title: 'Configure Notifications',
    description: 'Set up email and in-app notification preferences',
    component: NotificationSetupStep,
    icon: <BellIcon size={20} />,
  },
  {
    id: 'team_setup',
    title: 'Invite Your Team',
    description: 'Add sales team members and set up roles',
    component: TeamInvitationStep,
    icon: <UsersIcon size={20} />,
  },
];

export const AccountConfigurationWizard: React.FC<AccountConfigurationWizardProps> = ({
  className = '',
  onComplete,
  onCancel,
}) => {
  const router = useRouter();
  const { markStepCompleted } = usePostSignupStore();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = wizardSteps[currentStepIndex];
  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = async (stepData?: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Mark current step as completed
      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.add(currentStep.id);
      setCompletedSteps(newCompletedSteps);

      // Update the store
      markStepCompleted(currentStep.id);

      // Move to next step or complete wizard
      if (isLastStep) {
        // Complete the wizard
        await handleComplete();
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // Mark all steps as completed
      wizardSteps.forEach(step => {
        markStepCompleted(step.id);
      });

      // Call completion callback
      onComplete?.();
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    router.push('/dashboard');
  };

  const handleSkip = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / wizardSteps.length) * 100);

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Account Configuration
            </h1>
            <p className="text-gray-600">
              Complete your account setup to get the most out of PeerChamps
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-amaranth-500 to-sundown-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {wizardSteps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-2 text-sm',
                index <= currentStepIndex ? 'text-amaranth-600' : 'text-gray-400'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                index < currentStepIndex && 'bg-green-100 text-green-600',
                index === currentStepIndex && 'bg-amaranth-100 text-amaranth-600',
                index > currentStepIndex && 'bg-gray-100 text-gray-400'
              )}>
                {index < currentStepIndex ? (
                  <CheckIcon size={16} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className="hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center text-white">
              {currentStep.icon}
            </div>
            <div>
              <CardTitle className="text-xl">
                {currentStep.title}
              </CardTitle>
              <p className="text-gray-600">
                {currentStep.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {React.createElement(currentStep.component, {
            onNext: handleNext,
            onPrevious: handlePrevious,
            onSkip: handleSkip,
            onComplete: handleComplete,
            isLoading,
            isFirstStep,
            isLastStep,
          })}
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isLoading}
          leftIcon={<ArrowLeftIcon size={16} />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isLoading}
          >
            {isLastStep ? 'Complete Later' : 'Skip Step'}
          </Button>
          
          <Button
            variant="primary"
            onClick={() => handleNext()}
            disabled={isLoading}
            rightIcon={isLastStep ? <CheckIcon size={16} /> : <ArrowRightIcon size={16} />}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {isLastStep ? 'Completing...' : 'Processing...'}
              </>
            ) : (
              isLastStep ? 'Complete Setup' : 'Next Step'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
