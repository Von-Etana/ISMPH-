// Diagnostic script to check admin user status
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dviqdzynwapmvoerlvwg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aXFkenlud2FwbXZvZXJsdndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY1NTM4MywiZXhwIjoyMDgyMjMxMzgzfQ.SQFIxV7ue_KJWK3HyCYX3GBnU2iPZumDH0Y_gv8L6U8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
    console.log('=== Admin User Diagnostics ===\n');

    // Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error fetching auth users:', authError);
        return;
    }

    const adminEmails = ['ysabuwa@ismph.org', 'mpeace@ismph.org', 'abako@ismph.org'];

    for (const email of adminEmails) {
        console.log(`\n--- ${email} ---`);

        // Find auth user
        const authUser = authUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (!authUser) {
            console.log('  Auth User: NOT FOUND');
            continue;
        }
        console.log(`  Auth User ID: ${authUser.id}`);
        console.log(`  Email Confirmed: ${authUser.email_confirmed_at ? 'YES' : 'NO'}`);

        // Check profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (profileError) {
            console.log(`  Profile: ERROR - ${profileError.message}`);
        } else if (profile) {
            console.log(`  Profile found:`);
            console.log(`    - Full Name: ${profile.full_name}`);
            console.log(`    - Role: ${profile.role}`);
            console.log(`    - State: ${profile.state}`);
            console.log(`    - Email in profile: ${profile.email}`);
        } else {
            console.log('  Profile: NOT FOUND');
        }

        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: 'TempPass123!'
        });

        if (signInError) {
            console.log(`  Sign In Test: FAILED - ${signInError.message}`);
        } else {
            console.log(`  Sign In Test: SUCCESS`);
        }
    }
}

diagnose().catch(console.error);
