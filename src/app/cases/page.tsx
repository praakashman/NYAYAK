"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Scale, Search, Filter, Clock, AlertCircle, CheckCircle2, ChevronRight, 
  MoreHorizontal, FileText, User, Calendar, Gavel, Briefcase, TrendingUp, 
  LayoutGrid, List, Bell, Settings, X, Shield, BookOpen, Layers, 
  ArrowUpRight, Download, MessageSquare, Plus, Flag, Activity, 
  ChevronDown, ChevronUp, SlidersHorizontal, Eye, Paperclip, Share2,
  Printer, Archive, RefreshCw, Zap
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// --- Types & Interfaces ---

type CaseUrgency = 'Critical' | 'High' | 'Medium' | 'Low';
type CaseStatus = 'Pending' | 'Reviewing' | 'Scheduled' | 'Closed' | 'Archived';
type CaseCategory = 'Criminal' | 'Civil' | 'Corporate' | 'Family' | 'Constitutional' | 'Labor' | 'IP' | 'Tax';

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'JPG';
  size: string;
  dateUploaded: string;
  isVerified: boolean;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
  type: 'filing' | 'hearing' | 'order' | 'administrative';
}

interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

interface AIInsight {
  winProbability: number;
  complexityScore: number;
  similarPrecedents: number;
  riskFactors: string[];
  suggestedStrategy: string;
}

interface Case {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: CaseCategory;
  urgency: CaseUrgency;
  status: CaseStatus;
  dateFiled: string;
  nextHearing?: string;
  petitioner: string;
  respondent: string;
  presidingJudge?: string;
  matchScore: number;
  tags: string[];
  documents: Document[];
  timeline: TimelineEvent[];
  comments: Comment[];
  aiAnalysis: AIInsight;
}

// --- Mock Data Generator ---

const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', name: 'Original Petition.pdf', type: 'PDF', size: '2.4 MB', dateUploaded: '2024-02-10', isVerified: true },
  { id: 'd2', name: 'Evidence_Exhibit_A.jpg', type: 'JPG', size: '4.1 MB', dateUploaded: '2024-02-11', isVerified: true },
  { id: 'd3', name: 'Previous_Orders.docx', type: 'DOCX', size: '156 KB', dateUploaded: '2024-02-12', isVerified: false },
  { id: 'd4', name: 'Witness_Statement_01.pdf', type: 'PDF', size: '1.2 MB', dateUploaded: '2024-02-12', isVerified: true },
];

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 't1', date: '2024-02-10', title: 'Case Filed', description: 'Original petition filed via e-filing portal.', actor: 'Petitioner Counsel', type: 'filing' },
  { id: 't2', date: '2024-02-11', title: 'Clerk Verification', description: 'Documents verified for procedural compliance.', actor: 'Court Clerk', type: 'administrative' },
  { id: 't3', date: '2024-02-12', title: 'Case Number Assigned', description: 'Assigned unique ID CASE-2024-001.', actor: 'System', type: 'administrative' },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', author: 'Registrar Office', role: 'Admin', text: 'Petitioner requested urgent interim hearing.', timestamp: '2h ago' },
  { id: 'c2', author: 'Legal Clerk', role: 'Staff', text: 'Document Exhibit B seems to have poor legibility.', timestamp: '1d ago' },
];

const MOCK_CASES: Case[] = [
  {
    id: "CASE-2024-001",
    title: "State vs. Sharma Construction Group",
    description: "Alleged violation of environmental protection standards in the Godawari river basin project. Urgent hearing required due to ongoing construction activities which may cause irreversible damage to the local ecosystem.",
    summary: "The petitioner alleges that Sharma Construction has bypassed Step 3 of the Environmental Impact Assessment (EIA) regarding the Godawari basin. The construction of the retaining wall is reportedly blocking natural migratory paths for aquatic life. The State seeks an immediate injunction.",
    category: "Corporate",
    urgency: "Critical",
    status: "Pending",
    dateFiled: "2024-02-10",
    nextHearing: "2024-02-25",
    petitioner: "Dept. of Environment",
    respondent: "Sharma Construction Group",
    matchScore: 98,
    tags: ["Environmental Law", "Corporate Liability", "Injunction", "Public Interest"],
    documents: MOCK_DOCUMENTS,
    timeline: MOCK_TIMELINE,
    comments: MOCK_COMMENTS,
    aiAnalysis: {
      winProbability: 65,
      complexityScore: 85,
      similarPrecedents: 12,
      riskFactors: ["High Public Scrutiny", "Complex Technical Evidence", "Economic Impact"],
      suggestedStrategy: "Prioritize the injunction hearing to prevent irreversible damage while appointing an independent expert committee."
    }
  },
  {
    id: "CASE-2024-002",
    title: "Gurung vs. Nepal Telecom Authority",
    description: "Dispute regarding unfair billing practices and hidden charges applied to post-paid customers over the last fiscal year.",
    summary: "Class action lawsuit representing 5,000+ subscribers claiming NTA allowed telecom providers to round up call minutes in violation of the 2022 pricing directive.",
    category: "Civil",
    urgency: "Medium",
    status: "Pending",
    dateFiled: "2024-02-08",
    petitioner: "Ram Bahadur Gurung",
    respondent: "Nepal Telecom Authority",
    matchScore: 85,
    tags: ["Consumer Protection", "Telecommunications", "Class Action"],
    documents: MOCK_DOCUMENTS.slice(0, 2),
    timeline: MOCK_TIMELINE,
    comments: [],
    aiAnalysis: {
      winProbability: 40,
      complexityScore: 60,
      similarPrecedents: 4,
      riskFactors: ["Large Class Size", "Regulatory Ambiguity"],
      suggestedStrategy: "Consolidate similar petitions and request a clarification from the regulatory body before proceeding to evidence."
    }
  },
  {
    id: "CASE-2024-003",
    title: "Estate of Late B.K. Pradhan",
    description: "Complex inheritance dispute involving multiple claimants to ancestral property in Thamel. Will validity contested.",
    summary: "Contest over the 2018 Will of B.K. Pradhan. Claimants argue the testator was not of sound mind. Property valuation exceeds 500M NPR.",
    category: "Family",
    urgency: "High",
    status: "Reviewing",
    dateFiled: "2024-01-25",
    petitioner: "Sita Pradhan",
    respondent: "Rajesh Pradhan & Others",
    matchScore: 92,
    tags: ["Property Law", "Succession", "Probate", "Fraud Allegation"],
    documents: [...MOCK_DOCUMENTS, ...MOCK_DOCUMENTS],
    timeline: MOCK_TIMELINE,
    comments: MOCK_COMMENTS,
    aiAnalysis: {
      winProbability: 50,
      complexityScore: 90,
      similarPrecedents: 25,
      riskFactors: ["Hostile Witnesses", "Forensic Document Analysis Required"],
      suggestedStrategy: "Order a forensic analysis of the handwriting on the Will immediately."
    }
  },
  {
    id: "CASE-2024-004",
    title: "Constitutional Writ: Digital Privacy",
    description: "Writ petition challenging the new surveillance guidelines as a violation of the fundamental right to privacy under Article 28.",
    summary: "Petitioners argue that the new 'Safe City' surveillance guidelines allow warrantless data collection, violating Article 28 of the Constitution.",
    category: "Constitutional",
    urgency: "Critical",
    status: "Pending",
    dateFiled: "2024-02-12",
    nextHearing: "2024-02-28",
    petitioner: "Digital Rights Nepal",
    respondent: "Government of Nepal",
    matchScore: 88,
    tags: ["Fundamental Rights", "Privacy", "Digital Law", "Supreme Court"],
    documents: MOCK_DOCUMENTS.slice(0, 1),
    timeline: MOCK_TIMELINE,
    comments: [],
    aiAnalysis: {
      winProbability: 30,
      complexityScore: 95,
      similarPrecedents: 3,
      riskFactors: ["National Security Defense", "Lack of Specific Precedent"],
      suggestedStrategy: "Refer to the Constitutional Bench for interpretation of Article 28 in the digital context."
    }
  },
  {
    id: "CASE-2024-005",
    title: "Nepal Rastra Bank vs. Himalayan Finance",
    description: "Regulatory enforcement action regarding non-compliance with capital adequacy ratios and liquidity requirements.",
    summary: "Central bank seeks to liquidate Himalayan Finance for failing to meet Tier 1 capital requirements for 3 consecutive quarters.",
    category: "Corporate",
    urgency: "High",
    status: "Scheduled",
    dateFiled: "2024-02-01",
    petitioner: "Nepal Rastra Bank",
    respondent: "Himalayan Finance Ltd.",
    matchScore: 75,
    tags: ["Banking Law", "Regulatory Compliance", "Finance", "Insolvency"],
    documents: MOCK_DOCUMENTS,
    timeline: MOCK_TIMELINE,
    comments: MOCK_COMMENTS,
    aiAnalysis: {
      winProbability: 90,
      complexityScore: 70,
      similarPrecedents: 8,
      riskFactors: ["Systemic Banking Risk", "Employee Union Protests"],
      suggestedStrategy: "Appoint a liquidator while ensuring depositor protection schemes are activated."
    }
  },
  {
    id: "CASE-2024-006",
    title: "Karki vs. Karki (Divorce & Custody)",
    description: "Contested divorce proceedings involving custody of two minor children and alimony settlement.",
    summary: "Wife alleges cruelty and seeks full custody. Husband contests alimony amount citing business losses.",
    category: "Family",
    urgency: "Medium",
    status: "Pending",
    dateFiled: "2024-02-05",
    petitioner: "Anjali Karki",
    respondent: "Bikash Karki",
    matchScore: 65,
    tags: ["Family Law", "Child Custody", "Divorce", "Domestic Violence"],
    documents: MOCK_DOCUMENTS.slice(0, 2),
    timeline: MOCK_TIMELINE,
    comments: [],
    aiAnalysis: {
      winProbability: 55,
      complexityScore: 45,
      similarPrecedents: 150,
      riskFactors: ["Child Psychological Welfare"],
      suggestedStrategy: "Mandate mediation sessions before proceeding to trial."
    }
  },
  {
    id: "CASE-2024-007",
    title: "State vs. Unknown (Cyber Heist)",
    description: "Investigation into the recent hacking of the swift banking network. Prosecution seeking warrant for digital evidence seizure.",
    summary: "Cyber Bureau seeks warrant to seize servers of an ISP allegedly used as a proxy for the SWIFT hack.",
    category: "Criminal",
    urgency: "High",
    status: "Pending",
    dateFiled: "2024-02-11",
    petitioner: "Cyber Bureau",
    respondent: "Unknown Perpetrators",
    matchScore: 70,
    tags: ["Cyber Crime", "Forensics", "Banking", "Warrant"],
    documents: MOCK_DOCUMENTS,
    timeline: MOCK_TIMELINE,
    comments: [],
    aiAnalysis: {
      winProbability: 80,
      complexityScore: 80,
      similarPrecedents: 5,
      riskFactors: ["Data Privacy of Non-suspects"],
      suggestedStrategy: "Grant warrant with specific limitations on data retention for non-relevant traffic."
    }
  },
  {
    id: "CASE-2024-008",
    title: "Land Acquisition Dispute: Outer Ring Road",
    description: "Petition by local landowners against the compensation rates offered for land acquisition for the Outer Ring Road project.",
    summary: "Landowners claim the government valuation is 40% below market rate violates Land Acquisition Act 2034.",
    category: "Civil",
    urgency: "Medium",
    status: "Reviewing",
    dateFiled: "2024-01-30",
    petitioner: "Tokha Landowners Committee",
    respondent: "Roads Department",
    matchScore: 82,
    tags: ["Land Law", "Eminent Domain", "Compensation", "Public Infrastructure"],
    documents: MOCK_DOCUMENTS,
    timeline: MOCK_TIMELINE,
    comments: MOCK_COMMENTS,
    aiAnalysis: {
      winProbability: 45,
      complexityScore: 50,
      similarPrecedents: 20,
      riskFactors: ["Project Delay", "Political pressure"],
      suggestedStrategy: "Establish an independent compensation fixation committee to review rates."
    }
  }
];

// --- Utility Components ---

const Badge = ({ children, className, variant = 'primary' }: { children: React.ReactNode, className?: string, variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' }) => {
  const variants = {
    primary: "bg-nyayak-mute text-[#111111] border-gray-200",
    secondary: "bg-gray-100 text-gray-700 border-gray-200",
    outline: "bg-transparent border-gray-300 text-gray-600",
    danger: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const UrgencyIndicator = ({ level }: { level: CaseUrgency }) => {
  const colors = {
    Critical: "text-red-600 bg-red-50 border-red-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Low: "text-green-600 bg-green-50 border-green-200",
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${colors[level]}`}>
      <Activity size={14} />
      <span className="text-xs font-bold uppercase">{level}</span>
    </div>
  );
};

const CategoryIcon = ({ category }: { category: CaseCategory }) => {
  const icons = {
    Criminal: Shield,
    Civil: User,
    Corporate: Briefcase,
    Family: User,
    Constitutional: BookOpen,
    Labor: Briefcase,
    IP: Zap,
    Tax: CalculatorIcon,
  };
  // Fallback icon
  const Icon = icons[category] || FileText; 

  return (
    <div className="w-8 h-8 rounded-full bg-nyayak-mute flex items-center justify-center text-gray-500">
      <Icon size={14} />
    </div>
  );
};

// Dummy component since we don't have lucide-react 'Calculator' in this version maybe
const CalculatorIcon = ({size}: {size: number}) => <span style={{fontSize: size}}>🧮</span>;


// --- Sub-Components ---

const StatCard = ({ title, value, subtext, icon: Icon, trend }: { title: string, value: string, subtext?: string, icon: any, trend?: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-[#fbfbfb] p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#fbfbfb] rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-[#111111] uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-[#111111] mt-2">{value}</h3>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
      <div className="p-3 bg-[#fbfbfb] rounded-xl shadow-sm border border-nyayak-snow text-gray-500">
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1 text-xs font-medium">
        <span className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowUpRight size={14} className="rotate-90" />} 
          12%
        </span>
        <span className="text-gray-500">vs last month</span>
      </div>
    )}
  </div>
);

const FilterSection = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => (
  <div className="border-b border-gray-200 last:border-0">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#111111] hover:text-black"
    >
      {title}
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="pb-4 animate-in slide-in-from-top-2 fade-in duration-200">{children}</div>}
  </div>
);

// --- Main Page Component ---

export default function PendingCasesPage() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'List' | 'Grid' | 'Kanban'>('List');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as CaseCategory[],
    status: [] as CaseStatus[],
    urgency: [] as CaseUrgency[],
    minMatch: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  // Tabs for Detail View
  const [detailTab, setDetailTab] = useState<'Overview' | 'Documents' | 'AI Analysis' | 'Timeline'>('Overview');

  const filteredCases = useMemo(() => {
    return MOCK_CASES.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(c.category);
      const matchStatus = activeFilters.status.length === 0 || activeFilters.status.includes(c.status);
      const matchUrgency = activeFilters.urgency.length === 0 || activeFilters.urgency.includes(c.urgency);
      const matchScore = c.matchScore >= activeFilters.minMatch;
      
      return matchSearch && matchCategory && matchStatus && matchUrgency && matchScore;
    });
  }, [searchQuery, activeFilters]);

  const toggleFilter = (type: keyof typeof activeFilters, value: any) => {
    setActiveFilters(prev => {
      const current = prev[type] as any[];
      const exists = current.includes(value);
      return {
        ...prev,
        [type]: exists ? current.filter(item => item !== value) : [...current, value]
      };
    });
  };

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-10 relative overflow-hidden flex flex-col items-center">
      {/* Background Pattern matched to Courts page */}
      

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 border border-gray-200 min-h-[calc(100vh-14rem)] rounded-3xl bg-[#fbfbfb]/50 backdrop-blur-[2px]">
        
        <div className="py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Judicial Docket</h1>
            <p className="text-[#111111] mt-1">Manage pending assignments and review case details.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#fbfbfb]/80 backdrop-blur-md rounded-xl p-1 border border-gray-200 shadow-sm flex">
               {(['List', 'Grid', 'Kanban'] as const).map((mode) => (
                 <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                       viewMode === mode 
                       ? 'bg-[#111111] text-white shadow-md' 
                       : 'text-[#111111] hover:bg-nyayak-mute'
                    }`}
                 >
                    {mode === 'List' && <List size={16} className="inline mr-2" />}
                    {mode === 'Grid' && <LayoutGrid size={16} className="inline mr-2" />}
                    {mode === 'Kanban' && <Layers size={16} className="inline mr-2" />}
                    {mode}
                 </button>
               ))}
            </div>
            <button className="p-3 bg-[#fbfbfb]/80 backdrop-blur-md rounded-xl border border-gray-200 text-[#111111] hover:bg-[#fbfbfb] shadow-sm transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <StatCard 
              title="Pending Action" 
              value={`${MOCK_CASES.filter(c => c.status === 'Pending').length}`} 
              subtext="Cases requiring immediate review"
              icon={Clock}
              trend="up"
           />
           <StatCard 
              title="High Priority" 
              value={`${MOCK_CASES.filter(c => c.urgency === 'Critical' || c.urgency === 'High').length}`} 
              subtext="Critical urgency level"
              icon={AlertCircle}
              trend="up"
           />
           <StatCard 
              title="Avg. Match Score" 
              value="82%" 
              subtext="Alignment with your history"
              icon={TrendingUp}
              trend="neutral"
           />
           <StatCard 
              title="Total Assigned" 
              value="124" 
              subtext="Cases in your docket"
              icon={Briefcase}
           />
        </div>

        {/* Main Workspace: Filters + Case List */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-150">
           
           {/* Collapsible Filter Sidebar */}
           <div className={`shrink-0 bg-[#fbfbfb] border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-fit ${showFilters ? 'w-full lg:w-80 opacity-100' : 'w-0 opacity-0 border-0'}`}>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#fbfbfb]/50">
                 <h3 className="font-bold text-[#111111] flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Filters
                 </h3>
                 <button onClick={() => setShowFilters(false)} className="text-[#111111] hover:text-[#111111] lg:hidden">
                    <X size={18} />
                 </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-2">
                 {/* Filter Sections */}
                 <FilterSection 
                    title="Status" 
                    isOpen={true} 
                    onToggle={() => {}}
                 >
                    <div className="space-y-2 pt-2">
                       {['Pending', 'Reviewing', 'Scheduled', 'Closed'].map((s) => (
                          <label key={s} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border border-nyayak-slate flex items-center justify-center transition-colors ${activeFilters.status.includes(s as CaseStatus) ? 'bg-black border-nyayak-slate' : 'group-hover:border-nyayak-slate'}`}>
                                {activeFilters.status.includes(s as CaseStatus) && <CheckCircle2 size={12} className="text-white" />}
                             </div>
                             <input 
                                type="checkbox" 
                                className="hidden"
                                onChange={() => toggleFilter('status', s)}
                             />
                             <span className="text-sm text-gray-500">{s}</span>
                          </label>
                       ))}
                    </div>
                 </FilterSection>

                 <FilterSection 
                    title="Urgency" 
                    isOpen={true} 
                    onToggle={() => {}}
                 >
                    <div className="space-y-2 pt-2">
                       {['Critical', 'High', 'Medium', 'Low'].map((s) => (
                          <label key={s} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border border-nyayak-slate flex items-center justify-center transition-colors ${activeFilters.urgency.includes(s as CaseUrgency) ? 'bg-black border-nyayak-slate' : 'group-hover:border-nyayak-slate'}`}>
                                {activeFilters.urgency.includes(s as CaseUrgency) && <CheckCircle2 size={12} className="text-white" />}
                             </div>
                             <input 
                                type="checkbox" 
                                className="hidden"
                                onChange={() => toggleFilter('urgency', s)}
                             />
                             <UrgencyIndicator level={s as CaseUrgency} />
                          </label>
                       ))}
                    </div>
                 </FilterSection>

                 <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-semibold text-[#111111] mb-4 block">Minimum Match Score</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={activeFilters.minMatch} 
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, minMatch: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-nyayak-mute rounded-lg appearance-none cursor-pointer accent-nyayak-slate" 
                    />
                    <div className="flex justify-between text-xs text-[#111111] mt-2 font-mono">
                       <span>0%</span>
                       <span>{activeFilters.minMatch}%</span>
                       <span>100%</span>
                    </div>
                 </div>
              </div>
              <div className="p-4 border-t border-gray-200 bg-[#fbfbfb]">
                 <button 
                    onClick={() => setActiveFilters({ categories: [], status: [], urgency: [], minMatch: 0 })}
                    className="w-full py-2 flex items-center justify-center gap-2 text-[#111111] hover:text-[#111111] transition-colors text-sm font-medium"
                 >
                    <RefreshCw size={14} /> Reset Filters
                 </button>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div className="bg-[#fbfbfb] border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                 <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                    <button 
                       onClick={() => setShowFilters(!showFilters)}
                       className={`p-2 rounded-lg transition-colors border ${showFilters ? 'bg-nyayak-mute border-nyayak-slate text-[#111111]' : 'bg-[#fbfbfb] border-gray-200 text-[#111111] hover:bg-[#fbfbfb]'}`}
                    >
                       <Filter size={18} />
                    </button>
                    <div className="relative flex-1 max-w-lg group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition-colors" size={18} />
                       <input 
                          type="text" 
                          placeholder="Search cases by ID, party or keywords..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-[#fbfbfb]/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-nyayak-slate/20 focus:border-nyayak-slate outline-none transition-all"
                       />
                    </div>
                 </div>
                 <div className="text-sm text-[#111111] font-medium hidden md:block">
                    Showing <span className="text-[#111111] font-bold">{filteredCases.length}</span> cases
                 </div>
              </div>

              {/* Views */}
              <div className="flex-1">
                 
                 {filteredCases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                       <div className="w-24 h-24 bg-[#fbfbfb] rounded-full flex items-center justify-center mb-6">
                          <Search size={48} className="text-nyayak-mute" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-500">No cases found</h3>
                       <p className="text-[#111111] max-w-md mt-2">Try adjusting your filters or search query to find what you're looking for.</p>
                       <button onClick={() => {setSearchQuery(""); setActiveFilters({ categories: [], status: [], urgency: [], minMatch: 0 })}} className="mt-6 text-black font-medium hover:underline">Clear all filters</button>
                    </div>
                 ) : (
                    <>
                       {/* LIST VIEW */}
                       {viewMode === 'List' && (
                          <div className="space-y-3">
                             {filteredCases.map((c) => (
                                <div 
                                   key={c.id} 
                                   onClick={() => setSelectedCase(c)}
                                   className="group bg-[#fbfbfb] rounded-xl border border-gray-200 hover:border-nyayak-slate/30 p-4 flex items-center gap-6 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                >
                                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                      c.urgency === 'Critical' ? 'bg-red-500' : c.urgency === 'High' ? 'bg-orange-500' : 'bg-green-500' // Simple urgency color
                                   }`}></div>
                                   
                                   <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                         <Badge variant="outline" className="font-mono text-[10px]">{c.id}</Badge>
                                         <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} /> filed {c.dateFiled}</span>
                                      </div>
                                      <h3 className="text-lg font-bold text-[#111111] truncate group-hover:text-black transition-colors">{c.title}</h3>
                                      <div className="flex items-center gap-2 text-sm text-[#111111] mt-1 truncate">
                                         <span className="font-medium">{c.petitioner}</span>
                                         <span className="text-nyayak-mute text-xs">vs</span>
                                         <span className="font-medium">{c.respondent}</span>
                                      </div>
                                   </div>

                                   <div className="hidden md:flex items-center gap-8">
                                      <div className="flex flex-col items-end w-24">
                                         <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Match</span>
                                         <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 bg-nyayak-mute rounded-full overflow-hidden">
                                               <div className={`h-full rounded-full ${c.matchScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${c.matchScore}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{c.matchScore}%</span>
                                         </div>
                                      </div>
                                      <CategoryIcon category={c.category} />
                                      <UrgencyIndicator level={c.urgency} />
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}

                       {/* GRID VIEW */}
                       {viewMode === 'Grid' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                             {filteredCases.map((c) => (
                                <div 
                                   key={c.id}
                                   onClick={() => setSelectedCase(c)}
                                   className="bg-[#fbfbfb] rounded-2xl border border-gray-200 p-6 flex flex-col h-80 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative"
                                >
                                   <div className="flex justify-between items-start mb-4">
                                      <UrgencyIndicator level={c.urgency} />
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${c.matchScore > 80 ? 'border-green-200 bg-green-50 text-green-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'}`}>
                                         {c.matchScore}
                                      </div>
                                   </div>
                                   
                                   <div className="mb-4">
                                      <span className="text-xs font-mono text-gray-500 block mb-1">{c.id}</span>
                                      <h3 className="text-lg font-bold text-[#111111] leading-snug line-clamp-2 group-hover:text-black transition-colors">{c.title}</h3>
                                   </div>

                                   <p className="text-sm text-[#111111] line-clamp-3 mb-4 grow">{c.description}</p>
                                   
                                   <div className="pt-4 border-t border-nyayak-snow flex items-center justify-between mt-auto">
                                      <div className="flex items-center gap-2">
                                         <CategoryIcon category={c.category} />
                                         <span className="text-xs font-medium text-gray-500">{c.category}</span>
                                      </div>
                                      <span className="text-xs text-gray-500 bg-[#fbfbfb] px-2 py-1 rounded">{c.documents.length} Docs</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}

                       {/* KANBAN VIEW */}
                       {viewMode === 'Kanban' && (
                          <div className="flex gap-6 h-full overflow-x-auto pb-4">
                             {['Pending', 'Reviewing', 'Scheduled', 'Closed'].map((status) => (
                                <div key={status} className="w-80 shrink-0 bg-[#fbfbfb]/50 rounded-xl p-4 border border-gray-200 flex flex-col max-h-full">
                                   <div className="flex items-center justify-between mb-4 px-1">
                                      <h3 className="font-bold text-[#111111] flex items-center gap-2">
                                         <span className={`w-2 h-2 rounded-full ${status === 'Pending' ? 'bg-blue-500' : status === 'Critical' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                                         {status}
                                      </h3>
                                      <span className="bg-nyayak-mute text-[#111111] px-2 py-0.5 rounded-md text-xs font-bold">
                                         {filteredCases.filter(c => c.status === status).length}
                                      </span>
                                   </div>
                                   <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                                      {filteredCases.filter(c => c.status === status).map(c => (
                                         <div 
                                            key={c.id}
                                            onClick={() => setSelectedCase(c)}
                                            className="bg-[#fbfbfb] p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                                         >
                                            <div className="flex items-center justify-between mb-2">
                                               <span className="text-[10px] font-mono text-gray-500">{c.id}</span>
                                               <UrgencyIndicator level={c.urgency} />
                                            </div>
                                            <h4 className="font-bold text-sm text-[#111111] line-clamp-2 mb-2">{c.title}</h4>
                                            <div className="flex flex-wrap gap-1">
                                               {c.tags.slice(0, 2).map(t => (
                                                  <span key={t} className="text-[10px] bg-[#fbfbfb] text-[#111111] border border-gray-200 px-1.5 py-0.5 rounded">
                                                     {t}
                                                  </span>
                                               ))}
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </>
                 )}
              </div>
           </div>
        </div>
        </div>
      </div>

      {/* --- Detailed Case Overlay --- */}
      {selectedCase && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div 
               className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" 
               onClick={() => setSelectedCase(null)}
            ></div>
            <div className="relative w-full max-w-2xl bg-[#fbfbfb] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
               
               {/* Overlay Header */}
               <div className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-[#fbfbfb]/50">
                  <div>
                     <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs bg-[#fbfbfb] text-gray-500">{selectedCase.id}</Badge>
                        <UrgencyIndicator level={selectedCase.urgency} />
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-gray-500 hover:text-[#111111] transition-colors">
                        <Share2 size={18} />
                     </button>
                     <button className="p-2 text-gray-500 hover:text-[#111111] transition-colors">
                        <Printer size={18} />
                     </button>
                     <div className="h-6 w-px bg-nyayak-mute mx-2"></div>
                     <button onClick={() => setSelectedCase(null)} className="p-2 text-[#111111] hover:bg-nyayak-mute rounded-full transition-colors">
                        <X size={24} />
                     </button>
                  </div>
               </div>

               {/* Overlay Content */}
               <div className="flex-1 overflow-y-auto">
                  {/* Case Header Info */}
                  <div className="p-8 pb-0">
                     <h2 className="text-2xl font-bold text-[#111111] leading-tight mb-4">{selectedCase.title}</h2>
                     <div className="flex flex-col sm:flex-row gap-4 text-sm text-[#111111] bg-[#fbfbfb] p-4 rounded-xl border border-gray-200">
                        <div className="flex-1">
                           <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Petitioner</span>
                           <span className="font-semibold">{selectedCase.petitioner}</span>
                        </div>
                        <div className="w-px bg-nyayak-mute hidden sm:block"></div>
                        <div className="flex-1">
                           <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Respondent</span>
                           <span className="font-semibold">{selectedCase.respondent}</span>
                        </div>
                        <div className="w-px bg-nyayak-mute hidden sm:block"></div>
                        <div className="flex-1">
                           <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Date Filed</span>
                           <span className="font-semibold">{selectedCase.dateFiled}</span>
                        </div>
                     </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="px-8 mt-8 border-b border-gray-200 flex gap-6 sticky top-0 bg-[#fbfbfb]/95 backdrop-blur z-10">
                     {['Overview', 'Documents', 'AI Analysis', 'Timeline'].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setDetailTab(tab as any)}
                           className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                              detailTab === tab 
                              ? 'border-nyayak-slate text-black' 
                              : 'border-transparent text-[#111111] hover:text-[#111111]'
                           }`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>

                  <div className="p-8">
                     
                     {/* OVERVIEW TAB */}
                     {detailTab === 'Overview' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-linear-to-br from-[#1A1A1A] to-[#3a2510] rounded-2xl p-6 text-white col-span-2 sm:col-span-1">
                                 <h4 className="text-white/70 text-sm font-medium mb-2">Match Score</h4>
                                 <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold">{selectedCase.matchScore}%</span>
                                    <span className="text-sm text-white/50 mb-1.5">Expertise Alignment</span>
                                 </div>
                                 <div className="mt-4 h-1.5 bg-[#fbfbfb]/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${selectedCase.matchScore}%` }}></div>
                                 </div>
                              </div>
                              <div className="border border-gray-200 rounded-2xl p-6 col-span-2 sm:col-span-1">
                                 <h4 className="text-gray-500 text-sm font-medium mb-2">Category</h4>
                                 <div className="flex items-center gap-3">
                                    <CategoryIcon category={selectedCase.category} />
                                    <span className="text-xl font-bold text-gray-500">{selectedCase.category} Law</span>
                                 </div>
                                 <div className="flex flex-wrap gap-2 mt-4">
                                    {selectedCase.tags.map(tag => (
                                       <span key={tag} className="text-xs bg-[#fbfbfb] text-[#111111] px-2 py-1 rounded-md border border-gray-200">
                                          #{tag}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                                 <FileText className="text-black" size={20} /> Case Summary
                              </h3>
                              <div className="prose prose-sm prose-stone max-w-none text-[#111111] bg-[#fbfbfb]/50 p-6 rounded-2xl border border-gray-200">
                                 <p className="font-medium mb-2">Description:</p>
                                 <p className="mb-4">{selectedCase.description}</p>
                                 <p className="font-medium mb-2">Legal Summary:</p>
                                 <p>{selectedCase.summary}</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* DOCUMENTS TAB */}
                     {detailTab === 'Documents' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                           <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-lg text-gray-500">Case Files ({selectedCase.documents.length})</h3>
                              <button className="text-sm text-black font-medium flex items-center gap-1 hover:underline">
                                 <Download size={14} /> Download All
                              </button>
                           </div>
                           <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-primary-100">
                              {selectedCase.documents.map((doc) => (
                                 <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[#fbfbfb] transition-colors group">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-[#fbfbfb] border border-gray-200 rounded-lg flex items-center justify-center text-[#111111] shadow-sm">
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <p className="font-medium text-[#111111] group-hover:text-black transition-colors">{doc.name}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">{doc.type} • {doc.size} • {doc.dateUploaded}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       {doc.isVerified && (
                                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                             <CheckCircle2 size={10} /> Verified
                                          </span>
                                       )}
                                       <button className="p-2 text-gray-500 hover:bg-[#fbfbfb] hover:shadow-sm rounded-lg transition-all">
                                          <Eye size={18} />
                                       </button>
                                       <button className="p-2 text-gray-500 hover:bg-[#fbfbfb] hover:shadow-sm rounded-lg transition-all">
                                          <Download size={18} />
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <button className="w-full py-3 bg-[#fbfbfb] border border-dashed border-nyayak-slate text-[#111111] rounded-xl hover:bg-[#fbfbfb] hover:border-nyayak-slate transition-all flex items-center justify-center gap-2">
                              <Plus size={16} /> Request Additional Briefs
                           </button>
                        </div>
                     )}

                     {/* AI ANALYSIS TAB */}
                     {detailTab === 'AI Analysis' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                           <div className="bg-linear-to-r from-primary-900 to-nyayak-slate p-6 rounded-2xl text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-32 bg-[#fbfbfb]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                              <div className="relative z-10">
                                 <div className="flex items-center gap-2 mb-2 text-nyayak-mute">
                                    <StarsIcon size={16} /> AI Pre-Analysis
                                 </div>
                                 <h3 className="text-2xl font-bold mb-4">Strategic Insight</h3>
                                 <p className="text-gray-500 leading-relaxed max-w-lg mb-6">
                                    {selectedCase.aiAnalysis.suggestedStrategy}
                                 </p>
                                 <div className="flex flex-wrap gap-4">
                                    <div className="bg-[#fbfbfb]/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                                       <span className="text-xs text-nyayak-mute block mb-1">Win Probability</span>
                                       <span className="text-xl font-bold">{selectedCase.aiAnalysis.winProbability}%</span>
                                    </div>
                                    <div className="bg-[#fbfbfb]/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                                       <span className="text-xs text-nyayak-mute block mb-1">Similar Precedents</span>
                                       <span className="text-xl font-bold">{selectedCase.aiAnalysis.similarPrecedents}</span>
                                    </div>
                                    <div className="bg-[#fbfbfb]/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                                       <span className="text-xs text-nyayak-mute block mb-1">Complexity</span>
                                       <span className="text-xl font-bold">{selectedCase.aiAnalysis.complexityScore}/100</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h4 className="font-bold text-[#111111] mb-4 flex items-center gap-2">
                                 <AlertCircle size={18} className="text-red-500" /> Identified Risk Factors
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                 {selectedCase.aiAnalysis.riskFactors.map((risk, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                       <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                       <p className="text-sm text-red-900">{risk}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                              <div className="flex gap-3">
                                 <div className="p-2 bg-blue-100 text-blue-700 rounded-lg h-fit">
                                    <InfoIcon size={18} />
                                 </div>
                                 <div>
                                    <h5 className="font-bold text-blue-900 text-sm mb-1">Model Confidence: High</h5>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                       This analysis is generated based on {selectedCase.aiAnalysis.similarPrecedents} similar cases in the Constitutional Bench database from 2018-2023.
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* TIMELINE TAB */}
                     {detailTab === 'Timeline' && (
                        <div className="mt-4 animate-in fade-in duration-300">
                           <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-nyayak-mute">
                              {selectedCase.timeline.map((event, i) => (
                                 <div key={event.id} className="relative">
                                    <div className="absolute -left-5.25 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 bg-black"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                       <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">{event.date}</span>
                                       <Badge variant={event.type === 'filing' ? 'secondary' : 'outline'} className="w-fit scale-90 origin-left">{event.type}</Badge>
                                    </div>
                                    <h4 className="font-bold text-gray-500">{event.title}</h4>
                                    <p className="text-sm text-[#111111] mt-1 mb-2">{event.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#fbfbfb] w-fit px-2 py-1 rounded">
                                       <User size={12} /> {event.actor}
                                    </div>
                                 </div>
                              ))}
                              
                              {/* Future Prediction */}
                              <div className="relative opacity-60">
                                 <div className="absolute -left-5.25 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 bg-nyayak-slate"></div>
                                 <span className="text-xs font-bold text-[#111111] uppercase tracking-wider block mb-1">Projection</span>
                                 <h4 className="font-bold text-gray-500">Estimated Hearing Date</h4>
                                 <p className="text-sm text-[#111111] mt-1">~ {selectedCase.nextHearing || 'TBD'}</p>
                              </div>
                           </div>
                        </div>
                     )}

                  </div>
               </div>

               {/* Action Footer */}
               <div className="p-6 border-t border-gray-200 bg-[#fbfbfb] sticky bottom-0 flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <button className="flex-1 py-3.5 bg-black text-white rounded-xl font-bold shadow-lg shadow-nyayak-slate/20 hover:bg-black transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                     <Gavel size={20} /> Accept Assignment
                  </button>
                  <button className="px-6 py-3.5 bg-[#fbfbfb] text-[#111111] rounded-xl font-semibold border border-gray-200 hover:bg-nyayak-mute transition-colors flex items-center gap-2">
                     <Share2 size={18} /> Delegate
                  </button>
               </div>
            </div>
         </div>
      )}
    </main>
  );
}

// Additional Icon Components for UI polish
const StarsIcon = ({size, className}: {size: number, className?: string}) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

const InfoIcon = ({size, className}: {size: number, className?: string}) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
