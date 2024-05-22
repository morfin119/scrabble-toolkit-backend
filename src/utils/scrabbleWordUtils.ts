/**
 * Gets the alphagram (a string of sorted letters) of the input word,
 * considering valid trigraph letters, digraph letters, and single-character
 * letters.
 *
 * NOTE: If a letter is invalid, that is, not part of the provided array of
 * valid letters, it is ignored and no error is thrown.
 *
 * @param word
 * The word from which to create an alphagram.
 * @param validLetters
 * An array of valid single-character letters, digraphs, and trigraphs.
 * @returns
 * The alphagram of the given word.
 */
export function getAlphagram(word: string, validLetters: string[]): string {
  const validLettersSet = new Set(validLetters);
  const letters: string[] = [];

  let i = 0;
  while (i < word.length) {
    // Handle trigraph letters
    if (i + 2 < word.length) {
      const trigraph = word.slice(i, i + 3);
      if (validLettersSet.has(trigraph)) {
        letters.push(trigraph);
        i += 3;
        continue;
      }
    }

    // Handle digraph letters
    if (i + 1 < word.length) {
      const digraph = word.slice(i, i + 2);
      if (validLettersSet.has(digraph)) {
        letters.push(digraph);
        i += 2;
        continue;
      }
    }

    // Handle single-character letters
    const letter = word[i];
    if (validLettersSet.has(letter)) {
      letters.push(letter);
    }

    i++;
  }

  return letters.sort().join('');
}
