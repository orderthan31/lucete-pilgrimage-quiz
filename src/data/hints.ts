import type { Question } from './types.ts';

/** Organizer-document wording is derived from the exact same hint as the stage. */
export function hintSummary(question: Question): string {
  const hint = question.hint;
  if (!hint) return '힌트 없음';
  if (hint.kind === 'text') return hint.text;
  if (hint.kind === 'options') return `이름 보기: ${hint.choices.join(' / ')}`;
  const choices = question.choices ?? [];
  const remaining = choices.flatMap((_choice, index) => hint.eliminatedIndices.includes(index) ? [] : [`${index + 1}번`]);
  const removed = hint.eliminatedIndices.map(index => `${index + 1}번`);
  return `제외할 보기: ${removed.join(' / ')}. 남은 보기: ${remaining.join(' / ')}.`;
}
