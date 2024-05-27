import {WordList, ScrabbleTileSet} from '@src/types';
import {parseTxtWordList, enhanceWordList} from '@utils/wordListUtils';
import * as scrabbleWordUtils from '@src/utils/scrabbleWordUtils';

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

describe('enhanceWordList', () => {
  const getAlphagramSpy = jest.spyOn(scrabbleWordUtils, 'getAlphagram');
  getAlphagramSpy.mockReturnValue('DORW');

  const findHooksSpy = jest.spyOn(scrabbleWordUtils, 'findHooks');
  findHooksSpy.mockReturnValue([new Set('S'), new Set(['S', 'Y'])]);

  const calculateWordValueSpy = jest.spyOn(
    scrabbleWordUtils,
    'calculateWordValue'
  );
  calculateWordValueSpy.mockReturnValue(8);

  it('should enhance each word entry with alphagram, hooks, and value', () => {
    // Arrange
    const wordList = {
      name: 'TEST',
      language: 'en',
      entries: [{word: 'WORD', definition: 'a sample word'}],
    } as WordList;

    const tileSet = {
      language: 'en',
      tiles: {
        D: {points: 2, count: 4},
        O: {points: 1, count: 8},
        R: {points: 1, count: 6},
        W: {points: 4, count: 2},
      },
    } as ScrabbleTileSet;

    // Act
    const enhancedWordList = enhanceWordList(wordList, tileSet);

    // Assert
    expect(enhancedWordList.name).toEqual(wordList.name);
    expect(enhancedWordList.language).toEqual(wordList.language);
    expect(enhancedWordList.entries.length).toEqual(1);

    const enhancedEntry = enhancedWordList.entries[0];
    expect(enhancedEntry.word).toEqual('WORD');
    expect(enhancedEntry.definition).toEqual('a sample word');
    expect(enhancedEntry.alphagram).toEqual('DORW');
    expect(enhancedEntry.front_hooks).toEqual(new Set('S'));
    expect(enhancedEntry.back_hooks).toEqual(new Set(['S', 'Y']));
    expect(enhancedEntry.value).toEqual(8);

    expect(getAlphagramSpy).toHaveBeenCalled();
    expect(findHooksSpy).toHaveBeenCalled();
    expect(calculateWordValueSpy).toHaveBeenCalled();
  });
});
