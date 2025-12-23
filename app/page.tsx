import { HeroSection } from '@/components/home/hero-section';
import { CityGridWrapper } from '@/components/home/city-grid-wrapper';
import { getCitiesServer } from '@/lib/api/cities';

export default async function Home() {
  // Fetch cities from Supabase
  const { data: cities, error } = await getCitiesServer();

  // Handle error or empty state
  if (error) {
    console.error('Failed to fetch cities:', error);
  }

  const citiesData = cities || [];

  // 통계 계산
  const totalLikes = citiesData.reduce((sum, city) => sum + city.likes, 0);
  const totalDislikes = citiesData.reduce((sum, city) => sum + city.dislikes, 0);

  return (
    <>
      <HeroSection
        totalCities={citiesData.length}
        totalReviews={totalLikes + totalDislikes}
      />
      <CityGridWrapper initialCities={citiesData} />
    </>
  );
}
