# Global photo-motion background — verified preview checkpoint

## Delivered changes

- All presentation scenes use one persistent muted, inline looping video. Route changes, answer reveal and completion do not replace or reset the video node.
- Replaced repetitive portrait/square organ close-ups with **two actual landscape photographs of the shrine's autumn grounds** plus one subject-safe sanctuary view. Eight seconds per scene with 1.5-second dissolves; 24-second loop.
- Source-specific subject rectangles and focal points preserve the tree-path composition and the sanctuary cross, paintings and altar. Extra zoom is limited to 1.002–1.022. Impossible safe crops fail instead of silently removing the subject.
- Silver Dark dim: opening 72%, all other scenes 84%; opaque choice surfaces. Photo credits live in Help rather than repeated slide prose.
- Removed repeated question-type/time/participation/category descriptions, numeric resume messages and completion slogans. Functional names, answers/explanations, accessible names and necessary warnings remain.

## Direct verification

- Content contract: **2 categories / 40 questions**, passed.
- Vitest: **19 tests / 3 files**, passed. Includes video-node continuity, autoplay rejection/manual retry, media-error fallback and reduced motion.
- TypeScript and Vite production build passed.
- Python crop geometry suite includes every animated phase of each selected source, plus invalid input/impossible portrait protection.
- Final MP4: H.264 High, yuv420p, **1920×1080 / 24fps / 24.000 seconds / 576 decoded frames**, one video stream and no audio. Full decode passed; `moov` precedes `mdat`.
- MP4 bytes **10,538,046**, SHA-256 `85862cce2cbc6f5c01371c8763f566618e55d9634718dfcd7eeb8cc2ba8bea25`.
- Poster bytes **497,704**, SHA-256 `25cdc003e7cf34b152cd565d1cbf8fbbbb9b296dd6b9f1398e9181b83c2774fe`.
- HTTP 200 and byte/hash equality verified for MP4, poster, credits and source manifest.
- Real browser playback: loaded 1920×1080 media, readyState 4, unpaused, advancing time, no media error. The same node persisted through opening, ready, both categories' questions/reveals and completion.
- Exhaustive browser census: **85 states at each of 1920×1080, 1280×720, 390×844, 320×720 = 340 states**. Every viewport covered all 40 unique questions before/after reveal, plus opening, both ready screens and both completion screens. Failures: **0**. Checked horizontal overflow, projector clipping/page overflow, title/choice correctness, answer hidden before reveal, correct answer afterward, functional control bounds and removed-copy absence. Mobile may scroll vertically by design.
- Actual decoded contact sheet visually inspected: landscape grounds are broadly framed; sanctuary cross, paintings and altar remain inside frame; no blank or watermarked samples. Actual 1920×1080 opening/question screenshots were also visually inspected for contrast and overlap.
- Fully white hypothetical source-frame contrast from actual computed styles: opening primary **6.82:1**, secondary **4.81:1**; settled non-opening primary **10.52:1**, secondary **7.41:1**. The 0.2-second transition remains at least as dark as the opening baseline.
- Final application changes have no authored-source whitespace diagnostics. The immutable upstream font license's known historical whitespace was not modified.

## Provenance and boundaries

- `docs/media-sources.md` and public credits identify each source and its terms. Grounds photos use the explicit KOGL Type 1 notice on the enclosing provincial articles, with exact published credits. No separately issued photo-specific certificate or full-resolution camera original was obtained. The G-Life image has no published individual photographer name.
- Original photo dimensions are 966×644, 1000×666 and 1194×1085. Rendering 1080p does not create missing native detail. Public article photos are historical, not represented as current filming.
- KTO watermarked preview/application-only images and KOGL Type 4 no-modification albums are excluded.
- Physical projector brightness/sharpness, original CI vector master, device-specific fullscreen support and actual Vercel deployment remain separate acceptance surfaces.
- Earlier large RAF-based browser censuses timed out at the helper's five-second IPC boundary and were not counted as passes. The final census used bounded timer-based batches and persisted each viewport's complete result.

Private evidence: `/root/.hermes/cache/scratch/lucete-namyang-reframe/render-v2/` contains ffprobe/decode/HTTP reports, contact sheet, screenshots and per-viewport census files. Raw official permission pages and parent browser verification are retained in the adjacent private source-research folders; they are not falsely presented as photo-specific permits.
