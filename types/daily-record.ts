export type MealFrequency = "once" | "twice" | "none";
export type WorkoutDuration = "lt1" | "1plus" | "2plus" | "3plus";
export type StudyCategory =
  | "dev-related"
  | "company-project"
  | "iot-project"
  | "course-related"
  | "placement"
  | "internship-related";
export type StudyDuration = "lt1" | "1plus" | "2plus";

export interface DailyRecordPayload {
  mealsDone: boolean;
  mealFrequency: MealFrequency | null;
  mealsFeedback: string;
  extraSnacks: boolean;
  snacksDetails: string;
  workoutDone: boolean;
  workoutDuration: WorkoutDuration | null;
  swimmingDone: boolean;
  msbDone: boolean;
  studyWorkDone: boolean;
  studyCategory: StudyCategory | null;
  studyDuration: StudyDuration | null;
  blueTeaAshwagandhaDone: boolean;
}

export interface HabitWeekdayTrend {
  day: string;
  totalEntries: number;
  mealsDoneRate: number;
  workoutRate: number;
  swimmingRate: number;
  msbRate: number;
  studyRate: number;
  blueTeaRate: number;
}

export interface DailyRecordResponse extends DailyRecordPayload {
  id: string;
  username: string;
  entryDate: string;
  createdAt: string;
}

export interface DailyStatsResponse {
  summary: {
    totalEntries: number;
    currentStreak: number;
    mealsDoneRate: number;
    workoutRate: number;
    swimmingRate: number;
    msbRate: number;
    studyRate: number;
    blueTeaRate: number;
    weekdayTrends: HabitWeekdayTrend[];
    swimmingFocus: {
      tuesdayRate: number;
      sundayRate: number;
      focusRate: number;
    };
  };
  records: Array<{
    id: string;
    date: string;
    mealsDone: boolean;
    mealFrequency: MealFrequency | null;
    mealsFeedback: string;
    extraSnacks: boolean;
    snacksDetails: string;
    workoutDone: boolean;
    workoutDuration: WorkoutDuration | null;
    swimmingDone: boolean;
    msbDone: boolean;
    studyWorkDone: boolean;
    studyCategory: StudyCategory | null;
    studyDuration: StudyDuration | null;
    blueTeaAshwagandhaDone: boolean;
    score: number;
    scorePercent: number;
  }>;
}
