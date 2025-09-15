/**
 * Onboarding Page
 *
 * Main page for company onboarding and user invitation.
 * Provides step-by-step setup for new companies.
 */

'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { CompanyRegistration } from '@/components/onboarding/CompanyRegistration';
import { UserInvitation } from '@/components/onboarding/UserInvitation';
import { Button } from '@/components/ui/Button';
import { BuildingOfficeIcon, UserIcon, CheckIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type OnboardingStep = 'company' | 'invite' | 'complete';

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('company');
  const [companyId, setCompanyId] = useState<string | null>(null);

  const handleCompanySuccess = (newCompanyId: string) => {
    setCompanyId(newCompanyId);
    setCurrentStep('invite');
  };

  const handleInviteSuccess = () => {
    setCurrentStep('complete');
  };

  const handleBackToCompany = () => {
    setCurrentStep('company');
  };

  const handleBackToInvite = () => {
    setCurrentStep('invite');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'company':
        return (
          <CompanyRegistration
            onSuccess={handleCompanySuccess}
            onCancel={() => window.history.back()}
          />
        );
      
      case 'invite':
        return (
          <UserInvitation
            companyId={companyId || ''}
            onSuccess={handleInviteSuccess}
            onCancel={handleBackToCompany}
          />
        );
      
      case 'complete':
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <CheckIcon size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to PeerChamps!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Your company has been successfully set up. You can now start managing your advocates and scheduling reference calls.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full max-w-xs"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToInvite}
                className="w-full max-w-xs"
              >
                Invite More Users
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'company':
        return 'Company Registration';
      case 'invite':
        return 'Invite Team Members';
      case 'complete':
        return 'Setup Complete';
      default:
        return 'Onboarding';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'company':
        return 'Set up your company account and create your admin user';
      case 'invite':
        return 'Invite your team members to join your company';
      case 'complete':
        return 'Your company is ready to use PeerChamps';
      default:
        return '';
    }
  };

  return (
    <DashboardLayoutWithNav
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {/* Step 1: Company Registration */}
            <div className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep === 'company' || currentStep === 'invite' || currentStep === 'complete'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {currentStep === 'invite' || currentStep === 'complete' ? (
                  <CheckIcon size={16} />
                ) : (
                  '1'
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Company Setup
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Register your company
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className={cn(
              'w-16 h-0.5',
              currentStep === 'invite' || currentStep === 'complete'
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            )} />

            {/* Step 2: User Invitation */}
            <div className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep === 'invite' || currentStep === 'complete'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {currentStep === 'complete' ? (
                  <CheckIcon size={16} />
                ) : (
                  '2'
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Team Setup
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Invite your team
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className={cn(
              'w-16 h-0.5',
              currentStep === 'complete'
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            )} />

            {/* Step 3: Complete */}
            <div className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep === 'complete'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                3
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Complete
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to go!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}
      </div>
    </DashboardLayoutWithNav>
  );
}

export default OnboardingPage;
