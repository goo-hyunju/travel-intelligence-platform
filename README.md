# 실시간 여행 인텔리전스 플랫폼

## 1. 개요

사용자가 특정 기간에 관심 있는 여러 여행지의 최신 정보를 실시간으로 비교 분석하여, 개인의 우선순위에 맞는 최적의 여행지를 선택할 수 있도록 돕는 웹/앱 플랫폼입니다.

## 2. 기술 스택

- **프론트엔드:** Next.js (React), TypeScript, Apollo Client
- **백엔드:** NestJS (Node.js, TypeScript), GraphQL, Apollo Server
- **데이터베이스:** PostgreSQL
- **ORM:** Prisma
- **데이터 수집:** API 연동 및 웹 스크레이핑 (향후 구현)
- **배포:** Vercel (프론트엔드), AWS Elastic Beanstalk (백엔드)
- **CI/CD:** GitHub Actions

## 3. 프로젝트 구조

이 프로젝트는 `npm` 워크스페이스를 사용하는 모노레포로 구성되어 있습니다.

- `packages/api`: NestJS로 구현된 백엔드 API 서버입니다.
- `packages/web`: Next.js로 구현된 프론트엔드 웹 애플리케이션입니다.
- `prisma`: 데이터베이스 스키마와 마이그레이션 파일을 관리합니다.

## 4. 시작하기

### 4.1. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다.

```bash
npm install
```

### 4.2. 환경 변수 설정

`prisma` 디렉토리에 `.env` 파일을 생성하고 데이터베이스 연결 URL을 설정합니다. **반드시 자신의 PostgreSQL 정보로 수정해야 합니다.**

```
# prisma/.env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 4.3. 데이터베이스 마이그레이션 및 초기 데이터 생성

다음 명령어를 실행하여 Prisma 스키마를 데이터베이스에 적용하고, 초기 샘플 데이터를 생성합니다.

```bash
# 데이터베이스 스키마 적용
npm run prisma:migrate

# 초기 데이터 생성 (seeding)
npm run prisma:seed
```

### 4.4. 개발 서버 실행

각 패키지의 개발 서버를 별도의 터미널에서 실행합니다.

```bash
# 백엔드 API 서버 실행 (http://localhost:3001)
npm run dev:api

# 프론트엔드 웹 서버 실행 (http://localhost:3000)
npm run dev:web
```