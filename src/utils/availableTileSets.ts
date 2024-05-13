/**
 * This script manages a collection of available Scrabble tile sets for various
 * languages.
 *
 * To add a new language:
 *  1. Create a new JSON file following the ScrabbleTileSet interface
 *     definition (src/types.ts).
 *
 *  2. Name the file according to the desired language code (e.g., 'de.json' for
 *     German).
 *
 *  3. Place the new JSON file in the `data/tile_sets` directory.
 *
 *  4. Import the new data file in this script using a similar syntax:
 *       import newLanguageTileSet from '@data/tile_sets/de.json';
 *
 *  5. Add the new tile set to the availableTileSets array.
 *
 * The script creates an array named `availableTileSets` that stores these
 * imported tile sets and exports it as the default value, making it accessible
 * for use in other parts of the project.
 */
import {ScrabbleTileSet} from '@src/types';

import enTileSet from '@data/tile_sets/en.json';
import esTileSet from '@data/tile_sets/es.json';
import frTileSet from '@data/tile_sets/fr.json';

const availableTileSets: ScrabbleTileSet[] = [enTileSet, esTileSet, frTileSet];

export default availableTileSets;
