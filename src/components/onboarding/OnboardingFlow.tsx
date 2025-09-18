/**
 * Enhanced Onboarding Flow Component
 * 
 * Comprehensive onboarding flow with step management, progress tracking,
 * and data persistence across steps.
 */

'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// Import step components
import { WelcomeStep } from './steps/WelcomeStep';
import { CompanySetupStep } from './steps/CompanySetupStep';
import { AdminAccountStep } from './steps/AdminAccountStep';
import { TeamInvitationStep } from './steps/TeamInvitationStep';
import { InitialConfigStep } from './steps/InitialConfigStep';
import { AdvocateSetupStep } from './steps/AdvocateSetupStep';
import { CRMIntegrationStep } from './steps/CRMIntegrationStep';
import { SuccessMetricsStep } from './steps/SuccessMetricsStep';
import { WelcomeTourStep } from './steps/WelcomeTourStep';
import { CompletionStep } from './steps/CompletionStep';

// Types
export interface OnboardingData {
  company?: {
    name: string;
    domain: string;
    industry?: string;
    company_size?: string;
    timezone: string;
    currency: string;
  };
  company_id?: string;
  admin_user?: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  invitations?: Array<{
    email: string;
    role: string;
    personal_message?: string;
  }>;
  configuration?: {
    theme: string;
    notifications: any;
    integrations: any;
  };
  advocates?: any[];
  crm_integration?: {
    provider: string;
    connected: boolean;
    settings: any;
  };
  welcome_tour?: {
    features_toured: string[];
    completed_at: string;
    duration: number;
  };
  success_metrics?: {
    goals: any[];
    reporting_preferences: any;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  completed: boolean;
  optional?: boolean;
}

// Context for sharing data between steps
interface OnboardingContextType {
  data: OnboardingData;
  updateData: (stepData: Partial<OnboardingData>) => void;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  companyId: string | null;
  setCompanyId: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

// Step definitions
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PeerChamps',
    description: 'Let\'s get you started with your customer reference platform',
    component: WelcomeStep,
    completed: false,
  },
  {
    id: 'company_setup',
    title: 'Company Setup',
    description: 'Tell us about your company',
    component: CompanySetupStep,
    completed: false,
  },
  {
    id: 'admin_account',
    title: 'Admin Account',
    description: 'Create your admin account',
    component: AdminAccountStep,
    completed: false,
  },
  {
    id: 'team_invitations',
    title: 'Team Invitations',
    description: 'Invite your team members',
    component: TeamInvitationStep,
    completed: false,
    optional: true,
  },
  {
    id: 'initial_config',
    title: 'Initial Configuration',
    description: 'Configure your preferences',
    component: InitialConfigStep,
    completed: false,
  },
  {
    id: 'advocate_setup',
    title: 'Advocate Setup',
    description: 'Add your customer advocates',
    component: AdvocateSetupStep,
    completed: false,
    optional: true,
  },
  {
    id: 'crm_integration',
    title: 'CRM Integration',
    description: 'Connect your CRM (optional)',
    component: CRMIntegrationStep,
    completed: false,
    optional: true,
  },
  {
    id: 'success_metrics',
    title: 'Success Metrics',
    description: 'Set up your success tracking',
    component: SuccessMetricsStep,
    completed: false,
  },
  {
    id: 'welcome_tour',
    title: 'Welcome Tour',
    description: 'Learn about PeerChamps features',
    component: WelcomeTourStep,
    completed: false,
  },
  {
    id: 'completion',
    title: 'Setup Complete',
    description: 'You\'re ready to start using PeerChamps',
    component: CompletionStep,
    completed: false,
  },
];

interface OnboardingFlowProps {
  className?: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ className = '' }) => {
  const router = useRouter();
  
  // State management
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState('welcome');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Update data function
  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  // Get current step index
  const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.id === currentStep);
  const currentStepData = ONBOARDING_STEPS[currentStepIndex];

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = ONBOARDING_STEPS[currentStepIndex - 1];
      setCurrentStep(prevStep.id);
    }
  };

  const goToStep = (stepId: string) => {
    const stepIndex = ONBOARDING_STEPS.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepId);
    }
  };

  // Mark step as completed
  const markStepCompleted = async (stepId: string, stepData?: any) => {
    if (stepData) {
      updateData({ [stepId]: stepData });
    }
    
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    // Update progress in database if company exists
    if (companyId) {
      try {
        const response = await fetch('/api/onboarding/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyId,
            step_name: stepId,
            completed: true,
            step_data: stepData,
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to update progress');
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  // Calculate progress
  const progressPercentage = Math.round((completedSteps.size / ONBOARDING_STEPS.length) * 100);

  // Context value
  const contextValue: OnboardingContextType = {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    companyId,
    setCompanyId,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  // Render current step component
  const renderCurrentStep = () => {
    if (!currentStepData) return null;
    
    const StepComponent = currentStepData.component;
    return (
      <StepComponent
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
        onComplete={(stepData: any) => markStepCompleted(currentStep, stepData)}
        onSkip={goToNextStep}
        data={data[currentStep as keyof OnboardingData]}
        isOptional={currentStepData.optional}
      />
    );
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      <div className={cn('max-w-4xl mx-auto', className)}>
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStepData?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStepData?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {progressPercentage}% Complete
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon size={16} />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {ONBOARDING_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : completedSteps.has(step.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  )}
                  title={step.title}
                >
                  {completedSteps.has(step.id) ? (
                    <CheckIcon size={16} />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={goToNextStep}
              disabled={currentStepIndex === ONBOARDING_STEPS.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRightIcon size={16} />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center gap-3">
              <Spinner size="sm" />
              <span className="text-gray-900 dark:text-white">Processing...</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardBody className="p-8">
            {renderCurrentStep()}
          </CardBody>
        </Card>
      </div>
    </OnboardingContext.Provider>
  );
};
