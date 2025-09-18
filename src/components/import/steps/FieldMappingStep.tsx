/**
 * Field Mapping Step Component
 * 
 * Step for mapping CSV columns to application fields.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { 
  TableIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@/components/ui/icons';

interface FieldMappingStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  fileData?: {
    headers: string[];
    sampleRows: any[][];
    totalRows: number;
  };
}

interface FieldMapping {
  [csvColumn: string]: string;
}

// Available fields for mapping
const AVAILABLE_FIELDS = [
  { value: 'first_name', label: 'First Name', required: true },
  { value: 'last_name', label: 'Last Name', required: true },
  { value: 'email', label: 'Email Address', required: true },
  { value: 'phone', label: 'Phone Number', required: false },
  { value: 'company', label: 'Company', required: false },
  { value: 'title', label: 'Job Title', required: false },
  { value: 'location', label: 'Location', required: false },
  { value: 'industry', label: 'Industry', required: false },
  { value: 'linkedin_url', label: 'LinkedIn URL', required: false },
  { value: 'notes', label: 'Notes', required: false },
  { value: 'tags', label: 'Tags', required: false },
  { value: 'source', label: 'Source', required: false },
  { value: 'created_date', label: 'Created Date', required: false },
  { value: 'last_contact', label: 'Last Contact Date', required: false },
];

export const FieldMappingStep: React.FC<FieldMappingStepProps> = ({
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isLoading,
  isFirstStep,
  isLastStep,
  fileData,
}) => {
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Get available options for each CSV column
  const getAvailableOptions = (csvColumn: string) => {
    const usedFields = Object.values(fieldMappings);
    return AVAILABLE_FIELDS.filter(field => 
      !usedFields.includes(field.value) || fieldMappings[csvColumn] === field.value
    );
  };

  // Validate mappings
  const validateMappings = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = AVAILABLE_FIELDS.filter(f => f.required).map(f => f.value);
    const mappedFields = Object.values(fieldMappings);

    // Check if all required fields are mapped
    for (const requiredField of requiredFields) {
      if (!mappedFields.includes(requiredField)) {
        newErrors.general = `Required field "${AVAILABLE_FIELDS.find(f => f.value === requiredField)?.label}" must be mapped`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldMapping = (csvColumn: string, fieldValue: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [csvColumn]: fieldValue,
    }));

    // Clear error when user makes a selection
    if (errors[csvColumn]) {
      setErrors(prev => ({ ...prev, [csvColumn]: undefined }));
    }
  };

  const handleSubmit = () => {
    if (!validateMappings()) return;

    const mappingData = {
      fieldMappings,
      mappedFields: Object.values(fieldMappings),
      unmappedColumns: fileData?.headers.filter(h => !fieldMappings[h]) || [],
    };

    onNext(mappingData);
  };

  // Get mapping status
  const mappingStatus = useMemo(() => {
    const totalColumns = fileData?.headers.length || 0;
    const mappedColumns = Object.keys(fieldMappings).length;
    const requiredFields = AVAILABLE_FIELDS.filter(f => f.required);
    const mappedRequiredFields = requiredFields.filter(f => 
      Object.values(fieldMappings).includes(f.value)
    );

    return {
      totalColumns,
      mappedColumns,
      requiredFields: requiredFields.length,
      mappedRequiredFields: mappedRequiredFields.length,
      isComplete: mappedRequiredFields.length === requiredFields.length,
    };
  }, [fieldMappings, fileData]);

  if (!fileData) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon size={48} className="text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No File Data
        </h3>
        <p className="text-gray-600 mb-4">
          Please upload a file first to proceed with field mapping.
        </p>
        <Button variant="primary" onClick={onPrevious}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-amaranth-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TableIcon size={32} className="text-amaranth-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Map Your Fields
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Map the columns from your file to the corresponding fields in PeerChamps.
        </p>
      </div>

      {/* Mapping Status */}
      <Card>
        <CardHeader>
          <CardTitle>Mapping Progress</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amaranth-600">
                {mappingStatus.mappedColumns}
              </div>
              <div className="text-sm text-gray-600">Mapped Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mappingStatus.totalColumns}
              </div>
              <div className="text-sm text-gray-600">Total Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mappingStatus.mappedRequiredFields}
              </div>
              <div className="text-sm text-gray-600">Required Fields</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mappingStatus.requiredFields}
              </div>
              <div className="text-sm text-gray-600">Total Required</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Field Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Column Mappings</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {fileData.headers.map((header, index) => (
              <div key={header} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{header}</div>
                  <div className="text-sm text-gray-600">
                    Sample: {fileData.sampleRows[0]?.[index] || 'N/A'}
                  </div>
                </div>
                
                <ArrowRightIcon size={20} className="text-gray-400" />
                
                <div className="flex-1">
                  <Select
                    value={fieldMappings[header] || ''}
                    onChange={(value) => handleFieldMapping(header, value)}
                    options={[
                      { value: '', label: 'Select a field...' },
                      ...getAvailableOptions(header),
                    ]}
                    placeholder="Select a field..."
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Preview</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {fileData.headers.map((header, index) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                      {fieldMappings[header] && (
                        <div className="text-xs text-amaranth-600 mt-1">
                          → {AVAILABLE_FIELDS.find(f => f.value === fieldMappings[header])?.label}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fileData.sampleRows.slice(0, 3).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing first 3 rows of {fileData.totalRows} total rows
          </p>
        </CardBody>
      </Card>

      {/* General Error */}
      {errors.general && (
        <Alert variant="error">
          {errors.general}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip for now
          </Button>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !mappingStatus.isComplete}
          className="flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : isLastStep ? 'Complete Import' : 'Continue'}
          {mappingStatus.isComplete && <CheckCircleIcon size={16} />}
        </Button>
      </div>
    </div>
  );
};
