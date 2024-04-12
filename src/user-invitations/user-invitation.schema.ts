import { Schema } from 'mongoose';

export enum InvitationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Canceled = 'canceled',
}

export const UserInvitation = new Schema(
  {
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

    status: {
      type: String,
      enum: [
        InvitationStatus.Pending,
        InvitationStatus.Approved,
        InvitationStatus.Canceled,
      ],
    },
  },
  {
    timestamps: true,
  },
);
