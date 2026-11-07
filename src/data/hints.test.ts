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
    expect(validateContent(withHint({ kind: 'text', text: '문장 속 두 대상의 관계를 구분해 보세요.' }, 1))).toBe(true);
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
  it('allows only text clues for OX and rejects answer labels, mismatched kinds and duplicate candidates', () => {
    expect(validateContent(withHint({ kind: 'eliminate', eliminatedIndices: [0, 1] }, 1))).toBe(false);
    expect(validateContent(withHint({ kind: 'options', choices: ['O', 'X', '기타'] }, 1))).toBe(false);
    for (const text of ['정답은 O예요.', '정답은 X예요.', '답: o', '답: x']) {
      expect(validateContent(withHint({ kind: 'text', text }, 1))).toBe(false);
    }
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
  it('provides a real hint for every production question and retains the approved warm-up order', () => {
    const saints = raw.find(category => category.id === 'saints')!;
    const church = raw.find(category => category.id === 'church')!;
    expect(saints.questions.slice(0, 4).map(question => question.id)).toEqual(['saints-01', 'saints-10', 'saints-18', 'saints-20']);
    for (const category of [saints, church]) {
      expect(category.questions.filter(question => 'hint' in question).map(question => question.id)).toEqual(category.questions.map(question => question.id));
    }
    expect(validateContent(raw, { requireHints: true })).toBe(true);
  });
  it('fails closed when required production hint coverage regresses', () => {
    const missing = structuredClone(raw);
    Reflect.deleteProperty(missing[0].questions[0], 'hint');
    expect(validateContent(missing, { requireHints: true })).toBe(false);
    expect(validateContent(fixture)).toBe(true);
  });
  it('retains the six previously approved hints', () => {
    const hints = Object.fromEntries(raw.flatMap(category => category.questions).map(question => [question.id, (question as typeof question & { hint?: unknown }).hint]));
    expect(hints['saints-03']).toEqual({ kind: 'eliminate', eliminatedIndices: [1, 4] });
    expect(hints['saints-16']).toEqual({ kind: 'text', text: '이름은 ‘모’로 시작해요.' });
    expect(hints['saints-17']).toEqual({ kind: 'options', choices: ['베네딕토', '암브로시오', '프란치스코'] });
    expect(hints['church-03']).toEqual({ kind: 'eliminate', eliminatedIndices: [1, 4] });
    expect(hints['church-16']).toEqual({ kind: 'text', text: '이름은 ‘감’으로 시작해요.' });
    expect(hints['church-20']).toEqual({ kind: 'text', text: '성사의 이름은 ‘견’으로 시작해요.' });
  });
});
