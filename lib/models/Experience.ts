// lib/models/Experience.ts
import mongoose, { Schema, models } from "mongoose";

const ExperienceSchema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  logo: { type: String },
}, { timestamps: true });

export const Experience = models.Experience || mongoose.model("Experience", ExperienceSchema);
