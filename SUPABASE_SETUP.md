# Supabase Setup Guide

This guide walks you through setting up Supabase for the PeerChamps application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: PeerChamps
   - **Database Password**: Generate a secure password and save it
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API keys** → **anon public** (this is safe to use in client-side code)
   - **Project API keys** → **service_role** (keep this secret, server-side only)

## Step 3: Configure Environment Variables

Update your `.env.local` file with the actual values:

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PeerChamps

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Test the Connection

After setting up the environment variables, you can test the connection by running:

```bash
npm run dev
```

The application should start without any Supabase connection errors.

## Step 5: Run Database Migrations

Once the basic connection is working, you'll need to run the database migrations to create the required tables:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the migration scripts that will be provided in the next steps

## Security Notes

- Never commit your `.env.local` file to version control
- The `service_role` key has full database access - keep it secure
- The `anon` key is safe to use in client-side code as it respects Row Level Security policies
- Always use Row Level Security (RLS) policies for data protection

## Next Steps

After completing this setup:

1. The database tables will be created via SQL migrations
2. Row Level Security policies will be implemented
3. Sample data will be seeded for development
