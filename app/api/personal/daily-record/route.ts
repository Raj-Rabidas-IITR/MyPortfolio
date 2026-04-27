import { connectDB } from "@/lib/db";
import DailyRecord from "@/lib/models/DailyRecord";
import {
  getPersonalCredentials,
  getTodayEntryDate,
  isPersonalRequestAuthenticated,
  normalizePersonalUsername,
} from "@/lib/personal-auth";
import { normalizeDailyRecordPayload } from "@/lib/personal-record";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isPersonalRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const normalized = normalizeDailyRecordPayload(body);

    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const username = normalizePersonalUsername(getPersonalCredentials().username);
    const entryDate = getTodayEntryDate();

    const existing = await DailyRecord.findOne({ username, entryDate });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted today's record." },
        { status: 409 }
      );
    }

    const created = await DailyRecord.create({
      username,
      entryDate,
      ...normalized.payload,
    });

    return NextResponse.json(
      {
        id: created._id,
        entryDate: created.entryDate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Daily record create error:", error);
    return NextResponse.json({ error: "Failed to save record." }, { status: 500 });
  }
}
