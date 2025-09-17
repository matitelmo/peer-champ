const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAuth() {
  try {
    console.log('🔍 Checking database users...');
    
    // Check existing users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Error checking users:', usersError.message);
    } else {
      console.log(`✅ Found ${users.length} users in database`);
      if (users.length > 0) {
        console.log('Sample user:', users[0]);
      }
    }

    // Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error checking auth users:', authError.message);
    } else {
      console.log(`✅ Found ${authUsers.users.length} auth users`);
      if (authUsers.users.length > 0) {
        console.log('Sample auth user:', {
          id: authUsers.users[0].id,
          email: authUsers.users[0].email,
          created_at: authUsers.users[0].created_at
        });
      }
    }

    // If no users exist, create a test user
    if (authUsers.users.length === 0) {
      console.log('🚀 Creating test user...');
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'test@example.com',
        password: 'password123',
        email_confirm: true,
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        }
      });

      if (createError) {
        console.log('❌ Error creating user:', createError.message);
      } else {
        console.log('✅ Test user created:', {
          id: newUser.user.id,
          email: newUser.user.email
        });

        // Also create a record in the users table
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: newUser.user.id,
            email: newUser.user.email,
            first_name: 'Test',
            last_name: 'User',
            role: 'admin'
          });

        if (dbError) {
          console.log('❌ Error creating user record:', dbError.message);
        } else {
          console.log('✅ User record created in database');
        }
      }
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testAuth();
