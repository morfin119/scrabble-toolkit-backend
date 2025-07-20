/* eslint-disable node/no-unpublished-import */
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import tileSetSchema from '@components/TileSet/schemas/TileSet.schema';
import TileSetService from '@components/TileSet/TileSet.service';

// Mock data
const mockTileSets: ITileSet[] = [
  {
    name: 'EN_Standard',
    language: 'en',
    tiles: [{letter: 'A', points: 1, count: 9}],
  },
  {
    name: 'ES_Standard',
    language: 'es',
    tiles: [{letter: 'A', points: 1, count: 12}],
  },
  {
    name: 'ES_US',
    language: 'es',
    tiles: [{letter: 'A', points: 1, count: 11}],
  },
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
      result = result.sort((a, b) => a.name.localeCompare(b.name));

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
      result = result.sort((a, b) => a.name.localeCompare(b.name));

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByLanguage()', () => {
    it('should return all tile sets for the specified language', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);
      await TileSetModel.create(mockTileSets);

      // Act
      let result = await tileSetService.findByLanguage('es');
      result = result.sort((a, b) => a.name.localeCompare(b.name));

      // Assert
      expect(result).toMatchObject([mockTileSets[1], mockTileSets[2]]);
    });

    it('should return an empty array if no tile sets for the specified language are found', async () => {
      // Arrange
      const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
      const tileSetService = new TileSetService(TileSetModel);
      await TileSetModel.create(mockTileSets);

      // Act
      const result = await tileSetService.findByLanguage('pt');

      // Assert
      expect(result).toMatchObject([]);
    });
  });
});
