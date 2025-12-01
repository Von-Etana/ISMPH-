-- SQL to update admin profiles with correct user IDs
-- Run this AFTER creating users with the JavaScript script
-- Replace the UUID placeholders with actual user IDs from Supabase Auth

-- First, let's see what users we have
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email IN ('ysabuwa@lsmph.org', 'mpeace@lsmph.org', 'abako@lsmph.org');

-- Then update the profiles table with correct IDs
-- Note: Replace the UUIDs below with the actual IDs from the query above

-- For Kano State Admin (Sabuwa Yahaya)
UPDATE profiles
SET
  full_name = 'Sabuwa Yahaya',
  email = 'ysabuwa@lsmph.org',
  role = 'state_admin',
  state = 'Kano',
  phone = '+2348039627357'
WHERE email = 'ysabuwa@lsmph.org';

-- For Lagos State Admin (Peace Micheal)
UPDATE profiles
SET
  full_name = 'Peace Micheal',
  email = 'mpeace@lsmph.org',
  role = 'state_admin',
  state = 'Lagos',
  phone = '+2348033642943'
WHERE email = 'mpeace@lsmph.org';

-- For Kaduna State Admin (Bako Abdul Usman)
UPDATE profiles
SET
  full_name = 'Bako Abdul Usman',
  email = 'abako@lsmph.org',
  role = 'state_admin',
  state = 'Kaduna',
  phone = '+234806074537'
WHERE email = 'abako@lsmph.org';

-- Verify the updates
SELECT id, full_name, email, role, state, phone
FROM profiles
WHERE role = 'state_admin'
ORDER BY state;