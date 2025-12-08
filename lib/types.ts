// 날씨 데이터
export interface WeatherData {
  temperature: number; // 온도 (°C)
  feelsLike: number; // 체감 온도 (°C)
  condition: string; // 날씨 상태 (맑음, 흐림, 비 등)
  icon: string; // 날씨 아이콘 코드
}

// 공기질 데이터
export interface AirQualityData {
  aqi: number; // 공기질 지수
  level: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy'; // 공기질 레벨
  color: string; // 표시 색상
}

// 도시 데이터
export interface City {
  id: string;
  name_ko: string; // 한글 이름
  name_en: string; // 영문 이름
  region: string; // 지역 (수도권, 강원, 제주 등)
  citySize: 'large' | 'medium' | 'small'; // 도시 규모
  coverImage: string; // 대표 이미지 URL
  description: string; // 도시 설명

  // 평가 정보
  overallRating: number; // 종합 평점 (0-5)
  reviewCount: number; // 리뷰 수

  // 생활비 정보
  monthlyCost: number; // 월 평균 생활비 (원)
  roomRent: number; // 원룸 평균 가격 (원)

  // 작업 환경
  cafeCount: number; // 카페 수
  coworkingCount: number; // 코워킹 스페이스 수
  avgInternetSpeed: number; // 평균 인터넷 속도 (Mbps)

  // 실시간 데이터
  currentWeather: WeatherData;
  airQuality: AirQualityData;

  // 태그
  tags: string[]; // 도시 특성 태그

  // 좌표 (추후 지도 기능 확장 시 사용)
  latitude: number;
  longitude: number;

  // 메타 데이터
  createdAt?: string;
  updatedAt?: string;
}

// 필터 상태
export interface FilterState {
  searchQuery: string; // 검색어
  regions: string[]; // 지역 필터
  budget: string | null; // 예산 필터
  citySize: string[]; // 도시 규모 필터
  workspace: string[]; // 작업 환경 필터
  climate: string[]; // 기후 필터
  lifestyle: string[]; // 라이프스타일 필터
}

// 정렬 옵션
export type SortOption =
  | 'rating' // 종합 평점순
  | 'popular' // 인기순 (리뷰 많은)
  | 'recent' // 최신 리뷰순
  | 'value' // 가성비순
  | 'cost_low' // 생활비 낮은순
  | 'cost_high' // 생활비 높은순
  | 'cafe' // 카페 많은순
  | 'air_quality'; // 공기질 좋은순

// 리뷰 데이터 (추후 확장 시 사용)
export interface Review {
  id: string;
  cityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  overallRating: number;
  title: string;
  content: string;
  stayDuration: string; // 체류 기간
  helpfulCount: number; // 도움됨 수
  createdAt: string;
  updatedAt: string;
}
