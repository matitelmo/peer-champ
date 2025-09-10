# Deployment Guide

This document provides comprehensive instructions for deploying the PeerChamps application to various environments.

## Overview

PeerChamps uses a modern deployment strategy with:

- **Vercel** for hosting and automatic deployments
- **Supabase** for database and authentication
- **GitHub Actions** for CI/CD pipeline
- **Environment-based configuration**

## Prerequisites

Before deploying, ensure you have:

- GitHub repository set up
- Vercel account connected to GitHub
- Supabase project created
- External service accounts configured (OpenAI, Google, etc.)

## Environment Setup

### 1. Production Environment Variables

Set up the following environment variables in Vercel:

#### Application

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=PeerChamps
NODE_ENV=production
```

#### Database (Supabase)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Authentication

```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret
```

#### External APIs

```bash
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

#### CRM Integration

```bash
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret
```

#### Email & Storage

```bash
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

## Deployment Methods

### Method 1: Vercel (Recommended)

#### Initial Setup

1. **Connect Repository to Vercel**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Configure Environment Variables**

   ```bash
   # Set environment variables
   vercel env add NEXT_PUBLIC_APP_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # ... continue for all variables
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

#### Automatic Deployments

Set up automatic deployments by connecting your GitHub repository:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Method 2: Docker Deployment

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    env_file:
      - .env.production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: peerchamps
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

## Database Deployment

### Supabase Setup

1. **Create Supabase Project**

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Initialize project
   supabase init

   # Link to remote project
   supabase link --project-ref YOUR_PROJECT_ID
   ```

2. **Deploy Database Changes**

   ```bash
   # Push migrations
   supabase db push

   # Deploy functions
   supabase functions deploy
   ```

3. **Set Up Row Level Security**

   ```sql
   -- Enable RLS on all tables
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE advocates ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own company data"
   ON companies FOR SELECT
   USING (id = auth.jwt() ->> 'company_id');
   ```

### Database Migrations

```bash
# Create migration
supabase migration new create_initial_schema

# Apply migrations
supabase db reset  # Development
supabase db push   # Production
```

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes automated CI/CD via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

Add these secrets to your GitHub repository:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Environment-Specific Configurations

### Development

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
# ... other dev variables
```

### Staging

```bash
# .env.staging
NEXT_PUBLIC_APP_URL=https://staging.peerchamps.com
NODE_ENV=production
# ... staging-specific variables
```

### Production

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://peerchamps.com
NODE_ENV=production
# ... production variables
```

## Domain Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Configure DNS**

   ```
   # A Record
   @ → 76.76.19.61

   # CNAME Record
   www → cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Force HTTPS in production

### Subdomain Strategy

```
# Production
peerchamps.com → Production app
api.peerchamps.com → API documentation

# Staging
staging.peerchamps.com → Staging environment
```

## Monitoring & Health Checks

### Application Monitoring

```typescript
// lib/monitoring.ts
export const healthCheck = async () => {
  const checks = {
    database: await checkDatabase(),
    external_apis: await checkExternalAPIs(),
    storage: await checkStorage(),
  };

  return {
    status: Object.values(checks).every(Boolean) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  };
};
```

### Vercel Analytics

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },

  // Enable Vercel Analytics
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
};
```

## Rollback Procedures

### Automatic Rollback

```bash
# Revert to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Manual Rollback

1. **Identify Issue**
   - Check monitoring dashboards
   - Review error logs

2. **Quick Fix vs Rollback**
   - Hot fix for minor issues
   - Rollback for major problems

3. **Database Rollback**
   ```bash
   # Rollback database migration
   supabase migration repair --status reverted
   ```

## Security Considerations

### Environment Variables

- Never commit sensitive data
- Use different secrets per environment
- Rotate secrets regularly
- Use Vercel's encrypted environment variables

### Build Security

```bash
# Security audit
npm audit
npm audit fix

# Dependency checks
npm run security:check
```

### Runtime Security

- Enable HTTPS only
- Implement proper CORS
- Use security headers
- Regular security updates

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
module.exports = {
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },

  // Compression
  compress: true,

  // Image optimization
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

### CDN Configuration

```javascript
// Vercel Edge Config
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'fra1'], // Americas, Asia, Europe
};
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**

   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variable Issues**

   ```bash
   # Check environment variables
   vercel env ls

   # Pull environment variables
   vercel env pull .env.local
   ```

3. **Database Connection Issues**

   ```bash
   # Test database connection
   npm run db:test

   # Check connection pool
   npm run db:pool:status
   ```

### Debugging Production Issues

```typescript
// Enable detailed logging in production
export const logError = (error: Error, context: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${context}] ${error.message}`, {
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
};
```

## Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review monitoring dashboards
   - Check error rates
   - Update dependencies

2. **Monthly**
   - Security audit
   - Performance review
   - Backup verification

3. **Quarterly**
   - Infrastructure review
   - Cost optimization
   - Security assessment

### Backup Strategy

```bash
# Database backup
supabase db dump > backup-$(date +%Y%m%d).sql

# Environment backup
vercel env pull .env.backup
```

This deployment guide ensures reliable, secure, and performant deployments of the PeerChamps application across all environments.
