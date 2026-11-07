#!/usr/bin/env node
/** Organizer-only documents; no app/server dependency. Node 24+. */
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, realpath, stat, lstat, readlink } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hintSummary } from '../src/data/hints.ts';
import { validateContent } from '../src/data/validation.ts';
export { hintSummary };

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const markdown = (value) => String(value).replace(/[\\`*_{}\[\]<>#|]/g, '\\$&').replace(/\r?\n/g, '  \n');

export function validateCategories(categories) {
  if (!Array.isArray(categories) || categories.length !== 2 || new Set(categories.map((c) => c.id)).size !== 2 || categories.some((c) => !['saints', 'church'].includes(c.id))) throw new Error('Expected saints and church categories');
  if (!validateContent(categories)) throw new Error('Invalid production quiz content or hint');
  return categories;
}

export function renderHTML(category, fonts, formatHint = hintSummary) {
  const e = escapeHTML;
  const fontCSS = fonts.map((font) => `@font-face{font-family:Presenter;src:url(data:font/woff2;base64,${font.data.toString('base64')}) format('woff2');font-weight:${font.weight};font-style:normal;font-display:block}`).join('\n');
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${e(category.title)} · 진행자 전용</title>
<style>${fontCSS}
*{box-sizing:border-box}html{font-family:Presenter,sans-serif;color:#172030;background:#eef1f5;line-height:1.55;overflow-wrap:anywhere}body{margin:0;padding:16px}main{max-width:620px;margin:auto}.question{background:white;padding:24px;margin:0 0 20px;border:1px solid #cbd2dc;border-radius:12px}.meta{font-size:12px;color:#515c6c;margin:0 0 12px}.warning{font-weight:700;color:#753b16}h1{font-size:20px;line-height:1.45;margin:0 0 14px}h2{font-size:14px;margin:16px 0 4px}p{margin:0;white-space:pre-wrap}ol{margin:0;padding-left:1.65em}li{padding:3px 0}.answer{border-top:1px solid #cbd2dc;margin-top:14px}.answer p:first-of-type{font-weight:700}.variants{font-size:13px;margin-top:6px;color:#435064}.explanation{font-size:14px}.hint{background:#f0f4fa;border-radius:6px;padding:10px}.hint h2{margin-top:0}
@media(max-width:390px){body{padding:10px}.question{padding:16px}h1{font-size:19px}}
@page{size:110mm 180mm;margin:9mm}
@media print{html{background:white;font-size:10pt;line-height:1.4}body{padding:0}main{max-width:none}.question{padding:0;margin:0;border:0;border-radius:0;break-after:page;page-break-after:always;break-inside:avoid}.question:last-child{break-after:auto;page-break-after:auto}.meta{font-size:8pt;margin-bottom:8px}h1{font-size:13pt;margin-bottom:8px}h2{font-size:9pt;margin:10px 0 3px}.hint{padding:7px}.variants,.explanation{font-size:9pt}li{padding:2px 0}.answer{margin-top:9px}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><main aria-label="${e(category.title)} 진행자 자료">
${category.questions.map((q, i) => `<article class="question" data-question-id="${e(q.id)}"><p class="meta"><span class="warning">진행자 전용 · 정답 포함</span><br>${e(category.title)} · ${i + 1} / ${category.questions.length} · ${e(q.id)}</p><h1>문제 ${i + 1}. ${e(q.question)}</h1>${q.choices ? `<ol aria-label="원문 보기">${q.choices.map((c) => `<li>${e(c)}</li>`).join('')}</ol>` : ''}<section class="hint"><h2>힌트</h2><p>${e(formatHint(q))}</p></section><section class="answer"><h2>정답</h2><p>${e(q.answer)}</p><p class="variants">인정 답안: ${q.acceptedAnswers?.length ? q.acceptedAnswers.map(e).join(' / ') : '별도 표기 없음'}</p><h2>해설</h2><p class="explanation">${e(q.explanation)}</p></section></article>`).join('\n')}
</main></body></html>\n`;
}

export function renderMarkdown(category, formatHint = hintSummary) {
  const m = markdown;
  return `# ${m(category.title)} · 진행자 전용\n\n**정답 포함 · 참가자 배포 금지**\n\n총 ${category.questions.length}문항. 원본 데이터 순서.\n\n${category.questions.map((q, i) => `## 문제 ${i + 1}. ${m(q.question)}\n\n문항 ID: ${m(q.id)}\n\n${q.choices ? `${q.choices.map((c, n) => `${n + 1}. ${m(c)}`).join('\n')}\n\n` : ''}### 힌트\n\n${m(formatHint(q))}\n\n### 정답\n\n${m(q.answer)}\n\n인정 답안: ${q.acceptedAnswers?.length ? q.acceptedAnswers.map(m).join(' / ') : '별도 표기 없음'}\n\n### 해설\n\n${m(q.explanation)}\n`).join('\n---\n\n')}`;
}

export function parseArgs(args) {
  let output = resolve(ROOT, 'exports/presenter');
  let pdf = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pdf') pdf = true;
    else if (args[i] === '--output' && args[i + 1] && !args[i + 1].startsWith('--')) output = resolve(args[++i]);
    else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  }
  return { output, pdf };
}

async function canonicalPath(path) {
  try { return await realpath(path); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const entry = await lstat(path).catch((failure) => { if (failure.code !== 'ENOENT') throw failure; return null; });
    if (entry?.isSymbolicLink()) return canonicalPath(resolve(dirname(path), await readlink(path)));
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(await canonicalPath(parent), relative(parent, path));
  }
}
const isWithin = (base, path) => { const rel = relative(base, path); return rel === '' || (!rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && rel !== '..' && !isAbsolute(rel)); };
export async function assertPrivateOutput(output, root = ROOT) {
  const actual = await canonicalPath(resolve(output));
  const base = await realpath(root);
  for (const name of ['public', 'dist']) {
    const forbidden = await canonicalPath(join(base, name));
    if (isWithin(forbidden, actual)) throw new Error(`Refusing answer export in ${name}: ${output}`);
  }
  return actual;
}

async function loadPlaywright() {
  const target = process.env.PLAYWRIGHT_MODULE;
  if (!target) {
    try { return await import('playwright'); }
    catch { throw new Error('--pdf requires installed playwright or PLAYWRIGHT_MODULE pointing to its module directory/file'); }
  }
  let modulePath = resolve(target);
  if ((await stat(modulePath)).isDirectory()) modulePath = join(modulePath, 'index.mjs');
  return import(pathToFileURL(modulePath).href);
}

export async function exportDocuments({ output = join(ROOT, 'exports/presenter'), pdf = false } = {}) {
  output = await assertPrivateOutput(output);
  const source = await readFile(join(ROOT, 'src/data/quizzes.json'));
  const categories = validateCategories(JSON.parse(source));
  const fonts = await Promise.all([['Pretendard-Regular.woff2', 400], ['Pretendard-Bold.woff2', 700]].map(async ([name, weight]) => ({ name, weight, data: await readFile(join(ROOT, 'public/fonts/hangyeol', name)) })));
  const license = await readFile(join(ROOT, 'public/fonts/hangyeol/LICENSE'));
  const hintPath = join(ROOT, 'src/data/hints.ts');
  const hintModuleHash = sha256(await readFile(hintPath));
  const artifacts = new Map();
  for (const category of categories) {
    // Embedded license preserves upstream redistribution terms in standalone HTML.
    const html = renderHTML(category, fonts).replace('</head>', `<!-- Font license --><template id="font-license">${escapeHTML(license.toString())}</template>\n</head>`);
    artifacts.set(`${category.id}-presenter.html`, Buffer.from(html));
    artifacts.set(`${category.id}-presenter.md`, Buffer.from(renderMarkdown(category, hintSummary)));
  }
  if (pdf) {
    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.route('**/*', (route) => route.abort());
      for (const category of categories) {
        await page.setContent(artifacts.get(`${category.id}-presenter.html`).toString(), { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true });
        // Keep the byte length (and PDF xref offsets) unchanged while fixing dates.
        const normalized = bytes.toString('latin1').replace(/\/((?:Creation|Mod)Date) \(D:\d{14}[^)]*\)/g, (match) => match.replace(/D:\d{14}/, 'D:20000101000000'));
        artifacts.set(`${category.id}-presenter.pdf`, Buffer.from(normalized, 'latin1'));
      }
    } finally { await browser.close(); }
  }
  const manifest = {
    schemaVersion: 1,
    audience: 'organizer-only; contains answers; do not publish',
    source: { path: 'src/data/quizzes.json', sha256: sha256(source) },
    exporterSha256: sha256(await readFile(fileURLToPath(import.meta.url))),
    hintFormatter: { source: 'src/data/hints.ts', sha256: hintModuleHash },
    fonts: fonts.map(({ name, data }) => ({ name, sha256: sha256(data) })),
    fontLicenseSha256: sha256(license),
    categories: categories.map((c) => ({ id: c.id, count: c.questions.length, questionIds: c.questions.map((q) => q.id) })),
    totalQuestions: categories.reduce((n, c) => n + c.questions.length, 0),
    artifacts: [...artifacts].map(([file, bytes]) => ({ file, bytes: bytes.length, sha256: sha256(bytes) })),
  };
  artifacts.set('manifest.json', Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));
  // Check every leaf before writing: an existing symlink must not leak answers.
  for (const name of artifacts.keys()) {
    const path = await assertPrivateOutput(join(output, name));
    if (!isWithin(output, path)) throw new Error(`Refusing output symlink: ${name}`);
  }
  await mkdir(output, { recursive: true });
  for (const [name, bytes] of artifacts) await writeFile(join(output, name), bytes);
  return { output, manifest, files: [...artifacts.keys()] };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await exportDocuments(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
