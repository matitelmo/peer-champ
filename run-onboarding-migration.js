const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runOnboardingMigration() {
  try {
    console.log('🚀 Running onboarding migration...');
    
    // Read the onboarding migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/20240101000010_create_onboarding_tables.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        
        const { error } = await supabase.rpc('exec', {
          sql: statement.trim() + ';'
        });
        
        if (error) {
          console.log('Error (might be expected):', error.message);
        } else {
          console.log('✅ Success');
        }
      }
    }
    
    console.log('🎉 Onboarding migration completed!');
    
    // Verify tables were created
    const { data: progressData, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.log('❌ onboarding_progress table error:', progressError.message);
    } else {
      console.log('✅ onboarding_progress table created successfully');
    }
    
    const { data: invitationsData, error: invitationsError } = await supabase
      .from('invitations')
      .select('*')
      .limit(1);
    
    if (invitationsError) {
      console.log('❌ invitations table error:', invitationsError.message);
    } else {
      console.log('✅ invitations table created successfully');
    }
    
  } catch (err) {
    console.log('Migration error:', err.message);
  }
}

runOnboardingMigration();
