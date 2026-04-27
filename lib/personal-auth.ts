import { createHmac } from "crypto";

export const PERSONAL_AUTH_COOKIE = "personal_auth";
export const PERSONAL_TIMEZONE = process.env.PERSONAL_TIMEZONE || "Asia/Kolkata";

export function getPersonalCredentials() {
  const username = process.env.PERSONAL_USERNAME ?? process.env.personal_username;
  const password =
    process.env.PERSONAL_PASSWORD ??
    process.env.personal_password ??
    process.env.password;

  if (!username || !password) {
    throw new Error("Personal credentials are not configured in environment variables.");
  }

  return {
    username,
    password,
  };
}

export function normalizePersonalUsername(username: string) {
  return username.trim().toLowerCase();
}

export function getTodayEntryDate(timeZone: string = PERSONAL_TIMEZONE) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

export function isPersonalCredentialMatch(username: string, password: string) {
  const envCreds = getPersonalCredentials();
  return (
    normalizePersonalUsername(username) === normalizePersonalUsername(envCreds.username) &&
    password === envCreds.password
  );
}

export function getPersonalAuthToken() {
  const { username, password } = getPersonalCredentials();
  const secret = process.env.NEXTAUTH_SECRET || "personal-secret";

  return createHmac("sha256", secret)
    .update(`${normalizePersonalUsername(username)}:${password}`)
    .digest("hex");
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return {} as Record<string, string>;
  }

  return cookieHeader
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const [name, ...valueParts] = part.split("=");
      if (!name) {
        return acc;
      }

      acc[name] = decodeURIComponent(valueParts.join("="));
      return acc;
    }, {});
}

export function isPersonalAuthTokenValid(token: string | undefined) {
  if (!token) {
    return false;
  }

  return token === getPersonalAuthToken();
}

export function isPersonalRequestAuthenticated(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return isPersonalAuthTokenValid(cookies[PERSONAL_AUTH_COOKIE]);
}
