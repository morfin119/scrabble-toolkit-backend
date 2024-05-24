export interface ScrabbleTileSet {
  language: string;
  tiles: {
    [key: string]: {
      points: number;
      count: number;
    };
  };
}

export interface WordList {
  name: string;
  language: string;
  entries: {
    word: string;
    definition: string;
  }[];
}
