# Authentication Setup Guide

This guide will walk you through setting up the authentication system for PeerChamps.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is sufficient)
- Basic understanding of environment variables

## Step 1: Set Up Environment Variables

1. **Run the environment setup script:**
   ```bash
   npm run setup:env
   ```

2. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or sign in
   - Click "New Project"
   - Choose your organization
   - Fill in project details:
     - **Name**: PeerChamps
     - **Database Password**: Generate a secure password and save it
     - **Region**: Choose the region closest to your users
   - Click "Create new project"
   - Wait for the project to be set up (2-3 minutes)

3. **Get your Supabase credentials:**
   - In your Supabase dashboard, go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** (starts with `https://`)
     - **Project API keys** → **anon public**
     - **Project API keys** → **service_role** (keep this secret!)

4. **Update your `.env.local` file:**
   ```bash
   # Replace these with your actual values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 2: Set Up the Database

1. **Generate the database setup SQL:**
   ```bash
   npm run setup:db
   ```

2. **Run the SQL in Supabase:**
   - Go to your Supabase dashboard
   - Navigate to **SQL Editor**
   - Copy the contents of `database-setup.sql` (created by the script)
   - Paste it into the SQL Editor
   - Click "Run" to execute all migrations

3. **Verify the tables were created:**
   - Go to **Table Editor** in your Supabase dashboard
   - You should see the following tables:
     - `companies`
     - `users`
     - `advocates`
     - `opportunities`
     - `reference_calls`
     - `magic_links`

## Step 3: Configure Authentication

1. **Enable email authentication:**
   - In your Supabase dashboard, go to **Authentication** → **Settings**
   - Under **Auth Providers**, ensure **Email** is enabled
   - Configure email templates if desired

2. **Set up email verification:**
   - In **Authentication** → **Settings** → **Email Templates**
   - Customize the "Confirm signup" template
   - Set the redirect URL to: `http://localhost:3000/auth/verify-email`

3. **Configure password reset:**
   - In the same **Email Templates** section
   - Customize the "Reset password" template
   - Set the redirect URL to: `http://localhost:3000/auth/reset-password`

## Step 4: Test the Authentication System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the authentication:**
   - Go to `http://localhost:3000/test-auth`
   - Use the test panel to:
     - Test sign up with a new email
     - Check your email for verification
     - Test sign in after verification
     - Test sign out

3. **Test the auth pages:**
   - Go to `http://localhost:3000/auth/signup`
   - Go to `http://localhost:3000/auth/signin`
   - Try creating an account and signing in

## Step 5: Verify Everything Works

1. **Test the complete flow:**
   - Sign up with a new email address
   - Check your email and click the verification link
   - Sign in with your credentials
   - Navigate to protected pages (like `/dashboard`)
   - Sign out and verify you're redirected to sign in

2. **Check the database:**
   - In Supabase **Table Editor**, check the `users` table
   - You should see your user record with the correct email and metadata

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error:**
   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after updating environment variables

2. **"Invalid login credentials" error:**
   - Make sure you've verified your email address
   - Check that the email and password are correct

3. **Database connection errors:**
   - Verify your Supabase project is running (not paused)
   - Check that your credentials are correct
   - Ensure the database migrations ran successfully

4. **Email verification not working:**
   - Check your spam folder
   - Verify the email template redirect URL is correct
   - Make sure your Supabase project has email sending enabled

### Getting Help

- Check the browser console for error messages
- Look at the Supabase dashboard logs
- Verify all environment variables are set correctly
- Ensure the database migrations completed successfully

## Next Steps

Once authentication is working:

1. **Add OAuth providers** (Google, Microsoft)
2. **Implement role-based access control** (RBAC)
3. **Add password reset functionality**
4. **Set up protected routes**
5. **Add user profile management**

## Security Notes

- Never commit your `.env.local` file to version control
- The `service_role` key has full database access - keep it secure
- The `anon` key is safe to use in client-side code
- Always use Row Level Security (RLS) policies for data protection
- Enable email verification for production use

## Production Deployment

For production deployment:

1. Update environment variables in your hosting platform
2. Configure production email templates
3. Set up proper redirect URLs
4. Enable additional security features
5. Set up monitoring and logging

---

**Need help?** Check the [Supabase documentation](https://supabase.com/docs) or create an issue in the project repository.
