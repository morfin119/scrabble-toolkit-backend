import {Schema} from 'mongoose';
import {isISO6391} from 'validator';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

const tileSetSchema: Schema = new Schema<ITileSet>({
  language: {
    type: String,
    required: true,
    immutable: true,
    unique: true,
    validate: isISO6391,
  },
  tiles: [
    {
      letter: {
        type: String,
        required: true,
        immutable: true,
        uppercase: true,
        trim: true,
      },
      points: {type: Number, required: true, immutable: true, min: 0},
      count: {type: Number, required: true, immutable: true, min: 0},
    },
  ],
});

export default tileSetSchema;
