
// Script to update admin user emails
const { createClient } = require('@supabase/supabase-js');

// Project config
const supabaseUrl = 'https://dviqdzynwapmvoerlvwg.supabase.co';

// IMPORTANT: Paste your SERVICE_ROLE_KEY here
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping of Old Email -> New Email
const emailUpdates = [
    { old: 'ysabuwa@lsmph.org', new: 'ysabuwa@ismph.org' },
    { old: 'mpeace@lsmph.org', new: 'mpeace@ismph.org' },
    { old: 'abako@lsmph.org', new: 'abako@ismph.org' },
];

async function updateEmails() {
    console.log('Starting email updates...');

    for (const update of emailUpdates) {
        try {
            console.log(`\nProcessing: ${update.old} -> ${update.new}`);

            // 1. Get the user by OLD email to find their ID
            const { data: { users }, error: findError } = await supabase.auth.admin.listUsers();

            const user = users.find(u => u.email === update.old);

            if (!user) {
                console.error(`❌ User not found with email: ${update.old}`);
                continue;
            }

            const userId = user.id;
            console.log(`✓ Found user ID: ${userId}`);

            // 2. Update Auth User Email
            const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
                userId,
                { email: update.new, email_confirm: true }
            );

            if (updateAuthError) {
                console.error(`❌ Failed to update auth email:`, updateAuthError);
                continue;
            }
            console.log(`✓ Updated Auth email`);

            // 3. Update Profile Table Email
            const { error: updateProfileError } = await supabase
                .from('profiles')
                .update({ email: update.new })
                .eq('id', userId);

            if (updateProfileError) {
                console.error(`❌ Failed to update profile email:`, updateProfileError);
            } else {
                console.log(`✓ Updated Profile email`);
            }

        } catch (err) {
            console.error(`Unexpected error for ${update.old}:`, err);
        }
    }

    console.log('\nDone!');
}

updateEmails();
