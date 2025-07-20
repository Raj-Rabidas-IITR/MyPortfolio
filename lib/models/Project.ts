import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      trim: true,
    },
    liveDemo: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Store image URL
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite error in dev
export const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema);
