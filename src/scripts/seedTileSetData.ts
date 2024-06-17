/**
 * Script to load and insert tile set data from a given directory into a MongoDB
 * database.
 *
 * This script is intended to be executed once during the initial system
 * deployment. It populates the database with tile set data necessary for the
 * application.
 */
import fs from 'fs';
import path from 'path';
import mongoose, {Model} from 'mongoose';
import tileSetSchema from '@components/TileSet/schemas/TileSet.schema';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

/**
 * Inserts tile set data into the MongoDB if it's not already present.
 * @param data
 * The tile set data to be inserted.
 * @param TileSetModel
 * The Mongoose model for the tile set.
 * @returns
 * A promise that resolves when the processing is complete.
 */
async function seedTileSet(
  data: ITileSet,
  TileSetModel: Model<ITileSet>
): Promise<void> {
  try {
    const tileSetExists = await TileSetModel.exists({language: data.language});

    if (tileSetExists) {
      console.warn(`Tile set for language '${data.language}' already exists.`);
    } else {
      const newTileSet = new TileSetModel(data);
      await newTileSet.save();
      console.log(
        `Tile set for language '${data.language}' added successfully`
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Failed to seed tile set for language '${data.language}': ${error.message}`
      );
    }
  }
}

async function main(): Promise<void> {
  const [dataPath, mongoURI] = process.argv.slice(2);

  if (!dataPath || !mongoURI) {
    console.error(
      'Usage: npx ts-node seedTileSetData.ts <dataPath> <mongoURI>'
    );
    process.exitCode = 1;
    return;
  }

  let conn: mongoose.Connection | null = null;

  try {
    conn = await mongoose.createConnection(mongoURI).asPromise();
    console.log('Successfully connected to MongoDB');

    const files = fs.readdirSync(dataPath);
    for (const file of files) {
      const filePath = path.join(dataPath, file);
      if (path.extname(filePath) === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const tilesetData = JSON.parse(fileContent) as ITileSet;
        await seedTileSet(
          tilesetData,
          conn.model<ITileSet>('TileSet', tileSetSchema)
        );
      }
    }
    console.log(`Tile sets successfully loaded from ${dataPath}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Unexpected error: ' + error);
    }
  } finally {
    await conn?.close();
  }
}

main();
