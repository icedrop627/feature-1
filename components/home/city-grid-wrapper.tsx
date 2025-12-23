'use client';

import { useState } from 'react';
import { CityGrid } from '@/components/home/city-grid';
import { FilterSidebar } from '@/components/home/filter-sidebar';
import type { FilterState, City } from '@/lib/types';

interface CityGridWrapperProps {
  initialCities: City[];
}

export function CityGridWrapper({ initialCities }: CityGridWrapperProps) {
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

  return (
    <div className="flex">
      <FilterSidebar onFilterChange={handleFilterChange} />
      <CityGrid cities={initialCities} filters={filters} />
    </div>
  );
}
