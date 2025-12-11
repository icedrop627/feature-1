import { City } from '../types';

export const mockCities: City[] = [
  {
    id: 'seoul-001',
    name_ko: '서울',
    name_en: 'Seoul',
    region: '수도권',
    citySize: 'large',
    coverImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451',
    description: '대한민국의 수도이자 최대 도시. 무한한 기회와 다양한 문화가 공존하는 곳입니다.',

    overallRating: 4.7,
    reviewCount: 234,

    monthlyCost: 2445000,
    roomRent: 850000,

    cafeCount: 1234,
    coworkingCount: 89,
    avgInternetSpeed: 342,

    currentWeather: {
      temperature: -5,
      feelsLike: -7,
      condition: '맑음',
      icon: 'sun'
    },

    airQuality: {
      aqi: 22,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['대도시', '카페많음', '대중교통편리', '문화생활', '24시간도시'],

    latitude: 37.5665,
    longitude: 126.9780
  },

  {
    id: 'busan-001',
    name_ko: '부산',
    name_en: 'Busan',
    region: '경상',
    citySize: 'large',
    coverImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0',
    description: '아름다운 해안선과 활기찬 문화가 어우러진 대한민국 제2의 도시입니다.',

    overallRating: 4.6,
    reviewCount: 189,

    monthlyCost: 1850000,
    roomRent: 600000,

    cafeCount: 567,
    coworkingCount: 34,
    avgInternetSpeed: 318,

    currentWeather: {
      temperature: 8,
      feelsLike: 6,
      condition: '흐림',
      icon: 'cloud'
    },

    airQuality: {
      aqi: 35,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['바다', '온화한날씨', '카페많음', '활기찬', '해변도시'],

    latitude: 35.1796,
    longitude: 129.0756
  },

  {
    id: 'jeju-001',
    name_ko: '제주',
    name_en: 'Jeju',
    region: '제주',
    citySize: 'medium',
    coverImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d',
    description: '청정 자연과 독특한 문화가 살아있는 섬. 디지털 노마드의 성지입니다.',

    overallRating: 4.8,
    reviewCount: 312,

    monthlyCost: 2100000,
    roomRent: 750000,

    cafeCount: 345,
    coworkingCount: 12,
    avgInternetSpeed: 275,

    currentWeather: {
      temperature: 12,
      feelsLike: 10,
      condition: '구름조금',
      icon: 'cloud-sun'
    },

    airQuality: {
      aqi: 15,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['자연친화적', '공기질우수', '바다', '힐링', '관광명소'],

    latitude: 33.4996,
    longitude: 126.5312
  },

  {
    id: 'gangneung-001',
    name_ko: '강릉',
    name_en: 'Gangneung',
    region: '강원',
    citySize: 'medium',
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    description: '커피의 도시이자 아름다운 동해바다를 끼고 있는 매력적인 도시입니다.',

    overallRating: 4.5,
    reviewCount: 156,

    monthlyCost: 1450000,
    roomRent: 480000,

    cafeCount: 234,
    coworkingCount: 8,
    avgInternetSpeed: 245,

    currentWeather: {
      temperature: 2,
      feelsLike: -1,
      condition: '맑음',
      icon: 'sun'
    },

    airQuality: {
      aqi: 18,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['커피도시', '바다', '조용한', '저렴', '카페많음'],

    latitude: 37.7519,
    longitude: 128.8761
  },

  {
    id: 'jeonju-001',
    name_ko: '전주',
    name_en: 'Jeonju',
    region: '전라',
    citySize: 'medium',
    coverImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
    description: '한옥마을과 맛있는 음식으로 유명한 전통과 현대가 공존하는 도시입니다.',

    overallRating: 4.4,
    reviewCount: 127,

    monthlyCost: 1350000,
    roomRent: 420000,

    cafeCount: 178,
    coworkingCount: 6,
    avgInternetSpeed: 230,

    currentWeather: {
      temperature: 5,
      feelsLike: 3,
      condition: '흐림',
      icon: 'cloud'
    },

    airQuality: {
      aqi: 42,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['전통문화', '맛집많음', '저렴', '조용한', '한옥마을'],

    latitude: 35.8242,
    longitude: 127.1480
  },

  {
    id: 'daejeon-001',
    name_ko: '대전',
    name_en: 'Daejeon',
    region: '충청',
    citySize: 'large',
    coverImage: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21',
    description: '대한민국의 중심, 과학과 교육의 도시로 조용하고 살기 좋은 곳입니다.',

    overallRating: 4.3,
    reviewCount: 98,

    monthlyCost: 1550000,
    roomRent: 520000,

    cafeCount: 289,
    coworkingCount: 15,
    avgInternetSpeed: 298,

    currentWeather: {
      temperature: 3,
      feelsLike: 0,
      condition: '맑음',
      icon: 'sun'
    },

    airQuality: {
      aqi: 38,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['조용한', '교통편리', '대중교통편리', '저렴', '과학도시'],

    latitude: 36.3504,
    longitude: 127.3845
  },

  {
    id: 'chuncheon-001',
    name_ko: '춘천',
    name_en: 'Chuncheon',
    region: '강원',
    citySize: 'medium',
    coverImage: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437',
    description: '아름다운 호수와 자연에 둘러싸인 평화로운 도시입니다.',

    overallRating: 4.2,
    reviewCount: 84,

    monthlyCost: 1280000,
    roomRent: 400000,

    cafeCount: 156,
    coworkingCount: 4,
    avgInternetSpeed: 215,

    currentWeather: {
      temperature: 0,
      feelsLike: -3,
      condition: '맑음',
      icon: 'sun'
    },

    airQuality: {
      aqi: 20,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['자연친화적', '호수', '조용한', '저렴', '힐링'],

    latitude: 37.8813,
    longitude: 127.7300
  },

  {
    id: 'gyeongju-001',
    name_ko: '경주',
    name_en: 'Gyeongju',
    region: '경상',
    citySize: 'small',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
    description: '천년 고도의 역사와 문화가 살아 숨 쉬는 아름다운 도시입니다.',

    overallRating: 4.1,
    reviewCount: 72,

    monthlyCost: 1180000,
    roomRent: 380000,

    cafeCount: 123,
    coworkingCount: 3,
    avgInternetSpeed: 205,

    currentWeather: {
      temperature: 6,
      feelsLike: 4,
      condition: '구름조금',
      icon: 'cloud-sun'
    },

    airQuality: {
      aqi: 33,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['역사문화', '조용한', '저렴', '관광명소', '전통'],

    latitude: 35.8562,
    longitude: 129.2247
  },

  {
    id: 'yeosu-001',
    name_ko: '여수',
    name_en: 'Yeosu',
    region: '전라',
    citySize: 'medium',
    coverImage: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981',
    description: '아름다운 남해바다와 섬들이 어우러진 낭만적인 항구도시입니다.',

    overallRating: 4.4,
    reviewCount: 113,

    monthlyCost: 1620000,
    roomRent: 550000,

    cafeCount: 198,
    coworkingCount: 7,
    avgInternetSpeed: 238,

    currentWeather: {
      temperature: 9,
      feelsLike: 7,
      condition: '흐림',
      icon: 'cloud'
    },

    airQuality: {
      aqi: 28,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['바다', '관광명소', '온화한날씨', '낭만적', '항구도시'],

    latitude: 34.7604,
    longitude: 127.6622
  },

  {
    id: 'sokcho-001',
    name_ko: '속초',
    name_en: 'Sokcho',
    region: '강원',
    citySize: 'small',
    coverImage: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97',
    description: '설악산과 동해바다가 만나는 자연의 보고, 신선한 해산물의 도시입니다.',

    overallRating: 4.3,
    reviewCount: 95,

    monthlyCost: 1480000,
    roomRent: 490000,

    cafeCount: 145,
    coworkingCount: 5,
    avgInternetSpeed: 220,

    currentWeather: {
      temperature: 1,
      feelsLike: -2,
      condition: '맑음',
      icon: 'sun'
    },

    airQuality: {
      aqi: 16,
      level: 'good',
      color: '#4CAF50'
    },

    tags: ['자연친화적', '바다', '산', '조용한', '해산물'],

    latitude: 38.2070,
    longitude: 128.5918
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
export const regions = ['수도권', '강원', '충청', '전라', '경상', '제주'];
