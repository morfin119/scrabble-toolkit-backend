import 'reflect-metadata'; // tsyringe
import {inject, injectable} from 'tsyringe';
import {ScrabbleTileSet} from '@src/types';

@injectable()
export default class TileSetService {
  private readonly tileSets: ScrabbleTileSet[];

  constructor(@inject('AVAILABLE_TILESETS') tileSets: ScrabbleTileSet[]) {
    this.tileSets = tileSets;
  }

  /**
   * Returns an array with all available tile sets.
   *
   * @returns An array containing all available tile sets.
   */
  getAllTileSets(): ScrabbleTileSet[] {
    return this.tileSets;
  }

  /**
   * Retrieves a Scrabble tile set based on the specified language.
   *
   * @param language
   * The language of the tile set to retrieve.
   * @returns
   * The ScrabbleTileSet corresponding to the specified language, or undefined if
   * not found.
   */
  getTileSet(language: string): ScrabbleTileSet | undefined {
    return this.tileSets.find(tileSet => tileSet.language === language);
  }
}
