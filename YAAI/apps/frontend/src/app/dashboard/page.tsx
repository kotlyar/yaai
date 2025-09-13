'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Eye, 
  MousePointer,
  BarChart3,
  PieChart
} from 'lucide-react';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CampaignPerformanceChart } from '@/components/charts/CampaignPerformanceChart';
import { KeywordAnalysisTable } from '@/components/tables/KeywordAnalysisTable';
import { GeographicHeatmap } from '@/components/charts/GeographicHeatmap';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { campaignService } from '@/services/campaignService';
import { analyticsService } from '@/services/analyticsService';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  });

  // Fetch dashboard data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview', dateRange],
    queryFn: () => analyticsService.getDashboardOverview(dateRange),
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns-performance', dateRange],
    queryFn: () => campaignService.getPerformanceData(dateRange)
  });

  const { data: insights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: () => analyticsService.getAIInsights(),
    refetchInterval: 15 * 60 * 1000 // Refresh every 15 minutes
  });

  const metrics = [
    {
      title: 'Общие расходы',
      value: overview?.totalCost || 0,
      change: overview?.costChange || 0,
      format: 'currency',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Показы',
      value: overview?.totalImpressions || 0,
      change: overview?.impressionsChange || 0,
      format: 'number',
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Клики',
      value: overview?.totalClicks || 0,
      change: overview?.clicksChange || 0,
      format: 'number',
      icon: MousePointer,
      color: 'purple'
    },
    {
      title: 'CTR',
      value: overview?.avgCtr || 0,
      change: overview?.ctrChange || 0,
      format: 'percentage',
      icon: Target,
      color: 'orange'
    },
    {
      title: 'CPC',
      value: overview?.avgCpc || 0,
      change: overview?.cpcChange || 0,
      format: 'currency',
      icon: TrendingUp,
      color: 'red'
    },
    {
      title: 'ROI',
      value: overview?.roi || 0,
      change: overview?.roiChange || 0,
      format: 'percentage',
      icon: BarChart3,
      color: 'indigo'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Аналитика кампаний
            </h1>
            <p className="text-gray-600 mt-1">
              Обзор эффективности рекламных кампаний в Яндекс Директе
            </p>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex items-center space-x-4">
            {/* DateRangePicker component would go here */}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                format={metric.format}
                icon={metric.icon}
                color={metric.color}
                isLoading={overviewLoading}
              />
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Динамика показателей
                </h2>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <CampaignPerformanceChart 
                data={campaigns?.chartData || []}
                isLoading={campaignsLoading}
              />
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <InsightsPanel insights={insights || []} />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Keywords Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Топ ключевые слова
              </h2>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <KeywordAnalysisTable 
              data={overview?.topKeywords || []}
              isLoading={overviewLoading}
            />
          </div>

          {/* Geographic Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                География показов
              </h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <GeographicHeatmap 
              data={overview?.geoData || []}
              isLoading={overviewLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}