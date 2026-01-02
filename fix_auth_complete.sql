-- Complete Authentication Database Fixes
-- Run this in Supabase SQL Editor to ensure smooth authentication
-- This consolidates all auth-related database fixes

-- ===========================================
-- FIX 1: Update role constraint to include all valid roles
-- ===========================================

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add updated constraint with all valid roles including 'staff'
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('public', 'pending_staff', 'staff', 'state_admin', 'super_admin'));

-- ===========================================
-- FIX 2: Ensure RLS allows profile creation during signup
-- ===========================================

-- Drop and recreate the insert policy to ensure it exists
DROP POLICY IF EXISTS "Allow insert during signup" ON profiles;

CREATE POLICY "Allow insert during signup" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- FIX 3: Auto-confirm email for new users (OPTIONAL)
-- ===========================================
-- This removes the email verification requirement
-- Comment this out if you want to require email verification

CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id
  AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created_auto_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- ===========================================
-- FIX 4: Ensure profiles can be read by their owners
-- ===========================================

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- ===========================================
-- FIX 5: Allow users to update their own profiles
-- ===========================================

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ===========================================
-- VERIFICATION: Check if everything is set up correctly
-- ===========================================

-- Check role constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass AND contype = 'c';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Check trigger
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created_auto_confirm';

-- ===========================================
-- SUCCESS MESSAGE
-- ===========================================
SELECT 'SUCCESS: All authentication database fixes applied!' as result;

-- ===========================================
-- NEXT STEPS
-- ===========================================
-- 1. Restart your Expo app: npx expo start --clear
-- 2. Test signup with a new email
-- 3. Test login with existing credentials
-- 4. Verify session persists after app restart
-- ===========================================
