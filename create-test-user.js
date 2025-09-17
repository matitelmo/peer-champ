const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    console.log('🚀 Creating test user for sign-in...');
    
    // Create a test user in Supabase Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'test@peerchamps.com',
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
      console.log('✅ Test user created successfully!');
      console.log('📧 Email: test@peerchamps.com');
      console.log('🔑 Password: password123');
      console.log('🆔 User ID:', newUser.user.id);

      // Also create a record in the users table
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: newUser.user.id,
          email: newUser.user.email,
          first_name: 'Test',
          last_name: 'User',
          role: 'admin',
          company_id: '66ef576b-8eab-4c9a-912d-f4d0b89f2340' // Use existing company
        });

      if (dbError) {
        console.log('❌ Error creating user record:', dbError.message);
      } else {
        console.log('✅ User record created in database');
      }
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

createTestUser();
