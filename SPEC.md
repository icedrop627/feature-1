# K-NOMAD 프로젝트 사양서 및 단계별 실행 계획

## 프로젝트 개요

K-NOMAD는 한국에서 디지털 노마드로 생활하기 좋은 도시를 찾고 평가할 수 있는 웹 애플리케이션입니다. 사용자는 다양한 필터를 통해 자신에게 맞는 도시를 찾고, 좋아요/싫어요로 평가할 수 있습니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: TailwindCSS
- **UI 컴포넌트**: Radix UI + shadcn/ui
- **인증**: Supabase Auth
- **상태 관리**: React useState (로컬 상태)
- **데이터**: Mock Data (가짜 데이터 사용, 데이터베이스 미사용)

## 주요 기능 요구사항

### 핵심 기능
- [ ] 도시 리스트 표시 (좋아요 순 정렬)
- [ ] 좋아요/싫어요 시스템
- [ ] 다중 필터 시스템 (예산, 지역, 환경, 최고 계절)
- [ ] 검색 기능 (도시명 기반)
- [ ] 정렬 기능 (좋아요순, 생활비 낮은순/높은순)
- [ ] 이메일 기반 인증 (Supabase)
- [ ] 다크 모드 및 다양한 테마

### 제거된 기능
- [ ] ~~별점 평가 시스템~~
- [ ] ~~도시 상세 페이지~~
- [ ] ~~리뷰 작성 기능~~
- [ ] ~~날씨 정보~~
- [ ] ~~공기질 정보~~

## 데이터 구조

### City 타입
```typescript
interface City {
  id: string;
  name_ko: string;              // 한글 이름
  name_en: string;              // 영문 이름
  description: string;          // 도시 설명
  coverImage: string;           // 대표 이미지 URL
  monthlyCost: number;          // 월 평균 생활비 (원)

  likes: number;                // 좋아요 수
  dislikes: number;             // 싫어요 수

  budget: '100만원 이하' | '100~200만원' | '200만원 이상';
  region: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도';
  environment: ('자연친화' | '도심선호' | '카페작업' | '코워킹 필수')[];
  bestSeason: ('봄' | '여름' | '가을' | '겨울')[];
}
```

### FilterState 타입
```typescript
interface FilterState {
  searchQuery: string;
  budget: '전체' | '100만원 이하' | '100~200만원' | '200만원 이상';
  regions: string[];
  environment: string[];
  bestSeason: string[];
}
```

### SortOption 타입
```typescript
type SortOption = 'likes' | 'cost_low' | 'cost_high';
```

## 필터 사양

### 예산 필터 (라디오 버튼)
- [ ] 전체
- [ ] 100만원 이하
- [ ] 100~200만원
- [ ] 200만원 이상

### 지역 필터 (체크박스)
- [ ] 수도권
- [ ] 경상도
- [ ] 전라도
- [ ] 강원도
- [ ] 제주도
- [ ] 충청도

### 환경 필터 (체크박스)
- [ ] 자연친화
- [ ] 도심선호
- [ ] 카페작업
- [ ] 코워킹 필수

### 최고 계절 필터 (체크박스)
- [ ] 봄
- [ ] 여름
- [ ] 가을
- [ ] 겨울

## 도시 데이터 사양 (10개 도시)

### 서울 (seoul-001)
- [ ] likes: 342, dislikes: 89
- [ ] budget: '200만원 이상'
- [ ] region: '수도권'
- [ ] environment: ['도심선호', '카페작업', '코워킹 필수']
- [ ] bestSeason: ['봄', '가을']

### 부산 (busan-001)
- [ ] likes: 298, dislikes: 56
- [ ] budget: '200만원 이상'
- [ ] region: '경상도'
- [ ] environment: ['도심선호', '카페작업', '자연친화']
- [ ] bestSeason: ['여름', '가을']

### 제주 (jeju-001)
- [ ] likes: 412, dislikes: 34
- [ ] budget: '100만원 이하'
- [ ] region: '제주도'
- [ ] environment: ['자연친화', '카페작업']
- [ ] bestSeason: ['봄', '여름', '가을']

### 강릉 (gangneung-001)
- [ ] likes: 234, dislikes: 45
- [ ] budget: '100~200만원'
- [ ] region: '강원도'
- [ ] environment: ['자연친화', '카페작업']
- [ ] bestSeason: ['여름', '겨울']

### 전주 (jeonju-001)
- [ ] likes: 187, dislikes: 38
- [ ] budget: '100~200만원'
- [ ] region: '전라도'
- [ ] environment: ['도심선호', '자연친화']
- [ ] bestSeason: ['봄', '가을']

### 대전 (daejeon-001)
- [ ] likes: 156, dislikes: 52
- [ ] budget: '100~200만원'
- [ ] region: '충청도'
- [ ] environment: ['도심선호', '카페작업', '코워킹 필수']
- [ ] bestSeason: ['봄', '가을']

### 춘천 (chuncheon-001)
- [ ] likes: 203, dislikes: 29
- [ ] budget: '100만원 이하'
- [ ] region: '강원도'
- [ ] environment: ['자연친화', '카페작업']
- [ ] bestSeason: ['여름', '겨울']

### 경주 (gyeongju-001)
- [ ] likes: 178, dislikes: 41
- [ ] budget: '100만원 이하'
- [ ] region: '경상도'
- [ ] environment: ['자연친화', '도심선호']
- [ ] bestSeason: ['봄', '여름', '가을']

### 여수 (yeosu-001)
- [ ] likes: 265, dislikes: 37
- [ ] budget: '100만원 이하'
- [ ] region: '전라도'
- [ ] environment: ['자연친화', '도심선호']
- [ ] bestSeason: ['여름', '가을']

### 속초 (sokcho-001)
- [ ] likes: 219, dislikes: 43
- [ ] budget: '100만원 이하'
- [ ] region: '강원도'
- [ ] environment: ['자연친화', '카페작업']
- [ ] bestSeason: ['여름', '겨울']

---

# 단계별 실행 계획

## Phase 1: 페이지 및 컴포넌트 정리

### 오버뷰
홈페이지와 인증 페이지를 제외한 모든 페이지를 삭제하고, 별점 평가 시스템 관련 컴포넌트를 제거합니다. 프로젝트 구조를 단순화하여 좋아요/싫어요 시스템으로 전환할 준비를 합니다.

### 수정/개선 사항
- [x] **페이지 삭제**
  - [x] `app/cities/[id]/page.tsx` 삭제 (도시 상세 페이지)
  - [x] `app/cities` 폴더 전체 삭제
- [x] **컴포넌트 삭제**
  - [x] `components/common/rating-display.tsx` 삭제 (별점 표시 컴포넌트)
  - [x] `components/common/weather-badge.tsx` 삭제 (날씨 뱃지)
  - [x] `components/common/air-quality-badge.tsx` 삭제 (공기질 뱃지)
  - [x] `components/review/review-modal.tsx` 삭제 (리뷰 모달)
  - [x] `components/auth/auth-modal.tsx` 삭제 (더 이상 사용하지 않음)
- [x] **컴포넌트 폴더 정리**
  - [x] `components/common` 폴더 삭제 (내부 파일 모두 삭제됨)
  - [x] `components/review` 폴더 삭제 (내부 파일 모두 삭제됨)
  - [x] `components/auth` 폴더 삭제 (내부 파일 모두 삭제됨)

### 작업 완료 후 검증 사항
- [x] `app/cities` 폴더가 존재하지 않는지 확인
- [x] `components/common`, `components/review`, `components/auth` 폴더가 존재하지 않는지 확인
- [x] 삭제된 컴포넌트 파일이 완전히 제거되었는지 확인
- [x] 남아있는 파일 구조 확인: `app/page.tsx`, `app/login/page.tsx`, `app/register/page.tsx`, `app/layout.tsx`만 존재

---

## Phase 2: 데이터 타입 재정의

### 오버뷰
`lib/types.ts`를 새로운 요구사항에 맞게 완전히 재작성합니다. 별점 시스템을 제거하고 좋아요/싫어요 시스템을 추가하며, 새로운 필터 구조에 맞는 타입을 정의합니다.

### 수정/개선 사항
- [ ] **City 타입 재정의**
  - [ ] 제거할 필드: `overallRating`, `reviewCount`, `currentWeather`, `airQuality`, `citySize`, `cafeCount`, `coworkingCount`, `avgInternetSpeed`, `roomRent`, `tags`, `latitude`, `longitude`
  - [ ] 유지할 필드: `id`, `name_ko`, `name_en`, `description`, `coverImage`, `monthlyCost`
  - [ ] 추가할 필드:
    - [ ] `likes: number` - 좋아요 수
    - [ ] `dislikes: number` - 싫어요 수
    - [ ] `budget: '100만원 이하' | '100~200만원' | '200만원 이상'` - 예산 범위
    - [ ] `region: '수도권' | '경상도' | '전라도' | '강원도' | '제주도' | '충청도'` - 지역
    - [ ] `environment: ('자연친화' | '도심선호' | '카페작업' | '코워킹 필수')[]` - 환경 (배열)
    - [ ] `bestSeason: ('봄' | '여름' | '가을' | '겨울')[]` - 최고 계절 (배열)
- [ ] **FilterState 타입 재정의**
  - [ ] `searchQuery: string` - 검색어
  - [ ] `budget: '전체' | '100만원 이하' | '100~200만원' | '200만원 이상'` - 예산 필터
  - [ ] `regions: string[]` - 지역 필터 (복수 선택)
  - [ ] `environment: string[]` - 환경 필터 (복수 선택)
  - [ ] `bestSeason: string[]` - 최고 계절 필터 (복수 선택)
- [ ] **SortOption 타입 재정의**
  - [ ] 제거: `rating`, `popular`, `recent`, `value`, `cafe`, `air_quality`
  - [ ] 추가/유지: `likes` (좋아요순), `cost_low` (생활비 낮은순), `cost_high` (생활비 높은순)
- [ ] **불필요한 타입 제거**
  - [ ] `WeatherData` 타입 삭제
  - [ ] `AirQualityData` 타입 삭제
  - [ ] `Review` 타입 삭제

### 작업 완료 후 검증 사항
- [ ] `lib/types.ts` 파일이 에러 없이 컴파일되는지 확인
- [ ] `City` 타입에 `likes`, `dislikes`, `budget`, `region`, `environment`, `bestSeason` 필드가 정의되어 있는지 확인
- [ ] `FilterState` 타입이 새로운 필터 구조를 반영하는지 확인
- [ ] `SortOption` 타입에 `likes`, `cost_low`, `cost_high`만 정의되어 있는지 확인
- [ ] 삭제된 타입(`WeatherData`, `AirQualityData`, `Review`)이 파일에 존재하지 않는지 확인

---

## Phase 3: 가짜 데이터 재구성

### 오버뷰
`lib/mock-data/cities.ts` 파일의 모든 도시 데이터를 새로운 타입 정의에 맞게 완전히 재작성합니다. 각 도시마다 예산, 지역, 환경, 최고 계절 정보를 추가하고, 좋아요/싫어요 초기값을 설정합니다.

### 수정/개선 사항
- [ ] **기존 10개 도시 데이터 수정**
  - [ ] 각 도시에서 제거할 필드: `overallRating`, `reviewCount`, `currentWeather`, `airQuality`, `citySize`, `cafeCount`, `coworkingCount`, `avgInternetSpeed`, `roomRent`, `tags`, `latitude`, `longitude`
  - [ ] 각 도시에 추가할 필드: `likes`, `dislikes`, `budget`, `region`, `environment`, `bestSeason`
- [ ] **서울 (seoul-001)**
  - [ ] `likes: 342`, `dislikes: 89`
  - [ ] `budget: '200만원 이상'`
  - [ ] `region: '수도권'`
  - [ ] `environment: ['도심선호', '카페작업', '코워킹 필수']`
  - [ ] `bestSeason: ['봄', '가을']`
- [ ] **부산 (busan-001)**
  - [ ] `likes: 298`, `dislikes: 56`
  - [ ] `budget: '200만원 이상'`
  - [ ] `region: '경상도'`
  - [ ] `environment: ['도심선호', '카페작업', '자연친화']`
  - [ ] `bestSeason: ['여름', '가을']`
- [ ] **제주 (jeju-001)**
  - [ ] `likes: 412`, `dislikes: 34`
  - [ ] `budget: '100만원 이하'`
  - [ ] `region: '제주도'`
  - [ ] `environment: ['자연친화', '카페작업']`
  - [ ] `bestSeason: ['봄', '여름', '가을']`
- [ ] **강릉 (gangneung-001)**
  - [ ] `likes: 234`, `dislikes: 45`
  - [ ] `budget: '100~200만원'`
  - [ ] `region: '강원도'`
  - [ ] `environment: ['자연친화', '카페작업']`
  - [ ] `bestSeason: ['여름', '겨울']`
- [ ] **전주 (jeonju-001)**
  - [ ] `likes: 187`, `dislikes: 38`
  - [ ] `budget: '100~200만원'`
  - [ ] `region: '전라도'`
  - [ ] `environment: ['도심선호', '자연친화']`
  - [ ] `bestSeason: ['봄', '가을']`
- [ ] **대전 (daejeon-001)**
  - [ ] `likes: 156`, `dislikes: 52`
  - [ ] `budget: '100~200만원'`
  - [ ] `region: '충청도'`
  - [ ] `environment: ['도심선호', '카페작업', '코워킹 필수']`
  - [ ] `bestSeason: ['봄', '가을']`
- [ ] **춘천 (chuncheon-001)**
  - [ ] `likes: 203`, `dislikes: 29`
  - [ ] `budget: '100만원 이하'`
  - [ ] `region: '강원도'`
  - [ ] `environment: ['자연친화', '카페작업']`
  - [ ] `bestSeason: ['여름', '겨울']`
- [ ] **경주 (gyeongju-001)**
  - [ ] `likes: 178`, `dislikes: 41`
  - [ ] `budget: '100만원 이하'`
  - [ ] `region: '경상도'`
  - [ ] `environment: ['자연친화', '도심선호']`
  - [ ] `bestSeason: ['봄', '여름', '가을']`
- [ ] **여수 (yeosu-001)**
  - [ ] `likes: 265`, `dislikes: 37`
  - [ ] `budget: '100만원 이하'`
  - [ ] `region: '전라도'`
  - [ ] `environment: ['자연친화', '도심선호']`
  - [ ] `bestSeason: ['여름', '가을']`
- [ ] **속초 (sokcho-001)**
  - [ ] `likes: 219`, `dislikes: 43`
  - [ ] `budget: '100만원 이하'`
  - [ ] `region: '강원도'`
  - [ ] `environment: ['자연친화', '카페작업']`
  - [ ] `bestSeason: ['여름', '겨울']`

### 작업 완료 후 검증 사항
- [ ] 모든 도시 데이터가 새로운 `City` 타입에 맞게 작성되었는지 확인
- [ ] TypeScript 컴파일 에러가 없는지 확인
- [ ] 각 도시마다 `budget`, `region`, `environment` (최소 1개), `bestSeason` (최소 1개) 값이 설정되어 있는지 확인
- [ ] `likes`와 `dislikes` 값이 모두 양수인지 확인
- [ ] 각 지역(수도권, 경상도, 전라도, 강원도, 제주도, 충청도)에 최소 1개 이상의 도시가 있는지 확인
- [ ] 각 예산 범위에 최소 2개 이상의 도시가 있는지 확인
- [ ] 각 환경에 해당하는 도시가 최소 3개 이상 있는지 확인

---

## Phase 4: 필터 사이드바 완전 재구성

### 오버뷰
`components/home/filter-sidebar.tsx`를 새로운 필터 구조에 맞게 완전히 재작성합니다. 검색, 예산, 지역, 환경, 최고 계절 필터를 구현하고, 필터 상태를 부모 컴포넌트로 전달합니다.

### 수정/개선 사항
- [ ] **상태 관리 재구성**
  - [ ] `searchQuery` (검색어)
  - [ ] `budget` (예산 필터 - 라디오 버튼용)
  - [ ] `selectedRegions` (지역 필터 - 체크박스 배열)
  - [ ] `selectedEnvironment` (환경 필터 - 체크박스 배열)
  - [ ] `selectedSeasons` (최고 계절 필터 - 체크박스 배열)
- [ ] **검색 필터** (기존 유지)
  - [ ] 도시명 검색 입력 필드
- [ ] **예산 필터 (라디오 버튼)**
  - [ ] 전체
  - [ ] 100만원 이하
  - [ ] 100~200만원
  - [ ] 200만원 이상
- [ ] **지역 필터 (체크박스)**
  - [ ] 수도권
  - [ ] 경상도
  - [ ] 전라도
  - [ ] 강원도
  - [ ] 제주도
  - [ ] 충청도
- [ ] **환경 필터 (체크박스)**
  - [ ] 자연친화
  - [ ] 도심선호
  - [ ] 카페작업
  - [ ] 코워킹 필수
- [ ] **최고 계절 필터 (체크박스)**
  - [ ] 봄
  - [ ] 여름
  - [ ] 가을
  - [ ] 겨울
- [ ] **필터 초기화 버튼**
  - [ ] 모든 필터를 초기 상태로 리셋
- [ ] **적용하기 버튼**
  - [ ] 현재 활성화된 필터 개수 표시
  - [ ] 클릭 시 `onFilterChange` 콜백 호출
- [ ] **`onFilterChange` prop 구현**
  - [ ] 필터 상태를 부모 컴포넌트로 전달
  - [ ] 타입: `(filters: FilterState) => void`
- [ ] **데스크톱/모바일 반응형 유지**
  - [ ] 데스크톱: 좌측 사이드바
  - [ ] 모바일: Sheet (우측 하단 플로팅 버튼)

### 작업 완료 후 검증 사항
- [ ] 필터 사이드바가 에러 없이 렌더링되는지 확인
- [ ] 모든 필터 옵션이 정확하게 표시되는지 확인
- [ ] 예산 필터에서 하나의 옵션만 선택 가능한지 확인 (라디오 버튼)
- [ ] 지역, 환경, 최고 계절 필터에서 여러 옵션 선택 가능한지 확인 (체크박스)
- [ ] 필터 초기화 버튼 클릭 시 모든 필터가 초기화되는지 확인
- [ ] 활성화된 필터 개수가 정확하게 계산되는지 확인
- [ ] `onFilterChange` 콜백이 올바른 필터 상태를 전달하는지 확인
- [ ] 데스크톱에서 사이드바가 고정되어 표시되는지 확인
- [ ] 모바일에서 플로팅 버튼과 Sheet가 정상 작동하는지 확인

---

## Phase 5: 도시 카드 컴포넌트 완전 재구성

### 오버뷰
`components/home/city-card.tsx`를 새로운 데이터 구조에 맞게 완전히 재작성합니다. 별점 대신 좋아요/싫어요 버튼을 구현하고, 필터 정보(예산, 지역, 환경, 최고 계절)를 Key-Value 형태로 표시합니다.

### 수정/개선 사항
- [ ] **제거할 요소**
  - [ ] 별점 표시 (`RatingDisplay`)
  - [ ] 날씨/공기질 뱃지
  - [ ] 상세 통계 그리드 (월 생활비, 원룸, 카페, 인터넷)
  - [ ] 태그 표시
  - [ ] "상세보기" 버튼
  - [ ] "평가하기" 버튼
- [ ] **좋아요/싫어요 버튼 구현**
  - [ ] 상태 관리: `useState` 사용
    - [ ] `liked: boolean` - 좋아요 클릭 여부
    - [ ] `disliked: boolean` - 싫어요 클릭 여부
    - [ ] `likeCount: number` - 현재 좋아요 수 (초기값: `city.likes`)
    - [ ] `dislikeCount: number` - 현재 싫어요 수 (초기값: `city.dislikes`)
  - [ ] 좋아요 버튼
    - [ ] 아이콘: ThumbsUp (lucide-react)
    - [ ] 클릭 시: 좋아요 상태 토글
      - [ ] 좋아요 활성화: `liked = true`, `likeCount + 1`, 아이콘 색상 빨간색
      - [ ] 좋아요 비활성화: `liked = false`, `likeCount - 1`, 아이콘 색상 회색
      - [ ] 싫어요가 활성화되어 있으면 먼저 비활성화: `disliked = false`, `dislikeCount - 1`
  - [ ] 싫어요 버튼
    - [ ] 아이콘: ThumbsDown (lucide-react)
    - [ ] 클릭 시: 싫어요 상태 토글
      - [ ] 싫어요 활성화: `disliked = true`, `dislikeCount + 1`, 아이콘 색상 파란색
      - [ ] 싫어요 비활성화: `disliked = false`, `dislikeCount - 1`, 아이콘 색상 회색
      - [ ] 좋아요가 활성화되어 있으면 먼저 비활성화: `liked = false`, `likeCount - 1`
  - [ ] 버튼 옆에 현재 카운트 숫자 표시
- [ ] **필터 정보 Key-Value 표시**
  - [ ] 예산: `예산: 100만원 이하`
  - [ ] 지역: `지역: 수도권`
  - [ ] 환경: `환경: 자연친화, 카페작업` (배열을 쉼표로 연결)
  - [ ] 최고 계절: `최고 계절: 봄, 가을` (배열을 쉼표로 연결)
  - [ ] 스타일: 작은 텍스트, 아이콘과 함께 표시
- [ ] **카드 레이아웃**
  - [ ] 상단: 도시 커버 이미지
  - [ ] 중단: 도시명, 영문명, 설명 (간략하게)
  - [ ] 하단: 필터 정보 (Key-Value)
  - [ ] 최하단: 좋아요/싫어요 버튼

### 작업 완료 후 검증 사항
- [ ] 도시 카드가 에러 없이 렌더링되는지 확인
- [ ] 좋아요 버튼 클릭 시:
  - [ ] `likeCount`가 1 증가하는지 확인
  - [ ] 아이콘 색상이 빨간색으로 변경되는지 확인
  - [ ] 다시 클릭 시 `likeCount`가 1 감소하고 색상이 회색으로 돌아오는지 확인
- [ ] 싫어요 버튼 클릭 시:
  - [ ] `dislikeCount`가 1 증가하는지 확인
  - [ ] 아이콘 색상이 파란색으로 변경되는지 확인
  - [ ] 다시 클릭 시 `dislikeCount`가 1 감소하고 색상이 회색으로 돌아오는지 확인
- [ ] 좋아요 활성화 후 싫어요 클릭 시:
  - [ ] 좋아요가 자동으로 비활성화되는지 확인
  - [ ] `likeCount`가 1 감소하고 `dislikeCount`가 1 증가하는지 확인
- [ ] 필터 정보가 올바르게 표시되는지 확인:
  - [ ] 예산이 정확하게 표시되는지 확인
  - [ ] 지역이 정확하게 표시되는지 확인
  - [ ] 환경 배열이 쉼표로 구분되어 표시되는지 확인
  - [ ] 최고 계절 배열이 쉼표로 구분되어 표시되는지 확인
- [ ] "상세보기" 버튼이 제거되었는지 확인
- [ ] "평가하기" 버튼이 제거되었는지 확인
- [ ] 카드 호버 효과가 정상 작동하는지 확인

---

## Phase 6: 도시 그리드 및 필터 로직 구현

### 오버뷰
`components/home/city-grid.tsx`를 수정하여 새로운 필터 시스템과 연동합니다. 제목을 "도시 리스트"로 변경하고, 기본 정렬을 좋아요 순으로 설정하며, 모든 필터 로직을 구현합니다.

### 수정/개선 사항
- [ ] **제목 변경**
  - [ ] "도시 둘러보기" → "도시 리스트"
- [ ] **Props 수정**
  - [ ] `cities: City[]` 유지
  - [ ] `filters: FilterState` 추가 (부모로부터 전달받음)
- [ ] **필터 로직 구현**
  - [ ] 검색어 필터: 도시명(`name_ko`, `name_en`)에 검색어 포함 여부 확인
  - [ ] 예산 필터: `filters.budget`이 '전체'가 아니면 `city.budget`과 일치하는지 확인
  - [ ] 지역 필터: `filters.regions` 배열이 비어있지 않으면, `city.region`이 배열에 포함되는지 확인
  - [ ] 환경 필터: `filters.environment` 배열이 비어있지 않으면, `city.environment` 배열과 교집합이 있는지 확인
  - [ ] 최고 계절 필터: `filters.bestSeason` 배열이 비어있지 않으면, `city.bestSeason` 배열과 교집합이 있는지 확인
  - [ ] 모든 필터는 AND 조건으로 적용
- [ ] **정렬 옵션 수정**
  - [ ] 기존 정렬 옵션 제거: `rating`, `popular`, `value`, `recent`, `cafe`, `air_quality`
  - [ ] 유지/추가:
    - [ ] `likes` (좋아요순) - 기본값
    - [ ] `cost_low` (생활비 낮은순)
    - [ ] `cost_high` (생활비 높은순)
- [ ] **기본 정렬 설정**
  - [ ] `sortBy` 초기값을 `'likes'`로 설정
  - [ ] 좋아요 많은 순으로 정렬
- [ ] **검색 기능**
  - [ ] 검색 입력 필드 유지 (필터 상태와 별도로 관리 또는 통합)
- [ ] **정렬 드롭다운**
  - [ ] 좋아요순, 생활비 낮은순, 생활비 높은순만 표시

### 작업 완료 후 검증 사항
- [ ] 제목이 "도시 리스트"로 변경되었는지 확인
- [ ] 기본적으로 모든 도시가 좋아요 많은 순으로 정렬되는지 확인
- [ ] 검색어 입력 시 도시명으로 필터링되는지 확인
- [ ] 예산 필터 적용 시:
  - [ ] '전체' 선택 시 모든 도시 표시
  - [ ] 특정 예산 선택 시 해당 예산 범위의 도시만 표시
- [ ] 지역 필터 적용 시:
  - [ ] 선택된 지역의 도시만 표시
  - [ ] 여러 지역 선택 시 OR 조건으로 필터링 (선택된 지역 중 하나라도 포함)
- [ ] 환경 필터 적용 시:
  - [ ] 선택된 환경을 하나라도 포함하는 도시만 표시
  - [ ] 여러 환경 선택 시 OR 조건으로 필터링
- [ ] 최고 계절 필터 적용 시:
  - [ ] 선택된 계절을 하나라도 포함하는 도시만 표시
  - [ ] 여러 계절 선택 시 OR 조건으로 필터링
- [ ] 여러 필터 동시 적용 시 AND 조건으로 필터링되는지 확인
- [ ] 정렬 드롭다운에 좋아요순, 생활비 낮은순, 생활비 높은순만 표시되는지 확인
- [ ] 각 정렬 옵션이 정상 작동하는지 확인
- [ ] 필터링된 도시 개수가 정확하게 표시되는지 확인
- [ ] 필터 결과가 없을 때 "검색 결과가 없습니다" 메시지가 표시되는지 확인

---

## Phase 7: 네비게이션 정리

### 오버뷰
`components/layout/navigation.tsx`에서 홈페이지와 인증 관련 버튼을 제외한 모든 페이지 링크를 제거합니다. 로고, 테마 토글, 인증 버튼만 남깁니다.

### 수정/개선 사항
- [ ] **네비게이션 메뉴 항목 제거**
  - [ ] "도시" 링크 제거
  - [ ] "커뮤니티" 링크 제거
  - [ ] "가이드" 링크 제거
  - [ ] `navItems` 배열을 빈 배열로 설정 또는 완전히 제거
- [ ] **유지할 요소**
  - [ ] 로고 (K-NOMAD 또는 프로젝트명) - 홈페이지(`/`)로 링크
  - [ ] 테마 토글 버튼
  - [ ] 인증 관련 버튼:
    - [ ] 로그인 버튼 (비로그인 시)
    - [ ] 회원가입 버튼 (비로그인 시)
    - [ ] 사용자 이메일 표시 (로그인 시)
    - [ ] 로그아웃 버튼 (로그인 시)
- [ ] **데스크톱 네비게이션 레이아웃**
  - [ ] 좌측: 로고
  - [ ] 우측: 테마 토글 + 인증 버튼
- [ ] **모바일 네비게이션 레이아웃**
  - [ ] Sheet 내부에서 불필요한 메뉴 항목 제거
  - [ ] 테마 토글 + 인증 버튼만 표시

### 작업 완료 후 검증 사항
- [ ] 네비게이션에 "도시", "커뮤니티", "가이드" 링크가 제거되었는지 확인
- [ ] 로고가 표시되고 클릭 시 홈페이지로 이동하는지 확인
- [ ] 테마 토글 버튼이 정상 작동하는지 확인
- [ ] 비로그인 상태에서 로그인/회원가입 버튼이 표시되는지 확인
- [ ] 로그인 상태에서 사용자 이메일과 로그아웃 버튼이 표시되는지 확인
- [ ] 데스크톱과 모바일 모두에서 불필요한 링크가 제거되었는지 확인
- [ ] 모바일 Sheet에서 메뉴가 정상 작동하는지 확인

---

## Phase 8: 홈페이지 통합 및 상태 관리

### 오버뷰
`app/page.tsx`에서 필터 사이드바와 도시 그리드를 연동합니다. 필터 상태를 관리하고, 필터 변경 시 도시 리스트가 실시간으로 업데이트되도록 구현합니다.

### 수정/개선 사항
- [ ] **필터 상태 관리**
  - [ ] `useState`로 `FilterState` 관리
  - [ ] 초기값:
    - [ ] `searchQuery: ''`
    - [ ] `budget: '전체'`
    - [ ] `regions: []`
    - [ ] `environment: []`
    - [ ] `bestSeason: []`
- [ ] **FilterSidebar 연동**
  - [ ] `onFilterChange` prop으로 필터 상태 업데이트 함수 전달
  - [ ] 필터 변경 시 상태 업데이트
- [ ] **CityGrid 연동**
  - [ ] `cities` prop으로 `mockCities` 전달
  - [ ] `filters` prop으로 현재 필터 상태 전달
- [ ] **히어로 섹션 유지**
  - [ ] 기존 `HeroSection` 컴포넌트 유지
  - [ ] `totalCities`와 `totalReviews` 제거 또는 수정 (리뷰 시스템 제거됨)
  - [ ] 통계를 좋아요/싫어요 기반으로 변경 (선택 사항)
- [ ] **레이아웃 구조**
  - [ ] 히어로 섹션
  - [ ] 필터 사이드바 + 도시 그리드 (Flex 레이아웃)

### 작업 완료 후 검증 사항
- [ ] 홈페이지가 에러 없이 렌더링되는지 확인
- [ ] 필터 사이드바에서 필터 변경 시 도시 리스트가 실시간으로 업데이트되는지 확인
- [ ] 검색어 입력 시 도시 리스트가 즉시 필터링되는지 확인
- [ ] 여러 필터를 조합했을 때 올바른 결과가 표시되는지 확인
- [ ] 히어로 섹션이 정상 표시되는지 확인
- [ ] 필터와 도시 그리드가 나란히 배치되는지 확인 (데스크톱)
- [ ] 모바일에서 필터가 Sheet로 열리고 도시 그리드가 전체 너비를 차지하는지 확인

---

## Phase 9: 최종 정리 및 전체 테스트

### 오버뷰
프로젝트 전체를 검토하고, 사용하지 않는 import 문을 정리하며, TypeScript 에러를 해결합니다. 모든 기능을 종합적으로 테스트하여 요구사항이 완벽하게 구현되었는지 확인합니다.

### 수정/개선 사항
- [ ] **Import 문 정리**
  - [ ] 삭제된 컴포넌트 import 제거 (`RatingDisplay`, `WeatherBadge`, `AirQualityBadge`, `ReviewModal`, `AuthModal`)
  - [ ] 사용하지 않는 타입 import 제거 (`WeatherData`, `AirQualityData`, `Review`)
- [ ] **TypeScript 컴파일 확인**
  - [ ] `npm run build` 실행하여 빌드 에러 확인
  - [ ] 모든 TypeScript 에러 해결
- [ ] **개발 서버 실행**
  - [ ] `npm run dev` 실행
  - [ ] 브라우저 콘솔 에러 확인 및 해결
- [ ] **코드 품질 검토**
  - [ ] ESLint 경고 확인 및 해결
  - [ ] 불필요한 코드 제거
  - [ ] 코드 포맷팅 정리

### 작업 완료 후 검증 사항
- [ ] **빌드 확인**
  - [ ] `npm run build`가 에러 없이 성공하는지 확인
  - [ ] TypeScript 컴파일 에러가 없는지 확인
- [ ] **개발 서버 확인**
  - [ ] `npm run dev`가 정상 실행되는지 확인
  - [ ] 브라우저 콘솔에 에러가 없는지 확인
- [ ] **기능 검증**
  - [ ] 홈페이지 로드 확인
  - [ ] 도시 리스트가 기본적으로 좋아요 많은 순으로 정렬되는지 확인
  - [ ] 각 필터(검색, 예산, 지역, 환경, 최고 계절) 정상 작동 확인
  - [ ] 좋아요/싫어요 버튼 정상 작동 확인
  - [ ] 도시 카드에 필터 정보(예산, 지역, 환경, 최고 계절) 표시 확인
  - [ ] 정렬 옵션(좋아요순, 생활비 낮은순, 생활비 높은순) 정상 작동 확인
  - [ ] 네비게이션에 불필요한 링크가 제거되었는지 확인
  - [ ] 인증 기능(로그인, 회원가입, 로그아웃) 정상 작동 확인
- [ ] **반응형 확인**
  - [ ] 데스크톱 레이아웃 확인 (1920px, 1440px, 1024px)
  - [ ] 태블릿 레이아웃 확인 (768px)
  - [ ] 모바일 레이아웃 확인 (375px, 414px)
  - [ ] 필터 사이드바가 모바일에서 Sheet로 열리는지 확인
  - [ ] 도시 그리드가 화면 크기에 맞게 반응하는지 확인
- [ ] **UI/UX 확인**
  - [ ] 라이트 모드 정상 표시 확인
  - [ ] 다크 모드 정상 표시 확인
  - [ ] 모든 테마(minimal, neon-cyber, nature, luxury) 정상 작동 확인
  - [ ] 버튼 호버 효과 확인
  - [ ] 카드 호버 효과 확인
  - [ ] 로딩 상태 없이 즉시 렌더링되는지 확인
- [ ] **최종 검토**
  - [ ] 모든 요구사항이 구현되었는지 체크
  - [ ] 불필요한 파일이 완전히 삭제되었는지 확인
  - [ ] 코드 가독성 확인
  - [ ] 주석 필요 여부 검토

---

## 개선 완료 후 프로젝트 구조

```
k-nomad/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (홈페이지)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── filter-sidebar.tsx
│   │   ├── city-grid.tsx
│   │   └── city-card.tsx
│   ├── layout/
│   │   ├── navigation.tsx
│   │   ├── footer.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── ui/ (shadcn/ui 컴포넌트들)
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   ├── mock-data/
│   │   └── cities.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── themes/
│       └── theme-config.ts
├── middleware.ts
├── package.json
└── SPEC.md (이 파일)
```

---

## 구현 우선순위

1. **Phase 1**: 페이지 및 컴포넌트 정리 (의존성 제거)
2. **Phase 2**: 데이터 타입 재정의 (기반 작업)
3. **Phase 3**: 가짜 데이터 재구성 (데이터 준비)
4. **Phase 5**: 도시 카드 컴포넌트 완전 재구성 (UI 작업)
5. **Phase 4**: 필터 사이드바 완전 재구성 (UI 작업)
6. **Phase 6**: 도시 그리드 및 필터 로직 구현 (로직 연동)
7. **Phase 7**: 네비게이션 정리 (레이아웃 작업)
8. **Phase 8**: 홈페이지 통합 및 상태 관리 (전체 통합)
9. **Phase 9**: 최종 정리 및 전체 테스트 (품질 보증)

---

## 참고사항

- 모든 Phase는 독립적으로 실행 가능하며, 각 Phase 완료 후 커밋 권장
- 각 Phase의 검증 사항을 반드시 확인한 후 다음 단계로 진행
- TypeScript 컴파일 에러는 즉시 해결
- 가짜 데이터 사용으로 백엔드 구현 불필요
- Supabase Auth는 이미 구현되어 있으므로 유지
