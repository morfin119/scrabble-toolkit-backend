import mongoose from 'mongoose';

export interface IWordListEntry {
  word: string;
  definition: string;
  alphagram: string;
  frontHooks: string[];
  backHooks: string[];
  value: number;
  wordListId: mongoose.Types.ObjectId;
}
