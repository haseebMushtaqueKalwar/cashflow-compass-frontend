
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  gradient?: boolean;
  animation?: boolean;
  icon?: React.ReactNode;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  children,
  className,
  isLoading = false,
  gradient = false,
  animation = true,
  icon
}) => {
  const cardClasses = cn(
    "shadow-sm border border-gray-200 dark:border-gray-700",
    gradient && "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
    animation && "transition-all duration-300 hover:shadow-md hover:scale-[1.01]",
    className
  );

  if (isLoading) {
    return (
      <Card className={cardClasses}>
        {title && (
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
        )}
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardClasses}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
