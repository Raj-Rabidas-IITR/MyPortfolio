import { connectDB } from "@/lib/db";
import DailyRecord from "@/lib/models/DailyRecord";
import { getPersonalCredentials, getTodayEntryDate, isPersonalRequestAuthenticated, normalizePersonalUsername } from "@/lib/personal-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (!isPersonalRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const today = getTodayEntryDate();
    const username = normalizePersonalUsername(getPersonalCredentials().username);

    const existing = await DailyRecord.findOne({ username, entryDate: today });

    return NextResponse.json({
      hasEntry: Boolean(existing),
      entryDate: today,
    });
  } catch (error) {
    console.error("Daily today fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch today status." }, { status: 500 });
  }
}
