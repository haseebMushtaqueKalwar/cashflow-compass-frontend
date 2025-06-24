
import React from 'react';
import { EnhancedCard } from './enhanced-card';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient: string;
  isLoading?: boolean;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  gradient,
  isLoading = false,
  className
}) => {
  if (isLoading) {
    return (
      <EnhancedCard className={cn("p-4", className)} isLoading={true}>
        <div />
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard 
      className={cn(`bg-gradient-to-br ${gradient} border-opacity-20`, className)}
      animation={true}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <p className="text-sm font-medium opacity-80">{title}</p>
          </div>
          <div className="text-2xl font-bold mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              <span className={cn(
                "inline-block w-2 h-2 rounded-full",
                trend.isPositive ? "bg-green-500" : "bg-red-500"
              )} />
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </EnhancedCard>
  );
};
