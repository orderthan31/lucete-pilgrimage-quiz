import { describe, expect, it, vi } from 'vitest';
import { fixture } from './test-fixture';
import { readProgress, saveProgress, validateProgress } from './progress';
const c = fixture[0];
const valid = { version: 1, categoryId: 'saints', questionId: 'saints-4', index: 3, completed: false };
describe('versioned progress', () => {
  it('accepts only a valid position with the matching stable ID', () => {
    expect(validateProgress(valid, c)).toEqual(valid);
    for (const change of [{ version: 2 }, { categoryId: 'church' }, { categoryId: 'unknown' }, { index: -1 }, { index: 20 }, { index: 2.5 }, { index: '3' }, { questionId: 'removed-question' }, { completed: 'yes' }, { completed: true }]) expect(validateProgress({ ...valid, ...change }, c)).toBeNull();
    for (const raw of [null, [], 'bad', 0, {}]) expect(validateProgress(raw, c)).toBeNull();
  });
  it('does not restore extra persisted reveal state', () => {
    expect(validateProgress({ ...valid, revealed: true, answer: 'secret' }, c)).toEqual(valid);
  });
  it('roundtrips and tolerates unavailable storage', () => {
    expect(saveProgress(c, 3)).toBe(true); expect(readProgress(c)).toEqual(valid);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error(); });
    expect(readProgress(c)).toBeNull();
  });
});
