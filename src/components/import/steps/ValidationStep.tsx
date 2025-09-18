/**
 * Validation Step Component
 * 
 * Step for validating imported data and showing errors/warnings.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { 
  AlertCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  XMarkIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ValidationStepProps {
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

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ValidationWarning {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ValidationResults {
  validRows: any[];
  invalidRows: any[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  onNext,
  onPrevious,
  isLoading,
  importData,
  setImportData,
  importType,
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Validate data when component mounts or importData changes
  useEffect(() => {
    if (importData?.rows && importData?.mappedFields) {
      validateData();
    }
  }, [importData]);

  const validateData = async () => {
    setIsValidating(true);
    
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = performValidation(importData);
      setValidationResults(results);
      
      // Update import data with validation results
      setImportData({
        ...importData,
        validationResults: results,
      });
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const performValidation = (data: any): ValidationResults => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const validRows: any[] = [];
    const invalidRows: any[] = [];

    data.rows.forEach((row: any[], rowIndex: number) => {
      const rowData: any = {};
      let hasErrors = false;

      // Map row data to field names
      data.headers.forEach((header: string, colIndex: number) => {
        const fieldId = data.mappedFields[header];
        if (fieldId) {
          rowData[fieldId] = row[colIndex];
        }
      });

      // Validate each field
      Object.entries(rowData).forEach(([fieldId, value]) => {
        const field = getFieldDefinition(fieldId);
        if (!field) return;

        // Required field validation
        if (field.required && (!value || String(value).trim() === '')) {
          errors.push({
            row: rowIndex + 1,
            field: field.label,
            message: `${field.label} is required`,
            value: value,
          });
          hasErrors = true;
        }

        // Email validation
        if (field.type === 'email' && value && !isValidEmail(String(value))) {
          errors.push({
            row: rowIndex + 1,
            field: field.label,
            message: 'Invalid email format',
            value: value,
          });
          hasErrors = true;
        }

        // Phone validation
        if (field.type === 'phone' && value && !isValidPhone(String(value))) {
          warnings.push({
            row: rowIndex + 1,
            field: field.label,
            message: 'Phone number format may be invalid',
            value: value,
          });
        }

        // Date validation
        if (field.type === 'date' && value && !isValidDate(String(value))) {
          warnings.push({
            row: rowIndex + 1,
            field: field.label,
            message: 'Date format may be invalid',
            value: value,
          });
        }

        // Number validation
        if (field.type === 'number' && value && isNaN(Number(value))) {
          errors.push({
            row: rowIndex + 1,
            field: field.label,
            message: 'Must be a valid number',
            value: value,
          });
          hasErrors = true;
        }
      });

      if (hasErrors) {
        invalidRows.push({ ...rowData, _rowIndex: rowIndex + 1 });
      } else {
        validRows.push({ ...rowData, _rowIndex: rowIndex + 1 });
      }
    });

    return { validRows, invalidRows, errors, warnings };
  };

  const getFieldDefinition = (fieldId: string) => {
    const fieldDefinitions: Record<string, any> = {
      advocates: {
        name: { label: 'Name', required: true, type: 'text' },
        email: { label: 'Email', required: true, type: 'email' },
        title: { label: 'Title', required: false, type: 'text' },
        company: { label: 'Company', required: false, type: 'text' },
        phone: { label: 'Phone', required: false, type: 'phone' },
      },
      opportunities: {
        prospect_company: { label: 'Prospect Company', required: true, type: 'text' },
        prospect_name: { label: 'Prospect Name', required: false, type: 'text' },
        prospect_email: { label: 'Prospect Email', required: false, type: 'email' },
        deal_value: { label: 'Deal Value', required: false, type: 'number' },
        expected_close: { label: 'Expected Close Date', required: false, type: 'date' },
      },
    };
    
    return fieldDefinitions[importType]?.[fieldId];
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const isValidDate = (date: string): boolean => {
    return !isNaN(Date.parse(date));
  };

  const handleContinue = () => {
    if (validationResults) {
      onNext(validationResults);
    }
  };

  const getValidationSummary = () => {
    if (!validationResults) return null;

    const { validRows, invalidRows, errors, warnings } = validationResults;
    const totalRows = validRows.length + invalidRows.length;

    return {
      total: totalRows,
      valid: validRows.length,
      invalid: invalidRows.length,
      errors: errors.length,
      warnings: warnings.length,
      successRate: Math.round((validRows.length / totalRows) * 100),
    };
  };

  const summary = getValidationSummary();

  if (isValidating) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 text-amaranth-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-amaranth-600 border-t-transparent"></div>
          Validating your data...
        </div>
      </div>
    );
  }

  if (!validationResults || !summary) {
    return (
      <div className="text-center py-12">
        <AlertCircleIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No validation results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Data Validation Complete
        </h3>
        <p className="text-gray-600">
          Review the validation results below before importing your data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
            <div className="text-sm text-gray-600">Total Records</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{summary.valid}</div>
            <div className="text-sm text-gray-600">Valid Records</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">{summary.invalid}</div>
            <div className="text-sm text-gray-600">Invalid Records</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-amaranth-600">{summary.successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardBody>
        </Card>
      </div>

      {/* Errors and Warnings */}
      {(summary.errors > 0 || summary.warnings > 0) && (
        <div className="space-y-4">
          {summary.errors > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircleIcon size={20} />
                  Errors ({summary.errors})
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {validationResults.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                      <span className="font-medium">Row {error.row}:</span> {error.message}
                      {error.value && (
                        <span className="text-gray-600 ml-2">(Value: "{error.value}")</span>
                      )}
                    </div>
                  ))}
                  {validationResults.errors.length > 10 && (
                    <div className="text-sm text-gray-600 text-center py-2">
                      ... and {validationResults.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {summary.warnings > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center gap-2">
                  <ExclamationTriangleIcon size={20} />
                  Warnings ({summary.warnings})
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {validationResults.warnings.slice(0, 10).map((warning, index) => (
                    <div key={index} className="text-sm p-2 bg-amber-50 border border-amber-200 rounded">
                      <span className="font-medium">Row {warning.row}:</span> {warning.message}
                      {warning.value && (
                        <span className="text-gray-600 ml-2">(Value: "{warning.value}")</span>
                      )}
                    </div>
                  ))}
                  {validationResults.warnings.length > 10 && (
                    <div className="text-sm text-gray-600 text-center py-2">
                      ... and {validationResults.warnings.length - 10} more warnings
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Data Preview */}
      {summary.valid > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeIcon size={20} />
              Valid Data Preview
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {Object.keys(validationResults.validRows[0] || {}).slice(0, 5).map((key) => (
                      <th key={key} className="text-left py-2 px-3 font-medium text-gray-700">
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validationResults.validRows.slice(0, 3).map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      {Object.values(row).slice(0, 5).map((value, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-3 text-gray-600">
                          {String(value).substring(0, 30)}
                          {String(value).length > 30 && '...'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {validationResults.validRows.length > 3 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing first 3 of {validationResults.validRows.length} valid records
              </p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-3">
          {summary.invalid > 0 && (
            <Alert variant="warning" className="mr-4">
              {summary.invalid} records have errors and will be skipped during import.
            </Alert>
          )}
          
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={isLoading || summary.valid === 0}
            rightIcon={<CheckCircleIcon size={16} />}
          >
            Import {summary.valid} Valid Records
          </Button>
        </div>
      </div>
    </div>
  );
};
