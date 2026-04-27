"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/daily-record", label: "Record" },
  { href: "/daily-stats", label: "Stats" },
];

export default function PersonalTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/personal/auth/logout", { method: "POST" });
      router.push("/personal-login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
              active
                ? "border border-[color:var(--personal-accent)] bg-[color:var(--personal-accent-muted)] text-[color:var(--personal-accent-text)]"
                : "text-[color:var(--personal-muted)] hover:bg-[color:var(--personal-border-muted)]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="ml-1 border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] text-[color:var(--personal-text)] hover:bg-[color:var(--personal-border-muted)]"
      >
        {isLoggingOut ? "..." : "Logout"}
      </Button>
    </div>
  );
}
