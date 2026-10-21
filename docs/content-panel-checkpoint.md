# Lighter content panels and fresh-start UX checkpoint

This supersedes the old global 72%/84% video-dim and resumable-start presentation contract. Media expansion is recorded separately in `eight-photo-background-checkpoint.md`; no new photograph count is claimed by this historical UI checkpoint.

## Changes

- Remove the fixed full-viewport `stage-dim` element and video-wide darkening. Video has no CSS filter. Outside bounded content panels the source photograph is displayed unchanged.
- Place dark Silver canvas at **62% opacity only behind content**. Keep primary and secondary in-panel text bright; do not retain dim gray secondary text that fails over bright frames. No backdrop blur.
- Opening panel maximum width 1000px; question panel maximum width 1480px; responsive internal padding preserves readable layout.
- Main category buttons use dark neutral surfaces and bright text instead of the light Silver action fill with dark labels. Font size at measured widths: **24px at 1920px, 19px at 1280px, 18px at phone widths**. Button widths are capped at 320px and touch targets remain at least 56px high in measured layouts. Other primary and selected-number controls follow the same bright-label treatment.
- Choosing a quiz type on the opening screen immediately opens question 1, even with stored prior progress. There is no ready/intermediate start screen. Remove from-start/resume choice, reset actions and the reset confirmation dialog. Number jump remains the explicit way to start in the middle or return to question 1. Refresh of a direct question URL still restores that question with its answer hidden. Existing internal progress writes do not drive category entry. Completion's other-quiz action also enters question 1 directly; old `/quiz/:category` addresses replace history with the canonical first-question URL.

## Direct verification

- Reproduced three targeted failures before implementation: old full-screen dim present, resume/from-start choice present, reset action present. After the final direct-entry change, all **20 Vitest tests / 3 files** passed, including category-address canonicalization and completion-to-other-quiz direct entry.
- TypeScript and Vite production build passed; authored `git diff --check` passed.
- Exhaustive browser census at **1920×1080, 1280×720, 390×844, 320×720**: 83 states per viewport / **332 total**, each covering all 40 questions before and after reveal plus home and both completion screens. Category-address aliases are verified separately in the direct-entry flow. **Zero failures** for expected title/choices/answers, hidden pre-reveal answer, horizontal overflow, projector content clipping/control/heading/panel bounds, removed copy, one persistent video, no global dim and a content panel on each state. Mobile vertical scrolling remains allowed.
- Real interaction after final steering: one category click → question 1 → number jump to question 17 → home → one category click → question 1. No ready/extra start/resume/reset screen. An old church-category address redirects with unchanged history length, and completion's other-quiz action opens church question 1 directly. All these transitions preserve the same video node.
- Actual computed CSS composited over a fully white hypothetical source frame: panel `rgba(canvas, .62)` background `[106,111,123]`, bright text **4.81:1** for question title, metadata and small question-list control. Utility-cluster text **6.82:1**; dark primary-button bright text **9.90:1**. No video filter; global dim count 0.
- Actual opening and question screenshots visually inspected: surrounding landscape visible, only central content darkened, compact bright-label category buttons, no overlap/clipping. Quantitative contrast checks cover the top utility cluster despite the vision review's subjective weaker-contrast observation.
- Home at all four measured viewports has no horizontal or vertical page overflow. Phone question screens may scroll by design.

Private evidence: `/root/.hermes/cache/scratch/lucete-content-panel-revision/` contains screenshots, home geometry, per-viewport complete censuses and the real interaction/white-frame contrast report.

## Still separate

Photograph-count expansion and final expanded-video playback/decode/rights checks are not accepted by this UI checkpoint. Physical projector brightness, historical-source resolution limits, original CI master and production deployment remain separate surfaces.
