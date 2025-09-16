/**
 * Manual Meeting Entry Component
 *
 * Enhanced manual meeting link entry with validation, fallback options,
 * and user preference management.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Select, Alert, Badge } from '@/components/ui';
import { 
  LinkIcon, 
  CheckIcon, 
  ExclamationTriangleIcon,
  InfoIcon,
  SettingsIcon,
  ExternalLinkIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ManualMeetingEntryProps {
  onMeetingLinkSet: (link: string, platform: string) => void;
  className?: string;
}

export const ManualMeetingEntry: React.FC<ManualMeetingEntryProps> = ({
  onMeetingLinkSet,
  className = '',
}) => {
  const { user } = useAuth();
  const { validateLink, getPlatform, meetingPreferences, loadPreferences } = useMeetings(user?.id);

  const [manualLink, setManualLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    platform: string;
    suggestions?: string[];
  } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferredPlatform, setPreferredPlatform] = useState('google_meet');

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id, loadPreferences]);

  const validateMeetingLink = async (link: string) => {
    if (!link.trim()) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    setLinkError('');

    try {
      const isValid = validateLink(link);
      const platform = getPlatform(link);

      if (isValid) {
        setValidationResult({
          isValid: true,
          platform,
        });
        setLinkError('');
      } else {
        const suggestions = generateLinkSuggestions(link);
        setValidationResult({
          isValid: false,
          platform: 'unknown',
          suggestions,
        });
        setLinkError('Invalid meeting link format');
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        platform: 'unknown',
      });
      setLinkError('Error validating meeting link');
    } finally {
      setIsValidating(false);
    }
  };

  const generateLinkSuggestions = (link: string): string[] => {
    const suggestions: string[] = [];
    
    if (link.includes('google.com')) {
      suggestions.push('https://meet.google.com/abc-defg-hij');
    } else if (link.includes('zoom.us')) {
      suggestions.push('https://zoom.us/j/123456789?pwd=abc123');
    } else if (link.includes('teams.microsoft.com')) {
      suggestions.push('https://teams.microsoft.com/l/meetup-join/...');
    } else if (link.includes('webex.com')) {
      suggestions.push('https://company.webex.com/meet/username');
    } else {
      suggestions.push('https://meet.google.com/abc-defg-hij');
      suggestions.push('https://zoom.us/j/123456789');
      suggestions.push('https://teams.microsoft.com/l/meetup-join/...');
    }

    return suggestions;
  };

  const handleLinkChange = (value: string) => {
    setManualLink(value);
    
    // Debounced validation
    const timeoutId = setTimeout(() => {
      validateMeetingLink(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = () => {
    if (!manualLink.trim()) {
      setLinkError('Please enter a meeting link');
      return;
    }

    if (!validationResult?.isValid) {
      setLinkError('Please enter a valid meeting link');
      return;
    }

    onMeetingLinkSet(manualLink, validationResult.platform);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setManualLink(suggestion);
    validateMeetingLink(suggestion);
  };

  const handleReset = () => {
    setManualLink('');
    setLinkError('');
    setValidationResult(null);
  };

  const getPlatformDisplayName = (platform: string): string => {
    switch (platform) {
      case 'google_meet': return 'Google Meet';
      case 'zoom': return 'Zoom';
      case 'teams': return 'Microsoft Teams';
      case 'webex': return 'Webex';
      default: return 'Other';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manual Meeting Entry</h3>
          <p className="text-sm text-gray-600">Enter your own meeting link or paste from calendar</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SettingsIcon size={16} className="mr-2" />
          {showAdvanced ? 'Hide' : 'Show'} Options
        </Button>
      </div>

      {/* Link Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon size={20} className="mr-2" />
            Meeting Link
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting URL
            </label>
            <div className="relative">
              <Input
                value={manualLink}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className={cn(
                  validationResult && !validationResult.isValid && 'border-red-300 focus:border-red-500',
                  validationResult?.isValid && 'border-green-300 focus:border-green-500'
                )}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={cn(
              'p-3 rounded-lg border',
              validationResult.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            )}>
              <div className="flex items-center">
                {validationResult.isValid ? (
                  <CheckIcon size={16} className="text-green-600 mr-2" />
                ) : (
                  <ExclamationTriangleIcon size={16} className="text-red-600 mr-2" />
                )}
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    validationResult.isValid ? 'text-green-800' : 'text-red-800'
                  )}>
                    {validationResult.isValid 
                      ? `Valid ${getPlatformDisplayName(validationResult.platform)} link`
                      : 'Invalid meeting link format'
                    }
                  </p>
                  {validationResult.isValid && (
                    <p className="text-xs text-green-600 mt-1">
                      Platform detected: {getPlatformDisplayName(validationResult.platform)}
                    </p>
                  )}
                </div>
                {validationResult.isValid && (
                  <Badge variant="success">Valid</Badge>
                )}
              </div>
            </div>
          )}

          {/* Link Suggestions */}
          {validationResult?.suggestions && validationResult.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Try these formats:</p>
              <div className="space-y-1">
                {validationResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {linkError && (
            <Alert variant="error">
              <ExclamationTriangleIcon size={16} className="mr-2" />
              {linkError}
            </Alert>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleSubmit}
              disabled={!validationResult?.isValid || !manualLink.trim()}
              className="flex-1"
            >
              <CheckIcon size={16} className="mr-2" />
              Use This Link
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              Clear
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Advanced Options */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Options</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Platform for Suggestions
              </label>
              <Select
                value={preferredPlatform}
                onChange={(e) => setPreferredPlatform(e)}
                options={[
                  { value: 'google_meet', label: 'Google Meet' },
                  { value: 'zoom', label: 'Zoom' },
                  { value: 'teams', label: 'Microsoft Teams' },
                  { value: 'webex', label: 'Webex' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <InfoIcon size={16} className="text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tips for meeting links:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Copy the full URL from your calendar invitation</li>
                    <li>Ensure the link includes the meeting ID and password (if required)</li>
                    <li>Test the link before scheduling the call</li>
                    <li>Consider using waiting rooms for security</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Platform Links</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Google Meet', url: 'https://meet.google.com/new', icon: '🎥' },
              { name: 'Zoom', url: 'https://zoom.us/meeting/schedule', icon: '📹' },
              { name: 'Teams', url: 'https://teams.microsoft.com', icon: '👥' },
              { name: 'Webex', url: 'https://webex.com', icon: '🌐' },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl mb-2">{platform.icon}</span>
                <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                <ExternalLinkIcon size={12} className="text-gray-400 mt-1" />
              </a>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
