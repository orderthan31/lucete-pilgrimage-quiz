export type CategoryId = 'saints' | 'church';
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
}
export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  questions: Question[];
}
