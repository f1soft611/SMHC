# SMHC

SMHC 프론트엔드 작업용 저장소입니다. 현재는 React + TypeScript + Vite 기반의 화면 구현과 데모 흐름이 중심이며, HACCP 문서 관리와 운영 모니터링 화면이 포함되어 있습니다.

## 포함 범위

- 대시보드 및 운영 모니터링 화면
- 로그인 및 권한 기반 라우팅
- HACCP 문서 템플릿 목록/편집 화면
- 문서 이력 조회 화면
- 시스템 사용자 관리 화면

## 기술 스택

- React 19
- TypeScript
- Vite
- MUI
- TanStack Query
- Zustand
- Axios

## 프로젝트 구조

- `frontend/`: 프론트엔드 애플리케이션
- `문서/`: 화면 설계 및 와이어프레임 문서

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

## 주요 스크립트

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API 설정

- 기본 API 경로는 `/api` 입니다.
- 필요 시 `VITE_API_BASE_URL` 환경변수로 백엔드 주소를 지정할 수 있습니다.

## 참고 사항

- 프론트 API 호출은 `frontend/src/util/axios.ts`의 `apiClient`를 사용합니다.
- Vercel 배포 시 SPA 라우팅 처리는 `frontend/vercel.json` 기준으로 설정되어 있습니다.
