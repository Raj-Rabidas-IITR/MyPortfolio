import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  board: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: String, required: true },
  year: { type: String, required: true },
  logo: { type: String }, // Image URL
});

export const Education = mongoose.models.Education || mongoose.model("Education", EducationSchema);
