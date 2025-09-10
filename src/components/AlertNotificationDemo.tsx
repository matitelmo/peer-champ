/**
 * Alert and Notification Components Demo
 *
 * A comprehensive demo showcasing all alert and notification components with various configurations.
 * This component demonstrates the usage and capabilities of the alert and notification system.
 */

'use client';

import React, { useState } from 'react';
import {
  Alert,
  ToastContainer,
  InlineNotification,
  useToast,
  createToastHelpers,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardDescription,
  Section,
  Container,
} from './ui';

const AlertNotificationDemo: React.FC = () => {
  const { toasts, toast, dismissAll } = useToast();
  const toastHelpers = createToastHelpers(toast);

  // Alert state
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set()
  );

  const handleAlertDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  const handleToastDemo = (
    type: 'success' | 'error' | 'warning' | 'info' | 'default'
  ) => {
    switch (type) {
      case 'success':
        toastHelpers.success(
          'Success!',
          'Your action was completed successfully.'
        );
        break;
      case 'error':
        toastHelpers.error('Error!', 'Something went wrong. Please try again.');
        break;
      case 'warning':
        toastHelpers.warning(
          'Warning!',
          'Please review your input before proceeding.'
        );
        break;
      case 'info':
        toastHelpers.info(
          'Information',
          'Here is some helpful information for you.'
        );
        break;
      case 'default':
        toastHelpers.default(
          'Default Toast',
          'This is a default toast notification.'
        );
        break;
    }
  };

  const handleCustomToast = () => {
    toast({
      title: 'Custom Toast',
      description: 'This toast has custom duration and actions.',
      variant: 'info',
      duration: 10000,
      actions: (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Action
          </Button>
          <Button size="sm" variant="outline">
            Another
          </Button>
        </div>
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />

      {/* Page Header */}
      <Section
        title="Alert & Notification Components"
        description="Comprehensive showcase of all alert and notification components with various configurations and use cases."
      />

      {/* Alert Components */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Alert Components</CardTitle>
            <CardDescription>
              Different alert variants for displaying system messages, errors,
              warnings, and success states.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Default Alert */}
            {!dismissedAlerts.has('default') && (
              <Alert
                title="Default Alert"
                description="This is a default alert with no specific variant."
                dismissible
                onDismiss={() => handleAlertDismiss('default')}
              />
            )}

            {/* Info Alert */}
            {!dismissedAlerts.has('info') && (
              <Alert
                variant="info"
                title="Information Alert"
                description="This is an informational alert with helpful details."
                dismissible
                onDismiss={() => handleAlertDismiss('info')}
              />
            )}

            {/* Success Alert */}
            {!dismissedAlerts.has('success') && (
              <Alert
                variant="success"
                title="Success Alert"
                description="Your action was completed successfully!"
                dismissible
                onDismiss={() => handleAlertDismiss('success')}
              />
            )}

            {/* Warning Alert */}
            {!dismissedAlerts.has('warning') && (
              <Alert
                variant="warning"
                title="Warning Alert"
                description="Please review your input before proceeding."
                dismissible
                onDismiss={() => handleAlertDismiss('warning')}
              />
            )}

            {/* Error Alert */}
            {!dismissedAlerts.has('error') && (
              <Alert
                variant="error"
                title="Error Alert"
                description="Something went wrong. Please try again."
                dismissible
                onDismiss={() => handleAlertDismiss('error')}
              />
            )}

            {/* Alert with Actions */}
            {!dismissedAlerts.has('actions') && (
              <Alert
                variant="info"
                title="Alert with Actions"
                description="This alert includes action buttons for user interaction."
                dismissible
                onDismiss={() => handleAlertDismiss('actions')}
                actions={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Take Action</Button>
                  </div>
                }
              />
            )}

            {/* Alert without Icon */}
            {!dismissedAlerts.has('no-icon') && (
              <Alert
                variant="success"
                title="Alert without Icon"
                description="This alert doesn't show the default icon."
                showIcon={false}
                dismissible
                onDismiss={() => handleAlertDismiss('no-icon')}
              />
            )}

            {/* Different Sizes */}
            <div className="space-y-2">
              <Alert
                variant="info"
                size="sm"
                title="Small Alert"
                description="This is a small-sized alert."
              />
              <Alert
                variant="info"
                size="md"
                title="Medium Alert"
                description="This is a medium-sized alert (default)."
              />
              <Alert
                variant="info"
                size="lg"
                title="Large Alert"
                description="This is a large-sized alert."
              />
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Toast Notifications */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
            <CardDescription>
              Temporary notifications that appear and disappear automatically or
              can be dismissed manually.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleToastDemo('success')}
                variant="outline"
              >
                Success Toast
              </Button>
              <Button
                onClick={() => handleToastDemo('error')}
                variant="outline"
              >
                Error Toast
              </Button>
              <Button
                onClick={() => handleToastDemo('warning')}
                variant="outline"
              >
                Warning Toast
              </Button>
              <Button onClick={() => handleToastDemo('info')} variant="outline">
                Info Toast
              </Button>
              <Button
                onClick={() => handleToastDemo('default')}
                variant="outline"
              >
                Default Toast
              </Button>
              <Button onClick={handleCustomToast} variant="outline">
                Custom Toast
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={dismissAll} variant="outline" size="sm">
                Dismiss All Toasts
              </Button>
              <Button
                onClick={() => {
                  for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                      toastHelpers.info(
                        `Batch Toast ${i + 1}`,
                        'Multiple toasts in sequence.'
                      );
                    }, i * 500);
                  }
                }}
                variant="outline"
                size="sm"
              >
                Show Multiple Toasts
              </Button>
            </div>

            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              <p>Active toasts: {toasts.length}</p>
              <p>Click the buttons above to create toast notifications.</p>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Inline Notifications */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Inline Notifications</CardTitle>
            <CardDescription>
              Compact inline notifications for displaying contextual messages
              within forms or content areas.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <InlineNotification
                variant="info"
                message="This is an inline info notification."
                dismissible
              />
              <InlineNotification
                variant="success"
                message="Success! Your changes have been saved."
                dismissible
              />
              <InlineNotification
                variant="warning"
                message="Please review your input before submitting."
                dismissible
              />
              <InlineNotification
                variant="error"
                message="There was an error processing your request."
                dismissible
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Different Sizes:</h4>
              <InlineNotification
                variant="info"
                size="sm"
                message="Small inline notification"
                dismissible
              />
              <InlineNotification
                variant="info"
                size="md"
                message="Medium inline notification (default)"
                dismissible
              />
              <InlineNotification
                variant="info"
                size="lg"
                message="Large inline notification"
                dismissible
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">With Actions:</h4>
              <InlineNotification
                variant="info"
                message="This notification includes an action button."
                action={
                  <Button size="sm" variant="outline">
                    Action
                  </Button>
                }
                dismissible
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Without Icons:</h4>
              <InlineNotification
                variant="success"
                message="This notification doesn't show an icon."
                showIcon={false}
                dismissible
              />
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
              Common use cases and implementation patterns for alert and
              notification components.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Form Validation:</h4>
              <InlineNotification
                variant="error"
                message="Please fill in all required fields."
                dismissible
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Success Feedback:</h4>
              <InlineNotification
                variant="success"
                message="Your profile has been updated successfully."
                dismissible
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">System Status:</h4>
              <Alert
                variant="info"
                title="System Maintenance"
                description="Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST."
                dismissible
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Critical Error:</h4>
              <Alert
                variant="error"
                title="Connection Failed"
                description="Unable to connect to the server. Please check your internet connection and try again."
                actions={
                  <Button size="sm" variant="outline">
                    Retry Connection
                  </Button>
                }
                dismissible
              />
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AlertNotificationDemo;
