/**
 * UI Components Index
 *
 * Central export file for all UI components.
 * Import components from this file for better organization.
 */

// Button component
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

// Form Input components
export { Input, inputVariants } from './Input';
export type { InputProps } from './Input';

export { Textarea, textareaVariants } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Select, selectVariants } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Checkbox, checkboxVariants } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio, radioVariants } from './Radio';
export type { RadioProps } from './Radio';

export { Toggle, toggleVariants, toggleThumbVariants } from './Toggle';
export type { ToggleProps } from './Toggle';

// Card components
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  cardVariants,
  cardHeaderVariants,
  cardBodyVariants,
  cardFooterVariants,
} from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
} from './Card';

// Container components
export { Container, Section, Page, containerVariants } from './Container';
export type { ContainerProps, SectionProps, PageProps } from './Container';

// Specialized card components
export {
  StatCard,
  ProfileCard,
  FeatureCard,
  AlertCard,
} from './SpecializedCards';
export type {
  StatCardProps,
  ProfileCardProps,
  FeatureCardProps,
  AlertCardProps,
} from './SpecializedCards';

// Alert and notification components
export { Alert, alertVariants } from './Alert';
export type { AlertProps } from './Alert';

export { Toast, toastVariants } from './Toast';
export type { ToastProps } from './Toast';

export { ToastContainer } from './ToastContainer';
export type { ToastContainerProps, ToastData } from './ToastContainer';

export {
  InlineNotification,
  inlineNotificationVariants,
} from './InlineNotification';
export type { InlineNotificationProps } from './InlineNotification';

export { useToast, createToastHelpers } from './useToast';
export type { ToastOptions, ToastReturn, ToastHelpers } from './useToast';

// Loading and error state components
export { Spinner, spinnerVariants } from './Spinner';
export type { SpinnerProps } from './Spinner';

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  skeletonVariants,
} from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export {
  LoadingOverlay,
  FullScreenLoadingOverlay,
  ContainerLoadingOverlay,
  loadingOverlayVariants,
} from './LoadingOverlay';
export type { LoadingOverlayProps } from './LoadingOverlay';

export {
  EmptyState,
  DefaultIllustrations,
  emptyStateVariants,
} from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export {
  ErrorState,
  InlineErrorState,
  FullScreenErrorState,
  errorStateVariants,
} from './ErrorState';
export type { ErrorStateProps } from './ErrorState';

export { LoadingButton } from './LoadingButton';
export type { LoadingButtonProps } from './LoadingButton';

export { LoadingInput } from './LoadingInput';
export type { LoadingInputProps } from './LoadingInput';

// Icons
export * from './icons';

// Re-export common types
export type { VariantProps } from 'class-variance-authority';
