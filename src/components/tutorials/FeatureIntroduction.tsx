/**
 * Feature Introduction Component
 * 
 * Component for showing contextual feature introductions and tutorials
 * to help users learn about new features and functionality.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { 
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  LightBulbIcon,
  BookOpenIcon,
  VideoIcon,
} from '@/components/ui/icons';
import { usePostSignupStore } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface FeatureIntroductionProps {
  className?: string;
  featureId: string;
  onComplete?: () => void;
  onDismiss?: () => void;
  autoStart?: boolean;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  media?: {
    type: 'image' | 'video' | 'gif';
    src: string;
    alt: string;
  };
}

interface FeatureTutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: TutorialStep[];
  estimatedTime: number;
  category: 'basic' | 'advanced' | 'integration';
}

// Feature tutorials configuration
const featureTutorials: Record<string, FeatureTutorial> = {
  'advocate-matching': {
    id: 'advocate-matching',
    title: 'AI-Powered Advocate Matching',
    description: 'Learn how to find the perfect advocate for your prospects',
    icon: <LightBulbIcon size={24} />,
    estimatedTime: 3,
    category: 'basic',
    steps: [
      {
        id: 'overview',
        title: 'What is Advocate Matching?',
        description: 'Our AI helps you find the best advocates for your prospects',
        content: 'PeerChamps uses advanced AI to analyze your prospects and match them with the most relevant advocates based on industry, use case, company size, and other factors.',
        type: 'text',
        duration: 30,
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        description: 'The matching process explained',
        content: 'When you create an opportunity, our AI analyzes the prospect profile and scores all available advocates. You\'ll see the top matches with confidence scores and reasoning.',
        type: 'text',
        duration: 45,
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        description: 'Tips for getting the best matches',
        content: 'Provide detailed prospect information, keep advocate profiles up-to-date, and consider advocate availability and fatigue levels when making your selection.',
        type: 'text',
        duration: 30,
      },
    ],
  },
  'reference-scheduling': {
    id: 'reference-scheduling',
    title: 'Reference Call Scheduling',
    description: 'Master the art of seamless reference call coordination',
    icon: <VideoIcon size={24} />,
    estimatedTime: 4,
    category: 'basic',
    steps: [
      {
        id: 'overview',
        title: 'Scheduling Made Simple',
        description: 'Streamline your reference call coordination',
        content: 'Our scheduling system automatically handles calendar conflicts, time zones, and meeting creation. Advocates and prospects can book calls with just a few clicks.',
        type: 'text',
        duration: 30,
      },
      {
        id: 'calendar-integration',
        title: 'Calendar Integration',
        description: 'Connect your calendars for seamless scheduling',
        content: 'Link Google Calendar, Outlook, or other calendar systems to automatically show availability and create meetings without manual coordination.',
        type: 'text',
        duration: 45,
      },
      {
        id: 'automation',
        title: 'Automation Features',
        description: 'Let the system handle the details',
        content: 'Automated reminders, meeting links, prep materials, and follow-up emails ensure nothing falls through the cracks.',
        type: 'text',
        duration: 30,
      },
    ],
  },
  'crm-integration': {
    id: 'crm-integration',
    title: 'CRM Integration',
    description: 'Connect your CRM for seamless workflow integration',
    icon: <BookOpenIcon size={24} />,
    estimatedTime: 5,
    category: 'integration',
    steps: [
      {
        id: 'overview',
        title: 'Why Integrate Your CRM?',
        description: 'Benefits of connecting your CRM system',
        content: 'CRM integration allows you to access PeerChamps directly from your sales workflow, automatically sync data, and track reference call impact on deals.',
        type: 'text',
        duration: 30,
      },
      {
        id: 'setup',
        title: 'Setting Up Integration',
        description: 'Step-by-step integration setup',
        content: 'Connect Salesforce, HubSpot, or other CRM systems through our secure OAuth flow. The process takes just a few minutes and requires no technical expertise.',
        type: 'text',
        duration: 60,
      },
      {
        id: 'features',
        title: 'Integration Features',
        description: 'What you can do with CRM integration',
        content: 'View advocate recommendations directly in opportunity records, automatically log reference call activities, and track the impact of reference calls on deal progression.',
        type: 'text',
        duration: 45,
      },
    ],
  },
};

export const FeatureIntroduction: React.FC<FeatureIntroductionProps> = ({
  className = '',
  featureId,
  onComplete,
  onDismiss,
  autoStart = false,
}) => {
  const { markStepCompleted } = usePostSignupStore();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const tutorial = featureTutorials[featureId];
  
  if (!tutorial) {
    console.warn(`No tutorial found for feature: ${featureId}`);
    return null;
  }

  const currentStepData = tutorial.steps[currentStep];
  const isLastStep = currentStep === tutorial.steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (autoStart) {
      setIsVisible(true);
      setIsPlaying(true);
    }
  }, [autoStart]);

  useEffect(() => {
    if (isPlaying && currentStepData.duration) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (currentStepData.duration! * 10));
          if (newProgress >= 100) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStepData.duration]);

  const handleStart = () => {
    setIsVisible(true);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleComplete = () => {
    markStepCompleted(`tutorial_${featureId}`);
    setIsVisible(false);
    setIsPlaying(false);
    onComplete?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsPlaying(false);
    onDismiss?.();
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isVisible) {
    return (
      <Card className={cn('cursor-pointer hover:shadow-md transition-shadow', className)}>
        <CardBody className="p-4" onClick={handleStart}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center text-white">
              {tutorial.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
              <p className="text-sm text-gray-600">{tutorial.description}</p>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<PlayIcon size={16} />}>
              Learn
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4', className)}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-lg flex items-center justify-center text-white">
                {tutorial.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {tutorial.steps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1"
            >
              <XMarkIcon size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {currentStepData.title}
              </span>
              <span className="text-gray-500">
                {tutorial.estimatedTime} min tutorial
              </span>
            </div>
            <Progress value={(currentStep / tutorial.steps.length) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentStepData.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Media Content */}
            {currentStepData.media && (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">
                  {currentStepData.media.type === 'image' && '📷 Image placeholder'}
                  {currentStepData.media.type === 'video' && '🎥 Video placeholder'}
                  {currentStepData.media.type === 'gif' && '🎬 GIF placeholder'}
                </p>
              </div>
            )}

            {/* Action Button */}
            {currentStepData.action && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={currentStepData.action.onClick}
                >
                  {currentStepData.action.label}
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePlay}
                disabled={!currentStepData.duration}
              >
                {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
              </Button>
              {currentStepData.duration && (
                <span className="text-sm text-gray-500">
                  {Math.ceil((100 - progress) / 10)}s remaining
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                leftIcon={<ArrowLeftIcon size={16} />}
              >
                Previous
              </Button>
              
              <Button
                variant="primary"
                onClick={handleNext}
                rightIcon={isLastStep ? <CheckCircleIcon size={16} /> : <ArrowRightIcon size={16} />}
              >
                {isLastStep ? 'Complete Tutorial' : 'Next Step'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
