import getAlphagram from '@utils/getAlphagram';

describe('getAlphagram', () => {
  it('should return an empty string for an empty word', () => {
    const mockValidCharacters = ['A'];
    const result = getAlphagram('', mockValidCharacters);
    expect(result).toEqual('');
  });

  it('should return a single letter alphagram for a single letter word', () => {
    const mockValidCharacters = ['A'];
    const result = getAlphagram('A', mockValidCharacters);
    expect(result).toEqual('A');
  });

  it('should return an alphagram for a basic word', () => {
    const mockValidCharacters = ['A', 'B', 'C'];
    const result = getAlphagram('CAB', mockValidCharacters);
    expect(result).toEqual('ABC');
  });

  it('should ignore invalid letters', () => {
    const mockValidCharacters = ['D', 'I', 'L', 'N', 'V'];
    const result = getAlphagram('INV2LID', mockValidCharacters);
    expect(result).toEqual('DIILNV');
  });

  it('should handle two character letters', () => {
    const mockValidCharacters = ['A', 'C', 'CH', 'O', 'R', 'RR'];
    const result = getAlphagram('CHARRO', mockValidCharacters);
    expect(result).toEqual('ACHORR');
  });

  it('should handle three character letters', () => {
    const mockValidCharacters = ['C', 'E', 'G', 'I', 'L', 'L·L', 'O'];
    const result = getAlphagram('COL·LEGI', mockValidCharacters);
    expect(result).toEqual('CEGIL·LO');
  });
});
