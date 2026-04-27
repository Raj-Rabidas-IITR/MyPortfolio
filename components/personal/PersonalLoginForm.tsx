"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/personal/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to login.");
        return;
      }

      router.push("/daily-record");
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="personal-shell min-h-screen px-4 py-8 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--personal-muted)]">Private Route Group</p>
            <CardTitle className="text-2xl text-[color:var(--personal-text)]">Personal Access</CardTitle>
            <CardDescription className="text-[color:var(--personal-muted)]">
              Enter your credentials to open daily record and stats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="personal-username">Username</Label>
                <Input
                  id="personal-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personal-password">Password</Label>
                <Input
                  id="personal-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-rose-300/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Signing in..." : "Enter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
