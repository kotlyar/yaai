export interface Campaign {
  id: string;
  yandexId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  targetingSettings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  accountId: string;
  account?: Account;
  adGroups?: AdGroup[];
  keywords?: Keyword[];
  stats?: CampaignStats[];
}

export interface CampaignStats {
  id: string;
  date: Date;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
  
  // Calculated metrics
  ctr?: number;        // Click-through rate
  cpc?: number;        // Cost per click
  cpm?: number;        // Cost per mille
  roi?: number;        // Return on investment
  roas?: number;       // Return on ad spend
  conversionRate?: number;
  
  campaignId: string;
  campaign?: Campaign;
}

export interface AdGroup {
  id: string;
  yandexId: string;
  name: string;
  type: AdGroupType;
  status: AdGroupStatus;
  bids?: Record<string, any>;
  
  campaignId: string;
  campaign?: Campaign;
  ads?: Ad[];
  keywords?: Keyword[];
  stats?: AdGroupStats[];
}

export interface Keyword {
  id: string;
  yandexId: string;
  text: string;
  bid?: number;
  status: KeywordStatus;
  matchType: MatchType;
  
  campaignId: string;
  campaign?: Campaign;
  adGroupId?: string;
  adGroup?: AdGroup;
  stats?: KeywordStats[];
}

export interface KeywordStats {
  id: string;
  date: Date;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
  position?: number;
  qualityScore?: number;
  
  // Calculated metrics
  ctr?: number;
  cpc?: number;
  
  keywordId: string;
  keyword?: Keyword;
}

export interface Account {
  id: string;
  name: string;
  yandexLogin: string;
  accessToken: string;
  isActive: boolean;
  
  userId: string;
  user?: User;
  campaigns?: Campaign[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  
  accounts?: Account[];
  projects?: Project[];
  reports?: Report[];
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardOverview {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  
  avgCtr: number;
  avgCpc: number;
  avgCpm: number;
  roi: number;
  roas: number;
  
  // Changes compared to previous period
  costChange: number;
  impressionsChange: number;
  clicksChange: number;
  conversionsChange: number;
  revenueChange: number;
  ctrChange: number;
  cpcChange: number;
  roiChange: number;
  
  // Top performing data
  topKeywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    cost: number;
    ctr: number;
    cpc: number;
  }>;
  
  topCampaigns: Array<{
    id: string;
    name: string;
    cost: number;
    revenue: number;
    roi: number;
  }>;
  
  geoData: Array<{
    region: string;
    impressions: number;
    clicks: number;
    cost: number;
    ctr: number;
  }>;
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  impact: ImpactLevel;
  status: InsightStatus;
  createdAt: Date;
  
  // Recommendations
  recommendations?: Array<{
    action: string;
    description: string;
    expectedImpact: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

// Enums
export enum CampaignType {
  SEARCH = 'SEARCH',
  DISPLAY = 'DISPLAY',
  MOBILE = 'MOBILE',
  SMART = 'SMART'
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT'
}

export enum AdGroupType {
  SEARCH = 'SEARCH',
  DISPLAY = 'DISPLAY',
  MOBILE_APP = 'MOBILE_APP'
}

export enum AdGroupStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

export enum KeywordStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

export enum MatchType {
  EXACT = 'EXACT',
  PHRASE = 'PHRASE',
  BROAD = 'BROAD'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum InsightType {
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT',
  BUDGET_RECOMMENDATION = 'BUDGET_RECOMMENDATION',
  BID_OPTIMIZATION = 'BID_OPTIMIZATION',
  KEYWORD_OPPORTUNITY = 'KEYWORD_OPPORTUNITY',
  NEGATIVE_KEYWORD = 'NEGATIVE_KEYWORD',
  AD_COPY_SUGGESTION = 'AD_COPY_SUGGESTION',
  GEOGRAPHIC_INSIGHT = 'GEOGRAPHIC_INSIGHT',
  TIME_OPTIMIZATION = 'TIME_OPTIMIZATION'
}

export enum ImpactLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum InsightStatus {
  NEW = 'NEW',
  VIEWED = 'VIEWED',
  APPLIED = 'APPLIED',
  DISMISSED = 'DISMISSED'
}