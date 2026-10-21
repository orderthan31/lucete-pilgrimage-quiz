import { readFileSync } from 'node:fs';
import { validateContent } from '../src/data/validation.ts';
const path = new URL('../src/data/quizzes.json', import.meta.url);
try {
  const content = JSON.parse(readFileSync(path, 'utf8'));
  if (!validateContent(content)) throw new Error('Expected two categories, twenty questions each, unique stable IDs, all three formats, valid answers and sources.');
  console.log(`Content valid: ${content.length} categories, ${content.reduce((n, c) => n + c.questions.length, 0)} questions.`);
} catch (error) { console.error('Content validation failed:', error.message); process.exitCode = 1; }
