import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, symlink, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ROOT, sha256, escapeHTML, hintSummary, validateCategories, renderHTML, renderMarkdown, parseArgs, assertPrivateOutput, exportDocuments } from './export-presenter-documents.mjs';

const categories = JSON.parse(await readFile(join(ROOT, 'src/data/quizzes.json'), 'utf8'));
const fonts = [{ data: Buffer.from('test-font'), weight: 400 }];
const fixture = { id: 'fixture', type: 'multiple-choice', question: '<script> & "문제"', choices: ['첫째', '정답', '셋째'], answer: '정답', answerIndex: 1, explanation: '해설 <원문>', acceptedAnswers: ['인정 & 답안'] };

test('source coverage: both categories, 20 questions each, original order and complete content', () => {
  validateCategories(categories);
  for (const category of categories) {
    assert.equal(category.questions.length, 20);
    const html = renderHTML(category, fonts);
    const md = renderMarkdown(category);
    assert.deepEqual([...html.matchAll(/data-question-id="([^"]+)"/g)].map((m) => m[1]), category.questions.map((q) => q.id));
    assert.equal((md.match(/^## 문제 /gm) || []).length, category.questions.length);
    for (const q of category.questions) {
      for (const text of [q.question, q.answer, q.explanation, ...(q.choices || []), ...(q.acceptedAnswers || [])]) assert.ok(html.includes(escapeHTML(text)), `${q.id}: ${text}`);
      assert.ok(html.includes(escapeHTML(hintSummary(q))));
    }
  }
});

test('all optional hints, absent hints, original choices and canonical answer', () => {
  assert.equal(hintSummary(fixture), '힌트 없음');
  assert.equal(hintSummary({ ...fixture, hint: { kind: 'eliminate', eliminatedIndices: [0, 2] } }), '제외할 보기: 1번 첫째 / 3번 셋째. 남은 보기: 2번 정답.');
  assert.equal(hintSummary({ ...fixture, hint: { kind: 'text', text: '내용' } }), '내용');
  assert.equal(hintSummary({ ...fixture, hint: { kind: 'options', choices: ['하나', '둘'] } }), '이름 보기: 하나 / 둘');
  const html = renderHTML({ title: '검사', questions: [fixture] }, fonts, () => '공유 힌트');
  assert.ok(html.includes('공유 힌트'));
  assert.ok(html.includes('인정 &amp; 답안'));
  assert.ok(html.includes('<li>첫째</li><li>정답</li><li>셋째</li>'));
  assert.ok(html.includes('<p>정답</p>'));
});

test('HTML escaping, offline font, mobile viewport, print page and spoiler labels', () => {
  const html = renderHTML({ title: '<제목>', questions: [fixture] }, fonts);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt; &amp; &quot;문제&quot;'));
  assert.ok(html.includes('data:font/woff2;base64,'));
  assert.ok(html.includes('width=device-width,initial-scale=1'));
  assert.ok(html.includes('@media(max-width:390px)'));
  assert.ok(html.includes('size:110mm 180mm'));
  assert.ok(html.includes('break-after:page'));
  assert.ok(!/<(?:script|link|img)\b/.test(html));
  for (const label of ['진행자 전용 · 정답 포함', '문제', '힌트', '정답', '해설']) assert.ok(html.includes(label));
});

test('reject malformed input, answer removal, OX hints, duplicates and unknown categories', () => {
  const wrap = (q) => [{ id: 'saints', title: '성인', questions: [q] }, { id: 'church', title: '성당', questions: [{ ...fixture, id: 'other' }] }];
  for (const q of [
    { ...fixture, hint: { kind: 'eliminate', eliminatedIndices: [1] } },
    { ...fixture, hint: { kind: 'eliminate', eliminatedIndices: [3] } },
    { ...fixture, hint: { kind: 'eliminate', eliminatedIndices: [0, 0] } },
    { ...fixture, type: 'ox', hint: { kind: 'text', text: '불가' } },
    { ...fixture, hint: { kind: 'unknown' } },
    { ...fixture, answerIndex: 0 },
  ]) assert.throws(() => validateCategories(wrap(q)), /Invalid/);
  assert.throws(() => validateCategories(wrap({ ...fixture, id: 'other' })), /Invalid/);
  assert.throws(() => validateCategories([]), /Expected saints/);
});

test('CLI rejects incomplete/unknown arguments and enables optional PDF', () => {
  assert.deepEqual(parseArgs([]), { output: join(ROOT, 'exports/presenter'), pdf: false });
  assert.equal(parseArgs(['--pdf', '--output', '/private-documents']).pdf, true);
  assert.throws(() => parseArgs(['--output']), /incomplete/);
  assert.throws(() => parseArgs(['--unknown']), /Unknown/);
});

test('public/dist and symlink destinations cannot receive answer documents', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'presenter-safety-'));
  try {
    await mkdir(join(temp, 'public'));
    await mkdir(join(temp, 'dist'));
    await symlink(join(temp, 'public'), join(temp, 'alias'));
    await symlink(join(temp, 'public', 'dangling.html'), join(temp, 'dangling'));
    for (const path of ['public', 'public/sub', 'dist/sub', 'alias/sub', 'dangling']) await assert.rejects(assertPrivateOutput(join(temp, path), temp), /Refusing/);
    assert.equal(await assertPrivateOutput(join(temp, 'exports/presenter'), temp), join(temp, 'exports/presenter'));
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('real export is deterministic with exact hashes/counts, private artifacts and font license', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'presenter-export-'));
  try {
    const first = await exportDocuments({ output: join(temp, 'first') });
    const second = await exportDocuments({ output: join(temp, 'second') });
    assert.deepEqual(first.manifest, second.manifest);
    assert.equal(first.manifest.source.sha256, sha256(await readFile(join(ROOT, 'src/data/quizzes.json'))));
    assert.equal(first.manifest.hintFormatter.source, 'src/data/hints.ts');
    assert.equal(first.manifest.hintFormatter.sha256, sha256(await readFile(join(ROOT, 'src/data/hints.ts'))));
    assert.equal(first.manifest.totalQuestions, categories.reduce((n, c) => n + c.questions.length, 0));
    assert.deepEqual(first.manifest.categories.map((c) => c.questionIds), categories.map((c) => c.questions.map((q) => q.id)));
    for (const file of first.files) assert.deepEqual(await readFile(join(first.output, file)), await readFile(join(second.output, file)));
    for (const artifact of first.manifest.artifacts) {
      const bytes = await readFile(join(first.output, artifact.file));
      assert.equal(sha256(bytes), artifact.sha256);
      assert.equal(bytes.length, artifact.bytes);
    }
    const html = await readFile(join(first.output, 'saints-presenter.html'), 'utf8');
    assert.ok(html.includes('Font license'));
    assert.ok(html.includes('SIL OPEN FONT LICENSE'));
    await symlink(join(temp, 'not-created.html'), join(first.output, 'church-presenter.pdf'));
    // A non-PDF run must not follow irrelevant stale artifacts.
    await exportDocuments({ output: first.output });
    await rm(join(first.output, 'saints-presenter.html'));
    await symlink(join(temp, 'not-created.html'), join(first.output, 'saints-presenter.html'));
    await assert.rejects(exportDocuments({ output: first.output }), /Refusing/);
  } finally { await rm(temp, { recursive: true, force: true }); }
});
