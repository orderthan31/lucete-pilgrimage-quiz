# Eight-photo background checkpoint

## Delivered media

- Eight independent actual Namyang shrine photographs: entrance path, garden-building exterior, central Marian statue, autumn garden, golden grove, statue approach, leaf-strewn lawn, sanctuary. Seven outdoor scenes and one interior. Not live/drone footage.
- Five additions are different single-photo panels from five archived KOGL1 article collages. No whole collage is shown and no alternate crops of one photograph are counted as separate photos. Exact original hashes, integer extraction boxes, panel hashes, public credits and historical/native-resolution caveats are in `media-sources.md` and `public/media/namyang-background.sources.json`.
- 56 seconds, 1920×1080, 24 fps, 1,344 frames, H.264/yuv420p, no audio, faststart; seven seconds per scene and 1.5-second dissolves, including the return to the first scene. Encoder uses two threads. No dim baked into the video.
- MP4: 17,168,286 bytes; SHA-256 `dc6de1a3f48acf882b3ca4253aa3d8871a7f8e5a53ac3ce11bbff9bef69a2d6a`.
- Poster unchanged: 497,704 bytes; SHA-256 `25cdc003e7cf34b152cd565d1cbf8fbbbb9b296dd6b9f1398e9181b83c2774fe`.

## Parent verification

- Independently read the manifest/renderer/credits and inspected both the decoded output contact sheet and the independent-source contact sheet. Eight different compositions, no visible collage seams/watermarks, central statue head/pedestal and sanctuary cross/altar remain in frame.
- Rechecked the original 2021 article: explicit KOGL Type 1 attribution badge/link remains present. This is article-level evidence, not an individually issued photographic permission certificate. Published image credits are preserved without inventing a personal photographer.
- Independently hashed every selected image and archived collage, and checked each of the five PNG panels for exact RGB pixel equality against the declared source extraction rectangle.
- Independent FFprobe: 56 seconds, 1,344 frames, one H.264 1920×1080 yuv420p 24 fps video stream. Independent full FFmpeg decode returned exit 0 without errors.
- Owner-account verification: six Python crop tests pass, including all eight sources over all 1,344 motion phases; 40-question content validation passes; 20 Vitest tests / three files pass; TypeScript, production build and authored diff hygiene pass. The prior three-source count assertion was updated to a minimum of eight plus manifest/render count agreement and unique source hashes.
- Live private preview: MP4, poster, manifest and credits all return exact local bytes at `100.85.199.76:5176`. Video is actually playing, muted/loop/inline, duration 56, dimensions 1920×1080, no media error.
- Waited for **seeked**, not merely assignment of currentTime: all eight scenes at 2, 9, 16, 23, 30, 37, 44 and 51 seconds have readyState 4, seeking false, no error and the same persistent video node.
- One category click still enters question 1 without an intermediate start screen; answer is initially absent and explicit reveal displays it. Route and reveal transitions preserve the video element. No global dim or video filter; bounded content-panel canvas alpha remains .62.
- Captured actual 1920×1080 opening and revealed-question screens over the new autumn-garden scene and visually inspected them. Surrounding landscape remains visible; title, choices/actions and revealed answer/explanation are readable without clipping or overlap. Dark Silver comes from canonical `--g-canvas`, not a requirement for a literal light-silver overlay.

Private evidence: `/root/.hermes/cache/scratch/lucete-namyang-eight/`, including `parent-verification.json`, `parent-browser-scene-checks.json`, `parent-live-opening.jpg`, `parent-live-question.jpg`, source/decoded contact sheets and worker decode/geometry records.

## Remaining boundaries

Published sources and extracted panels are below native Full HD; encoding at 1080p does not restore missing detail. Photographs are historical, not current filming. Physical projector brightness/sharpness, the original CI master and production deployment are not verified by this checkpoint. The earlier full 332-state UI census remains documented in `content-panel-checkpoint.md`; this media-only change adds actual playback/scene checks rather than claiming a new exhaustive UI census.
