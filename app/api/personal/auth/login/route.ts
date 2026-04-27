import { PERSONAL_AUTH_COOKIE, isPersonalCredentialMatch, normalizePersonalUsername, getPersonalAuthToken } from "@/lib/personal-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    if (!isPersonalCredentialMatch(username, password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      username: normalizePersonalUsername(username),
    });

    response.cookies.set({
      name: PERSONAL_AUTH_COOKIE,
      value: getPersonalAuthToken(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });

    return response;
  } catch (error) {
    console.error("Personal login error:", error);
    return NextResponse.json({ error: "Unable to login right now." }, { status: 500 });
  }
}
