/**
 * Button Component Tests (updated for current design system)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../src/components/ui/Button';
import { PlusIcon } from '../../src/components/ui/icons';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button.className).toMatch(/bg-gradient-brand/);
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('h-10');
    });
  });

  describe('Variants', () => {
    it('primary', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/bg-gradient-brand/);
      expect(button).toHaveClass('text-white');
    });
    it('secondary', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
      expect(button.className).toMatch(/text-regalBlue-700/);
      expect(button.className).toMatch(/border .*regalBlue-700/);
    });
    it('outline', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'bg-white');
      expect(button.className).toMatch(/border-medium-gray/);
    });
    it('ghost', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/text-regalBlue-700/);
    });
    it('destructive uses amaranth brand', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/bg-amaranth-500/);
    });
  });

  describe('Sizes', () => {
    it('md (default)', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    });
    it('lg', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6');
    });
    it('xl', () => {
      render(<Button size="xl">XL</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-14', 'px-8');
    });
    it('icon', () => {
      render(
        <Button size="icon" aria-label="icon">
          <PlusIcon />
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Events', () => {
    it('clicks', async () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled prevents clicks', async () => {
      const onClick = jest.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('handles keydown', () => {
      const onKeyDown = jest.fn();
      render(<Button onKeyDown={onKeyDown}>Key</Button>);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
