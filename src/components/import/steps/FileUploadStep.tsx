/**
 * File Upload Step Component
 * 
 * Step for uploading CSV or Excel files with drag-and-drop support.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { 
  UploadIcon,
  FileIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XMarkIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface FileUploadStepProps {
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

interface ParsedData {
  headers: string[];
  rows: any[][];
  file: File;
}

export const FileUploadStep: React.FC<FileUploadStepProps> = ({
  onNext,
  isLoading,
  setImportData,
  importType,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = async (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
              return;
            }
            
            const headers = Object.keys(results.data[0] || {});
            const rows = results.data.map((row: any) => 
              headers.map(header => row[header] || '')
            );
            
            resolve({ headers, rows, file });
          },
          error: (error) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          }
        });
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) {
              reject(new Error('Excel file is empty'));
              return;
            }
            
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];
            
            resolve({ headers, rows, file });
          } catch (error) {
            reject(new Error(`Excel parsing error: ${error}`));
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read Excel file'));
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file format. Please upload a CSV or Excel file.'));
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setIsParsing(true);

    try {
      const data = await parseFile(file);
      setUploadedFile(file);
      setParsedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleContinue = () => {
    if (parsedData) {
      setImportData(parsedData);
      onNext(parsedData);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setParsedData(null);
    setError(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['csv'].includes(extension || '')) {
      return <FileIcon size={20} className="text-green-600" />;
    } else if (['xlsx', 'xls'].includes(extension || '')) {
      return <FileIcon size={20} className="text-blue-600" />;
    }
    return <FileIcon size={20} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadIcon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Your {importType.charAt(0).toUpperCase() + importType.slice(1)} Data
        </h3>
        <p className="text-gray-600">
          Select a CSV or Excel file containing your {importType} information.
        </p>
      </div>

      {/* File Upload Area */}
      {!uploadedFile && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive 
              ? 'border-amaranth-500 bg-amaranth-50' 
              : 'border-gray-300 hover:border-amaranth-400 hover:bg-gray-50'
          )}
        >
          <input {...getInputProps()} />
          <UploadIcon size={48} className="mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-amaranth-600 font-medium">
              Drop your file here...
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports CSV, XLS, and XLSX files up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* File Preview */}
      {uploadedFile && parsedData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              {getFileIcon(uploadedFile.name)}
              <div>
                <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatFileSize(uploadedFile.size)} • {parsedData.rows.length} records
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isLoading}
            >
              <XMarkIcon size={16} />
            </Button>
          </div>

          {/* Data Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {parsedData.headers.slice(0, 5).map((header, index) => (
                      <th key={index} className="text-left py-2 px-3 font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                    {parsedData.headers.length > 5 && (
                      <th className="text-left py-2 px-3 font-medium text-gray-500">
                        +{parsedData.headers.length - 5} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.rows.slice(0, 3).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100">
                      {row.slice(0, 5).map((cell, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-3 text-gray-600">
                          {String(cell).substring(0, 50)}
                          {String(cell).length > 50 && '...'}
                        </td>
                      ))}
                      {row.length > 5 && (
                        <td className="py-2 px-3 text-gray-400">
                          ...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.rows.length > 3 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing first 3 rows of {parsedData.rows.length} total records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="error">
          <AlertCircleIcon size={20} className="mr-2" />
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isParsing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-amaranth-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-amaranth-600 border-t-transparent"></div>
            Parsing file...
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div></div>
        
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!parsedData || isLoading || isParsing}
          rightIcon={<CheckCircleIcon size={16} />}
        >
          Continue to Field Mapping
        </Button>
      </div>
    </div>
  );
};
