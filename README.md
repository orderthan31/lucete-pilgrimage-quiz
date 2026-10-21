# 2026 루체테 성지순례

영통영덕성당 루체테 · 남양성모성지. 진행자가 큰 화면으로 보여 주며 함께 푸는 React/TypeScript/Vite 퀴즈입니다. 성인 퀴즈와 성당 상식 퀴즈 각 20문항, 객관식 5지선다·OX·단답형을 제공합니다. 로그인, 참가자 입력, 자동 채점, 점수·순위·팀 관리는 없습니다.

## 실행과 검증

Node.js 24.14.1 이상 24.x를 사용합니다.

```sh
npm ci
npm run validate:content
npm run typecheck
npm test
npm run build
npm run dev
```

개발 서버는 `0.0.0.0:5176`에 바인딩하며 다른 포트로 자동 전환하지 않습니다. 외부 노출 개발 서버이므로 신뢰할 수 있는 환경에서만 실행하세요. 프로젝트 밖 파일 접근은 제한됩니다. 빌드는 `dist/`에 생성됩니다. 이 저장소의 서비스/커밋/푸시는 운영 담당자가 관리합니다.

다른 Unix 계정으로 실행할 때 `TMPDIR`도 해당 계정이 쓸 수 있는 디렉터리여야 합니다. 이 호스트에서 검증은 `hg121500` 사용자, 지정된 Node PATH와 `TMPDIR=/home/hg121500/.cache/lucete-test-tmp`로 수행합니다. root 소유의 임시 디렉터리를 상속하면 Vitest의 변환 캐시 생성이 거부될 수 있습니다.

## 진행 방법

- 첫 화면에서 퀴즈 종류 선택 → 즉시 1번 문제. 중간 준비/시작 화면은 없습니다. 모든 화면은 하나의 PPT/Flash 퀴즈형 stage로 이어집니다. 웹사이트 헤더·GNB·푸터·별도 마케팅 섹션은 없습니다. 문제 형식·시간·참여 방법을 반복 설명하는 안내 문구는 표시하지 않습니다.
- 프로젝터 1280×720 / 1920×1080은 한 화면에 하나의 장면이 들어갑니다. 긴 해설·출처는 필요할 때 해설 영역 안에서 스크롤할 수 있고, 모바일은 세로 장면에서 필요한 만큼 페이지 스크롤을 허용합니다.
- 보기는 누르는 버튼이 아닙니다. **정답 공개**로만 정답·허용 답안·해설을 표시합니다.
- 단답형에는 입력 칸이 없습니다. 말이나 종이로 답하고 진행자가 판단합니다.
- 한 문제 약 1분은 진행 참고일 뿐입니다. 자동 타이머·자동 전환은 없습니다.
- 정답 공개 뒤 **다음 문제**, 20번 뒤 **종료**. 완료 화면에서 다른 카테고리로 이동할 수 있습니다.
- 퀴즈 종류를 누르면 저장 위치와 관계없이 바로 1번 문제를 엽니다. 중간 시작 버튼, 이어가기·처음부터 선택, 별도 다시 시작/초기화 확인창은 없습니다. 종료 후 **다른 퀴즈**도 다른 종류의 1번 문제를 바로 엽니다. 예전 `/quiz/:category` 주소는 첫 문제의 정식 주소로 history replace합니다.
- 중간부터 진행하거나 1번으로 돌아갈 때는 **문제 목록**에서 번호를 선택합니다. 이동한 문제는 정답을 숨긴 상태로 엽니다.
- **처음으로**는 진행을 지우지 않습니다. 브라우저 뒤로/앞으로와 직접 문제 주소도 지원합니다.

| 키 | 동작 |
| --- | --- |
| Space / → | 정답 공개, 공개 상태라면 다음 문제 |
| ← | 이전 문제 (정답 숨김) |
| F | 브라우저 기본 전체 화면 전환 |

키 반복·조합키·모달이 열린 상태에서는 단축키를 무시합니다. 버튼/링크/입력 요소에 초점이 있으면 해당 요소의 기본 키 동작을 유지합니다. 전체 화면 거절/미지원 시 안내를 표시하며 성공한 것처럼 표시하지 않습니다.

## 복구와 주소

`/`, `/quiz/saints`, `/quiz/church`, `/quiz/:category/question/:stableQuestionId`, `/quiz/:category/complete`를 사용합니다. 작은 History API 라우터이며 별도 라우팅 라이브러리는 없습니다. 새로고침 시 주소의 같은 문제를 복원하되 **항상 정답은 숨깁니다**. 카테고리별 `lucete:progress:<id>` 저장값은 스키마 버전, 범위, 카테고리, 안정적인 문제 ID까지 검사합니다. 지원하지 않는 버전·손상 데이터는 무시합니다. 저장소가 차단돼도 진행은 가능하고 저장 실패를 안내합니다. 답 공개 여부는 저장하지 않습니다. URL이 가리키는 유효한 문제는 저장 위치보다 우선합니다.

## Vercel

Vite 프로젝트로 import하고 Install `npm ci`, Build `npm run build`, Output `dist`, Node 24.x를 사용하세요. `vercel.json`의 `/index.html` rewrite가 직접 중첩 주소 접속과 새로고침을 지원합니다. 배포 후 `/quiz/saints` 및 실제 문제 ID 주소에 직접 접속해 확인하세요. 실제 Vercel 배포는 이 작업 범위 밖입니다.

## 콘텐츠 편집

`src/data/quizzes.json`과 `docs/content-sources.md`가 콘텐츠 원본입니다. 카테고리는 `saints`, `church`이며 각 20문항입니다. 문제 `id`는 배포 뒤 변경하지 마세요. ID/순서가 바뀌어 저장값과 맞지 않으면 이어가기를 안전하게 무효화합니다.

문항 근거는 한국어로 확인 가능한 한국천주교주교회의·교구·수도회 자료를 우선합니다. 화면의 출처에는 기관명과 교리서 항 번호·성경 장절·전기 위치를 표시합니다. 문항별 근거와 취득 검증 기록은 `docs/content-sources.md`, `docs/content-source-audit.json`에 함께 유지하세요. 출처를 바꾸면 앱 데이터와 근거 장부도 같이 갱신해야 합니다.

- 공통: `id`, `type`, `question`, `answer`, `explanation`, `sources: [{label,url}]`, `difficulty: easy|medium|hard`.
- `multiple-choice`: 서로 다른 `choices` 정확히 5개. 0부터 시작하는 `answerIndex`가 `answer`와 일치.
- `ox`: `choices: ["O","X"]` 및 일치하는 `answerIndex`.
- `short-answer`: `acceptedAnswers`에 기본 `answer` 포함. `answerIndex` 없음.
- 두 카테고리 모두 세 형식을 포함합니다. 공개 전에는 답/해설을 DOM에 삽입하지 않지만 정적 앱 번들에는 데이터가 포함되므로 비밀 시험 시스템은 아닙니다.

`npm run validate:content`는 실제 파일 존재와 전체 40문항 계약을 검사합니다. 개발 중 파일이 아직 없으면 UI는 준비 중으로 표시하며 가짜 문제를 주입하지 않습니다. 테스트 전용 데이터는 `src/test-fixture.ts`에 분리되어 프로덕션에서 import하지 않습니다.

## 한결디자인 Silver — 정확한 통합 범위

`@orderthan31/hangyeol-core@0.0.1`의 공개 배포와 바이트가 일치하는 로컬 archive를 **개발 의존성**으로 고정 설치했습니다. React 런타임에서 패키지를 import하지 않습니다. archive SHA256:

`7fa6d23b23a80df864a6021bef5c6a2bb190392851a828cc570788a1f22d87e4`

실제 설치 CLI `--version`은 0.0.1, `inspect`는 `integrity: verified`였습니다. `init --dry-run`과 `add theme button --dry-run`은 현재 `npm run typecheck && vite build` 호스트 스크립트에 대해 `Unsupported Vite host script`로 거부했습니다. 호스트 버전이나 스크립트를 억지로 바꾸지 않았고 지원되는 전체 source-install이라고 주장하지 않습니다.

현재 적용은 **canonical-token-only**입니다. `npm run theme:sync`가 설치 패키지 `foundation/theme.css`의 실제 `@layer base` 블록을 그대로 복사하고 Tailwind 전용 `@theme` 등록만 생략합니다. 원본 SHA256 `c05f2de9c8f44026cd87bd3f9f336e29d281e93ddc205ac7edee6ed15e544e7f` 및 폰트 해시는 `src/theme/provenance.json`에 기록합니다. 영상 위 가독성을 위해 실제 HTML 루트에 `data-hangyeol data-palette="Silver" data-theme="dark"`를 적용합니다. UI는 canonical `--g-*` 변수를 사용합니다. Pretendard 400/500/600/700 실제 woff2와 원래 SIL OFL LICENSE/provenance는 `public/fonts/hangyeol/`에 포함합니다. 외부 Google Fonts 요청은 없습니다. 패키지 원본은 UNLICENSED이므로 패키지 설치가 일반 재배포 권리를 부여하지 않으며 별도의 프로젝트 라이선스를 선언하지 않습니다.

## CI 및 미디어

- 첫 장면은 `/brand/lucete-profile.png`의 사용자 제공 스크린샷 CI 크롭을 사용합니다. 원본 마스터/벡터라는 주장은 하지 않습니다. 출처는 `docs/brand-assets.md`에 기록합니다. `VITE_LOGO_URL`로 경로를 바꿀 수 있고 원래 색상·형태를 유지하며 recolor/filter를 적용하지 않습니다.
- 실촬영 영상 대신 실제 남양성모성지 사진을 천천히 이동·확대하고 교차 전환하는 **사진 기반 모션 영상**을 사용합니다. 성지 숲길·조경과 피사체가 잘리지 않는 구도를 우선하며 오르간 클로즈업 반복은 제외했습니다. 사진 목록·수량·파생 자산 해시는 `docs/media-sources.md` 및 공개 manifest를 기준으로 확인합니다. 드론·현장 촬영 영상으로 표시하지 않습니다. 출처와 이용 조건은 앱 도움말의 **사진 출처**에서도 확인할 수 있습니다. 원본은 네이티브 Full HD 미만이므로 1080p 출력이 원본에 없는 디테일을 복원하지는 않습니다.
- 기본 자산은 `/media/namyang-background.mp4`, 포스터는 `/media/namyang-poster.webp`입니다. 사용 허가된 대체 원본은 `VITE_HERO_VIDEO_URL`, `VITE_HERO_POSTER_URL`로 지정할 수 있습니다. `.env.local` 또는 Vercel 환경 변수로 설정하고 다시 빌드합니다.
- 배경은 첫 화면·준비·문제·정답·종료에 공통이며, 장면 전환 시 비디오 요소를 교체하거나 처음부터 재생하지 않습니다. **비디오 전체에는 딤이나 필터를 적용하지 않습니다.** 콘텐츠 컨테이너에만 Silver Dark canvas 62% 배경을 적용하여 주변 풍경은 그대로 보입니다. 밝은 프레임에서도 읽히도록 컨테이너 안의 보조 글자도 밝게 유지하고 선택지는 불투명한 표면으로 분리합니다. 메인 퀴즈 버튼은 작은 크기·어두운 중립 표면·밝은 글자로 통일합니다.
- 영상은 무음 반복과 멈춤/재생 버튼을 제공합니다. 자동 재생 거부 시 직접 재생할 수 있고, 로드 오류나 동작 줄이기 설정에는 포스터를 사용합니다. 무단 영상 다운로드/YouTube 재호스팅을 하지 않습니다.
- 원본 CI 마스터, 현장 프로젝터 가독성 및 전체 화면의 기기별 지원은 별도 확인 대상입니다.
