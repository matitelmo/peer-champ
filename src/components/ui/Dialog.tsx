/**
 * Dialog Component
 *
 * A specialized dialog component for forms, confirmations, and interactive content.
 * Built on top of the Modal component with additional features.
 */

'use client';

import React, { ReactNode } from 'react';
import { Modal, ModalProps } from './Modal';
import { Button } from './Button';
import { Spinner } from './Spinner';

// Types
export interface DialogProps extends Omit<ModalProps, 'footer'> {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning' | 'success';
  cancelVariant?: 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  showCancel?: boolean;
  showConfirm?: boolean;
  footer?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'outline',
  loading = false,
  disabled = false,
  showCancel = true,
  showConfirm = true,
  footer,
  onClose,
  ...modalProps
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const getConfirmButtonVariant = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };

  const defaultFooter = (
    <div className="flex justify-end space-x-3">
      {showCancel && (
        <Button
          variant={cancelVariant}
          onClick={handleCancel}
          disabled={loading || disabled}
        >
          {cancelText}
        </Button>
      )}
      {showConfirm && (
        <Button
          onClick={handleConfirm}
          disabled={loading || disabled}
          className={getConfirmButtonVariant()}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Loading...
            </>
          ) : (
            confirmText
          )}
        </Button>
      )}
    </div>
  );

  return (
    <Modal {...modalProps} onClose={onClose} footer={footer || defaultFooter} />
  );
};

// Form Dialog Component
export interface FormDialogProps extends Omit<DialogProps, 'onConfirm'> {
  onSubmit: (data: any) => void;
  submitText?: string;
  formData?: any;
  validationErrors?: Record<string, string>;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  onSubmit,
  submitText = 'Save',
  formData,
  validationErrors = {},
  ...dialogProps
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      {...dialogProps}
      onConfirm={() => handleSubmit({} as React.FormEvent)}
      confirmText={submitText}
      confirmVariant="primary"
    />
  );
};

// Alert Dialog Component
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  onConfirm?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  onConfirm,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'text-green-600',
          bg: 'bg-green-100 dark:bg-green-900',
          button: 'bg-green-600 hover:bg-green-700 text-white',
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          bg: 'bg-yellow-100 dark:bg-yellow-900',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      case 'error':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-100 dark:bg-red-900',
          button: 'bg-red-600 hover:bg-red-700 text-white',
        };
      default:
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-100 dark:bg-blue-900',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCancel={false}
      confirmText={confirmText}
      onConfirm={onConfirm || onClose}
      confirmVariant={
        type === 'error'
          ? 'danger'
          : type === 'warning'
            ? 'warning'
            : type === 'success'
              ? 'success'
              : 'primary'
      }
    >
      <div className="text-center">
        <div
          className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.bg} mb-4`}
        >
          <div className={styles.icon}>{getIcon()}</div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </Dialog>
  );
};

export default Dialog;
