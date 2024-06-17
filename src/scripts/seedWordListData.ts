/**
 * Script to load and insert word list entries from a given directory into a
 * MongoDB database.
 *
 * This script is intended to be executed once during the initial system
 * deployment. It populates the database with word list entries necessary for
 * the application.
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import {
  calculateWordValue,
  findHooks,
  getAlphagram,
} from '@src/utils/scrabbleWordUtils';

import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import tileSetSchema from '@components/TileSet/schemas/TileSet.schema';
import {IWordList} from '@components/WordList/interfaces/WordList.interface';
import wordListSchema from '@components/WordList/schemas/WordList.schema';
import {IWordListEntry} from '@components/WordListEntry/interfaces/WordListEntry.interface';
import wordListEntrySchema from '@components/WordListEntry/schemas/WordListEntry.schema';

/**
 * Enriches a word list entry with additional information.
 *
 * @param entry
 * The word list entry containing the word and its definition.
 * @param validWords
 * A set of valid words.
 * @param validLetters
 * A set of valid letters.
 * @param letterValues
 * A map of letter values.
 * @param wordListId
 * The ID of the word list.
 * @returns
 * The enriched word list entry.
 */
function enrichWordListEntry(
  entry: {word: string; definition: string},
  validWords: Set<string>,
  validLetters: Set<string>,
  letterValues: Map<string, number>,
  wordListId: mongoose.Types.ObjectId
): IWordListEntry {
  const alphagram = getAlphagram(entry.word, validLetters);
  const [frontHooks, backHooks] = findHooks(
    entry.word,
    validWords,
    validLetters
  );
  const value = calculateWordValue(entry.word, letterValues);
  return {
    word: entry.word,
    definition: entry.definition,
    alphagram: alphagram,
    frontHooks: Array.from(frontHooks),
    backHooks: Array.from(backHooks),
    value: value,
    wordListId: wordListId,
  };
}

/**
 * Parses the content of a word list file.
 *
 * @param fileContent
 * The content of the word list file.
 * @returns
 * An array of word list entries.
 */
function parseWordListEntries(
  fileContent: string
): {word: string; definition: string}[] {
  const wordListLines = fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  return wordListLines.map(line => {
    const word = line.split(' ')[0];
    const definition = line.split(' ').slice(1).join(' ');
    return {word, definition};
  });
}

async function main(): Promise<void> {
  const [dataPath, mongoURI] = process.argv.slice(2);

  if (!dataPath || !mongoURI) {
    console.error(
      'Usage: npx ts-node seedWordListData.ts <dataPath> <mongoURI>'
    );
    process.exitCode = 1;
    return;
  }

  let conn: mongoose.Connection | null = null;

  try {
    conn = await mongoose.createConnection(mongoURI).asPromise();
    console.log('Successfully connected to MongoDB');

    const TileSetModel = conn.model<ITileSet>('TileSet', tileSetSchema);
    const WordListModel = conn.model<IWordList>('WordList', wordListSchema);
    const WordListEntryModel = conn.model<IWordListEntry>(
      'WordListEntry',
      wordListEntrySchema
    );

    const files = fs.readdirSync(dataPath);
    for (const file of files) {
      const filePath = path.join(dataPath, file);
      if (path.extname(filePath) === '.txt') {
        const [wordListName, wordListTileSet] = path
          .parse(filePath)
          .name.split('_');

        const wordListExists = await WordListModel.findOne({
          name: wordListName,
        }).exec();

        if (wordListExists) {
          console.warn(
            `Skipping: Word List '${wordListName}' already in database`
          );
          continue;
        }

        const tileSet = await TileSetModel.findOne({
          language: wordListTileSet,
        }).exec();

        if (!tileSet) {
          console.warn(
            `Skipping: Tile set '${wordListTileSet}' not found in database`
          );
          continue;
        }

        const wordList = await WordListModel.create({
          name: wordListName,
          tileSetId: tileSet._id,
        });

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const wordListEntries = parseWordListEntries(fileContent);

        const validWords = new Set(wordListEntries.map(entry => entry.word));
        const validLetters = new Set(tileSet.tiles.map(tile => tile.letter));
        const letterValues = new Map(
          tileSet.tiles.map(tile => [tile.letter, tile.points])
        );

        const enrichedEntries = wordListEntries.map(entry =>
          enrichWordListEntry(
            entry,
            validWords,
            validLetters,
            letterValues,
            wordList._id
          )
        );

        await WordListEntryModel.insertMany(enrichedEntries);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Unexpected error: ' + error);
    }
  } finally {
    await conn?.close();
  }
}

main();
