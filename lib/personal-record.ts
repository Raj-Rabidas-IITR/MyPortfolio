import {
  DailyRecordPayload,
  MealFrequency,
  StudyCategory,
  StudyDuration,
  WorkoutDuration,
} from "@/types/daily-record";

export const MEAL_FREQUENCY_OPTIONS: Array<{ value: MealFrequency; label: string }> = [
  { value: "twice", label: "Twice" },
  { value: "once", label: "Once" },
  { value: "none", label: "No meal" },
];

export const WORKOUT_DURATION_OPTIONS: Array<{ value: WorkoutDuration; label: string }> = [
  { value: "lt1", label: "Less than 1 hour" },
  { value: "1plus", label: "1+ hour" },
  { value: "2plus", label: "2+ hours" },
  { value: "3plus", label: "3+ hours" },
];

export const STUDY_CATEGORY_OPTIONS: Array<{ value: StudyCategory; label: string }> = [
  { value: "dev-related", label: "Dev related" },
  { value: "company-project", label: "Company project" },
  { value: "iot-project", label: "IoT project" },
  { value: "course-related", label: "Course related" },
  { value: "placement", label: "Placement" },
  { value: "internship-related", label: "Internship related" },
];

export const STUDY_DURATION_OPTIONS: Array<{ value: StudyDuration; label: string }> = [
  { value: "lt1", label: "Less than 1 hour" },
  { value: "1plus", label: "1+ hour" },
  { value: "2plus", label: "2+ hours" },
];

const MEAL_VALUES = new Set<MealFrequency>(["once", "twice", "none"]);
const WORKOUT_VALUES = new Set<WorkoutDuration>(["lt1", "1plus", "2plus", "3plus"]);
const STUDY_CATEGORY_VALUES = new Set<StudyCategory>([
  "dev-related",
  "company-project",
  "iot-project",
  "course-related",
  "placement",
  "internship-related",
]);
const STUDY_DURATION_VALUES = new Set<StudyDuration>(["lt1", "1plus", "2plus"]);

function toBoolean(input: unknown) {
  if (typeof input === "boolean") {
    return input;
  }

  if (typeof input === "string") {
    const normalized = input.trim().toLowerCase();
    if (normalized === "yes" || normalized === "true") {
      return true;
    }
    if (normalized === "no" || normalized === "false") {
      return false;
    }
  }

  return null;
}

function toString(input: unknown) {
  if (typeof input !== "string") {
    return "";
  }
  return input.trim();
}

function toNullableEnum<T extends string>(input: unknown, allowedValues: Set<T>) {
  if (typeof input !== "string") {
    return null;
  }

  const value = input.trim() as T;
  return allowedValues.has(value) ? value : null;
}

export function normalizeDailyRecordPayload(raw: Record<string, unknown>) {
  const mealsDone = toBoolean(raw.mealsDone);
  const extraSnacks = toBoolean(raw.extraSnacks);
  const workoutDone = toBoolean(raw.workoutDone);
  const swimmingDone = toBoolean(raw.swimmingDone);
  const msbDone = toBoolean(raw.msbDone);
  const studyWorkDone = toBoolean(raw.studyWorkDone);
  const blueTeaAshwagandhaDone = toBoolean(raw.blueTeaAshwagandhaDone);

  if (
    mealsDone === null ||
    extraSnacks === null ||
    workoutDone === null ||
    swimmingDone === null ||
    msbDone === null ||
    studyWorkDone === null ||
    blueTeaAshwagandhaDone === null
  ) {
    return { error: "Please answer all required yes/no fields." } as const;
  }

  const mealFrequency = mealsDone
    ? null
    : toNullableEnum<MealFrequency>(raw.mealFrequency, MEAL_VALUES);
  const workoutDuration = workoutDone
    ? toNullableEnum<WorkoutDuration>(raw.workoutDuration, WORKOUT_VALUES)
    : null;
  const studyCategory = studyWorkDone
    ? toNullableEnum<StudyCategory>(raw.studyCategory, STUDY_CATEGORY_VALUES)
    : null;
  const studyDuration = studyWorkDone
    ? toNullableEnum<StudyDuration>(raw.studyDuration, STUDY_DURATION_VALUES)
    : null;

  if (!mealsDone && mealFrequency === null) {
    return { error: "Select meal frequency when meals are not completed." } as const;
  }

  if (workoutDone && workoutDuration === null) {
    return { error: "Select workout duration." } as const;
  }

  if (studyWorkDone && (studyCategory === null || studyDuration === null)) {
    return { error: "Select both study/work category and duration." } as const;
  }

  const snacksDetails = extraSnacks ? toString(raw.snacksDetails) : "";

  if (extraSnacks && !snacksDetails) {
    return { error: "Please add snacks details when extra snacks is yes." } as const;
  }

  const payload: DailyRecordPayload = {
    mealsDone,
    mealFrequency,
    mealsFeedback: toString(raw.mealsFeedback),
    extraSnacks,
    snacksDetails,
    workoutDone,
    workoutDuration,
    swimmingDone,
    msbDone,
    studyWorkDone,
    studyCategory,
    studyDuration,
    blueTeaAshwagandhaDone,
  };

  return { payload } as const;
}

export function computeDailyScore(
  record: Pick<
    DailyRecordPayload,
    | "mealsDone"
    | "mealFrequency"
    | "workoutDone"
    | "swimmingDone"
    | "msbDone"
    | "studyWorkDone"
    | "blueTeaAshwagandhaDone"
  >
) {
  const mealScore = record.mealsDone
    ? 1
    : record.mealFrequency === "twice"
      ? 0.66
      : record.mealFrequency === "once"
        ? 0.33
        : 0;

  const score =
    mealScore +
    (record.workoutDone ? 1 : 0) +
    (record.swimmingDone ? 1 : 0) +
    (record.msbDone ? 1 : 0) +
    (record.studyWorkDone ? 1 : 0) +
    (record.blueTeaAshwagandhaDone ? 1 : 0);

  const maxScore = 6;
  const scorePercent = Math.round((score / maxScore) * 100);

  return {
    score,
    scorePercent,
  };
}
