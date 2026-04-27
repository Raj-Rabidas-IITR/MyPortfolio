import { connectDB } from "@/lib/db";
import DailyRecord from "@/lib/models/DailyRecord";
import {
  getPersonalCredentials,
  isPersonalRequestAuthenticated,
  normalizePersonalUsername,
} from "@/lib/personal-auth";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isPersonalRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const username = normalizePersonalUsername(getPersonalCredentials().username);

    const deleted = await DailyRecord.findOneAndDelete({
      _id: id,
      username,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully." });
  } catch (error) {
    console.error("Daily record delete error:", error);
    return NextResponse.json({ error: "Failed to delete record." }, { status: 500 });
  }
}
