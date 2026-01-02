-- Fix Email Verification Issue for Mobile App
-- Run this in Supabase SQL Editor: Dashboard > SQL Editor > New Query

-- ===========================================
-- OPTION 1: DISABLE EMAIL CONFIRMATION
-- ===========================================
-- This is recommended for internal/staff apps where you control user access
-- Users can sign up and login immediately without email verification

-- Note: This requires Supabase Dashboard access
-- Go to: Authentication > Settings > Email Auth
-- Toggle OFF "Confirm email"

-- Alternatively, you can use the Auth API (requires service role key):
-- This would need to be done via API or dashboard settings

-- ===========================================
-- OPTION 2: ENABLE AUTO-CONFIRM FOR NEW USERS
-- ===========================================
-- Create a trigger to auto-confirm emails for new signups

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
-- VERIFICATION
-- ===========================================
-- Check if trigger was created successfully
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created_auto_confirm';

-- ===========================================
-- NOTES
-- ===========================================
-- After running this:
-- 1. New users will be automatically confirmed
-- 2. No email verification link needed
-- 3. Users can login immediately after signup
-- 4. For production apps with public access, consider Option 3 (deep linking)
