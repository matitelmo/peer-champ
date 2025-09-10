/**
 * Card Components Demo
 *
 * A comprehensive demo showcasing all card and container components with various configurations.
 * This component demonstrates the usage and capabilities of the card and container system.
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  Container,
  Section,
  Page,
  StatCard,
  ProfileCard,
  FeatureCard,
  AlertCard,
  Button,
  UserIcon,
  ChartBarIcon,
  SettingsIcon,
} from './ui';

const CardComponentsDemo: React.FC = () => {
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const handleCardClick = (cardType: string) => {
    console.log(`${cardType} card clicked`);
  };

  return (
    <Page
      title="Card & Container Components"
      description="Comprehensive showcase of all card and container components"
    >
      <div className="space-y-12">
        {/* Basic Card Examples */}
        <Section
          title="Basic Cards"
          description="Different card variants and configurations"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  A basic card with default styling and padding.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This is the default card variant with standard padding and
                  styling.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>
                  A card with a prominent border.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This card has a thicker border for more emphasis.
                </p>
              </CardBody>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  A card with enhanced shadow for depth.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This card has a stronger shadow to create visual hierarchy.
                </p>
              </CardBody>
            </Card>

            {/* Interactive Card */}
            <Card interactive onClick={() => handleCardClick('Interactive')}>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  Hover and click effects enabled.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This card responds to hover and click interactions.
                </p>
              </CardBody>
            </Card>

            {/* Clickable Card */}
            <Card clickable onClick={() => handleCardClick('Clickable')}>
              <CardHeader>
                <CardTitle>Clickable Card</CardTitle>
                <CardDescription>
                  Focus states and keyboard navigation.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This card is focusable and supports keyboard navigation.
                </p>
              </CardBody>
            </Card>

            {/* Flat Card */}
            <Card variant="flat">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>
                  Minimal styling without shadows.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  This card has no shadow for a flat design approach.
                </p>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* Padding Variants */}
        <Section
          title="Padding Variants"
          description="Different padding options for cards"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              padding="none"
              className="border-2 border-dashed border-secondary-300"
            >
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  No padding
                </p>
              </CardBody>
            </Card>

            <Card padding="sm">
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Small padding
                </p>
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Large padding
                </p>
              </CardBody>
            </Card>

            <Card padding="xl">
              <CardBody>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Extra large padding
                </p>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* Stat Cards */}
        <Section
          title="Stat Cards"
          description="Pre-built cards for displaying statistics"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value="12,345"
              description="Active users this month"
              change={{
                value: '+12%',
                type: 'increase',
                period: 'vs last month',
              }}
              icon={<UserIcon className="h-6 w-6" />}
              onClick={() => handleCardClick('Stat')}
            />

            <StatCard
              title="Revenue"
              value="$45,678"
              description="Monthly recurring revenue"
              change={{
                value: '-3%',
                type: 'decrease',
                period: 'vs last month',
              }}
              icon={<ChartBarIcon className="h-6 w-6" />}
            />

            <StatCard
              title="Conversion Rate"
              value="3.2%"
              description="Overall conversion rate"
              change={{
                value: '0%',
                type: 'neutral',
                period: 'vs last month',
              }}
              icon={<SettingsIcon className="h-6 w-6" />}
            />

            <StatCard
              title="Loading Example"
              value=""
              description=""
              loading={true}
            />
          </div>
        </Section>

        {/* Profile Cards */}
        <Section
          title="Profile Cards"
          description="Cards for displaying user profiles"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfileCard
              name="John Doe"
              title="Senior Developer"
              email="john.doe@example.com"
              status="online"
              info="Last active 2 minutes ago"
              actions={
                <Button size="sm" variant="outline">
                  Message
                </Button>
              }
              onClick={() => handleCardClick('Profile')}
            />

            <ProfileCard
              name="Jane Smith"
              title="Product Manager"
              email="jane.smith@example.com"
              status="away"
              info="In a meeting"
              actions={
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              }
            />

            <ProfileCard
              name="Mike Johnson"
              title="Designer"
              email="mike.johnson@example.com"
              status="offline"
              info="Last seen yesterday"
              actions={
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              }
            />
          </div>
        </Section>

        {/* Feature Cards */}
        <Section
          title="Feature Cards"
          description="Cards for showcasing features or services"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Advanced Analytics"
              description="Get detailed insights into your business performance with our comprehensive analytics dashboard."
              icon={<ChartBarIcon className="h-6 w-6" />}
              status="available"
              benefits={[
                'Real-time data visualization',
                'Custom report generation',
                'Export to multiple formats',
                'Automated insights',
              ]}
              action={
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              }
              onClick={() => handleCardClick('Feature')}
            />

            <FeatureCard
              title="AI-Powered Insights"
              description="Leverage artificial intelligence to discover patterns and opportunities in your data."
              icon={<SettingsIcon className="h-6 w-6" />}
              status="beta"
              benefits={[
                'Machine learning algorithms',
                'Predictive analytics',
                'Natural language queries',
              ]}
              action={
                <Button size="sm" variant="outline" className="w-full">
                  Join Beta
                </Button>
              }
            />

            <FeatureCard
              title="Legacy Integration"
              description="Connect with older systems and databases using our legacy integration tools."
              icon={<UserIcon className="h-6 w-6" />}
              status="deprecated"
              benefits={[
                'Database connectors',
                'API bridges',
                'Data migration tools',
              ]}
              action={
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Deprecated
                </Button>
              }
            />
          </div>
        </Section>

        {/* Alert Cards */}
        <Section
          title="Alert Cards"
          description="Cards for displaying important messages"
        >
          <div className="space-y-4">
            {!dismissedAlert && (
              <AlertCard
                title="System Maintenance"
                message="We will be performing scheduled maintenance on Sunday, 2:00 AM - 4:00 AM EST. Some features may be temporarily unavailable."
                type="info"
                dismissible
                onDismiss={() => setDismissedAlert(true)}
                actions={
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                }
              />
            )}

            <AlertCard
              title="Success!"
              message="Your account has been successfully created. You can now start using all the features."
              type="success"
              actions={
                <Button size="sm" variant="outline">
                  Continue
                </Button>
              }
            />

            <AlertCard
              title="Warning"
              message="Your storage is almost full. Consider upgrading your plan or cleaning up old files."
              type="warning"
              actions={
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Upgrade Plan
                  </Button>
                  <Button size="sm" variant="outline">
                    Clean Up
                  </Button>
                </div>
              }
            />

            <AlertCard
              title="Error"
              message="Failed to save your changes. Please check your connection and try again."
              type="error"
              actions={
                <Button size="sm" variant="outline">
                  Retry
                </Button>
              }
            />
          </div>
        </Section>

        {/* Container Examples */}
        <Section
          title="Container Components"
          description="Different container configurations"
        >
          <div className="space-y-8">
            {/* Basic Container */}
            <Container
              size="lg"
              background="secondary"
              rounded="lg"
              padding="lg"
            >
              <h3 className="text-lg font-semibold mb-2">Basic Container</h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                This is a basic container with secondary background and large
                padding.
              </p>
            </Container>

            {/* Container with Border */}
            <Container size="md" border="primary" rounded="xl" padding="xl">
              <h3 className="text-lg font-semibold mb-2">
                Container with Border
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                This container has a primary border and extra large padding.
              </p>
            </Container>

            {/* Centered Container */}
            <Container
              size="sm"
              center
              background="primary"
              rounded="full"
              padding="lg"
              className="text-center"
            >
              <h3 className="text-lg font-semibold mb-2 text-white">
                Centered Container
              </h3>
              <p className="text-primary-100">
                This container is centered with primary background.
              </p>
            </Container>

            {/* Responsive Container */}
            <Container
              size="full"
              responsive
              background="muted"
              rounded="lg"
              shadow="md"
            >
              <h3 className="text-lg font-semibold mb-2">
                Responsive Container
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                This container has responsive padding that adjusts based on
                screen size.
              </p>
            </Container>
          </div>
        </Section>

        {/* Nested Cards */}
        <Section
          title="Nested Cards"
          description="Cards within cards for complex layouts"
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Dashboard</CardTitle>
              <CardDescription>
                Overview of your current projects and their status.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="outlined" padding="sm">
                  <CardHeader padding="sm">
                    <CardTitle className="text-base">Project Alpha</CardTitle>
                  </CardHeader>
                  <CardBody padding="sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        Progress
                      </span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="outlined" padding="sm">
                  <CardHeader padding="sm">
                    <CardTitle className="text-base">Project Beta</CardTitle>
                  </CardHeader>
                  <CardBody padding="sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        Progress
                      </span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
            <CardFooter justify="between">
              <Button variant="outline" size="sm">
                View All Projects
              </Button>
              <Button size="sm">Create New Project</Button>
            </CardFooter>
          </Card>
        </Section>
      </div>
    </Page>
  );
};

export default CardComponentsDemo;
