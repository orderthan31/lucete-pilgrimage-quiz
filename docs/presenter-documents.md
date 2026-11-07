# 진행자 문서 내보내기

**진행자 전용 · 정답 포함 · 참가자 배포 금지.** HTML, Markdown, PDF 모두 정답과 인정 답안을 포함한다. 공개 사이트, `public/`, `dist/`, 공개 저장소나 참가자 다운로드 링크에 올리지 않는다. 앱에는 다운로드 경로나 문서 의존성을 추가하지 않는다.

## 실행

Node 24 이상에서 저장소 루트를 기준으로 실행한다. 추가 패키지 설치, 앱 빌드, 개발 서버가 필요하지 않다.

```sh
node --test scripts/presenter-documents.test.mjs
node scripts/export-presenter-documents.mjs
node scripts/export-presenter-documents.mjs --output /private/path/presenter
```

기본 출력 위치는 저장소의 `exports/presenter/`이다. 사용자 지정 상대 경로는 현재 작업 디렉터리를 기준으로 해석한다. 생성물은 커밋하지 않는다. `public/`, `dist/` 및 이 경로를 가리키는 심볼릭 링크는 거부한다. 다른 공개 서버의 문서 루트인지까지 판단할 수는 없으므로 사용자 지정 위치의 접근 권한은 별도로 관리한다.

- `saints-presenter.html`, `saints-presenter.md`: 성인 퀴즈 진행자 자료
- `church-presenter.html`, `church-presenter.md`: 성당 퀴즈 진행자 자료
- `manifest.json`: 원본 SHA-256, 문항 수 및 순서별 ID, 글꼴/내보내기 코드/힌트 도우미 해시, 각 생성물의 바이트 수와 SHA-256

현재 원본은 각 범주 20문항이다. 문항 번호와 출력 개수는 `src/data/quizzes.json`의 실제 배열 순서와 길이로 계산한다. 원문 문제, 모든 원문 보기, 선택적 힌트, 표준 정답, `acceptedAnswers`의 모든 인정 답안, 원문 해설을 보존한다. 힌트가 없으면 `힌트 없음`, 별도 인정 답안이 없으면 `별도 표기 없음`으로 표시한다. 설명은 임의로 요약하거나 수정하지 않는다. 시간 제한이나 채점 기능은 없다.

## 모바일 HTML / 인쇄

각 HTML은 로컬 `public/fonts/hangyeol/`의 Pretendard Regular/Bold WOFF2를 데이터 URL로 내장한 독립 파일이다. 원본 글꼴 라이선스도 HTML 주석에 포함한다. 외부 CSS, 자바스크립트, 네트워크 글꼴 요청이 없으므로 파일을 내려받아 오프라인으로 열 수 있다. 320px·390px 화면에서는 단일 열로 읽고, 정답과 힌트는 별도 조작 없이 표시한다. PDF도 정답이 항상 표시되는 진행자 자료이다.

인쇄 CSS는 110 × 180mm, 여백 9mm, 문항별 페이지 나눔을 적용한다. 표지만 있는 첫 페이지 없이 첫 문항부터 시작한다. 브라우저 인쇄 시 배경 그래픽을 허용하고 머리글/바닥글을 끈다. 내용이 크게 길어지는 향후 원본 변경은 페이지 넘침 검사를 다시 수행한다. 작은 크기의 PDF는 확대해서 읽을 수 있고, HTML은 화면 폭에 맞게 다시 줄바꿈한다.

## PDF (선택)

기존 Playwright와 해당 Chromium 브라우저가 있을 때만 사용한다. 내보내기 도구가 의존성을 설치하거나 브라우저를 다운로드하지 않는다.

```sh
node scripts/export-presenter-documents.mjs --pdf
# 또는 기존 설치의 모듈 디렉터리/index.mjs를 지정
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/export-presenter-documents.mjs --pdf --output /private/path/presenter
```

동일 위치에 `saints-presenter.pdf`, `church-presenter.pdf`가 추가되고 manifest에 포함된다. 글꼴 로드 완료를 기다린 뒤 Chromium으로 렌더링하며 외부 네트워크 요청은 차단한다. PDF 생성 실패 시 이번 실행의 결과를 쓰지 않고 오류로 종료한다. 이전 실행의 파일은 자동 삭제하지 않으므로 정확한 산출물 목록은 이번 `manifest.json`을 기준으로 한다.

HTML, Markdown, manifest에는 실행 시각이나 절대 출력 경로가 들어가지 않는다. 동일 입력/코드/옵션에서는 바이트가 재현된다. PDF 생성·수정 시각 메타데이터는 고정값으로 정규화하지만 Chromium 버전이 다르면 렌더링과 PDF 바이트가 달라질 수 있다. PDF 재현성 비교는 같은 Playwright/Chromium 버전과 글꼴로 수행한다.

검증 예시(Poppler 도구가 있는 경우):

```sh
pdfinfo exports/presenter/saints-presenter.pdf
pdffonts exports/presenter/saints-presenter.pdf
pdftotext -layout exports/presenter/saints-presenter.pdf -
```

각 PDF의 페이지 수가 해당 manifest의 문항 수와 같은지, 글꼴이 임베드되었는지, 한글 문제/힌트/정답을 추출할 수 있는지 확인한다. 320px·390px에서 수평 넘침이 없고 긴 보기/힌트가 잘리지 않는지도 확인한다.

## 공유 힌트 도우미와 테스트

Node 24의 네이티브 타입 제거로 웹과 같은 `src/data/hints.ts`의 `hintSummary(question): string`과 `src/data/validation.ts`의 콘텐츠 검증기를 직접 가져온다. 두 모듈은 Node에서 불러올 수 있는 순수 코드여야 하며 브라우저/번들러 전용 의존성은 없어야 한다. 누락이나 로드 오류가 있으면 대체 문구를 만들지 않고 실패한다. 최종 문서 생성에서는 manifest의 `hintFormatter.source`가 `src/data/hints.ts`인지 확인한다.

지원 힌트는 `text`의 `text`, 객관식 `eliminate`의 `eliminatedIndices`(0부터 시작), 주관식 `options`의 `choices`이다. 제거 힌트는 원문 보기를 삭제하지 않고 힌트란에서만 표시한다. OX 힌트, 정답 제거, 범위 밖 인덱스, 중복 문항 ID 등은 거부한다.

`node:test`는 원본 순서/현재 문항 수, 모든 필수 내용과 인정 답안, 힌트 형식, HTML 이스케이프, 오프라인/인쇄 설정, CLI 인수, 공개 경로 차단, 실제 생성 결과의 해시와 재현성을 검사한다. 전체 앱 테스트나 빌드는 실행하지 않는다. PDF 육안 검사는 별도 단계이며 테스트 통과만으로 페이지 적합성을 보장하지 않는다.
