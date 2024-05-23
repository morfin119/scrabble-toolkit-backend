/**
 * Gets the alphagram (a string of sorted letters) of the input word, based on
 * the provided array of valid letters.
 *
 * The function supports single-character letters, digraphs (two-character
 * combinations), and trigraphs (three-character combinations). It processes the
 * word from left to right, giving precedence to trigraphs over digraphs and
 * single-character letters, and to digraphs over single-character letters.
 *
 * NOTE: If a letter is invalid, meaning it is not part of the provided set of
 * valid letters, it is ignored and no error is thrown.
 *
 * @param word
 * The word from which to create an alphagram.
 * @param validLetters
 * A set of valid single-character letters, digraphs, and trigraphs.
 * @returns
 * The alphagram of the given word.
 */
export function getAlphagram(word: string, validLetters: Set<string>): string {
  const letters: string[] = [];

  let i = 0;
  while (i < word.length) {
    // Handle trigraph letters
    if (i + 2 < word.length) {
      const trigraph = word.slice(i, i + 3);
      if (validLetters.has(trigraph)) {
        letters.push(trigraph);
        i += 3;
        continue;
      }
    }

    // Handle digraph letters
    if (i + 1 < word.length) {
      const digraph = word.slice(i, i + 2);
      if (validLetters.has(digraph)) {
        letters.push(digraph);
        i += 2;
        continue;
      }
    }

    // Handle single-character letters
    const letter = word[i];
    if (validLetters.has(letter)) {
      letters.push(letter);
    }

    i++;
  }

  return letters.sort().join('');
}

/**
 * Calculates the total value of a word based on the given letter values.
 *
 * The function supports single-character letters, digraphs (two-character
 * combinations), and trigraphs (three-character combinations). It processes the
 * word from left to right, giving precedence to trigraphs over digraphs and
 * single-character letters, and to digraphs over single-character letters.
 *
 * NOTE: If a letter is invalid, meaning it is not part of the provided
 * letter-to-value map, it is ignored and no error is thrown.
 *
 * @param word
 * The word for which points are calculated.
 * @param letterValues
 * An object mapping letters to their respective values.
 * @returns
 * The total value of the given word.
 */
export function calculateWordValue(
  word: string,
  letterValues: Map<string, number>
) {
  let value = 0;

  let i = 0;
  while (i < word.length) {
    // Handle trigraph letters
    if (i + 2 < word.length) {
      const trigraph = word.slice(i, i + 3);
      if (letterValues.has(trigraph)) {
        value += letterValues.get(trigraph) ?? 0;
        i += 3;
        continue;
      }
    }

    // Handle digraph letters
    if (i + 1 < word.length) {
      const digraph = word.slice(i, i + 2);
      if (letterValues.has(digraph)) {
        value += letterValues.get(digraph) ?? 0;
        i += 2;
        continue;
      }
    }

    // Handle single-character letters
    const letter = word[i];
    if (letterValues.has(letter)) {
      value += letterValues.get(letter) ?? 0;
    }

    i++;
  }

  return value;
}
