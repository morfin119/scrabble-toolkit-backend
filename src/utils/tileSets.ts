import {ScrabbleTileSet} from '@src/types';

import enTileSet from '@data/tile_sets/en.json';
import esTileSet from '@data/tile_sets/es.json';
import frTileSet from '@data/tile_sets/fr.json';

const tileSets = new Map<string, ScrabbleTileSet>([
  ['en', enTileSet],
  ['es', esTileSet],
  ['fr', frTileSet],
]);

export default tileSets;
