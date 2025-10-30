export type UserRole = 'public' | 'staff' | 'state_admin' | 'super_admin';
export type LanguageCode = 'en' | 'ha' | 'yo' | 'ig';
export type ReportStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'resolved' | 'critical';
export type DiseaseSeverity = 'low' | 'medium' | 'high' | 'critical';
export type Zone = 'North' | 'South' | 'East' | 'West' | 'Federal';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  state: string | null;
  avatar_url: string | null;
  language_preference: LanguageCode;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Disease {
  id: string;
  disease_name: string;
  zone: Zone;
  state: string;
  new_cases: number;
  total_cases: number;
  mortality: number;
  recovered: number;
  severity: DiseaseSeverity;
  last_updated: string;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  state: string;
  title: string;
  category: string;
  description: string;
  priority: ReportPriority;
  status: ReportStatus;
  media_urls: string[];
  created_at: string;
  updated_at: string;
}
