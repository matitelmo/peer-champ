/**
 * Loading and Error State Components Demo
 *
 * A comprehensive demo showcasing all loading and error state components with various configurations.
 * This component demonstrates the usage and capabilities of the loading and error state system.
 */

'use client';

import React, { useState } from 'react';
import {
  Spinner,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  LoadingOverlay,
  FullScreenLoadingOverlay,
  ContainerLoadingOverlay,
  EmptyState,
  DefaultIllustrations,
  ErrorState,
  InlineErrorState,
  FullScreenErrorState,
  LoadingButton,
  LoadingInput,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardDescription,
  Section,
  Container,
} from './ui';

const LoadingErrorDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);
  const [showFullScreenError, setShowFullScreenError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputLoading, setInputLoading] = useState(false);

  const handleRetry = () => {
    console.log('Retry action triggered');
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleInputSearch = () => {
    setInputLoading(true);
    setTimeout(() => setInputLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Full Screen Loading Overlay */}
      {showFullScreenLoading && (
        <FullScreenLoadingOverlay
          message="Loading application..."
          onDismiss={() => setShowFullScreenLoading(false)}
          dismissible
        />
      )}

      {/* Full Screen Error State */}
      {showFullScreenError && (
        <FullScreenErrorState
          title="Application Error"
          description="Something went wrong with the application. Please try again."
          onRetry={handleRetry}
          onDismiss={() => setShowFullScreenError(false)}
          dismissible
        />
      )}

      {/* Page Header */}
      <Section
        title="Loading & Error State Components"
        description="Comprehensive showcase of all loading and error state components with various configurations and use cases."
      />

      {/* Spinner Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Spinner Components</CardTitle>
            <CardDescription>
              Different spinner sizes and variants for loading states.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Sizes:</h4>
              <div className="flex items-center space-x-4">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Variants:</h4>
              <div className="flex items-center space-x-4">
                <Spinner variant="default" />
                <Spinner variant="secondary" />
                <Spinner variant="success" />
                <Spinner variant="warning" />
                <Spinner variant="error" />
                <Spinner variant="white" className="bg-gray-800 p-2 rounded" />
                <Spinner variant="gray" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">With Labels:</h4>
              <div className="flex items-center space-x-4">
                <Spinner label="Loading data..." />
                <Spinner label="Processing..." size="lg" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Skeleton Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Loading Components</CardTitle>
            <CardDescription>
              Skeleton placeholders for various content types while loading.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Text Skeletons:</h4>
              <div className="space-y-3">
                <SkeletonText lines={1} />
                <SkeletonText lines={3} />
                <SkeletonText lines={2} lastLineWidth="60%" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Avatar Skeletons:</h4>
              <div className="flex items-center space-x-4">
                <SkeletonAvatar size="sm" />
                <SkeletonAvatar size="md" />
                <SkeletonAvatar size="lg" />
                <SkeletonAvatar size="xl" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Button Skeletons:</h4>
              <div className="flex items-center space-x-4">
                <SkeletonButton size="sm" width="60px" />
                <SkeletonButton size="md" width="100px" />
                <SkeletonButton size="lg" width="120px" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Card Skeleton:</h4>
              <SkeletonCard showAvatar showActions />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Table Skeleton:</h4>
              <SkeletonTable rows={4} columns={3} />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">List Skeleton:</h4>
              <SkeletonList items={4} showAvatar />
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Loading Overlay Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Loading Overlay Components</CardTitle>
            <CardDescription>
              Overlay components for blocking interactions during loading
              states.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Container Loading Overlay:</h4>
              <div className="relative h-32 border rounded-lg">
                <ContainerLoadingOverlay
                  message="Loading content..."
                  visible={loading}
                />
                <div className="p-4">
                  <p>This content is being loaded...</p>
                </div>
              </div>
              <Button onClick={handleLoadingDemo} disabled={loading}>
                {loading ? 'Loading...' : 'Start Loading Demo'}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Full Screen Loading Overlay:</h4>
              <Button onClick={() => setShowFullScreenLoading(true)}>
                Show Full Screen Loading
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Loading Overlay Variants:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-24 border rounded-lg">
                  <LoadingOverlay
                    message="Default overlay"
                    variant="default"
                    visible
                  />
                </div>
                <div className="relative h-24 border rounded-lg">
                  <LoadingOverlay
                    message="Blur overlay"
                    variant="blur"
                    visible
                  />
                </div>
                <div className="relative h-24 border rounded-lg">
                  <LoadingOverlay
                    message="Transparent overlay"
                    variant="transparent"
                    visible
                  />
                </div>
                <div className="relative h-24 border rounded-lg">
                  <LoadingOverlay
                    message="Solid overlay"
                    variant="solid"
                    visible
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Empty State Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Empty State Components</CardTitle>
            <CardDescription>
              Components for displaying empty states with illustrations and
              actions.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmptyState
                title="No Results Found"
                description="Try adjusting your search criteria or filters."
                illustration={DefaultIllustrations.search}
                action={{
                  label: 'Clear Filters',
                  onClick: () => console.log('Clear filters'),
                }}
                secondaryAction={{
                  label: 'Search Again',
                  onClick: () => console.log('Search again'),
                }}
              />

              <EmptyState
                title="No Messages Yet"
                description="Start a conversation by sending your first message."
                illustration={DefaultIllustrations.inbox}
                action={{
                  label: 'Compose Message',
                  onClick: () => console.log('Compose message'),
                }}
              />

              <EmptyState
                title="No Users Found"
                description="There are no users in this organization yet."
                illustration={DefaultIllustrations.users}
                action={{
                  label: 'Invite Users',
                  onClick: () => console.log('Invite users'),
                }}
              />

              <EmptyState
                title="No Data Available"
                description="There's no data to display in this chart."
                illustration={DefaultIllustrations.chart}
                action={{
                  label: 'Add Data',
                  onClick: () => console.log('Add data'),
                }}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Different Sizes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EmptyState
                  size="sm"
                  title="Small Empty State"
                  description="Compact version for smaller areas."
                  illustration={DefaultIllustrations.folder}
                />
                <EmptyState
                  size="md"
                  title="Medium Empty State"
                  description="Standard size for most use cases."
                  illustration={DefaultIllustrations.settings}
                />
                <EmptyState
                  size="lg"
                  title="Large Empty State"
                  description="Larger version for prominent empty states."
                  illustration={DefaultIllustrations.inbox}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Error State Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Error State Components</CardTitle>
            <CardDescription>
              Components for displaying error states with retry functionality.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Standard Error State:</h4>
              <ErrorState
                title="Failed to Load Data"
                description="We couldn't load the requested data. Please try again."
                onRetry={handleRetry}
                errorCode="ERR_001"
                details="Network timeout after 30 seconds. Server may be experiencing high load."
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Inline Error State:</h4>
              <InlineErrorState
                title="Form Error"
                description="Please check your input and try again."
                onRetry={handleRetry}
                iconSize="sm"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Full Screen Error State:</h4>
              <Button onClick={() => setShowFullScreenError(true)}>
                Show Full Screen Error
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Error State Variants:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ErrorState
                  variant="default"
                  title="Default Error"
                  description="Standard error state styling."
                  onRetry={handleRetry}
                />
                <ErrorState
                  variant="warning"
                  title="Warning State"
                  description="Warning-level error state."
                  onRetry={handleRetry}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Loading Button and Input Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Loading Button & Input Components</CardTitle>
            <CardDescription>
              Interactive components with built-in loading states.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Loading Buttons:</h4>
              <div className="flex flex-wrap gap-4">
                <LoadingButton loading={loading}>Loading Button</LoadingButton>
                <LoadingButton
                  loading={loading}
                  loadingText="Saving..."
                  variant="outline"
                >
                  Save Changes
                </LoadingButton>
                <LoadingButton loading={loading} variant="secondary" size="sm">
                  Small Loading
                </LoadingButton>
                <LoadingButton
                  loading={loading}
                  variant="destructive"
                  size="lg"
                >
                  Delete Item
                </LoadingButton>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Loading Inputs:</h4>
              <div className="space-y-4 max-w-md">
                <LoadingInput
                  placeholder="Search users..."
                  loading={inputLoading}
                  spinnerPosition="right"
                />
                <LoadingInput
                  placeholder="Loading on the left..."
                  loading={inputLoading}
                  spinnerPosition="left"
                />
                <div className="flex gap-2">
                  <LoadingInput
                    placeholder="Enter value..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    loading={inputLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleInputSearch} disabled={inputLoading}>
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Usage Examples */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Common use cases and implementation patterns for loading and error
              state components.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Form Loading State:</h4>
              <div className="p-4 border rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <LoadingInput
                  placeholder="Enter your email..."
                  loading={inputLoading}
                />
                <div className="mt-3">
                  <LoadingButton
                    loading={inputLoading}
                    loadingText="Submitting..."
                    className="w-full"
                  >
                    Submit Form
                  </LoadingButton>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Data Loading with Skeleton:</h4>
              <div className="p-4 border rounded-lg">
                <SkeletonCard showAvatar showActions />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Error Recovery Flow:</h4>
              <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                <InlineErrorState
                  title="Connection Lost"
                  description="Unable to connect to the server."
                  onRetry={handleRetry}
                  retryLabel="Reconnect"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default LoadingErrorDemo;
