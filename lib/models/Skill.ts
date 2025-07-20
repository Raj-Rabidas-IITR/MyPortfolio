// lib/models/Skill.ts
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    logo: { type: String }, // URL of uploaded image
  },
  { timestamps: true }
);

export const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);
