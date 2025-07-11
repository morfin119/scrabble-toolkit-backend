import {
  getAlphagram,
  calculateWordValue,
  findHooks,
} from '@utils/scrabbleWordUtils';

describe('getAlphagram', () => {
  it('should return an empty string for an empty word', () => {
    // Arrange
    const word = '';
    const mockValidLetters = new Set(['A']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('');
  });

  it('should return a single letter alphagram for a single letter word', () => {
    // Arrange
    const word = 'A';
    const mockValidLetters = new Set(['A']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('A');
  });

  it('should return an alphagram for a basic word', () => {
    // Arrange
    const word = 'CAB';
    const mockValidLetters = new Set(['A', 'B', 'C']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('ABC');
  });

  it('should ignore invalid letters', () => {
    // Arrange
    const word = 'INV2LID';
    const mockValidLetters = new Set(['D', 'I', 'L', 'N', 'V']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('DIILNV');
  });

  it('should handle digraph letters', () => {
    // Arrange
    const word = 'CHARRO';
    const mockValidLetters = new Set(['A', 'C', 'CH', 'O', 'R', 'RR']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('ACHORR');
  });

  it('should handle trigraph letters', () => {
    // Arrange
    const word = 'COL·LEGI';
    const mockValidLetters = new Set(['C', 'E', 'G', 'I', 'L', 'L·L', 'O']);

    // Act
    const result = getAlphagram(word, mockValidLetters);

    // Assert
    expect(result).toEqual('CEGIL·LO');
  });
});

describe('calculateWordValue', () => {
  it('should return 0 for an empty string', () => {
    // Arrange
    const word = '';
    const mockLetterValues = new Map(Object.entries({A: 1}));

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(0);
  });

  it('should calculate the value of a single letter word', () => {
    // Arrange
    const word = 'A';
    const mockLetterValues = new Map(Object.entries({A: 1}));

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(1);
  });

  it('should return the value of a basic word', () => {
    // Arrange
    const word = 'ABC';
    const mockLetterValues = new Map(Object.entries({A: 1, B: 3, C: 3}));

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(7);
  });

  it('should ignore invalid letters', () => {
    // Arrange
    const word = 'INV2LID';
    const mockLetterValues = new Map(
      Object.entries({D: 2, I: 1, L: 1, N: 1, V: 4})
    );

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(10);
  });

  it('should handle digraph letters', () => {
    // Arrange
    const word = 'CHARRO';
    const mockLetterValues = new Map(
      Object.entries({A: 1, C: 3, CH: 5, H: 4, O: 1, R: 1, RR: 8})
    );

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(15);
  });

  it('should handle trigraph letters', () => {
    // Arrange
    const word = 'COL·LEGI';
    const mockLetterValues = new Map(
      Object.entries({C: 2, E: 1, G: 3, I: 1, L: 1, L·L: 10, O: 1})
    );

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(18);
  });

  it('should give precedence to trigraphs over digraphs and single-character letters', () => {
    // Arrange
    const word = 'ABC';
    const mockLetterValues = new Map(
      Object.entries({A: 1, B: 2, C: 3, AB: 11, ABC: 22})
    );

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(22);
  });

  it('should give precedence to digraphs over single-character letters', () => {
    // Arrange
    const word = 'AB';
    const mockLetterValues = new Map(Object.entries({A: 1, B: 2, AB: 11}));

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(11);
  });

  it('should handle words with no valid letters', () => {
    // Arrange
    const word = 'XYZ';
    const mockLetterValues = new Map(Object.entries({A: 1, B: 3, C: 3}));

    // Act
    const result = calculateWordValue(word, mockLetterValues);

    // Assert
    expect(result).toEqual(0);
  });
});

describe('findHooks', () => {
  it('should return an array with two empty sets for an empty word', () => {
    // Arrange
    const word = '';
    const mockValidWords = new Set(['AT', 'CAT', 'ATE']);
    const mockValidLetters = new Set(['A', 'C', 'E', 'T']);

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual([new Set([]), new Set([])]);
  });

  it('should return an array with two empty sets for an empty valid words set', () => {
    // Arrange
    const word = 'AT';
    const mockValidWords = new Set([]);
    const mockValidLetters = new Set(['A', 'C', 'E', 'T']);

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual([new Set([]), new Set([])]);
  });

  it('should return an array of two empty sets for an empty valid letters set', () => {
    // Arrange
    const word = 'AT';
    const mockValidWords = new Set(['AT', 'CAT', 'ATE']);
    const mockValidLetters = new Set([]);

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual([new Set([]), new Set([])]);
  });

  it('should find hooks for a word with one valid hook per side', () => {
    // Arrange
    const word = 'AT';
    const mockValidWords = new Set(['AT', 'CAT', 'ATE']);
    const mockValidLetters = new Set(['A', 'C', 'E', 'T']);

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual([new Set(['C']), new Set(['E'])]);
  });

  it('should return an array of two empty sets when the word has no hooks', () => {
    // Arrange
    const word = 'B';
    const mockValidWords = new Set(['A', 'B', 'C']);
    const mockValidLetters = new Set(['A', 'B', 'C']);

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual([new Set([]), new Set([])]);
  });

  it('should find hooks for a word with multiple valid hooks on both sides', () => {
    // Arrange
    const word = 'AT';
    const mockValidWords = new Set(['CAT', 'BAT', 'FAT', 'ATE', 'ATS']);
    const mockValidLetters = new Set(['C', 'B', 'F', 'A', 'T', 'E', 'S']);
    const expectedHooks = [new Set(['C', 'B', 'F']), new Set(['E', 'S'])];

    // Act
    const result = findHooks(word, mockValidWords, mockValidLetters);

    // Assert
    expect(result).toEqual(expectedHooks);
  });
});
