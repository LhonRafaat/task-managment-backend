import { Schema } from 'mongoose';

export const Organization = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    members: [
      {
        type: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    projects: [
      {
        type: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
