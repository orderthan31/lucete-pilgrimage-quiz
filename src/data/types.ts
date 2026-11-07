export type CategoryId = 'saints' | 'church';
export type QuestionHint =
  | { kind: 'eliminate'; eliminatedIndices: number[] }
  | { kind: 'text'; text: string }
  | { kind: 'options'; choices: string[] };
export interface Question {
  id: string;
  type: 'multiple-choice' | 'ox' | 'short-answer';
  question: string;
  choices?: string[];
  answer: string;
  answerIndex?: number;
  acceptedAnswers?: string[];
  explanation: string;
  sources: { label: string; url: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: QuestionHint;
}
export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  questions: Question[];
}
