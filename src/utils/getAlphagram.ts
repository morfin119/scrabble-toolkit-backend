import {ScrabbleTileSet} from '@src/types';

/**
 * Generates an alphagram (a string of sorted letters) from the input word,
 * considering valid three character letters, two character letters, and single
 * character letters.
 *
 * NOTE: If a letter is invalid, that is, not part of the provided array of
 * valid letters, it is ignored and no error is thrown.
 *
 * @param word
 * The word to create an alphagram from.
 * @param validLetters
 * An array of valid single letters, digraphs, and trigraphs.
 * @returns
 * The alphagram of the given word in uppercase.
 */
function getAlphagram(word: string, validLetters: string[]): string {
  const letters: string[] = [];

  let i = 0;
  while (i < word.length) {
    // Handle two character letters
    if (i + 2 < word.length) {
      const trigraph = word.slice(i, i + 3);
      if (validLetters.includes(trigraph)) {
        letters.push(trigraph);
        i += 3;
      }
    }

    // Handle three character letters
    if (i + 1 < word.length) {
      const digraph = word.slice(i, i + 2);
      if (validLetters.includes(digraph)) {
        letters.push(digraph);
        i += 2;
      }
    }

    // Handle single character letters
    const letter = word[i];
    if (validLetters.includes(letter)) {
      letters.push(letter);
    }

    i++;
  }

  return letters.sort().join('');
}

export default getAlphagram;
