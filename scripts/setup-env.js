#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up the environment variables for the PeerChamps application.
 * It creates a .env.local file with the necessary configuration.
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PeerChamps

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Authentication (NextAuth.js - for future OAuth integration)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# External APIs
OPENAI_API_KEY=your-openai-api-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# CRM Integration
SALESFORCE_CLIENT_ID=your-salesforce-client-id
SALESFORCE_CLIENT_SECRET=your-salesforce-client-secret

HUBSPOT_CLIENT_ID=your-hubspot-client-id
HUBSPOT_CLIENT_SECRET=your-hubspot-client-secret

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@peerchamps.com

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
`;

const envExamplePath = path.join(__dirname, '..', '.env.example');
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('🚀 Setting up environment files for PeerChamps...\n');

// Create .env.example
if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envTemplate);
  console.log('✅ Created .env.example file');
} else {
  console.log('ℹ️  .env.example already exists');
}

// Create .env.local if it doesn't exist
if (!fs.existsSync(envLocalPath)) {
  fs.writeFileSync(envLocalPath, envTemplate);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update .env.local with your actual Supabase credentials');
} else {
  console.log('ℹ️  .env.local already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Get your project URL and API keys from Settings > API');
console.log('3. Update .env.local with your Supabase credentials');
console.log('4. Run: npm run migrate (to set up the database)');
console.log('5. Run: npm run dev (to start the development server)');
console.log('\n🔗 Supabase Setup Guide: ./SUPABASE_SETUP.md');
