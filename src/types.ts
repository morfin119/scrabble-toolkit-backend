export interface WordList {
  name: string;
  language: string;
  entries: {
    word: string;
    definition: string;
  }[];
}

export interface EnhancedWordList {
  name: string;
  language: string;
  entries: {
    word: string;
    definition: string;
    alphagram: string;
    front_hooks: Set<string>;
    back_hooks: Set<string>;
    value: number;
  }[];
}
