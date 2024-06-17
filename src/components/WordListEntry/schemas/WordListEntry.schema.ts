import mongoose, {Schema} from 'mongoose';
import {IWordListEntry} from '@components/WordListEntry/interfaces/WordListEntry.interface';

const wordListEntrySchema: Schema = new Schema<IWordListEntry>({
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
  wordListId: mongoose.Types.ObjectId,
});

export default wordListEntrySchema;
