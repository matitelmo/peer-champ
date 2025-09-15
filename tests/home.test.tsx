import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders the hero with current copy', () => {
    render(<Home />);
    expect(screen.getByText(/Stop Losing Deals to/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Reference Chaos/i)[0]).toBeInTheDocument();
  });

  it('contains main action buttons', () => {
    render(<Home />);
    expect(screen.getByText('Book Free Demo')).toBeInTheDocument();
    expect(screen.getAllByText('Start Free Trial').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
  });

  it('displays feature sections with updated headings', () => {
    render(<Home />);
    expect(
      screen.getByText(/Everything you need to scale customer advocacy/i)
    ).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Matching')).toBeInTheDocument();
    expect(screen.getByText('Automated Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Revenue Analytics')).toBeInTheDocument();
  });

  it('contains the final CTA section', () => {
    render(<Home />);
    expect(
      screen.getByText(/Ready to transform your customer advocacy\?/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText('Start Free Trial').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
  });
});
