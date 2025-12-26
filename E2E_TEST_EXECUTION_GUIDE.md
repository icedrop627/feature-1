# E2E 테스트 실행 및 결과 확인 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [테스트 실행 방법](#테스트-실행-방법)
3. [결과 확인 방법](#결과-확인-방법)
4. [디버깅 방법](#디버깅-방법)
5. [CI/CD 통합](#cicd-통합)

---

## 사전 준비

### 1. 시스템 의존성 설치 (최초 1회만)

```bash
# 방법 1: 스크립트 실행
bash /tmp/install-playwright-deps.sh

# 방법 2: 수동 설치
sudo apt-get update
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
  libxrandr2 libgbm1 libasound2 libpango-1.0-0 libcairo2 libatspi2.0-0

# 방법 3: Playwright 자동 설치
npx playwright install-deps chromium
```

### 2. 설치 확인

```bash
# Chromium이 정상적으로 실행되는지 확인
npx playwright --version
```

---

## 테스트 실행 방법

### 기본 실행 방법

```bash
# 1. 프로젝트 디렉토리로 이동
cd /home/icedrop/k-nomad

# 2. 모든 E2E 테스트 실행
npx playwright test

# 3. 특정 테스트 파일만 실행
npx playwright test e2e/tests/home/homepage-basic.spec.ts

# 4. 특정 테스트 케이스만 실행
npx playwright test -g "홈페이지로 이동하면 로고가 표시되어야 함"
```

### 다양한 실행 옵션

#### 1. **헤드풀 모드** (브라우저 화면 보면서 실행)
```bash
npx playwright test --headed

# 실행 속도를 느리게 하여 관찰
npx playwright test --headed --slow-mo=1000
```

#### 2. **디버그 모드**
```bash
# 디버거와 함께 실행
npx playwright test --debug

# 특정 테스트만 디버그
npx playwright test e2e/tests/home/homepage-basic.spec.ts --debug
```

#### 3. **UI 모드** (가장 추천!)
```bash
npx playwright test --ui
```
- 브라우저에서 테스트를 시각적으로 확인
- 각 단계별로 실행 가능
- 타임라인, 네트워크, 콘솔 로그 확인 가능

#### 4. **특정 브라우저에서만 실행**
```bash
# Chromium만
npx playwright test --project=chromium

# Firefox도 테스트하려면 (playwright.config.ts에서 활성화 필요)
npx playwright test --project=firefox
```

#### 5. **병렬 실행 제어**
```bash
# 워커 수 지정 (기본값: CPU 코어 수)
npx playwright test --workers=1  # 순차 실행
npx playwright test --workers=4  # 4개 동시 실행
```

#### 6. **실패한 테스트만 재실행**
```bash
npx playwright test --last-failed
```

---

## 결과 확인 방법

### 1. 터미널 출력

테스트를 실행하면 터미널에 실시간으로 결과가 표시됩니다:

```bash
npx playwright test --reporter=list
```

**출력 예시:**
```
Running 5 tests using 5 workers

  ✓  [chromium] › homepage-basic.spec.ts:11 › 홈페이지로 이동하면 로고가 표시되어야 함 (2.3s)
  ✓  [chromium] › homepage-basic.spec.ts:22 › 홈페이지로 이동하면 도시 카드들이 표시되어야 함 (1.8s)
  ✓  [chromium] › homepage-basic.spec.ts:34 › 홈페이지에 처음 접속하면 필터가 적용되지 않아야 함 (1.5s)
  ✓  [chromium] › homepage-basic.spec.ts:47 › 필터가 적용되지 않으면 데이터베이스의 모든 도시가 표시되어야 함 (2.1s)
  ✓  [chromium] › homepage-basic.spec.ts:72 › 홈페이지의 모든 주요 요소가 함께 표시되어야 함 (1.9s)

  5 passed (9.6s)
```

### 2. HTML 리포트

테스트 실행 후 자동으로 HTML 리포트가 생성됩니다.

```bash
# 리포트 열기
npx playwright show-report

# 또는 직접 파일 열기
open playwright-report/index.html  # macOS
xdg-open playwright-report/index.html  # Linux
```

**HTML 리포트에서 확인 가능한 정보:**
- ✅ 통과/실패한 테스트 목록
- ⏱️ 각 테스트의 실행 시간
- 📸 실패 시 스크린샷
- 🎥 실패 시 비디오 녹화
- 📊 각 단계별 실행 내역
- 🌐 네트워크 요청 로그
- 📝 콘솔 로그

### 3. JSON 리포트

프로그래매틱하게 결과를 분석하려면:

```bash
# 테스트 실행 후 JSON 파일 확인
cat test-results/results.json | jq '.suites[0].specs[0].tests[0]'
```

### 4. JUnit XML 리포트

CI/CD 시스템과 통합하려면:

```bash
cat test-results/junit.xml
```

### 5. 실패한 테스트의 상세 정보

테스트가 실패하면 자동으로 다음 정보가 저장됩니다:

```
test-results/
├── homepage-basic-spec-ts-홈페이지로-이동하면-로고가-표시되어야-함-chromium/
│   ├── test-failed-1.png          # 실패 시점의 스크린샷
│   ├── video.webm                 # 전체 테스트 비디오
│   └── trace.zip                  # Playwright Trace (가장 상세한 정보)
```

**Trace 파일 보기:**
```bash
npx playwright show-trace test-results/[테스트명]/trace.zip
```

---

## 디버깅 방법

### 1. 브라우저 개발자 도구 사용

```bash
# 테스트 중 개발자 도구 열기
PWDEBUG=1 npx playwright test
```

### 2. 스크린샷 추가

테스트 코드에 스크린샷을 추가하여 디버깅:

```typescript
// 테스트 파일 내부
await page.screenshot({ path: 'debug-screenshot.png' });
```

### 3. 콘솔 로그 확인

```typescript
// 브라우저 콘솔 메시지 캡처
page.on('console', msg => console.log('Browser log:', msg.text()));
```

### 4. 네트워크 요청 모니터링

```typescript
// 네트워크 요청 확인
page.on('request', request => console.log('>>', request.method(), request.url()));
page.on('response', response => console.log('<<', response.status(), response.url()));
```

### 5. 일시 정지

```typescript
// 특정 지점에서 테스트 일시 정지
await page.pause();
```

---

## 실전 예시

### 예시 1: 기본 실행 및 결과 확인

```bash
# 1단계: 테스트 실행
cd /home/icedrop/k-nomad
npx playwright test e2e/tests/home/homepage-basic.spec.ts

# 2단계: 결과 확인
# - 터미널에서 통과/실패 확인
# - 실패 시 에러 메시지 읽기

# 3단계: HTML 리포트 열기
npx playwright show-report
```

### 예시 2: 실패한 테스트 디버깅

```bash
# 1단계: 디버그 모드로 실행
npx playwright test e2e/tests/home/homepage-basic.spec.ts --debug

# 2단계: 브라우저가 열리면:
# - 각 단계를 하나씩 실행
# - 요소 선택자가 올바른지 확인
# - 콘솔에서 에러 메시지 확인

# 3단계: Trace 파일 확인
npx playwright show-trace test-results/[실패한-테스트]/trace.zip
```

### 예시 3: UI 모드로 편하게 테스트

```bash
# UI 모드 실행
npx playwright test --ui

# UI에서:
# 1. 왼쪽에서 테스트 선택
# 2. "Run" 버튼 클릭
# 3. 오른쪽에서 실시간으로 브라우저 화면 확인
# 4. 타임라인에서 각 액션 클릭하여 상세 정보 확인
# 5. 네트워크, 콘솔 탭에서 추가 정보 확인
```

---

## 추천 워크플로우

### 개발 중

```bash
# UI 모드로 실행하여 실시간 확인
npx playwright test --ui
```

### PR 전 확인

```bash
# 모든 테스트를 헤드리스로 실행
npx playwright test

# 결과 확인
npx playwright show-report
```

### 실패 시 디버깅

```bash
# 1. 디버그 모드로 재실행
npx playwright test --debug --grep "실패한 테스트 이름"

# 2. 또는 헤드풀 모드로 천천히 관찰
npx playwright test --headed --slow-mo=1000 --grep "실패한 테스트 이름"

# 3. Trace 파일 확인
npx playwright show-trace test-results/[실패한-테스트]/trace.zip
```

---

## package.json 스크립트 추가

편의를 위해 다음 스크립트를 추가하는 것을 권장합니다:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:home": "playwright test e2e/tests/home"
  }
}
```

사용 예시:
```bash
npm run test:e2e           # 모든 테스트 실행
npm run test:e2e:ui        # UI 모드
npm run test:e2e:report    # 리포트 보기
```

---

## CI/CD 통합

### GitHub Actions 예시

`.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 트러블슈팅

### 문제 1: "Target page, context or browser has been closed"
**해결책:** 시스템 의존성 설치
```bash
npx playwright install-deps chromium
```

### 문제 2: 테스트가 타임아웃됨
**해결책:** `playwright.config.ts`에서 타임아웃 증가
```typescript
timeout: 60 * 1000, // 60초
```

### 문제 3: Dev 서버가 시작되지 않음
**해결책:** 수동으로 서버 실행 후 테스트
```bash
# 터미널 1
npm run dev

# 터미널 2
BASE_URL=http://localhost:3000 npx playwright test
```

### 문제 4: 선택자를 찾지 못함
**해결책:** UI 모드로 실행하여 실제 DOM 구조 확인
```bash
npx playwright test --ui
```

---

## 요약: 가장 빠른 시작 방법

```bash
# 1. 의존성 설치 (최초 1회)
bash /tmp/install-playwright-deps.sh

# 2. UI 모드로 테스트 실행 및 확인
cd /home/icedrop/k-nomad
npx playwright test --ui

# 3. 또는 터미널에서 실행 후 리포트 확인
npx playwright test
npx playwright show-report
```

---

**생성일**: 2024-12-26
**작성자**: Claude Code
**관련 파일**:
- 테스트: `/home/icedrop/k-nomad/e2e/tests/home/homepage-basic.spec.ts`
- 설정: `/home/icedrop/k-nomad/playwright.config.ts`
