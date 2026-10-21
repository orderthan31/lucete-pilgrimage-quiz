import type { Category } from './types';
import { validateContent } from './validation';
export { validateContent } from './validation';
const files = import.meta.glob('./quizzes.json', { eager: true, import: 'default' });
const raw = files['./quizzes.json'];
export const contentUnavailable = raw === undefined ? '퀴즈를 준비하고 있어요.' : '퀴즈 데이터를 확인해 주세요. 형식이 올바르지 않습니다.';
export const categories: Category[] = validateContent(raw) ? raw : [];
