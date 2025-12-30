// Script to verify admin users in Supabase
// Run this with: node verify-admin-users.js
// 
// IMPORTANT: Before running, set these environment variables:
//   set SUPABASE_URL=your_supabase_url
//   set SUPABASE_SERVICE_KEY=your_service_role_key

const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables or use defaults
const supabaseUrl = process.env.SUPABASE_URL || 'https://dviqdzynwapmvoerlvwg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey || supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error('❌ ERROR: Please set SUPABASE_SERVICE_KEY environment variable');
    console.error('');
    console.error('PowerShell:');
    console.error('  $env:SUPABASE_SERVICE_KEY="your_service_role_key_here"');
    console.error('  node verify-admin-users.js');
    console.error('');
    console.error('Or CMD:');
    console.error('  set SUPABASE_SERVICE_KEY=your_service_role_key_here');
    console.error('  node verify-admin-users.js');
    console.error('');
    console.error('Get your service role key from Supabase Dashboard > Settings > API');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Expected admin emails (lowercase for comparison)
const expectedAdmins = [
    'ysabuwa@ismph.org',
    'mpeace@ismph.org',
    'abako@ismph.org',
    'admin@ismph.org',
    'lagos@ismph.org',
    'kano@ismph.org',
    'kaduna@ismph.org'
];

async function verifyAdminUsers() {
    console.log('🔍 Verifying admin users in Supabase...\n');
    console.log('='.repeat(60));

    try {
        // 1. Check Auth Users
        console.log('\n📋 STEP 1: Checking Supabase Auth Users\n');

        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
            console.error('❌ Error fetching auth users:', authError.message);
            return;
        }

        if (!authUsers || authUsers.users.length === 0) {
            console.log('⚠️  No users found in Supabase Auth!');
            console.log('   You need to create admin users first.');
        } else {
            console.log(`Found ${authUsers.users.length} user(s) in Supabase Auth:\n`);

            authUsers.users.forEach((user, index) => {
                const isAdmin = expectedAdmins.includes(user.email?.toLowerCase());
                const status = isAdmin ? '✓ ADMIN' : '○ User';
                console.log(`  ${index + 1}. ${status}: ${user.email}`);
                console.log(`     ID: ${user.id}`);
                console.log(`     Created: ${new Date(user.created_at).toLocaleString()}`);
                console.log(`     Email Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
                console.log('');
            });
        }

        // 2. Check Profile Records
        console.log('='.repeat(60));
        console.log('\n📋 STEP 2: Checking Profile Records\n');

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['super_admin', 'state_admin', 'staff']);

        if (profileError) {
            console.error('❌ Error fetching profiles:', profileError.message);
            return;
        }

        if (!profiles || profiles.length === 0) {
            console.log('⚠️  No admin/staff profiles found in the profiles table!');
        } else {
            console.log(`Found ${profiles.length} admin/staff profile(s):\n`);

            profiles.forEach((profile, index) => {
                console.log(`  ${index + 1}. ${profile.full_name || 'Unknown'}`);
                console.log(`     Email: ${profile.email}`);
                console.log(`     Role: ${profile.role}`);
                console.log(`     State: ${profile.state || 'N/A'}`);
                console.log(`     ID: ${profile.id}`);
                console.log('');
            });
        }

        // 3. Cross-reference check
        console.log('='.repeat(60));
        console.log('\n📋 STEP 3: Cross-Reference Check\n');

        if (authUsers && authUsers.users.length > 0 && profiles && profiles.length > 0) {
            const authIds = authUsers.users.map(u => u.id);
            const profileIds = profiles.map(p => p.id);

            // Profiles without matching auth users
            const orphanProfiles = profiles.filter(p => !authIds.includes(p.id));
            if (orphanProfiles.length > 0) {
                console.log('⚠️  Profiles WITHOUT matching Auth users (orphaned):');
                orphanProfiles.forEach(p => console.log(`   - ${p.email} (ID: ${p.id})`));
                console.log('');
            }

            // Auth users without profiles (admin/staff)
            const adminAuthUsers = authUsers.users.filter(u =>
                expectedAdmins.includes(u.email?.toLowerCase())
            );
            const missingProfiles = adminAuthUsers.filter(u => !profileIds.includes(u.id));
            if (missingProfiles.length > 0) {
                console.log('⚠️  Auth users WITHOUT profiles:');
                missingProfiles.forEach(u => console.log(`   - ${u.email} (ID: ${u.id})`));
                console.log('');
            }

            if (orphanProfiles.length === 0 && missingProfiles.length === 0) {
                console.log('✅ All admin users have matching auth records and profiles!');
            }
        }

        // 4. Summary
        console.log('\n' + '='.repeat(60));
        console.log('\n📊 SUMMARY\n');

        const authCount = authUsers?.users?.length || 0;
        const adminProfiles = profiles?.filter(p => ['super_admin', 'state_admin'].includes(p.role)) || [];

        console.log(`  Total Auth Users: ${authCount}`);
        console.log(`  Admin Profiles: ${adminProfiles.length}`);

        if (adminProfiles.length === 0) {
            console.log('\n⚠️  NO ADMIN USERS FOUND!');
            console.log('   You need to run the create-admin-users.js script');
            console.log('   with your actual SERVICE_ROLE_KEY.');
        } else {
            console.log('\n✅ Admin users are configured.');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

verifyAdminUsers().catch(console.error);
