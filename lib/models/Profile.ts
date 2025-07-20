import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: String,
  bio: String,
  profilePic: String,
  resumeUrl: String,
  github: String,
  linkedin: String,
}, { timestamps: true });

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
