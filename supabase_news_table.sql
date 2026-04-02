-- NEW: NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  state TEXT CHECK (state IN ('Kaduna', 'Kano', 'Lagos', 'National')),
  link TEXT,
  type TEXT DEFAULT 'news' CHECK (type IN ('news', 'media')),
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Everyone can view approved news" ON news;
CREATE POLICY "Everyone can view approved news" ON news FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Admins can manage news" ON news;
CREATE POLICY "Admins can manage news" ON news FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('state_admin', 'super_admin'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);

-- Trigger for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
