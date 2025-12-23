'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { FilterState } from '@/lib/types';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState<'전체' | '100만원 이하' | '100~200만원' | '200만원 이상'>('전체');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  const regions = ['수도권', '경상도', '전라도', '강원도', '제주도', '충청도'];
  const environmentOptions = ['자연친화', '도심선호', '카페작업', '코워킹 필수'];
  const seasonOptions = ['봄', '여름', '가을', '겨울'];

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleEnvironmentToggle = (env: string) => {
    setSelectedEnvironment((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleSeasonToggle = (season: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setBudget('전체');
    setSelectedRegions([]);
    setSelectedEnvironment([]);
    setSelectedSeasons([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (budget !== '전체') count++;
    count += selectedRegions.length;
    count += selectedEnvironment.length;
    count += selectedSeasons.length;
    return count;
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      searchQuery,
      budget,
      regions: selectedRegions,
      environment: selectedEnvironment,
      bestSeason: selectedSeasons,
    };
    onFilterChange(filters);
  };

  const FilterContent = () => (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">검색</Label>
          <Input
            id="search"
            placeholder="도시명 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleApplyFilters();
            }}
          />
        </div>

        <Separator />

        {/* Budget Filter */}
        <div className="space-y-3">
          <Label>예산</Label>
          <RadioGroup value={budget} onValueChange={(value) => {
            setBudget(value as typeof budget);
            handleApplyFilters();
          }}>
            <div className="flex items-center space-x-2 w-full">
              <RadioGroupItem value="전체" id="budget-all" />
              <Label htmlFor="budget-all" className="font-normal cursor-pointer flex-1">
                전체
              </Label>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <RadioGroupItem value="100만원 이하" id="budget-under100" />
              <Label htmlFor="budget-under100" className="font-normal cursor-pointer flex-1">
                100만원 이하
              </Label>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <RadioGroupItem value="100~200만원" id="budget-100to200" />
              <Label htmlFor="budget-100to200" className="font-normal cursor-pointer flex-1">
                100~200만원
              </Label>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <RadioGroupItem value="200만원 이상" id="budget-over200" />
              <Label htmlFor="budget-over200" className="font-normal cursor-pointer flex-1">
                200만원 이상
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Region Filter */}
        <div className="space-y-3">
          <Label>지역</Label>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2 w-full">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => {
                    handleRegionToggle(region);
                    setTimeout(handleApplyFilters, 0);
                  }}
                />
                <label
                  htmlFor={`region-${region}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Environment Filter */}
        <div className="space-y-3">
          <Label>환경</Label>
          <div className="space-y-2">
            {environmentOptions.map((env) => (
              <div key={env} className="flex items-center space-x-2 w-full">
                <Checkbox
                  id={`env-${env}`}
                  checked={selectedEnvironment.includes(env)}
                  onCheckedChange={() => {
                    handleEnvironmentToggle(env);
                    setTimeout(handleApplyFilters, 0);
                  }}
                />
                <label
                  htmlFor={`env-${env}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {env}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Best Season Filter */}
        <div className="space-y-3">
          <Label>최고 계절</Label>
          <div className="grid grid-cols-2 gap-2">
            {seasonOptions.map((season) => (
              <div key={season} className="flex items-center space-x-2 w-full">
                <Checkbox
                  id={`season-${season}`}
                  checked={selectedSeasons.includes(season)}
                  onCheckedChange={() => {
                    handleSeasonToggle(season);
                    setTimeout(handleApplyFilters, 0);
                  }}
                />
                <label
                  htmlFor={`season-${season}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {season}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button variant="outline" className="w-full" onClick={handleReset}>
            필터 초기화
          </Button>
          <Button className="w-full" onClick={handleApplyFilters}>
            적용하기 ({getActiveFilterCount()}개 필터)
          </Button>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r bg-card">
        <div className="sticky top-20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              필터
            </h2>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg">
            <SlidersHorizontal className="h-6 w-6" />
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-6 w-6 text-xs flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              필터
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
