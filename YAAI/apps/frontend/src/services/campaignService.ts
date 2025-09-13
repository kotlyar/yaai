import { api } from '@/lib/api';
import { Campaign, CampaignStats, DateRange } from '@/types/campaign';

export interface CampaignPerformanceData {
  chartData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    cost: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roi: number;
  }>;
  campaigns: Campaign[];
  totalStats: CampaignStats;
}

export const campaignService = {
  /**
   * Get all campaigns
   */
  async getCampaigns(): Promise<Campaign[]> {
    const response = await api.get('/campaigns');
    return response.data;
  },

  /**
   * Get campaign by ID
   */
  async getCampaignById(id: string): Promise<Campaign> {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  /**
   * Sync campaigns from Yandex Direct
   */
  async syncCampaigns(): Promise<{ synced: number; updated: number }> {
    const response = await api.post('/campaigns/sync');
    return response.data;
  },

  /**
   * Get campaign performance data for charts
   */
  async getPerformanceData(dateRange: DateRange): Promise<CampaignPerformanceData> {
    const response = await api.get('/campaigns/performance', {
      params: {
        dateFrom: dateRange.from.toISOString(),
        dateTo: dateRange.to.toISOString()
      }
    });
    return response.data;
  },

  /**
   * Get campaign statistics
   */
  async getCampaignStats(
    campaignId: string, 
    dateRange: DateRange
  ): Promise<CampaignStats[]> {
    const response = await api.get(`/campaigns/${campaignId}/stats`, {
      params: {
        dateFrom: dateRange.from.toISOString(),
        dateTo: dateRange.to.toISOString()
      }
    });
    return response.data;
  },

  /**
   * Get campaign keywords with performance data
   */
  async getCampaignKeywords(
    campaignId: string,
    options?: {
      sortBy?: 'cost' | 'clicks' | 'impressions' | 'ctr' | 'cpc';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
    }
  ) {
    const response = await api.get(`/campaigns/${campaignId}/keywords`, {
      params: options
    });
    return response.data;
  },

  /**
   * Update campaign budget
   */
  async updateBudget(campaignId: string, budget: number): Promise<void> {
    await api.put(`/campaigns/${campaignId}/budget`, { budget });
  },

  /**
   * Update campaign status
   */
  async updateStatus(
    campaignId: string, 
    status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  ): Promise<void> {
    await api.put(`/campaigns/${campaignId}/status`, { status });
  },

  /**
   * Get AI-powered insights for campaign
   */
  async getCampaignInsights(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}/insights`);
    return response.data;
  },

  /**
   * Optimize campaign bids using AI
   */
  async optimizeBids(
    campaignId: string,
    strategy: 'maximize_clicks' | 'maximize_conversions' | 'target_cpa'
  ) {
    const response = await api.post(`/campaigns/${campaignId}/optimize`, {
      strategy
    });
    return response.data;
  },

  /**
   * Get keyword opportunities
   */
  async getKeywordOpportunities(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}/opportunities`);
    return response.data;
  },

  /**
   * Generate negative keywords suggestions
   */
  async getNegativeKeywordSuggestions(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}/negative-keywords`);
    return response.data;
  }
};