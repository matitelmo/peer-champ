/**
 * Stepper Component
 *
 * A step-by-step navigation component for multi-step processes,
 * forms, and workflows with different variants and orientations.
 */

'use client';

import React, { ReactNode } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

// Types
export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  status: 'pending' | 'current' | 'completed' | 'error';
  disabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'minimal' | 'numbered' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showConnector?: boolean;
  allowClick?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  showConnector = true,
  allowClick = true,
}) => {
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Get step status classes
  const getStepStatusClasses = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-600 text-white border-primary-600';
      case 'current':
        return 'bg-primary-100 text-primary-600 border-primary-600 dark:bg-primary-900/20 dark:text-primary-400';
      case 'error':
        return 'bg-red-100 text-red-600 border-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600';
    }
  };

  // Get text status classes
  const getTextStatusClasses = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'text-primary-600 dark:text-primary-400';
      case 'current':
        return 'text-primary-600 dark:text-primary-400 font-semibold';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Get connector classes
  const getConnectorClasses = (index: number) => {
    const isCompleted = index < currentStep;
    return isCompleted
      ? 'bg-primary-600 dark:bg-primary-400'
      : 'bg-gray-300 dark:bg-gray-600';
  };

  // Handle step click
  const handleStepClick = (index: number) => {
    if (allowClick && onStepClick && !steps[index].disabled) {
      onStepClick(index);
    }
  };

  // Render step icon
  const renderStepIcon = (step: Step, index: number) => {
    if (variant === 'dots') {
      return (
        <div
          className={`
            w-3 h-3 rounded-full border-2 transition-colors
            ${getStepStatusClasses(step.status)}
          `}
        />
      );
    }

    if (variant === 'numbered') {
      return (
        <div
          className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold transition-colors
            ${getStepStatusClasses(step.status)}
          `}
        >
          {step.status === 'completed' ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            index + 1
          )}
        </div>
      );
    }

    // Default variant
    if (step.icon) {
      return (
        <div
          className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
            ${getStepStatusClasses(step.status)}
          `}
        >
          {step.status === 'completed' ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4">{step.icon}</div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`
          w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold transition-colors
          ${getStepStatusClasses(step.status)}
        `}
      >
        {step.status === 'completed' ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          index + 1
        )}
      </div>
    );
  };

  // Render horizontal stepper
  const renderHorizontal = () => (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`
              flex flex-col items-center ${allowClick && !step.disabled ? 'cursor-pointer' : ''}
              ${step.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleStepClick(index)}
          >
            {renderStepIcon(step, index)}
            <div className="mt-2 text-center">
              <div
                className={`font-medium ${getTextStatusClasses(step.status)}`}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </div>

          {/* Connector */}
          {showConnector && index < steps.length - 1 && (
            <div
              className={`
                flex-1 h-0.5 mx-4 transition-colors
                ${getConnectorClasses(index)}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Render vertical stepper
  const renderVertical = () => (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start">
          <div className="flex flex-col items-center">
            {renderStepIcon(step, index)}

            {/* Vertical connector */}
            {showConnector && index < steps.length - 1 && (
              <div
                className={`
                  w-0.5 h-8 mt-2 transition-colors
                  ${getConnectorClasses(index)}
                `}
              />
            )}
          </div>

          <div
            className={`
              ml-4 flex-1 ${allowClick && !step.disabled ? 'cursor-pointer' : ''}
              ${step.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleStepClick(index)}
          >
            <div className={`font-medium ${getTextStatusClasses(step.status)}`}>
              {step.title}
            </div>
            {step.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {step.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={getSizeClasses()}>
      {orientation === 'horizontal' ? renderHorizontal() : renderVertical()}
    </div>
  );
};

// Progress Stepper Component
export interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  showProgress?: boolean;
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  showProgress = true,
  className = '',
}) => {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Steps */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        orientation="horizontal"
        variant="numbered"
        showConnector={true}
      />
    </div>
  );
};

export default Stepper;
