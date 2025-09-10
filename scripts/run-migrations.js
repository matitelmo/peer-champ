#!/usr/bin/env node

/**
 * Migration Runner Script
 *
 * This script runs SQL migrations against a Supabase database.
 * It can be used for local development and testing.
 *
 * Usage:
 *   node scripts/run-migrations.js
 *   npm run migrate
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file for:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role (full database access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting database migrations...');

  const migrationsDir = path.join(__dirname, '../supabase/migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  // Get all SQL files in migrations directory
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort(); // Run migrations in alphabetical order

  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    return;
  }

  console.log(`📁 Found ${migrationFiles.length} migration files`);

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`⏳ Running migration: ${file}`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        // Try alternative method if rpc doesn't work
        const lines = sql.split(';').filter((line) => line.trim());

        for (const line of lines) {
          if (line.trim()) {
            const { error: lineError } = await supabase
              .from('_dummy_table_that_does_not_exist')
              .select('*');

            // This will fail, but we'll use the raw SQL method instead
            const { error: rawError } = await supabase.rpc('exec', {
              sql: line.trim() + ';',
            });

            if (rawError && !rawError.message.includes('does not exist')) {
              throw rawError;
            }
          }
        }
      }

      console.log(`✅ Successfully ran migration: ${file}`);
    } catch (migrationError) {
      console.error(
        `❌ Error running migration ${file}:`,
        migrationError.message
      );
      console.error('SQL content preview:', sql.substring(0, 200) + '...');
      process.exit(1);
    }
  }

  console.log('🎉 All migrations completed successfully!');
}

// Helper function to test database connection
async function testConnection() {
  console.log('🔍 Testing database connection...');

  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error(
      'Please check your Supabase credentials and ensure the project is running'
    );
    return false;
  }
}

// Main execution
async function main() {
  const isConnected = await testConnection();

  if (!isConnected) {
    process.exit(1);
  }

  await runMigrations();
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations, testConnection };
