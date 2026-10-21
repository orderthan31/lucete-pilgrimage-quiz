import type { Category } from './types';

export function validateContent(value: unknown): value is Category[] {
  if (!Array.isArray(value) || value.length !== 2) return false;
  const ids = new Set<string>();
  const questionIds = new Set<string>();
  for (const c of value) {
    if (!c || !['saints', 'church'].includes(c.id) || ids.has(c.id) || typeof c.title !== 'string' || !c.title.trim() || typeof c.description !== 'string' || !c.description.trim() || !Array.isArray(c.questions) || c.questions.length !== 20) return false;
    ids.add(c.id);
    for (const q of c.questions) {
      if (!q || typeof q.id !== 'string' || !q.id || questionIds.has(q.id) || typeof q.question !== 'string' || !q.question.trim() || typeof q.answer !== 'string' || !q.answer.trim() || typeof q.explanation !== 'string' || !q.explanation.trim() || !['easy', 'medium', 'hard'].includes(q.difficulty)) return false;
      questionIds.add(q.id);
      if (!Array.isArray(q.sources) || !q.sources.length || q.sources.some((s: { label: unknown; url: unknown }) => !s || typeof s.label !== 'string' || !s.label || typeof s.url !== 'string' || !/^https?:\/\//.test(s.url))) return false;
      if (q.type === 'short-answer') {
        if (q.answerIndex !== undefined || !Array.isArray(q.acceptedAnswers) || !q.acceptedAnswers.includes(q.answer) || q.acceptedAnswers.some((a: unknown) => typeof a !== 'string' || !a.trim())) return false;
      } else if (q.type === 'multiple-choice' || q.type === 'ox') {
        if (!Array.isArray(q.choices) || q.choices.length !== (q.type === 'ox' ? 2 : 5) || q.choices.some((a: unknown) => typeof a !== 'string' || !a.trim()) || new Set(q.choices).size !== q.choices.length || !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.choices.length || q.choices[q.answerIndex] !== q.answer) return false;
        if (q.type === 'ox' && (q.choices[0] !== 'O' || q.choices[1] !== 'X')) return false;
      } else return false;
    }
    if (new Set(c.questions.map((q: { type: string }) => q.type)).size !== 3) return false;
  }
  return true;
}
