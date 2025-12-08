import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WeatherData } from '@/lib/types';

interface WeatherBadgeProps {
  weather: WeatherData;
  compact?: boolean;
}

export function WeatherBadge({ weather, compact = false }: WeatherBadgeProps) {
  const getWeatherIcon = (iconCode: string) => {
    const iconProps = { size: 14, className: 'shrink-0' };

    switch (iconCode) {
      case 'sun':
        return <Sun {...iconProps} />;
      case 'cloud':
        return <Cloud {...iconProps} />;
      case 'cloud-sun':
        return <CloudSun {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  if (compact) {
    return (
      <Badge variant="secondary" className="gap-1 text-xs">
        {getWeatherIcon(weather.icon)}
        <span>{weather.temperature}°C</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-xs font-normal">
      {getWeatherIcon(weather.icon)}
      <span className="font-medium">{weather.temperature}°C</span>
      <span className="text-muted-foreground">
        (체감 {weather.feelsLike}°C)
      </span>
    </Badge>
  );
}
