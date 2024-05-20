import {ScrabbleTileSet} from '@src/types';
import getAlphagram from '@utils/getAlphagram';

// Mock data
const mockTileSet: ScrabbleTileSet = {
  language: 'es',
  tiles: {
    A: {points: 1, count: 12},
    B: {points: 3, count: 2},
    C: {points: 3, count: 4},
    CH: {points: 5, count: 1},
    D: {points: 2, count: 5},
    E: {points: 1, count: 12},
    F: {points: 4, count: 1},
    G: {points: 2, count: 2},
    H: {points: 4, count: 2},
    I: {points: 1, count: 6},
    J: {points: 8, count: 1},
    L: {points: 1, count: 4},
    LL: {points: 8, count: 1},
    M: {points: 3, count: 2},
    N: {points: 1, count: 5},
    Ñ: {points: 8, count: 1},
    O: {points: 1, count: 9},
    P: {points: 3, count: 2},
    Q: {points: 5, count: 1},
    R: {points: 1, count: 5},
    RR: {points: 8, count: 1},
    S: {points: 1, count: 6},
    T: {points: 1, count: 4},
    U: {points: 1, count: 5},
    V: {points: 4, count: 1},
    X: {points: 8, count: 1},
    Y: {points: 4, count: 1},
    Z: {points: 10, count: 1},
    _: {points: 0, count: 2},
  },
};

describe('getAlphagram', () => {
  it('should return an empty string for an empty word', () => {
    const result = getAlphagram('', mockTileSet);
    expect(result).toEqual('');
  });

  it('should return a single letter alphagram for a single letter word', () => {
    const result = getAlphagram('A', mockTileSet);
    expect(result).toEqual('A');
  });

  it('should return an alphagram for a basic word', () => {
    const result = getAlphagram('CAB', mockTileSet);
    expect(result).toEqual('ABC');
  });

  it('should handle lowercase letters', () => {
    const result = getAlphagram('HelLo', mockTileSet);
    expect(result).toEqual('EHLLO');
  });

  it('should ignore invalid letters', () => {
    const result = getAlphagram('INV2LID', mockTileSet);
    expect(result).toEqual('DIILNV');
  });

  it('should handle multi-character letters', () => {
    const result = getAlphagram('CHARRO', mockTileSet);
    expect(result).toEqual('ACHORR');
  });
});
