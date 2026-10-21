import type { Category } from './data/types';
export const progressKey = (id: string) => `lucete:progress:${id}`;
export interface Progress { version: 1; categoryId: string; questionId: string; index: number; completed: boolean }
export function validateProgress(raw: unknown, category: Category): Progress | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<Progress>;
  if (p.version !== 1 || p.categoryId !== category.id || !Number.isInteger(p.index) || p.index! < 0 || p.index! >= category.questions.length || p.questionId !== category.questions[p.index!]?.id || typeof p.completed !== 'boolean' || (p.completed && p.index !== category.questions.length - 1)) return null;
  return { version: 1, categoryId: category.id, questionId: p.questionId, index: p.index!, completed: p.completed };
}
export function readProgress(category: Category): Progress | null {
  try { return validateProgress(JSON.parse(localStorage.getItem(progressKey(category.id)) || 'null'), category); } catch { return null; }
}
export function saveProgress(category: Category, index: number, completed = false): boolean {
  try {
    localStorage.setItem(progressKey(category.id), JSON.stringify({ version: 1, categoryId: category.id, questionId: category.questions[index].id, index, completed }));
    return true;
  } catch { return false; }
}
