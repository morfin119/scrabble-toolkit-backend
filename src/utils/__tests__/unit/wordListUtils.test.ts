import {WordList} from '@src/types';
import {parseTxtWordList} from '@utils/wordListUtils';

describe('parseTxtWordList', () => {
  it('should throw an error when the name of the word list is missing', () => {
    // Arrange
    const wordListLanguage = 'en';
    const text = `\n${wordListLanguage}\n\nAA First definition\nAAH Second definition`;

    // Act & Assert
    expect(() => parseTxtWordList(text)).toThrow(
      'Invalid file format: The name of the word list is missing.'
    );
  });

  it('should throw an error when the language of the word list is not a valid ISO 3166-1 code', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'english';
    const text = `${wordListName}\n${wordListLanguage}\n\nAA First definition\nAAH Second definition`;

    // Act & Assert
    expect(() => parseTxtWordList(text)).toThrow(
      `Invalid language code: ${wordListLanguage}. It must be a valid ISO 3166-1 code.`
    );
  });

  it('should throw an error when the third line of the text is not blank', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\nAA First definition\nAAH Second definition`;

    // Act & Assert
    expect(() => parseTxtWordList(text)).toThrow(
      'Invalid file format: The third line must be blank.'
    );
  });

  it('should trim word list entries', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\n\n  AA First definition \n AAH Second definition `;

    // Act
    const result = parseTxtWordList(text);

    // Assert
    expect(result).toEqual({
      name: wordListName,
      language: wordListLanguage,
      entries: [
        {word: 'AA', definition: 'First definition'},
        {word: 'AAH', definition: 'Second definition'},
      ],
    } as WordList);
  });

  it('should ignore empty lines after the third line', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\n\nAA First definition\n\nAAH Second definition\n`;

    // Act
    const result = parseTxtWordList(text);

    // Assert
    expect(result).toEqual({
      name: wordListName,
      language: wordListLanguage,
      entries: [
        {word: 'AA', definition: 'First definition'},
        {word: 'AAH', definition: 'Second definition'},
      ],
    } as WordList);
  });

  it('should handle word lists with no entries', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\n`;

    // Act
    const result = parseTxtWordList(text);

    // Assert
    expect(result).toEqual({
      name: wordListName,
      language: wordListLanguage,
      entries: [],
    });
  });

  it('should parse entries with no definitions', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\n\nAA\nAAH`;

    // Act
    const result = parseTxtWordList(text);

    // Assert
    expect(result).toEqual({
      name: wordListName,
      language: wordListLanguage,
      entries: [
        {word: 'AA', definition: ''},
        {word: 'AAH', definition: ''},
      ],
    } as WordList);
  });

  it('should parse entries with definitions', () => {
    // Arrange
    const wordListName = 'TEST';
    const wordListLanguage = 'en';
    const text = `${wordListName}\n${wordListLanguage}\n\nAA First definition\nAAH Second definition`;

    // Act
    const result = parseTxtWordList(text);

    // Assert
    expect(result).toEqual({
      name: wordListName,
      language: wordListLanguage,
      entries: [
        {word: 'AA', definition: 'First definition'},
        {word: 'AAH', definition: 'Second definition'},
      ],
    } as WordList);
  });
});
