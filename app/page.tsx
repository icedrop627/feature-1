'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { CityGrid } from '@/components/home/city-grid';
import { FilterSidebar } from '@/components/home/filter-sidebar';
import { mockCities } from '@/lib/mock-data/cities';
import type { FilterState } from '@/lib/types';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    budget: '전체',
    regions: [],
    environment: [],
    bestSeason: [],
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // 통계 계산
  const totalLikes = mockCities.reduce((sum, city) => sum + city.likes, 0);
  const totalDislikes = mockCities.reduce((sum, city) => sum + city.dislikes, 0);

  return (
    <>
      <HeroSection
        totalCities={mockCities.length}
        totalReviews={totalLikes + totalDislikes}
      />
      <div className="flex">
        <FilterSidebar onFilterChange={handleFilterChange} />
        <CityGrid cities={mockCities} filters={filters} />
      </div>
    </>
  );
}
