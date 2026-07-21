import {
  Award,
  BookOpen,
  Baby,
  BadgeIndianRupee,
  Briefcase,
  CalendarClock,
  CalendarHeart,
  CarFront,
  ClipboardList,
  CreditCard,
  Crop,
  FileArchive,
  FileCheck2,
  FileText,
  FileUser,
  FilePenLine,
  FolderLock,
  GraduationCap,
  HardHat,
  House,
  IdCard,
  ImageDown,
  IndianRupee,
  Keyboard,
  Landmark,
  Lightbulb,
  Mail,
  MessagesSquare,
  PenLine,
  ListChecks,
  Percent,
  PiggyBank,
  Plane,
  Presentation,
  Ruler,
  Sheet,
  Search,
  ShieldAlert,
  Smartphone,
  Table2,
  Ticket,
  TrainFront,
  Type,
  Users,
  Vote,
  Wallet,
  Wheat,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Bi } from './lang';

/**
 * Shared mock data (design.md §10 + home.md content).
 * Page agents: reuse and extend these collections.
 *
 * Dates use a fixed editorial reference "today" (2026-07-20, matching
 * design.md v1.0 · July 2026) so urgency bands render exactly as designed.
 */
export const REFERENCE_TODAY = new Date('2026-07-20T00:00:00+05:30');

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export type Tint = 'terracotta' | 'leaf' | 'amber' | 'rose' | 'cocoa';

export interface Category {
  id: string;
  title: Bi;
  count: Bi;
  icon: LucideIcon;
  tint: Tint;
  /** secondary tint for Tools (leaf-700) / Office (terracotta-700) per design */
  deep?: boolean;
  href: string;
}

export const categories: Category[] = [
  { id: 'jobs',      title: { hi: 'सरकारी नौकरी', en: 'Govt Jobs' },        count: { hi: '240+ पद', en: '240+ posts' },        icon: Briefcase,     tint: 'terracotta', href: '/jobs' },
  { id: 'schemes',   title: { hi: 'सरकारी योजनाएँ', en: 'Schemes' },        count: { hi: '120+ योजनाएँ', en: '120+ schemes' },   icon: Landmark,      tint: 'leaf',       href: '/schemes' },
  { id: 'services',  title: { hi: 'सरकारी सेवाएँ', en: 'Services' },        count: { hi: '60+ गाइड', en: '60+ guides' },        icon: IdCard,        tint: 'amber',      href: '/services' },
  { id: 'exams',     title: { hi: 'परीक्षा व रिज़ल्ट', en: 'Exams & Results' }, count: { hi: '90+ अपडेट', en: '90+ updates' },  icon: GraduationCap, tint: 'cocoa',      href: '/exams' },
  { id: 'scholarships', title: { hi: 'छात्रवृत्ति', en: 'Scholarships' },   count: { hi: '45+ छात्रवृत्तियाँ', en: '45+ scholarships' }, icon: Award, tint: 'rose', href: '/exams' },
  { id: 'office',    title: { hi: 'ऑफिस ज़ोन', en: 'Office Zone' },         count: { hi: '75+ ट्यूटोरियल', en: '75+ tutorials' }, icon: Table2,        tint: 'terracotta', deep: true, href: '/office' },
  { id: 'tools',     title: { hi: 'ऑनलाइन टूल्स', en: 'Online Tools' },     count: { hi: '15 मुफ़्त टूल्स', en: '15 free tools' }, icon: Wrench,        tint: 'leaf',       deep: true, href: '/tools' },
  { id: 'lifehacks', title: { hi: 'लाइफ हैक्स', en: 'Life Hacks' },         count: { hi: '100+ टिप्स', en: '100+ tips' },       icon: Lightbulb,     tint: 'rose',       href: '/lifehacks' },
];

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */

export interface TickerItem {
  text: Bi;
  href: string;
}

export const tickerHeadlines: TickerItem[] = [
  { text: { hi: 'SSC CGL 2026: अंतिम तिथि 28 जुलाई — अभी आवेदन करें', en: 'SSC CGL 2026: last date 28 July — apply now' }, href: '/article' },
  { text: { hi: 'PM-KISAN 19वीं किस्त जारी — अपना स्टेटस चेक करें', en: 'PM-KISAN 19th installment released — check status' }, href: '/article' },
  { text: { hi: 'Bihar Board 10th Scrutiny Result घोषित', en: 'Bihar Board 10th Scrutiny Result declared' }, href: '/article' },
  { text: { hi: 'IBPS PO XVI नोटिफिकेशन आउट — 5,208 पद', en: 'IBPS PO XVI notification out — 5,208 posts' }, href: '/article' },
  { text: { hi: 'RRB NTPC CBT-1 एडमिट कार्ड डाउनलोड शुरू', en: 'RRB NTPC CBT-1 admit card download starts' }, href: '/article' },
  { text: { hi: 'आधार अपडेट: बच्चों का बायोमेट्रिक अपडेट 31 जुलाई तक मुफ़्त', en: 'Aadhaar: free child biometric update till 31 July' }, href: '/article' },
];

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

export interface Job {
  id: string;
  title: string;
  org: Bi;
  orgShort: string;
  tint: Tint;
  posts: string;
  qualification: string;
  age: string;
  lastDate: string; // ISO yyyy-mm-dd
  isNew?: boolean;
  tags: string[];
}

export const jobs: Job[] = [
  { id: 'ssc-cgl-2026', title: 'SSC CGL 2026 — Combined Graduate Level', org: { hi: 'कर्मचारी चयन आयोग', en: 'Staff Selection Commission' }, orgShort: 'SSC', tint: 'terracotta', posts: '17,727', qualification: 'Graduate', age: '18–32', lastDate: '2026-07-28', isNew: true, tags: ['ssc', 'graduate', 'central'] },
  { id: 'ibps-po-xvi', title: 'IBPS PO XVI — Probationary Officers', org: { hi: 'बैंकिंग कार्मिक चयन संस्थान', en: 'Institute of Banking Personnel' }, orgShort: 'IBPS', tint: 'leaf', posts: '5,208', qualification: 'Graduate', age: '20–30', lastDate: '2026-08-10', isNew: true, tags: ['bank', 'graduate'] },
  { id: 'india-post-gds', title: 'India Post GDS — Gramin Dak Sevak', org: { hi: 'डाक विभाग, भारत सरकार', en: 'Department of Posts' }, orgShort: 'IP', tint: 'amber', posts: '44,228', qualification: '10th Pass', age: '18–40', lastDate: '2026-07-21', tags: ['10th', 'postal'] },
  { id: 'rrb-ntpc-2026', title: 'RRB NTPC — Non-Technical Categories', org: { hi: 'रेलवे भर्ती बोर्ड', en: 'Railway Recruitment Board' }, orgShort: 'RRB', tint: 'terracotta', posts: '11,558', qualification: '12th / Graduate', age: '18–33', lastDate: '2026-08-05', tags: ['railway'] },
  { id: 'up-police-constable', title: 'UP Police Constable Recruitment', org: { hi: 'उ.प्र. पुलिस भर्ती बोर्ड', en: 'UP Police Recruitment Board' }, orgShort: 'UPP', tint: 'cocoa', posts: '19,220', qualification: '12th Pass', age: '18–25', lastDate: '2026-07-25', tags: ['police', 'state'] },
  { id: 'aiims-norcet-9', title: 'AIIMS NORCET 9 — Nursing Officer', org: { hi: 'अखिल भारतीय आयुर्विज्ञान संस्थान', en: 'All India Institute of Medical Sciences' }, orgShort: 'AIIMS', tint: 'rose', posts: '3,500', qualification: 'B.Sc Nursing', age: '18–30', lastDate: '2026-08-18', tags: ['nursing', 'medical'] },
  { id: 'railway-group-d', title: 'Railway Group D — Level 1 Posts', org: { hi: 'रेलवे भर्ती बोर्ड', en: 'Railway Recruitment Board' }, orgShort: 'RRB', tint: 'leaf', posts: '32,438', qualification: '10th Pass', age: '18–36', lastDate: '2026-09-02', tags: ['railway', '10th'] },
  { id: 'ssc-mts-2026', title: 'SSC MTS & Havaldar 2026', org: { hi: 'कर्मचारी चयन आयोग', en: 'Staff Selection Commission' }, orgShort: 'SSC', tint: 'amber', posts: '9,583', qualification: '10th Pass', age: '18–27', lastDate: '2026-08-22', tags: ['ssc', '10th'] },
  /* ---- jobs hub additions (design/jobs.md §2–§3) ---- */
  { id: 'upsc-cds-ii-2026', title: 'UPSC CDS II 2026 — Combined Defence Services', org: { hi: 'संघ लोक सेवा आयोग', en: 'Union Public Service Commission' }, orgShort: 'UPSC', tint: 'terracotta', posts: '457', qualification: 'Graduate', age: '19–25', lastDate: '2026-07-21', isNew: true, tags: ['defence', 'graduate', 'central'] },
  { id: 'army-agniveer-rally-jal', title: 'Army Agniveer Rally — Jalandhar', org: { hi: 'भारतीय सेना भर्ती', en: 'Indian Army Recruitment' }, orgShort: 'ARMY', tint: 'leaf', posts: '40,000', qualification: '10th/12th', age: '17.5–21', lastDate: '2026-07-23', tags: ['defence', '10th', '12th'] },
  { id: 'rajasthan-patwari-2026', title: 'Rajasthan Patwari Recruitment 2026', org: { hi: 'राजस्थान कर्मचारी चयन बोर्ड', en: 'Rajasthan Staff Selection Board' }, orgShort: 'RSSB', tint: 'cocoa', posts: '3,705', qualification: 'Graduate', age: '18–40', lastDate: '2026-07-25', tags: ['state', 'graduate'] },
  { id: 'bihar-ssc-inter-2026', title: 'Bihar SSC Inter Level 2026', org: { hi: 'बिहार कर्मचारी चयन आयोग', en: 'Bihar Staff Selection Commission' }, orgShort: 'BSSC', tint: 'amber', posts: '12,199', qualification: '12th Pass', age: '18–37', lastDate: '2026-08-08', tags: ['ssc', 'state', '12th'] },
  { id: 'army-agniveer-cee-2026', title: 'Army Agniveer — CEE Online Form', org: { hi: 'भारतीय सेना भर्ती', en: 'Indian Army Recruitment' }, orgShort: 'ARMY', tint: 'leaf', posts: '25,000+', qualification: '10th/12th', age: '17.5–21', lastDate: '2026-07-31', tags: ['defence', '10th', '12th'] },
  { id: 'ctet-dec-2026', title: 'CTET December 2026 — Teacher Eligibility', org: { hi: 'केंद्रीय माध्यमिक शिक्षा बोर्ड', en: 'Central Board of Secondary Education' }, orgShort: 'CTET', tint: 'rose', posts: 'Eligibility Test', qualification: 'B.Ed / D.El.Ed', age: '18+', lastDate: '2026-08-20', tags: ['teaching', 'graduate'] },
];

/* ------------------------------------------------------------------ */
/* Schemes                                                             */
/* ------------------------------------------------------------------ */

export interface Scheme {
  id: string;
  name: Bi;
  benefit: string;
  audience: Bi;
  summary: Bi;
  tint: Tint;
}

export const schemes: Scheme[] = [
  {
    id: 'pm-kisan',
    name: { hi: 'PM-KISAN सम्मान निधि', en: 'PM-KISAN Samman Nidhi' },
    benefit: '₹6,000/वर्ष',
    audience: { hi: 'किसान', en: 'Farmer' },
    summary: { hi: 'देश के सभी छोटे किसानों को सालाना ₹6,000 — तीन किस्तों में, सीधे बैंक खाते में।', en: 'All small farmers get ₹6,000/year — in three installments, directly to the bank account.' },
    tint: 'leaf',
  },
  {
    id: 'ayushman-bharat',
    name: { hi: 'Ayushman Bharat PM-JAY', en: 'Ayushman Bharat PM-JAY' },
    benefit: '₹5 लाख cover',
    audience: { hi: 'परिवार', en: 'Family' },
    summary: { hi: 'गरीब परिवारों को ₹5 लाख तक का मुफ़्त इलाज — कैशलेस, पूरे भारत में।', en: 'Free treatment up to ₹5 lakh for eligible families — cashless, across India.' },
    tint: 'leaf',
  },
  {
    id: 'sukanya-samriddhi',
    name: { hi: 'Sukanya Samriddhi Yojana', en: 'Sukanya Samriddhi Yojana' },
    benefit: '8.2% ब्याज',
    audience: { hi: 'बेटी', en: 'Daughter' },
    summary: { hi: 'बेटी के भविष्य के लिए सबसे सुरक्षित बचत — टैक्स-फ्री ब्याज के साथ।', en: 'The safest savings for your daughter’s future — with tax-free interest.' },
    tint: 'rose',
  },
  {
    id: 'pm-awas',
    name: { hi: 'PM Awas Yojana', en: 'PM Awas Yojana' },
    benefit: '₹2.5 लाख subsidy',
    audience: { hi: 'आवास', en: 'Housing' },
    summary: { hi: 'पक्का घर बनाने के लिए सरकारी सब्सिडी — गाँव और शहर दोनों में।', en: 'Government subsidy to build a pucca house — in villages and cities.' },
    tint: 'amber',
  },
  {
    id: 'pm-mudra',
    name: { hi: 'PM Mudra Yojana', en: 'PM Mudra Yojana' },
    benefit: '₹10 लाख तक loan',
    audience: { hi: 'व्यापार', en: 'Business' },
    summary: { hi: 'छोटा व्यापार शुरू करने के लिए बिना गारंटी लोन।', en: 'Collateral-free loans to start a small business.' },
    tint: 'terracotta',
  },
  {
    id: 'ujjwala',
    name: { hi: 'PM Ujjwala Yojana', en: 'PM Ujjwala Yojana' },
    benefit: 'मुफ़्त LPG',
    audience: { hi: 'महिला', en: 'Women' },
    summary: { hi: 'गरीब परिवारों की महिलाओं को मुफ़्त LPG कनेक्शन।', en: 'Free LPG connection for women from eligible households.' },
    tint: 'rose',
  },
  /* ---- schemes hub additions (design/schemes.md §4) ---- */
  {
    id: 'ladli-behna',
    name: { hi: 'Ladli Behna Yojana (MP)', en: 'Ladli Behna Yojana (MP)' },
    benefit: '₹1,250/माह',
    audience: { hi: 'महिलाएँ', en: 'Women' },
    summary: { hi: '21–60 वर्ष की महिलाओं को हर महीने आर्थिक सहायता — सीधे बैंक खाते में।', en: 'Monthly financial aid for women aged 21–60 — directly to the bank account.' },
    tint: 'rose',
  },
  {
    id: 'kisan-credit-card',
    name: { hi: 'Kisan Credit Card (KCC)', en: 'Kisan Credit Card (KCC)' },
    benefit: '4% ब्याज पर लोन',
    audience: { hi: 'किसान', en: 'Farmer' },
    summary: { hi: '₹3 लाख तक फसली लोन — समय पर भुगतान पर ब्याज में छूट।', en: 'Crop loan up to ₹3 lakh — interest relief on timely repayment.' },
    tint: 'leaf',
  },
  {
    id: 'pm-jan-dhan',
    name: { hi: 'PM Jan Dhan Yojana', en: 'PM Jan Dhan Yojana' },
    benefit: '₹2 लाख बीमा',
    audience: { hi: 'सभी', en: 'Everyone' },
    summary: { hi: 'जीरो-बैलेंस खाता + RuPay कार्ड + दुर्घटना बीमा कवर।', en: 'Zero-balance account + RuPay card + accident insurance cover.' },
    tint: 'leaf',
  },
  {
    id: 'atal-pension',
    name: { hi: 'Atal Pension Yojana', en: 'Atal Pension Yojana' },
    benefit: '₹1,000–5,000/माह',
    audience: { hi: 'बुज़ुर्ग', en: 'Senior' },
    summary: { hi: '60 साल के बाद गारंटीड पेंशन — 18 साल की उम्र से जुड़ें।', en: 'Guaranteed pension after 60 — join from age 18.' },
    tint: 'amber',
  },
  {
    id: 'pm-vishwakarma',
    name: { hi: 'PM Vishwakarma Yojana', en: 'PM Vishwakarma Yojana' },
    benefit: '₹15,000 + लोन',
    audience: { hi: 'कारीगर', en: 'Artisans' },
    summary: { hi: 'बढ़ई, लोहार, दर्जी जैसे 18 trades को टूलकिट + सस्ता लोन + training।', en: 'Toolkit + low-cost loan + training for 18 trades like carpenters, blacksmiths, tailors.' },
    tint: 'cocoa',
  },
  {
    id: 'nsp-scholarship',
    name: { hi: 'National Scholarship Portal', en: 'National Scholarship Portal' },
    benefit: '₹75,000 तक/वर्ष',
    audience: { hi: 'छात्र', en: 'Students' },
    summary: { hi: 'SC/ST/OBC व minority छात्रों की सैकड़ों छात्रवृत्तियाँ — एक ही पोर्टल पर।', en: 'Hundreds of scholarships for SC/ST/OBC & minority students — on one portal.' },
    tint: 'cocoa',
  },
  {
    id: 'pm-kaushal-vikas',
    name: { hi: 'PM Kaushal Vikas (PMKVY)', en: 'PM Kaushal Vikas (PMKVY)' },
    benefit: 'मुफ़्त Training',
    audience: { hi: 'युवा', en: 'Youth' },
    summary: { hi: 'नौकरी के लिए मुफ़्त स्किल ट्रेनिंग और सर्टिफिकेट — 40+ कोर्स।', en: 'Free skill training and certification for jobs — 40+ courses.' },
    tint: 'terracotta',
  },
];

/* ------------------------------------------------------------------ */
/* Services (quick tasks)                                              */
/* ------------------------------------------------------------------ */

export interface ServiceItem {
  id: string;
  title: Bi;
  icon: LucideIcon;
  tint: Tint;
  time: string;
  fee: string;
  steps: number;
}

export const services: ServiceItem[] = [
  { id: 'aadhaar',   title: { hi: 'आधार कार्ड', en: 'Aadhaar' },        icon: IdCard,     tint: 'amber', time: '15 मिनट', fee: '₹50',    steps: 6 },
  { id: 'pan',       title: { hi: 'PAN कार्ड', en: 'PAN Card' },        icon: CreditCard, tint: 'amber', time: '15 मिनट', fee: '₹107',   steps: 7 },
  { id: 'ration',    title: { hi: 'राशन कार्ड', en: 'Ration Card' },    icon: Wheat,      tint: 'leaf',  time: '20 मिनट', fee: '₹0',     steps: 5 },
  { id: 'voter',     title: { hi: 'Voter ID', en: 'Voter ID' },         icon: Vote,       tint: 'amber', time: '10 मिनट', fee: '₹0',     steps: 5 },
  { id: 'epfo',      title: { hi: 'PF निकासी', en: 'EPFO Withdrawal' }, icon: PiggyBank,  tint: 'leaf',  time: '25 मिनट', fee: '₹0',     steps: 8 },
  { id: 'digilocker',title: { hi: 'DigiLocker', en: 'DigiLocker' },     icon: FolderLock, tint: 'cocoa', time: '5 मिनट',  fee: '₹0',     steps: 4 },
  { id: 'passport',  title: { hi: 'Passport', en: 'Passport' },         icon: Plane,      tint: 'amber', time: '30 मिनट', fee: '₹1,500', steps: 9 },
  { id: 'dl',        title: { hi: 'DL ड्राइविंग लाइसेंस', en: 'Driving Licence' }, icon: CarFront, tint: 'cocoa', time: '20 मिनट', fee: '₹200', steps: 6 },
];

/* ------------------------------------------------------------------ */
/* Results & admit cards                                               */
/* ------------------------------------------------------------------ */

export interface ResultItem {
  id: string;
  title: string;
  date: string;
  isNew?: boolean;
  cta: Bi;
}

export const results: ResultItem[] = [
  { id: 'neet-ug-2026', title: 'NEET UG 2026 Result', date: '18 जुल', isNew: true, cta: { hi: 'Check', en: 'Check' } },
  { id: 'ssc-mts-final', title: 'SSC MTS Havaldar Final', date: '15 जुल', isNew: true, cta: { hi: 'Check', en: 'Check' } },
  { id: 'ibps-rrb-po-pre', title: 'IBPS RRB PO Pre Result', date: '12 जुल', cta: { hi: 'Check', en: 'Check' } },
  { id: 'bihar-10th-scrutiny', title: 'Bihar Board 10th Scrutiny', date: '10 जुल', cta: { hi: 'Check', en: 'Check' } },
];

export const admitCards: ResultItem[] = [
  { id: 'ssc-cgl-tier1-admit', title: 'SSC CGL Tier-1 Admit Card', date: '19 जुल', isNew: true, cta: { hi: 'Download गाइड', en: 'Download guide' } },
  { id: 'rrb-ntpc-cbt1-admit', title: 'RRB NTPC CBT-1 Admit Card', date: '17 जुल', isNew: true, cta: { hi: 'Download गाइड', en: 'Download guide' } },
  { id: 'ctet-july-2026', title: 'CTET July 2026 Admit Card', date: '14 जुल', cta: { hi: 'Download गाइड', en: 'Download guide' } },
  { id: 'up-police-admit', title: 'UP Police Constable Admit Card', date: '11 जुल', cta: { hi: 'Download गाइड', en: 'Download guide' } },
];

export const resultPanel = { icon: FileCheck2, tint: 'amber' as Tint };
export const admitPanel = { icon: Ticket, tint: 'terracotta' as Tint };

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

export interface Tool {
  id: string;
  title: Bi;
  desc: Bi;
  icon: LucideIcon;
  tint: Tint;
}

export const tools: Tool[] = [
  { id: 'photo-compress', title: { hi: 'फोटो Compress', en: 'Image to 20KB' }, desc: { hi: 'फॉर्म के लिए फोटो 20–50KB में', en: 'Shrink form photos to 20–50KB' }, icon: ImageDown, tint: 'leaf' },
  { id: 'age-calc', title: { hi: 'उम्र कैलकुलेटर', en: 'Age Calculator' }, desc: { hi: 'जन्म तिथि से सटीक उम्र', en: 'Exact age from date of birth' }, icon: CalendarHeart, tint: 'cocoa' },
  { id: 'percent-calc', title: { hi: 'प्रतिशत कैलकुलेटर', en: 'Percentage' }, desc: { hi: 'अंक, छूट, मार्क्स % तुरंत', en: 'Marks, discounts, percent instantly' }, icon: Percent, tint: 'amber' },
  { id: 'emi-calc', title: { hi: 'EMI कैलकुलेटर', en: 'EMI Calculator' }, desc: { hi: 'लोन की मासिक किस्त जानें', en: 'Know your monthly loan EMI' }, icon: IndianRupee, tint: 'terracotta' },
];

export const formulaChips = ['XLOOKUP', 'VLOOKUP', 'SUMIFS', 'Pivot Table', 'INDEX+MATCH', 'Ctrl+Shift+L', 'COUNTIFS', 'IFERROR', 'TEXTJOIN', 'Flash Fill'];

/* ------------------------------------------------------------------ */
/* Articles / life-hack guides                                         */
/* ------------------------------------------------------------------ */

export interface Article {
  id: string;
  title: Bi;
  icon: LucideIcon;
  tint: Tint;
  readTime: string;
  category: Bi;
}

export const articles: Article[] = [
  { id: 'upi-fraud-rules', title: { hi: 'UPI फ्रॉड से बचें — 7 golden rules', en: 'Avoid UPI fraud — 7 golden rules' }, icon: ShieldAlert, tint: 'rose', readTime: '6 min', category: { hi: 'डिजिटल सुरक्षा', en: 'Digital Safety' } },
  { id: 'digilocker-guide', title: { hi: 'DigiLocker: डॉक्यूमेंट हमेशा जेब में', en: 'DigiLocker: documents always in pocket' }, icon: FolderLock, tint: 'cocoa', readTime: '4 min', category: { hi: 'डिजिटल सेवाएँ', en: 'Digital Services' } },
  { id: 'irctc-tatkal-tips', title: { hi: 'IRCTC Tatkal टिकट पक्का करने के टिप्स', en: 'IRCTC Tatkal ticket booking tips' }, icon: TrainFront, tint: 'amber', readTime: '5 min', category: { hi: 'ट्रैवल', en: 'Travel' } },
  { id: 'pan-card-guide', title: { hi: 'PAN कार्ड ऑनलाइन कैसे बनवाएँ', en: 'How to apply for a PAN card online' }, icon: CreditCard, tint: 'amber', readTime: '7 min', category: { hi: 'सरकारी सेवाएँ', en: 'Govt Services' } },
];

/* ------------------------------------------------------------------ */
/* Office / Excel articles (teaser)                                    */
/* ------------------------------------------------------------------ */

export const officeTeaser = {
  title: { hi: 'ऑफिस ज़ोन', en: 'Office Zone' },
  line: { hi: 'Excel सीखें, रिज़्यूमे बनाएं, इंटरव्यू निकालें — ऑफिस वालों का अपना कोना।', en: 'Learn Excel, build a resume, crack interviews — the office workers’ corner.' },
  cta: { hi: 'ऑफिस ज़ोन खोलें', en: 'Open Office Zone' },
};

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export const heroStats = [
  { value: 850, suffix: '+', hi: 'गाइड', en: 'Guides', anchor: '#categories' },
  { value: 120, suffix: '+', hi: 'योजनाएँ', en: 'Schemes', anchor: '#schemes' },
  { value: 15, suffix: '', hi: 'मुफ़्त टूल्स', en: 'Free Tools', anchor: '#tools' },
];

/* ------------------------------------------------------------------ */
/* FAQs (home)                                                         */
/* ------------------------------------------------------------------ */

export interface Faq {
  q: Bi;
  a: Bi;
}

export const homeFaqs: Faq[] = [
  {
    q: { hi: 'क्या SevaSathi एक सरकारी वेबसाइट है?', en: 'Is SevaSathi a government website?' },
    a: { hi: 'नहीं। हम सरकारी वेबसाइट नहीं हैं — हम जानकारी को आसान भाषा में समझाते हैं और हमेशा आधिकारिक .gov.in / .nic.in लिंक देते हैं। आवेदन हमेशा आधिकारिक साइट पर ही करें।', en: 'No. We are not a government website — we explain information in simple language and always link to official .gov.in / .nic.in sources. Always apply on the official site.' },
  },
  {
    q: { hi: 'क्या यह सेवा मुफ़्त है?', en: 'Is this service free?' },
    a: { hi: 'हाँ, SevaSathi पूरी तरह मुफ़्त है — सभी गाइड, टूल्स और जानकारी बिना किसी शुल्क के।', en: 'Yes, SevaSathi is completely free — all guides, tools and information at no charge.' },
  },
  {
    q: { hi: 'नौकरी की जानकारी कितनी सही है?', en: 'How accurate is the job information?' },
    a: { hi: 'हम हर नोटिफिकेशन आधिकारिक विज्ञप्ति से जांचते हैं, फिर भी आवेदन से पहले Official ↗ लिंक पर तिथियाँ व शर्तें ज़रूर पढ़ें।', en: 'We verify every notification against official gazettes, but always read dates and conditions on the Official ↗ link before applying.' },
  },
  {
    q: { hi: 'क्या मैं गाइड सहेज (save) सकता/सकती हूँ?', en: 'Can I save guides?' },
    a: { hi: 'हाँ, किसी भी कार्ड पर बुकमार्क आइकन दबाएँ — आपकी पसंद इसी डिवाइस पर सुरक्षित रहती है, बिना लॉगिन के।', en: 'Yes, tap the bookmark icon on any card — your picks stay on this device, no login needed.' },
  },
];

/* ------------------------------------------------------------------ */
/* Exams hub — result finder, latest results, calendar, scholarships   */
/* ------------------------------------------------------------------ */

export interface Board {
  id: string;
  name: string;
  site: string;
  declared10: string;
  declared12: string;
  keep: Bi;
}

export const boards: Board[] = [
  { id: 'cbse', name: 'CBSE', site: 'cbse.gov.in', declared10: 'मई 2026', declared12: 'मई 2026', keep: { hi: 'Roll number + admit card ID रखें', en: 'Keep roll number + admit card ID ready' } },
  { id: 'up', name: 'UP Board', site: 'upmsp.edu.in', declared10: 'अप्रैल 2026', declared12: 'अप्रैल 2026', keep: { hi: 'Roll number + school code रखें', en: 'Keep roll number + school code ready' } },
  { id: 'bihar', name: 'Bihar Board', site: 'biharboardonline.bihar.gov.in', declared10: 'मार्च 2026', declared12: 'मार्च 2026', keep: { hi: 'Roll code + roll number रखें', en: 'Keep roll code + roll number ready' } },
  { id: 'mp', name: 'MP Board', site: 'mpbse.nic.in', declared10: 'अप्रैल 2026', declared12: 'अप्रैल 2026', keep: { hi: 'Roll number + application number रखें', en: 'Keep roll number + application number ready' } },
  { id: 'raj', name: 'Rajasthan Board', site: 'rajeduboard.rajasthan.gov.in', declared10: 'मई 2026', declared12: 'मई 2026', keep: { hi: 'Roll number रखें', en: 'Keep roll number ready' } },
  { id: 'icse', name: 'ICSE', site: 'cisce.org', declared10: 'मई 2026', declared12: 'मई 2026', keep: { hi: 'UID + index number रखें', en: 'Keep UID + index number ready' } },
  { id: 'maharashtra', name: 'Maharashtra', site: 'mahahsscboard.in', declared10: 'मई 2026', declared12: 'मई 2026', keep: { hi: 'Seat number रखें', en: 'Keep seat number ready' } },
  { id: 'ap', name: 'AP', site: 'bse.ap.gov.in', declared10: 'अप्रैल 2026', declared12: 'अप्रैल 2026', keep: { hi: 'Hall ticket number रखें', en: 'Keep hall ticket number ready' } },
  { id: 'tn', name: 'TN', site: 'tnresults.nic.in', declared10: 'मई 2026', declared12: 'मई 2026', keep: { hi: 'Registration number + DOB रखें', en: 'Keep registration number + DOB ready' } },
  { id: 'other', name: 'Other State', site: 'results.gov.in', declared10: 'अप्रैल–जून 2026', declared12: 'अप्रैल–जून 2026', keep: { hi: 'Roll number रखें', en: 'Keep roll number ready' } },
];

export const examsLatestResults: ResultItem[] = [
  { id: 'neet-ug-2026', title: 'NEET UG 2026', date: '14 जून', isNew: true, cta: { hi: 'Check', en: 'Check' } },
  { id: 'jee-adv-2026', title: 'JEE Advanced 2026', date: '8 जून', isNew: true, cta: { hi: 'Check', en: 'Check' } },
  { id: 'ssc-mts-havaldar-final', title: 'SSC MTS Havaldar Final', date: '5 जून', cta: { hi: 'Check', en: 'Check' } },
  { id: 'ibps-rrb-clerk-final', title: 'IBPS RRB Clerk Final', date: '2 जून', cta: { hi: 'Check', en: 'Check' } },
  { id: 'cuet-ug-2026', title: 'CUET UG 2026', date: '30 मई', cta: { hi: 'Check', en: 'Check' } },
  { id: 'up-scholarship-status-2026', title: 'UP Scholarship Status 2026-27', date: '28 मई', cta: { hi: 'Check', en: 'Check' } },
];

export interface ExamEvent {
  id: string;
  /** mono date chip label, e.g. "20 जुल" */
  date: string;
  /** month marker, e.g. "जुलाई 2026" */
  month: string;
  title: string;
}

export const examCalendar: ExamEvent[] = [
  { id: 'ctet-jul-2026', date: '20 जुल', month: 'जुलाई 2026', title: 'CTET July 2026' },
  { id: 'ibps-rrb-po-pre', date: '05 अग', month: 'अगस्त 2026', title: 'IBPS RRB PO Prelims' },
  { id: 'ssc-cgl-tier1', date: '12–26 सितं', month: 'सितंबर 2026', title: 'SSC CGL Tier-1' },
  { id: 'up-police-written', date: '21 सितं', month: 'सितंबर 2026', title: 'UP Police Constable Written' },
  { id: 'rrb-ntpc-cbt1', date: '04 अक्टू', month: 'अक्टूबर 2026', title: 'RRB NTPC CBT-1' },
  { id: 'ctet-dec-form', date: '15 नवं', month: 'नवंबर 2026', title: 'CTET December Form' },
  { id: 'ibps-po-mains', date: '06 दिसं', month: 'दिसंबर 2026', title: 'IBPS PO Mains' },
  { id: 'board-practicals', date: 'दिसं', month: 'दिसंबर 2026', title: 'Board practical schedule' },
];

export type ScholarshipFilter = 'national' | 'state' | 'scst-obc' | 'minority' | 'girls' | 'merit';

export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  /** ISO deadline (uses DeadlineBadge urgency colors) */
  lastDate?: string;
  /** fallback label when no fixed ISO date */
  lastLabel?: string;
  eligibility: string;
  filter: ScholarshipFilter;
  tint: Tint;
}

export const scholarships: Scholarship[] = [
  { id: 'nsp', name: 'NSP — National Scholarship Portal (All schemes)', amount: '₹5,000–20,000/वर्ष', lastDate: '2026-10-31', eligibility: 'All-India students, income < ₹2.5L', filter: 'national', tint: 'rose' },
  { id: 'pm-yasasvi', name: 'PM-YASASVI (OBC/EBC/DNT)', amount: '₹75,000–1.25L/वर्ष', lastDate: '2026-09-15', eligibility: 'Class 9–12', filter: 'scst-obc', tint: 'cocoa' },
  { id: 'up-scholarship-dashmottar', name: 'UP Scholarship (Dashmottar)', amount: 'फीस प्रतिपूर्ति', lastDate: '2026-11-30', eligibility: 'UP domicile, all categories', filter: 'state', tint: 'rose' },
  { id: 'post-matric-scst', name: 'Post-Matric SC/ST (State-wise)', amount: '₹230–1,200/माह + फीस', lastLabel: 'तिथि: राज्य अनुसार', eligibility: 'SC/ST students', filter: 'scst-obc', tint: 'cocoa' },
  { id: 'aicte-pragati', name: 'AICTE Pragati (Girls, Technical)', amount: '₹50,000/वर्ष', lastDate: '2026-10-31', eligibility: '1st-year degree/diploma girls', filter: 'girls', tint: 'rose' },
  { id: 'inspire-dst', name: 'INSPIRE / DST Scholarship', amount: '₹80,000/वर्ष', lastLabel: 'Merit-based', eligibility: 'Top 1% 12th science', filter: 'merit', tint: 'cocoa' },
  { id: 'begum-hazrat-mahal', name: 'Begum Hazrat Mahal (Minority Girls)', amount: '₹6,000/वर्ष', lastDate: '2026-09-30', eligibility: 'Class 9–12 girls', filter: 'minority', tint: 'rose' },
  { id: 'reliance-ug', name: 'Reliance Foundation UG Scholarship', amount: '₹2 लाख (कुल)', lastLabel: 'अक्टू 2026', eligibility: 'UG 1st year, income < ₹15L', filter: 'merit', tint: 'cocoa' },
  { id: 'kotak-kanya', name: 'Kotak Kanya Scholarship', amount: '₹1.5 लाख/वर्ष', lastLabel: 'सितं 2026', eligibility: 'Meritorious girls, professional courses', filter: 'girls', tint: 'rose' },
];

export const scholarshipFilters: { id: ScholarshipFilter | 'all'; label: string }[] = [
  { id: 'all', label: 'सभी All' },
  { id: 'national', label: 'राष्ट्रीय National' },
  { id: 'state', label: 'State' },
  { id: 'scst-obc', label: 'SC/ST/OBC' },
  { id: 'minority', label: 'Minority' },
  { id: 'girls', label: 'Girls' },
  { id: 'merit', label: 'Merit' },
];

export const prepTiles = [
  { id: 'syllabus-pdf', title: { hi: 'सिलेबस PDF', en: 'Syllabus' }, icon: BookOpen, tint: 'cocoa' as Tint },
  { id: 'previous-papers', title: { hi: 'पुराने पेपर', en: 'Previous Papers' }, icon: FileArchive, tint: 'amber' as Tint },
  { id: 'exam-pattern', title: { hi: 'Exam Pattern समझें', en: 'Exam Pattern' }, icon: ListChecks, tint: 'leaf' as Tint },
  { id: 'study-plan', title: { hi: 'Time-table बनाएं', en: 'Study Plan' }, icon: CalendarClock, tint: 'terracotta' as Tint },
];

export const examsFaqs: Faq[] = [
  {
    q: { hi: 'रिज़ल्ट चेक करने के लिए क्या चाहिए?', en: 'What do I need to check my result?' },
    a: { hi: 'Roll number + (कभी-कभी) DOB/school code — admit card संभालकर रखें।', en: 'Roll number + (sometimes) DOB/school code — keep your admit card safe.' },
  },
  {
    q: { hi: 'Website crash हो जाए result day पर?', en: 'What if the website crashes on result day?' },
    a: { hi: 'घबराएं नहीं — 1–2 घंटे बाद try करें या DigiLocker/SMS service इस्तेमाल करें।', en: 'Don’t panic — retry after 1–2 hours or use DigiLocker / SMS services.' },
  },
  {
    q: { hi: 'Scholarship के लिए कहां apply करें?', en: 'Where do I apply for scholarships?' },
    a: { hi: 'लगभग सभी scholarships scholarships.gov.in (NSP) या state portal से — फ्री में।', en: 'Almost all scholarships via scholarships.gov.in (NSP) or the state portal — free of cost.' },
  },
  {
    q: { hi: 'Scrutiny/Rechecking कैसे करवाएं?', en: 'How do I apply for scrutiny / rechecking?' },
    a: { hi: 'Result के 15 दिनों के भीतर board portal से — फीस ₹100–500/विषय।', en: 'Within 15 days of the result via the board portal — fee ₹100–500 per subject.' },
  },
];

/* ------------------------------------------------------------------ */
/* Life Hacks & Digital Safety                                         */
/* ------------------------------------------------------------------ */

export type HackCategory = 'safety' | 'money' | 'phone' | 'travel' | 'govt';

export interface Hack {
  id: string;
  title: Bi;
  line: Bi;
  icon: LucideIcon;
  tint: Tint;
  category: HackCategory;
  readTime: string;
}

export const hackCategoryMeta: Record<HackCategory, { label: Bi; tint: Tint }> = {
  safety: { label: { hi: 'डिजिटल सुरक्षा', en: 'Safety' }, tint: 'rose' },
  money: { label: { hi: 'पैसा बचत', en: 'Money' }, tint: 'leaf' },
  phone: { label: { hi: 'फोन टिप्स', en: 'Phone' }, tint: 'cocoa' },
  travel: { label: { hi: 'यात्रा', en: 'Travel' }, tint: 'amber' },
  govt: { label: { hi: 'सरकारी काम', en: 'Govt' }, tint: 'terracotta' },
};

export const lifeHacks: Hack[] = [
  { id: 'digilocker-docs', title: { hi: 'DigiLocker: सारे डॉक्यूमेंट जेब में', en: 'DigiLocker: all documents in your pocket' }, line: { hi: 'DL, RC, मार्कशीट — सब असली माने जाते हैं। 5 मिनट में setup।', en: 'DL, RC, marksheets — all legally valid. 5-minute setup.' }, icon: FolderLock, tint: 'terracotta', category: 'govt', readTime: '4 min' },
  { id: 'irctc-tatkal', title: { hi: 'IRCTC Tatkal टिकट पक्का करें', en: 'Book IRCTC Tatkal tickets for sure' }, line: { hi: '10:58 AM login, master list ready, UPI payment — AC 10 AM / Non-AC 11 AM।', en: 'Login 10:58 AM, master list ready, UPI payment — AC 10 AM / Non-AC 11 AM.' }, icon: TrainFront, tint: 'amber', category: 'travel', readTime: '5 min' },
  { id: 'tafcop-sim-check', title: { hi: 'TAFCOP: अपने नाम पर कितने SIM?', en: 'TAFCOP: how many SIMs in your name?' }, line: { hi: 'tafcop.sancharsaathi.gov.in पर जांचें, अनजान नंबर रद्द करवाएं।', en: 'Check at tafcop.sancharsaathi.gov.in and cancel unknown numbers.' }, icon: Smartphone, tint: 'rose', category: 'safety', readTime: '3 min' },
  { id: 'fake-job-lottery', title: { hi: 'नकली नौकरी/लॉटरी मैसेज पहचानें', en: 'Spot fake job / lottery messages' }, line: { hi: 'जो joining fee मांगे वो 100% fraud है।', en: 'Anyone asking a joining fee is 100% fraud.' }, icon: ShieldAlert, tint: 'rose', category: 'safety', readTime: '4 min' },
  { id: 'bijli-bill-30', title: { hi: 'बिजली बिल 30% कम करें', en: 'Cut your electricity bill by 30%' }, line: { hi: '5-star AC 24°C, LED, standby off — असली आंकड़ों के साथ।', en: '5-star AC at 24°C, LED, standby off — with real numbers.' }, icon: Zap, tint: 'leaf', category: 'money', readTime: '5 min' },
  { id: 'upi-lite-autopay', title: { hi: 'UPI Lite & AutoPay समझें', en: 'Understand UPI Lite & AutoPay' }, line: { hi: 'छोटे payments PIN-free; subscriptions पर नियंत्रण।', en: 'Small payments PIN-free; control over subscriptions.' }, icon: Wallet, tint: 'leaf', category: 'money', readTime: '4 min' },
  { id: 'phone-slow-fixes', title: { hi: 'फोन स्लो? 6 तुरंत उपाय', en: 'Phone slow? 6 instant fixes' }, line: { hi: 'storage, cache, animations off — पुराने फोन नए जैसे।', en: 'Storage, cache, animations off — old phones feel new.' }, icon: Smartphone, tint: 'cocoa', category: 'phone', readTime: '4 min' },
  { id: 'nominee-epf-bank', title: { hi: 'EPF/बैंक में nominee ज़रूर बनाएं', en: 'Always add a nominee in EPF/bank' }, line: { hi: '10 मिनट का काम, परिवार के सालों के सुख के लिए।', en: 'A 10-minute task for your family’s peace of mind.' }, icon: Users, tint: 'leaf', category: 'money', readTime: '3 min' },
  { id: 'sanchaar-saathi-ceir', title: { hi: 'Sanchaar Saathi: खोया फोन ब्लॉक करें', en: 'Sanchaar Saathi: block a lost phone' }, line: { hi: 'CEIR पर report — चोरी/खोया फोन trace व block।', en: 'Report on CEIR — trace & block stolen/lost phones.' }, icon: Smartphone, tint: 'rose', category: 'safety', readTime: '4 min' },
];

/** UPI fraud safety — 7 golden rules (interactive checklist). */
export const upiRules: Bi[] = [
  { hi: 'OTP/PIN कभी किसी को न बताएं', en: 'Never share OTP/PIN with anyone' },
  { hi: '"पैसा पाने के लिए" PIN कभी न डालें (receive में PIN नहीं लगता)', en: 'Never enter a PIN to “receive” money (receiving needs no PIN)' },
  { hi: 'अनजान लिंक पर क्लिक न करें', en: 'Never click on unknown links' },
  { hi: 'Remote apps (AnyDesk) कभी इंस्टॉल न करें', en: 'Never install remote-access apps (AnyDesk)' },
  { hi: 'QR scan = पैसा जाएगा, आएगा नहीं', en: 'QR scan = money goes out, never comes in' },
  { hi: 'Bank का असली नंबर verify करें', en: 'Verify the bank’s real number' },
  { hi: 'फ्रॉड होते ही 1930 + bank को कॉल करें', en: 'On fraud, call 1930 + your bank immediately' },
];

export const weeklyTips: Bi[] = [
  { hi: 'LPG subsidy status *899# से जांचें', en: 'Check LPG subsidy status via *899#' },
  { hi: 'FASTag balance SMS से: बैंक का missed call', en: 'FASTag balance via SMS: missed call to your bank' },
  { hi: 'मार्कशीट DigiLocker में ही असली है — फोटोकॉपी की जगह दिखाएं', en: 'DigiLocker marksheets are valid — show them instead of photocopies' },
  { hi: 'PF passbook: UMANG app से 2 मिनट में', en: 'PF passbook in 2 minutes via the UMANG app' },
];

export const lifehacksFaqs: Faq[] = [
  {
    q: { hi: '1930 क्या है?', en: 'What is 1930?' },
    a: { hi: 'National Cyber Fraud helpline — पैसा कटते ही तुरंत कॉल करें, फ्री है।', en: 'The National Cyber Fraud helpline — call immediately after money is debited; it’s free.' },
  },
  {
    q: { hi: 'क्या ये टिप्स सभी फोन पर चलेंगे?', en: 'Will these tips work on all phones?' },
    a: { hi: 'हां — Android/iPhone दोनों के स्टेप्स गाइड में अलग-अलग दिए हैं।', en: 'Yes — guides include separate steps for Android and iPhone.' },
  },
  {
    q: { hi: 'फ्रॉड हो गया तो पैसा वापस मिलेगा?', en: 'Will I get my money back after a fraud?' },
    a: { hi: '2 घंटे के अंदर 1930 + bank report पर freeze chances सबसे ज्यादा — देर न करें।', en: 'Reporting to 1930 + your bank within 2 hours gives the best chance of freezing it — don’t delay.' },
  },
  {
    q: { hi: 'क्या SevaSathi पैसा/OTP मांगता है?', en: 'Does SevaSathi ever ask for money/OTP?' },
    a: { hi: 'कभी नहीं। हम कोई service charge नहीं लेते।', en: 'Never. We charge no service fee of any kind.' },
  },
];

/* ------------------------------------------------------------------ */
/* Deadline helpers                                                    */
/* ------------------------------------------------------------------ */

const HI_MONTHS = ['जन', 'फ़र', 'मार्च', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];

/** "2026-07-28" -> { label: "28 जुल", daysLeft } relative to REFERENCE_TODAY. */
export function deadlineInfo(iso: string): { label: string; fullLabel: string; daysLeft: number } {
  const d = new Date(iso + 'T00:00:00+05:30');
  const ms = d.getTime() - REFERENCE_TODAY.getTime();
  const daysLeft = Math.round(ms / 86400000);
  const label = `${d.getDate()} ${HI_MONTHS[d.getMonth()]}`;
  const fullLabel = `${label} ${d.getFullYear()}`;
  return { label, fullLabel, daysLeft };
}

/* ------------------------------------------------------------------ */
/* Search index (shared by SearchOverlay + search page)                */
/* ------------------------------------------------------------------ */

export type SearchGroupId =
  | 'jobs'
  | 'schemes'
  | 'services'
  | 'guides'
  | 'tools'
  | 'scholarships'
  | 'office'
  | 'exams';

export interface SearchGroup {
  id: SearchGroupId;
  label: Bi;
}

/** Result group display order + bilingual labels (search.md §3). */
export const searchGroups: SearchGroup[] = [
  { id: 'jobs', label: { hi: 'नौकरियाँ', en: 'Jobs' } },
  { id: 'schemes', label: { hi: 'योजनाएँ', en: 'Schemes' } },
  { id: 'services', label: { hi: 'सेवाएँ', en: 'Services' } },
  { id: 'guides', label: { hi: 'गाइड', en: 'Guides' } },
  { id: 'tools', label: { hi: 'टूल्स', en: 'Tools' } },
  { id: 'scholarships', label: { hi: 'छात्रवृत्ति', en: 'Scholarships' } },
  { id: 'office', label: { hi: 'ऑफिस', en: 'Office' } },
  { id: 'exams', label: { hi: 'परीक्षा व रिज़ल्ट', en: 'Exams & Results' } },
];

export interface SearchEntry {
  id: string;
  title: Bi;
  kind: Bi;
  href: string;
  keywords: string[];
  /** result group on the search page */
  group: SearchGroupId;
  /** 40px category icon disc */
  icon: LucideIcon;
  tint: Tint;
  /** one-line meta: posts · last date / fee · steps / tool hint */
  meta: Bi;
  /** ISO date — job rows render DeadlineBadge */
  lastDate?: string;
  /** tool rows render a 'टूल' chip */
  tool?: boolean;
}

export const searchIndex: SearchEntry[] = [
  ...jobs.map((j): SearchEntry => ({
    id: j.id,
    title: { hi: j.title, en: j.title },
    kind: { hi: 'नौकरी', en: 'Job' },
    href: '/article',
    keywords: [j.orgShort.toLowerCase(), ...j.tags],
    group: 'jobs',
    icon: Briefcase,
    tint: 'terracotta',
    meta: { hi: `पद ${j.posts} · अंतिम तिथि ${deadlineInfo(j.lastDate).label}`, en: `${j.posts} posts · Last date ${deadlineInfo(j.lastDate).label}` },
    lastDate: j.lastDate,
  })),
  ...schemes.map((s): SearchEntry => ({
    id: s.id,
    title: s.name,
    kind: { hi: 'योजना', en: 'Scheme' },
    href: '/article',
    keywords: [s.audience.en.toLowerCase()],
    group: 'schemes',
    icon: Landmark,
    tint: 'leaf',
    meta: { hi: `${s.benefit} · ${s.audience.hi}`, en: `${s.benefit} · ${s.audience.en}` },
  })),
  ...services.map((s): SearchEntry => ({
    id: s.id,
    title: s.title,
    kind: { hi: 'सेवा गाइड', en: 'Service guide' },
    href: '/article',
    keywords: [s.title.en.toLowerCase()],
    group: 'services',
    icon: s.icon,
    tint: s.tint,
    meta: { hi: `${s.time} · ${s.fee} · ${s.steps} स्टेप्स`, en: `${s.time} · ${s.fee} · ${s.steps} steps` },
  })),
  ...tools.map((t): SearchEntry => ({
    id: t.id,
    title: t.title,
    kind: { hi: 'टूल', en: 'Tool' },
    href: '/tools',
    keywords: [t.title.en.toLowerCase()],
    group: 'tools',
    icon: t.icon,
    tint: t.tint,
    meta: t.desc,
    tool: true,
  })),
  ...articles.map((a): SearchEntry => ({
    id: a.id,
    title: a.title,
    kind: a.category,
    href: '/article',
    keywords: [a.category.en.toLowerCase()],
    group: 'guides',
    icon: a.icon,
    tint: a.tint,
    meta: { hi: `${a.readTime} की गाइड`, en: `${a.readTime} read` },
  })),
  /* ---- search.md §3 demo-index additions ---- */
  {
    id: 'ctet-dec-2026',
    title: { hi: 'CTET December 2026', en: 'CTET December 2026' },
    kind: { hi: 'नौकरी', en: 'Job' },
    href: '/article',
    keywords: ['ctet', 'tet', 'teacher', 'शिक्षक', 'central'],
    group: 'jobs',
    icon: GraduationCap,
    tint: 'cocoa',
    meta: { hi: `शिक्षक पात्रता · अंतिम तिथि ${deadlineInfo('2026-08-14').label}`, en: `Teacher eligibility · Last date ${deadlineInfo('2026-08-14').label}` },
    lastDate: '2026-08-14',
  },
  {
    id: 'ladli-behna',
    title: { hi: 'Ladli Behna Yojana', en: 'Ladli Behna Yojana' },
    kind: { hi: 'योजना', en: 'Scheme' },
    href: '/article',
    keywords: ['ladli', 'women', 'महिला', 'बहना', 'mahila'],
    group: 'schemes',
    icon: Landmark,
    tint: 'rose',
    meta: { hi: '₹1,250/माह · महिला', en: '₹1,250/month · Women' },
  },
  {
    id: 'photo-resizer',
    title: { hi: 'फोटो Resizer', en: 'Photo Resizer' },
    kind: { hi: 'टूल', en: 'Tool' },
    href: '/tools',
    keywords: ['photo', 'resize', 'image', 'फोटो', 'size', 'passport size'],
    group: 'tools',
    icon: Crop,
    tint: 'leaf',
    meta: { hi: 'फोटो का साइज़ mm/px में बदलें', en: 'Resize photos to exact mm/px' },
    tool: true,
  },
  {
    id: 'sign-resizer',
    title: { hi: 'साइन Resizer', en: 'Sign Resizer' },
    kind: { hi: 'टूल', en: 'Tool' },
    href: '/tools',
    keywords: ['sign', 'signature', 'साइन', 'हस्ताक्षर', 'resize'],
    group: 'tools',
    icon: PenLine,
    tint: 'cocoa',
    meta: { hi: 'हस्ताक्षर 10–20KB में तैयार करें', en: 'Signature to 10–20KB' },
    tool: true,
  },
  {
    id: 'nsp-scholarship',
    title: { hi: 'NSP — National Scholarship Portal', en: 'NSP — National Scholarship Portal' },
    kind: { hi: 'छात्रवृत्ति', en: 'Scholarship' },
    href: '/exams',
    keywords: ['nsp', 'scholarship', 'छात्रवृत्ति', 'student', 'छात्र'],
    group: 'scholarships',
    icon: Award,
    tint: 'rose',
    meta: { hi: 'सभी सरकारी छात्रवृत्तियों की एक खिड़की', en: 'One window for govt scholarships' },
  },
  {
    id: 'pm-yasasvi',
    title: { hi: 'PM-YASASVI Scholarship', en: 'PM-YASASVI Scholarship' },
    kind: { hi: 'छात्रवृत्ति', en: 'Scholarship' },
    href: '/exams',
    keywords: ['yasasvi', 'scholarship', 'छात्रवृत्ति', 'obc', 'student'],
    group: 'scholarships',
    icon: Award,
    tint: 'cocoa',
    meta: { hi: 'OBC/EBC/DNT छात्रों के लिए', en: 'For OBC/EBC/DNT students' },
  },
  {
    id: 'xlookup-tutorial',
    title: { hi: 'XLOOKUP सीखें — Step by Step', en: 'XLOOKUP tutorial — step by step' },
    kind: { hi: 'ऑफिस गाइड', en: 'Office guide' },
    href: '/office',
    keywords: ['excel', 'xlookup', 'vlookup', 'formula', 'office', 'ऑफिस'],
    group: 'office',
    icon: Table2,
    tint: 'terracotta',
    meta: { hi: 'Excel फॉर्मूला · 6 min', en: 'Excel formula · 6 min' },
  },
  {
    id: 'resume-tips',
    title: { hi: 'रिज़्यूमे कैसे बनाएँ — 10 Tips', en: 'Resume tips — 10 rules' },
    kind: { hi: 'ऑफिस गाइड', en: 'Office guide' },
    href: '/office',
    keywords: ['resume', 'cv', 'रिज़्यूमे', 'interview', 'career', 'job'],
    group: 'office',
    icon: FileText,
    tint: 'terracotta',
    meta: { hi: 'करियर कॉर्नर · 5 min', en: 'Career corner · 5 min' },
  },
  {
    id: 'neet-ug-result-2026',
    title: { hi: 'NEET UG 2026 Result', en: 'NEET UG 2026 Result' },
    kind: { hi: 'रिज़ल्ट', en: 'Result' },
    href: '/exams',
    keywords: ['neet', 'result', 'रिज़ल्ट', 'medical', 'exam'],
    group: 'exams',
    icon: FileCheck2,
    tint: 'amber',
    meta: { hi: '18 जुल 2026 · घोषित', en: '18 Jul 2026 · Declared' },
  },
];

export const trendingSearches: string[] = [
  'SSC CGL 2026',
  'PM-KISAN किस्त',
  'फोटो 20KB',
  'NEET Result',
  'PAN card',
  'Ayushman card',
  'UP Scholarship',
  'EMI calculator',
];

export const heroSearchPlaceholders = [
  'PAN card कैसे बनवाएँ?',
  'SSC CGL last date?',
  'फोटो 20KB कैसे करें?',
  'PM-KISAN पात्रता?',
];

/** Cycled in the search page input (search.md §1). */
export const searchPagePlaceholders = ['SSC CGL…', 'PM-KISAN…', 'फोटो 20KB…', 'PAN card…'];

export const quickChips = ['आधार कार्ड', 'PAN Card', 'SSC Jobs', '10वीं रिजल्ट', 'फोटो Compress'];

/* ------------------------------------------------------------------ */
/* Trilingual synonym engine (search.md §3)                            */
/* ------------------------------------------------------------------ */

/**
 * Hindi ↔ English ↔ Hinglish synonym map (`पैन`↔`pan`, `फोटो`↔`photo/image`,
 * `नौकरी`↔`job`, `उम्र`↔`age`, …). Both directions are listed explicitly so
 * lookup stays a simple dictionary read.
 */
export const searchSynonyms: Record<string, string[]> = {
  'पैन': ['pan'],
  pan: ['पैन'],
  'फोटो': ['photo', 'image', 'तस्वीर'],
  photo: ['फोटो', 'image'],
  image: ['फोटो', 'photo'],
  'तस्वीर': ['photo', 'image', 'फोटो'],
  'नौकरी': ['job', 'vacancy', 'भर्ती', 'naukri'],
  naukri: ['नौकरी', 'job', 'भर्ती'],
  job: ['नौकरी', 'भर्ती', 'naukri'],
  'भर्ती': ['job', 'recruitment', 'नौकरी', 'vacancy'],
  'उम्र': ['age', 'आयु'],
  'आयु': ['age', 'उम्र'],
  age: ['उम्र', 'आयु'],
  'रिज़ल्ट': ['result'],
  result: ['रिज़ल्ट'],
  'योजना': ['scheme', 'yojana'],
  yojana: ['योजना', 'scheme'],
  scheme: ['योजना', 'yojana'],
  'छात्रवृत्ति': ['scholarship'],
  scholarship: ['छात्रवृत्ति'],
  'आधार': ['aadhaar', 'aadhar'],
  aadhaar: ['आधार', 'aadhar'],
  aadhar: ['आधार', 'aadhaar'],
  'पासपोर्ट': ['passport'],
  passport: ['पासपोर्ट'],
  'मतदान': ['voter', 'vote'],
  voter: ['मतदान', 'vote'],
  'साइन': ['sign', 'signature', 'हस्ताक्षर'],
  sign: ['साइन', 'signature', 'हस्ताक्षर'],
  'हस्ताक्षर': ['sign', 'signature', 'साइन'],
  'रेलवे': ['railway', 'train', 'rrb'],
  railway: ['रेलवे', 'rrb', 'train'],
  'पुलिस': ['police'],
  police: ['पुलिस'],
  'किस्त': ['installment', 'kist', 'pm-kisan', 'kisan'],
  kist: ['किस्त', 'installment', 'pm-kisan'],
  'किसान': ['farmer', 'kisan', 'pm-kisan'],
  kisan: ['किसान', 'farmer', 'pm-kisan'],
  'लोन': ['loan', 'emi'],
  loan: ['लोन', 'emi'],
  emi: ['लोन', 'loan'],
  'कार्ड': ['card'],
  card: ['कार्ड'],
  chota: ['छोटा', 'small', 'compress', 'resize', 'kb'],
  'छोटा': ['chota', 'small', 'compress', 'resize', 'kb'],
  compress: ['कंप्रेस', 'kb', 'chota', 'छोटा'],
  'कंप्रेस': ['compress', 'kb'],
  kb: ['compress', 'कंप्रेस', 'size'],
  'अपडेट': ['update'],
  update: ['अपडेट'],
  'ऑफिस': ['office'],
  office: ['ऑफिस'],
  'रिज़्यूमे': ['resume', 'cv'],
  resume: ['रिज़्यूमे', 'cv'],
  'निकासी': ['withdrawal', 'pf', 'epfo'],
  withdrawal: ['निकासी', 'pf', 'epfo'],
  'ब्याज': ['interest'],
  interest: ['ब्याज'],
};

const norm = (s: string): string => s.toLowerCase().trim();

function queryTokens(query: string): string[] {
  return norm(query).split(/[\s\-–—,.?/!…]+/).filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Office Zone (office.md)                                             */
/* ------------------------------------------------------------------ */

export type FormulaLevel = 'beginner' | 'intermediate' | 'advanced';

export interface OfficeFormula {
  id: string;
  name: string;
  level: FormulaLevel;
  /** "कब इस्तेमाल करें" one-liner */
  use: Bi;
  /** copyable formula / steps string */
  formula: string;
  /** mini example result line, e.g. रिज़ल्ट: "Ravi — ₹24,500" */
  example: string;
}

export const formulaLevelMeta: Record<FormulaLevel, { label: Bi; chipClass: string }> = {
  beginner: { label: { hi: 'Beginner', en: 'Beginner' }, chipClass: 'bg-leaf-100 text-leaf-600' },
  intermediate: { label: { hi: 'Intermediate', en: 'Intermediate' }, chipClass: 'bg-amber-100 text-amber-600' },
  advanced: { label: { hi: 'Advanced', en: 'Advanced' }, chipClass: 'bg-terracotta-100 text-terracotta-700' },
};

export const officeFormulas: OfficeFormula[] = [
  {
    id: 'xlookup',
    name: 'XLOOKUP',
    level: 'beginner',
    use: { hi: 'किसी नाम की सैलरी तुरंत खोजें', en: 'Instantly find anyone’s salary by name' },
    formula: '=XLOOKUP("Ravi",A2:A100,C2:C100)',
    example: 'रिज़ल्ट: "Ravi — ₹24,500"',
  },
  {
    id: 'vlookup',
    name: 'VLOOKUP',
    level: 'beginner',
    use: { hi: 'पुराना पर ज़रूरी — बाईं से दाईं ओर खोज', en: 'Old but essential — looks left to right' },
    formula: '=VLOOKUP(E2,A2:D100,3,FALSE)',
    example: 'रिज़ल्ट: E2 के नाम का 3rd column मान',
  },
  {
    id: 'sumifs',
    name: 'SUMIFS',
    level: 'intermediate',
    use: { hi: 'शर्त के साथ जोड़ (जैसे सिर्फ "Sales" विभाग)', en: 'Conditional sum (e.g. only "Sales" dept)' },
    formula: '=SUMIFS(C:C,A:A,"Sales",B:B,">1000")',
    example: 'रिज़ल्ट: Sales विभाग का कुल ₹3,42,000',
  },
  {
    id: 'countif',
    name: 'COUNTIF / COUNTIFS',
    level: 'beginner',
    use: { hi: 'गिनती शर्त के साथ', en: 'Count cells that meet a condition' },
    formula: '=COUNTIF(B2:B500,"Present")',
    example: 'रिज़ल्ट: 214 "Present" दिन',
  },
  {
    id: 'if-nested',
    name: 'IF + Nested IF',
    level: 'beginner',
    use: { hi: 'ग्रेड/स्लैब अपने आप', en: 'Automatic grades / slabs' },
    formula: '=IF(B2>=75,"Distinction",IF(B2>=40,"Pass","Fail"))',
    example: 'रिज़ल्ट: 81 अंक पर "Distinction"',
  },
  {
    id: 'index-match',
    name: 'INDEX + MATCH',
    level: 'intermediate',
    use: { hi: 'VLOOKUP का बलशाली भाई — किसी भी दिशा में खोज', en: 'VLOOKUP’s stronger sibling — searches any direction' },
    formula: '=INDEX(C:C,MATCH("Ravi",A:A,0))',
    example: 'रिज़ल्ट: "Ravi" की पूरी row से सैलरी',
  },
  {
    id: 'pivot-table',
    name: 'Pivot Table',
    level: 'intermediate',
    use: { hi: '1 क्लिक में पूरा रिपोर्ट', en: 'A full report in one click' },
    formula: 'Insert → PivotTable → Rows: Dept, Values: Sum of Salary',
    example: 'रिज़ल्ट: विभाग-वार सैलरी सारांश तैयार',
  },
  {
    id: 'conditional-formatting',
    name: 'Conditional Formatting',
    level: 'beginner',
    use: { hi: 'रंगों से हाइलाइट — target से ऊपर/नीचे', en: 'Highlight with colors — above/below target' },
    formula: 'Home → Conditional Formatting → Highlight > Target',
    example: 'रिज़ल्ट: target से कम cells लाल हो गईं',
  },
  {
    id: 'textjoin',
    name: 'TEXTJOIN / CONCAT',
    level: 'advanced',
    use: { hi: 'नाम-पता एक सेल में', en: 'Join name + address into one cell' },
    formula: '=TEXTJOIN(", ",TRUE,A2:C2)',
    example: 'रिज़ल्ट: "Ravi, Patna, Bihar"',
  },
];

/* ---------------- Shortcut wall (office.md §3) ---------------- */

export interface ShortcutChip {
  keys: string;
  action: Bi;
}

export const excelShortcuts: ShortcutChip[] = [
  { keys: 'Ctrl+C', action: { hi: 'Copy', en: 'Copy' } },
  { keys: 'Ctrl+V', action: { hi: 'Paste', en: 'Paste' } },
  { keys: 'Ctrl+X', action: { hi: 'Cut', en: 'Cut' } },
  { keys: 'Ctrl+Z', action: { hi: 'Undo', en: 'Undo' } },
  { keys: 'Ctrl+S', action: { hi: 'Save', en: 'Save' } },
  { keys: 'Ctrl+Shift+L', action: { hi: 'Filter', en: 'Filter' } },
  { keys: 'F2', action: { hi: 'Edit cell', en: 'Edit cell' } },
  { keys: 'Alt+=', action: { hi: 'AutoSum', en: 'AutoSum' } },
  { keys: 'Ctrl+PgDn', action: { hi: 'Next sheet', en: 'Next sheet' } },
  { keys: 'Ctrl+PgUp', action: { hi: 'Prev sheet', en: 'Prev sheet' } },
  { keys: 'Ctrl+Home', action: { hi: 'पहला cell', en: 'First cell' } },
  { keys: 'Ctrl+End', action: { hi: 'आखिरी cell', en: 'Last cell' } },
  { keys: 'Ctrl+;', action: { hi: 'आज की तारीख', en: 'Today’s date' } },
  { keys: 'Ctrl+T', action: { hi: 'Table बनाएं', en: 'Make table' } },
  { keys: 'Ctrl+F', action: { hi: 'Find', en: 'Find' } },
  { keys: 'Ctrl+H', action: { hi: 'Replace', en: 'Replace' } },
  { keys: 'Shift+F11', action: { hi: 'नई sheet', en: 'New sheet' } },
  { keys: 'Ctrl+Arrow', action: { hi: 'Data के किनारे', en: 'Jump to data edge' } },
  { keys: 'Ctrl+Space', action: { hi: 'पूरा column', en: 'Whole column' } },
  { keys: 'Shift+Space', action: { hi: 'पूरी row', en: 'Whole row' } },
];

/* ---------------- Word / PPT / Sheets (office.md §4) ---------------- */

export interface AppGuide {
  id: string;
  title: Bi;
  icon: LucideIcon;
  tint: Tint;
  topics: Bi[];
}

export const officeAppGuides: AppGuide[] = [
  {
    id: 'word',
    title: { hi: 'MS Word', en: 'MS Word' },
    icon: FileText,
    tint: 'terracotta',
    topics: [
      { hi: 'Mail Merge से 100 लेटर एक साथ', en: '100 letters at once with Mail Merge' },
      { hi: 'Resume formatting', en: 'Resume formatting' },
      { hi: 'Table & Header-Footer', en: 'Tables & header-footer' },
      { hi: 'PDF में बदलें', en: 'Convert to PDF' },
    ],
  },
  {
    id: 'powerpoint',
    title: { hi: 'PowerPoint', en: 'PowerPoint' },
    icon: Presentation,
    tint: 'amber',
    topics: [
      { hi: '5-स्लाइड रूल', en: 'The 5-slide rule' },
      { hi: 'Design ideas', en: 'Design ideas' },
      { hi: 'Presenter view', en: 'Presenter view' },
      { hi: 'Animation कम, message ज्यादा', en: 'Less animation, more message' },
    ],
  },
  {
    id: 'sheets',
    title: { hi: 'Google Sheets', en: 'Google Sheets' },
    icon: Sheet,
    tint: 'leaf',
    topics: [
      { hi: 'Excel से अंतर', en: 'How it differs from Excel' },
      { hi: 'Sharing & permissions', en: 'Sharing & permissions' },
      { hi: 'IMPORTRANGE', en: 'IMPORTRANGE' },
      { hi: 'Mobile पर Sheets', en: 'Sheets on mobile' },
    ],
  },
];

/* ---------------- Career corner (office.md §5) ---------------- */

export interface CareerGuide {
  id: string;
  title: Bi;
  desc: Bi;
  icon: LucideIcon;
}

export const careerGuides: CareerGuide[] = [
  {
    id: 'resume',
    title: { hi: 'रिज़्यूमे 1-पेज फॉर्मूला', en: 'The 1-page resume formula' },
    desc: { hi: 'fresher + experienced templates, क्या न लिखें', en: 'Fresher + experienced templates, what to skip' },
    icon: FileUser,
  },
  {
    id: 'email',
    title: { hi: 'ईमेल लिखने के 7 नियम', en: '7 rules of email writing' },
    desc: { hi: 'subject line से sign-off तक, 5 ready templates', en: 'Subject line to sign-off, 5 ready templates' },
    icon: Mail,
  },
  {
    id: 'interview',
    title: { hi: 'इंटरव्यू के 10 सवाल', en: '10 interview questions' },
    desc: { hi: '"Tell me about yourself" का सही जवाब + HR round tips', en: 'The right answer to "Tell me about yourself" + HR tips' },
    icon: MessagesSquare,
  },
  {
    id: 'typing',
    title: { hi: 'Typing Speed बढ़ाएं', en: 'Boost typing speed' },
    desc: { hi: '25→40 WPM, फ्री practice रूटीन', en: '25→40 WPM, free practice routine' },
    icon: Keyboard,
  },
];

/* ---------------- Skill path (office.md §6) ---------------- */

export interface SkillStop {
  id: string;
  week: string;
  title: Bi;
  desc: Bi;
}

export const skillPathStops: SkillStop[] = [
  { id: 'week-1', week: 'Week 1', title: { hi: 'Computer basics + files', en: 'Computer basics + files' }, desc: { hi: 'फोल्डर, copy-paste, typing की शुरुआत', en: 'Folders, copy-paste, first typing steps' } },
  { id: 'week-2', week: 'Week 2', title: { hi: 'Excel basics + formulas', en: 'Excel basics + formulas' }, desc: { hi: 'SUM, IF, VLOOKUP तक पहुंचें', en: 'Get to SUM, IF, VLOOKUP' } },
  { id: 'week-3', week: 'Week 3', title: { hi: 'Pivot + charts', en: 'Pivot + charts' }, desc: { hi: 'रिपोर्ट और चार्ट से data बोलता है', en: 'Make data speak with reports & charts' } },
  { id: 'week-4', week: 'Week 4', title: { hi: 'Word + PowerPoint', en: 'Word + PowerPoint' }, desc: { hi: 'लेटर, रिज़्यूमे और 5-स्लाइड प्रेज़ेंटेशन', en: 'Letters, resumes & 5-slide decks' } },
  { id: 'week-5', week: 'Week 5', title: { hi: 'Resume + Interview', en: 'Resume + Interview' }, desc: { hi: '1-पेज रिज़्यूमे और HR सवालों की तैयारी', en: 'A 1-page resume + HR question prep' } },
];

export const officeFaqs: Faq[] = [
  {
    q: { hi: 'क्या Excel मोबाइल पर सीख सकते हैं?', en: 'Can I learn Excel on a mobile phone?' },
    a: { hi: 'हां, Excel/Sheets app से practice होती है; formulas वही रहते हैं।', en: 'Yes — practice on the Excel/Sheets app; the formulas stay the same.' },
  },
  {
    q: { hi: 'Course फ्री है?', en: 'Is the course free?' },
    a: { hi: 'हां, सभी ट्यूटोरियल 100% फ्री — कोई sign-up नहीं।', en: 'Yes, every tutorial is 100% free — no sign-up needed.' },
  },
  {
    q: { hi: 'Certificate मिलता है?', en: 'Do I get a certificate?' },
    a: { hi: 'नहीं — हम skill सिखाते हैं; certificate के लिए official courses (Skill India) की गाइड भी दी है।', en: 'No — we teach skills; we also link official courses (Skill India) for certificates.' },
  },
  {
    q: { hi: 'Office में Excel बिना mouse तेज़ होता है?', en: 'Is Excel faster without a mouse?' },
    a: { hi: 'Shortcuts wall देखें — 50 शॉर्टकट सीखकर काम आधा समय में होता है।', en: 'See the shortcut wall — 50 shortcuts halve your working time.' },
  },
];

/* ------------------------------------------------------------------ */
/* Tools page (tools.md)                                               */
/* ------------------------------------------------------------------ */

export interface ToolDockItem {
  id: string;
  label: Bi;
  icon: LucideIcon;
  tint: Tint;
}

export const toolDock: ToolDockItem[] = [
  { id: 'compress', label: { hi: 'फोटो Compress', en: 'Compress' }, icon: ImageDown, tint: 'leaf' },
  { id: 'resize', label: { hi: 'फोटो Resize', en: 'Resize' }, icon: Crop, tint: 'terracotta' },
  { id: 'sign', label: { hi: 'Sign Resize', en: 'Signature' }, icon: PenLine, tint: 'cocoa' },
  { id: 'age', label: { hi: 'उम्र', en: 'Age' }, icon: CalendarHeart, tint: 'amber' },
  { id: 'percent', label: { hi: 'प्रतिशत', en: 'Percent' }, icon: Percent, tint: 'rose' },
  { id: 'emi', label: { hi: 'EMI', en: 'EMI' }, icon: IndianRupee, tint: 'terracotta' },
  { id: 'unit', label: { hi: 'Unit', en: 'Units' }, icon: Ruler, tint: 'leaf' },
  { id: 'word', label: { hi: 'Word Count', en: 'Words' }, icon: Type, tint: 'cocoa' },
];

export const toolsFaqs: Faq[] = [
  {
    q: { hi: 'क्या मेरी फोटो कहीं upload होती है?', en: 'Is my photo uploaded anywhere?' },
    a: { hi: 'नहीं। सब कुछ आपके ब्राउज़र में होता है — इंटरनेट बंद करके भी test कर सकते हैं।', en: 'No. Everything happens in your browser — you can even test with the internet off.' },
  },
  {
    q: { hi: 'फॉर्म में "फोटो 20KB से कम" लिखा है — कैसे करें?', en: 'The form says "photo under 20KB" — how?' },
    a: { hi: 'Image Compressor खोलें, target 20KB रखें, Download करें।', en: 'Open the Image Compressor, set target 20KB, and Download.' },
  },
  {
    q: { hi: 'Age "as on 01/08/2026" का मतलब?', en: 'What does age "as on 01/08/2026" mean?' },
    a: { hi: 'उस तारीख को आपकी उम्र — Age Calculator में दूसरी तारीख 01/08/2026 भरें।', en: 'Your age on that date — enter 01/08/2026 as the second date in the Age Calculator.' },
  },
  {
    q: { hi: 'EMI calculator बैंक से अलग क्यों?', en: 'Why does the EMI differ from the bank’s?' },
    a: { hi: 'बैंक processing fee/बीमा जोड़ते हैं — final EMI bank से पक्की करें।', en: 'Banks add processing fees/insurance — confirm the final EMI with your bank.' },
  },
];

/* ------------------------------------------------------------------ */
/* Services hub (services.md)                                          */
/* ------------------------------------------------------------------ */

/** Popular service tiles — services.md §2 (exact time/fee/steps from design). */
export const popularServices: ServiceItem[] = [
  { id: 'aadhaar',    title: { hi: 'आधार कार्ड', en: 'Aadhaar' },                    icon: IdCard,     tint: 'amber',      time: '10 मिन', fee: '₹0–50',   steps: 6 },
  { id: 'pan',        title: { hi: 'PAN कार्ड', en: 'PAN Card' },                    icon: CreditCard, tint: 'amber',      time: '15 मिन', fee: '₹72–107', steps: 7 },
  { id: 'voter',      title: { hi: 'Voter ID', en: 'Voter ID' },                     icon: Vote,       tint: 'terracotta', time: '12 मिन', fee: 'Free',     steps: 6 },
  { id: 'epfo',       title: { hi: 'EPFO / PF निकासी', en: 'EPFO / PF Withdrawal' }, icon: PiggyBank,  tint: 'leaf',       time: '20 मिन', fee: 'Free',     steps: 8 },
  { id: 'passport',   title: { hi: 'पासपोर्ट', en: 'Passport' },                     icon: Plane,      tint: 'cocoa',      time: '30 मिन', fee: '₹1,500',  steps: 9 },
  { id: 'ration',     title: { hi: 'राशन कार्ड', en: 'Ration Card' },                icon: Wheat,      tint: 'leaf',       time: '15 मिन', fee: 'Free',     steps: 6 },
  { id: 'dl',         title: { hi: 'ड्राइविंग लाइसेंस', en: 'Driving Licence' },     icon: CarFront,   tint: 'terracotta', time: '25 मिन', fee: '₹200–700', steps: 8 },
  { id: 'digilocker', title: { hi: 'DigiLocker', en: 'DigiLocker' },                 icon: FolderLock, tint: 'cocoa',      time: '5 मिन',  fee: 'Free',     steps: 4 },
];

/** Certificates & document services — services.md §3. */
export interface DocService {
  id: string;
  title: Bi;
  icon: LucideIcon;
  tint: Tint;
  time: string;
  badge?: string;
}

export const docServices: DocService[] = [
  { id: 'income-cert',     title: { hi: 'आय प्रमाण पत्र', en: 'Income Certificate' },        icon: BadgeIndianRupee, tint: 'amber',      time: '7–15 दिन' },
  { id: 'caste-cert',      title: { hi: 'जाति प्रमाण पत्र', en: 'Caste Certificate' },       icon: Users,            tint: 'leaf',       time: '7–15 दिन' },
  { id: 'domicile-cert',   title: { hi: 'निवास प्रमाण पत्र', en: 'Domicile Certificate' },   icon: House,            tint: 'terracotta', time: '7–15 दिन' },
  { id: 'birth-death',     title: { hi: 'जन्म/मृत्यु प्रमाण पत्र', en: 'Birth/Death Certificate' }, icon: Baby,     tint: 'rose',       time: '3–7 दिन' },
  { id: 'eshram',          title: { hi: 'ई-श्रम कार्ड', en: 'e-Shram Card' },                icon: HardHat,          tint: 'cocoa',      time: '10 मिन', badge: '₹2 लाख बीमा' },
  { id: 'dbt-seeding',     title: { hi: 'आधार-बैंक सीडिंग', en: 'DBT Seeding' },             icon: Landmark,         tint: 'leaf',       time: '5 मिन' },
  { id: 'aadhaar-mobile',  title: { hi: 'मोबाइल नंबर आधार लिंक', en: 'Mobile–Aadhaar Link' }, icon: Smartphone,      tint: 'amber',      time: '5 मिन' },
  { id: 'name-correction', title: { hi: 'नाम/पता सुधार गाइड्स', en: 'Name/Address Correction' }, icon: FilePenLine,   tint: 'cocoa',      time: '10 मिन' },
];

/** Official portal directory — services.md §5. */
export interface OfficialPortal {
  id: string;
  service: string;
  portal: string;
  url: string;
  helpline?: string;
}

export const officialPortals: OfficialPortal[] = [
  { id: 'aadhaar',    service: 'Aadhaar (UIDAI)',  portal: 'uidai.gov.in',         url: 'https://uidai.gov.in',            helpline: '1947' },
  { id: 'pan',        service: 'PAN (Income Tax)', portal: 'incometax.gov.in',     url: 'https://www.incometax.gov.in',    helpline: '1800-180-1961' },
  { id: 'epfo',       service: 'EPFO',             portal: 'epfindia.gov.in',      url: 'https://www.epfindia.gov.in',     helpline: '14470' },
  { id: 'voter',      service: 'Voter ID (ECI)',   portal: 'voters.eci.gov.in',    url: 'https://voters.eci.gov.in',       helpline: '1950' },
  { id: 'passport',   service: 'Passport',         portal: 'passportindia.gov.in', url: 'https://www.passportindia.gov.in', helpline: '1800-258-1800' },
  { id: 'digilocker', service: 'DigiLocker',       portal: 'digilocker.gov.in',    url: 'https://www.digilocker.gov.in' },
];

/** Services hub FAQs — services.md §6. */
export const servicesFaqs: Faq[] = [
  {
    q: { hi: 'क्या SevaSathi पर फॉर्म भर सकते हैं?', en: 'Can we fill forms on SevaSathi?' },
    a: { hi: 'नहीं। हम गाइड देते हैं; फॉर्म official site पर भरें — यही सुरक्षित है।', en: 'No. We provide guides; fill the form on the official site — that is the safe way.' },
  },
  {
    q: { hi: 'CSC center कहां मिलेगा?', en: 'Where can I find a CSC center?' },
    a: { hi: 'अपने गांव/शहर के Common Service Center में — Google Maps पर "CSC near me" खोजें।', en: 'At the Common Service Center in your village/city — search "CSC near me" on Google Maps.' },
  },
  {
    q: { hi: 'दस्तावेज़ में गलती हो तो?', en: 'What if a document has a mistake?' },
    a: { hi: 'हर सेवा की "Correction" गाइड अलग से दी है — ज़्यादातर ऑनलाइन ठीक हो जाती है।', en: 'Every service has a separate "Correction" guide — most mistakes get fixed online.' },
  },
  {
    q: { hi: 'फीस कितनी लगती है?', en: 'How much is the fee?' },
    a: { hi: 'हर गाइड में official फीस लिखी है; इससे ज्यादा मांगे तो शिकायत करें।', en: 'Every guide lists the official fee; if someone asks for more, file a complaint.' },
  },
];

/* ------------------------------------------------------------------ */
/* PAN guide article (article.md — Guide variant demo)                 */
/* ------------------------------------------------------------------ */

export const panArticle = {
  id: 'pan-card-guide',
  breadcrumb: [
    { label: { hi: 'होम', en: 'Home' }, href: '/' },
    { label: { hi: 'सेवाएँ', en: 'Services' }, href: '/services' },
    { label: { hi: 'PAN कार्ड', en: 'PAN Card' } },
  ] as { label: Bi; href?: string }[],
  category: { hi: 'सेवाएँ', en: 'Services' } as Bi,
  difficulty: { hi: 'आसान', en: 'Easy' } as Bi,
  title: { hi: 'PAN कार्ड ऑनलाइन कैसे बनवाएं', en: 'How to apply for PAN Card online' } as Bi,
  sub: { hi: 'How to apply for PAN Card online — 2026 guide', en: 'PAN कार्ड ऑनलाइन कैसे बनवाएं — 2026 गाइड' } as Bi,
  updated: { hi: 'Updated: 12 जुल 2026', en: 'Updated: 12 Jul 2026' } as Bi,
  readTime: { hi: '8 मिनट पढ़ें', en: '8 min read' } as Bi,
  fee: { hi: '₹107 फीस', en: '₹107 fee' } as Bi,
  quickAnswer: {
    hi: 'NSDL (Protean) या UTIITSL की official वेबसाइट पर Form 49A भरें, Aadhaar OTP से e-KYC करें और ₹72–107 फीस दें। e-PAN 48 घंटे में PDF मिल जाता है; फिजिकल कार्ड 15 दिन में घर आता है।',
    en: 'Fill Form 49A on the official NSDL (Protean) or UTIITSL website, complete e-KYC with Aadhaar OTP and pay ₹72–107. The e-PAN PDF arrives within 48 hours; the physical card reaches home in 15 days.',
  } as Bi,
  feeNote: { hi: 'फीस official portal पर ही दें — किसी agent को नहीं।', en: 'Pay the fee only on the official portal — never to an agent.' } as Bi,
  trustNote: {
    hi: 'यह जानकारी 12 जुल 2026 को verify की गई है। अंतिम जानकारी हमेशा official website से जांचें। SevaSathi एक निजी जानकारी पोर्टल है, सरकारी वेबसाइट नहीं।',
    en: 'This information was verified on 12 Jul 2026. Always confirm final details on the official website. SevaSathi is a private information portal, not a government website.',
  } as Bi,
};

/** Documents checklist — article.md §4. */
export interface GuideDocItem {
  name: Bi;
  note: Bi;
  tool?: { label: Bi; href: string };
}

export const panDocs: GuideDocItem[] = [
  {
    name: { hi: 'आधार कार्ड', en: 'Aadhaar Card' },
    note: { hi: 'mobile number linked हो', en: 'mobile number must be linked' },
  },
  {
    name: { hi: 'पासपोर्ट साइज फोटो', en: 'Passport-size photo' },
    note: { hi: '200×230px, <20KB', en: '200×230px, <20KB' },
    tool: { label: { hi: '→ फोटो Compressor', en: '→ Photo Compressor' }, href: '/tools' },
  },
  {
    name: { hi: 'हस्ताक्षर scan', en: 'Scanned signature' },
    note: { hi: '<10KB', en: '<10KB' },
    tool: { label: { hi: '→ Sign Resizer', en: '→ Sign Resizer' }, href: '/tools' },
  },
];

/** Fees table — article.md §5 (amounts count up). */
export interface FeeRow {
  label: Bi;
  amount: number;
}

export const panFees: FeeRow[] = [
  { label: { hi: 'e-PAN (PDF only)', en: 'e-PAN (PDF only)' }, amount: 72 },
  { label: { hi: 'Physical card', en: 'Physical card' }, amount: 107 },
  { label: { hi: 'Correction/Update', en: 'Correction/Update' }, amount: 50 },
  { label: { hi: 'Foreign dispatch', en: 'Foreign dispatch' }, amount: 959 },
];

/** Step-by-step content — article.md §6. */
export interface GuideStepData {
  title: Bi;
  desc: Bi;
  tip?: Bi;
}

export const panSteps: GuideStepData[] = [
  {
    title: { hi: 'Official वेबसाइट खोलें', en: 'Open the official website' },
    desc: { hi: 'onlineservices.proteantech.in या utiitsl.com — दोनों government-authorized हैं।', en: 'onlineservices.proteantech.in or utiitsl.com — both are government-authorized.' },
    tip: { hi: '.gov.in न हो तो भी ठीक है — ये दोनों authorized हैं; बाकी "pan-agent" sites से बचें।', en: 'It is fine that these are not .gov.in — both are authorized; avoid other "pan-agent" sites.' },
  },
  {
    title: { hi: '"New PAN — Indian Citizen (Form 49A)" चुनें', en: 'Choose "New PAN — Indian Citizen (Form 49A)"' },
    desc: { hi: 'Application type: NEW; Category: Individual.', en: 'Application type: NEW; Category: Individual.' },
  },
  {
    title: { hi: 'अपनी जानकारी भरें', en: 'Fill in your details' },
    desc: { hi: 'नाम, जन्म तारीख, मोबाइल, ईमेल — Aadhaar जैसा ही लिखें।', en: 'Name, date of birth, mobile, email — write everything exactly as on Aadhaar.' },
    tip: { hi: 'स्पेलिंग Aadhaar से match होनी चाहिए, वरना reject हो सकता है।', en: 'Spelling must match Aadhaar, otherwise the application can be rejected.' },
  },
  {
    title: { hi: 'Aadhaar e-KYC करें', en: 'Complete Aadhaar e-KYC' },
    desc: { hi: 'Aadhaar नंबर → OTP → verify।', en: 'Aadhaar number → OTP → verify.' },
  },
  {
    title: { hi: 'फोटो और साइन अपलोड करें', en: 'Upload photo and signature' },
    desc: { hi: 'साइज rules: फोटो 200×230px <20KB, साइन <10KB।', en: 'Size rules: photo 200×230px <20KB, sign <10KB.' },
    tip: { hi: 'हमारे Photo/Sign Resizer से 30 सेकंड में बनाएं →', en: 'Make them in 30 seconds with our Photo/Sign Resizer →' },
  },
  {
    title: { hi: 'फीस का भुगतान करें', en: 'Pay the fee' },
    desc: { hi: 'UPI/कार्ड/netbanking ₹72–107; receipt PDF सहेजें।', en: 'UPI/card/netbanking ₹72–107; save the receipt PDF.' },
  },
  {
    title: { hi: 'e-PAN डाउनलोड करें / ट्रैक करें', en: 'Download / track your e-PAN' },
    desc: { hi: '48 घंटे में ईमेल पर PDF; status: acknowledgement number से।', en: 'PDF arrives by email within 48 hours; track status with the acknowledgement number.' },
    tip: { hi: 'e-PAN PDF DigiLocker में भी आ जाता है।', en: 'The e-PAN PDF also arrives in DigiLocker.' },
  },
];

/** Official links box — article.md §7. */
export interface ArticleLink {
  id: string;
  name: string;
  note?: Bi;
  url: string;
}

export const panOfficialLinks: ArticleLink[] = [
  { id: 'protean', name: 'Protean NSDL e-Gov', url: 'https://onlineservices.proteantech.in' },
  { id: 'utiitsl', name: 'UTIITSL', url: 'https://www.utiitsl.com' },
  { id: 'incometax', name: 'incometax.gov.in', note: { hi: 'e-PAN download', en: 'e-PAN download' }, url: 'https://www.incometax.gov.in' },
];

export const panHelpline = { number: '020-27218080', tel: 'tel:02027218080' };

/** Article-specific FAQs — article.md §8. */
export const panFaqs: Faq[] = [
  {
    q: { hi: 'e-PAN और physical PAN में फर्क?', en: 'Difference between e-PAN and physical PAN?' },
    a: { hi: 'दोनों legally बराबर हैं; e-PAN फटाफट PDF मिल जाता है।', en: 'Both are legally equal; the e-PAN is delivered instantly as a PDF.' },
  },
  {
    q: { hi: 'Aadhaar में मोबाइल लिंक नहीं है?', en: 'Mobile number not linked with Aadhaar?' },
    a: { hi: 'पहले Aadhaar center पर मोबाइल अपडेट कराएं — फिर e-KYC चलेगी।', en: 'First update your mobile number at an Aadhaar center — then e-KYC will work.' },
  },
  {
    q: { hi: 'PAN में नाम/जन्मतिथि गलत है?', en: 'Wrong name/date of birth on PAN?' },
    a: { hi: 'Correction form भरें (₹50) — गाइड: "PAN Correction कैसे करें"।', en: 'Fill the correction form (₹50) — see the guide "PAN Correction कैसे करें".' },
  },
  {
    q: { hi: 'कितने दिन में मिलता है?', en: 'How many days does it take?' },
    a: { hi: 'e-PAN ~48 घंटे; physical ~15 दिन (speed post)।', en: 'e-PAN ~48 hours; physical ~15 days (speed post).' },
  },
];

/** Related guides + prev/next — article.md §9. */
export interface RelatedGuide {
  id: string;
  title: Bi;
  icon: LucideIcon;
  tint: Tint;
  readTime: string;
  steps: number;
}

export const panRelated: RelatedGuide[] = [
  { id: 'aadhaar-mobile-link', title: { hi: 'Aadhaar में मोबाइल नंबर लिंक कैसे करें', en: 'How to link mobile number with Aadhaar' }, icon: Smartphone, tint: 'amber', readTime: '4 मिनट', steps: 4 },
  { id: 'pan-correction', title: { hi: 'PAN Correction Guide', en: 'PAN Correction Guide' }, icon: FilePenLine, tint: 'terracotta', readTime: '5 मिनट', steps: 5 },
  { id: 'instant-e-pan', title: { hi: 'Instant e-PAN (बिना फीस) कैसे बनाएं', en: 'How to get an instant e-PAN (free)' }, icon: Zap, tint: 'leaf', readTime: '3 मिनट', steps: 3 },
];

export const panPrevNext = {
  prev: { hi: 'Voter ID बनवाएं', en: 'Get a Voter ID' } as Bi,
  next: { hi: 'PF निकासी कैसे करें', en: 'How to withdraw PF' } as Bi,
};

/* ------------------------------------------------------------------ */
/* Jobs hub (design/jobs.md)                                           */
/* ------------------------------------------------------------------ */

export interface HubStat {
  id: string;
  value: number;
  label: Bi;
}

/** Hero mini-stat chips (jobs.md §1). */
export const jobHubStats: HubStat[] = [
  { id: 'new-jobs', value: 38, label: { hi: 'नई नौकरियाँ', en: 'New Jobs' } },
  { id: 'admit-cards', value: 12, label: { hi: 'Admit Cards', en: 'Admit Cards' } },
  { id: 'results', value: 9, label: { hi: 'Results', en: 'Results' } },
  { id: 'answer-keys', value: 6, label: { hi: 'Answer Keys', en: 'Answer Keys' } },
];

/** "इस हफ्ते आखिरी तारीख" urgency strip order (jobs.md §2). */
export const urgentJobIds = ['upsc-cds-ii-2026', 'india-post-gds', 'army-agniveer-rally-jal', 'rajasthan-patwari-2026'];

/** Main feed order (jobs.md §3 tab 1) + load-more pool. */
export const jobFeedIds = ['ssc-cgl-2026', 'ibps-po-xvi', 'rrb-ntpc-2026', 'up-police-constable', 'railway-group-d', 'bihar-ssc-inter-2026', 'army-agniveer-cee-2026', 'ctet-dec-2026'];
export const jobFeedMoreIds = ['upsc-cds-ii-2026', 'india-post-gds', 'rajasthan-patwari-2026', 'army-agniveer-rally-jal', 'ssc-mts-2026', 'aiims-norcet-9'];

/** Feed cards that show a cocoa "coming soon" chip instead of a deadline badge. */
export const comingSoonJobIds = ['railway-group-d'];

/** Row shape for admit-card / result / answer-key tabs (jobs.md §3). */
export interface JobHubListItem {
  id: string;
  title: string;
  /** mono meta line — exam date / declared date */
  meta: string;
  /** pulsing LIVE marker */
  live?: boolean;
  /** objection-window chip (answer keys) */
  chip?: string;
}

export const jobHubAdmitCards: JobHubListItem[] = [
  { id: 'ac-ssc-cgl-t1', title: 'SSC CGL Tier-1 Admit Card', meta: 'Exam: 12–26 सितं' },
  { id: 'ac-rrb-ntpc-cbt1', title: 'RRB NTPC CBT-1 Admit Card', meta: 'Exam: अगस्त 2026' },
  { id: 'ac-ibps-rrb-po', title: 'IBPS RRB PO Prelims Admit Card', meta: 'Exam: अगस्त 2026' },
  { id: 'ac-up-police-pet', title: 'UP Police Constable PET Admit Card', meta: 'PET: सितं 2026' },
  { id: 'ac-ctet-july', title: 'CTET July 2026 Admit Card', meta: 'Exam: 20 जुल', live: true },
  { id: 'ac-ssc-mts-pet', title: 'SSC MTS Havaldar PET Admit Card', meta: 'PET: अगस्त 2026' },
];

export const jobHubResults: JobHubListItem[] = [
  { id: 'res-neet-ug-2026', title: 'NEET UG 2026 Result', meta: 'Declared: 14 जून' },
  { id: 'res-ssc-mts-final', title: 'SSC MTS 2025 Final Result', meta: 'Declared: 09 जुल' },
  { id: 'res-ibps-rrb-clerk', title: 'IBPS RRB Clerk 2025 Final', meta: 'Declared: 02 जुल' },
  { id: 'res-up-board-scrutiny', title: 'UP Board 10th/12th Scrutiny Result', meta: 'Declared: 16 जुल' },
  { id: 'res-railway-alp-cbt2', title: 'Railway ALP CBT-2 Result', meta: 'Declared: 11 जुल' },
  { id: 'res-bihar-police-final', title: 'Bihar Police Constable Final Result', meta: 'Declared: 05 जुल' },
];

export const jobHubAnswerKeys: JobHubListItem[] = [
  { id: 'key-ssc-cgl-t1', title: 'SSC CGL 2026 Tier-1 Answer Key', meta: 'Answer Key + Objection', chip: 'Objection: 22–24 जुल' },
  { id: 'key-rrb-ntpc', title: 'RRB NTPC CBT-1 Answer Key', meta: 'Answer Key + Objection', chip: 'Objection: 25–28 जुल' },
  { id: 'key-ctet-july', title: 'CTET July 2026 Answer Key', meta: 'Provisional Answer Key', chip: 'Objection: 23–26 जुल' },
  { id: 'key-ibps-po-pre', title: 'IBPS PO Prelims Answer Key', meta: 'Answer Key', chip: 'Objection: 29–31 जुल' },
];

/** Help strip mini service cards (jobs.md §5). */
export const jobHelpServices: ServiceItem[] = [
  { id: 'how-to-find-job', title: { hi: 'नौकरी कैसे ढूंढें', en: 'How to find' }, icon: Search, tint: 'terracotta', time: '5 मिनट', fee: '₹0', steps: 4 },
  { id: 'how-to-apply-job', title: { hi: 'फॉर्म कैसे भरें', en: 'How to apply' }, icon: FileText, tint: 'amber', time: '10 मिनट', fee: '₹0', steps: 6 },
  { id: 'documents-checklist', title: { hi: 'Documents checklist', en: 'Documents checklist' }, icon: ClipboardList, tint: 'leaf', time: '7 मिनट', fee: '₹0', steps: 5 },
];

export const jobsFaqs: Faq[] = [
  {
    q: { hi: 'सरकारी नौकरी का फॉर्म कहां से भरें?', en: 'Where do I fill a government job form?' },
    a: { hi: 'हमेशा official website (ssc.gov.in, ibps.in…) से। हम सिर्फ जानकारी देते हैं।', en: 'Always on the official website (ssc.gov.in, ibps.in…). We only provide information.' },
  },
  {
    q: { hi: 'क्या SevaSathi पर apply कर सकते हैं?', en: 'Can I apply on SevaSathi?' },
    a: { hi: 'नहीं, हम guide देते हैं; form हमेशा official site पर भरें।', en: 'No — we provide guides; always fill the form on the official site.' },
  },
  {
    q: { hi: 'Age limit कैसे गिनें?', en: 'How is the age limit calculated?' },
    a: { hi: 'हमारा Age Calculator इस्तेमाल करें — "Age as on" date भरें।', en: 'Use our Age Calculator — enter the "Age as on" date.' },
  },
  {
    q: { hi: 'फॉर्म का पैसा कट गया पर receipt नहीं आई?', en: 'Money deducted but no receipt?' },
    a: { hi: '48 घंटे बैंक स्टेटमेंट जांचें, फिर helpline/official grievance portal।', en: 'Check your bank statement for 48 hours, then the helpline / official grievance portal.' },
  },
  {
    q: { hi: 'नकली job messages से कैसे बचें?', en: 'How to avoid fake job messages?' },
    a: { hi: 'जो नौकरी के लिए पैसा मांगे, वो fraud है। Life Hacks पढ़ें।', en: 'Anyone asking money for a job is a fraud. Read Life Hacks.' },
  },
];

/* ------------------------------------------------------------------ */
/* Schemes hub (design/schemes.md)                                     */
/* ------------------------------------------------------------------ */

export interface AudiencePill {
  id: string;
  label: string;
  tint: Tint;
}

/** Sticky audience filters (schemes.md §2). */
export const schemeAudiencePills: AudiencePill[] = [
  { id: 'all', label: 'सभी All', tint: 'terracotta' },
  { id: 'women', label: 'महिलाएँ Women', tint: 'rose' },
  { id: 'farmers', label: 'किसान Farmers', tint: 'leaf' },
  { id: 'students', label: 'छात्र Students', tint: 'cocoa' },
  { id: 'senior', label: 'बुज़ुर्ग Senior', tint: 'amber' },
  { id: 'youth', label: 'युवा/रोज़गार Youth', tint: 'terracotta' },
  { id: 'housing', label: 'आवास Housing', tint: 'amber' },
  { id: 'business', label: 'बिज़नेस Business', tint: 'cocoa' },
];

/** scheme id → audience pill id (drives hub filtering). */
export const schemeAudienceMap: Record<string, string> = {
  'pm-kisan': 'farmers',
  'ayushman-bharat': 'all',
  'sukanya-samriddhi': 'women',
  'pm-awas': 'housing',
  'pm-mudra': 'business',
  ujjwala: 'women',
  'ladli-behna': 'women',
  'kisan-credit-card': 'farmers',
  'pm-jan-dhan': 'all',
  'atal-pension': 'senior',
  'pm-vishwakarma': 'business',
  'nsp-scholarship': 'students',
  'pm-kaushal-vikas': 'youth',
};

/** Schemes grid order (schemes.md §4) + load-more pool. */
export const schemeGridIds = ['ayushman-bharat', 'sukanya-samriddhi', 'pm-awas', 'ladli-behna', 'ujjwala', 'kisan-credit-card', 'pm-jan-dhan', 'atal-pension', 'pm-vishwakarma'];
export const schemeGridMoreIds = ['pm-kisan', 'pm-mudra', 'nsp-scholarship', 'pm-kaushal-vikas'];

/** PM-KISAN featured mini-steps (schemes.md §3). */
export const pmkisanSteps: Bi[] = [
  { hi: 'pmkisan.gov.in पर eKYC करें', en: 'Do eKYC on pmkisan.gov.in' },
  { hi: 'भूमि रिकॉर्ड सत्यापन', en: 'Land record verification' },
  { hi: 'किस्त "Beneficiary Status" से ट्रैक करें', en: 'Track installment via "Beneficiary Status"' },
];

/** Universal 4-step "योजना का लाभ कैसे उठाएं" explainer (schemes.md §5). */
export const schemeClaimSteps: { title: Bi; desc: Bi }[] = [
  {
    title: { hi: 'अपनी पात्रता जांचें', en: 'Check your eligibility' },
    desc: { hi: 'उम्र, आय और दस्तावेज़ योजना की शर्तों से मिलाएं।', en: 'Match age, income and documents with the scheme rules.' },
  },
  {
    title: { hi: 'दस्तावेज़ तैयार रखें', en: 'Keep documents ready' },
    desc: { hi: 'Aadhaar, bank passbook, फोटो और जाति/आय प्रमाण पत्र।', en: 'Aadhaar, bank passbook, photo and caste/income certificates.' },
  },
  {
    title: { hi: 'Official portal या CSC से apply करें', en: 'Apply via official portal or CSC' },
    desc: { hi: 'फॉर्म सिर्फ .gov.in साइट या नज़दीकी Common Service Center पर।', en: 'Apply only on the .gov.in site or a nearby Common Service Center.' },
  },
  {
    title: { hi: 'Status ट्रैक करें व SMS रखें', en: 'Track status & keep SMS' },
    desc: { hi: 'Application number सहेजें; हर SMS का screenshot रखें।', en: 'Save the application number; screenshot every SMS.' },
  },
];

export const schemesFaqs: Faq[] = [
  {
    q: { hi: 'योजना का पैसा कब आता है?', en: 'When does the scheme money arrive?' },
    a: { hi: 'DBT से सीधे बैंक खाते में; status official portal पर "Beneficiary Status" से देखें।', en: 'Directly to your bank account via DBT; check status on the official portal under "Beneficiary Status".' },
  },
  {
    q: { hi: 'Aadhaar-bank link ज़रूरी है?', en: 'Is Aadhaar-bank linking mandatory?' },
    a: { hi: 'हां, लगभग सभी DBT योजनाओं के लिए। Services में "Aadhaar-bank seeding" गाइड पढ़ें।', en: 'Yes, for almost all DBT schemes. Read the "Aadhaar-bank seeding" guide in Services.' },
  },
  {
    q: { hi: 'एक से ज्यादा योजनाओं का लाभ मिल सकता है?', en: 'Can I get benefits from multiple schemes?' },
    a: { hi: 'अधिकतर में हां, पर कुछ mutually exclusive हैं — गाइड में बताया है।', en: 'Mostly yes, but some are mutually exclusive — explained in the guide.' },
  },
  {
    q: { hi: 'CSC center क्या होता है?', en: 'What is a CSC center?' },
    a: { hi: 'गांव/मोहल्ले का Common Service Center — वहां ₹20–50 में फॉर्म भरवा सकते हैं।', en: 'Your village/neighbourhood Common Service Center — get forms filled there for ₹20–50.' },
  },
];

/** Token + all known synonyms (prefix-tolerant: "photos"→"photo", "नौकरियों"→"नौकरी"). */
export function expandToken(token: string): string[] {
  const out = new Set<string>([token]);
  const direct = searchSynonyms[token];
  if (direct) direct.forEach((x) => out.add(x));
  if (token.length >= 3) {
    for (const key of Object.keys(searchSynonyms)) {
      if (key.length >= 3 && !out.has(key) && (token.startsWith(key) || key.startsWith(token))) {
        out.add(key);
        searchSynonyms[key].forEach((x) => out.add(x));
      }
    }
  }
  return [...out];
}

function haystack(e: SearchEntry): string {
  const g = searchGroups.find((x) => x.id === e.group);
  return norm([
    e.title.hi,
    e.title.en,
    e.kind.hi,
    e.kind.en,
    g ? g.label.hi : '',
    g ? g.label.en : '',
    e.meta.hi,
    e.meta.en,
    ...e.keywords,
  ].join(' '));
}

function scoreEntry(e: SearchEntry, q: string, tokens: string[][]): { score: number; all: boolean } {
  const hay = haystack(e);
  const hi = norm(e.title.hi);
  const en = norm(e.title.en);
  let score = 0;
  let all = true;
  if (q.length >= 2 && hay.includes(q)) score += 40;
  if (hi.startsWith(q) || en.startsWith(q)) score += 60;
  else if (q.length >= 2 && (hi.includes(q) || en.includes(q))) score += 30;
  for (const variants of tokens) {
    const hit = variants.some((v) => hay.includes(v));
    if (!hit) {
      all = false;
      continue;
    }
    score += 10 + Math.min(variants[0].length, 12);
    if (variants.some((v) => hi.includes(v) || en.includes(v))) score += 8;
  }
  return { score, all };
}

/**
 * Shared forgiving search — Hindi + English + Hinglish with synonyms,
 * case-insensitive, AND-match first with a relaxed OR-match fallback.
 * Powers both the SearchOverlay (instantSearch) and the search page.
 */
export function searchAll(query: string): SearchEntry[] {
  const q = norm(query);
  if (!q) return [];
  const tokens = queryTokens(q).map(expandToken);
  if (!tokens.length) return [];
  const scored = searchIndex.map((entry, index) => {
    const { score, all } = scoreEntry(entry, q, tokens);
    return { entry, score, all, index };
  });
  const strict = scored.filter((r) => r.all && r.score > 0);
  const pool = strict.length > 0 ? strict : scored.filter((r) => r.score > 0);
  return pool.sort((a, b) => b.score - a.score || a.index - b.index).map((r) => r.entry);
}

/** Tiny instant-search over the shared engine (SearchOverlay). */
export function instantSearch(query: string, limit = 8): SearchEntry[] {
  return searchAll(query).slice(0, limit);
}

/** Levenshtein distance with early bail once it exceeds `max`. */
function editDistanceWithin(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Nearest entries by fuzzy match — empty-state suggestion chips (search.md §4). */
export function suggestSearches(query: string, limit = 3): SearchEntry[] {
  const tokens = queryTokens(query).filter((x) => x.length >= 3);
  const picks: SearchEntry[] = [];
  if (tokens.length) {
    const scored = searchIndex
      .map((entry, index) => {
        const words = norm(`${entry.title.hi} ${entry.title.en} ${entry.keywords.join(' ')}`)
          .split(/[^a-z0-9\u0900-\u097F]+/u)
          .filter(Boolean);
        let s = 0;
        for (const tok of tokens) {
          for (const w of words) {
            if (w === tok) s += 4;
            else if (w.startsWith(tok) || (tok.length >= 4 && w.length >= 3 && tok.startsWith(w))) s += 3;
            else if (tok.length >= 4 && editDistanceWithin(tok, w, 2) <= 2) s += 2;
          }
        }
        return { entry, s, index };
      })
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.index - b.index);
    for (const r of scored) {
      if (picks.length >= limit) break;
      picks.push(r.entry);
    }
  }
  /* popular fallbacks so the empty state always offers a way out */
  for (const id of ['pan-card-guide', 'ssc-cgl-2026', 'photo-compress']) {
    if (picks.length >= limit) break;
    const e = searchIndex.find((x) => x.id === id);
    if (e && !picks.includes(e)) picks.push(e);
  }
  return picks;
}

export interface HighlightPart {
  text: string;
  hit: boolean;
}

/** Split text into matched/unmatched parts for <mark> highlighting (synonym-aware). */
export function highlightText(text: string, query: string): HighlightPart[] {
  if (!text || !query.trim()) return [{ text, hit: false }];
  const needles = new Set<string>();
  for (const tok of queryTokens(query)) {
    for (const v of expandToken(tok)) if (v.length >= 2) needles.add(v);
  }
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const n of needles) {
    let i = lower.indexOf(n);
    while (i !== -1) {
      ranges.push([i, i + n.length]);
      i = lower.indexOf(n, i + n.length);
    }
  }
  if (!ranges.length) return [{ text, hit: false }];
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  const parts: HighlightPart[] = [];
  let pos = 0;
  for (const [start, end] of merged) {
    if (start > pos) parts.push({ text: text.slice(pos, start), hit: false });
    parts.push({ text: text.slice(start, end), hit: true });
    pos = end;
  }
  if (pos < text.length) parts.push({ text: text.slice(pos), hit: false });
  return parts;
}

/* ------------------------------------------------------------------ */
/* Recent searches — localStorage["ss-recent"] (max 8, search.md notes) */
/* ------------------------------------------------------------------ */

const RECENT_KEY = 'ss-recent';
const RECENT_MAX = 8;

export function readRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(list: string[]): string[] {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* private mode */
  }
  return list;
}

/** Prepend a query (dedup, case-insensitive), capped at 8. Returns the new list. */
export function pushRecentSearch(query: string): string[] {
  const q = query.trim();
  if (!q) return readRecentSearches();
  const rest = readRecentSearches().filter((x) => x.toLowerCase() !== q.toLowerCase());
  return writeRecentSearches([q, ...rest].slice(0, RECENT_MAX));
}

export function removeRecentSearch(query: string): string[] {
  return writeRecentSearches(readRecentSearches().filter((x) => x !== query));
}

export function clearRecentSearches(): string[] {
  return writeRecentSearches([]);
}

/* ------------------------------------------------------------------ */
/* Live Updates feed (home page "ताज़ा अपडेट" section)                 */
/* Owner can post daily via Google Sheet "Updates" tab — sheet items  */
/* appear above these built-in items automatically.                   */
/* ------------------------------------------------------------------ */

export type LiveUpdateCategory =
  | 'job'
  | 'exam'
  | 'admit'
  | 'result'
  | 'cbse'
  | 'tech'
  | 'ai'
  | 'news';

export interface LiveUpdate {
  id: string;
  text: Bi;
  category: LiveUpdateCategory;
  href: string;
  /** ISO yyyy-mm-dd */
  date: string;
}

export const liveUpdateCategoryMeta: Record<
  LiveUpdateCategory,
  { label: Bi; chip: string }
> = {
  job: { label: { hi: 'नौकरी', en: 'Job' }, chip: 'bg-terracotta-100 text-terracotta-700' },
  exam: { label: { hi: 'परीक्षा', en: 'Exam' }, chip: 'bg-amber-100 text-amber-600' },
  admit: { label: { hi: 'एडमिट कार्ड', en: 'Admit Card' }, chip: 'bg-cocoa-100 text-cocoa-500' },
  result: { label: { hi: 'रिज़ल्ट', en: 'Result' }, chip: 'bg-leaf-100 text-leaf-600' },
  cbse: { label: { hi: 'CBSE', en: 'CBSE' }, chip: 'bg-amber-100 text-amber-600' },
  tech: { label: { hi: 'टेक्नोलॉजी', en: 'Tech' }, chip: 'bg-leaf-100 text-leaf-600' },
  ai: { label: { hi: 'AI', en: 'AI' }, chip: 'bg-rose-100 text-rose-500' },
  news: { label: { hi: 'ताज़ा खबर', en: 'News' }, chip: 'bg-sand-200 text-ink-600' },
};

export const liveUpdates: LiveUpdate[] = [
  {
    id: 'lu-cbse-compartment',
    text: { hi: 'CBSE 10वीं Compartment Result 2026 जारी — अभी चेक करें', en: 'CBSE Class 10 Compartment Result 2026 declared — check now' },
    category: 'cbse',
    href: '/exams',
    date: '2026-07-21',
  },
  {
    id: 'lu-rrb-alp-admit',
    text: { hi: 'RRB ALP CBT-2 एडमिट कार्ड जारी — Hall Ticket डाउनलोड करें', en: 'RRB ALP CBT-2 admit card out — download hall ticket' },
    category: 'admit',
    href: '/jobs',
    date: '2026-07-21',
  },
  {
    id: 'lu-ssc-cgl-extended',
    text: { hi: 'SSC CGL 2026: आवेदन की आखिरी तारीख बढ़ी — अब 28 जुलाई तक करें apply', en: 'SSC CGL 2026 application deadline extended to 28 July' },
    category: 'job',
    href: '/jobs',
    date: '2026-07-20',
  },
  {
    id: 'lu-ibps-po',
    text: { hi: 'IBPS PO 2026 Notification जारी — 5,208 पदों पर आवेदन शुरू', en: 'IBPS PO 2026 notification out — applications open for 5,208 posts' },
    category: 'job',
    href: '/jobs',
    date: '2026-07-20',
  },
  {
    id: 'lu-upsc-cds',
    text: { hi: 'UPSC CDS II परीक्षा 13 सितंबर को — Admit Card जल्द, तैयारी जारी रखें', en: 'UPSC CDS II exam on 13 September — admit card soon' },
    category: 'exam',
    href: '/exams',
    date: '2026-07-19',
  },
  {
    id: 'lu-cbse-datesheet',
    text: { hi: 'CBSE Board 2027: 10वीं-12वीं Date Sheet जारी — परीक्षा 15 फरवरी से', en: 'CBSE Board 2027 date sheet released — exams from 15 February' },
    category: 'cbse',
    href: '/exams',
    date: '2026-07-18',
  },
  {
    id: 'lu-ai-sakhi',
    text: { hi: 'सरकार का नया AI चैटबॉट "किसान सखी" — फसल सलाह अब WhatsApp पर', en: 'Govt launches "Kisan Sakhi" AI chatbot — crop advice on WhatsApp' },
    category: 'ai',
    href: '/lifehacks',
    date: '2026-07-18',
  },
  {
    id: 'lu-upi-lite',
    text: { hi: 'UPI Lite लिमिट ₹1,000 हुई — बिना PIN छोटे पेमेंट अब और आसान', en: 'UPI Lite limit raised to ₹1,000 — small payments without PIN' },
    category: 'tech',
    href: '/lifehacks',
    date: '2026-07-17',
  },
  {
    id: 'lu-ctet-dec',
    text: { hi: 'CTET दिसंबर 2026 Notification जारी — शिक्षक भर्ती का सुनहरा मौका', en: 'CTET December 2026 notification out — golden chance for teachers' },
    category: 'exam',
    href: '/exams',
    date: '2026-07-17',
  },
  {
    id: 'lu-neet-counselling',
    text: { hi: 'NEET UG 2026 Counselling Round 2 शुरू — Choice filling 24 जुलाई तक', en: 'NEET UG 2026 counselling Round 2 begins — choice filling till 24 July' },
    category: 'result',
    href: '/exams',
    date: '2026-07-16',
  },
];
