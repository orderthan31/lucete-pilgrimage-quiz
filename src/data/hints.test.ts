import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { validateContent } from './validation';
import { fixture } from '../test-fixture';
import raw from './quizzes.json';

const withHint = (hint: unknown, index = 0) => {
  const data = structuredClone(fixture);
  Object.assign(data[0].questions[index], { hint });
  return data;
};

describe('hint content contract', () => {
  it('accepts one optional, type-appropriate hint', () => {
    expect(validateContent(withHint({ kind: 'eliminate', eliminatedIndices: [0, 3] }))).toBe(true);
    expect(validateContent(withHint({ kind: 'text', text: '첫 글자를 떠올려 보세요.' }, 2))).toBe(true);
    expect(validateContent(withHint({ kind: 'options', choices: ['후보 하나', '숨겨진 단답', '후보 셋'] }, 2))).toBe(true);
  });
  it.each([
    null, {}, { kind: 'unknown' }, { kind: 'text', text: '' }, { kind: 'text', text: '   ' },
    { kind: 'eliminate', eliminatedIndices: [0, 1] },
    { kind: 'eliminate', eliminatedIndices: [0, 0] },
    { kind: 'eliminate', eliminatedIndices: [0, 9] },
    { kind: 'eliminate', eliminatedIndices: [0] },
    { kind: 'eliminate', eliminatedIndices: ['0', 3] },
    { kind: 'options', choices: ['첫 보기', '둘째 보기', '셋째 보기'] },
  ])('rejects malformed or answer-eliminating hints: %j', hint => {
    expect(validateContent(withHint(hint))).toBe(false);
  });
  it('rejects OX hints, mismatched hint kinds, duplicate candidates and direct-answer text', () => {
    expect(validateContent(withHint({ kind: 'text', text: '생각해 보세요.' }, 1))).toBe(false);
    expect(validateContent(withHint({ kind: 'eliminate', eliminatedIndices: [0, 1] }, 2))).toBe(false);
    expect(validateContent(withHint({ kind: 'options', choices: ['숨겨진 단답', '후보', '후보'] }, 2))).toBe(false);
    expect(validateContent(withHint({ kind: 'options', choices: ['하나', '둘', '셋'] }, 2))).toBe(false);
    expect(validateContent(withHint({ kind: 'text', text: '숨겨진 단답' }, 2))).toBe(false);
  });
  it('retains every original question, choice, answer, variant, explanation and source unchanged', () => {
    const normalized = raw.map(category => ({ ...category, questions: category.questions.map(question => {
      const { hint: _hint, ...original } = question as typeof question & { hint?: unknown };
      return original;
    }).sort((a, b) => a.id.localeCompare(b.id)) }));
    expect(createHash('sha256').update(JSON.stringify(normalized)).digest('hex')).toBe('fbd687e40850cde2dc030ee392a9d85ef15832b0ca485dbfbff6a7c94f124bc2');
  });
  it('uses targeted hints in both categories and starts saints with familiar warm-up questions', () => {
    const saints = raw.find(category => category.id === 'saints')!;
    const church = raw.find(category => category.id === 'church')!;
    expect(saints.questions.slice(0, 4).map(question => question.id)).toEqual(['saints-01', 'saints-10', 'saints-18', 'saints-20']);
    const hintedIds = (questions: typeof saints.questions) => questions.filter(question => 'hint' in question).map(question => question.id).sort();
    expect(hintedIds(saints.questions)).toEqual(['saints-03', 'saints-16', 'saints-17']);
    expect(hintedIds(church.questions)).toEqual(['church-03', 'church-16', 'church-20']);
  });
});
