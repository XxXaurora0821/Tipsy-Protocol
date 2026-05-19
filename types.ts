
export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export type Locale = 'en' | 'zh';

export interface Option {
  id: string;
  label: string;
  trait: string;
}

export interface CocktailRecommendation {
  classic: {
    name: string;
    description: string;
    ingredients: string[];
    origin: string;
  };
  custom: {
    name: string;
    vibe: string;
    flavorNotes: string;
    ingredients: string[];
    garnish: string;
    instructions: string;
  };
  rationale: string;
}

export enum AppState {
  WELCOME,
  QUIZ,
  LOADING,
  RESULT
}
