/**
 * Welcome Step Component
 * 
 * First step of the onboarding flow - welcomes users and explains the process
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { CheckIcon, UsersIcon, CalendarIcon, ChartBarIcon } from '@/components/ui/icons';

interface WelcomeStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onNext,
  onComplete,
}) => {
  const handleGetStarted = () => {
    onComplete({ welcome_completed: true });
    onNext();
  };

  return (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <UsersIcon size={40} className="text-blue-600 dark:text-blue-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to PeerChamps!
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your customer reference calls from chaotic "fire drills" into 
          professional, scalable workflows that accelerate your sales cycles.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center">
          <CardBody className="p-6">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <UsersIcon size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Matching
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Find the perfect customer advocates for your prospects using intelligent matching algorithms.
            </p>
          </CardBody>
        </Card>

        <Card className="text-center">
          <CardBody className="p-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Seamless Scheduling
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Streamline reference call scheduling with calendar integrations and automated workflows.
            </p>
          </CardBody>
        </Card>

        <Card className="text-center">
          <CardBody className="p-6">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Call Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Capture insights from reference conversations and track their impact on your sales pipeline.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Setup Process Overview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What we'll set up together:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-3">
            <CheckIcon size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Company Profile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set up your company information and preferences</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckIcon size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Admin Account</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create your secure admin account</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckIcon size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Team Invitations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Invite your sales team and advocates</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckIcon size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">CRM Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with Salesforce or HubSpot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Estimate */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Setup Time:</strong> This process typically takes 10-15 minutes to complete. 
          You can save your progress and return later if needed.
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="px-8 py-3"
        >
          <CheckIcon size={20} className="mr-2" />
          Get Started
        </Button>
      </div>
    </div>
  );
};
