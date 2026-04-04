# Note2Quiz Frontend

학습 노트를 입력하면 AI가 퀴즈를 자동으로 생성하고, 생성된 퀴즈를 풀 수 있는 React 기반 웹 프론트엔드입니다.

---

## 기술 스택

### dependencies (런타임)

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| UI 프레임워크 | react | ^19.2.4 | 컴포넌트 기반 UI 구성 |
| UI 프레임워크 | react-dom | ^19.2.4 | React DOM 렌더링 |
| 라우팅 | react-router-dom | ^7.13.2 | 클라이언트 사이드 라우팅 |
| HTTP 클라이언트 | axios | ^1.14.0 | 백엔드 API 호출 |
| 아이콘 | @phosphor-icons/react | ^2.1.10 | 아이콘 컴포넌트 |
| CSS 유틸리티 | @tailwindcss/typography | ^0.5.19 | Markdown prose 스타일 |
| 알림 | react-hot-toast | ^2.6.0 | 토스트 알림 UI |
| Markdown | react-markdown | ^10.1.0 | Markdown 콘텐츠 렌더링 |

### devDependencies (개발 도구)

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| 빌드 도구 | vite | ^8.0.1 | 개발 서버 및 번들러 |
| Vite 플러그인 | @vitejs/plugin-react | ^6.0.1 | React Fast Refresh, JSX 지원 |
| CSS 빌드 | tailwindcss | ^4.2.2 | 유틸리티 기반 CSS 프레임워크 |
| CSS 빌드 | @tailwindcss/vite | ^4.2.2 | Tailwind CSS Vite 플러그인 |
| 린터 | eslint | ^9.39.4 | 코드 품질 검사 |
| 린터 | @eslint/js | ^9.39.4 | ESLint JS 룰셋 |
| 린터 | eslint-plugin-react-hooks | ^7.0.1 | React Hooks 린트 룰 |
| 린터 | eslint-plugin-react-refresh | ^0.5.2 | React Refresh 린트 룰 |
| 린터 | globals | ^17.4.0 | ESLint 전역 변수 설정 |
| 포매터 | prettier | ^3.8.1 | 코드 자동 포매팅 |
| 타입 힌트 | @types/react | ^19.2.14 | React 타입 정의 (IDE 지원) |
| 타입 힌트 | @types/react-dom | ^19.2.3 | ReactDOM 타입 정의 (IDE 지원) |

---

## 프로젝트 구조

```
src/
├── App.jsx                  # 라우터 설정 및 전역 Provider 구성
├── main.jsx                 # 애플리케이션 진입점
├── api/                     # 백엔드 API 호출 모듈
│   ├── client.js            # axios 인스턴스 (baseURL, 인증 쿠키 설정)
│   ├── authApi.js           # 인증 관련 API (회원가입·로그인·로그아웃·내 정보)
│   ├── noteApi.js           # 노트 관련 API (목록·상세·삭제)
│   └── quizApi.js           # 퀴즈 세트 관련 API (생성·목록·상세)
├── contexts/                # React Context를 이용한 전역 상태 관리
│   └── AuthContext.jsx      # 로그인 유저 상태·로그인·로그아웃 함수 제공
├── pages/                   # 라우트별 페이지 컴포넌트
│   ├── SignInPage.jsx        # 로그인 페이지
│   ├── SignUpPage.jsx        # 회원가입 페이지
│   ├── NotesPage.jsx         # 노트 목록 페이지
│   ├── NoteDetailPage.jsx    # 노트 상세 페이지 (Markdown 렌더링)
│   ├── NoteCreatePage.jsx    # 노트 입력 및 AI 퀴즈 생성 페이지
│   ├── QuizzesPage.jsx       # 퀴즈 세트 목록 페이지
│   ├── QuizPlayPage.jsx      # 퀴즈 풀기 페이지 (힌트·노트 패널 포함)
│   └── QuizResultPage.jsx    # 퀴즈 채점 결과 페이지
├── components/              # 재사용 가능한 공통 컴포넌트
│   ├── Layout.jsx            # 사이드바 + 페이지 콘텐츠 영역 레이아웃
│   ├── Sidebar.jsx           # 좌측 네비게이션 바 (메뉴·유저 정보·로그아웃)
│   ├── PageHeader.jsx        # 페이지 상단 공통 헤더 (제목·슬롯)
│   ├── ProtectedRoute.jsx    # 로그인 필수 라우트 가드
│   └── GuestRoute.jsx        # 비로그인 전용 라우트 가드
└── design/                  # 개발 전 작성한 페이지별 와이어프레임 HTML 시안
```

---

## 페이지 구성

| 페이지 | Route | 설명 | Auth |
|--------|-------|------|------|
| SignInPage | `/signin` | 이메일·비밀번호 로그인 폼. 성공 시 `/notes`로 이동. 로그인 상태면 `/notes`로 리다이렉트 | 비로그인 전용 |
| SignUpPage | `/signup` | 닉네임·이메일·비밀번호 회원가입 폼. 완료 후 `/signin`으로 이동 | 비로그인 전용 |
| NotesPage | `/notes` | 내 노트 목록을 카드 그리드로 표시. 제목 검색·선택 삭제 기능 제공 | 로그인 필요 |
| NoteCreatePage | `/notes/new` | 학습 노트 텍스트(최대 10,000자)를 입력하고 AI 퀴즈 생성 요청. 생성 완료 후 퀴즈 풀기 페이지로 이동 | 로그인 필요 |
| NoteDetailPage | `/notes/:noteId` | 노트 내용을 Markdown으로 렌더링하여 표시. 퀴즈 풀러가기 버튼 및 노트 삭제 기능 제공 | 로그인 필요 |
| QuizzesPage | `/quizzes` | 생성된 퀴즈 세트 목록을 카드 그리드로 표시. 제목 검색 기능 제공 | 로그인 필요 |
| QuizPlayPage | `/quizzes/:quizSetId` | 퀴즈 풀기 화면. 객관식 선택·힌트(Tip) 토글·학습 노트 슬라이딩 패널 지원. 전체 채점 버튼 제공 | 로그인 필요 |
| QuizResultPage | `/quizzes/:quizSetId/result` | 채점 결과 요약(정답률·원형 그래프)과 문제별 상세 결과(해설 포함) 표시. 다시 풀기 가능 | 로그인 필요 |

> `/` 접근 시 `/notes`로, 정의되지 않은 경로 접근 시 `/notes`로 리다이렉트됩니다.

---

## 주요 컴포넌트

### `Layout`
- 전체 화면을 `Sidebar` + 콘텐츠 영역(`<Outlet />`)으로 분할하는 레이아웃 래퍼.
- 로그인이 필요한 모든 페이지는 이 레이아웃을 공유합니다.

### `Sidebar`
- 좌측 260px 고정 네비게이션 바.
- 메뉴: **Create** (`/notes/new`), **Notes** (`/notes`), **Quizzes** (`/quizzes`)
- 하단에 현재 로그인 유저의 닉네임(첫 글자 아바타)과 로그아웃 버튼을 표시.
- `useAuth()`를 통해 유저 정보와 로그아웃 함수를 사용.

### `PageHeader`
- 페이지 상단에 고정되는 공통 헤더 (높이 80px).
- `title` (페이지 제목), `leftSlot` (뒤로가기 등 좌측 영역), `rightSlot` (버튼·검색창 등 우측 영역) props를 통해 각 페이지가 자유롭게 커스터마이징.

### `ProtectedRoute`
- `useAuth()`로 인증 상태를 확인하여, 비로그인 사용자를 `/signin`으로 리다이렉트.
- `loading` 상태 중에는 아무것도 렌더링하지 않음(`null` 반환).

### `GuestRoute`
- `useAuth()`로 인증 상태를 확인하여, 이미 로그인된 사용자를 `/notes`로 리다이렉트.
- 로그인·회원가입 페이지에 적용.

---

## 상태 관리

### `AuthContext` (`src/contexts/AuthContext.jsx`)

전역 인증 상태를 관리하며, `AuthProvider`로 앱 전체를 감싸서 사용합니다.

**관리 상태**

| 상태 | 타입 | 설명 |
|------|------|------|
| `user` | `{ nickname: string } \| null` | 로그인된 유저 정보. 비로그인 시 `null` |
| `loading` | `boolean` | 초기 인증 상태 확인(`/api/auth/me`) 진행 중 여부 |

**제공 값 / 함수**

| 이름 | 타입 | 설명 |
|------|------|------|
| `user` | object \| null | 현재 로그인 유저 (nickname 포함) |
| `loading` | boolean | 인증 상태 초기화 중 여부 |
| `login(credentials)` | async function | 로그인 API 호출 후 `user` 상태 및 `localStorage`의 nickname 갱신 |
| `logout()` | async function | 로그아웃 API 호출 후 `user` 상태 및 `localStorage`의 nickname 초기화 |

**동작 방식**
- 앱 최초 마운트 시 `GET /api/auth/me`를 호출하여 서버에 유효한 쿠키가 있으면 자동 로그인 상태 복원.
- 로그인 성공 시 닉네임을 `localStorage`에 저장 (새로고침 간 flicker 방지 용도).
- 인증 쿠키(`accessToken`)는 서버가 HttpOnly 쿠키로 관리하며, 클라이언트 JS에서는 직접 접근하지 않습니다.

**커스텀 훅**
```js
const { user, loading, login, logout } = useAuth();
```
`AuthProvider` 외부에서 호출 시 에러가 발생합니다.

---

## API 연동 구조

### `src/api/client.js` — axios 인스턴스

```js
const client = axios.create({
  baseURL: '/api',       // Vite 프록시를 통해 http://localhost:8080/api 로 전달
  withCredentials: true, // HttpOnly 쿠키(accessToken) 자동 전송
  headers: { 'Content-Type': 'application/json' },
});
```

- **baseURL**: 절대경로를 사용하지 않고 `/api`로 설정합니다. Vite 개발 서버가 `/api/*` 요청을 `http://localhost:8080`으로 프록시합니다.
- **withCredentials**: 쿠키 기반 인증을 위해 모든 요청에 자격증명(쿠키)을 포함합니다. 별도의 Authorization 헤더 처리 없이 브라우저 쿠키가 자동으로 첨부됩니다.
- **응답 인터셉터**: 에러를 그대로 reject하는 패스스루 인터셉터가 등록되어 있으며, 각 호출부에서 직접 에러를 처리합니다.

### `src/api/authApi.js`

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `signup(data)` | POST | `/auth/signup` | 회원가입 |
| `login(data)` | POST | `/auth/login` | 로그인 (서버가 쿠키 발급) |
| `logout()` | POST | `/auth/logout` | 로그아웃 (서버가 쿠키 삭제) |
| `authMe()` | GET | `/auth/me` | 현재 인증 유저 정보 조회 |

### `src/api/noteApi.js`

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `getNotes()` | GET | `/notes` | 내 노트 목록 조회 |
| `getNote(noteId)` | GET | `/notes/:noteId` | 노트 상세 조회 |
| `deleteNote(noteId)` | DELETE | `/notes/:noteId` | 노트 삭제 |

### `src/api/quizApi.js`

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `createQuizSet(content)` | POST | `/quiz-sets` | 노트 내용으로 AI 퀴즈 생성 |
| `getQuizSets()` | GET | `/quiz-sets` | 내 퀴즈 세트 목록 조회 |
| `getQuizSet(quizSetId)` | GET | `/quiz-sets/:quizSetId` | 퀴즈 세트 상세 조회 |

### Vite 개발 서버 프록시 설정

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
},
```

개발 환경에서 브라우저의 CORS 제한 없이 `/api/*` 요청이 백엔드(`localhost:8080`)로 전달됩니다.

---

## 환경변수 설정

별도로 정의된 `.env` 파일이 없습니다. 백엔드 연결 주소는 `vite.config.js`의 프록시 설정(`target: 'http://localhost:8080'`)으로 관리합니다.

백엔드 주소를 변경해야 하는 경우 `vite.config.js`의 `proxy.target` 값을 수정하세요.

---

## 로컬 단독 실행 방법

### 의존성 설치

```bash
cd apps/frontend
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 기타 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 (HMR 포함, 포트 5173) |
| `npm run build` | 프로덕션 번들 빌드 (`dist/` 출력) |
| `npm run preview` | 빌드 결과물 미리보기 서버 실행 |
| `npm run lint` | ESLint 코드 품질 검사 |
| `npm run format` | Prettier 코드 자동 포매팅 (`src/**/*.{js,jsx,json,css}`) |
| `npm run format:check` | Prettier 포매팅 규칙 준수 여부 확인 |

### 백엔드 없이 실행 시 주의사항

> ⚠️ 프론트엔드는 **백엔드(`localhost:8080`) 없이는 정상 동작하지 않습니다.**

- 모든 API 요청(`/api/*`)은 Vite 프록시를 통해 `localhost:8080`으로 전달됩니다.
- 백엔드가 실행되지 않은 상태에서는 로그인·노트 조회·퀴즈 생성 등 모든 기능이 실패합니다.
- 로컬 실행 전 반드시 [백엔드 README](../backend/README.md)를 참고하여 백엔드를 먼저 기동하세요.
