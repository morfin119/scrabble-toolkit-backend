/* eslint-disable node/no-unpublished-import */
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import tileSetSchema from '@components/TileSet/schemas/TileSet.schema';
import TileSetService from '@components/TileSet/TileSet.service';

// Mock data
const mockTileSets: ITileSet[] = [
  {language: 'en', tiles: [{letter: 'A', points: 1, count: 9}]},
  {language: 'es', tiles: [{letter: 'A', points: 1, count: 12}]},
];

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db?.dropDatabase();
});

afterEach(async () => {
  await mongoose.connection.db?.dropDatabase();
});

describe('Tile Set service', () => {
  describe('findAll()', () => {
    it('should find all available tile sets', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);
      await TileSetModel.create(mockTileSets);

      // Act
      let result = await tileSetService.findAll();
      result = result.sort((a, b) => a.language.localeCompare(b.language));

      // Assert
      expect(result?.length).toEqual(mockTileSets.length);
      expect(result).toMatchObject(mockTileSets);
    });
    it('should return an empty array when there are no tile sets', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);

      // Act
      let result = await tileSetService.findAll();
      result = result.sort((a, b) => a.language.localeCompare(b.language));

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByLanguage()', () => {
    it('should return the tile set for the specified language', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);
      await TileSetModel.create(mockTileSets);

      // Act
      const result = await tileSetService.findByLanguage('en');

      // Assert
      expect(result).toMatchObject(mockTileSets[0]);
    });

    it('should return null if the tile set for the specified language is not found', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);
      await TileSetModel.create(mockTileSets);

      // Act
      const result = await tileSetService.findByLanguage('pt');

      // Assert
      expect(result).toBeNull();
    });
  });
});
