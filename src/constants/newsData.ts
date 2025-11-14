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

// Parsed data from Excel file - Kaduna Sheet
const KADUNA_NEWS: NewsArticle[] = [
  // May 2025
  {
    id: 'kaduna-2025-05-01',
    title: 'Kaduna Govt Moves to Recruit 1800 Health Workers',
    description: 'Kaduna State Government announces plans to recruit 1800 additional health workers to strengthen healthcare delivery.',
    source: 'TGNews',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://tgnews.com.ng/kaduna-govt-moves-to-recruit-1800-health-workers/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-02',
    title: 'ISMPH Trains Kaduna Journalists on Health Reporting',
    description: 'Capacity building workshop for journalists to improve health reporting and advocacy.',
    source: 'Vanguard',
    date: '2025-05-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.vanguardngr.com/2025/05/ismph-trains-kaduna-journalists-on-health-reporting-build-capacity/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-03',
    title: 'Kaduna Govt Targets 2.8M Children for Azithromycin Administration',
    description: 'Mass drug administration program to combat infectious diseases in Kaduna State.',
    source: 'The Sun',
    date: '2025-05-01',
    category: 'RMNCAH',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://thesun.ng/kaduna-govt-malaria-consortium-target-2-8m-children-for-azithromycin-administration/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-04',
    title: 'Kaduna UNICF Partnership Drives Mobile Health Services',
    description: 'Mobile health services reach remote communities through UNICF partnership.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://newswebexpress.com/kaduna-unicef-partnership-drives-mobile-health-services-to-remote-communities/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-05',
    title: 'Kaduna Targets Informal Sector for Health Insurance',
    description: 'New drive to enroll informal sector workers into contributory health scheme.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Contributory Health Insurance',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://newswebexpress.com/kaduna-targets-informal-sector-in-new-drive-for-health-insurance-enrollment/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-06',
    title: 'Stakeholders Mobilise LGA Chairmen Spouses to Boost PHC Services',
    description: 'Wives of LGA chairmen empowered to champion uptake of primary healthcare services.',
    source: 'VON',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://von.gov.ng/stakeholders-mobilise-lga-chairmen-spouses-to-booost-phc-services/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-07',
    title: 'SCI to Provide Healthcare Support for 1000 Children with Disabilities',
    description: 'Specialized healthcare support for children with disabilities under ROOSC project.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://newswebexpress.com/sci-to-provide-healthcare-support-for-1000-children-with-disabilities-in-kaduna-under-roosc-project/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-05-08',
    title: 'Alive Thrive Kaduna Govt Boost Support for MMS Logistics Supply',
    description: 'Enhanced support for maternal, newborn and child health logistics.',
    source: 'The News Icon',
    date: '2025-06-01',
    category: 'RMNCAH+N',
    priority: 'medium',
    type: 'news',
    state: 'Kaduna',
    url: 'https://thenewsicon.com/2025/05/31/alive-thrive-kaduna-govt-boost-support-for-mms-logistics-supply/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-06-01',
    title: 'Kaduna Govt Targets Return of 100,000 Out-of-School Children',
    description: 'Comprehensive program to return out-of-school children to education.',
    source: 'Vanguard',
    date: '2025-06-01',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://www.vanguardngr.com/2025/06/kaduna-govt-sci-unicef-target-return-of-100000-out-of-school-children/',
    mediaType: 'Print'
  },
  {
    id: 'kaduna-2025-08-01',
    title: 'Gavi Pledges 3 Million to Boost Immunization in Kaduna State',
    description: 'International support to strengthen routine immunization and primary healthcare.',
    source: 'Newsweb Express',
    date: '2025-08-01',
    category: 'RMNCAH+N',
    priority: 'high',
    type: 'news',
    state: 'Kaduna',
    url: 'https://newswebexpress.com/gavi-pledges-3-million-to-boost-immunization-in-kaduna-state/',
    mediaType: 'Print'
  }
];

// Kano News Data
const KANO_NEWS: NewsArticle[] = [
  {
    id: 'kano-2025-05-01',
    title: 'ISMPH Organizes Training for Kano Journalists on Maternal Mortality Reduction',
    description: 'Capacity building workshop to improve maternal health reporting in Kano.',
    source: 'Pyramid Radio',
    date: '2025-05-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://pyramidradiokano.com/ismph-organizes-a-training-to-kano-journalists-on-how-to-reduce-maternal-mortality/',
    mediaType: 'Radio'
  },
  {
    id: 'kano-2025-05-02',
    title: 'Kano Govt Commits to 24/7 Health Services in All 484 Wards',
    description: 'State government ensures round-the-clock healthcare services across all wards.',
    source: 'Nigerian Info',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://www.nigeriainfo.fm/news/homepagelagos/kano-government-commits-to-24-7-health-services-in-all-484-wards/',
    mediaType: 'Radio'
  },
  {
    id: 'kano-2025-05-03',
    title: 'Kano Govt Unveils Bold Healthcare Reforms',
    description: 'Comprehensive healthcare reforms to improve service delivery in Kano State.',
    source: 'KSCHMA',
    date: '2025-05-01',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://www.kschma.org/2025/05/13/knsg-unveils-bold-healthcare-reforms/',
    mediaType: 'Print'
  },
  {
    id: 'kano-2025-05-04',
    title: 'Kano Govt Renames Over 200 PHCs Across the State',
    description: 'Renaming and renovation of primary healthcare centers to improve service delivery.',
    source: 'Radio Kano',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://radiokano.org.ng/knsg-renovates-over-two-hundred-phcs-across-the-state/',
    mediaType: 'Radio'
  },
  {
    id: 'kano-2025-05-05',
    title: 'Kano Govt Provides Free Check-up for World Hypertension Day',
    description: 'Free health screening and check-ups across Kano facilities.',
    source: 'Pyramid Radio',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://pyramidradiokano.com/2025-world-hypertension-day-kano-govt-provides-free-check-up-across-its-facilities-dr-labaran/',
    mediaType: 'Radio'
  },
  {
    id: 'kano-2025-07-01',
    title: 'Kano Govt Develops Strategic Communication Blueprint for Maternal Health',
    description: 'New communication strategy to boost maternal and child health outcomes.',
    source: 'Pyramid Radio',
    date: '2025-07-01',
    category: 'RMNCAH',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://pyramidradiokano.com/knsg-develops-strategic-communication-blueprint-to-boost-maternal-and-child-health/',
    mediaType: 'Radio'
  },
  {
    id: 'kano-2025-07-02',
    title: 'Kano Health Ministry Partners with KNHA, EngenderHealth, LISDEL',
    description: 'Multi-stakeholder partnership to improve primary healthcare delivery.',
    source: 'Prime Times News',
    date: '2025-07-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://primetimenews.ng/kano-health-ministry-partners-knha-engenderhealth-lisdel-to-improve-phc-delivery-health-outcomes/?amp=1',
    mediaType: 'Print'
  },
  {
    id: 'kano-2025-07-03',
    title: 'Governor Yusuf Approves Foreign Training for Kano Nurses and Doctors',
    description: 'Masters program training abroad for Kano healthcare workers.',
    source: 'Global Tracker',
    date: '2025-07-01',
    category: 'Capacity Building',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://globaltrackerng.com/2025/07/22/governor-yusuf-approves-foreign-training-for-kano-nurses-and-doctors-to-pursue-masters-programmes-in-various-fields/',
    mediaType: 'Print'
  },
  {
    id: 'kano-2025-10-01',
    title: 'Kano Govt Launches Measles-Rubella Vaccination Campaign',
    description: 'Mass vaccination campaign targeting 7.8 million children.',
    source: 'Prime Time News',
    date: '2025-10-01',
    category: 'Immunization',
    priority: 'high',
    type: 'news',
    state: 'Kano',
    url: 'https://primetimenews.ng/kano-govt-launches-measles-rubella-vaccination-campaign-targets-7-6m-children/?amp=1',
    mediaType: 'Print'
  },
  {
    id: 'kano-2025-10-02',
    title: 'Kano Govt Launches Free Maternity AE Commodities Distribution',
    description: 'Monthly distribution of free maternity and antenatal care commodities.',
    source: 'Pyramid Radio',
    date: '2025-10-01',
    category: 'RMNCAH',
    priority: 'medium',
    type: 'news',
    state: 'Kano',
    url: 'https://pyramidradiokano.com/kano-govt-lunches-the-distribution-of-free-maternity-ae-commodities-for-the-month-of-october/',
    mediaType: 'Radio'
  }
];

// Lagos News Data
const LAGOS_NEWS: NewsArticle[] = [
  {
    id: 'lagos-2025-06-01',
    title: 'ISMPH-EngenderHealth Consortium Partner Lagos State to Train Journalists',
    description: 'Media training program to improve health reporting and advocacy in Lagos.',
    source: 'Smartview Magazine',
    date: '2025-06-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://www.smartviewsmagazine.net/news/ismph-engenderhealth-consortium-partner-lagos-state-to-train-journalists/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-06-02',
    title: 'Lagos Govt Reaffirms Drive Toward Universal Health Coverage',
    description: 'Continued commitment to Ilera Eko health insurance scheme expansion.',
    source: 'Bond FM',
    date: '2025-06-01',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://radionigerialagos.gov.ng/ilera-eko-lasg-reaffirms-drive-toward-universal-health-coverage/',
    mediaType: 'Radio'
  },
  {
    id: 'lagos-2025-06-03',
    title: 'Experts Urge Responsible Storytelling to Aid Public Health Outcomes',
    description: 'Media professionals trained on ethical health reporting practices.',
    source: 'Guardian Newspaper',
    date: '2025-06-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://guardian.ng/features/science/experts-urge-responsible-storytelling-to-aid-public-health-outcomes/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-07-01',
    title: 'Lagos Launches Strategic Health Planning Workshop',
    description: 'SWAp initiative workshop to strengthen health system reform and budgeting.',
    source: 'Daily Independent',
    date: '2025-07-01',
    category: 'SWAp Unit Activity',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://independent.ng/lagos-launches-strategic-health-planning-workshop-to-strengthen-system-reform-budgeting/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-07-02',
    title: 'Lagos Begins Implementation of SWAp Initiative',
    description: 'Sector-wide approach to strengthen health system performance.',
    source: 'Punch Newspaper',
    date: '2025-07-01',
    category: 'SWAp Unit Activity',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://healthwise.punchng.com/lagos-begins-implementation-of-swap-initiative-to-strengthen-health-system/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-08-01',
    title: 'LASAM Consortium Partners Deliberate on Efficient PHC Delivery',
    description: 'Stakeholder meeting to improve primary healthcare accountability.',
    source: 'Thisday Newspaper',
    date: '2025-08-01',
    category: 'Accountability Meeting',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://www.thisdaylive.com/2025/08/06/lasam-consortium-partners-deliberate-on-efficient-primary-healthcare-delivery/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-08-02',
    title: 'Traditional Media Urged to Drive Maternal Healthcare Reform',
    description: 'Capacity building for traditional media influencers on maternal health.',
    source: 'Daily Independent',
    date: '2025-08-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://independent.ng/traditional-media-urged-to-drive-maternal-healthcare-gender-reform-in-nigeria/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-08-03',
    title: 'EngenderHealth-Led Consortium Mobilises PHC Stakeholders',
    description: 'Co-creation meeting with PHCB to strengthen Lagos primary healthcare.',
    source: 'The Media Views',
    date: '2025-09-01',
    category: 'Co-creation Meeting',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://themediaviews.com/2025/08/30/engenderhealth-led-consortium-mobilises-phc-stakeholders-to-bolster-lagos-primary-healthcare/',
    mediaType: 'Online'
  },
  {
    id: 'lagos-2025-09-01',
    title: 'Stakeholders Seek Urgent Action to Halt Crisis in Councils PHC',
    description: 'Review meeting addresses gaps in primary healthcare funding and infrastructure.',
    source: 'Guardian Newspaper',
    date: '2025-09-01',
    category: 'Review Meeting',
    priority: 'high',
    type: 'news',
    state: 'Lagos',
    url: 'https://guardian.ng/features/health/stakeholders-seek-urgent-action-to-halt-crisis-in-councils-phc/',
    mediaType: 'Print'
  },
  {
    id: 'lagos-2025-09-02',
    title: 'Debunking the Myths: Lagos Champions Family Planning',
    description: 'Alliance meeting for CSOs and stakeholders on family planning advocacy.',
    source: 'New Telegraph',
    date: '2025-09-01',
    category: 'Alliance Meeting',
    priority: 'medium',
    type: 'news',
    state: 'Lagos',
    url: 'https://newtelegraphng.com/debunking-the-myths-lagos-champions-family-planning-as-path-to-healthier-families-stronger-future/',
    mediaType: 'Print'
  }
];

// Combine all news data
export const ALL_NEWS_DATA: NewsArticle[] = [
  ...KADUNA_NEWS,
  ...KANO_NEWS,
  ...LAGOS_NEWS
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