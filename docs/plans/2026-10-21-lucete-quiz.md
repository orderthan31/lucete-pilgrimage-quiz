# Lucete Pilgrimage Quiz Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a projector-first React quiz website for 2026 루체테 성지순례, with mobile adaptation and a continuously running development preview on port 5176.

**Architecture:** Static React/TypeScript/Vite application with two source-backed local question sets and no backend, login, scores, rankings, or answer collection. A presenter explicitly reveals answers and advances questions; browser-local progress supports recovery without accidentally revealing an answer after reload.

**Tech Stack:** React 19.3.1, Vite 8.3.4, TypeScript, accessible CSS, Vitest/testing-library and browser verification. Vercel-compatible build configuration; production deployment is not yet authorized/configured.

---

## Confirmed scope and bounded defaults

- Repository: orderthan31/lucete-pilgrimage-quiz. Work directly on main in this new empty repository; do not create a forced worktree.
- Event title: 2026 루체테 성지순례. Organizer display: 영통영덕성당 루체테. Destination: 남양성모성지.
- Projector presentation is primary; mobile layouts also work. No participant phone-answer service.
- Two categories: Catholic saints (20 questions), church knowledge (20 questions).
- Mix five-option multiple-choice, OX, and short-answer questions in each category. Proposed initial distribution per category: 10 multiple-choice, 5 OX, 5 short-answer. This distribution is adjustable content, not a user-confirmed requirement.
- About one minute per question is an operating guideline, not a mandatory auto-advance timer.
- Scores, rankings, teams, automatic grading and participant answer input are out of scope.
- Presenter owns answer reveal, explanation and navigation. Short-answer items show canonical and accepted answers after reveal, with no answer input.
- Development owner: hg121500. Project path: /home/hg121500/dev/lucete-pilgrimage-quiz. Node runtime: /home/hg121500/.local/node-v24.14.1/bin.
- Keep npm run dev supervised on port 5176 while working and after this handoff. Only this new service/port may be changed. Do not restart or modify other projects, reverse proxies, firewalls or Tailscale.
- Commit and push at meaningful milestones; independently read remote main SHA after every push.

## Media constraint

No licensed local Namyang video file has been supplied. Do not download/rehost arbitrary YouTube material, hide YouTube controls/branding, or place visual overlays over a YouTube embedded player. Implement an owned/authorized MP4 background integration with a reliable poster fallback. Find and attribute an authentic legally reusable Namyang image if possible. An ordinary unobscured official video player/link may be offered separately. Record the unresolved background-video asset clearly rather than substituting a generic or generated location and claiming it is Namyang.

## Data contract (shared between independent writers)

Content owner alone writes `src/data/quizzes.json` and `docs/content-sources.md`.
Frontend owner must NOT edit those files. It may create `src/data/types.ts` and load JSON.

JSON shape: array of categories `{ id, title, description, questions }`. IDs are `saints` and `church`.
Question shape: `{ id, type, question, choices?, answer, answerIndex?, acceptedAnswers?, explanation, sources, difficulty }`.
- type: `multiple-choice`, `ox`, or `short-answer`.
- multiple-choice: exactly five unique choices, zero-based answerIndex, answer equals choices[answerIndex].
- ox: choices exactly `["O", "X"]`, answerIndex 0 or 1, answer agrees.
- short-answer: no answerIndex; acceptedAnswers includes the canonical answer. Do not auto-grade.
- sources: nonempty array of `{ label, url }`; use verified Catholic primary sources.
- difficulty: `easy`, `medium`, `hard`.
- Exactly twenty unique question IDs per category; no duplicate normalized question strings.

## Task 1 — baseline and live scaffold

Files: package.json, package-lock.json, index.html, vite.config.ts, src/main.tsx, src/App.tsx, src/styles.css, .gitignore, README.md.
1. Establish this plan as the committed baseline before application work.
2. Install compatible pinned runtime dependencies as hg121500; keep lockfile.
3. Produce a minimal real React page and configure `dev` for 5176 with strictPort.
4. Start a dedicated systemd service as hg121500 invoking npm run dev.
5. Verify the exact listener, HTTP response and owner. Push the runnable scaffold milestone.

## Task 2 — presenter UI and local recovery

Files: src/App.tsx, src/components/*, src/hooks/*, src/data/types.ts, src/styles.css, src/**/*.test.tsx, vite.config.ts, tsconfig*.json, vercel.json.
1. Add failing tests for navigation, reveal gating, recovery and invalid stored values.
2. Build elegant restrained landing, category intro, question, answer/explanation, and category-complete screens.
3. Projector-first layout: large high-contrast Korean text, five choices as 2-column rows with final full-width row; mobile stacks all choices. No video behind quiz questions.
4. Answer reveal is explicit and separate from option selection. Show no answer/source/accepted-answer text before reveal in the rendered question screen. Sources may appear after reveal.
5. Support Space/Right for reveal then next; Left for previous; F for fullscreen when available. Ignore shortcuts on interactive controls and modified key combinations; avoid double-advance on key repeat.
6. Save per-category position locally with validation and a version. Reload must hide answers. Offer a clearly labeled resume/reset flow; don't accidentally restart a saved run.
7. Category completion must not display a score. Returning home preserves progress; reset needs an explicit confirmation.
8. Provide fullscreen fallback and reduced-motion/video failure handling; don't trap focus in a fake fullscreen interface.
9. Verify real routes, component tests, TypeScript, and build. Commit/push the complete presentation-flow milestone after review.

## Task 3 — forty verified questions

Files: src/data/quizzes.json, docs/content-sources.md, scripts/validate-content.mjs, content tests.
1. Read primary Catholic sources before drafting; distinguish fact from tradition/legend.
2. Populate both exact twenty-question sets across all three types with concise projector-friendly language.
3. Prefer CBCK catechism, Suwon diocese, Goodnews Catholic reference sources and official Vatican material; retain exact source URLs.
4. Avoid ambiguous saint identities, multiple valid five-option answers, disputed dates, current-office questions, unsupported quotes, and pseudo-doctrinal trivia.
5. Include useful accepted short-answer variants and concise explanatory notes for a human presenter.
6. Validate counts/types/answers/source URLs programmatically, then independently review religious accuracy.
7. Push the populated-content milestone.

## Task 4 — integrated browser and deployment-readiness gates

Files: tests/e2e/*, README.md, docs/verification.md, vercel.json, .github/workflows/ci.yml if no forbidden workflow credential scope is needed.
1. Verify landing → intro → mixed question types → explicit reveal → next → final question → completion → other category.
2. Verify refresh recovery, corrupt localStorage recovery, previous/reset, keyboard repeat/focus behavior and fullscreen rejection.
3. Test approximately 1920x1080, 1366x768, 1024x768 and phone widths 390 and 320. Measure overflow, clipping and interactive targets.
4. Inspect actual media provenance and fallback; don't claim unavailable background video is delivered.
5. Run content validation, unit/component tests, typecheck and production build; verify a production preview separately from dev HMR.
6. Run ordered independent spec then code-quality review; fix blocking/important issues.
7. Verify final main SHA equals remote main, working tree is clean, file ownership is correct, and port 5176 still responds under the intended service.
8. Record actual commands/results/remaining asset limitation. Report the dev URL and milestone SHAs without claiming a Vercel deployment that was not performed.
