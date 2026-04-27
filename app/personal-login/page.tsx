import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PersonalLoginForm from "@/components/personal/PersonalLoginForm";
import { PERSONAL_AUTH_COOKIE, isPersonalAuthTokenValid } from "@/lib/personal-auth";

export default async function PersonalLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PERSONAL_AUTH_COOKIE)?.value;

  if (isPersonalAuthTokenValid(token)) {
    redirect("/daily-record");
  }

  return <PersonalLoginForm />;
}
