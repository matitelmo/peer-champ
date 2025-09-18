/**
 * Data Import Wizard Component
 * 
 * Multi-step wizard for importing data via CSV/Excel files,
 * including field mapping, validation, and progress reporting.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon,
  UploadIcon,
  FileIcon,
  TableIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from '@/components/ui/icons';
import { FileUploadStep } from './steps/FileUploadStep';
import { FieldMappingStep } from './steps/FieldMappingStep';
import { ValidationStep } from './steps/ValidationStep';
import { ImportProgressStep } from './steps/ImportProgressStep';
import { cn } from '@/lib/utils';

interface DataImportWizardProps {
  className?: string;
  onComplete?: (results: ImportResults) => void;
  onCancel?: () => void;
  importType?: 'advocates' | 'opportunities' | 'contacts';
}

interface ImportResults {
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportWarning {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportData {
  headers: string[];
  rows: any[][];
  file: File;
  mappedFields: Record<string, string>;
  validationResults: {
    validRows: any[];
    invalidRows: any[];
    errors: ImportError[];
    warnings: ImportWarning[];
  };
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
    id: 'file_upload',
    title: 'Upload File',
    description: 'Select and upload your CSV or Excel file',
    component: FileUploadStep,
    icon: <UploadIcon size={20} />,
  },
  {
    id: 'field_mapping',
    title: 'Map Fields',
    description: 'Match your file columns to our data fields',
    component: FieldMappingStep,
    icon: <TableIcon size={20} />,
  },
  {
    id: 'validation',
    title: 'Validate Data',
    description: 'Review and fix any data issues',
    component: ValidationStep,
    icon: <AlertCircleIcon size={20} />,
  },
  {
    id: 'import',
    title: 'Import Data',
    description: 'Import your data into PeerChamps',
    component: ImportProgressStep,
    icon: <CheckCircleIcon size={20} />,
  },
];

export const DataImportWizard: React.FC<DataImportWizardProps> = ({
  className = '',
  onComplete,
  onCancel,
  importType = 'advocates',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);

  const currentStep = wizardSteps[currentStepIndex];
  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = async (stepData?: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update import data with step results
      if (stepData) {
        setImportData(prev => prev ? { ...prev, ...stepData } : null);
      }

      // Move to next step or complete wizard
      if (isLastStep) {
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
      
      // Simulate import process
      const results: ImportResults = {
        totalRecords: importData?.rows.length || 0,
        successfulImports: Math.floor((importData?.rows.length || 0) * 0.9),
        failedImports: Math.floor((importData?.rows.length || 0) * 0.1),
        errors: importData?.validationResults.errors || [],
        warnings: importData?.validationResults.warnings || [],
      };

      setImportResults(results);
      onComplete?.(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete import');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / wizardSteps.length) * 100);

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Import {importType.charAt(0).toUpperCase() + importType.slice(1)}
            </h1>
            <p className="text-gray-600">
              Upload and import your data from CSV or Excel files
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
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
            onComplete: handleComplete,
            isLoading,
            isFirstStep,
            isLastStep,
            importData,
            setImportData,
            importType,
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
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel Import
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
                {isLastStep ? 'Importing...' : 'Processing...'}
              </>
            ) : (
              isLastStep ? 'Start Import' : 'Next Step'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
