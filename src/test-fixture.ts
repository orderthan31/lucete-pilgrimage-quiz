import type { Category, Question } from './data/types';
// Test-only content, never imported by production.
export const fixture: Category[] = (['saints', 'church'] as const).map(id => ({
  id, title: id === 'saints' ? '성인 퀴즈' : '성당 상식 퀴즈', description: '테스트용 설명',
  questions: Array.from({ length: 20 }, (_, i): Question => {
    const base = { id: `${id}-${i + 1}`, question: `${i + 1}번째 테스트 질문`, explanation: `공개 뒤에만 보이는 해설 ${i + 1}`, difficulty: 'easy', sources: [{ label: '테스트 출처', url: 'https://example.org' }] } as const;
    if (i % 3 === 2) return { ...base, sources: [...base.sources], type: 'short-answer', answer: '숨겨진 단답', acceptedAnswers: ['숨겨진 단답', '허용 표현'] };
    if (i % 3 === 1) return { ...base, sources: [...base.sources], type: 'ox', answer: 'O', choices: ['O', 'X'], answerIndex: 0 };
    return { ...base, sources: [...base.sources], type: 'multiple-choice', choices: ['첫 보기', '둘째 보기', '셋째 보기', '넷째 보기', '다섯째 보기'], answer: '둘째 보기', answerIndex: 1 };
  }),
}));
