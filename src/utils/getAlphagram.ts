import {ScrabbleTileSet} from '@src/types';

/**
 * Generates an alphagram from the given word based on the specified Scrabble
 * tile set.
 *
 * An alphagram is a string of letters sorted in alphabetical order.
 *
 * This function handles special cases where certain languages have
 * multi-character letters (e.g., 'CH' in spanish).
 *
 * NOTE: If a letter is invalid, that is, not part of the provided tile set, it is
 * ignored and no error is thrown.
 *
 * @param word
 * The word to be converted into an alphagram.
 * @param tileSet
 * The Scrabble tile set that includes the tiles available for the game.
 * @returns
 * The alphagram of the given word in uppercase.
 */
function getAlphagram(word: string, tileSet: ScrabbleTileSet): string {
  word = word.toUpperCase();
  const letters: string[] = [];

  let i = 0;
  while (i < word.length) {
    // Handle two-character letters (such as 'CH' in spanish), if applicable
    if (i + 1 < word.length - 1) {
      const twoCharacterLetter = word.slice(i, i + 2);
      if (twoCharacterLetter in tileSet.tiles) {
        letters.push(twoCharacterLetter);
        i += 2;
        continue;
      }
    }

    const letter = word[i];
    if (letter in tileSet.tiles) {
      letters.push(letter);
    }

    i++;
  }

  return letters.sort().join('');
}

export default getAlphagram;
