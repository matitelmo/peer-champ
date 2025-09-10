/**
 * Popover Component
 * 
 * A flexible popover component for tooltips, dropdowns, and contextual information.
 * Supports different positions, triggers, and content types.
 */

'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Types
export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  trigger?: 'click' | 'hover' | 'focus';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  showArrow?: boolean;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

// Position classes
const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
};

// Arrow classes
const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
  'top-start': 'top-full left-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
  'top-end': 'top-full right-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
  'bottom-start': 'bottom-full left-4 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
  'bottom-end': 'bottom-full right-4 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
  'left-start': 'left-full top-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
  'left-end': 'left-full bottom-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700',
  'right-start': 'right-full top-4 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700',
  'right-end': 'right-full bottom-4 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700',
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  trigger = 'click',
  position = 'bottom',
  offset = 0,
  showArrow = true,
  className = '',
  contentClassName = '',
  disabled = false,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate popover position
  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollTop - popoverRect.height - offset;
        left = triggerRect.left + scrollLeft + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top + scrollTop - popoverRect.height - offset;
        left = triggerRect.left + scrollLeft;
        break;
      case 'top-end':
        top = triggerRect.top + scrollTop - popoverRect.height - offset;
        left = triggerRect.right + scrollLeft - popoverRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollTop + offset;
        left = triggerRect.left + scrollLeft + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + scrollTop + offset;
        left = triggerRect.left + scrollLeft;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + scrollTop + offset;
        left = triggerRect.right + scrollLeft - popoverRect.width;
        break;
      case 'left':
        top = triggerRect.top + scrollTop + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left + scrollLeft - popoverRect.width - offset;
        break;
      case 'left-start':
        top = triggerRect.top + scrollTop;
        left = triggerRect.left + scrollLeft - popoverRect.width - offset;
        break;
      case 'left-end':
        top = triggerRect.bottom + scrollTop - popoverRect.height;
        left = triggerRect.left + scrollLeft - popoverRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + scrollTop + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + scrollLeft + offset;
        break;
      case 'right-start':
        top = triggerRect.top + scrollTop;
        left = triggerRect.right + scrollLeft + offset;
        break;
      case 'right-end':
        top = triggerRect.bottom + scrollTop - popoverRect.height;
        left = triggerRect.right + scrollLeft + offset;
        break;
    }

    setPopoverPosition({ top, left });
  };

  // Handle trigger events
  const handleTriggerClick = () => {
    if (disabled) return;
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  const handleTriggerMouseEnter = () => {
    if (disabled) return;
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handleTriggerMouseLeave = () => {
    if (disabled) return;
    if (trigger === 'hover') {
      setIsOpen(false);
    }
  };

  const handleTriggerFocus = () => {
    if (disabled) return;
    if (trigger === 'focus') {
      setIsOpen(true);
    }
  };

  const handleTriggerBlur = () => {
    if (disabled) return;
    if (trigger === 'focus') {
      setIsOpen(false);
    }
  };

  // Handle popover events
  const handlePopoverMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handlePopoverMouseLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false);
    }
  };

  // Update position when popover opens
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen || trigger !== 'click') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, trigger]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      className={`
        absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
        ${positionClasses[position]}
        ${contentClassName}
      `}
      style={{
        top: popoverPosition.top,
        left: popoverPosition.left,
      }}
      onMouseEnter={handlePopoverMouseEnter}
      onMouseLeave={handlePopoverMouseLeave}
    >
      {showArrow && (
        <div
          className={`
            absolute w-0 h-0 border-4
            ${arrowClasses[position]}
          `}
        />
      )}
      <div className="p-3">
        {content}
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onFocus={handleTriggerFocus}
        onBlur={handleTriggerBlur}
        className="cursor-pointer"
      >
        {children}
      </div>
      {popoverContent && createPortal(popoverContent, document.body)}
    </div>
  );
};

// Tooltip Component
export interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: PopoverProps['position'];
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  disabled = false,
  className = '',
}) => {
  return (
    <Popover
      content={
        <div className="text-sm text-white dark:text-gray-200">
          {content}
        </div>
      }
      trigger="hover"
      position={position}
      disabled={disabled}
      className={className}
      contentClassName="bg-gray-900 dark:bg-gray-700 border-gray-900 dark:border-gray-700"
    >
      {children}
    </Popover>
  );
};

// Dropdown Component
export interface DropdownProps {
  children: ReactNode;
  content: ReactNode;
  position?: PopoverProps['position'];
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  content,
  position = 'bottom-start',
  disabled = false,
  className = '',
  contentClassName = '',
}) => {
  return (
    <Popover
      content={content}
      trigger="click"
      position={position}
      disabled={disabled}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </Popover>
  );
};

export default Popover;
