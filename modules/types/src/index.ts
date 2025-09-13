// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  yandexClientId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  userId: string;
  yandexCampaignId: number;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  budget?: number;
  dailyBudget?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

export enum CampaignType {
  TEXT = 'TEXT',
  MOBILE_APP = 'MOBILE_APP',
  DYNAMIC = 'DYNAMIC',
  SMART_BANNER = 'SMART_BANNER'
}

// Ad Group Types
export interface AdGroup {
  id: string;
  campaignId: string;
  yandexAdGroupId: number;
  name: string;
  status: AdGroupStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum AdGroupStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

// Keyword Types
export interface Keyword {
  id: string;
  adGroupId: string;
  yandexKeywordId: number;
  keyword: string;
  bid: number;
  status: KeywordStatus;
  matchType: MatchType;
  createdAt: Date;
  updatedAt: Date;
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

// Analytics Types
export interface CampaignMetrics {
  campaignId: string;
  date: Date;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface KeywordMetrics {
  keywordId: string;
  date: Date;
  impressions: number;
  clicks: number;
  cost: number;
  position: number;
  qualityScore: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Yandex Direct API Types
export interface YandexDirectCampaign {
  Id: number;
  Name: string;
  Status: string;
  StatusPayment: string;
  StatusClarification?: string;
  SourceId?: number;
  Statistics?: YandexDirectStatistics;
}

export interface YandexDirectStatistics {
  Impressions: number;
  Clicks: number;
  Cost: number;
  Ctr: number;
  AvgCpc: number;
}

// Job Types
export interface JobData {
  type: JobType;
  payload: any;
  userId?: string;
  priority?: number;
}

export enum JobType {
  SYNC_CAMPAIGNS = 'SYNC_CAMPAIGNS',
  OPTIMIZE_BIDS = 'OPTIMIZE_BIDS',
  GENERATE_REPORT = 'GENERATE_REPORT',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION'
}

// Configuration Types
export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  ssl?: boolean;
}

export interface RedisConfig {
  url: string;
  password?: string;
  db?: number;
}

export interface YandexApiConfig {
  directApiUrl: string;
  metrikaApiUrl: string;
  clientId: string;
  clientSecret: string;
}