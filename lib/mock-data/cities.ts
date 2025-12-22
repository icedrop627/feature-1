import { City } from '../types';

export const mockCities: City[] = [
  {
    id: 'seoul-001',
    name_ko: '서울',
    name_en: 'Seoul',
    description: '대한민국의 수도이자 최대 도시. 무한한 기회와 다양한 문화가 공존하는 곳입니다.',
    coverImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451',
    monthlyCost: 2445000,
    likes: 342,
    dislikes: 89,
    budget: '200만원 이상',
    region: '수도권',
    environment: ['도심선호', '카페작업', '코워킹 필수'],
    bestSeason: ['봄', '가을']
  },

  {
    id: 'busan-001',
    name_ko: '부산',
    name_en: 'Busan',
    description: '아름다운 해안선과 활기찬 문화가 어우러진 대한민국 제2의 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0',
    monthlyCost: 2100000,
    likes: 298,
    dislikes: 56,
    budget: '200만원 이상',
    region: '경상도',
    environment: ['도심선호', '카페작업', '자연친화'],
    bestSeason: ['여름', '가을']
  },

  {
    id: 'jeju-001',
    name_ko: '제주',
    name_en: 'Jeju',
    description: '청정 자연과 독특한 문화가 살아있는 섬. 디지털 노마드의 성지입니다.',
    coverImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d',
    monthlyCost: 950000,
    likes: 412,
    dislikes: 34,
    budget: '100만원 이하',
    region: '제주도',
    environment: ['자연친화', '카페작업'],
    bestSeason: ['봄', '여름', '가을']
  },

  {
    id: 'gangneung-001',
    name_ko: '강릉',
    name_en: 'Gangneung',
    description: '커피의 도시이자 아름다운 동해바다를 끼고 있는 매력적인 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    monthlyCost: 1450000,
    likes: 234,
    dislikes: 45,
    budget: '100~200만원',
    region: '강원도',
    environment: ['자연친화', '카페작업'],
    bestSeason: ['여름', '겨울']
  },

  {
    id: 'jeonju-001',
    name_ko: '전주',
    name_en: 'Jeonju',
    description: '한옥마을과 맛있는 음식으로 유명한 전통과 현대가 공존하는 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
    monthlyCost: 1350000,
    likes: 187,
    dislikes: 38,
    budget: '100~200만원',
    region: '전라도',
    environment: ['도심선호', '자연친화'],
    bestSeason: ['봄', '가을']
  },

  {
    id: 'daejeon-001',
    name_ko: '대전',
    name_en: 'Daejeon',
    description: '대한민국의 중심, 과학과 교육의 도시로 조용하고 살기 좋은 곳입니다.',
    coverImage: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21',
    monthlyCost: 1550000,
    likes: 156,
    dislikes: 52,
    budget: '100~200만원',
    region: '충청도',
    environment: ['도심선호', '카페작업', '코워킹 필수'],
    bestSeason: ['봄', '가을']
  },

  {
    id: 'chuncheon-001',
    name_ko: '춘천',
    name_en: 'Chuncheon',
    description: '아름다운 호수와 자연에 둘러싸인 평화로운 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437',
    monthlyCost: 980000,
    likes: 203,
    dislikes: 29,
    budget: '100만원 이하',
    region: '강원도',
    environment: ['자연친화', '카페작업'],
    bestSeason: ['여름', '겨울']
  },

  {
    id: 'gyeongju-001',
    name_ko: '경주',
    name_en: 'Gyeongju',
    description: '천년 고도의 역사와 문화가 살아 숨 쉬는 아름다운 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
    monthlyCost: 890000,
    likes: 178,
    dislikes: 41,
    budget: '100만원 이하',
    region: '경상도',
    environment: ['자연친화', '도심선호'],
    bestSeason: ['봄', '여름', '가을']
  },

  {
    id: 'yeosu-001',
    name_ko: '여수',
    name_en: 'Yeosu',
    description: '아름다운 남해바다와 섬들이 어우러진 낭만적인 항구도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981',
    monthlyCost: 970000,
    likes: 265,
    dislikes: 37,
    budget: '100만원 이하',
    region: '전라도',
    environment: ['자연친화', '도심선호'],
    bestSeason: ['여름', '가을']
  },

  {
    id: 'sokcho-001',
    name_ko: '속초',
    name_en: 'Sokcho',
    description: '설악산과 동해바다가 만나는 자연의 보고, 신선한 해산물의 도시입니다.',
    coverImage: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97',
    monthlyCost: 920000,
    likes: 219,
    dislikes: 43,
    budget: '100만원 이하',
    region: '강원도',
    environment: ['자연친화', '카페작업'],
    bestSeason: ['여름', '겨울']
  }
];

// 도시 ID로 도시 찾기
export function getCityById(id: string): City | undefined {
  return mockCities.find(city => city.id === id);
}

// 지역별로 도시 필터링
export function getCitiesByRegion(region: string): City[] {
  return mockCities.filter(city => city.region === region);
}

// 모든 지역 목록
export const regions = ['수도권', '경상도', '전라도', '강원도', '제주도', '충청도'];
