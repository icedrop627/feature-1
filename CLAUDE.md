# K-Nomad 프로젝트 - Claude 개발 문서

이 문서는 Claude Code를 사용하여 K-Nomad 프로젝트를 개발하는 과정에서 작성된 문서입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [테스트 전략](#테스트-전략)
- [E2E 테스트 구조](#e2e-테스트-구조)
- [개발 히스토리](#개발-히스토리)

---

## 프로젝트 개요

K-Nomad는 디지털 노마드를 위한 한국 도시 정보 플랫폼입니다.

### 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Backend**: Supabase
- **Testing**:
  - Unit/Integration: Vitest + React Testing Library
  - E2E: Playwright
- **State Management**: React Hooks

---

## 테스트 전략

### 테스트 피라미드

```
       /\
      /E2E\          ← 소수의 중요 사용자 플로우
     /------\
    /Integration\    ← 컴포넌트 간 상호작용
   /------------\
  /  Unit Tests  \   ← 다수의 세밀한 로직 테스트
 /----------------\
```

### 테스트 커버리지 목표

- **Unit Tests**: 80% 이상
- **Integration Tests**: 주요 컴포넌트 100%
- **E2E Tests**: 핵심 사용자 플로우 100%

---

## E2E 테스트 구조

### 📁 디렉토리 구조

```
e2e/
├── tests/                      # 테스트 파일들
│   ├── accessibility/          # 접근성 테스트
│   ├── auth/                   # 인증/인가 테스트
│   ├── home/                   # 홈페이지 관련 테스트
│   ├── performance/            # 성능 테스트
│   ├── user-flows/             # 사용자 플로우 테스트
│   └── visual/                 # 비주얼 회귀 테스트
│
├── page-objects/               # Page Object 패턴 구현
│   ├── pages/                  # 페이지별 클래스
│   │   ├── home.page.ts
│   │   ├── login.page.ts
│   │   └── register.page.ts
│   └── components/             # 재사용 가능한 컴포넌트
│       ├── navigation.component.ts
│       ├── filter-sidebar.component.ts
│       ├── city-grid.component.ts
│       └── city-card.component.ts
│
├── fixtures/                   # 테스트 픽스처
│   ├── test-base.ts           # 커스텀 테스트 기본 설정
│   ├── auth.ts                # 인증 관련 픽스처
│   └── database.ts            # 데이터베이스 픽스처
│
├── utils/                      # 유틸리티 함수
│   ├── helpers.ts             # 공통 헬퍼 함수
│   ├── assertions.ts          # 커스텀 assertion
│   ├── wait-for.ts            # 대기 관련 유틸
│   └── data-generators.ts     # 테스트 데이터 생성
│
├── screenshots/                # 비주얼 테스트 스크린샷
│   ├── baseline/              # 기준 이미지
│   ├── actual/                # 실제 캡처된 이미지
│   └── diff/                  # 차이점 이미지
│
└── data/                       # 테스트 데이터
```

### 🎭 Page Object 패턴

Page Object 패턴은 테스트 코드의 유지보수성을 높이고 중복을 줄이기 위한 디자인 패턴입니다.

#### 구조 설명

**1. Pages (페이지 객체)**
- 각 페이지를 클래스로 표현
- 페이지의 요소와 동작을 캡슐화
- 예시: `HomePage`, `LoginPage`, `RegisterPage`

```typescript
// e2e/page-objects/pages/home.page.ts
export class HomePage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly filterSidebar: FilterSidebarComponent;
  readonly cityGrid: CityGridComponent;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.filterSidebar = new FilterSidebarComponent(page);
    this.cityGrid = new CityGridComponent(page);
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }
}
```

**2. Components (컴포넌트 객체)**
- 재사용 가능한 UI 컴포넌트를 클래스로 표현
- 여러 페이지에서 공통으로 사용되는 컴포넌트
- 예시: `NavigationComponent`, `FilterSidebarComponent`

```typescript
// e2e/page-objects/components/navigation.component.ts
export class NavigationComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('[data-testid="logo"]');
    this.homeLink = page.locator('[href="/"]');
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
```

### 🧪 테스트 카테고리

#### 1. Accessibility Tests (접근성 테스트)
- WCAG 2.1 준수 여부 확인
- 키보드 네비게이션 테스트
- 스크린 리더 호환성 검증

```typescript
// e2e/tests/accessibility/homepage.spec.ts
test('홈페이지는 접근성 기준을 충족해야 함', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

#### 2. Auth Tests (인증 테스트)
- 로그인/로그아웃 플로우
- 회원가입 플로우
- 세션 관리 및 보안

```typescript
// e2e/tests/auth/login.spec.ts
test('사용자는 이메일과 비밀번호로 로그인할 수 있다', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/');
});
```

#### 3. Home Tests (홈페이지 테스트)
- 필터링 기능
- 도시 카드 표시
- 페이지네이션
- 정렬 기능

```typescript
// e2e/tests/home/filtering.spec.ts
test('사용자는 예산 필터를 사용할 수 있다', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.filterSidebar.selectBudget('100만원 이하');
  await homePage.cityGrid.waitForResults();
  const cities = await homePage.cityGrid.getCityCards();
  // 검증 로직
});
```

#### 4. Performance Tests (성능 테스트)
- 페이지 로드 시간
- Core Web Vitals (LCP, FID, CLS)
- 네트워크 요청 최적화

```typescript
// e2e/tests/performance/homepage.spec.ts
test('홈페이지는 3초 이내에 로드되어야 함', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
});
```

#### 5. User Flows (사용자 플로우 테스트)
- 엔드투엔드 사용자 시나리오
- 복합적인 상호작용
- 비즈니스 크리티컬 플로우

```typescript
// e2e/tests/user-flows/city-exploration.spec.ts
test('사용자는 도시를 검색하고 상세 정보를 볼 수 있다', async ({ page }) => {
  // 1. 홈페이지 접속
  // 2. 필터 적용
  // 3. 도시 카드 클릭
  // 4. 상세 페이지 확인
  // 5. 좋아요 누르기
});
```

#### 6. Visual Tests (비주얼 회귀 테스트)
- UI 변경사항 감지
- 스크린샷 비교
- 반응형 디자인 검증

```typescript
// e2e/tests/visual/homepage.spec.ts
test('홈페이지 비주얼 회귀 테스트', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### 🔧 Fixtures (픽스처)

픽스처는 테스트 환경을 설정하고 재사용 가능한 테스트 컨텍스트를 제공합니다.

#### Test Base
```typescript
// e2e/fixtures/test-base.ts
export const test = base.extend({
  // 커스텀 픽스처 정의
});
```

#### Auth Fixture
```typescript
// e2e/fixtures/auth.ts
// 인증된 사용자 세션 제공
// 테스트 사용자 자동 생성/삭제
```

#### Database Fixture
```typescript
// e2e/fixtures/database.ts
// 테스트 데이터 시딩
// 데이터베이스 초기화/정리
```

### 🛠 Utils (유틸리티)

#### Helpers
```typescript
// e2e/utils/helpers.ts
- waitForStableElement()   // 요소가 안정화될 때까지 대기
- waitForNetworkIdle()     // 네트워크 요청 완료 대기
- scrollIntoView()         // 요소를 뷰포트로 스크롤
```

#### Assertions
```typescript
// e2e/utils/assertions.ts
- assertCityCardVisible()  // 도시 카드 표시 검증
- assertFilterApplied()    // 필터 적용 검증
```

#### Wait For
```typescript
// e2e/utils/wait-for.ts
- waitForCityGrid()        // 도시 그리드 로드 대기
- waitForFilters()         // 필터 적용 완료 대기
```

#### Data Generators
```typescript
// e2e/utils/data-generators.ts
- generateTestUser()       // 테스트 사용자 데이터 생성
- generateCityData()       // 도시 데이터 생성
```

### ⚙️ Playwright 설정

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 📝 테스트 작성 가이드

#### 1. 테스트 이름 규칙
- **한글 사용**: 비즈니스 요구사항을 명확하게 표현
- **행위 기반**: "사용자는 ~할 수 있다" 형식
- **구체적**: 테스트의 목적이 명확해야 함

```typescript
// ✅ Good
test('사용자는 예산 필터를 선택하여 도시를 필터링할 수 있다', ...)

// ❌ Bad
test('filter test', ...)
```

#### 2. Page Object 사용
- 모든 선택자는 Page Object에 정의
- 테스트 파일에서 직접 선택자 사용 금지
- 재사용성과 유지보수성 향상

```typescript
// ✅ Good
await homePage.filterSidebar.selectBudget('100만원 이하');

// ❌ Bad
await page.click('button:has-text("100만원 이하")');
```

#### 3. 명시적 대기 사용
- `waitForLoadState()`, `waitFor()` 등 사용
- 하드코딩된 `setTimeout()` 사용 금지

```typescript
// ✅ Good
await page.waitForLoadState('networkidle');
await cityCard.waitFor({ state: 'visible' });

// ❌ Bad
await page.waitForTimeout(3000);
```

#### 4. 독립적인 테스트
- 각 테스트는 독립적으로 실행 가능해야 함
- 테스트 간 의존성 없음
- Before/After 훅으로 초기화/정리

```typescript
test.beforeEach(async ({ page }) => {
  // 테스트 전 초기화
});

test.afterEach(async ({ page }) => {
  // 테스트 후 정리
});
```

### 🚀 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# UI 모드로 실행 (디버깅)
npm run test:e2e:ui

# 특정 테스트 파일만 실행
npx playwright test e2e/tests/home/filtering.spec.ts

# 헤드풀 모드로 실행 (브라우저 표시)
npx playwright test --headed

# 특정 브라우저에서만 실행
npx playwright test --project=chromium
```

### 📊 테스트 리포트

```bash
# HTML 리포트 생성
npx playwright show-report

# JSON 리포트 확인
cat test-results/results.json

# JUnit XML 리포트
cat test-results/junit.xml
```

---

## 개발 히스토리

### 2024-12-26
- **FilterSidebar 개선**: 체크박스 상태 관리 및 필터 적용 로직 개선
  - useEffect를 사용한 자동 필터 적용
  - Radix UI Checkbox 올바른 사용법 적용
  - 접근성 개선 (aria-label 추가)
  - 테스트 통과율: 98.75% (237/240)

### 2024-12-24
- **E2E 테스트 구조 구축**: Playwright 설정 및 폴더 구조 완성
  - Page Object 패턴 구현
  - 테스트 카테고리별 폴더 구성
  - 유틸리티 및 픽스처 기본 구조 작성

---

## 기여 가이드

이 프로젝트는 Claude Code와 협업하여 개발되었습니다. 새로운 기능을 추가하거나 버그를 수정할 때는:

1. 적절한 테스트 작성 (Unit → Integration → E2E)
2. Page Object 패턴 준수
3. 접근성 기준 충족
4. 커밋 메시지 규칙 준수

---

**Last Updated**: 2024-12-26
**Maintained by**: Claude Code & Development Team
