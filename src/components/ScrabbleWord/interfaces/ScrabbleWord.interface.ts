export interface IScrabbleWord {
  word: string;
  definition: string;
  alphagram: string;
  front_hooks: string[];
  back_hooks: string[];
  value: number;
  word_list: string;
  language: string;
}
