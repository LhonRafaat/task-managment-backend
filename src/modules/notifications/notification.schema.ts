import { Schema } from 'mongoose';

export const Notification = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  taskId: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
  type: { type: String, required: true },
});
