-- Fix for Authentication Issues
-- Run this in Supabase SQL Editor

-- ===========================================
-- FIX 1: Update role constraint to include 'pending_staff'
-- ===========================================

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add updated constraint with 'pending_staff'
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
-- VERIFICATION: Check if the constraint was updated
-- ===========================================

-- Run this query to verify the constraint:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'profiles'::regclass AND contype = 'c';

-- ===========================================
-- DONE! Your authentication should now work.
-- ===========================================
