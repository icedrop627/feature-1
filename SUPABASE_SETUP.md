# Supabase 백엔드 설정 가이드

이 문서는 K-Nomad 프로젝트에 Supabase 백엔드를 설정하는 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 만듭니다
2. 새 프로젝트를 생성합니다
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다
4. 프로젝트가 생성될 때까지 기다립니다 (약 2분)

## 2. 환경 변수 설정

프로젝트 설정에서 API 키를 가져옵니다:

1. Supabase 대시보드에서 Settings > API로 이동
2. `Project URL`과 `anon public` 키를 복사
3. `.env.local` 파일을 업데이트:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. 데이터베이스 마이그레이션 실행

`supabase/migrations` 폴더의 모든 SQL 파일을 Supabase SQL 에디터에서 순서대로 실행합니다:

### 방법 1: Supabase Dashboard UI 사용

1. Supabase 대시보드에서 SQL Editor로 이동
2. 다음 순서로 각 마이그레이션 파일의 내용을 복사하여 실행:
   - `20231201000001_create_cities_table.sql`
   - `20231201000002_create_profiles_table.sql`
   - `20231201000003_create_reviews_table.sql`
   - `20231201000004_create_city_reactions_table.sql`
   - `20231201000005_enable_rls_policies.sql`
   - `20231201000006_create_profile_trigger.sql`
   - `20231201000007_seed_cities_data.sql`

### 방법 2: Supabase CLI 사용 (권장)

```bash
# Supabase CLI 설치 (한 번만)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 4. Storage 버킷 생성

프로필 아바타 이미지를 위한 Storage 버킷을 생성합니다:

1. Supabase 대시보드에서 Storage로 이동
2. "Create a new bucket" 클릭
3. 버킷 이름: `avatars`
4. Public bucket으로 설정
5. 생성 완료

참고: 마이그레이션 파일에 버킷 생성 코드가 포함되어 있지만, UI에서 확인하는 것이 좋습니다.

## 5. 인증 설정 (선택사항)

### 이메일 인증 설정

1. Authentication > Settings로 이동
2. Email Auth 섹션에서:
   - "Enable email confirmations" 활성화/비활성화 선택
   - 개발 중에는 비활성화를 권장합니다

### OAuth 제공자 추가 (선택사항)

1. Authentication > Providers로 이동
2. Google, GitHub 등 원하는 OAuth 제공자 활성화
3. 각 제공자의 Client ID와 Secret 설정

## 6. 데이터베이스 구조

### 테이블

- **cities**: 도시 정보 저장
- **profiles**: 사용자 프로필 정보 (auth.users와 연결)
- **reviews**: 도시 리뷰
- **city_reactions**: 도시 좋아요/싫어요

### Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다:

- **cities**: 모든 사용자 읽기 가능, 인증된 사용자만 수정 가능
- **profiles**: 모든 사용자 읽기 가능, 본인만 수정 가능
- **reviews**: 모든 사용자 읽기 가능, 본인만 수정/삭제 가능
- **city_reactions**: 모든 사용자 읽기 가능, 본인만 수정/삭제 가능

### 트리거

- **handle_new_user()**: 회원가입 시 자동으로 프로필 생성
- **handle_updated_at()**: 레코드 업데이트 시 `updated_at` 자동 갱신
- **update_city_reaction_counts()**: 좋아요/싫어요 변경 시 카운트 자동 업데이트

## 7. 테스트

### 회원가입 테스트

1. 개발 서버 실행: `npm run dev`
2. http://localhost:3000/register 접속
3. 이메일과 비밀번호로 회원가입
4. Supabase Dashboard > Authentication > Users에서 사용자 확인
5. Database > profiles 테이블에서 프로필 자동 생성 확인

### 도시 데이터 확인

1. http://localhost:3000 접속
2. 10개의 시드 데이터 도시가 표시되는지 확인
3. 필터 기능 테스트 (예산, 지역, 환경, 계절)
4. 정렬 기능 테스트 (좋아요순, 생활비순)

### 좋아요/싫어요 테스트

1. 로그인 상태에서 도시 카드의 좋아요/싫어요 버튼 클릭
2. Supabase Dashboard > Database > city_reactions에서 레코드 확인
3. cities 테이블의 likes/dislikes 카운트 자동 업데이트 확인

## 8. 문제 해결

### 마이그레이션 실패

- SQL Editor에서 에러 메시지를 확인하세요
- 각 마이그레이션을 순서대로 실행했는지 확인하세요
- 이미 실행된 마이그레이션이 있다면 `DROP TABLE IF EXISTS` 추가를 고려하세요

### 인증 문제

- `.env.local` 파일의 환경 변수가 올바른지 확인하세요
- 브라우저의 쿠키와 로컬 스토리지를 삭제하고 다시 시도하세요
- Supabase Dashboard > Authentication > Settings에서 이메일 확인이 비활성화되어 있는지 확인하세요

### RLS 정책 문제

- Supabase Dashboard > Authentication > Policies에서 정책을 확인하세요
- SQL Editor에서 직접 데이터에 접근할 때는 RLS가 적용되지 않습니다
- 애플리케이션에서 접근할 때만 RLS가 적용됩니다

## 9. 다음 단계

백엔드 연동이 완료되었습니다! 이제 다음 기능들을 구현할 수 있습니다:

- [ ] 프로필 페이지 (이슈 #1-5)
- [ ] 도시 상세 페이지
- [ ] 리뷰 작성 및 조회 기능
- [ ] 실시간 좋아요/싫어요 업데이트 (Supabase Realtime)
- [ ] 도시 검색 자동완성
- [ ] 이미지 업로드 및 최적화
- [ ] 페이지네이션

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
