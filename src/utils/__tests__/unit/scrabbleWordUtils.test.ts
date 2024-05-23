import {getAlphagram} from '@utils/scrabbleWordUtils';

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
