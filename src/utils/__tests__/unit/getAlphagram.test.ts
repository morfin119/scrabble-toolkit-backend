import getAlphagram from '@utils/getAlphagram';

describe('getAlphagram', () => {
  it('should return an empty string for an empty word', () => {
    const mockValidLetters = ['A'];
    const result = getAlphagram('', mockValidLetters);
    expect(result).toEqual('');
  });

  it('should return a single letter alphagram for a single letter word', () => {
    const mockValidLetters = ['A'];
    const result = getAlphagram('A', mockValidLetters);
    expect(result).toEqual('A');
  });

  it('should return an alphagram for a basic word', () => {
    const mockValidLetters = ['A', 'B', 'C'];
    const result = getAlphagram('CAB', mockValidLetters);
    expect(result).toEqual('ABC');
  });

  it('should ignore invalid letters', () => {
    const mockValidLetters = ['D', 'I', 'L', 'N', 'V'];
    const result = getAlphagram('INV2LID', mockValidLetters);
    expect(result).toEqual('DIILNV');
  });

  it('should handle two character letters', () => {
    const mockValidLetters = ['A', 'C', 'CH', 'O', 'R', 'RR'];
    const result = getAlphagram('CHARRO', mockValidLetters);
    expect(result).toEqual('ACHORR');
  });

  it('should handle three character letters', () => {
    const mockValidLetters = ['C', 'E', 'G', 'I', 'L', 'L·L', 'O'];
    const result = getAlphagram('COL·LEGI', mockValidLetters);
    expect(result).toEqual('CEGIL·LO');
  });

  it('should handle mixed case input word and validLetters', () => {
    const mockValidLetters = ['E', 'h', 'l', 'O'];
    const result = getAlphagram('HelLo', mockValidLetters);
    expect(result).toEqual('EHLLO');
  });
});
