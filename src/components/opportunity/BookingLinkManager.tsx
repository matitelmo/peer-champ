/**
 * Booking Link Manager Component
 *
 * Allows sales reps to generate, manage, and track booking links for opportunities.
 * Provides link generation, sharing, and analytics functionality.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Opportunity } from '@/types/database';
import { generateMagicLink } from '@/lib/services/bookingLinkService';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Input,
  Badge,
  Alert,
  Spinner,
  Modal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import {
  // LinkIcon, // TODO: Add this icon
  CopyIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  BarChartIcon,
} from '@/components/ui/icons';

interface BookingLinkManagerProps {
  opportunity: Opportunity;
  className?: string;
}

interface BookingLink {
  id: string;
  token: string;
  url: string;
  advocateId: string;
  advocateName: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  prospectEmail?: string;
  status: 'active' | 'used' | 'expired';
}

export const BookingLinkManager: React.FC<BookingLinkManagerProps> = ({
  opportunity,
  className = '',
}) => {
  const [links, setLinks] = useState<BookingLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedAdvocateId, setSelectedAdvocateId] = useState<string>('');
  const [prospectEmail, setProspectEmail] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Mock data for demonstration - in real app, this would come from API
  const [mockAdvocates] = useState([
    { id: '1', name: 'Sarah Johnson', company: 'TechCorp', industry: 'Technology' },
    { id: '2', name: 'Mike Chen', company: 'DataFlow', industry: 'Analytics' },
    { id: '3', name: 'Emily Rodriguez', company: 'CloudSoft', industry: 'SaaS' },
  ]);

  // Mock existing links - in real app, this would come from API
  useEffect(() => {
    setLinks([
      {
        id: '1',
        token: 'abc123def456',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/abc123def456`,
        advocateId: '1',
        advocateName: 'Sarah Johnson',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: '2',
        token: 'xyz789uvw012',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/xyz789uvw012`,
        advocateId: '2',
        advocateName: 'Mike Chen',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        usedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        prospectEmail: 'prospect@example.com',
        status: 'used',
      },
    ]);
  }, []);

  const handleGenerateLink = async () => {
    if (!selectedAdvocateId) {
      setError('Please select an advocate');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate magic link
      const linkUrl = await generateMagicLink(
        opportunity.id,
        selectedAdvocateId,
        prospectEmail || undefined
      );

      // Extract token from URL
      const token = linkUrl.split('/booking/')[1];
      const advocate = mockAdvocates.find(a => a.id === selectedAdvocateId);

      // Add to links list
      const newLink: BookingLink = {
        id: Date.now().toString(),
        token,
        url: linkUrl,
        advocateId: selectedAdvocateId,
        advocateName: advocate?.name || 'Unknown Advocate',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours
        prospectEmail: prospectEmail || undefined,
        status: 'active',
      };

      setLinks(prev => [newLink, ...prev]);
      setShowGenerateModal(false);
      setSelectedAdvocateId('');
      setProspectEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate booking link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Reference Call Booking',
        text: `Schedule a reference call for ${opportunity.prospect_company}`,
        url: url,
      });
    } else {
      handleCopyLink(url);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'used':
        return <Badge variant="default">Used</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeLinks = links.filter(link => link.status === 'active');
  const usedLinks = links.filter(link => link.status === 'used');
  const expiredLinks = links.filter(link => link.status === 'expired');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Booking Links
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate and manage booking links for {opportunity.prospect_company}
          </p>
        </div>
        <Button
          onClick={() => setShowGenerateModal(true)}
          leftIcon={<LinkIcon size={16} />}
        >
          Generate Link
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="error">
          <ExclamationTriangleIcon size={16} />
          {error}
        </Alert>
      )}

      {/* Links Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeLinks.length})
          </TabsTrigger>
          <TabsTrigger value="used">
            Used ({usedLinks.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredLinks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeLinks.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <LinkIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Active Links
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Generate a booking link to get started
                </p>
                <Button onClick={() => setShowGenerateModal(true)}>
                  Generate First Link
                </Button>
              </CardBody>
            </Card>
          ) : (
            activeLinks.map((link) => (
              <Card key={link.id}>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {link.advocateName}
                        </h4>
                        {getStatusBadge(link.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon size={14} />
                          <span>Created: {formatDate(link.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ExclamationTriangleIcon size={14} />
                          <span>Expires: {formatDate(link.expiresAt)}</span>
                        </div>
                        {link.prospectEmail && (
                          <div className="flex items-center space-x-2">
                            <span>For: {link.prospectEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                        leftIcon={copiedLink === link.url ? <CheckCircleIcon size={14} /> : <CopyIcon size={14} />}
                      >
                        {copiedLink === link.url ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareLink(link.url)}
                        leftIcon={<ShareIcon size={14} />}
                      >
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        leftIcon={<ExternalLinkIcon size={14} />}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          {usedLinks.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <CheckCircleIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Used Links
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Links that have been used by prospects will appear here
                </p>
              </CardBody>
            </Card>
          ) : (
            usedLinks.map((link) => (
              <Card key={link.id}>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {link.advocateName}
                        </h4>
                        {getStatusBadge(link.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon size={14} />
                          <span>Used: {link.usedAt ? formatDate(link.usedAt) : 'Unknown'}</span>
                        </div>
                        {link.prospectEmail && (
                          <div className="flex items-center space-x-2">
                            <span>By: {link.prospectEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        leftIcon={<EyeIcon size={14} />}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredLinks.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <ExclamationTriangleIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Expired Links
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Expired links will appear here
                </p>
              </CardBody>
            </Card>
          ) : (
            expiredLinks.map((link) => (
              <Card key={link.id}>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {link.advocateName}
                        </h4>
                        {getStatusBadge(link.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon size={14} />
                          <span>Expired: {formatDate(link.expiresAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGenerateModal(true)}
                        leftIcon={<LinkIcon size={14} />}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Generate Link Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Booking Link"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Advocate
            </label>
            <select
              value={selectedAdvocateId}
              onChange={(e) => setSelectedAdvocateId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Choose an advocate...</option>
              {mockAdvocates.map((advocate) => (
                <option key={advocate.id} value={advocate.id}>
                  {advocate.name} - {advocate.company} ({advocate.industry})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prospect Email (Optional)
            </label>
            <Input
              type="email"
              value={prospectEmail}
              onChange={(e) => setProspectEmail(e.target.value)}
              placeholder="prospect@company.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, the link will be pre-configured for this prospect
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateLink}
              disabled={loading || !selectedAdvocateId}
              loading={loading}
            >
              Generate Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
