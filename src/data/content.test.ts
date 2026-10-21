import { describe, expect, it } from 'vitest';
import { validateContent } from './content';
import { fixture } from '../test-fixture';
import audit from '../../docs/content-source-audit.json';
const data = import.meta.glob('./quizzes.json', { eager: true, import: 'default' });
describe('content contract', () => {
  it('validates mixed-format fixtures and rejects malformed choices', () => {
    expect(validateContent(fixture)).toBe(true);
    const broken = structuredClone(fixture); broken[0].questions[0].choices = ['same', 'same'];
    expect(validateContent(broken)).toBe(false);
  });
  it('uses readable Korean Catholic references in every production question', () => {
    const raw = data['./quizzes.json'];
    expect(validateContent(raw)).toBe(true);
    if (!validateContent(raw)) return;
    const approvedHosts = new Set([
      'cbck.or.kr', 'www.cbck.or.kr', 'bible.cbck.or.kr', 'missa.cbck.or.kr',
      'maria.catholic.or.kr', 'www.casuwon.or.kr', 'benedict.or.kr',
    ]);
    for (const category of raw) {
      for (const question of category.questions) {
        for (const source of question.sources) {
          const url = new URL(source.url);
          expect(url.protocol, `${question.id}: secure source`).toBe('https:');
          expect(approvedHosts.has(url.hostname), `${question.id}: verified Korean Catholic publisher`).toBe(true);
          expect(source.label, `${question.id}: readable source label`).toMatch(/[가-힣]/);
          expect(url.pathname, `${question.id}: no English Vatican fallback`).not.toMatch(/\/(en|la)\//);
        }
      }
    }
  });
  it('keeps every question citation aligned with the Korean evidence ledger', () => {
    const raw = data['./quizzes.json'];
    expect(validateContent(raw)).toBe(true);
    if (!validateContent(raw)) return;
    const questions = raw.flatMap(category => category.questions);
    expect(audit.question_count).toBe(40);
    expect(audit.questions.map(row => row.id).sort()).toEqual(questions.map(question => question.id).sort());
    const urls = new Set<string>();
    for (const question of questions) {
      const row = audit.questions.find(entry => entry.id === question.id);
      expect(row?.answer, question.id).toBe(question.answer);
      expect(row?.sources, question.id).toEqual(question.sources);
      expect(new Set(row?.evidence.map(entry => entry.url))).toEqual(new Set(question.sources.map(source => source.url)));
      for (const entry of row?.evidence ?? []) {
        expect(entry.language).toBe('ko');
        expect(entry.http_status).toBe(200);
        expect(entry.locator.trim()).not.toBe('');
        expect(entry.excerpt.trim()).not.toBe('');
        expect(entry.retrieved_text_sha256).toMatch(/^[a-f0-9]{64}$/);
        urls.add(entry.url);
      }
    }
    expect(audit.source_count).toBe(urls.size);
    expect(audit.evidence_count).toBe(audit.questions.reduce((n, row) => n + row.evidence.length, 0));
  });
  it('requires exactly forty real questions when production data arrives', () => {
    const raw = data['./quizzes.json'];
    if (raw === undefined) return;
    expect(validateContent(raw), 'Both categories must have twenty valid mixed-format questions').toBe(true);
  });
});
