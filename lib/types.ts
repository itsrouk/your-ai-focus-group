export interface ExtractedContext {
  productCategory: string;
  emotionalProblems: string[];
  useCases: string[];
  targetContext: string;
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  personality: string;
  emotionalTendencies: string;
  goals: string;
  fears: string;
}

export interface InterviewResponse {
  personaId: string;
  response: string;
}

export interface ScoredResponse extends InterviewResponse {
  score: number;
  reasoning: string;
}

export interface QuestionRound {
  question: string;
  responses: Map<string, string>;
  scoredResponses: ScoredResponse[];
  isScoring: boolean;
}

export interface AttributedInsight {
  text: string;
  personas?: string[];
}

export interface SynthesisResult {
  averageScore: number;
  overallSentiment: string;
  whatWorked: Array<string | AttributedInsight>;
  whatDidnt: Array<string | AttributedInsight>;
  surprises: string | null;
  recommendation: string;
}

export type AppStep =
  | 'input'
  | 'extracting'
  | 'selecting-personas'
  | 'session'
  | 'results';
