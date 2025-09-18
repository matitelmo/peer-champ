/**
 * Import Progress Step Component
 * 
 * Step for showing import progress and results.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Alert } from '@/components/ui/Alert';
import { 
  CheckCircleIcon,
  AlertCircleIcon,
  ExclamationTriangleIcon,
  DownloadIcon,
  EyeIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ImportProgressStepProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  importData: any;
  setImportData: (data: any) => void;
  importType: string;
}

interface ImportResults {
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: any[];
  warnings: any[];
  duration: number;
}

export const ImportProgressStep: React.FC<ImportProgressStepProps> = ({
  onComplete,
  importData,
  importType,
}) => {
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [currentStep, setCurrentStep] = useState('Preparing import...');

  const steps = [
    'Preparing import...',
    'Validating data...',
    'Creating records...',
    'Updating relationships...',
    'Finalizing import...',
    'Import complete!',
  ];

  useEffect(() => {
    if (importData?.validationResults) {
      startImport();
    }
  }, [importData]);

  const startImport = async () => {
    setIsImporting(true);
    setProgress(0);
    
    const totalRecords = importData.validationResults.validRows.length;
    const startTime = Date.now();
    
    try {
      // Simulate import process with progress updates
      for (let i = 0; i < steps.length - 1; i++) {
        setCurrentStep(steps[i]);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update progress
        const stepProgress = Math.round(((i + 1) / (steps.length - 1)) * 100);
        setProgress(stepProgress);
      }
      
      // Final step
      setCurrentStep(steps[steps.length - 1]);
      
      // Simulate some failures
      const successfulImports = Math.floor(totalRecords * 0.95);
      const failedImports = totalRecords - successfulImports;
      
      const results: ImportResults = {
        totalRecords,
        successfulImports,
        failedImports,
        errors: importData.validationResults.errors.slice(0, failedImports),
        warnings: importData.validationResults.warnings,
        duration: Date.now() - startTime,
      };
      
      setImportResults(results);
      setIsImporting(false);
      
    } catch (error) {
      console.error('Import error:', error);
      setIsImporting(false);
    }
  };

  const handleViewResults = () => {
    // TODO: Navigate to imported data view
    console.log('View results');
  };

  const handleDownloadReport = () => {
    // TODO: Generate and download import report
    console.log('Download report');
  };

  const handleComplete = () => {
    onComplete();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isImporting) {
    return (
      <div className="space-y-6">
        {/* Import Progress */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Importing Your Data
          </h3>
          <p className="text-gray-600">
            Please wait while we import your {importType} data...
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {currentStep}
                </span>
                <span className="text-sm text-gray-600">
                  {progress}%
                </span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Importing {importData?.validationResults?.validRows?.length || 0} records...
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Import Steps */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg',
                index < steps.indexOf(currentStep) && 'bg-green-50 text-green-700',
                index === steps.indexOf(currentStep) && 'bg-amaranth-50 text-amaranth-700',
                index > steps.indexOf(currentStep) && 'bg-gray-50 text-gray-500'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                index < steps.indexOf(currentStep) && 'bg-green-100 text-green-600',
                index === steps.indexOf(currentStep) && 'bg-amaranth-100 text-amaranth-600',
                index > steps.indexOf(currentStep) && 'bg-gray-100 text-gray-400'
              )}>
                {index < steps.indexOf(currentStep) ? (
                  <CheckCircleIcon size={16} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!importResults) {
    return (
      <div className="text-center py-12">
        <AlertCircleIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No import results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Import Complete */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon size={32} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Import Complete!
        </h3>
        <p className="text-gray-600">
          Your {importType} data has been successfully imported.
        </p>
      </div>

      {/* Import Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">{importResults.totalRecords}</div>
            <div className="text-sm text-gray-600">Total Processed</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{importResults.successfulImports}</div>
            <div className="text-sm text-gray-600">Successfully Imported</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">{importResults.failedImports}</div>
            <div className="text-sm text-gray-600">Failed Imports</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{formatDuration(importResults.duration)}</div>
            <div className="text-sm text-gray-600">Import Duration</div>
          </CardBody>
        </Card>
      </div>

      {/* Success Rate */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Import Success Rate</h4>
            <span className="text-2xl font-bold text-green-600">
              {Math.round((importResults.successfulImports / importResults.totalRecords) * 100)}%
            </span>
          </div>
          <Progress 
            value={(importResults.successfulImports / importResults.totalRecords) * 100} 
            className="h-2"
          />
        </CardBody>
      </Card>

      {/* Errors and Warnings */}
      {(importResults.errors.length > 0 || importResults.warnings.length > 0) && (
        <div className="space-y-4">
          {importResults.errors.length > 0 && (
            <Alert variant="error">
              <AlertCircleIcon size={20} className="mr-2" />
              {importResults.failedImports} records failed to import. Check the errors below.
            </Alert>
          )}

          {importResults.warnings.length > 0 && (
            <Alert variant="warning">
              <ExclamationTriangleIcon size={20} className="mr-2" />
              {importResults.warnings.length} warnings were found during import.
            </Alert>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleViewResults}
            leftIcon={<EyeIcon size={16} />}
          >
            View Imported Data
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleDownloadReport}
            leftIcon={<DownloadIcon size={16} />}
          >
            Download Report
          </Button>
        </div>
        
        <Button
          variant="primary"
          onClick={handleComplete}
          rightIcon={<CheckCircleIcon size={16} />}
        >
          Complete Import
        </Button>
      </div>
    </div>
  );
};
