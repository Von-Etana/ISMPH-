-- ISMPH Database Migration Script
-- This script is SAFE TO RE-RUN - it drops existing policies before recreating them
-- Run this in Supabase SQL Editor

-- ===========================================
-- DROP EXISTING POLICIES (to allow re-running)
-- ===========================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow insert during signup" ON profiles;

-- Drop reports policies
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON reports;
DROP POLICY IF EXISTS "Admins can update report status" ON reports;

-- Drop diseases policies
DROP POLICY IF EXISTS "Everyone can view diseases" ON diseases;
DROP POLICY IF EXISTS "Admins can manage diseases" ON diseases;

-- Drop messages policies
DROP POLICY IF EXISTS "Users can view messages in their zones" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their zones" ON messages;
DROP POLICY IF EXISTS "Everyone can view messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;

-- Drop feedback policies
DROP POLICY IF EXISTS "Users can view their own feedback" ON feedback;
DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can update feedback status" ON feedback;

-- Drop phc_facilities policies
DROP POLICY IF EXISTS "Everyone can view PHC facilities" ON phc_facilities;
DROP POLICY IF EXISTS "Admins can manage PHC facilities" ON phc_facilities;

-- Drop policy_commitments policies
DROP POLICY IF EXISTS "Everyone can view policy commitments" ON policy_commitments;
DROP POLICY IF EXISTS "Admins can manage policy commitments" ON policy_commitments;

-- Drop thematic_categories policies
DROP POLICY IF EXISTS "Everyone can view thematic categories" ON thematic_categories;
DROP POLICY IF EXISTS "Admins can manage thematic categories" ON thematic_categories;

-- Drop notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Drop chat_history policies
DROP POLICY IF EXISTS "Users can view their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Users can create chat history" ON chat_history;

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE phc_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE thematic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CREATE POLICIES
-- ===========================================

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

CREATE POLICY "Allow insert during signup" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- REPORTS POLICIES
CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update report status" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- DISEASES POLICIES (public read, admin write)
CREATE POLICY "Everyone can view diseases" ON diseases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage diseases" ON diseases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- MESSAGES POLICIES (simplified for real-time chat)
CREATE POLICY "Everyone can view messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FEEDBACK POLICIES
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update feedback status" ON feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- PHC FACILITIES POLICIES (public read, admin write)
CREATE POLICY "Everyone can view PHC facilities" ON phc_facilities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage PHC facilities" ON phc_facilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- POLICY COMMITMENTS (public read, admin write)
CREATE POLICY "Everyone can view policy commitments" ON policy_commitments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage policy commitments" ON policy_commitments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- THEMATIC CATEGORIES (public read, admin write)
CREATE POLICY "Everyone can view thematic categories" ON thematic_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage thematic categories" ON thematic_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('state_admin', 'super_admin')
    )
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- CHAT HISTORY POLICIES
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- DONE! RLS Policies have been applied.
-- ===========================================
