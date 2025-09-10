# Contributing to PeerChamps

Thank you for your interest in contributing to PeerChamps! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and professional environment. We expect all contributors to:

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain code quality
- Follow the established development practices

## Development Process

### 1. Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/peerchamps.git
   cd peerchamps
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

### 2. Making Changes

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Run the test suite**:

   ```bash
   npm test
   npm run cypress:run
   ```

5. **Check code quality**:
   ```bash
   npm run lint
   npm run format
   ```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use strict type checking

### React/Next.js Best Practices

- Use functional components with hooks
- Follow the component structure in existing files
- Use proper prop typing with TypeScript
- Implement proper error boundaries
- Use Next.js features appropriately (App Router, Server Components)

### Code Style

We use Prettier and ESLint to maintain consistent code style:

- **Prettier** handles code formatting automatically
- **ESLint** enforces code quality rules
- Run `npm run format` before committing
- Run `npm run lint` to check for issues

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: kebab-case (e.g., `user-profile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Test files**: `*.test.tsx` or `*.test.ts`

### Component Structure

```typescript
// UserProfile.tsx
import React from 'react';
import { User } from '@/types/user';

interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  // Component implementation
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

export default UserProfile;
```

## Testing Guidelines

### Unit Tests

- Write tests for all new components and utilities
- Use Jest and React Testing Library
- Test user interactions, not implementation details
- Aim for meaningful test descriptions

```typescript
// Example test structure
describe('UserProfile', () => {
  it('displays user information correctly', () => {
    // Test implementation
  });

  it('calls onUpdate when user clicks save', () => {
    // Test implementation
  });
});
```

### Integration Tests

- Test API routes and database interactions
- Mock external services appropriately
- Test error scenarios

### End-to-End Tests

- Use Cypress for critical user workflows
- Test the complete user journey
- Keep tests independent and reliable

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/calendar-sync-issue`)
- `refactor/` - Code refactoring (e.g., `refactor/api-structure`)
- `docs/` - Documentation updates (e.g., `docs/contributing-guide`)
- `test/` - Test improvements (e.g., `test/user-profile-component`)

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer description if needed

- Bullet points for details
- Reference issue numbers: Fixes #123
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Testing
- `style`: Code style changes
- `perf`: Performance improvements

**Examples:**

```
feat(auth): implement OAuth login with Google

fix(calendar): resolve timezone conversion issue
- Fix date calculation for different timezones
- Add proper UTC handling
- Fixes #456

docs(readme): update installation instructions
```

### Pull Request Process

1. **Ensure your branch is up to date**:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Create a detailed pull request** with:
   - Clear title and description
   - List of changes made
   - Screenshots for UI changes
   - Testing instructions

3. **Pull request template**:

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Changes Made

   - List specific changes
   - Include technical details

   ## Testing

   - [ ] Tests pass locally
   - [ ] Added tests for new functionality
   - [ ] Manual testing completed

   ## Screenshots (if applicable)

   [Add screenshots here]

   ## Additional Notes

   Any additional context or considerations
   ```

4. **Address review feedback** promptly and professionally

## Project-Specific Guidelines

### Database Changes

- All database changes must include migrations
- Test migrations both up and down
- Document schema changes in pull request

### API Development

- Follow RESTful conventions
- Include proper error handling
- Add input validation
- Document API endpoints

### UI/UX Guidelines

- Follow the design system consistently
- Ensure mobile responsiveness
- Test accessibility (WCAG guidelines)
- Use semantic HTML

### Performance Considerations

- Optimize for Core Web Vitals
- Use Next.js performance features
- Monitor bundle size
- Implement proper caching strategies

## Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security practices
- Report security issues privately

## Getting Help

If you need help or have questions:

1. **Check existing documentation** in the `docs/` folder
2. **Search existing issues** and pull requests
3. **Create a new issue** with detailed information
4. **Ask in discussions** for general questions

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation

Thank you for contributing to PeerChamps! 🎉
