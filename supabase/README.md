# Database Migrations

This directory contains SQL migration files for the PeerChamps database schema.

## How to Apply Migrations

### Option 1: Manual Application (Recommended for Development)

1. **Set up your Supabase project** following the [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) guide

2. **Copy the SQL content** from the migration files in the `migrations/` directory

3. **Run in Supabase SQL Editor**:
   - Go to your Supabase Dashboard
   - Navigate to **SQL Editor**
   - Paste the SQL content
   - Click **Run**

### Option 2: Using the Migration Script (Experimental)

```bash
# Test database connection
npm run db:test

# Run all migrations
npm run migrate
```

**Note**: The migration script is experimental and may not work with all Supabase configurations. Manual application via the SQL Editor is recommended.

## Migration Files

### `20240101000001_create_companies_and_users.sql`

Creates the foundational tables:

- **companies**: Multi-tenant company records
- **users**: Application users (sales reps, advocates, admins)

Includes:

- Proper foreign key relationships
- Indexes for performance
- Auto-updating timestamp triggers
- Default data for development

## Best Practices

1. **Always test migrations** in a development environment first
2. **Back up your database** before applying migrations in production
3. **Run migrations in order** (they are numbered for this purpose)
4. **Verify the results** by checking the tables in Supabase Dashboard

## Database Schema Overview

```
companies (tenants)
├── id (UUID, PK)
├── name (TEXT)
├── domain (TEXT, UNIQUE)
├── subscription_tier (TEXT)
├── settings (JSONB)
└── timestamps

users (application users)
├── id (UUID, PK)
├── company_id (UUID, FK → companies.id)
├── email (TEXT, UNIQUE)
├── role (TEXT: sales_rep, advocate, admin)
├── profile (JSONB)
└── timestamps
```

## Troubleshooting

### Common Issues

1. **Permission denied**: Ensure you're using the service role key, not the anon key
2. **Table already exists**: Check if migrations were already applied
3. **Connection failed**: Verify your Supabase URL and keys in `.env.local`

### Getting Help

If you encounter issues:

1. Check the Supabase logs in the Dashboard
2. Verify your environment variables
3. Ensure your Supabase project is active and not paused
