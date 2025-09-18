/**
 * Enhanced Dashboard Component
 * 
 * Main dashboard component that integrates the welcome experience,
 * progress tracking, guided tour, and quick actions for new users.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { WelcomeBanner } from './WelcomeBanner';
import { ProgressTracker } from './ProgressTracker';
import { QuickActions } from './QuickActions';
import { GuidedTour } from './GuidedTour';
import { EmptyDashboardState } from './EmptyDashboardState';
import { SalesRepDashboard } from './SalesRepDashboard';
import { usePostSignupStore, getConfigurationProgress, getNextIncompleteStep } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface EnhancedDashboardProps {
  className?: string;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  className = '',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    configurationSteps,
    completedSteps,
    tourCompleted,
    showWelcomeBanner,
    showProgressTracker,
    markStepCompleted,
    completeTour,
    toggleWelcomeBanner,
  } = usePostSignupStore();

  const [showTour, setShowTour] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get progress information
  const progress = getConfigurationProgress(usePostSignupStore.getState());
  const nextStep = getNextIncompleteStep(usePostSignupStore.getState());

  // Check if onboarding is completed (basic profile and team setup)
  const hasCompletedOnboarding = completedSteps.has('profile_completion') && completedSteps.has('team_setup');
  const hasCompletedProfile = completedSteps.has('profile_completion');
  const hasCompletedTeamSetup = completedSteps.has('team_setup');
  const hasCompletedDataImport = completedSteps.has('data_import');
  const hasCompletedIntegrations = completedSteps.has('crm_integration') || completedSteps.has('calendar_integration');
  const hasCompletedTour = tourCompleted;
  const isWelcomeBannerDismissed = !showWelcomeBanner;

  // Show tour for new users
  useEffect(() => {
    if (hasCompletedOnboarding && !hasCompletedTour && !showTour) {
      setShowTour(true);
    }
  }, [hasCompletedOnboarding, hasCompletedTour, showTour]);

  // Show celebration when tour is completed
  const handleTourComplete = () => {
    completeTour();
    setShowTour(false);
    setShowCelebration(true);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const handleTourSkip = () => {
    setShowTour(false);
  };

  const dismissWelcomeBanner = () => {
    toggleWelcomeBanner();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    router.push('/onboarding');
    return null;
  }

  // Show empty state for new users
  if (!hasCompletedProfile || !hasCompletedTeamSetup) {
    return (
      <div className={cn('min-h-screen bg-gray-50', className)}>
        {/* Welcome Banner */}
        {!isWelcomeBannerDismissed && (
          <WelcomeBanner onDismiss={dismissWelcomeBanner} />
        )}
        
        {/* Progress Tracker */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProgressTracker />
        </div>
        
        {/* Empty Dashboard State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <EmptyDashboardState />
        </div>
        
        {/* Guided Tour */}
        {showTour && (
          <GuidedTour
            onComplete={handleTourComplete}
            onSkip={handleTourSkip}
          />
        )}
        
        {/* Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🎉 Tour Complete!
              </h3>
              <p className="text-gray-600 mb-4">
                You're all set! You now know how to navigate your dashboard and use the key features.
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="px-4 py-2 bg-amaranth-600 text-white rounded-md hover:bg-amaranth-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show full dashboard for configured users
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Welcome Banner */}
      {!isWelcomeBannerDismissed && (
        <WelcomeBanner onDismiss={dismissWelcomeBanner} />
      )}
      
      {/* Progress Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressTracker />
      </div>
      
      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <QuickActions />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SalesRepDashboard />
      </div>
      
      {/* Guided Tour */}
      {showTour && (
        <GuidedTour
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
      
      {/* Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🎉 Tour Complete!
            </h3>
            <p className="text-gray-600 mb-4">
              You're all set! You now know how to navigate your dashboard and use the key features.
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="px-4 py-2 bg-amaranth-600 text-white rounded-md hover:bg-amaranth-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
