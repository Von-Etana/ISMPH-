// Script to create admin users in Supabase Auth
// Run this with: node create-admin-users.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and service role key
const supabaseUrl = 'https://cbulgzqmemcduybijfpq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidWxnenFtZW1jZHV5YmlqZnBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYzMTc1NiwiZXhwIjoyMDc3MjA3NzU2fQ.cIOGiLT_LHIGsLbAI53kH3GtJWI9ovxwhCOKxEConZs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const adminUsers = [
  {
    email: 'ysabuwa@lsmph.org',
    password: 'TempPass123!', // Change this to a secure password
    full_name: 'Sabuwa Yahaya',
    state: 'Kano',
    phone: '+2348039627357',
    role: 'state_admin'
  },
  {
    email: 'mpeace@lsmph.org',
    password: 'TempPass123!', // Change this to a secure password
    full_name: 'Peace Micheal',
    state: 'Lagos',
    phone: '+2348033642943',
    role: 'state_admin'
  },
  {
    email: 'abako@lsmph.org',
    password: 'TempPass123!', // Change this to a secure password
    full_name: 'Bako Abdul Usman',
    state: 'Kaduna',
    phone: '+234806074537',
    role: 'state_admin'
  }
];

async function createAdminUsers() {
  console.log('Creating admin users...');

  for (const userData of adminUsers) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: userData.full_name,
          state: userData.state,
          role: userData.role
        }
      });

      if (authError) {
        console.error(`Error creating user ${userData.email}:`, authError);
        continue;
      }

      console.log(`✓ Created auth user: ${userData.email} (ID: ${authData.user.id})`);

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role,
          state: userData.state,
          phone: userData.phone
        });

      if (profileError) {
        console.error(`Error creating profile for ${userData.email}:`, profileError);
      } else {
        console.log(`✓ Created profile for: ${userData.full_name}`);
      }

    } catch (error) {
      console.error(`Unexpected error for ${userData.email}:`, error);
    }
  }

  console.log('\nAdmin user creation completed!');
  console.log('\nIMPORTANT: Please change the temporary passwords immediately!');
  console.log('Temporary password used: TempPass123!');
}

createAdminUsers().catch(console.error);