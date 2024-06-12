import { Schema } from 'mongoose';

export const Token = new Schema<IToken>({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  email: {
    type: String,
  },
});

export interface IToken extends Document {
  token: string;
  user: Schema.Types.ObjectId;
  email: string;
}
