import { Schema } from 'mongoose';

export const UserInvitation = new Schema({
  email: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  expiryDate: {
    type: String,
  },
});
