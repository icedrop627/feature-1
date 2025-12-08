import { Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AirQualityData } from '@/lib/types';

interface AirQualityBadgeProps {
  airQuality: AirQualityData;
  compact?: boolean;
}

export function AirQualityBadge({ airQuality, compact = false }: AirQualityBadgeProps) {
  const getLevelText = (level: string) => {
    switch (level) {
      case 'good':
        return '좋음';
      case 'moderate':
        return '양호';
      case 'unhealthy':
        return '나쁨';
      case 'very_unhealthy':
        return '매우나쁨';
      default:
        return '좋음';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'unhealthy':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'very_unhealthy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  if (compact) {
    return (
      <Badge className={`gap-1 text-xs ${getLevelColor(airQuality.level)}`}>
        <Wind size={12} />
        <span>{getLevelText(airQuality.level)}</span>
      </Badge>
    );
  }

  return (
    <Badge className={`gap-1.5 text-xs font-normal ${getLevelColor(airQuality.level)}`}>
      <Wind size={14} />
      <span className="font-medium">공기질</span>
      <span>{getLevelText(airQuality.level)}</span>
      <span className="text-xs opacity-80">(AQI {airQuality.aqi})</span>
    </Badge>
  );
}
