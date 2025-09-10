# Vercel Deployment Guide

This guide covers deploying the PeerChamps application to Vercel with proper configuration for production, staging, and development environments.

## Prerequisites

- Vercel account
- Vercel CLI installed (`npm install -g vercel`)
- Supabase project set up
- Environment variables configured

## Environment Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
vercel link
```

This will create a `.vercel/project.json` file with your project configuration.

## Environment Variables

### Required Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### NextAuth
- `NEXTAUTH_URL` - Your production URL (e.g., `https://peerchamps.vercel.app`)
- `NEXTAUTH_SECRET` - A random secret for JWT signing

#### OAuth Providers (Optional)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### Environment-Specific Variables

Set different values for different environments:

- **Production**: `https://peerchamps.vercel.app`
- **Staging**: `https://peerchamps-staging.vercel.app`
- **Preview**: Auto-generated URLs

## Deployment Commands

### Deploy to Production

```bash
# Using Vercel CLI
vercel --prod

# Using deployment script
./scripts/deploy.sh production
```

### Deploy to Staging

```bash
# Using Vercel CLI
vercel --env staging

# Using deployment script
./scripts/deploy.sh staging
```

### Deploy Preview

```bash
# Deploy preview for current branch
vercel
```

## Configuration Files

### vercel.json

The main Vercel configuration file includes:

- Build settings
- Environment variables
- Headers for security
- Redirects and rewrites
- Cron jobs
- Function configuration

### .vercelignore

Specifies files and directories to exclude from deployment:

- `node_modules/`
- `.next/`
- Environment files
- Test files
- Documentation

## Database Setup

### 1. Run Migrations

```bash
# Using Supabase CLI
supabase db push

# Using deployment script
./scripts/deploy.sh migrate
```

### 2. Seed Database

```bash
# Using deployment script
./scripts/deploy.sh seed
```

## Monitoring and Analytics

### Vercel Analytics

Enable in your Vercel dashboard:

1. Go to Project Settings
2. Navigate to Analytics
3. Enable Web Analytics

### Performance Monitoring

The application includes:

- Lighthouse CI for performance testing
- Bundle size monitoring
- Core Web Vitals tracking

## Security Configuration

### Headers

The `vercel.json` includes security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### CORS

Configured for your production domain:

```json
{
  "Access-Control-Allow-Origin": "https://peerchamps.vercel.app"
}
```

## Custom Domains

### 1. Add Domain in Vercel

1. Go to Project Settings
2. Navigate to Domains
3. Add your custom domain

### 2. Configure DNS

Point your domain to Vercel:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## Environment-Specific Deployments

### Production

- **URL**: `https://peerchamps.vercel.app`
- **Environment**: `production`
- **Database**: Production Supabase instance
- **Monitoring**: Full analytics and error tracking

### Staging

- **URL**: `https://peerchamps-staging.vercel.app`
- **Environment**: `staging`
- **Database**: Staging Supabase instance
- **Monitoring**: Limited analytics

### Preview

- **URL**: Auto-generated per branch
- **Environment**: `preview`
- **Database**: Development Supabase instance
- **Monitoring**: Basic error tracking

## Troubleshooting

### Common Issues

#### Build Failures

1. Check environment variables
2. Verify Node.js version (18.x)
3. Check for TypeScript errors
4. Ensure all dependencies are installed

#### Database Connection Issues

1. Verify Supabase URL and keys
2. Check RLS policies
3. Ensure migrations are up to date

#### Authentication Issues

1. Verify NextAuth configuration
2. Check OAuth provider settings
3. Ensure callback URLs are correct

### Debug Commands

```bash
# Check build locally
pnpm build

# Test production build
pnpm start

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## Best Practices

### 1. Environment Variables

- Use Vercel's environment variable system
- Set different values for different environments
- Never commit sensitive data to git

### 2. Build Optimization

- Use Next.js Image Optimization
- Enable compression
- Minimize bundle size
- Use CDN for static assets

### 3. Security

- Enable security headers
- Use HTTPS everywhere
- Implement rate limiting
- Regular security audits

### 4. Monitoring

- Set up error tracking
- Monitor performance metrics
- Track user analytics
- Set up alerts

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security headers enabled
- [ ] Performance optimized
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place

## Support

For deployment issues:

1. Check Vercel documentation
2. Review deployment logs
3. Contact Vercel support
4. Check GitHub Issues

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Deployment](https://supabase.com/docs/guides/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
