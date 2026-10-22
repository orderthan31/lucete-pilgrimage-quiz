# 링크 공유 메타데이터와 루체테 CI 파생 자산

## 적용 범위

- 배포 기준 주소: `https://lucete-pilgrimage-quiz.vercel.app/` — 저장소의 GitHub homepage 및 실제 배포 응답으로 확인한 production 주소.
- `index.html`에 한국어 제목·설명·작성자·애플리케이션 이름·canonical, Open Graph, Twitter large-image card를 직접 선언한다. React 실행이나 클라이언트에서의 head 변경에 의존하지 않는다.
- 퀴즈의 중첩 주소도 동일한 행사 공유 카드와 production-root canonical/`og:url`을 사용한다. 개별 정답이나 해설을 공유 메타데이터에 노출하지 않는다.
- 별도의 카카오 SDK, 앱 키, Twitter 계정이나 Facebook App ID를 추가하지 않는다. 일반 URL 미리보기와 카카오톡 공유 API는 다른 기능이다.
- 퀴즈 화면·문항·진행 상태·배경 영상은 변경하지 않는다.

## 공유 이미지

- OG / 카카오톡: `/social/lucete-pilgrimage-2026-og-v1.jpg`, 1200×630, RGB JPEG.
- 원본 렌더 보관: `/social/lucete-pilgrimage-2026-og-v1.png`, 1200×630.
- Twitter: `/social/lucete-pilgrimage-2026-twitter-v1.jpg`, 1200×600, RGB JPEG.
- CI와 제목·장소를 중앙에 배치하여 중앙 정사각형 크롭에도 핵심 정보가 남는다. 바깥 레이아웃은 밝은 중립색이며 CI의 파란색·노란색·검정과 비율은 유지한다.
- 원본은 사용자 제공 화면 캡처에서 추출한 `public/brand/lucete-profile.png`다. 공식 벡터 마스터나 새로 그린 CI라고 부르지 않는다. 원본 해시를 고정 검사하며 내부 문구를 재입력하거나 색을 덮어쓰지 않는다.
- 카드 제목은 기존 로컬 Pretendard를 사용해 결정적으로 렌더링한다. 모델 생성 글자나 외부 폰트 요청이 없다. WOFF2→TTF 변환은 렌더 프로세스의 메모리 안에서만 이루어지며 원본 폰트·라이선스는 수정하지 않는다.
- `public/social/assets-manifest.json`에 원본 해시, 레이아웃 경계, 크기·바이트·SHA-256을 기록한다.
- 이미지 내용이 바뀌면 `v2` 등 새 경로를 만들고 HTML과 테스트를 함께 갱신한다. Vercel의 social 자산 캐시는 1시간이며, 외부 플랫폼의 미리보기 캐시는 별도다.

## 아이콘

- `favicon.svg`: 기존 임시 초록 십자가 대신 실제 CI에서 만든 PNG를 내장한 SVG.
- `favicon.ico`: 16/32/48/64px 다중 크기.
- `/icons/favicon-32.png`: 브라우저용 PNG.
- `/icons/apple-touch-icon.png`: 180×180, 흰 바탕과 안전 여백.
- `/icons/icon-192.png`, `/icons/icon-512.png`: 애플리케이션 아이콘.
- `/site.webmanifest`: 한국어 이름과 아이콘을 선언한다. `display: browser`, `purpose: any`이며 오프라인 지원이나 maskable 적합성을 주장하지 않는다.

## 재생성

Python 3.12 이상으로 개발용 가상환경을 만든다. 프런트엔드 빌드/Vercel에는 Python이나 이미지 라이브러리가 필요하지 않다. 생성된 정적 파일을 저장소에 포함한다.

```sh
python3 -m venv .venv-brand
.venv-brand/bin/python -m pip install -r scripts/brand-assets.requirements.txt
.venv-brand/bin/python scripts/render-share-assets.py
npm test
npm run build
```

가상환경은 저장소 밖에 두거나 Git에서 제외한다. 원본 CI가 교체되면 출처·실제 화면 검수와 원본 해시를 함께 갱신한 뒤 재생성한다.

## 검증과 캐시 주의

- `src/metadata.test.ts`가 정적 HTML의 유일 태그, production 절대 URL, JPEG 실제 크기·RGB·용량, 아이콘 크기, 원본 CI 불변성과 모든 생성 자산의 해시를 검사한다.
- 배포 후 Kakao/Twitter 크롤러 User-Agent로 루트·중첩 경로의 HTML을 가져와 메타데이터가 포함되는지 검사한다. 이미지 URL이 인증 없이 `200 image/jpeg`를 반환하고 로컬 파일과 SHA-256이 같은지도 확인한다. 이는 실제 카카오톡·X 앱 내 카드 표시 검수와 구분한다.
- 기존에 공유한 주소가 이전 미리보기를 보여주면 카카오의 스크랩 캐시 초기화 도구에서 해당 주소를 초기화한 뒤 새 메시지로 다시 공유한다. 도구에 카카오 계정 로그인이 필요하면 사용자 본인이 처리한다. 기존 메시지의 카드가 소급 갱신됐다고 주장하지 않는다.

공식 참고:
- Open Graph: https://ogp.me/
- X Summary Card with Large Image: https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image
- 카카오 스크랩 캐시 초기화: https://developers.kakao.com/tool/clear/og
- 카카오 공식 캐시 안내: https://devtalk.kakao.com/t/topic/22238
