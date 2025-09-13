import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { RateLimiter } from '../utils/rateLimiter';

export interface YandexCampaign {
  Id: number;
  Name: string;
  Type: string;
  Status: string;
  StatusPayment: string;
  StatusClarification?: string;
  StartDate?: string;
  EndDate?: string;
  DailyBudget?: {
    Amount: number;
    Mode: string;
  };
  Settings?: any[];
}

export interface YandexKeyword {
  Id: number;
  Keyword: string;
  Status: string;
  Bid: number;
  ContextBid?: number;
  StrategyPriority?: string;
  UserParam1?: string;
  UserParam2?: string;
}

export interface YandexStats {
  Date: string;
  CampaignId?: number;
  AdGroupId?: number;
  KeywordId?: number;
  Impressions: number;
  Clicks: number;
  Cost: number;
  Conversions?: number;
  Revenue?: number;
  AvgCpc?: number;
  AvgCpm?: number;
  Ctr?: number;
  AvgPosition?: number;
}

export class YandexDirectService {
  private api: AxiosInstance;
  private rateLimiter: RateLimiter;

  constructor() {
    this.api = axios.create({
      baseURL: config.YANDEX_DIRECT_API_URL,
      headers: {
        'Authorization': `Bearer ${config.YANDEX_DIRECT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'ru',
        'Client-Login': 'yaai-analytics'
      },
      timeout: 30000
    });

    this.rateLimiter = new RateLimiter(config.YANDEX_API_RATE_LIMIT);

    // Request interceptor for rate limiting
    this.api.interceptors.request.use(async (config) => {
      await this.rateLimiter.wait();
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Yandex Direct API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
        throw error;
      }
    );
  }

  /**
   * Get all campaigns for account
   */
  async getCampaigns(): Promise<YandexCampaign[]> {
    try {
      const response = await this.api.post('/campaigns', {
        method: 'get',
        params: {
          SelectionCriteria: {},
          FieldNames: [
            'Id', 'Name', 'Type', 'Status', 'StatusPayment', 
            'StatusClarification', 'StartDate', 'EndDate'
          ],
          TextCampaignFieldNames: ['Settings'],
          MobileAppCampaignFieldNames: ['Settings'],
          DynamicTextCampaignFieldNames: ['Settings'],
          SmartCampaignFieldNames: ['Settings']
        }
      });

      return response.data.result.Campaigns || [];
    } catch (error) {
      logger.error('Failed to fetch campaigns:', error);
      throw new Error('Failed to fetch campaigns from Yandex Direct');
    }
  }

  /**
   * Get keywords for campaign
   */
  async getKeywords(campaignId: number): Promise<YandexKeyword[]> {
    try {
      const response = await this.api.post('/keywords', {
        method: 'get',
        params: {
          SelectionCriteria: {
            CampaignIds: [campaignId]
          },
          FieldNames: [
            'Id', 'Keyword', 'Status', 'Bid', 'ContextBid',
            'StrategyPriority', 'UserParam1', 'UserParam2'
          ]
        }
      });

      return response.data.result.Keywords || [];
    } catch (error) {
      logger.error(`Failed to fetch keywords for campaign ${campaignId}:`, error);
      throw new Error('Failed to fetch keywords from Yandex Direct');
    }
  }

  /**
   * Get statistics report
   */
  async getStats(params: {
    campaignIds?: number[];
    adGroupIds?: number[];
    keywordIds?: number[];
    dateFrom: string;
    dateTo: string;
    fields: string[];
  }): Promise<YandexStats[]> {
    try {
      const reportDefinition = {
        SelectionCriteria: {
          DateFrom: params.dateFrom,
          DateTo: params.dateTo,
          ...(params.campaignIds && { CampaignIds: params.campaignIds }),
          ...(params.adGroupIds && { AdGroupIds: params.adGroupIds }),
          ...(params.keywordIds && { KeywordIds: params.keywordIds })
        },
        FieldNames: params.fields,
        ReportName: `YAAI_Report_${Date.now()}`,
        ReportType: 'CAMPAIGN_PERFORMANCE_REPORT',
        DateRangeType: 'CUSTOM_DATE',
        Format: 'TSV',
        IncludeVAT: 'YES',
        IncludeDiscount: 'NO'
      };

      // Create report
      const createResponse = await this.api.post('/reports', {
        method: 'post',
        params: reportDefinition
      });

      const reportId = createResponse.data.result.ReportId;
      
      // Wait for report to be ready and download
      const reportData = await this.waitAndDownloadReport(reportId);
      
      return this.parseStatsReport(reportData);
    } catch (error) {
      logger.error('Failed to get stats:', error);
      throw new Error('Failed to get statistics from Yandex Direct');
    }
  }

  /**
   * Update campaign budget
   */
  async updateCampaignBudget(campaignId: number, budget: number): Promise<void> {
    try {
      await this.api.post('/campaigns', {
        method: 'update',
        params: {
          Campaigns: [{
            Id: campaignId,
            DailyBudget: {
              Amount: budget * 1000000, // Convert to micros
              Mode: 'STANDARD'
            }
          }]
        }
      });
    } catch (error) {
      logger.error(`Failed to update budget for campaign ${campaignId}:`, error);
      throw new Error('Failed to update campaign budget');
    }
  }

  /**
   * Update keyword bids
   */
  async updateKeywordBids(updates: Array<{ id: number; bid: number }>): Promise<void> {
    try {
      const keywords = updates.map(update => ({
        Id: update.id,
        Bid: update.bid * 1000000 // Convert to micros
      }));

      await this.api.post('/keywords', {
        method: 'update',
        params: { Keywords: keywords }
      });
    } catch (error) {
      logger.error('Failed to update keyword bids:', error);
      throw new Error('Failed to update keyword bids');
    }
  }

  private async waitAndDownloadReport(reportId: string): Promise<string> {
    // Implementation for waiting and downloading report
    // This would involve polling the report status and downloading when ready
    throw new Error('Report download not implemented yet');
  }

  private parseStatsReport(reportData: string): YandexStats[] {
    // Implementation for parsing TSV report data
    // Convert TSV to structured data
    throw new Error('Report parsing not implemented yet');
  }
}