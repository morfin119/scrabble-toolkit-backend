export interface IEnrichedWord {
  word: string;
  definition: string;
  alphagram: string;
  frontHooks: string[];
  backHooks: string[];
  value: number;
  wordListName: string;
  tileSetName: string;
}
