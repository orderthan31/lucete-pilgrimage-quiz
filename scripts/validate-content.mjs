import { readFileSync } from 'node:fs';
import { validateContent } from '../src/data/validation.ts';
const path = new URL('../src/data/quizzes.json', import.meta.url);
try {
  const content = JSON.parse(readFileSync(path, 'utf8'));
  if (!validateContent(content, { requireHints: true })) throw new Error('Expected two categories, twenty questions each, unique stable IDs, all three formats, valid answers, sources and a valid hint for every question.');
  console.log(`Content valid: ${content.length} categories, ${content.reduce((n, c) => n + c.questions.length, 0)} questions, ${content.reduce((n, c) => n + c.questions.filter(q => q.hint).length, 0)} hints.`);
} catch (error) { console.error('Content validation failed:', error.message); process.exitCode = 1; }
