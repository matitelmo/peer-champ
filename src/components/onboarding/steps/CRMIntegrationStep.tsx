/**
 * CRM Integration Step Component
 * 
 * Seventh step of the onboarding flow - optional CRM integration setup
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { LinkIcon, CheckIcon, ExternalLinkIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface CRMIntegrationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

const CRM_PROVIDERS = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect with your Salesforce CRM to sync opportunities and contacts',
    logo: '🔵',
    features: ['Opportunity sync', 'Contact management', 'Activity tracking'],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Integrate with HubSpot for seamless deal and contact synchronization',
    logo: '🟠',
    features: ['Deal tracking', 'Contact sync', 'Pipeline management'],
  },
];

export const CRMIntegrationStep: React.FC<CRMIntegrationStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  isOptional = true,
}) => {
  const { updateData, setIsLoading, setError } = useOnboarding();
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleConnect = async (providerId: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      setIsLoading(true);

      // Simulate OAuth connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const integrationData = {
        provider: providerId,
        connected: true,
        connected_at: new Date().toISOString(),
        settings: {
          sync_opportunities: true,
          sync_contacts: true,
          auto_create_calls: false,
        },
      };

      updateData({ crm_integration: integrationData });
      onComplete(integrationData);
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect CRM';
      setError(errorMessage);
      console.error('Error connecting CRM:', err);
    } finally {
      setIsConnecting(false);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete({ crm_integration: { connected: false } });
    onSkip();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <LinkIcon size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connect your CRM
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Integrate with your CRM to sync opportunities and streamline your workflow
        </p>
      </div>

      {/* CRM Providers */}
      <div className="space-y-4 mb-6">
        {CRM_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-6 cursor-pointer transition-colors ${
              selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleProviderSelect(provider.id)}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{provider.logo}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {provider.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {provider.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={selectedProvider === provider.id}
                  onChange={() => handleProviderSelect(provider.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
          Benefits of CRM Integration
        </h3>
        <ul className="space-y-2 text-green-700 dark:text-green-300">
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Automatically sync opportunities from your CRM</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Track reference call outcomes back to your CRM</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Eliminate manual data entry and reduce errors</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">Get better visibility into your reference program ROI</span>
          </li>
        </ul>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Security:</strong> We use OAuth 2.0 for secure authentication. 
          We only request the minimum permissions needed and never store your CRM credentials.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Previous
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip for Now
        </Button>
        
        <Button
          type="button"
          onClick={() => selectedProvider && handleConnect(selectedProvider)}
          disabled={!selectedProvider || isConnecting}
          className="flex-1"
        >
          {isConnecting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLinkIcon size={16} className="mr-2" />
              Connect {selectedProvider ? CRM_PROVIDERS.find(p => p.id === selectedProvider)?.name : 'CRM'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
