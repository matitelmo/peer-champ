/**
 * Guided Tour Component
 * 
 * Simple guided tour component to help users
 * learn about the dashboard and key features.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  PlayIcon, 
  XMarkIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@/components/ui/icons';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PeerChamps!',
    description: 'Let\'s take a quick tour of your dashboard to help you get started.',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your main dashboard where you can see your advocate network overview, recent activity, and quick actions.',
  },
  {
    id: 'advocates',
    title: 'Advocates',
    description: 'Manage your advocate network here. Add new advocates, view their profiles, and track their engagement.',
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    description: 'Track and manage sales opportunities. Create new opportunities, assign advocates, and monitor progress.',
  },
  {
    id: 'meetings',
    title: 'Meetings',
    description: 'Schedule and manage meetings with advocates and prospects. View your calendar and upcoming appointments.',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your account, manage integrations, and customize your experience.',
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  onComplete,
  onSkip,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  }, []);

  const nextStep = useCallback(() => {
    const currentStepData = TOUR_STEPS[currentStep];
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    onComplete?.();
  }, [onComplete]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    onSkip?.();
  }, [onSkip]);

  const currentStepData = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  if (!isActive) {
    return (
      <Button
        variant="secondary"
        onClick={startTour}
        className="flex items-center gap-2"
      >
        <PlayIcon size={16} />
        Take a Tour
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center text-white">
                <LightBulbIcon size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardBody className="pt-0">
          <p className="text-gray-700 mb-6">
            {currentStepData.description}
          </p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amaranth-500 to-sundown-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-amaranth-500'
                    : completedSteps.has(TOUR_STEPS[index].id)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={previousStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon size={16} />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={skipTour}
              >
                Skip Tour
              </Button>
              <Button
                variant="primary"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <CheckCircleIcon size={16} />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
