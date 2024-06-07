import fs from 'fs';
import {isISO6391} from 'validator';
import {IScrabbleWord} from '@components/ScrabbleWord/interfaces/ScrabbleWord.interface';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import {
  calculateWordValue,
  findHooks,
  getAlphagram,
} from '@utils/scrabbleWordUtils';

export interface IWordList {
  name: string;
  language: string;
  entries: {
    word: string;
    definition: string;
  }[];
}

/**
 * Parses a text-based word list into a structure WordList object.
 *
 * The input text should follow this format:
 * - First line: Name of the word list.
 * - Second line: Language code (ISO 639-1).
 * - Third line: Must be blank.
 * - Subsequent lines: Each line consists of a term in upper case.
 *   - Optional Definition: Follows the term, separated by a space.
 *
 * @param {string} text
 * The input text representing the word list.
 * @returns
 * The parsed word list object.
 * @throws {Error}
 * If the input text is not in the correct format.
 */
export function parseTxtWordList(text: string): IWordList {
  const lines = text.split('\n').map(line => line.trim());

  const wordListName = lines[0];
  if (!wordListName) {
    throw new Error(
      'Invalid file format: The name of the word list is missing.'
    );
  }

  const wordListLanguage = lines[1];
  if (!wordListLanguage || !isISO6391(wordListLanguage)) {
    throw new Error(
      `Invalid language code: ${wordListLanguage}. It must be a valid ISO 3166-1 code.`
    );
  }

  if (lines[2] !== '') {
    throw new Error('Invalid file format: The third line must be blank.');
  }

  const entries = lines.slice(3).filter(line => line !== '');

  const processedEntries = entries.map(line => {
    line = line.trim();
    const word = line.split(' ')[0];
    const definition = line.split(' ').slice(1).join(' ');
    return {word, definition};
  });

  return {
    name: wordListName,
    language: wordListLanguage,
    entries: processedEntries,
  } as IWordList;
}

/**
 * Enriches word list entries with Scrabble-specific details.
 *
 * This function takes a WordList object and a ScrabbleTileSet object, then
 * enhances each word entry in the list with its alphagram, front/back hooks,
 * value, the name of the word list, and the language.
 *
 * @param wordList
 * The original word list to enrich.
 * @param tileSet
 * The tile set used to compute alphagrams, hooks, and values.
 * @returns
 * A new array containing enriched Scrabble word entries.
 */
export function enrichWordListEntries(
  wordList: IWordList,
  tileSet: ITileSet
): IScrabbleWord[] {
  const entries = wordList.entries;
  const validWords = new Set(entries.map(entry => entry.word));
  const validLetters = new Set(tileSet.tiles.map(tile => tile.letter));
  const letterValues = new Map(
    tileSet.tiles.map(tile => [tile.letter, tile.points])
  );

  const enrichedEntries = entries.map(entry => {
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
      front_hooks: Array.from(frontHooks),
      back_hooks: Array.from(backHooks),
      value: value,
      word_list: wordList.name,
      language: wordList.language,
    };
  });

  return enrichedEntries;
}

function main() {
  const args = process.argv.slice(2);
  const inputFilePath = args[0];
  const outputFilePath = args[1];
  const tilesetPath = args[2];

  if (!inputFilePath || !outputFilePath || !tilesetPath) {
    console.error(
      'Usage: npx ts-node wordListConverter.js <path_to_input_word_list> ' +
        '<path_to_output_file> <path_to_tile_set>'
    );
    process.exitCode = 1;
    return;
  }

  try {
    const text = fs.readFileSync(inputFilePath, 'utf8');
    const wordList = parseTxtWordList(text);
    const tileSet = JSON.parse(fs.readFileSync(tilesetPath, 'utf-8'));
    const enrichedEntries = enrichWordListEntries(wordList, tileSet);

    fs.writeFileSync(outputFilePath, JSON.stringify(enrichedEntries, null, 2));
    console.log(`Conversion complete. JSON saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error occurred during conversion:', error);
  }
}

// Run the main function if the script is executed directly
if (require.main === module) {
  main();
}
