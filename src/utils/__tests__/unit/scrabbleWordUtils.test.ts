import {getAlphagram, calculateWordValue} from '@utils/scrabbleWordUtils';

describe('getAlphagram', () => {
  it('should return an empty string for an empty word', () => {
    const mockValidLetters = new Set(['A']);
    const result = getAlphagram('', mockValidLetters);
    expect(result).toEqual('');
  });

  it('should return a single letter alphagram for a single letter word', () => {
    const mockValidLetters = new Set(['A']);
    const result = getAlphagram('A', mockValidLetters);
    expect(result).toEqual('A');
  });

  it('should return an alphagram for a basic word', () => {
    const mockValidLetters = new Set(['A', 'B', 'C']);
    const result = getAlphagram('CAB', mockValidLetters);
    expect(result).toEqual('ABC');
  });

  it('should ignore invalid letters', () => {
    const mockValidLetters = new Set(['D', 'I', 'L', 'N', 'V']);
    const result = getAlphagram('INV2LID', mockValidLetters);
    expect(result).toEqual('DIILNV');
  });

  it('should handle digraph letters', () => {
    const mockValidLetters = new Set(['A', 'C', 'CH', 'O', 'R', 'RR']);
    const result = getAlphagram('CHARRO', mockValidLetters);
    expect(result).toEqual('ACHORR');
  });

  it('should handle trigraph letters', () => {
    const mockValidLetters = new Set(['C', 'E', 'G', 'I', 'L', 'L·L', 'O']);
    const result = getAlphagram('COL·LEGI', mockValidLetters);
    expect(result).toEqual('CEGIL·LO');
  });
});

describe('calculateWordValue', () => {
  it('should return 0 for an empty string', () => {
    const mockLetterValues = new Map(Object.entries({A: 1}));
    const result = calculateWordValue('', mockLetterValues);
    expect(result).toEqual(0);
  });

  it('should calculate the value of a single letter word', () => {
    const mockLetterValues = new Map(Object.entries({A: 1}));
    const result = calculateWordValue('A', mockLetterValues);
    expect(result).toEqual(1);
  });

  it('should return the value of a basic word', () => {
    const mockLetterValues = new Map(Object.entries({A: 1, B: 3, C: 3}));
    const result = calculateWordValue('ABC', mockLetterValues);
    expect(result).toEqual(7);
  });

  it('should ignore invalid letters', () => {
    const mockLetterValues = new Map(
      Object.entries({D: 2, I: 1, L: 1, N: 1, V: 4})
    );
    const result = calculateWordValue('INV2LID', mockLetterValues);
    expect(result).toEqual(10);
  });

  it('should handle digraph letters', () => {
    const mockLetterValues = new Map(
      Object.entries({A: 1, C: 3, CH: 5, H: 4, O: 1, R: 1, RR: 8})
    );
    const result = calculateWordValue('CHARRO', mockLetterValues);
    expect(result).toEqual(15);
  });

  it('should handle trigraph letters', () => {
    const mockLetterValues = new Map(
      Object.entries({C: 2, E: 1, G: 3, I: 1, L: 1, L·L: 10, O: 1})
    );
    const result = calculateWordValue('COL·LEGI', mockLetterValues);
    expect(result).toEqual(18);
  });

  it(
    'should give precedence to trigraphs over digraphs and single-character ' +
      'letters',
    () => {
      const mockLetterValues = new Map(
        Object.entries({A: 1, B: 2, C: 3, AB: 11, ABC: 22})
      );
      const result = calculateWordValue('ABC', mockLetterValues);
      expect(result).toEqual(22);
    }
  );

  it('should give precedence to digraphs over single-character letters', () => {
    const mockLetterValues = new Map(Object.entries({A: 1, B: 2, AB: 11}));
    const result = calculateWordValue('AB', mockLetterValues);
    expect(result).toEqual(11);
  });

  it('should handle words with no valid letters', () => {
    const mockLetterValues = new Map(Object.entries({A: 1, B: 3, C: 3}));
    const result = calculateWordValue('XYZ', mockLetterValues);
    expect(result).toEqual(0);
  });
});
