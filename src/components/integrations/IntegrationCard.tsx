/**
 * Integration Card Component
 * 
 * Individual card component for displaying integration information
 * and connection status.
 */

'use client';

import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error' | 'connecting';
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    features: string[];
    lastSync?: string;
    error?: string;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  isLoading,
}) => {
  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircleIcon size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircleIcon size={20} className="text-red-600" />;
      case 'connecting':
        return <ClockIcon size={20} className="text-amber-600" />;
      default:
        return <XCircleIcon size={20} className="text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (integration.status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Not Connected';
    }
  };

  const getStatusColor = () => {
    switch (integration.status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'connecting':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (lastSync: string) => {
    const date = new Date(lastSync);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const isConnected = integration.status === 'connected';
  const isConnecting = integration.status === 'connecting';
  const hasError = integration.status === 'error';

  return (
    <Card className={cn(
      'hover:shadow-md transition-shadow',
      isConnected && 'border-green-200',
      hasError && 'border-red-200'
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', integration.bgColor)}>
              <div className={integration.color}>
                {integration.icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon()}
                <Badge variant="secondary" className={getStatusColor()}>
                  {getStatusText()}
                </Badge>
              </div>
            </div>
          </div>
          
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDisconnect}
              disabled={isLoading}
            >
              <SettingsIcon size={16} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <p className="text-sm text-gray-600 mb-4">
          {integration.description}
        </p>

        {/* Last Sync Info */}
        {isConnected && integration.lastSync && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircleIcon size={14} />
              <span>Last synced {formatLastSync(integration.lastSync)}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {hasError && integration.error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircleIcon size={14} />
              <span>{integration.error}</span>
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
          <ul className="space-y-1">
            {integration.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {feature}
              </li>
            ))}
            {integration.features.length > 3 && (
              <li className="text-sm text-gray-500">
                +{integration.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          {isConnected ? (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                disabled={isLoading || isConnecting}
                className="flex-1"
              >
                {isConnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/settings/integrations', '_blank')}
                rightIcon={<ExternalLinkIcon size={14} />}
              >
                Settings
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={onConnect}
              disabled={isLoading || isConnecting}
              className="w-full"
              rightIcon={<ExternalLinkIcon size={16} />}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
