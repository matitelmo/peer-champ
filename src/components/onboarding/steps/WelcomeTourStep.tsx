/**
 * Welcome Tour Step Component
 * 
 * Ninth step of the onboarding flow - interactive product tour
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PlayIcon, CheckIcon, ArrowRightIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface WelcomeTourStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

const TOUR_FEATURES = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your central hub for managing reference calls and tracking performance',
    icon: '📊',
    duration: '2 min',
  },
  {
    id: 'advocates',
    title: 'Advocate Management',
    description: 'Add and manage your customer advocates, track their availability and performance',
    icon: '👥',
    duration: '3 min',
  },
  {
    id: 'opportunities',
    title: 'Opportunity Matching',
    description: 'AI-powered matching to find the perfect advocate for each prospect',
    icon: '🎯',
    duration: '2 min',
  },
  {
    id: 'scheduling',
    title: 'Scheduling System',
    description: 'Seamless calendar integration and automated scheduling workflows',
    icon: '📅',
    duration: '2 min',
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'Track your reference program success with detailed insights and reports',
    icon: '📈',
    duration: '3 min',
  },
];

export const WelcomeTourStep: React.FC<WelcomeTourStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  isOptional = true,
}) => {
  const { updateData, setIsLoading, setError } = useOnboarding();
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isStartingTour, setIsStartingTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeatures.length === TOUR_FEATURES.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(TOUR_FEATURES.map(f => f.id));
    }
  };

  const startTour = async () => {
    try {
      setIsStartingTour(true);
      setError(null);
      setIsLoading(true);

      // Simulate tour completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const tourData = {
        features_toured: selectedFeatures,
        completed_at: new Date().toISOString(),
        duration: selectedFeatures.length * 2, // Estimated 2 minutes per feature
      };

      updateData({ welcome_tour: tourData });
      setTourCompleted(true);
      onComplete(tourData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start tour';
      setError(errorMessage);
      console.error('Error starting tour:', err);
    } finally {
      setIsStartingTour(false);
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    onNext();
  };

  const handleSkip = () => {
    onComplete({ welcome_tour: { skipped: true } });
    onSkip();
  };

  if (tourCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <CheckIcon size={40} className="text-green-600 dark:text-green-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tour Complete!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've completed the welcome tour and learned about PeerChamps' key features. 
          You're now ready to start using the platform effectively.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            What's Next?
          </h3>
          <ul className="text-left space-y-2 text-green-700 dark:text-green-300">
            <li className="flex items-start gap-2">
              <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">Start creating your first reference call</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">Add more customer advocates to your network</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">Connect your CRM for seamless integration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">Explore advanced features as you grow</span>
            </li>
          </ul>
        </div>

        <Button onClick={handleContinue} size="lg" className="px-8">
          <ArrowRightIcon size={20} className="mr-2" />
          Finish Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
          <PlayIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to PeerChamps!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's take a quick tour to show you the key features and get you started
        </p>
      </div>

      {/* Feature Selection */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose what to explore
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedFeatures.length === TOUR_FEATURES.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="space-y-3">
          {TOUR_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedFeatures.includes(feature.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleFeatureToggle(feature.id)}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      {feature.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          About the Tour
        </h3>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Interactive walkthrough of key features</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Learn best practices and tips</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Skip any section you're not interested in</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Access help and support anytime</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Previous
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip Tour
        </Button>
        
        <Button
          type="button"
          onClick={startTour}
          disabled={selectedFeatures.length === 0 || isStartingTour}
          className="flex-1"
        >
          {isStartingTour ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Starting Tour...
            </>
          ) : (
            <>
              <PlayIcon size={16} className="mr-2" />
              Start Tour ({selectedFeatures.length} selected)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
