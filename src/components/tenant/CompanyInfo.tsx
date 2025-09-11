/**
 * Company Info Component
 *
 * Displays company information and settings for the current tenant.
 * Shows company details, subscription information, and settings.
 */

'use client';

import React from 'react';
import { useTenant } from '@/hooks/useTenant';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

interface CompanyInfoProps {
  className?: string;
  showActions?: boolean;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({
  className = '',
  showActions = true,
}) => {
  const { company, loading, error, isAdmin } = useTenant();

  if (loading) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardBody>
          <Alert variant="error">{error}</Alert>
        </CardBody>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Company Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You are not associated with any company.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const getSubscriptionBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'success';
      case 'professional':
        return 'default';
      case 'starter':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSubscriptionBadgeText = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'Enterprise';
      case 'professional':
        return 'Professional';
      case 'starter':
        return 'Starter';
      default:
        return tier;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {company.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{company.domain}</p>
          </div>
          <Badge
            variant={getSubscriptionBadgeVariant(company.subscription_tier)}
          >
            {getSubscriptionBadgeText(company.subscription_tier)}
          </Badge>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company ID
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-mono">
              {company.id}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subscription Tier
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {getSubscriptionBadgeText(company.subscription_tier)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Created
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Updated
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(company.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Company Settings */}
        {company.settings && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Company Settings
            </h3>
            <div className="space-y-3">
              {/* Branding */}
              {company.settings.branding as any &&  (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Branding
                  </h4>
                  <div className="space-y-2">
                    {(company.settings.branding as any).logo_url && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Logo:
                        </span>
                        <img
                          src={(company.settings.branding as any).logo_url}
                          alt="Company logo"
                          className="h-6 w-6 rounded"
                        />
                      </div>
                    )}
                    {(company.settings.branding as any).primary_color && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Primary Color:
                        </span>
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            backgroundColor:
                              (company.settings.branding as any).primary_color,
                          }}
                        />
                        <span className="text-xs text-gray-900 dark:text-white">
                          {(company.settings.branding as any).primary_color}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {company.settings.features && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Features
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(company.settings.features).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <Badge
                            variant={value ? 'success' : 'secondary'}
                            size="sm"
                          >
                            {value ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && isAdmin && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Edit Company
            </Button>
            <Button variant="outline" size="sm">
              View Billing
            </Button>
            <Button variant="outline" size="sm">
              Company Settings
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CompanyInfo;
