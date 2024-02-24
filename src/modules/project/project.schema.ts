import { Schema } from 'mongoose';

export const Project = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    boardColumns: {
      type: [String],
      required: true,
    },

    leadUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    tasks: {
      type: [Schema.Types.ObjectId],
      ref: 'Task',
      required: true,
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
