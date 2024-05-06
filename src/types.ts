export interface ScrabbleTileSet {
  language: string;
  tiles: {
    [key: string]: {
      points: number;
      count: number;
    };
  };
}
