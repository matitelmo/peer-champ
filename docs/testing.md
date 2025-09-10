# Testing Guidelines

This document outlines the testing strategy, tools, and best practices for the PeerChamps application.

## Testing Philosophy

Our testing approach follows the testing pyramid:

- **Unit Tests** (70%) - Fast, isolated, focused
- **Integration Tests** (20%) - Component interaction
- **End-to-End Tests** (10%) - Complete user workflows

## Testing Stack

### Unit & Integration Testing

- **Jest** - Test runner and assertion library
- **React Testing Library** - React component testing
- **MSW (Mock Service Worker)** - API mocking
- **@testing-library/user-event** - User interaction simulation

### End-to-End Testing

- **Cypress** - E2E testing framework
- **Real browser testing** - Chrome, Firefox, Safari
- **Visual regression testing** - Screenshot comparisons

## Test Organization

```
tests/
├── unit/                   # Unit tests
│   ├── components/        # Component tests
│   ├── hooks/            # Custom hook tests
│   ├── lib/              # Utility function tests
│   └── api/              # API route tests
├── integration/           # Integration tests
│   ├── auth/             # Authentication flows
│   ├── crm/              # CRM integration tests
│   └── calendar/         # Calendar integration tests
├── fixtures/             # Test data and fixtures
├── helpers/              # Test utilities
└── setup.ts             # Test configuration

cypress/
├── e2e/                  # End-to-end tests
├── fixtures/             # Test data
├── support/              # Custom commands
└── downloads/            # Downloaded files
```

## Unit Testing Guidelines

### Component Testing

**Best Practices:**

- Test behavior, not implementation
- Test user interactions
- Mock external dependencies
- Use semantic queries

**Example Component Test:**

```typescript
// UserProfile.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '@/components/UserProfile';
import { mockUser } from '../fixtures/users';

describe('UserProfile', () => {
  const user = userEvent.setup();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('displays user information correctly', () => {
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('calls onUpdate when user saves changes', async () => {
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);

    const nameInput = screen.getByLabelText(/name/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockUser,
        name: 'New Name'
      });
    });
  });

  it('shows validation errors for invalid input', async () => {
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(saveButton);

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
```

### Hook Testing

**Example Custom Hook Test:**

```typescript
// useAdvocateMatching.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAdvocateMatching } from '@/hooks/useAdvocateMatching';
import { mockOpportunity, mockAdvocates } from '../fixtures';

// Mock the API
jest.mock('@/lib/api', () => ({
  getAdvocateMatches: jest.fn(),
}));

describe('useAdvocateMatching', () => {
  it('returns matching advocates for opportunity', async () => {
    const mockGetAdvocateMatches = require('@/lib/api').getAdvocateMatches;
    mockGetAdvocateMatches.mockResolvedValue(mockAdvocates);

    const { result } = renderHook(() =>
      useAdvocateMatching(mockOpportunity.id)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.matches).toEqual(mockAdvocates);
    expect(result.current.error).toBeNull();
  });

  it('handles errors gracefully', async () => {
    const mockGetAdvocateMatches = require('@/lib/api').getAdvocateMatches;
    mockGetAdvocateMatches.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() =>
      useAdvocateMatching(mockOpportunity.id)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.matches).toEqual([]);
    expect(result.current.error).toBe('API Error');
  });
});
```

### API Route Testing

**Example API Test:**

```typescript
// api/advocates/[id]/matches.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/advocates/[id]/matches/route';
import { mockOpportunity, mockAdvocates } from '../../../fixtures';

describe('/api/advocates/[id]/matches', () => {
  it('returns advocate matches for valid opportunity', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: mockOpportunity.id },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(data.matches).toHaveLength(3);
    expect(data.matches[0]).toHaveProperty('confidence');
  });

  it('returns 404 for non-existent opportunity', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'non-existent' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
```

## Integration Testing

### Authentication Flow Testing

```typescript
// auth.integration.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '@/app/login/page';
import { AuthProvider } from '@/components/AuthProvider';
import { server } from '../mocks/server';
import { authHandlers } from '../mocks/handlers';

describe('Authentication Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('completes full login flow', async () => {
    server.use(...authHandlers);
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Fill in login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify successful login
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });
});
```

### CRM Integration Testing

```typescript
// crm.integration.test.ts
import { salesforceSync } from '@/lib/integrations/salesforce';
import { mockOpportunity, mockSalesforceResponse } from '../fixtures';

describe('Salesforce Integration', () => {
  it('syncs opportunity data successfully', async () => {
    // Mock Salesforce API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSalesforceResponse),
    });

    const result = await salesforceSync.syncOpportunity(mockOpportunity);

    expect(result.success).toBe(true);
    expect(result.opportunityId).toBe(mockOpportunity.id);
  });
});
```

## End-to-End Testing

### Page Object Pattern

```typescript
// cypress/support/pages/LoginPage.ts
export class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillEmail(email: string) {
    cy.get('[data-cy="email-input"]').type(email);
    return this;
  }

  fillPassword(password: string) {
    cy.get('[data-cy="password-input"]').type(password);
    return this;
  }

  submit() {
    cy.get('[data-cy="login-button"]').click();
    return this;
  }

  shouldShowWelcomeMessage() {
    cy.get('[data-cy="welcome-message"]').should('be.visible');
    return this;
  }
}
```

### E2E Test Example

```typescript
// cypress/e2e/advocate-matching.cy.ts
import { LoginPage } from '../support/pages/LoginPage';
import { AdvocateMatchingPage } from '../support/pages/AdvocateMatchingPage';

describe('Advocate Matching Workflow', () => {
  const loginPage = new LoginPage();
  const matchingPage = new AdvocateMatchingPage();

  beforeEach(() => {
    // Set up test data
    cy.task('seedDatabase');

    // Login as sales rep
    loginPage
      .visit()
      .fillEmail('salesrep@company.com')
      .fillPassword('password123')
      .submit()
      .shouldShowWelcomeMessage();
  });

  it('finds and selects advocate matches', () => {
    matchingPage
      .visit()
      .selectOpportunity('Tech Startup - Series A')
      .clickFindMatches()
      .shouldShowMatches()
      .selectFirstMatch()
      .clickScheduleCall()
      .shouldShowSchedulingInterface();
  });

  it('handles no matches scenario', () => {
    matchingPage
      .visit()
      .selectOpportunity('Unique Industry Opportunity')
      .clickFindMatches()
      .shouldShowNoMatchesMessage()
      .shouldShowContactSupportButton();
  });
});
```

## Testing Utilities

### Test Data Factory

```typescript
// tests/factories/userFactory.ts
import { User } from '@/types/user';

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'sales_rep',
  companyId: 'company-123',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createAdvocate = (overrides = {}) => ({
  id: 'advocate-123',
  userId: 'user-123',
  industry: 'Technology',
  company: 'Tech Corp',
  role: 'CTO',
  expertise: ['React', 'Node.js', 'AWS'],
  availability: true,
  ...overrides,
});
```

### Mock Service Worker Setup

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/advocates/matches', (req, res, ctx) => {
    return res(
      ctx.json({
        matches: [
          { id: '1', confidence: 0.95, advocate: { name: 'John Doe' } },
          { id: '2', confidence: 0.87, advocate: { name: 'Jane Smith' } },
        ],
      })
    );
  }),

  rest.post('/api/calls/schedule', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        callId: 'call-123',
        scheduledAt: '2024-01-15T10:00:00Z',
      })
    );
  }),
];

export const authHandlers = [
  rest.post('/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'fake-token',
        user: { id: 'user-123', email: 'test@example.com' },
      })
    );
  }),
];
```

## Performance Testing

### Load Testing with Jest

```typescript
// tests/performance/api.performance.test.ts
describe('API Performance', () => {
  it('responds to advocate matching within 2 seconds', async () => {
    const start = Date.now();

    const response = await fetch('/api/advocates/matches', {
      method: 'POST',
      body: JSON.stringify({ opportunityId: 'test-123' }),
    });

    const duration = Date.now() - start;

    expect(response.ok).toBe(true);
    expect(duration).toBeLessThan(2000);
  });
});
```

## Testing Commands

### Running Tests

```bash
# Unit tests
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report

# E2E tests
npm run cypress            # Open Cypress GUI
npm run cypress:run        # Run headless
npm run cypress:run:chrome # Specific browser

# Performance tests
npm run test:performance   # Load testing
npm run test:lighthouse    # Lighthouse CI
```

### CI/CD Integration

Tests are automatically run in GitHub Actions:

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: npm test -- --coverage --watchAll=false

- name: Run E2E tests
  run: npm run cypress:run

- name: Upload coverage
  uses: codecov/codecov-action@v1
```

## Test Coverage

### Coverage Targets

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Critical Path Coverage

- Authentication flows: 95%+
- Payment processing: 95%+
- Data synchronization: 90%+
- Security features: 95%+

## Best Practices

### General Guidelines

- Write tests before fixing bugs
- Keep tests focused and isolated
- Use descriptive test names
- Test edge cases and error scenarios
- Mock external dependencies
- Avoid testing implementation details

### Performance Considerations

- Run tests in parallel
- Use shallow rendering when appropriate
- Mock heavy dependencies
- Keep test data minimal
- Clean up after tests

### Maintenance

- Update tests when requirements change
- Remove obsolete tests
- Refactor test code like production code
- Keep test dependencies up to date
- Regular test performance audits

This testing strategy ensures high code quality, reduces bugs, and provides confidence in deployments while maintaining developer productivity.
