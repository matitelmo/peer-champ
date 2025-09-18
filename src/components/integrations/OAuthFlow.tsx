/**
 * OAuth Flow Component
 * 
 * Modal component for handling OAuth authentication flows
 * for third-party integrations.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { 
  XMarkIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  RefreshIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface OAuthFlowProps {
  integration: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  };
  onComplete: () => void;
  onError: (error: string) => void;
}

export const OAuthFlow: React.FC<OAuthFlowProps> = ({
  integration,
  onComplete,
  onError,
}) => {
  const [step, setStep] = useState<'authorize' | 'connecting' | 'success' | 'error'>('authorize');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    initializeOAuth();
  }, [integration.id]);

  const initializeOAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Get actual OAuth URL from API
      // const response = await fetch(`/api/integrations/${integration.id}/auth-url`);
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OAuth URL
      const mockAuthUrl = `https://${integration.id}.com/oauth/authorize?client_id=mock&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&response_type=code&scope=read`;
      setAuthUrl(mockAuthUrl);
      
    } catch (err) {
      const errorMessage = `Failed to initialize ${integration.name} connection`;
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorize = () => {
    if (authUrl) {
      setStep('connecting');
      // Open OAuth window
      const popup = window.open(
        authUrl,
        'oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Simulate OAuth completion
          setTimeout(() => {
            if (Math.random() > 0.2) { // 80% success rate
              setStep('success');
            } else {
              setStep('error');
              setError('Authorization was cancelled or failed');
            }
          }, 2000);
        }
      }, 1000);
    }
  };

  const handleRetry = () => {
    setStep('authorize');
    setError(null);
    initializeOAuth();
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderAuthorizeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto">
        <div className={integration.color}>
          {integration.icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect {integration.name}
        </h3>
        <p className="text-gray-600">
          {integration.description}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Seamless data synchronization</li>
          <li>• Real-time updates</li>
          <li>• Enhanced workflow automation</li>
          <li>• Secure, encrypted connection</li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={onComplete}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAuthorize}
          disabled={isLoading || !authUrl}
          rightIcon={<ExternalLinkIcon size={16} />}
        >
          {isLoading ? 'Preparing...' : 'Authorize Connection'}
        </Button>
      </div>
    </div>
  );

  const renderConnectingStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connecting to {integration.name}
        </h3>
        <p className="text-gray-600">
          Please complete the authorization in the popup window...
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-amber-800">
          <RefreshIcon size={16} className="animate-spin" />
          <span className="text-sm">Waiting for authorization...</span>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircleIcon size={32} className="text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Successfully Connected!
        </h3>
        <p className="text-gray-600">
          {integration.name} has been connected to your account.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircleIcon size={16} />
          <span className="text-sm">Your data is now syncing automatically</span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleComplete}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <AlertCircleIcon size={32} className="text-red-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Failed
        </h3>
        <p className="text-gray-600">
          We couldn't connect to {integration.name}. Please try again.
        </p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={onComplete}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleRetry}
          rightIcon={<RefreshIcon size={16} />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 'authorize':
        return renderAuthorizeStep();
      case 'connecting':
        return renderConnectingStep();
      case 'success':
        return renderSuccessStep();
      case 'error':
        return renderErrorStep();
      default:
        return renderAuthorizeStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {step === 'authorize' && 'Connect Integration'}
              {step === 'connecting' && 'Connecting...'}
              {step === 'success' && 'Connection Successful'}
              {step === 'error' && 'Connection Failed'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
              className="p-1"
            >
              <XMarkIcon size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {renderStep()}
        </CardBody>
      </Card>
    </div>
  );
};
