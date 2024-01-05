import { Schema } from 'mongoose';
import { TUser } from './user.model';

export const User = new Schema<TUser>(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    avatar: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
