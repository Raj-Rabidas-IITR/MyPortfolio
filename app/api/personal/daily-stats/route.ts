import { connectDB } from "@/lib/db";
import DailyRecord from "@/lib/models/DailyRecord";
import { getPersonalCredentials, isPersonalRequestAuthenticated, normalizePersonalUsername } from "@/lib/personal-auth";
import { computeDailyScore } from "@/lib/personal-record";
import { NextResponse } from "next/server";

const WEEKDAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

interface WeekdayAccumulator {
  totalEntries: number;
  mealsDoneCount: number;
  workoutCount: number;
  swimmingCount: number;
  msbCount: number;
  studyCount: number;
  blueTeaCount: number;
}

function createWeekdayAccumulator(): WeekdayAccumulator {
  return {
    totalEntries: 0,
    mealsDoneCount: 0,
    workoutCount: 0,
    swimmingCount: 0,
    msbCount: 0,
    studyCount: 0,
    blueTeaCount: 0,
  };
}

function getWeekdayKey(entryDate: string): WeekdayKey {
  const date = new Date(`${entryDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Sun";
  }
  return WEEKDAY_KEYS[date.getDay()];
}

function toRate(count: number, total: number) {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

export async function GET(request: Request) {
  if (!isPersonalRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const username = normalizePersonalUsername(getPersonalCredentials().username);
    const docs = await DailyRecord.find({ username }).sort({ entryDate: 1, createdAt: 1 }).lean();

    const totalEntries = docs.length;

    let mealsDoneCount = 0;
    let workoutCount = 0;
    let swimmingCount = 0;
    let msbCount = 0;
    let studyCount = 0;
    let blueTeaCount = 0;
    let currentStreak = 0;

    const weekdayBuckets: Record<WeekdayKey, WeekdayAccumulator> = {
      Sun: createWeekdayAccumulator(),
      Mon: createWeekdayAccumulator(),
      Tue: createWeekdayAccumulator(),
      Wed: createWeekdayAccumulator(),
      Thu: createWeekdayAccumulator(),
      Fri: createWeekdayAccumulator(),
      Sat: createWeekdayAccumulator(),
    };

    let tuesdayEntries = 0;
    let tuesdaySwimDone = 0;
    let sundayEntries = 0;
    let sundaySwimDone = 0;

    const records = docs.map((doc) => {
      const scoreResult = computeDailyScore({
        mealsDone: Boolean(doc.mealsDone),
        mealFrequency: doc.mealFrequency,
        workoutDone: Boolean(doc.workoutDone),
        swimmingDone: Boolean(doc.swimmingDone),
        msbDone: Boolean(doc.msbDone),
        studyWorkDone: Boolean(doc.studyWorkDone),
        blueTeaAshwagandhaDone: Boolean(doc.blueTeaAshwagandhaDone),
      });

      if (doc.mealsDone) mealsDoneCount += 1;
      if (doc.workoutDone) workoutCount += 1;
      if (doc.swimmingDone) swimmingCount += 1;
      if (doc.msbDone) msbCount += 1;
      if (doc.studyWorkDone) studyCount += 1;
      if (doc.blueTeaAshwagandhaDone) blueTeaCount += 1;

      const weekday = getWeekdayKey(doc.entryDate);
      const weekdayBucket = weekdayBuckets[weekday];
      weekdayBucket.totalEntries += 1;
      if (doc.mealsDone) weekdayBucket.mealsDoneCount += 1;
      if (doc.workoutDone) weekdayBucket.workoutCount += 1;
      if (doc.swimmingDone) weekdayBucket.swimmingCount += 1;
      if (doc.msbDone) weekdayBucket.msbCount += 1;
      if (doc.studyWorkDone) weekdayBucket.studyCount += 1;
      if (doc.blueTeaAshwagandhaDone) weekdayBucket.blueTeaCount += 1;

      if (weekday === "Tue") {
        tuesdayEntries += 1;
        if (doc.swimmingDone) tuesdaySwimDone += 1;
      }

      if (weekday === "Sun") {
        sundayEntries += 1;
        if (doc.swimmingDone) sundaySwimDone += 1;
      }

      return {
        id: String(doc._id),
        date: doc.entryDate,
        mealsDone: Boolean(doc.mealsDone),
        mealFrequency: doc.mealFrequency ?? null,
        mealsFeedback: typeof doc.mealsFeedback === "string" ? doc.mealsFeedback : "",
        extraSnacks: Boolean(doc.extraSnacks),
        snacksDetails: typeof doc.snacksDetails === "string" ? doc.snacksDetails : "",
        workoutDone: Boolean(doc.workoutDone),
        workoutDuration: doc.workoutDuration ?? null,
        swimmingDone: Boolean(doc.swimmingDone),
        msbDone: Boolean(doc.msbDone),
        studyWorkDone: Boolean(doc.studyWorkDone),
        studyCategory: doc.studyCategory ?? null,
        studyDuration: doc.studyDuration ?? null,
        blueTeaAshwagandhaDone: Boolean(doc.blueTeaAshwagandhaDone),
        score: Number(scoreResult.score.toFixed(2)),
        scorePercent: scoreResult.scorePercent,
      };
    });

    for (let index = records.length - 1; index >= 0; index -= 1) {
      const item = records[index];
      if (item.scorePercent >= 60) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    const weekdayTrends = WEEKDAY_KEYS.map((day) => {
      const weekdayBucket = weekdayBuckets[day];
      return {
        day,
        totalEntries: weekdayBucket.totalEntries,
        mealsDoneRate: toRate(weekdayBucket.mealsDoneCount, weekdayBucket.totalEntries),
        workoutRate: toRate(weekdayBucket.workoutCount, weekdayBucket.totalEntries),
        swimmingRate: toRate(weekdayBucket.swimmingCount, weekdayBucket.totalEntries),
        msbRate: toRate(weekdayBucket.msbCount, weekdayBucket.totalEntries),
        studyRate: toRate(weekdayBucket.studyCount, weekdayBucket.totalEntries),
        blueTeaRate: toRate(weekdayBucket.blueTeaCount, weekdayBucket.totalEntries),
      };
    });

    const tuesdayRate = toRate(tuesdaySwimDone, tuesdayEntries);
    const sundayRate = toRate(sundaySwimDone, sundayEntries);
    const focusDenominator = tuesdayEntries + sundayEntries;
    const focusRate = toRate(tuesdaySwimDone + sundaySwimDone, focusDenominator);

    return NextResponse.json({
      summary: {
        totalEntries,
        currentStreak,
        mealsDoneRate: toRate(mealsDoneCount, totalEntries),
        workoutRate: toRate(workoutCount, totalEntries),
        swimmingRate: toRate(swimmingCount, totalEntries),
        msbRate: toRate(msbCount, totalEntries),
        studyRate: toRate(studyCount, totalEntries),
        blueTeaRate: toRate(blueTeaCount, totalEntries),
        weekdayTrends,
        swimmingFocus: {
          tuesdayRate,
          sundayRate,
          focusRate,
        },
      },
      records,
    });
  } catch (error) {
    console.error("Daily stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
