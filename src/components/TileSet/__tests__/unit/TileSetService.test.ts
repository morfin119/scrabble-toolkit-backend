import {ScrabbleTileSet} from '@src/types';
import TileSetService from '../../TileSetService';

// Mock data
const mockTileSets: ScrabbleTileSet[] = [
  {language: 'en', tiles: {A: {points: 1, count: 9}}},
  {language: 'es', tiles: {A: {points: 1, count: 12}}},
];

describe('TileSetService', () => {
  let tileSetService: TileSetService;

  beforeEach(() => {
    tileSetService = new TileSetService(mockTileSets);
  });

  describe('getAllTileSets', () => {
    it('should return all available tile sets', () => {
      const result = tileSetService.getAllTileSets();
      expect(result).toEqual(mockTileSets);
    });
  });

  describe('getTileSet', () => {
    it('should return the tile set for the specified language', () => {
      const result = tileSetService.getTileSet('en');
      expect(result).toEqual(mockTileSets[0]);
    });

    it(
      'should return undefined if the tile set for the specified language ' +
        'is not found',
      () => {
        const result = tileSetService.getTileSet('pt');
        expect(result).toBeUndefined();
      }
    );
  });
});
