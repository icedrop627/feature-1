import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, DollarSign, Home, Coffee, Wifi, Users, Star, TrendingUp, Calendar } from 'lucide-react';
import { mockCities } from '@/lib/mock-data/cities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RatingDisplay } from '@/components/common/rating-display';
import { WeatherBadge } from '@/components/common/weather-badge';
import { AirQualityBadge } from '@/components/common/air-quality-badge';

interface CityDetailPageProps {
  params: {
    id: string;
  };
}

export default function CityDetailPage({ params }: CityDetailPageProps) {
  const city = mockCities.find((c) => c.id === params.id);

  if (!city) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={city.coverImage}
          alt={city.name_ko}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">{city.name_ko}</h1>
              </div>
              <p className="text-xl text-muted-foreground">{city.name_en} · {city.region}</p>
              <div className="flex items-center gap-4 mt-4">
                <WeatherBadge weather={city.currentWeather} />
                <AirQualityBadge airQuality={city.airQuality} />
              </div>
            </div>

            <div className="text-right">
              <RatingDisplay rating={city.overallRating} reviewCount={city.reviewCount} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>도시 소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{city.description}</p>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <Card>
              <CardHeader>
                <CardTitle>핵심 지표</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">월 생활비</span>
                    </div>
                    <p className="text-2xl font-bold">₩{(city.monthlyCost / 10000).toFixed(0)}만</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span className="text-sm">원룸 평균</span>
                    </div>
                    <p className="text-2xl font-bold">₩{(city.roomRent / 10000).toFixed(0)}만</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Coffee className="h-4 w-4" />
                      <span className="text-sm">카페/코워킹</span>
                    </div>
                    <p className="text-2xl font-bold">{city.cafeCount + city.coworkingCount}곳</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wifi className="h-4 w-4" />
                      <span className="text-sm">인터넷 속도</span>
                    </div>
                    <p className="text-2xl font-bold">{city.avgInternetSpeed}Mbps</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Costs Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>생활비 상세</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">원룸/오피스텔</p>
                      <p className="text-sm text-muted-foreground">월세 (관리비 포함)</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">₩{(city.roomRent / 10000).toFixed(0)}만원</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">식비</p>
                      <p className="text-sm text-muted-foreground">외식 + 장보기</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">₩{((city.monthlyCost - city.roomRent) * 0.5 / 10000).toFixed(0)}만원</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Coffee className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">카페/코워킹</p>
                      <p className="text-sm text-muted-foreground">주 5일 이용 기준</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">₩{((city.monthlyCost - city.roomRent) * 0.3 / 10000).toFixed(0)}만원</p>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">기타 (교통, 통신 등)</p>
                      <p className="text-sm text-muted-foreground">부대비용</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">₩{((city.monthlyCost - city.roomRent) * 0.2 / 10000).toFixed(0)}만원</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-bold">월 평균 총 생활비</p>
                  <p className="text-2xl font-bold text-primary">₩{(city.monthlyCost / 10000).toFixed(0)}만원</p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section (UI Only) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>리뷰 ({city.reviewCount})</CardTitle>
                  <Button>리뷰 작성하기</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Review 1 */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                        김
                      </div>
                      <div>
                        <p className="font-semibold">김디노</p>
                        <p className="text-sm text-muted-foreground">1개월 체류</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">작업하기 정말 좋은 도시!</p>
                  <p className="text-muted-foreground leading-relaxed">
                    카페가 정말 많아서 매일 다른 곳에서 작업할 수 있었어요. 인터넷도 빠르고,
                    분위기도 좋았습니다. 생활비는 예상보다 조금 높았지만 만족스러웠어요.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2024년 11월</span>
                  </div>
                </div>

                {/* Sample Review 2 */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                        박
                      </div>
                      <div>
                        <p className="font-semibold">박프리</p>
                        <p className="text-sm text-muted-foreground">2주 체류</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.5</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">조용하고 쾌적한 환경</p>
                  <p className="text-muted-foreground leading-relaxed">
                    집중해서 일하기에 완벽한 환경이었습니다. 공기질도 좋고,
                    주변이 조용해서 스트레스 없이 작업할 수 있었어요.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2024년 10월</span>
                  </div>
                </div>

                {/* Sample Review 3 */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        이
                      </div>
                      <div>
                        <p className="font-semibold">이노마</p>
                        <p className="text-sm text-muted-foreground">3주 체류</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.7</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">가성비 좋은 도시</p>
                  <p className="text-muted-foreground leading-relaxed">
                    생활비 대비 만족도가 높았어요. 특히 카페 가격이 합리적이고,
                    코워킹 스페이스도 잘 되어있어서 좋았습니다.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>2024년 9월</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  리뷰 더보기
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" size="lg">
                  <Star className="mr-2 h-4 w-4" />
                  평가하기
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  북마크
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  공유하기
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">특징</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {city.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Working Environment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">작업 환경</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">카페</span>
                  </div>
                  <span className="font-semibold">{city.cafeCount}곳</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">코워킹</span>
                  </div>
                  <span className="font-semibold">{city.coworkingCount}곳</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">평균 속도</span>
                  </div>
                  <span className="font-semibold">{city.avgInternetSpeed}Mbps</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">비슷한 도시</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCities
                  .filter((c) => c.id !== city.id && c.region === city.region)
                  .slice(0, 3)
                  .map((similarCity) => (
                    <a
                      key={similarCity.id}
                      href={`/cities/${similarCity.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={similarCity.coverImage}
                          alt={similarCity.name_ko}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{similarCity.name_ko}</p>
                        <p className="text-xs text-muted-foreground">₩{(similarCity.monthlyCost / 10000).toFixed(0)}만</p>
                      </div>
                    </a>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
