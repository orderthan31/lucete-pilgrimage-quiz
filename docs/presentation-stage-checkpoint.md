# Presentation-stage checkpoint

## Scope

Replaces the rejected website-style header, scrolling landing sections and footer with a full-viewport presenter stage. Title/category menu, category-ready, question, deliberate answer reveal and completion are separate scenes. This is an implementation checkpoint, not final event or production acceptance.

- Original-color Lucete CI from the user-provided profile capture; derivative provenance: `brand-assets.md`.
- Canonical Hangyeol Silver token-only integration, with local Pretendard and font notices. It is not a supported full component-source installation; the actual installer host-script rejection is preserved in README.
- No scores, participant input, automatic grading, automatic answer reveal or automatic next question.
- Existing category routes and per-category local recovery are preserved.

## Parent-executed checks

- `npm run validate:content`: 2 categories / 40 questions passed the data contract.
- `npm test`: 3 test files / 14 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- Authored-source `git diff --check`: a trailing space in `vite.config.ts` was found and corrected. Checking the complete staged tree then also exposed one original trailing space at line 22 of the upstream font `LICENSE`. That notice is preserved byte-for-byte rather than rewritten (SHA-256 `d31ddd9f2bed32fd7e302a205cf2380ba0de6529152d239ef99cfb6f261bfc04`, independently matched to the verified package). The final application-source check excludes only that immutable notice. The unrestricted staged-tree whitespace check therefore retains that known upstream diagnostic; it is not reported as a global pass.
- Real browser, landing: 1920×1080, 1280×720 and 390×844. No site header or footer; document height fits the viewport, no horizontal overflow, original CI loads and both start actions are visible.
- Real browser, complete question/answer census: all 40 unique questions, both unrevealed and revealed states, at 1920×1080 and 1280×720. 160 checked states. No document/horizontal overflow, hidden question-body content, title/control clipping or premature answer DOM. Multiple-choice/OX/free-response choice counts were checked.
- Landing screenshot inspected: central CI/title/destination/menu fits one screen. It remains a restrained Silver menu, not a finished game-art treatment.
- Dedicated development service remained active and returned HTTP 200 through the requested private-mesh preview address.

## Known prerequisite failure during QA

The first census attempt used raw `Runtime.evaluate` in a browser context without the page URL; its relative `fetch` URL failed to parse. This was a QA-context error, not an application failure. Re-entering the actual page and using the browser helper's page-context `js` completed the full census successfully.

## Explicitly unresolved

- No actual authorized Namyang shrine background-video asset is connected. Current fallback is a static Silver backdrop. Neither a working fallback nor a media-ready slot fulfills the video requirement.
- CI is a screenshot-derived PNG, not the original vector or raster master.
- Parent did not perform a complete phone question/answer census in this checkpoint; phone landing was checked. Physical projector visibility, platform-specific fullscreen behavior and final event wording/difficulty need separate acceptance.
- Structural data validation is not ecclesiastical approval. Presenter/religious-content review requirements remain in `content-sources.md`.
- No Vercel deployment or final production-browser acceptance is claimed here.
