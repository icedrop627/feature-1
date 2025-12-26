'use client';

import { useState, useMemo } from 'react';
import { CityCard } from './city-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { City, SortOption, FilterState } from '@/lib/types';

interface CityGridProps {
  cities: City[];
  filters: FilterState;
}

export function CityGrid({ cities, filters }: CityGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('likes');

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let result = [...cities];

    // 검색어 필터
    if (filters.searchQuery) {
      result = result.filter(
        (city) =>
          city.name_ko.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          city.name_en.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // 예산 필터
    if (filters.budget !== '전체') {
      result = result.filter((city) => city.budget === filters.budget);
    }

    // 지역 필터
    if (filters.regions.length > 0) {
      result = result.filter((city) => city.region && filters.regions.includes(city.region));
    }

    // 환경 필터 (OR 조건: 선택된 환경 중 하나라도 포함)
    if (filters.environment.length > 0) {
      result = result.filter((city) =>
        city.environment?.some((env) => filters.environment.includes(env))
      );
    }

    // 최고 계절 필터 (OR 조건: 선택된 계절 중 하나라도 포함)
    if (filters.bestSeason.length > 0) {
      result = result.filter((city) =>
        city.best_season?.some((season) => filters.bestSeason.includes(season))
      );
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'cost_low':
          return (a.monthly_cost || 0) - (b.monthly_cost || 0);
        case 'cost_high':
          return (b.monthly_cost || 0) - (a.monthly_cost || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [cities, filters, sortBy]);

  return (
    <section id="cities" className="flex-1 py-12 space-y-8">
      {/* Header */}
      <div className="container">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">도시 리스트</h2>
              <p className="text-muted-foreground">
                {filteredCities.length}개의 도시를 찾았습니다
              </p>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="likes">좋아요순</SelectItem>
                <SelectItem value="cost_low">생활비 낮은순</SelectItem>
                <SelectItem value="cost_high">생활비 높은순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container">
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
