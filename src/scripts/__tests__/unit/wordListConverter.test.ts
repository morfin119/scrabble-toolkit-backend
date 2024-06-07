import {IWordList} from '@src/scripts/wordListConverter';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';
import {
  parseTxtWordList,
  enrichWordListEntries,
} from '@src/scripts/wordListConverter';
import * as scrabbleWordUtils from '@src/utils/scrabbleWordUtils';

describe('parseTxtWordList()', () => {
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
    } as IWordList);
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
    } as IWordList);
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
    } as IWordList);
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
    } as IWordList);
  });
});

describe('enrichWordListEntries()', () => {
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
    } as IWordList;

    const tileSet = {
      language: 'en',
      tiles: [
        {letter: 'D', points: 2, count: 4},
        {letter: 'O', points: 1, count: 8},
        {letter: 'R', points: 1, count: 6},
        {letter: 'W', points: 4, count: 2},
      ],
    } as ITileSet;

    // Act
    const enrichedEntries = enrichWordListEntries(wordList, tileSet);

    // Assert
    expect(enrichedEntries.length).toEqual(1);
    expect(enrichedEntries[0].word).toEqual('WORD');
    expect(enrichedEntries[0].definition).toEqual('a sample word');
    expect(enrichedEntries[0].alphagram).toEqual('DORW');
    expect(new Set(enrichedEntries[0].front_hooks)).toEqual(new Set('S'));
    expect(new Set(enrichedEntries[0].back_hooks)).toEqual(new Set(['S', 'Y']));
    expect(enrichedEntries[0].value).toEqual(8);

    expect(getAlphagramSpy).toHaveBeenCalled();
    expect(findHooksSpy).toHaveBeenCalled();
    expect(calculateWordValueSpy).toHaveBeenCalled();
  });
});
