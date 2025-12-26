# E2E 테스트 설정 가이드

## 시스템 의존성 문제 해결

Playwright를 실행하기 위해서는 시스템 레벨의 의존성이 필요합니다. 현재 WSL 환경에서 다음의 라이브러리가 누락되어 있습니다:

- `libnspr4.so`
- `libnss3.so`
- `libnssutil3.so`
- `libsmime3.so`
- `libasound.so.2`

### 해결 방법

#### 방법 1: 시스템 의존성 설치 (권장)

```bash
# Ubuntu/Debian 기반 시스템
sudo apt-get update
sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2

# 또는 Playwright 자동 설치 사용
npx playwright install-deps chromium
```

#### 방법 2: Docker 사용

```bash
# Dockerfile 예시
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
```

#### 방법 3: CI 환경에서 실행

GitHub Actions나 다른 CI 환경에서는 시스템 의존성이 이미 설치되어 있습니다.

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## 생성된 테스트

### 파일 위치
`/home/icedrop/k-nomad/e2e/tests/home/homepage-basic.spec.ts`

### 테스트 케이스

1. **홈페이지로 이동하면 로고가 표시되어야 함**
   - 사용자가 http://localhost:3000 접속
   - 로고가 화면에 표시되는지 확인

2. **홈페이지로 이동하면 도시 카드들이 표시되어야 함**
   - 사용자가 홈페이지 접속
   - 최소 1개 이상의 도시 카드 표시 확인

3. **홈페이지에 처음 접속하면 필터가 적용되지 않아야 함**
   - 사용자가 홈페이지에 처음 접속
   - 활성화된 필터 카운트가 0인지 확인

4. **필터가 적용되지 않으면 데이터베이스의 모든 도시가 표시되어야 함**
   - 사용자가 홈페이지 접속
   - 필터가 적용되지 않은 상태에서 모든 도시 표시 확인
   - 첫 번째 도시 카드가 실제로 보이는지 확인

5. **홈페이지의 모든 주요 요소가 함께 표시되어야 함**
   - 로고, 필터 사이드바, 도시 그리드가 모두 표시되는지 통합 확인

## 테스트 실행 방법

의존성 설치 후 다음 명령어로 테스트를 실행할 수 있습니다:

```bash
# 모든 E2E 테스트 실행
npx playwright test

# 특정 테스트 파일만 실행
npx playwright test e2e/tests/home/homepage-basic.spec.ts

# UI 모드로 실행 (디버깅에 유용)
npx playwright test --ui

# 헤드풀 모드로 실행 (브라우저 화면 표시)
npx playwright test --headed

# 리포트 보기
npx playwright show-report
```

## 트러블슈팅

### "Target page, context or browser has been closed" 에러

이 에러는 브라우저가 시작되지 못했을 때 발생합니다. 시스템 의존성이 설치되어 있는지 확인하세요.

### 테스트가 타임아웃되는 경우

`playwright.config.ts`에서 타임아웃 설정을 늘릴 수 있습니다:

```typescript
export default defineConfig({
  timeout: 60 * 1000, // 60초
  expect: {
    timeout: 10000, // 10초
  },
});
```

### Dev 서버가 시작되지 않는 경우

Playwright는 자동으로 dev 서버를 시작하도록 설정되어 있습니다 (`webServer` 설정).
만약 수동으로 서버를 실행하고 싶다면:

```bash
# 터미널 1
npm run dev

# 터미널 2
npx playwright test
```

## 다음 단계

시스템 의존성을 설치한 후:

1. 테스트 실행: `npx playwright test e2e/tests/home/homepage-basic.spec.ts`
2. 실패하는 테스트 확인
3. Page Object나 테스트 로직 수정
4. 모든 테스트가 통과할 때까지 반복

---

**생성일**: 2024-12-26
**작성자**: Claude Code
