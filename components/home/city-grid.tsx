'use client';

import { useState, useMemo } from 'react';
import { CityCard } from './city-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { City, SortOption } from '@/lib/types';

interface CityGridProps {
  cities: City[];
}

export function CityGrid({ cities }: CityGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let result = [...cities];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (city) =>
          city.name_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.overallRating - a.overallRating;
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'cost_low':
          return a.monthlyCost - b.monthlyCost;
        case 'cost_high':
          return b.monthlyCost - a.monthlyCost;
        case 'cafe':
          return b.cafeCount - a.cafeCount;
        case 'air_quality':
          return a.airQuality.aqi - b.airQuality.aqi;
        case 'value':
          return (b.overallRating / b.monthlyCost) * 1000000 - (a.overallRating / a.monthlyCost) * 1000000;
        default:
          return 0;
      }
    });

    return result;
  }, [cities, searchQuery, sortBy]);

  return (
    <section id="cities" className="container py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">도시 둘러보기</h2>
            <p className="text-muted-foreground">
              {filteredCities.length}개의 도시를 찾았습니다
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="도시 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">종합 평점순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="value">가성비순</SelectItem>
                <SelectItem value="cost_low">생활비 낮은순</SelectItem>
                <SelectItem value="cost_high">생활비 높은순</SelectItem>
                <SelectItem value="cafe">카페 많은순</SelectItem>
                <SelectItem value="air_quality">공기질 좋은순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
