/**
 * Company Switcher Component
 * 
 * Allows admin users to switch between different companies for management purposes.
 * Provides a dropdown interface for company selection.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { companyService } from '@/lib/database';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import type { Company } from '@/types/database';

interface CompanySwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({
  className = '',
  showLabel = true,
  size = 'md',
}) => {
  const { company, isAdmin, switchCompany } = useTenant();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  // Fetch all companies (admin only)
  const fetchCompanies = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await companyService.getAll();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCompanies(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies on mount
  useEffect(() => {
    if (isAdmin) {
      fetchCompanies();
    }
  }, [isAdmin]);

  // Handle company switch
  const handleCompanyChange = async (companyId: string) => {
    if (!isAdmin || !companyId) return;

    try {
      setSwitching(true);
      setError(null);

      const { success, error: switchError } = await switchCompany(companyId);

      if (!success) {
        setError(switchError || 'Failed to switch company');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch company');
    } finally {
      setSwitching(false);
    }
  };

  // Don't render for non-admin users
  if (!isAdmin) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Company:
          </span>
        )}
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company
        </label>
      )}
      
      <div className="flex items-center space-x-2">
        <Select
          value={company?.id || ''}
          onChange={(e) => handleCompanyChange(e.target.value)}
          disabled={switching || companies.length === 0}
          className="flex-1"
          size={size}
        >
          <option value="">Select a company...</option>
          {companies.map((comp) => (
            <option key={comp.id} value={comp.id}>
              {comp.name}
            </option>
          ))}
        </Select>
        
        {switching && (
          <Spinner size="sm" />
        )}
      </div>

      {error && (
        <Alert variant="error" className="text-sm">
          {error}
        </Alert>
      )}

      {companies.length === 0 && !loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No companies available
        </p>
      )}
    </div>
  );
};

export default CompanySwitcher;
