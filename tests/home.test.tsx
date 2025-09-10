import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders the home page with expected content', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /The comprehensive customer reference and advocate management platform/
      )
    ).toBeInTheDocument();
  });

  it('contains the main heading', () => {
    render(<Home />);
    const heading = screen.getByText(/Welcome to/);
    expect(heading).toBeInTheDocument();
    // Check for the first instance of PeerChamps (in the main heading)
    const peerChampsElements = screen.getAllByText('PeerChamps');
    expect(peerChampsElements.length).toBeGreaterThan(0);
  });

  it('contains action buttons', () => {
    render(<Home />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getAllByText('Sign In')).toHaveLength(2);
  });

  it('displays feature sections', () => {
    render(<Home />);
    expect(
      screen.getByText('Powerful Features for Customer Advocacy')
    ).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Matching')).toBeInTheDocument();
    expect(screen.getByText('Seamless Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Insights')).toBeInTheDocument();
  });

  it('contains call-to-action section', () => {
    render(<Home />);
    expect(
      screen.getByText('Ready to Transform Your Customer Advocacy?')
    ).toBeInTheDocument();
    expect(screen.getByText('Start Free Trial')).toBeInTheDocument();
    expect(screen.getAllByText('Sign In')).toHaveLength(2);
  });
});
