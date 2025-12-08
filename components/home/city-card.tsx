'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, DollarSign, Home, Coffee, Wifi } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingDisplay } from '@/components/common/rating-display';
import { WeatherBadge } from '@/components/common/weather-badge';
import { AirQualityBadge } from '@/components/common/air-quality-badge';
import { ReviewModal } from '@/components/review/review-modal';
import type { City } from '@/lib/types';

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <>
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={city.coverImage}
          alt={city.name_ko}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <WeatherBadge weather={city.currentWeather} compact />
          <AirQualityBadge airQuality={city.airQuality} compact />
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold text-xl">{city.name_ko}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{city.name_en}</p>
          </div>
          <RatingDisplay rating={city.overallRating} reviewCount={city.reviewCount} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">월 생활비</span>
            <span className="font-semibold">₩{(city.monthlyCost / 10000).toFixed(0)}만</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">원룸</span>
            <span className="font-semibold">₩{(city.roomRent / 10000).toFixed(0)}만</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coffee className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">카페</span>
            <span className="font-semibold">{city.cafeCount}곳</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">인터넷</span>
            <span className="font-semibold">{city.avgInternetSpeed}Mbps</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {city.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/cities/${city.id}`}>상세보기</Link>
        </Button>
        <Button size="sm" onClick={() => setReviewModalOpen(true)}>
          평가하기
        </Button>
      </CardFooter>
    </Card>

    <ReviewModal
      isOpen={reviewModalOpen}
      onClose={() => setReviewModalOpen(false)}
      cityName={city.name_ko}
    />
    </>
  );
}
