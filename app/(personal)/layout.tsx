import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PersonalTopNav from "@/components/personal/PersonalTopNav";
import { PERSONAL_AUTH_COOKIE, isPersonalAuthTokenValid } from "@/lib/personal-auth";

export default async function PersonalLayout({ children }: { readonly children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(PERSONAL_AUTH_COOKIE)?.value;

  if (!isPersonalAuthTokenValid(token)) {
    redirect("/personal-login");
  }

  return (
    <div className="personal-shell min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[color:var(--personal-border)] bg-[color:var(--personal-surface)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-base text-[color:var(--personal-text)] sm:text-lg">
              <span className="font-extrabold">Raj</span> Personal Planner
            </h1>
          </div>
          <PersonalTopNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
