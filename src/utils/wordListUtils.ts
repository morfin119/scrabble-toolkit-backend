import {isISO6391} from 'validator';
import {WordList} from '@src/types';

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
