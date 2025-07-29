/**
 * Script to process a raw word list file and generate an enriched CSV output.
 */
import fs from 'fs';
import path from 'path';
import {
  calculateWordValue,
  findHooks,
  getAlphagram,
} from '@src/utils/scrabbleWordUtils';

import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import {IEnrichedWord} from '@components/EnrichedWord/interfaces/EnrichedWord.interface';

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
 * @param wordListName
 * The name of the wordlist the word is from.
 * @param tileSetName
 * The name of the tileset used to enrich the word.
 * @returns
 * The enriched word list entry.
 */
function enrichWordListEntry(
  entry: {word: string; definition: string},
  validWords: Set<string>,
  validLetters: Set<string>,
  letterValues: Map<string, number>,
  wordListName: string,
  tileSetName: string
): IEnrichedWord {
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
    wordListName: wordListName,
    tileSetName: tileSetName,
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

function flushBatchToCsv(
  buffer: IEnrichedWord[],
  outputStream: fs.WriteStream
): void {
  for (const entry of buffer) {
    const csvLine =
      [
        `"${entry.word}"`,
        `"${entry.definition.replace(/"/g, '""')}"`,
        `"${entry.alphagram}"`,
        `"${entry.frontHooks.join('')}"`,
        `"${entry.backHooks.join('')}"`,
        entry.value,
        `"${entry.wordListName}"`,
        `"${entry.tileSetName}"`,
      ].join(',') + '\n';
    outputStream.write(csvLine);
  }
}

async function main(): Promise<void> {
  const [wordListPath, tileSetPath, outputPath] = process.argv.slice(2);

  if (!wordListPath || !tileSetPath || !outputPath) {
    console.error(
      'Usage: npx ts-node enrichWordList.ts <wordListPath> <tileSetPath> <outputPath>'
    );
    process.exitCode = 1;
    return;
  }

  try {
    const BATCH_SIZE = 100;
    const wordListName = path.parse(wordListPath).name;

    const wordListContent = fs.readFileSync(wordListPath, 'utf-8');
    const wordListEntries = parseWordListEntries(wordListContent);
    const validWords = new Set(wordListEntries.map(entry => entry.word));

    const tileSetContent = fs.readFileSync(tileSetPath, 'utf-8');
    const tilesetData = JSON.parse(tileSetContent) as ITileSet;
    const validLetters = new Set(tilesetData.tiles.map(tile => tile.letter));
    const letterValues = new Map(
      tilesetData.tiles.map(tile => [tile.letter, tile.points])
    );

    const outputStream = fs.createWriteStream(outputPath);
    outputStream.write(
      'word,definition,alphagram,frontHooks,backHooks,value,wordListName,tileSetName\n'
    );

    let buffer: IEnrichedWord[] = [];
    for (const entry of wordListEntries) {
      const enrichedEntry = enrichWordListEntry(
        entry,
        validWords,
        validLetters,
        letterValues,
        wordListName,
        tilesetData.name
      );
      buffer.push(enrichedEntry);
      if (buffer.length >= BATCH_SIZE) {
        flushBatchToCsv(buffer, outputStream);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      flushBatchToCsv(buffer, outputStream);
    }

    outputStream.end();
    console.log(`Finished. Output written to: ${outputPath}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Unexpected error: ' + error);
    }
  }
}

main();
