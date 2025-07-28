import {Schema} from 'mongoose';
import {IEnrichedWord} from '@components/EnrichedWord/interfaces/EnrichedWord.interface';

const enrichedWordSchema: Schema = new Schema<IEnrichedWord>({
  word: {
    type: String,
    required: true,
    immutable: true,
    uppercase: true,
    trim: true,
  },
  definition: {
    type: String,
    required: false,
    immutable: true,
  },
  alphagram: {
    type: String,
    required: true,
    immutable: true,
    uppercase: true,
    trim: true,
  },
  frontHooks: {
    type: [String],
    required: true,
    immutable: true,
  },
  backHooks: {
    type: [String],
    required: true,
    immutable: true,
  },
  value: {
    type: Number,
    required: true,
    immutable: true,
    min: 0,
  },
  wordListName: {
    type: String,
    required: true,
    immutable: true,
    uppercase: true,
    trim: true,
  },
  tileSetName: {
    type: String,
    required: true,
    immutable: true,
    lowercase: false,
    trim: true,
  },
});

export default enrichedWordSchema;
