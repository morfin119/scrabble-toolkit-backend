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
import mongoose from 'mongoose';
import TileSetModel from '@components/TileSet/models/TileSet.model';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

/**
 * Inserts tile set data into the MongoDB if it's not already present.
 * @param data The parsed tile set data.
 * @returns A promise that resolves when the processing is complete.
 */
async function seedTileSet(data: ITileSet): Promise<void> {
  const tileSetExists = await TileSetModel.exists({language: data.language});

  if (tileSetExists) {
    console.log(`Tile set for language '${data.language}' already exists.`);
  } else {
    const newTileSet = new TileSetModel(data);
    await newTileSet.save();
    console.log(`Tile set for language '${data.language}' added successfully`);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mongoURI = args[0];
  const dataPath = args[1];

  if (!mongoURI || !dataPath) {
    console.error('Usage: node script.js <mongoURI> <dataPath>');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log(`Successfully connected to ${mongoURI}`);

    const files = fs.readdirSync(dataPath);
    for (const file of files) {
      const filePath = path.join(dataPath, file);
      if (path.extname(filePath) === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const tilesetData = JSON.parse(fileContent) as ITileSet;
        await seedTileSet(tilesetData);
      }
    }
    console.log(`Tile sets successfully loaded from ${dataPath}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Unexpected error: ' + error);
    }
  } finally {
    await mongoose.connection.close();
  }
}

main();
