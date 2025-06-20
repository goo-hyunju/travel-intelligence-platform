# 실시간 여행 인텔리전스 플랫폼

## 1. 개요

웹 크롤링과 AI 추출 기술을 활용하여 **우리만의 고유한 여행 데이터셋을 구축**하고, 이를 기반으로 사용자에게 최적의 여행지를 추천하는 실시간 분석 플랫폼입니다.

단순히 외부 API에 의존하는 것을 넘어, 웹상의 흩어져 있는 정보(항공권, 숙소, 현지 정보, 후기 등)를 수집하고 AI로 가공하여, 신뢰성 높고 컨텍스트가 풍부한 우리만의 데이터 자산을 만들어 나갑니다.

## 2. 기술 스택

-   **프론트엔드:** Next.js (React), TypeScript, Apollo Client
-   **백엔드:** NestJS (Node.js, TypeScript), GraphQL, Apollo Server
-   **데이터베이스:** PostgreSQL
-   **ORM:** Prisma
-   **데이터 수집 (자체 데이터셋 구축):**
    -   **Crawling Engine:** Cheerio, Scrapy, Selenium/Playwright (정적/동적 웹 페이지 정보 수집)
    -   **AI Extraction Engine:** Gemini API (수집된 데이터에서 구조화된 정보 추출)
    -   **External APIs:** OpenWeatherMap, 공공데이터포털 (보조 데이터 수집)
-   **배포:** Vercel (프론트엔드), AWS Elastic Beanstalk (백엔드)
-   **CI/CD:** GitHub Actions

## 3. 프로젝트 구조

이 프로젝트는 `npm` 워크스페이스를 사용하는 모노레포로 구성되어 있습니다.

-   `packages/api`: NestJS로 구현된 백엔드 API 서버입니다.
    -   `scraper`: 웹 크롤링 로직을 담당합니다.
    -   `weather`: 날씨 정보 처리 로직을 담당합니다.
    -   `country-info`: 국가 기본정보 처리 로직을 담당합니다.
-   `packages/web`: Next.js로 구현된 프론트엔드 웹 애플리케이션입니다.
-   `prisma`: 데이터베이스 스키마와 마이그레이션 파일을 관리합니다.

## 4. 시작하기

### 4.1. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다.

```bash
npm install
```

### 4.2. 환경 변수 설정

프로젝트 루트 폴더에 `.env` 파일을 생성하고, 아래 내용을 기반으로 자신의 환경에 맞게 수정합니다.

```env
# .env

# 1. PostgreSQL 데이터베이스 연결 정보
# 사용자 PC에 설치된 PostgreSQL 정보로 수정해야 합니다.
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# 2. OpenWeatherMap API 키 (날씨 정보)
# OpenWeatherMap 가입 후 발급받은 키를 입력하세요.
OPENWEATHERMAP_API_KEY="YOUR_OPENWEATHERMAP_API_KEY"

# 3. 공공데이터포털 API 키 (국가 기본 정보)
# 공공데이터포털에서 발급받은 일반 인증키(Decoding)를 입력하세요.
GO_DATA_API_KEY="YOUR_GO_DATA_API_KEY"
```

### 4.3. 데이터베이스 마이그레이션 및 초기 데이터 생성

다음 명령어를 실행하여 Prisma 스키마를 데이터베이스에 적용하고, 프로젝트 실행에 필요한 최소한의 초기 샘플 데이터를 생성합니다.

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
