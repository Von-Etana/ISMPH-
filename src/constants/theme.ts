import {
  Baby,
  Hospital,
  Handshake,
  CreditCard,
  Milk,
  DollarSign,
  FileText,
  BarChart3,
  type LucideIcon
} from 'lucide-react-native';

export const COLORS = {
  primary: '#00695C', // Richer Teal/Green
  primaryDark: '#004D40',
  primaryLight: '#4DB6AC',
  secondary: '#C62828', // Deeper Red
  secondaryDark: '#8E0000',
  secondaryLight: '#EF5350',
  accent: '#FFD740', // Amber Accent
  background: '#F8F9FA', // Softer White
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  text: '#263238', // Blue-ish Grey for text instead of pure black
  textDark: '#ECEFF1',
  textSecondary: '#546E7A',
  textSecondaryDark: '#B0BEC5',
  border: '#CFD8DC',
  borderDark: '#37474F',
  error: '#D32F2F',
  warning: '#FFA000',
  info: '#0288D1',
  success: '#2E7D32',
  white: '#FFFFFF',
  black: '#000000',
  priorityLow: '#4CAF50',
  priorityMedium: '#FFC107',
  priorityHigh: '#FF9800',
  priorityCritical: '#D32F2F',
  severityLow: '#4CAF50',
  severityMedium: '#FFC107',
  severityHigh: '#FF9800',
  severityCritical: '#D32F2F',
  statusPending: '#FFA000',
  statusApproved: '#2E7D32',
  statusRejected: '#C62828',
  statusDraft: '#78909C',
  statusResolved: '#2E7D32',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};

export const STATES = ['Lagos', 'Abuja', 'Kano', 'Kaduna'];
export const ZONES = ['North', 'South', 'East', 'West', 'Federal'] as const;

export interface ThematicCategory {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const THEMATIC_CATEGORIES: ThematicCategory[] = [
  {
    id: '1',
    name: 'RMNCAH',
    fullName: 'Reproductive Maternal, Newborn, Child, and Adolescent Health',
    description: 'Comprehensive health services for mothers, newborns, children, and adolescents',
    icon: Baby,
    color: '#E91E63',
  },
  {
    id: '2',
    name: 'Primary Health Care',
    fullName: 'Primary Health Care',
    description: 'Basic health services and facilities at the community level',
    icon: Hospital,
    color: '#2196F3',
  },
  {
    id: '3',
    name: 'SWAp',
    fullName: 'Sector Wide Approach',
    description: 'Coordinated approach to health sector development and financing',
    icon: Handshake,
    color: '#9C27B0',
  },
  {
    id: '4',
    name: 'Contributory Health Insurance',
    fullName: 'National Health Insurance Scheme',
    description: 'Healthcare financing and insurance coverage programs',
    icon: CreditCard,
    color: '#FF9800',
  },
  {
    id: '5',
    name: 'Small and Sick Newborn',
    fullName: 'Small and Sick Newborn Care',
    description: 'Specialized care for premature and critically ill newborns',
    icon: Milk,
    color: '#F44336',
  },
  {
    id: '6',
    name: 'Health Budget/Finance',
    fullName: 'Health Budget and Finance',
    description: 'Healthcare funding, budgets, and financial management',
    icon: DollarSign,
    color: '#4CAF50',
  },
  {
    id: '7',
    name: 'Health Policy/Legislation',
    fullName: 'Health Policy and Legislation',
    description: 'Healthcare laws, policies, and regulatory frameworks',
    icon: FileText,
    color: '#00BCD4',
  },
  {
    id: '8',
    name: 'Health Accountability',
    fullName: 'Health Accountability and Transparency',
    description: 'Monitoring, evaluation, and transparency in healthcare delivery',
    icon: BarChart3,
    color: '#673AB7',
  },
];

export const FEEDBACK_CATEGORIES = [
  'Service Quality',
  'Infrastructure',
  'Staff Behavior',
  'Equipment Shortage',
  'Drug Availability',
  'Emergency Response',
  'Cleanliness/Hygiene',
  'Wait Times',
  'Staff Competence',
  'Facility Access',
  'Others',
];

export const FEEDBACK_TAGS = [
  'Urgent',
  'Routine',
  'Follow-up',
  'Compliment',
  'Complaint',
  'Suggestion',
  'Equipment',
  'Medicine',
  'Staff',
  'Facility',
  'Emergency',
  'Maternity',
  'Pediatric',
  'General',
];
