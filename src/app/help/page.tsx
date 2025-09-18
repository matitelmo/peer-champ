/**
 * Help Center Page
 * 
 * Central hub for tutorials, documentation, and support resources.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayoutWithNav } from '@/components/layouts/DashboardLayoutWithNav';
import { TutorialManager } from '@/components/tutorials/TutorialManager';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { 
  BookOpenIcon,
  VideoIcon,
  MessageCircleIcon,
  FileTextIcon,
  SearchIcon,
  ExternalLinkIcon,
} from '@/components/ui/icons';

export default function HelpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (!loading && user) {
      setShowContent(true);
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleTutorialComplete = (tutorialId: string) => {
    console.log('Tutorial completed:', tutorialId);
    // Could show a success message or update UI
  };

  return (
    <DashboardLayoutWithNav
      title="Help Center"
      subtitle="Get help, learn features, and find support resources"
    >
      {showContent && (
        <div className="space-y-8">
          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpenIcon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Documentation</h3>
                <p className="text-sm text-gray-600">Comprehensive guides and API docs</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <VideoIcon size={24} className="text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Step-by-step video guides</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircleIcon size={24} className="text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600">Get instant help from our team</p>
              </CardBody>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileTextIcon size={24} className="text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Knowledge Base</h3>
                <p className="text-sm text-gray-600">Search our help articles</p>
              </CardBody>
            </Card>
          </div>

          {/* Search Bar */}
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <SearchIcon size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search help articles, tutorials, and documentation..."
                  className="flex-1 border-none outline-none text-gray-900 placeholder-gray-500"
                />
                <Button variant="outline" size="sm">
                  Search
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Feature Tutorials */}
          <TutorialManager onTutorialComplete={handleTutorialComplete} />

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon size={20} />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Quick Start Guide
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Setting Up Your First Advocate
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Creating Your First Opportunity
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Scheduling Your First Reference Call
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleIcon size={20} />
                  Support
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Contact Support
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Submit a Feature Request
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Report a Bug
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" rightIcon={<ExternalLinkIcon size={16} />}>
                    Schedule a Demo
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayoutWithNav>
  );
}
