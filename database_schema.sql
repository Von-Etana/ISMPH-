-- ISMPH Database Schema
-- Run this in Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. PROFILES TABLE (User accounts with roles)
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'public' CHECK (role IN ('public', 'staff', 'state_admin', 'super_admin')),
  state TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 2. REPORTS TABLE (PHC reports with approval workflow)
-- ===========================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  state TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  reporter_name TEXT,
  reporter_phone TEXT,
  reporter_email TEXT,
  reporter_address TEXT,
  media_attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 3. DISEASES TABLE (Disease tracking by zone and state)
-- ===========================================
CREATE TABLE IF NOT EXISTS diseases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  zone TEXT NOT NULL,
  total_cases INTEGER DEFAULT 0,
  active_cases INTEGER DEFAULT 0,
  recovered INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 4. MESSAGES TABLE (Chat messages for real-time communication)
-- ===========================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  zone TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 5. FEEDBACK TABLE (User feedback and PHC issue reports)
-- ===========================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  facility_name TEXT,
  issue_type TEXT,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 6. PHC_FACILITIES TABLE (Primary Healthcare Center locations)
-- ===========================================
CREATE TABLE IF NOT EXISTS phc_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  ward TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  capacity INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 7. POLICY_COMMITMENTS TABLE (Government policy information)
-- ===========================================
CREATE TABLE IF NOT EXISTS policy_commitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT,
  commitment_date DATE,
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'cancelled')),
  responsible_party TEXT,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 8. THEMATIC_CATEGORIES TABLE (Health topic categories)
-- ===========================================
CREATE TABLE IF NOT EXISTS thematic_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category TEXT,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 9. NOTIFICATIONS TABLE (User notifications)
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  related_entity_type TEXT, -- 'report', 'feedback', 'disease', etc.
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 10. CHAT_HISTORY TABLE (AI chatbot conversation history)
-- ===========================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
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

-- Profiles policies
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

-- Reports policies
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

-- Diseases policies (public read, admin write)
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

-- Messages policies
CREATE POLICY "Users can view messages in their zones" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND state = messages.zone
    )
  );

CREATE POLICY "Users can send messages to their zones" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND state = messages.zone
    )
  );

-- Feedback policies
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

-- PHC Facilities policies (public read, admin write)
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

-- Policy Commitments policies (public read, admin write)
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

-- Thematic Categories policies (public read, admin write)
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

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Chat History policies
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- SEED DATA
-- ===========================================

-- Insert sample profiles
INSERT INTO profiles (id, full_name, email, role, state, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Super Admin', 'admin@ismph.org', 'super_admin', 'Lagos', '+2348012345678'),
  ('00000000-0000-0000-0000-000000000002', 'Lagos Admin', 'lagos@ismph.org', 'state_admin', 'Lagos', '+2348012345679'),
  ('00000000-0000-0000-0000-000000000003', 'Kano Admin', 'kano@ismph.org', 'state_admin', 'Kano', '+2348012345680'),
  ('00000000-0000-0000-0000-000000000004', 'Kaduna Admin', 'kaduna@ismph.org', 'state_admin', 'Kaduna', '+2348012345681');

-- Insert sample diseases
INSERT INTO diseases (name, state, zone, total_cases, active_cases, recovered, deaths) VALUES
  ('Malaria', 'Lagos', 'Lagos Central', 150, 45, 100, 5),
  ('Typhoid', 'Lagos', 'Lagos Central', 75, 20, 50, 5),
  ('COVID-19', 'Lagos', 'Lagos Central', 200, 10, 185, 5),
  ('Malaria', 'Kano', 'Kano Municipal', 300, 80, 210, 10),
  ('Measles', 'Kano', 'Kano Municipal', 120, 30, 85, 5),
  ('Malaria', 'Kaduna', 'Kaduna North', 180, 50, 125, 5),
  ('Tuberculosis', 'Kaduna', 'Kaduna North', 90, 25, 60, 5),
  ('Malaria', 'Abuja', 'Abuja Municipal', 95, 15, 75, 5),
  ('Cholera', 'Abuja', 'Abuja Municipal', 45, 10, 30, 5),
  ('Dengue', 'Abuja', 'Abuja Municipal', 25, 5, 18, 2);

-- Insert sample PHC facilities
INSERT INTO phc_facilities (name, state, lga, ward, address, latitude, longitude, phone, services, capacity) VALUES
  ('Ikeja PHC', 'Lagos', 'Ikeja', 'Ikeja Central', '123 Health Street, Ikeja', 6.5244, 3.3792, '+2348012345001', '["General Consultation", "Maternal Care", "Immunization", "Laboratory"]'::jsonb, 200),
  ('Garki Hospital', 'Abuja', 'Garki', 'Garki Central', '456 Medical Avenue, Garki', 9.0765, 7.3986, '+2348012345002', '["Emergency Care", "Surgery", "Radiology", "Pharmacy"]'::jsonb, 500),
  ('Kano PHC', 'Kano', 'Kano Municipal', 'Kumbotso', '789 Wellness Road, Kano', 12.0022, 8.5919, '+2348012345003', '["General Consultation", "Maternal Care", "Laboratory"]'::jsonb, 150),
  ('Kaduna General Hospital', 'Kaduna', 'Kaduna North', 'Kaduna Central', '321 Care Boulevard, Kaduna', 10.5105, 7.4165, '+2348012345004', '["Emergency Care", "Surgery", "Immunization", "Pharmacy"]'::jsonb, 400);

-- Insert sample policy commitments
INSERT INTO policy_commitments (title, description, category, state, commitment_date, deadline, status, responsible_party, progress_percentage) VALUES
  ('Universal Health Coverage', 'Achieve 100% health insurance coverage for all citizens', 'Health Insurance', 'Lagos', '2025-01-01', '2027-12-31', 'active', 'Lagos State Ministry of Health', 65),
  ('Primary Healthcare Strengthening', 'Upgrade all PHC facilities with modern equipment', 'Infrastructure', 'Kano', '2025-02-01', '2026-12-31', 'active', 'Kano State Government', 40),
  ('Maternal Mortality Reduction', 'Reduce maternal mortality by 50% through improved care', 'RMNCAH', 'Kaduna', '2025-03-01', '2028-12-31', 'active', 'Kaduna State Health Board', 30),
  ('Disease Surveillance System', 'Implement real-time disease monitoring across all states', 'Surveillance', 'Abuja', '2025-01-15', '2026-06-30', 'active', 'Federal Ministry of Health', 80);

-- Insert sample thematic categories
INSERT INTO thematic_categories (name, description, priority) VALUES
  ('RMNCAH', 'Reproductive, Maternal, Newborn, Child and Adolescent Health', 1),
  ('RMNCAH+N', 'Reproductive, Maternal, Newborn, Child and Adolescent Health + Nutrition', 1),
  ('Contributory Health Insurance', 'Health insurance and financing schemes', 2),
  ('PHC Agenda', 'Primary Healthcare strengthening and development', 1),
  ('Capacity Building', 'Training and skill development programs', 2),
  ('Other Health Report', 'General health-related reports and updates', 3),
  ('SWAp Unit Activity', 'Sector-Wide Approach program activities', 2),
  ('Accountability Meeting', 'Stakeholder accountability and review meetings', 2),
  ('Co-creation Meeting', 'Collaborative planning and development meetings', 2),
  ('Review Meeting', 'Program and policy review meetings', 2),
  ('Alliance Meeting', 'Partnership and alliance building activities', 2),
  ('Immunization', 'Vaccination and immunization programs', 1);

-- Insert sample reports
INSERT INTO reports (user_id, title, category, description, state, status, priority, reporter_name, reporter_phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Equipment Shortage at Ikeja PHC', 'Equipment Shortage', 'Critical shortage of medical equipment affecting patient care quality.', 'Lagos', 'pending', 'high', 'John Doe', '+2348012345678'),
  ('00000000-0000-0000-0000-000000000002', 'Excellent Service at Garki Hospital', 'Service Quality', 'Commendable service delivery and staff professionalism.', 'Abuja', 'approved', 'low', 'Jane Smith', '+2348012345679');

-- Insert sample feedback
INSERT INTO feedback (user_id, facility_name, issue_type, description, status, priority, contact_info) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ikeja PHC', 'Equipment', 'Medical equipment not functioning properly', 'pending', 'high', '+2348012345678'),
  ('00000000-0000-0000-0000-000000000002', 'Garki Hospital', 'Staff', 'Excellent service from medical staff', 'resolved', 'low', '+2348012345679');

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phc_facilities_updated_at BEFORE UPDATE ON phc_facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policy_commitments_updated_at BEFORE UPDATE ON policy_commitments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Reports indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_state ON reports(state);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);

-- Diseases indexes
CREATE INDEX idx_diseases_state ON diseases(state);
CREATE INDEX idx_diseases_zone ON diseases(zone);

-- Messages indexes
CREATE INDEX idx_messages_zone ON messages(zone);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Feedback indexes
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);

-- PHC Facilities indexes
CREATE INDEX idx_phc_facilities_state ON phc_facilities(state);
CREATE INDEX idx_phc_facilities_lga ON phc_facilities(lga);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Chat History indexes
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);