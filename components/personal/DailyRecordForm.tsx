"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MEAL_FREQUENCY_OPTIONS,
  STUDY_CATEGORY_OPTIONS,
  STUDY_DURATION_OPTIONS,
  WORKOUT_DURATION_OPTIONS,
} from "@/lib/personal-record";

type YesNo = "" | "yes" | "no";

interface TodayResponse {
  hasEntry: boolean;
  entryDate: string;
}

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function DailyRecordForm() {
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [mealsDone, setMealsDone] = useState<YesNo>("");
  const [mealFrequency, setMealFrequency] = useState("");
  const [mealsFeedback, setMealsFeedback] = useState("");
  const [extraSnacks, setExtraSnacks] = useState<YesNo>("");
  const [snacksDetails, setSnacksDetails] = useState("");
  const [workoutDone, setWorkoutDone] = useState<YesNo>("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [swimmingDone, setSwimmingDone] = useState<YesNo>("");
  const [msbDone, setMsbDone] = useState<YesNo>("");
  const [studyWorkDone, setStudyWorkDone] = useState<YesNo>("");
  const [studyCategory, setStudyCategory] = useState("");
  const [studyDuration, setStudyDuration] = useState("");
  const [blueTeaAshwagandhaDone, setBlueTeaAshwagandhaDone] = useState<YesNo>("");

  const disabled = Boolean(today?.hasEntry);

  useEffect(() => {
    const fetchTodayStatus = async () => {
      setLoadingToday(true);
      try {
        const response = await fetch("/api/personal/daily-record/today", { cache: "no-store" });
        const data = (await response.json()) as TodayResponse | { error?: string };

        if (!response.ok) {
          throw new Error("Unable to load today's record status.");
        }

        setToday(data as TodayResponse);
      } catch (error) {
        console.error(error);
        setSubmitError("Unable to load today's status. Refresh and try again.");
      } finally {
        setLoadingToday(false);
      }
    };

    fetchTodayStatus();
  }, []);

  const humanDate = useMemo(() => {
    if (!today?.entryDate) {
      return "today";
    }

    const parsed = new Date(`${today.entryDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return today.entryDate;
    }

    return parsed.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [today?.entryDate]);

  const resetForm = () => {
    setMealsDone("");
    setMealFrequency("");
    setMealsFeedback("");
    setExtraSnacks("");
    setSnacksDetails("");
    setWorkoutDone("");
    setWorkoutDuration("");
    setSwimmingDone("");
    setMsbDone("");
    setStudyWorkDone("");
    setStudyCategory("");
    setStudyDuration("");
    setBlueTeaAshwagandhaDone("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (disabled) {
      setSubmitError("Today's entry is already completed.");
      return;
    }

    const requiredYesNoFields = [
      mealsDone,
      extraSnacks,
      workoutDone,
      swimmingDone,
      msbDone,
      studyWorkDone,
      blueTeaAshwagandhaDone,
    ];

    if (requiredYesNoFields.some((value) => value === "")) {
      setSubmitError("Please complete all required yes/no sections.");
      return;
    }

    if (mealsDone === "no" && !mealFrequency) {
      setSubmitError("Choose meal frequency when all 3 meals are not done.");
      return;
    }

    if (extraSnacks === "yes" && !snacksDetails.trim()) {
      setSubmitError("Please specify extra snacks details.");
      return;
    }

    if (workoutDone === "yes" && !workoutDuration) {
      setSubmitError("Select workout duration.");
      return;
    }

    if (studyWorkDone === "yes" && (!studyCategory || !studyDuration)) {
      setSubmitError("Select study/work type and time spent.");
      return;
    }

    const payload = {
      mealsDone: mealsDone === "yes",
      mealFrequency: mealsDone === "no" ? mealFrequency : null,
      mealsFeedback,
      extraSnacks: extraSnacks === "yes",
      snacksDetails: extraSnacks === "yes" ? snacksDetails : "",
      workoutDone: workoutDone === "yes",
      workoutDuration: workoutDone === "yes" ? workoutDuration : null,
      swimmingDone: swimmingDone === "yes",
      msbDone: msbDone === "yes",
      studyWorkDone: studyWorkDone === "yes",
      studyCategory: studyWorkDone === "yes" ? studyCategory : null,
      studyDuration: studyWorkDone === "yes" ? studyDuration : null,
      blueTeaAshwagandhaDone: blueTeaAshwagandhaDone === "yes",
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/personal/daily-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; entryDate?: string };

      if (!response.ok) {
        setSubmitError(data.error || "Unable to save today's record.");
        return;
      }

      setToday((current) => ({
        hasEntry: true,
        entryDate: data.entryDate || current?.entryDate || "",
      }));
      setSuccessMessage("Saved. Great consistency for today.");
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to save. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl text-[color:var(--personal-text)]">Daily Record</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                Track habits for {humanDate} with a single clean entry.
              </CardDescription>
            </div>
            <Badge className="border-[color:var(--personal-border)] bg-[color:var(--personal-accent-muted)] text-[color:var(--personal-accent-text)]">
              One entry per day
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {loadingToday ? (
        <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
          <CardContent>
            <p className="text-sm text-[color:var(--personal-muted)]">Checking today&apos;s status...</p>
          </CardContent>
        </Card>
      ) : null}

      {!loadingToday && today?.hasEntry ? (
        <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
          <CardContent className="space-y-3">
            <p className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              Record already submitted for {humanDate}. Form is disabled until next day.
            </p>
            <Link
              href="/daily-stats"
              className="inline-flex rounded-xl bg-[color:var(--personal-accent)] px-4 py-2 text-sm font-medium text-[color:var(--personal-accent-foreground)] transition hover:brightness-110"
            >
              View stats
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {!loadingToday && !today?.hasEntry ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardContent className="space-y-5">
              <section className="space-y-3">
                <Label>1) Have you done all three meals today?</Label>
                <RadioGroup name="mealsDone" value={mealsDone} onChange={(value) => setMealsDone(value as YesNo)} options={yesNoOptions} />

                {mealsDone === "no" ? (
                  <div className="space-y-2 rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] p-3">
                    <Label htmlFor="mealFrequency">How many meals done?</Label>
                    <Select id="mealFrequency" value={mealFrequency} onChange={(event) => setMealFrequency(event.target.value)}>
                      <option value="">Select option</option>
                      {MEAL_FREQUENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="mealsFeedback">Feedback / reason (optional)</Label>
                  <Textarea
                    id="mealsFeedback"
                    value={mealsFeedback}
                    onChange={(event) => setMealsFeedback(event.target.value)}
                    placeholder="Anything that affected meals today"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Extra snacks?</Label>
                  <RadioGroup
                    name="extraSnacks"
                    value={extraSnacks}
                    onChange={(value) => setExtraSnacks(value as YesNo)}
                    options={yesNoOptions}
                  />
                </div>

                {extraSnacks === "yes" ? (
                  <div className="space-y-2 rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] p-3">
                    <Label htmlFor="snacksDetails">What snacks were eaten?</Label>
                    <Textarea
                      id="snacksDetails"
                      value={snacksDetails}
                      onChange={(event) => setSnacksDetails(event.target.value)}
                      placeholder="For example: chips, tea biscuit"
                    />
                  </div>
                ) : null}
              </section>

              <section className="space-y-3">
                <Label>2) Workout done today?</Label>
                <RadioGroup
                  name="workoutDone"
                  value={workoutDone}
                  onChange={(value) => setWorkoutDone(value as YesNo)}
                  options={yesNoOptions}
                />

                {workoutDone === "yes" ? (
                  <div className="space-y-2 rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] p-3">
                    <Label htmlFor="workoutDuration">Time spent in workout</Label>
                    <Select
                      id="workoutDuration"
                      value={workoutDuration}
                      onChange={(event) => setWorkoutDuration(event.target.value)}
                    >
                      <option value="">Select duration</option>
                      {WORKOUT_DURATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label>Swimming (class Tue/Sun, except Monday)</Label>
                  <RadioGroup
                    name="swimmingDone"
                    value={swimmingDone}
                    onChange={(value) => setSwimmingDone(value as YesNo)}
                    options={yesNoOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label>MSB done today?</Label>
                  <RadioGroup
                    name="msbDone"
                    value={msbDone}
                    onChange={(value) => setMsbDone(value as YesNo)}
                    options={yesNoOptions}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <Label>3) Study / Work done?</Label>
                <RadioGroup
                  name="studyWorkDone"
                  value={studyWorkDone}
                  onChange={(value) => setStudyWorkDone(value as YesNo)}
                  options={yesNoOptions}
                />

                {studyWorkDone === "yes" ? (
                  <div className="grid gap-3 rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] p-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="studyCategory">Area</Label>
                      <Select id="studyCategory" value={studyCategory} onChange={(event) => setStudyCategory(event.target.value)}>
                        <option value="">Select area</option>
                        {STUDY_CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studyDuration">Time spent</Label>
                      <Select id="studyDuration" value={studyDuration} onChange={(event) => setStudyDuration(event.target.value)}>
                        <option value="">Select time</option>
                        {STUDY_DURATION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="space-y-3">
                <Label>4) Blue tea / Ashwagandha?</Label>
                <RadioGroup
                  name="blueTeaAshwagandhaDone"
                  value={blueTeaAshwagandhaDone}
                  onChange={(value) => setBlueTeaAshwagandhaDone(value as YesNo)}
                  options={yesNoOptions}
                />
              </section>
            </CardContent>
          </Card>

          {submitError ? (
            <p className="rounded-xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {submitError}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={submitting || disabled}
              className="w-full sm:w-auto"
            >
              {submitting ? "Saving..." : "Save Today&apos;s Record"}
            </Button>
            <p className="text-xs text-[color:var(--personal-muted)]">
              After saving, this form auto-locks for the day and reopens tomorrow.
            </p>
          </div>
        </form>
      ) : null}
    </div>
  );
}
