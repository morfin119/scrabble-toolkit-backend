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
   * Retrieves a Scrabble tile set by its unique name.
   *
   * @param name
   * The name of the tile set to retrieve.
   * @returns
   * The TileSet matching the specified name, or null if not found.
   */
  async findByName(name: string) {
    return this.tileSetModel.findOne({name}).lean().exec();
  }

  /**
   * Retrieves all Scrabble tile sets for the specified language.
   *
   * @param language
   * The language of the tile sets to retrieve.
   * @returns
   * An array of TileSets for the specified language.
   */
  async findByLanguage(language: string) {
    return this.tileSetModel.find({language: language}).lean().exec();
  }
}
