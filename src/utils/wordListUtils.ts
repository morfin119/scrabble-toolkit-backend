import {isISO6391} from 'validator';
import {EnhancedWordList, ScrabbleTileSet, WordList} from '@src/types';
import {
  calculateWordValue,
  findHooks,
  getAlphagram,
} from '@utils/scrabbleWordUtils';

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
export function parseTxtWordList(text: string): WordList {
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
  } as WordList;
}

/**
 * Enhances a given word list with additional information.
 *
 * This function takes a WordList object and a ScrabbleTileSet object, then
 * enhances each word entry in the list with its alphagram, front/back hooks and
 * value.
 *
 * @param wordList
 * The original word list to enhance.
 * @param tileSet
 * The tile set used to compute alphagrams, hooks, and values.
 * @returns
 * The enhanced word list with additional information.
 */
export function enhanceWordList(
  wordList: WordList,
  tileSet: ScrabbleTileSet
): EnhancedWordList {
  const entries = wordList.entries;
  const validWords = new Set(entries.map(entry => entry.word));
  const validLetters = new Set(Object.keys(tileSet.tiles));
  const letterValues = new Map(
    Object.entries(tileSet.tiles).map(([key, value]) => [key, value.points])
  );

  const enhancedEntries = entries.map(entry => {
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
      front_hooks: frontHooks,
      back_hooks: backHooks,
      value: value,
    };
  });

  return {
    name: wordList.name,
    language: wordList.language,
    entries: enhancedEntries,
  } as EnhancedWordList;
}
