/**
 * Empty Dashboard State Component
 *
 * Component shown when a new user has no data in their dashboard.
 * Provides guidance on next steps and quick actions.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  UsersIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@/components/ui/icons';

interface EmptyDashboardStateProps {
  className?: string;
  onAddAdvocate?: () => void;
  onCreateOpportunity?: () => void;
  onScheduleCall?: () => void;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({
  className = '',
  onAddAdvocate,
  onCreateOpportunity,
  onScheduleCall,
}) => {
  const quickActions = [
    {
      title: 'Add Your First Advocate',
      description: 'Onboard a customer advocate to start building your reference network',
      icon: <UsersIcon size={20} className="text-blue-600" />,
      action: onAddAdvocate,
      buttonText: 'Add Advocate',
    },
    {
      title: 'Create an Opportunity',
      description: 'Set up your first sales opportunity to track your pipeline',
      icon: <BuildingOfficeIcon size={20} className="text-green-600" />,
      action: onCreateOpportunity,
      buttonText: 'Create Opportunity',
    },
    {
      title: 'Schedule a Reference Call',
      description: 'Connect prospects with advocates for reference calls',
      icon: <PhoneIcon size={20} className="text-purple-600" />,
      action: onScheduleCall,
      buttonText: 'Schedule Call',
    },
  ];

  const setupSteps = [
    {
      step: 1,
      title: 'Invite Advocates',
      description: 'Add your best customers as advocates to your network',
      completed: false,
    },
    {
      step: 2,
      title: 'Create Opportunities',
      description: 'Set up your sales opportunities and track their progress',
      completed: false,
    },
    {
      step: 3,
      title: 'Schedule Reference Calls',
      description: 'Connect prospects with advocates for reference calls',
      completed: false,
    },
    {
      step: 4,
      title: 'Track Performance',
      description: 'Monitor your reference call success and pipeline metrics',
      completed: false,
    },
  ];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      {/* Welcome Message */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amaranth-100 to-sundown-100 rounded-full flex items-center justify-center mb-4">
            <BuildingOfficeIcon size={32} className="text-amaranth-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to PeerChamps! 🎉
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          You're all set up! Now let's get your reference program running. 
          Start by adding advocates and creating your first opportunity to see your dashboard come to life.
        </p>

        <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-8">
          <CheckCircleIcon size={20} className="text-green-600 mr-2" />
          <span className="text-green-800 font-medium">
            Account created successfully
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {action.icon}
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                {action.title}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {action.description}
            </p>
            
            <Button
              variant="primary"
              size="sm"
              onClick={action.action}
              className="w-full"
              rightIcon={<ArrowRightIcon size={16} />}
            >
              {action.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* Setup Progress */}
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Getting Started Checklist
        </h3>
        
        <div className="space-y-4">
          {setupSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-sm font-semibold text-gray-600">
                  {step.step}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircleIcon size={20} className="text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Need help getting started? Check out our quick start guide or contact support.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Open help documentation
              console.log('Open help documentation');
            }}
          >
            View Quick Start Guide
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Open support
              console.log('Contact support');
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};
