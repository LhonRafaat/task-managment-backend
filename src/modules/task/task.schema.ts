import { Schema } from 'mongoose';
import { TTask } from './models/task.model';

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum TaskTypes {
  Bug = 'bug',
  Feature = 'feature',
}

export const TaskSchema = new Schema<TTask>(
  {
    title: {
      type: String,

      required: true,
    },
    description: {
      type: String,

      required: true,
    },

    type: {
      type: String,
      enum: [TaskTypes.Bug, TaskTypes.Feature],
    },

    labels: {
      type: [String],
    },

    reporter: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      required: true,
    },
    assignee: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      required: true,
    },

    currentColumn: {
      type: String,
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

    slug: { type: String, required: true, unique: true },

    priority: {
      type: String,
      enum: [Priority.Low, Priority.Medium, Priority.High],
    },
  },
  {
    timestamps: true,
  },
);
