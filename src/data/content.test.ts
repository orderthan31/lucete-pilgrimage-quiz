import { describe, expect, it } from 'vitest';
import { validateContent } from './content';
import { fixture } from '../test-fixture';
const data = import.meta.glob('./quizzes.json', { eager: true, import: 'default' });
describe('content contract', () => {
  it('validates mixed-format fixtures and rejects malformed choices', () => {
    expect(validateContent(fixture)).toBe(true);
    const broken = structuredClone(fixture); broken[0].questions[0].choices = ['same', 'same'];
    expect(validateContent(broken)).toBe(false);
  });
  it('requires exactly forty real questions when production data arrives', () => {
    const raw = data['./quizzes.json'];
    if (raw === undefined) return;
    expect(validateContent(raw), 'Both categories must have twenty valid mixed-format questions').toBe(true);
  });
});
