import { model, models, Schema } from "mongoose";

const DailyRecordSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    entryDate: {
      type: String,
      required: true,
    },
    mealsDone: {
      type: Boolean,
      required: true,
    },
    mealFrequency: {
      type: String,
      enum: ["once", "twice", "none", null],
      default: null,
    },
    mealsFeedback: {
      type: String,
      trim: true,
      default: "",
    },
    extraSnacks: {
      type: Boolean,
      required: true,
    },
    snacksDetails: {
      type: String,
      trim: true,
      default: "",
    },
    workoutDone: {
      type: Boolean,
      required: true,
    },
    workoutDuration: {
      type: String,
      enum: ["lt1", "1plus", "2plus", "3plus", null],
      default: null,
    },
    swimmingDone: {
      type: Boolean,
      required: true,
    },
    msbDone: {
      type: Boolean,
      required: true,
    },
    studyWorkDone: {
      type: Boolean,
      required: true,
    },
    studyCategory: {
      type: String,
      enum: ["dev-related", "company-project", "iot-project", "course-related", "placement", "internship-related", null],
      default: null,
    },
    studyDuration: {
      type: String,
      enum: ["lt1", "1plus", "2plus", null],
      default: null,
    },
    blueTeaAshwagandhaDone: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DailyRecordSchema.index({ username: 1, entryDate: 1 }, { unique: true });

const DailyRecord = models.DailyRecord || model("DailyRecord", DailyRecordSchema);

export default DailyRecord;
