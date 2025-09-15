#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps set up the Supabase database by providing the SQL commands
 * that need to be run in the Supabase SQL Editor.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 PeerChamps Database Setup\n');

const migrationsDir = path.join(__dirname, '../supabase/migrations');

if (!fs.existsSync(migrationsDir)) {
  console.error('❌ Migrations directory not found:', migrationsDir);
  process.exit(1);
}

// Get all SQL files in migrations directory
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

if (migrationFiles.length === 0) {
  console.log('ℹ️  No migration files found');
  process.exit(0);
}

console.log('📋 Database Setup Instructions:');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Run the following SQL commands in order:\n');

let allSql = '';

migrationFiles.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`-- Migration ${index + 1}: ${file}`);
  console.log('-- ' + '='.repeat(50));
  console.log(sql);
  console.log('\n');
  
  allSql += `-- Migration ${index + 1}: ${file}\n`;
  allSql += sql + '\n\n';
});

// Create a combined SQL file
const combinedSqlPath = path.join(__dirname, '../database-setup.sql');
fs.writeFileSync(combinedSqlPath, allSql);

console.log('📁 A combined SQL file has been created: database-setup.sql');
console.log('   You can copy and paste this entire file into the Supabase SQL Editor\n');

console.log('🔧 After running the migrations:');
console.log('1. Enable Row Level Security (RLS) on all tables');
console.log('2. Set up authentication providers in Supabase Auth settings');
console.log('3. Configure email templates for verification and password reset');
console.log('4. Test the connection with: npm run db:test\n');

console.log('📚 For detailed setup instructions, see: ./SUPABASE_SETUP.md');
