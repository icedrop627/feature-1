import { HeroSection } from '@/components/home/hero-section';
import { CityGrid } from '@/components/home/city-grid';
import { FilterSidebar } from '@/components/home/filter-sidebar';
import { mockCities } from '@/lib/mock-data/cities';

export default function Home() {
  const totalReviews = mockCities.reduce((sum, city) => sum + city.reviewCount, 0);

  return (
    <>
      <HeroSection totalCities={mockCities.length} totalReviews={totalReviews} />
      <div className="flex">
        <FilterSidebar />
        <div className="flex-1">
          <CityGrid cities={mockCities} />
        </div>
      </div>
    </>
  );
}
