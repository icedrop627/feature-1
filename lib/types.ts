import { Database } from './database.types';

// 도시 데이터 (Supabase DB 타입 기반)
export type City = Database['public']['Tables']['cities']['Row'];

// 프로필 데이터
export type Profile = Database['public']['Tables']['profiles']['Row'];

// 리뷰 데이터
export type Review = Database['public']['Tables']['reviews']['Row'];

// 도시 반응 데이터
export type CityReaction = Database['public']['Tables']['city_reactions']['Row'];

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
