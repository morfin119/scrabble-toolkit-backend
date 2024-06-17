import mongoose, {Schema} from 'mongoose';
import {IWordList} from '@components/WordList/interfaces/WordList.interface';

const wordListEntrySchema: Schema = new Schema<IWordList>({
  name: {
    type: String,
    required: true,
    immutable: true,
    uppercase: true,
    trim: true,
  },
  tileSetId: mongoose.Types.ObjectId,
});

export default wordListEntrySchema;
