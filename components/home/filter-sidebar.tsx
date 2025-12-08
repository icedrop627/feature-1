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

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('all');
  const [selectedCitySize, setSelectedCitySize] = useState<string[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string[]>([]);
  const [selectedClimate, setSelectedClimate] = useState<string[]>([]);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);

  const regions = ['수도권', '강원', '충청', '전라', '경상', '제주'];
  const citySizes = [
    { id: 'large', label: '대도시 (100만+)' },
    { id: 'medium', label: '중소도시 (10만-100만)' },
    { id: 'small', label: '소도시 (<10만)' },
  ];
  const workspaceOptions = [
    { id: 'manyCafes', label: '카페 많음 (100개+)' },
    { id: 'coworking', label: '코워킹 스페이스 있음' },
    { id: 'goodWifi', label: '공공 WiFi 우수' },
    { id: '24hours', label: '24시간 카페 있음' },
  ];
  const climateOptions = [
    { id: 'warm', label: '따뜻함 (15°C+)' },
    { id: 'moderate', label: '온화함 (10-15°C)' },
    { id: 'cool', label: '추움 (<10°C)' },
    { id: 'goodAir', label: '공기질 좋음 (AQI<50)' },
  ];
  const lifestyleOptions = [
    { id: 'vibrant', label: '활기찬' },
    { id: 'quiet', label: '조용한' },
    { id: 'nature', label: '자연 친화적' },
    { id: 'cultural', label: '문화시설 많음' },
  ];

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleCitySizeToggle = (size: string) => {
    setSelectedCitySize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleWorkspaceToggle = (option: string) => {
    setSelectedWorkspace((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleClimateToggle = (option: string) => {
    setSelectedClimate((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleLifestyleToggle = (option: string) => {
    setSelectedLifestyle((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRegions([]);
    setBudget('all');
    setSelectedCitySize([]);
    setSelectedWorkspace([]);
    setSelectedClimate([]);
    setSelectedLifestyle([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    count += selectedRegions.length;
    if (budget !== 'all') count++;
    count += selectedCitySize.length;
    count += selectedWorkspace.length;
    count += selectedClimate.length;
    count += selectedLifestyle.length;
    return count;
  };

  const FilterContent = () => (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">🔍 검색</Label>
          <Input
            id="search"
            placeholder="도시명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Separator />

        {/* Region Filter */}
        <div className="space-y-3">
          <Label>📍 지역</Label>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => handleRegionToggle(region)}
                />
                <label
                  htmlFor={`region-${region}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget Filter */}
        <div className="space-y-3">
          <Label>💵 월 예산</Label>
          <RadioGroup value={budget} onValueChange={setBudget}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="budget-all" />
              <Label htmlFor="budget-all" className="font-normal cursor-pointer">
                전체
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under100" id="budget-under100" />
              <Label htmlFor="budget-under100" className="font-normal cursor-pointer">
                ~100만원
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100to150" id="budget-100to150" />
              <Label htmlFor="budget-100to150" className="font-normal cursor-pointer">
                100-150만원
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="150to200" id="budget-150to200" />
              <Label htmlFor="budget-150to200" className="font-normal cursor-pointer">
                150-200만원
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="over200" id="budget-over200" />
              <Label htmlFor="budget-over200" className="font-normal cursor-pointer">
                200만원+
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* City Size Filter */}
        <div className="space-y-3">
          <Label>🏙️ 도시 규모</Label>
          {citySizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.id}`}
                checked={selectedCitySize.includes(size.id)}
                onCheckedChange={() => handleCitySizeToggle(size.id)}
              />
              <label
                htmlFor={`size-${size.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {size.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Workspace Filter */}
        <div className="space-y-3">
          <Label>☕ 작업 환경</Label>
          {workspaceOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`workspace-${option.id}`}
                checked={selectedWorkspace.includes(option.id)}
                onCheckedChange={() => handleWorkspaceToggle(option.id)}
              />
              <label
                htmlFor={`workspace-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Climate Filter */}
        <div className="space-y-3">
          <Label>🌡️ 기후</Label>
          {climateOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`climate-${option.id}`}
                checked={selectedClimate.includes(option.id)}
                onCheckedChange={() => handleClimateToggle(option.id)}
              />
              <label
                htmlFor={`climate-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Lifestyle Filter */}
        <div className="space-y-3">
          <Label>🎨 라이프스타일</Label>
          {lifestyleOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`lifestyle-${option.id}`}
                checked={selectedLifestyle.includes(option.id)}
                onCheckedChange={() => handleLifestyleToggle(option.id)}
              />
              <label
                htmlFor={`lifestyle-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button variant="outline" className="w-full" onClick={handleReset}>
            🔄 필터 초기화
          </Button>
          <Button className="w-full">
            ✓ 적용하기 ({getActiveFilterCount()}개 필터)
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
