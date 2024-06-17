import mongoose from 'mongoose';

export interface IWordList {
  name: string;
  tileSetId: mongoose.Types.ObjectId;
}
