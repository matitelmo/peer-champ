/**
 * Integration Configuration Component
 * 
 * Main component for configuring third-party integrations like CRM,
 * calendar, and other services with OAuth flows.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  CogIcon,
  ExternalLinkIcon,
  RefreshIcon,
} from '@/components/ui/icons';
import { IntegrationCard } from './IntegrationCard';
import { OAuthFlow } from './OAuthFlow';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface IntegrationConfigurationProps {
  className?: string;
  onIntegrationComplete?: (integration: Integration) => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'calendar' | 'communication' | 'analytics';
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  features: string[];
  setupUrl?: string;
  disconnectUrl?: string;
  lastSync?: string;
  error?: string;
}

const availableIntegrations: Integration[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect your Salesforce CRM for seamless opportunity and contact sync',
    category: 'crm',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      'Sync opportunities and contacts',
      'Automatic activity logging',
      'Real-time data updates',
      'Custom field mapping',
    ],
    setupUrl: '/api/integrations/salesforce/connect',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Integrate with HubSpot CRM for comprehensive sales pipeline management',
    category: 'crm',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    features: [
      'Deal and contact synchronization',
      'Automated follow-up sequences',
      'Lead scoring integration',
      'Custom property mapping',
    ],
    setupUrl: '/api/integrations/hubspot/connect',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync your Google Calendar for seamless meeting scheduling',
    category: 'calendar',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    features: [
      'Real-time availability sync',
      'Automatic meeting creation',
      'Conflict detection',
      'Multi-calendar support',
    ],
    setupUrl: '/api/integrations/google-calendar/connect',
  },
  {
    id: 'outlook_calendar',
    name: 'Outlook Calendar',
    description: 'Connect Microsoft Outlook for integrated calendar management',
    category: 'calendar',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      'Exchange calendar sync',
      'Meeting room booking',
      'Outlook add-in support',
      'Team calendar sharing',
    ],
    setupUrl: '/api/integrations/outlook/connect',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified about reference calls and updates in Slack',
    category: 'communication',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      'Reference call notifications',
      'Team collaboration',
      'Custom channel integration',
      'Bot commands support',
    ],
    setupUrl: '/api/integrations/slack/connect',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Automatically create Zoom meetings for reference calls',
    category: 'communication',
    status: 'disconnected',
    icon: <CogIcon size={24} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      'Automatic meeting creation',
      'Recording management',
      'Waiting room configuration',
      'Meeting analytics',
    ],
    setupUrl: '/api/integrations/zoom/connect',
  },
];

export const IntegrationConfiguration: React.FC<IntegrationConfigurationProps> = ({
  className = '',
  onIntegrationComplete,
}) => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load integration statuses on mount
  useEffect(() => {
    loadIntegrationStatuses();
  }, []);

  const loadIntegrationStatuses = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch actual integration statuses from API
      // const response = await fetch('/api/integrations/status');
      // const statuses = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock some connected integrations
      setIntegrations(prev => prev.map(integration => ({
        ...integration,
        status: Math.random() > 0.7 ? 'connected' : 'disconnected',
        lastSync: Math.random() > 0.7 ? new Date().toISOString() : undefined,
      })));
    } catch (err) {
      setError('Failed to load integration statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (integration: Integration) => {
    try {
      setError(null);
      setSelectedIntegration(integration);
      
      // Update integration status to connecting
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'connecting' as const }
          : int
      ));

      // TODO: Implement actual OAuth flow
      // For now, simulate the connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { 
              ...int, 
              status: 'connected' as const,
              lastSync: new Date().toISOString(),
            }
          : int
      ));

      onIntegrationComplete?.(integration);
      setSelectedIntegration(null);
      
    } catch (err) {
      setError(`Failed to connect ${integration.name}`);
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'error' as const, error: err instanceof Error ? err.message : 'Connection failed' }
          : int
      ));
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    try {
      setError(null);
      
      // Update integration status to disconnecting
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'connecting' as const }
          : int
      ));

      // TODO: Implement actual disconnect API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update integration status to disconnected
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { 
              ...int, 
              status: 'disconnected' as const,
              lastSync: undefined,
              error: undefined,
            }
          : int
      ));
      
    } catch (err) {
      setError(`Failed to disconnect ${integration.name}`);
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'error' as const, error: err instanceof Error ? err.message : 'Disconnect failed' }
          : int
      ));
    }
  };

  const handleRefresh = () => {
    loadIntegrationStatuses();
  };

  const getCategoryIntegrations = (category: string) => {
    return integrations.filter(integration => integration.category === category);
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      crm: 'CRM Integrations',
      calendar: 'Calendar Integrations',
      communication: 'Communication Tools',
      analytics: 'Analytics & Reporting',
    };
    return titles[category] || category;
  };

  const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      crm: 'Connect your CRM to sync opportunities, contacts, and activities',
      calendar: 'Link your calendar for seamless meeting scheduling',
      communication: 'Integrate communication tools for better collaboration',
      analytics: 'Connect analytics platforms for advanced reporting',
    };
    return descriptions[category] || '';
  };

  const categories = ['crm', 'calendar', 'communication', 'analytics'];

  if (isLoading && integrations.every(int => int.status === 'disconnected')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Integration Settings
            </h1>
            <p className="text-gray-600">
              Connect your favorite tools to streamline your workflow
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            leftIcon={<RefreshIcon size={16} />}
          >
            Refresh Status
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryIntegrations = getCategoryIntegrations(category);
          if (categoryIntegrations.length === 0) return null;

          return (
            <div key={category}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {getCategoryTitle(category)}
                </h2>
                <p className="text-sm text-gray-600">
                  {getCategoryDescription(category)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleConnect(integration)}
                    onDisconnect={() => handleDisconnect(integration)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* OAuth Flow Modal */}
      {selectedIntegration && (
        <OAuthFlow
          integration={selectedIntegration}
          onComplete={() => setSelectedIntegration(null)}
          onError={(error) => {
            setError(error);
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
};
