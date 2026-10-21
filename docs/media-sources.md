# Namyang photographic background — grounds-focused revision

남양성모성지 실제 사진 세 장으로 편집한 사진 기반 모션 영상이다. 실촬영 동영상이나 드론 영상이 아니다. 숲길·조경을 중심으로 구성하며, 반복적인 오르간 클로즈업 세 장은 시퀀스에서 제외했다.

## Selected originals and attribution

1. **가을 숲 터널과 산책로** — 사진 공개 표기: 경기도블로그. 기사 작성자: 2021 경기도민기자단 이재형 기자. [원문](https://gnews.gg.go.kr/news/news_detail.do?number=202111090942195746C094&s_code=C094), [공공누리 제1유형](https://www.kogl.or.kr/info/licenseType1.do). 원문이 남양성모성지 입구의 숲 터널로 설명한 사진이다. 공개 JPEG 966×644, `public/media/sources/namyang-autumn-path.jpg`, SHA-256 `b69551d4af3db307832dc605d35839a7406eaee57e101b717d40acae141e8486`.
2. **햇살이 들어오는 가을 조경과 나무길** — 사진 공개 표기: G-Life / 경기도뉴스포털. 개인 촬영자 이름은 원문에 없어 추정하지 않았다. [원문](https://gnews.gg.go.kr/news/news_detail.do?number=201810311638527055C059&s_code=C059), [공공누리 제1유형](https://www.kogl.or.kr/info/licenseType1.do). 사진 캡션과 인접 본문이 남양성모성지 풍경으로 명시한다. 공개 JPEG 1000×666, `public/media/sources/namyang-golden-grove.jpg`, SHA-256 `ea76119bc5657f2e89d4ac7f1478f3e4c5130bcb26a5d3baff8f75c75def34cd`.
3. **성당 내부 제단부** — Alexander Ortmann, *Hwaseong-Namyang, The Shrine of our Lady the Rosary - interior.jpg*. [Wikimedia Commons 원본·이용 조건](https://commons.wikimedia.org/wiki/File:Hwaseong-Namyang,_The_Shrine_of_our_Lady_the_Rosary_-_interior.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 1194×1085, `public/media/sources/namyang-sanctuary.jpg`, SHA-256 `5d50de1018bd5b3c4b26208a3377dbadbfca8f92977d53829bd9caef0c64ee69`. 이전 중앙 크롭 대신 십자가·성화·제대가 모두 남도록 위쪽을 기준으로 자른다.

조경 사진은 별도 사진별 허가서를 발급받은 것이 아니라 **게시된 원문 기사 전체의 명시적인 공공누리 제1유형 표기**를 확인하여 사용했다. 해당 사진의 공개 크레딧은 도 발행물/블로그이며, 제3자 스톡 에이전시 사진을 기관 사진으로 바꿔 표기하지 않았다. 공공누리 원문은 출처 표시를 조건으로 온라인 공유·변형을 허용하며 기관의 후원·제휴를 오인시키지 않도록 정한다. 카메라 원본이나 사진별 별도 서면 허가 확보를 주장하지 않는다. 기사 이미지의 공개 바이트를 보존했고 원문 공개 시점은 각각 2021년과 2018년이다. 현재 촬영물이라고 표시하지 않는다.

## Media license and attribution

- 편집된 영상·포스터의 편집 기여와 결합 파생물은 **CC BY-SA 4.0**로 공유한다. 원본은 각 **공공누리 제1유형 / CC BY-SA 4.0** 조건을 유지하며 KOGL 원본을 CC 라이선스로 재허락했다는 의미가 아니다.
- 재사용 시 각 원본의 공개 크레딧·출처·라이선스·변경 사실을 유지하고, 영상 파생물은 동일 라이선스로 공유한다. 앱 코드의 라이선스와 별개다.
- 공개 표면: 앱 **도움말 → 사진 출처**, `/media/credits.html`, `/media/namyang-background.sources.json`.
- Provenance: `public/media/namyang-background.sources.json`, `public/media/sources/grounds-rights.json`, 기존 Commons API 원본 `commons-*.json`.
- 변경: 16:9 크롭, 피사체 보존 팬·줌, 교차 전환, H.264 인코딩, 포스터 추출. 딤은 영상에 굽지 않고 앱에서 적용한다.
- KTO 워터마크 미리보기·신청이 필요한 미확보 원본·공공누리 제4유형 변경 금지 사진은 사용하지 않았다.

## Composition, artifacts and reproduction

- 순서: **숲 터널 → 햇살 조경 → 제단부 → 숲 터널**. 세 장면 각 8초, 마지막 1.5초 교차 전환.
- 네이티브 가로 사진 두 장, 준정사각 내부 사진 한 장이다. 각 사진의 `subject_bbox`와 `focal_point`를 manifest에 명시한다. `scripts/namyang_crop.py`가 모든 팬·줌 프레임에서 핵심 범위를 포함하도록 클램프한다. 비율 보정 후 추가 줌은 1.002–1.022배이며, 피사체가 잘리면 줌을 줄인다. 보존 불가능한 구도는 오류로 거부한다.
- 빌드 도구: Python + Pillow + FFmpeg. 앱 런타임 의존성 추가 없음. 검증: `python3 -m unittest discover -s scripts -p 'test_namyang_crop.py' -v`. 재현: `python scripts/render-namyang-background.py --ffmpeg /path/to/ffmpeg --evidence-dir /private/evidence/folder`.
- `/media/namyang-background.mp4`: 1920×1080, 24fps, 24초, 576프레임, H.264/yuv420p, 오디오 없음, faststart. 10,538,046 bytes; SHA-256 `85862cce2cbc6f5c01371c8763f566618e55d9634718dfcd7eeb8cc2ba8bea25`.
- `/media/namyang-poster.webp`: 첫 프레임, 1920×1080. 497,704 bytes; SHA-256 `25cdc003e7cf34b152cd565d1cbf8fbbbb9b296dd6b9f1398e9181b83c2774fe`.
- **해상도 한계:** 공개 원본은 네이티브 Full HD 미만이다. 1080p 출력은 원본에 없는 디테일을 복구하지 않는다. 실제 빔 프로젝터의 선명도·밝기는 현장 확인 대상이다.
