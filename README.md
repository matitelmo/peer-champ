# PeerChamps

PeerChamps is a comprehensive customer reference and advocate management platform that streamlines the process of connecting prospects with customer advocates, managing reference calls, and tracking program performance.

## Overview

PeerChamps helps businesses leverage their satisfied customers as advocates by:

- AI-powered advocate matching for prospects
- Seamless calendar integration and scheduling
- CRM synchronization (Salesforce, HubSpot)
- Call intelligence and insights extraction
- Compliance-first rewards management
- Comprehensive analytics and reporting

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**: OpenAI GPT-4 for matching and insights
- **Authentication**: Supabase Auth + OAuth (Google, Microsoft)
- **Calendar**: Google Calendar, Microsoft Outlook
- **CRM**: Salesforce, HubSpot APIs
- **Video**: Zoom, Microsoft Teams
- **Email**: SendGrid
- **Storage**: AWS S3
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- npm or yarn package manager
- Git

## Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/peerchamps.git
   cd peerchamps
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your actual configuration values:
   - Supabase credentials
   - OAuth client IDs and secrets
   - API keys for external services
   - CRM integration credentials

4. **Database Setup**
   - Set up your Supabase project
   - Run database migrations (coming in Task 2)
   - Seed initial data (optional)

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflow

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint code quality checks
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run cypress` - Open Cypress for e2e testing
- `npm run cypress:run` - Run Cypress tests headlessly

### Code Quality

This project uses:

- **ESLint** for code quality and best practices
- **Prettier** for consistent code formatting
- **TypeScript** for type safety
- **Husky** for pre-commit hooks (to be added)

### Testing Strategy

1. **Unit Tests**: Jest + React Testing Library
   - Test individual components and utility functions
   - Located in `tests/` directory
   - Run with `npm test`

2. **Integration Tests**: Jest
   - Test API routes and database interactions
   - Test component integration

3. **End-to-End Tests**: Cypress
   - Test complete user workflows
   - Located in `cypress/e2e/` directory
   - Run with `npm run cypress`

## Project Structure

```
src/
├── app/                    # Next.js app directory (pages and layouts)
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and services
│   ├── config.ts          # Environment configuration
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # General utilities
├── types/                  # TypeScript type definitions
tests/                      # Unit and integration tests
cypress/                    # End-to-end tests
docs/                       # Additional documentation
public/                     # Static assets
.github/                    # GitHub Actions workflows
```

## Configuration

### Environment Variables

See `.env.example` for all required environment variables:

**Application**

- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_APP_NAME` - Application name

**Database**

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

**External APIs**

- `OPENAI_API_KEY` - OpenAI API key for AI features
- Google, Microsoft OAuth credentials
- Salesforce, HubSpot CRM credentials
- SendGrid email service credentials
- AWS S3 storage credentials

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

### Quick Contributing Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Testing Guidelines](docs/testing.md)
- [Deployment Guide](docs/deployment.md)
- [API Documentation](docs/api.md)

## Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation in the `docs/` directory

## License

This project is proprietary and confidential. All rights reserved.

---

Built with ❤️ by the PeerChamps team
