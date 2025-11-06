import mongoose from 'mongoose';

export interface ICVDownload {
  _id?: string;
  name: string;
  email: string;
  verified: boolean;
  otp?: string;
  otpExpiry?: Date;
  downloadCount?: number;
  lastDownloadAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const CVDownloadSchema = new mongoose.Schema<ICVDownload>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false, // Don't return OTP by default
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookups
CVDownloadSchema.index({ email: 1 });

export default mongoose.models.CVDownload || mongoose.model<ICVDownload>('CVDownload', CVDownloadSchema);
