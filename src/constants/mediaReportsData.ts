/**
 * Media Health Reports Data
 * Extracted from Links to Media Health Reports in KKL.xlsx
 * Contains reports from Kaduna, Kano, and Lagos states
 */

export type ProgramType = 'Print' | 'TV' | 'Radio' | 'Social Media' | 'Online';
export type StateCode = 'Kaduna' | 'Kano' | 'Lagos';

export interface MediaReport {
    id: string;
    platform: string;
    programType: ProgramType;
    thematicArea: string;
    link: string;
    state: StateCode;
    month: string;
}

// State-specific colors
export const STATE_COLORS: Record<StateCode, { primary: string; light: string; text: string }> = {
    Kaduna: { primary: '#8B5CF6', light: '#EDE9FE', text: '#5B21B6' }, // Purple
    Kano: { primary: '#10B981', light: '#D1FAE5', text: '#065F46' },   // Green
    Lagos: { primary: '#F59E0B', light: '#FEF3C7', text: '#92400E' },  // Amber
};

// Thematic area colors
export const THEMATIC_COLORS: Record<string, string> = {
    'RMNCAH': '#EC4899',
    'RMNCAH+N': '#EC4899',
    'Contributory Health Insurance': '#3B82F6',
    'PHC Agenda': '#10B981',
    'Capacity Building': '#8B5CF6',
    'Immunization': '#F59E0B',
    'BHCPF': '#06B6D4',
    'Other Health Report': '#6B7280',
    'SWAp Unit Activity': '#14B8A6',
    'Accountability Meeting': '#F97316',
};

// Helper to normalize program type
function normalizeProgramType(type: string): ProgramType {
    const lower = type.toLowerCase();
    if (lower.includes('tv') || lower.includes('television')) return 'TV';
    if (lower.includes('radio')) return 'Radio';
    if (lower.includes('social') || lower.includes('twitter') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('linkedin')) return 'Social Media';
    if (lower.includes('online') || lower.includes('website') || lower.includes('blog')) return 'Online';
    return 'Print';
}

// Helper to extract title from URL
function extractTitle(link: string, platform: string): string {
    try {
        const url = new URL(link);
        const path = url.pathname.split('/').filter(Boolean).pop() || '';
        // Clean up the path - replace dashes/underscores with spaces
        const cleaned = path
            .replace(/[-_]/g, ' ')
            .replace(/\.(html|php|aspx?)$/i, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        return cleaned || `Report by ${platform}`;
    } catch {
        return `Report by ${platform}`;
    }
}

// KADUNA REPORTS
export const KADUNA_REPORTS: MediaReport[] = [
    // May 2025
    { id: 'kad-001', platform: 'Gamji Reporters', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://gamjireporters.com/2025/05/17/alive-thrive-boost-capacity-of-frontline-workers-on-mms-for-pregnant-mothers/', state: 'Kaduna', month: 'May-25' },
    { id: 'kad-002', platform: 'The News Icon', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://thenewsicon.com/2025/05/17/alive-thrive-boost-capacity-of-frontline-workers-on-mms-for-pregnant-mothers/', state: 'Kaduna', month: 'May-25' },
    { id: 'kad-003', platform: 'The Reporterdotnews', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://thereporterdotnews.wordpress.com/2025/05/17/alive-thrive-boost-capacity-of-frontline-health-workers-on-mms-for-pregnant-mothers/', state: 'Kaduna', month: 'May-25' },
    { id: 'kad-004', platform: 'Vanguard', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://www.vanguardngr.com/2025/05/bauchi-assembly-speaker-commends-kaduna-phc-board-dg/', state: 'Kaduna', month: 'May-25' },
    { id: 'kad-005', platform: 'Daily Independent', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://independent.ng/bauchi-assembly-speaker-commends-kaduna-phc-board-dg/', state: 'Kaduna', month: 'May-25' },
    { id: 'kad-006', platform: 'Vanguard', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://www.vanguardngr.com/2025/05/kaduna-jmam-stakeholders-urge-state-lgcs-to-commit-to-contributory-health-scheme/', state: 'Kaduna', month: 'May-25' },

    // June 2025
    { id: 'kad-007', platform: 'The News Icon', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://thenewsicon.com/2025/05/31/alive-thrive-kaduna-govt-boost-support-for-mms-logistics-supply/', state: 'Kaduna', month: 'Jun-25' },
    { id: 'kad-008', platform: 'Gamji Reports', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://gamjireporters.com/2025/05/31/alive-thrive-sphcb-boost-support-for-mms-logistics-supply/', state: 'Kaduna', month: 'Jun-25' },
    { id: 'kad-009', platform: 'Vanguard', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://www.vanguardngr.com/2025/06/kaduna-govt-sci-unicef-target-return-of-100000-out-of-school-children/', state: 'Kaduna', month: 'Jun-25' },
    { id: 'kad-010', platform: 'KADCHMA', programType: 'Social Media', thematicArea: 'Contributory Health Insurance', link: 'https://www.instagram.com/p/DKfJWBIo2W-/', state: 'Kaduna', month: 'Jun-25' },

    // July 2025
    { id: 'kad-011', platform: 'KADCHMA', programType: 'Social Media', thematicArea: 'Contributory Health Insurance', link: 'https://www.instagram.com/p/DMGS5c5obTS/', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-012', platform: 'Vanguard', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://www.vanguardngr.com/2025/07/kaduna-contributory-health-scheme-targets-informal-sector-for-universal-coverage/', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-013', platform: 'Tribune Online', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://tribuneonlineng.com/only-10-of-kaduna-population-is-covered-by-health-scheme-kadchma-dg/', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-014', platform: 'Premium Times', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://www.premiumtimesng.com/news/top-news/808742-kaduna-lga-to-enforce-enrollment-into-health-insurance-scheme-before-marriage.html', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-015', platform: 'Guardian', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://guardian.ng/news/kaduna-lg-to-enforce-enrollment-into-health-insurance-scheme-before-marriage/', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-016', platform: 'Vanguard', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://www.vanguardngr.com/2025/07/csos-media-stakeholders-partner-to-strengthen-healthcare-advocacy-in-kaduna/', state: 'Kaduna', month: 'Jul-25' },
    { id: 'kad-017', platform: 'SILVERBIRD NEWS24', programType: 'TV', thematicArea: 'Other Health Report', link: 'https://youtu.be/UeLaJlSHEXM', state: 'Kaduna', month: 'Jul-25' },

    // August 2025
    { id: 'kad-018', platform: 'Vanguard', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://www.vanguardngr.com/2025/08/kaduna-health-sector-booms-one-year-after-phc-leadership-prize-health-expert/', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-019', platform: 'Newsweb Express', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://newswebexpress.com/gavi-pledges-3-million-to-boost-immunization-in-kaduna-state/', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-020', platform: 'Naira Metrics', programType: 'Print', thematicArea: 'RMNCAH+N', link: 'https://nairametrics.com/2025/08/13/gavi-pledges-3-million-investment-to-strengthen-routine-immunization-and-primary-healthcare-in-kaduna/', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-021', platform: 'Vanguard', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://www.vanguardngr.com/2025/08/kaduna-distributes-id-cards-to-15916-vulnerables-pregnant-women-under-5-children/', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-022', platform: 'Channels TV', programType: 'TV', thematicArea: 'Contributory Health Insurance', link: 'https://youtu.be/z4D8hKlYVEo', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-023', platform: 'Vanguard', programType: 'Print', thematicArea: 'Contributory Health Insurance', link: 'https://www.vanguardngr.com/2025/08/foundation-strengthens-healthcare-media-education-partnerships-in-kaduna/', state: 'Kaduna', month: 'Aug-25' },
    { id: 'kad-024', platform: 'Silverbird NEW24', programType: 'TV', thematicArea: 'Contributory Health Insurance', link: 'https://youtu.be/fV4AknYicDY', state: 'Kaduna', month: 'Aug-25' },

    // September 2025
    { id: 'kad-025', platform: 'Freedom Radio', programType: 'Radio', thematicArea: 'Contributory Health Insurance', link: 'https://www.facebook.com/share/v/1Ca2LJRWms/', state: 'Kaduna', month: 'Sep-25' },
    { id: 'kad-026', platform: 'KADCHMA', programType: 'Social Media', thematicArea: 'Contributory Health Insurance', link: 'https://www.instagram.com/share/p/BA_BBnAJvs', state: 'Kaduna', month: 'Sep-25' },

    // October 2025
    { id: 'kad-027', platform: 'Gobroadsheet', programType: 'Print', thematicArea: 'RMNCAH', link: 'https://gobroadsheet.wordpress.com/2025/10/02/kaduna-partners-ismph-others-to-launch-emergency-medical-rural-ambulance-services/', state: 'Kaduna', month: 'Oct-25' },
    { id: 'kad-028', platform: 'New Telegraph', programType: 'Print', thematicArea: 'RMNCAH', link: 'https://newtelegraphng.com/from-advocacy-to-action-building-lifeline-for-mothers-babies/', state: 'Kaduna', month: 'Oct-25' },
];

// KANO REPORTS
export const KANO_REPORTS: MediaReport[] = [
    // May 2025
    { id: 'kan-001', platform: 'KSCHMA', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://www.kschma.org/2025/05/02/kschma-collaborates-to-save-lives/', state: 'Kano', month: 'May-25' },
    { id: 'kan-002', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://eagleeyes.com.ng/kschma-partners-kano-hospitals-management-board-on-blood-drive/', state: 'Kano', month: 'May-25' },
    { id: 'kan-003', platform: 'Paradigm News', programType: 'Print', thematicArea: 'RMNCAH', link: 'https://paradigmnews.ng/kano-targets-zero-dose-children-launches-action-plan-to-scale-up-childrens-immunisation/', state: 'Kano', month: 'May-25' },
    { id: 'kan-004', platform: 'Stallion Times', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://stalliontimes.com/kano-to-immunize-7-2m-children-against-measles-rubella/', state: 'Kano', month: 'May-25' },

    // June 2025
    { id: 'kan-005', platform: 'KSCHMA', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://www.kschma.org/2025/06/02/kschma-trains-health-facility-staff/', state: 'Kano', month: 'Jun-25' },
    { id: 'kan-006', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://eagleeyes.com.ng/over-4300-enrollees-access-eye-surgeries-services-through-kschma-scheme/', state: 'Kano', month: 'Jun-25' },
    { id: 'kan-007', platform: 'Paradigm News', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://paradigmnews.ng/govt-needs-to-boost-phc-funding-kano-health-expert/', state: 'Kano', month: 'Jun-25' },
    { id: 'kan-008', platform: 'Pyramid Radio', programType: 'Radio', thematicArea: 'RMNCAH', link: 'https://pyramidradiokano.com/kano-agency-commits-n5-billion-to-bolster-maternal-newborn-health/', state: 'Kano', month: 'Jun-25' },

    // July 2025
    { id: 'kan-009', platform: 'AIT', programType: 'TV', thematicArea: 'Other Health Report', link: 'https://youtu.be/zWu2xkKCIbw', state: 'Kano', month: 'Jul-25' },
    { id: 'kan-010', platform: 'Stallion Times', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://stalliontimes.com/engenderhealth-isdel-steps-up-training-for-health-advocacy-in-kano/', state: 'Kano', month: 'Jul-25' },
    { id: 'kan-011', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://eagleeyes.com.ng/engenderhealth-provides-capacity-building-to-facilitate-accountability-in-kano-state/', state: 'Kano', month: 'Jul-25' },
    { id: 'kan-012', platform: 'KSCHMA', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://www.kschma.org/2025/07/21/kschma-graduates-fellows-2/', state: 'Kano', month: 'Jul-25' },

    // August 2025
    { id: 'kan-013', platform: 'KSCHMA', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://www.kschma.org/2025/08/08/kschma-intensifies-informal-sector-enrollment/', state: 'Kano', month: 'Aug-25' },
    { id: 'kan-014', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'Immunization', link: 'https://eagleeyes.com.ng/kano-targets-7-8-million-children-for-september-measles-rubella-integrated-vaccination/', state: 'Kano', month: 'Aug-25' },
    { id: 'kan-015', platform: 'Paradigm News', programType: 'Print', thematicArea: 'Immunization', link: 'https://paradigmnews.ng/kano-to-vaccinate-7-8-million-children-in-upcoming-campaign/', state: 'Kano', month: 'Aug-25' },
    { id: 'kan-016', platform: 'AIT', programType: 'TV', thematicArea: 'Immunization', link: 'https://youtu.be/2RHOaM9PsOs', state: 'Kano', month: 'Aug-25' },

    // September 2025
    { id: 'kan-017', platform: 'KSCHMA', programType: 'Print', thematicArea: 'BHCPF', link: 'https://www.kschma.org/2025/09/02/kschma-reviews-bhcpf/', state: 'Kano', month: 'Sep-25' },
    { id: 'kan-018', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://eagleeyes.com.ng/kschma-enrolls-one-hundred-and-seventy-almajiris-into-the-health-care-scheme/', state: 'Kano', month: 'Sep-25' },
    { id: 'kan-019', platform: 'Paradigm News', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://paradigmnews.ng/funding-smart-goals-top-resolutions-at-kano-health-workshop/', state: 'Kano', month: 'Sep-25' },
    { id: 'kan-020', platform: 'Pyramid Radio', programType: 'Radio', thematicArea: 'DMSCA', link: 'https://pyramidradiokano.com/kano-dmcsa-unveils-2026-aop-to-strengthen-drug-availability-and-accountability/', state: 'Kano', month: 'Sep-25' },
    { id: 'kan-021', platform: 'Radio Nigeria', programType: 'Radio', thematicArea: 'Immunization', link: 'https://www.radionigeriakaduna.gov.ng/2025/09/29/parents-urged-to-embrace-routine-immunization-to-tackle-childhood-killer-diseases/', state: 'Kano', month: 'Sep-25' },
    { id: 'kan-022', platform: 'Paradigm News', programType: 'Print', thematicArea: 'Immunization', link: 'https://paradigmnews.ng/kano-govt-lauds-zdlh-cop-pledges-timely-release-of-immunization-funds/', state: 'Kano', month: 'Sep-25' },

    // October 2025
    { id: 'kan-023', platform: 'Paradigm News', programType: 'Print', thematicArea: 'RMNCAH', link: 'https://paradigmnews.ng/maternal-health-in-focus-as-kano-marks-global-contraception-awareness-day/', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-024', platform: 'AIT', programType: 'TV', thematicArea: 'Immunization', link: 'https://youtu.be/rRTIP2YN0XY', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-025', platform: 'Prime Time News', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://primetimenews.ng/kshoa-lisdel-engenderhealth-hold-strategic-session-on-phc-accountability-in-kano/', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-026', platform: 'Prime Time News', programType: 'Print', thematicArea: 'Immunization', link: 'https://primetimenews.ng/kano-govt-launches-measles-rubella-vaccination-campaign-targets-7-6m-children/', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-027', platform: 'Eagle Eye', programType: 'Print', thematicArea: 'Immunization', link: 'https://eagleeyes.com.ng/flag-off-kano-7-8-million-children-to-receive-measles-rubella-vaccines/', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-028', platform: 'Pyramid Radio', programType: 'Radio', thematicArea: 'RMNCAH', link: 'https://pyramidradiokano.com/ccsi-engenderhealth-kanslam-advocates-for-strategic-alliance-for-rmncahn-fp-in-kano/', state: 'Kano', month: 'Oct-25' },
    { id: 'kan-029', platform: 'Paradigm News', programType: 'Print', thematicArea: 'PHC Agenda', link: 'https://paradigmnews.ng/c19rm-kano-advocacy-team-seeks-inclusion-of-two-phcs-in-drf/', state: 'Kano', month: 'Oct-25' },
];

// LAGOS REPORTS
export const LAGOS_REPORTS: MediaReport[] = [
    // June 2025
    { id: 'lag-001', platform: 'Smartviews Magazine', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://www.smartviewsmagazine.net/news/ismph-engenderhealth-consortium-partner-lagos-state-to-train-journalists/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-002', platform: 'LTV', programType: 'TV', thematicArea: 'RMNCAH', link: 'https://youtu.be/fNUE5I2sK-A', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-003', platform: 'AIT', programType: 'TV', thematicArea: 'RMNCAH', link: 'https://www.facebook.com/share/v/1AYHNkpLYL/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-004', platform: 'LTV', programType: 'TV', thematicArea: 'Other Health Report', link: 'https://youtube.com/watch?v=Dtj7SuJmYY8', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-005', platform: 'EKO FM', programType: 'Radio', thematicArea: 'Capacity Building', link: 'https://radionigerialagos.gov.ng/ngo-trains-editors-to-amplify-rmncahn-coverage-in-lagos/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-006', platform: 'Silverbird Television', programType: 'TV', thematicArea: 'Capacity Building', link: 'https://www.facebook.com/share/v/1B9jMAvx3b/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-007', platform: 'Bond FM', programType: 'Radio', thematicArea: 'Contributory Health Insurance', link: 'https://radionigerialagos.gov.ng/ilera-eko-lasg-reaffirms-drive-toward-universal-health-coverage/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-008', platform: 'Guardian Newspaper', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://guardian.ng/features/science/experts-urge-responsible-storytelling-to-aid-public-health-outcomes/', state: 'Lagos', month: 'Jun-25' },
    { id: 'lag-009', platform: 'New Telegraph', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://newtelegraphng.com/media-advocacy-for-stronger-phc-journalists-equipped-to-champion-maternal-newborn-health/', state: 'Lagos', month: 'Jun-25' },

    // July 2025
    { id: 'lag-010', platform: 'Daily Independent', programType: 'Print', thematicArea: 'SWAp Unit Activity', link: 'https://independent.ng/lagos-launches-strategic-health-planning-workshop-to-strengthen-system-reform-budgeting/', state: 'Lagos', month: 'Jul-25' },
    { id: 'lag-011', platform: 'Punch Newspaper', programType: 'Print', thematicArea: 'SWAp Unit Activity', link: 'https://healthwise.punchng.com/lagos-begins-implementation-of-swap-initiative-to-strengthen-health-system/', state: 'Lagos', month: 'Jul-25' },
    { id: 'lag-012', platform: 'Channels TV', programType: 'TV', thematicArea: 'SWAp Unit Activity', link: 'https://youtu.be/BxnwFiOG2ug', state: 'Lagos', month: 'Jul-25' },
    { id: 'lag-013', platform: 'LTV', programType: 'TV', thematicArea: 'SWAp Unit Activity', link: 'https://youtu.be/2Bn2_f83gPo', state: 'Lagos', month: 'Jul-25' },
    { id: 'lag-014', platform: 'Channels TV', programType: 'TV', thematicArea: 'Capacity Building', link: 'https://youtu.be/MJLtOkeCICI', state: 'Lagos', month: 'Jul-25' },

    // August 2025
    { id: 'lag-015', platform: 'Thisday Newspaper', programType: 'Print', thematicArea: 'Accountability Meeting', link: 'https://www.thisdaylive.com/2025/08/06/lasam-consortium-partners-deliberate-on-efficient-primary-healthcare-delivery/', state: 'Lagos', month: 'Aug-25' },
    { id: 'lag-016', platform: 'Radio One 103.5', programType: 'Radio', thematicArea: 'Capacity Building', link: 'https://radionigerialagos.gov.ng/ismph-trains-traditional-media-influencers-on-solution-reportage-to-maternal-health-and-gender-issues/', state: 'Lagos', month: 'Aug-25' },
    { id: 'lag-017', platform: 'Daily Independence', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://independent.ng/traditional-media-urged-to-drive-maternal-healthcare-gender-reform-in-nigeria/', state: 'Lagos', month: 'Aug-25' },
    { id: 'lag-018', platform: 'Daily Independence', programType: 'Print', thematicArea: 'Other Health Report', link: 'https://independent.ng/ogunyemi-pledges-action-as-lasam-partners-advocate-for-maternal-child-health-guidelines/', state: 'Lagos', month: 'Aug-25' },

    // September 2025
    { id: 'lag-019', platform: 'Media Views', programType: 'Online', thematicArea: 'Co-creation Meeting', link: 'https://themediaviews.com/2025/08/30/engenderhealth-led-consortium-mobilises-phc-stakeholders-to-bolster-lagos-primary-healthcare/', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-020', platform: 'Sun Newspaper', programType: 'Print', thematicArea: 'Capacity Building', link: 'https://thesun.ng/media-urged-to-champion-maternal-health-gender-reforms/', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-021', platform: 'Daily Independence', programType: 'Print', thematicArea: 'Co-creation Meeting', link: 'https://independent.ng/engenderhealth-pact-with-lagos-health-ministry-to-strengthen-state-primary-healthcare/', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-022', platform: 'Guardian Newspaper', programType: 'Print', thematicArea: 'Review Meeting', link: 'https://guardian.ng/features/health/stakeholders-seek-urgent-action-to-halt-crisis-in-councils-phc/', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-023', platform: 'Traffic Radio', programType: 'Radio', thematicArea: 'Capacity Building', link: 'https://brandnews.com.ng/lagos-phc-board-highlights-immunisation-successes-amid-gaps-in-infrastructure-funding/', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-024', platform: 'Lagos Television LTV', programType: 'TV', thematicArea: 'Capacity Building', link: 'https://youtu.be/xb9y_s4OAIw', state: 'Lagos', month: 'Sep-25' },
    { id: 'lag-025', platform: 'New Telegraph', programType: 'Print', thematicArea: 'Alliance Meeting', link: 'https://newtelegraphng.com/debunking-the-myths-lagos-champions-family-planning-as-path-to-healthier-families-stronger-future/', state: 'Lagos', month: 'Sep-25' },
];

// Combined exports
export const ALL_MEDIA_REPORTS: MediaReport[] = [
    ...KADUNA_REPORTS,
    ...KANO_REPORTS,
    ...LAGOS_REPORTS,
];

// Get all unique thematic areas
export const ALL_THEMATIC_AREAS = [...new Set(ALL_MEDIA_REPORTS.map(r => r.thematicArea))].sort();

// Get all unique program types
export const ALL_PROGRAM_TYPES: ProgramType[] = ['Print', 'TV', 'Radio', 'Social Media', 'Online'];

// Get reports count by state
export const REPORTS_BY_STATE: Record<StateCode, number> = {
    Kaduna: KADUNA_REPORTS.length,
    Kano: KANO_REPORTS.length,
    Lagos: LAGOS_REPORTS.length,
};
