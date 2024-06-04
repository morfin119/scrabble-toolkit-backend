import 'reflect-metadata';
import {Model} from 'mongoose';
import {injectable, inject} from 'tsyringe';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

@injectable()
export default class TileSetService {
  private readonly tileSetModel: Model<ITileSet>;

  constructor(@inject('TILESET_MODEL') tileSetModel: Model<ITileSet>) {
    this.tileSetModel = tileSetModel;
  }

  /**
   * Returns an array with all available tile sets.
   *
   * @returns An array containing all available tile sets.
   */
  async findAll() {
    return this.tileSetModel.find().lean().exec();
  }

  /**
   * Retrieves a Scrabble tile set based on the specified language.
   *
   * @param language
   * The language of the tile set to retrieve.
   * @returns
   * The ScrabbleTileSet corresponding to the specified language, or undefined
   * if not found.
   */
  async findByLanguage(language: string) {
    return this.tileSetModel.findOne({language: language}).lean().exec();
  }
}
