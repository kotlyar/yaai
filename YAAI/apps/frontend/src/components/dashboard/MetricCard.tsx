import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  format: 'currency' | 'number' | 'percentage';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  isLoading?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
};

export function MetricCard({ 
  title, 
  value, 
  change, 
  format, 
  icon: Icon, 
  color,
  isLoading = false 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(2)}%`;
      case 'number':
        return new Intl.NumberFormat('ru-RU').format(val);
      default:
        return val.toString();
    }
  };

  const isPositive = change > 0;
  const isNegative = change < 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={cn(
          'p-2 rounded-lg border',
          colorClasses[color]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
        
        {change !== 0 && (
          <div className={cn(
            'flex items-center text-sm',
            isPositive && 'text-green-600',
            isNegative && 'text-red-600'
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>
              {Math.abs(change).toFixed(1)}% к предыдущему периоду
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}