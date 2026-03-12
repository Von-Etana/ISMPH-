export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  type: 'news' | 'report';
  state: 'Kaduna' | 'Kano' | 'Lagos';
  url: string;
  mediaType: 'Print' | 'Radio' | 'TV' | 'Social Media' | 'Online';
}

// Parsed data from recent reports (2025-2026)
export const ALL_NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-2026-01',
    title: 'Tinubu Transmits 24 Health Bills to Senate for Legislative Action',
    description: 'President Bola Tinubu transmitted 24 health-related bills to the Senate to streamline governance across health institutions.',
    source: 'Punch Healthwise',
    date: '2026-01-27',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://healthwise.punchng.com/tinubu-transmits-24-health-bills-to-senate-for-legislative-action/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-02',
    title: 'Nigeria Approves First National Policy on Cosmetics Safety and Health',
    description: 'The Federal Government launched its first national policy to regulate the manufacture, sale, and disposal of cosmetics.',
    source: 'World Health Organization (WHO) / Africa.com',
    date: '2026-03-11',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://africa.com/nigeria-adopts-national-policy-to-strengthen-cosmetics-safety/',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-03',
    title: 'Federal Government Launches Second National Action Plan on Health Security',
    description: 'A new action plan was introduced to integrate disease surveillance, immunization, and veterinary services into a single emergency response framework.',
    source: 'Premium Times',
    date: '2026-03-08',
    category: 'Capacity Building',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://www.premiumtimesng.com/health/health-news/862313-nigeria-trains-78000-health-workers-in-two-years-expands-insurance-coverage-to-21-7m.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-04',
    title: 'Nigeria and United States Sign $5.1 Billion Health Cooperation Deal',
    description: 'A five-year MoU was signed between Nigeria and the U.S. to strengthen disease control and domestic health financing.',
    source: 'Premium Times',
    date: '2025-12-19',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.premiumtimesng.com/health/health-interviews/856661-us-nigeria-health-deal-offers-huge-prospects-but-concerns-remain.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-05',
    title: 'Public Consultation Launched on Social Media Age Restrictions for Children',
    description: 'The Ministry of Communications, Innovation, and Digital Economy is exploring age limits to address digital harms and the mental health crisis among adolescents.',
    source: 'Techpoint Africa',
    date: '2026-03-10',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://techpoint.africa/news/nigeria-considers-children-social-media-restrictions/',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-06',
    title: 'Lassa Fever Kills 99 Nigerians in First Eight Weeks of 2026',
    description: 'Official data from the NCDC reported 99 deaths and nearly 2,000 suspected cases across 18 states during the first two months of the year.',
    source: 'The PUNCH',
    date: '2026-03-11',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://punchng.com/lassa-fever-kills-99-cases-near-2000/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-07',
    title: 'Nigeria Receives Long-Acting HIV Prevention Injection (Lenacapavir)',
    description: 'The Federal Government confirmed receipt of Lenacapavir, an injectable PrEP administered twice yearly, to improve adherence for at-risk populations.',
    source: 'News Agency of Nigeria (NAN) / The PUNCH',
    date: '2026-03-12',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://punchng.com/nigeria-receives-hiv-prevention-injection-2/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-08',
    title: 'Hypertension Affects Up to 40% of Nigerian Adults, Report Warns',
    description: 'The State of Health of the Nation Report 2025 indicates that high blood pressure remains one of Nigeria\'s most critical public health challenges.',
    source: 'The Nation Newspaper',
    date: '2026-03-12',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://thenationonlineng.net/hypertension-affects-up-to-40-of-nigerian-adults-report-warns/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-09',
    title: 'About 14 Million Nigerians Living with Glaucoma',
    description: 'The Federal Government raised concerns that 14 million Nigerians have glaucoma, with 90-94% unaware of their condition.',
    source: 'The Guardian Nigeria',
    date: '2026-03-12',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://guardian.ng/features/health/about-14-million-nigerians-living-with-glaucoma-says-fg/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-10',
    title: 'Malaria Vaccine Rollout Begins in Bayelsa and Kebbi States',
    description: 'Nigeria has commenced the implementation of the malaria vaccine in two pilot states to reduce child mortality.',
    source: 'Agency Report / Premium Times',
    date: '2026-03-08',
    category: 'Immunization',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.premiumtimesng.com/health/health-news/862313-nigeria-trains-78000-health-workers-in-two-years-expands-insurance-coverage-to-21-7m.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-11',
    title: 'NCDC Issues Advisory on Cerebrospinal Meningitis (CSM)',
    description: 'A public health advisory was released urging heightened state-level vigilance as the country enters the peak transmission season for meningitis.',
    source: 'Nigeria Centre for Disease Control and Prevention',
    date: '2026-03-03',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://ncdc.gov.ng/news/press',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-12',
    title: 'Cholera Hotspot Mapping Identifies 134 LGAs as High Priority',
    description: 'New multi-sectoral intervention (PAMI) tools have identified 134 LGAs as priority zones for cholera prevention and WASH investments.',
    source: 'GTFCC PAMI Report',
    date: '2026-04-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://www.gtfcc.org/wp-content/uploads/2025/04/pami-report-nigeria.pdf',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-13',
    title: 'Nigeria Records 50% Drop in Facility-Based Maternal Deaths',
    description: 'Maternal deaths in health facilities fell from 904 in 2024 to 460 in 2025, credited to expanded obstetric services.',
    source: 'Premium Times',
    date: '2026-03-10',
    category: 'RMNCAH',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.premiumtimesng.com/news/headlines/862857-nigeria-records-50-drop-in-maternal-deaths-in-health-facilities-report.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-14',
    title: '2,125 Primary Health Centres Fully Revitalized Nationwide',
    description: 'The NPHCDA announced that 2,125 facilities are now functional and fully equipped, with 1,671 more undergoing renovation.',
    source: 'Premium Times / NPHCDA',
    date: '2025-12-10',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://www.premiumtimesng.com/news/top-news/841959-2125-primary-health-centres-now-fully-revitalised-across-nigeria-nphcda.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-15',
    title: 'Medical Tourism Spending Crashes by 96.2% Year-on-Year',
    description: 'Central Bank data showed a steep decline in outward medical spending, reflecting tighter FX controls and growing capacity in domestic high-end hospitals.',
    source: 'BusinessDay / Duchess Hospital',
    date: '2026-01-09',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://duchesshospital.com/news-center/nigerias-shift-away-from-medical-tourism-insights-from-a-businessday-report/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-16',
    title: 'Nigeria Trains 78,146 Health Workers to Support PHC Services',
    description: 'The government has trained over 78,000 frontline health workers in two years, reaching 65% of the sector-wide goal.',
    source: 'Premium Times / Agency Report',
    date: '2026-03-08',
    category: 'Capacity Building',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://allafrica.com/stories/202603090064.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-17',
    title: 'One in Three Nigerian Adolescents Found to be Underweight',
    description: 'A national health report revealed that 33% of Nigerian adolescents are thin or underweight, prompting calls for urgent nutrition interventions.',
    source: 'Premium Times',
    date: '2026-03-11',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://www.premiumtimesng.com/health/health-news/863372-one-in-three-nigerian-adolescents-underweight-report.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-18',
    title: 'National Summit on Diagnostics Institutionalized as Annual Platform',
    description: 'The 2026 National Summit on Diagnostics in Abuja established an annual framework to strengthen local manufacturing and medical laboratory systems.',
    source: 'Federal Ministry of Information and National Orientation',
    date: '2026-03-11',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://fmino.gov.ng/diagnostics-foundation-of-modern-health-care-holds-strategic-place-in-renewed-hope-health-reforms-says-salako/',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-19',
    title: 'FCT 2026 Statutory Budget of N2.2 Trillion Approved for Second Reading',
    description: 'The FCT’s 2026 budget prioritizes healthcare facilities, social services, and the upgrade of 20 primary health centers to Tier 2 status.',
    source: 'Vanguard News',
    date: '2026-03-11',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.vanguardngr.com/2026/03/senate-approves-second-reading-of-fct-n2-2trn-2026-appropriation-bill/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-20',
    title: 'Young Innovators Unveil AI Solutions for Visually Impaired',
    description: 'Students at the Codeavour 7.0 National Championship showcased AI-powered audio wearable glasses to expand healthcare access and independent living.',
    source: 'The PUNCH',
    date: '2026-03-10',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://punchng.com/young-innovators-unveil-ai-solutions-to-expand-healthcare-access/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-21',
    title: 'Pharmaceutical Firms\' Profits Hit Decade-High Following Tax Waivers',
    description: 'Profits for listed pharma firms rose from N6.5 billion to N14.8 billion in 2025, driven by a Presidential Order waiving taxes on raw materials.',
    source: 'BusinessDay',
    date: '2026-03-03',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://businessday.ng/news/article/pharmaceutical-firms-profits-hit-decade-high-on-tax-waiver-stable-naira/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-22',
    title: 'Nigeria Expands Health Insurance Coverage to 21.7 Million People',
    description: 'The NHIA reported an increase in enrollment from 19.2 million in 2024 to 21.7 million in 2025, moving closer to universal health coverage.',
    source: 'Premium Times',
    date: '2026-03-08',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.premiumtimesng.com/health/health-news/862313-nigeria-trains-78000-health-workers-in-two-years-expands-insurance-coverage-to-21-7m.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-23',
    title: 'Royal Leaders Demand 70% Local Drug Production by 2030',
    description: 'Traditional rulers and health experts at the NAIP Forum urged the government to end the 70% dependency on imported drugs to ensure national security.',
    source: 'The Guardian Nigeria / Voice of Nigeria',
    date: '2026-03-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://guardian.ng/news/royal-leaders-health-experts-demand-urgent-push-for-local-drug-production-by-2030/',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-24',
    title: 'Breast Cancer Care Doubles Under NHIA Public Insurance Scheme',
    description: 'Collaborative efforts between Roche and the NHIA have doubled the number of women receiving appropriate breast cancer treatment in 2025.',
    source: 'News Agency of Nigeria (NAN)',
    date: '2026-03-10',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://nannews.ng/nigerias-insurance-push-expands-breast-cancer-care-roche-africa/',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-25',
    title: 'NAFDAC Seizes and Destroys N1 Trillion Worth of Substandard Drugs',
    description: 'In 2025, regulatory enforcement led to the destruction of over N1 trillion in counterfeit, expired, and banned medical products.',
    source: 'Premium Times / NAN',
    date: '2026-03-08',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://allafrica.com/stories/202603090064.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-26',
    title: 'NPHCDA Increases Quarterly Capitation Payments for PHCs',
    description: 'To combat inflation, capitation for high-volume primary health centers was increased to N800,000 per quarter.',
    source: 'Premium Times',
    date: '2025-12-10',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://www.premiumtimesng.com/news/top-news/841959-2125-primary-health-centres-now-fully-revitalised-across-nigeria-nphcda.html',
    mediaType: 'Print'
  },
  {
    id: 'news-2026-27',
    title: 'Nutrition Financing Subcommittee Formed by National Council on Nutrition',
    description: 'Chaired by Prof. Muhammad Pate, a new subcommittee will develop a sustainable funding roadmap for Nigeria’s nutrition interventions within 30 days.',
    source: 'State House, Abuja',
    date: '2026-03-05',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://statehouse.gov.ng/ncn-sets-up-committee-to-develop-funding-structure-for-nigerias-nutrition-interventions/',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-28',
    title: 'Only 17% of Africans Have Access to Essential Oral Health Services',
    description: 'WHO Regional Director raised concerns over the severe shortage of dentists and high prevalence of dental caries in children.',
    source: 'WHO / Premium Times',
    date: '2026-03-11',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://allafrica.com/stories/202603120084.html',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-29',
    title: 'Mental Health Literacy Initiative Launched in Four Nigerian Universities',
    description: 'The Mentally Aware Nigeria Initiative (MANI) implemented the "Bridging the Gap" project to address rising suicide rates and stigma among students.',
    source: 'ReliefWeb',
    date: '2026-03-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://reliefweb.int/job/4202363/project-final-evaluation-consultancy-nigeria',
    mediaType: 'Online'
  },
  {
    id: 'news-2026-30',
    title: 'Resident Doctors (NARD) Threaten Industrial Action for January 12',
    description: 'The Nigerian Association of Resident Doctors warned of nationwide strikes if welfare agreements and health policy implementation remain stalled.',
    source: 'The PUNCH',
    date: '2026-01-01',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://punchng.com/2026-outlook-reviving-education-health/',
    mediaType: 'Print'
  }
];

// State program officers data
export const STATE_PROGRAM_OFFICERS = {
  kaduna: {
    name: 'SABUWA YAHAY',
    designation: 'STATE PROG. OFFICER',
    state: 'KADUNA (SPO)',
    phone: '08039627357',
    email: 'ysabuwa@lsmph.org'
  },
  kano: {
    name: 'Peace Micheal',
    designation: 'STATE Program Officer',
    state: 'LAGOS STATE (SPO)',
    phone: '07033642943',
    email: 'mpeace@lsmph.org'
  },
  lagos: {
    name: 'Bako Abdul Usman',
    designation: 'STATE PROGRAM OFFICER KADUNA',
    state: 'KADUNA',
    phone: '08060674537',
    email: 'abako@lsmph.org'
  }
};

// Helper functions
export const getNewsByCategory = (category: string): NewsArticle[] => {
  return ALL_NEWS_DATA.filter(article => article.category === category);
};

export const getNewsByState = (state: string): NewsArticle[] => {
  return ALL_NEWS_DATA.filter(article => article.state.toLowerCase() === state.toLowerCase());
};

export const getNewsByStateAndCategory = (state: string, category: string): NewsArticle[] => {
  return ALL_NEWS_DATA.filter(article =>
    article.state.toLowerCase() === state.toLowerCase() &&
    article.category === category
  );
};