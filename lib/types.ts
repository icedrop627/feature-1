// 도시 데이터
export interface City {
  id: string;
  name_ko: string; // 한글 이름
  name_en: string; // 영문 이름
  description: string; // 도시 설명
  coverImage: string; // 대표 이미지 URL
  monthlyCost: number; // 월 평균 생활비 (원)

  likes: number; // 좋아요 수
  dislikes: number; // 싫어요 수

  budget: '100만원 이하' | '100~200만원' | '200만원 이상';
  region: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도';
  environment: ('자연친화' | '도심선호' | '카페작업' | '코워킹 필수')[];
  bestSeason: ('봄' | '여름' | '가을' | '겨울')[];
}

// 필터 상태
export interface FilterState {
  searchQuery: string; // 검색어
  budget: '전체' | '100만원 이하' | '100~200만원' | '200만원 이상'; // 예산 필터
  regions: string[]; // 지역 필터 (복수 선택)
  environment: string[]; // 환경 필터 (복수 선택)
  bestSeason: string[]; // 최고 계절 필터 (복수 선택)
}

// 정렬 옵션
export type SortOption = 'likes' | 'cost_low' | 'cost_high';
