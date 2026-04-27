"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DailyStatsResponse } from "@/types/daily-record";

function formatDayLabel(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function TrendChart({ data }: { data: DailyStatsResponse["records"] }) {
  if (!data.length) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] text-sm text-[color:var(--personal-muted)]">
        No data yet. Submit your first daily record.
      </div>
    );
  }

  const width = 720;
  const height = 220;
  const paddingX = 26;
  const paddingY = 22;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points = data.map((item, index) => {
    const x = data.length === 1 ? width / 2 : paddingX + (plotWidth * index) / (data.length - 1);
    const y = paddingY + ((100 - item.scorePercent) / 100) * plotHeight;
    return { x, y, label: formatDayLabel(item.date), score: item.scorePercent };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="overflow-x-auto rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full min-w-[540px]">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = paddingY + ((100 - tick) / 100) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(196, 205, 255, 0.2)"
                strokeWidth="1"
              />
              <text x={6} y={y + 4} fill="rgba(193, 200, 228, 0.9)" fontSize="11">
                {tick}%
              </text>
            </g>
          );
        })}

        <polyline
          fill="none"
          stroke="var(--personal-accent)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          points={polylinePoints}
        />

        {points.map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <circle cx={point.x} cy={point.y} r="4" fill="var(--personal-accent)" />
            <text x={point.x} y={height - 6} textAnchor="middle" fill="rgba(193, 200, 228, 0.9)" fontSize="10">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RateChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] px-3 py-2">
      <p className="text-xs text-[color:var(--personal-muted)]">{label}</p>
      <p className="text-lg font-semibold text-[color:var(--personal-text)]">{value}%</p>
    </div>
  );
}

function formatCell(record: DailyStatsResponse["records"][number], key: "mealsDone" | "workoutDone" | "swimmingDone" | "msbDone" | "studyWorkDone" | "blueTeaAshwagandhaDone") {
  return record[key] ? "Yes" : "No";
}

function buildJsonExport(records: DailyStatsResponse["records"]) {
  return JSON.stringify(records, null, 2);
}

function buildCsvExport(records: DailyStatsResponse["records"]) {
  const headers = [
    "date",
    "mealsDone",
    "mealFrequency",
    "mealsFeedback",
    "extraSnacks",
    "snacksDetails",
    "workoutDone",
    "workoutDuration",
    "swimmingDone",
    "msbDone",
    "studyWorkDone",
    "studyCategory",
    "studyDuration",
    "blueTeaAshwagandhaDone",
    "score",
    "scorePercent",
  ];

  const escapeField = (value: unknown) => {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
      return `"${text.replace(/\"/g, '""')}"`;
    }
    return text;
  };

  const rows = records.map((record) =>
    [
      record.date,
      record.mealsDone,
      record.mealFrequency ?? "",
      record.mealsFeedback,
      record.extraSnacks,
      record.snacksDetails,
      record.workoutDone,
      record.workoutDuration ?? "",
      record.swimmingDone,
      record.msbDone,
      record.studyWorkDone,
      record.studyCategory ?? "",
      record.studyDuration ?? "",
      record.blueTeaAshwagandhaDone,
      record.score,
      record.scorePercent,
    ].map(escapeField)
  );

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function DailyStatsDashboard() {
  const [stats, setStats] = useState<DailyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/personal/daily-stats", { cache: "no-store" });
        const data = (await response.json()) as DailyStatsResponse | { error?: string };

        if (!response.ok) {
          setError((data as { error?: string }).error || "Failed to load stats.");
          return;
        }

        setStats(data as DailyStatsResponse);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Could not load daily stats right now.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const trendInsights = useMemo(() => {
    if (!stats || stats.records.length === 0) {
      return {
        averageScore: 0,
        latestScore: 0,
        bestDay: "-",
        bestScore: 0,
      };
    }

    const total = stats.records.reduce((acc, item) => acc + item.scorePercent, 0);
    const averageScore = Math.round(total / stats.records.length);
    const latestScore = stats.records[stats.records.length - 1].scorePercent;
    const bestRecord = [...stats.records].sort((a, b) => b.scorePercent - a.scorePercent)[0];

    return {
      averageScore,
      latestScore,
      bestDay: formatDayLabel(bestRecord.date),
      bestScore: bestRecord.scorePercent,
    };
  }, [stats]);

  const handleDeleteRecord = async (recordId: string) => {
    const ok = window.confirm("Delete this record permanently?");
    if (!ok) {
      return;
    }

    setActionError("");
    setDeletingId(recordId);

    try {
      const response = await fetch(`/api/personal/daily-record/${recordId}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setActionError(data.error || "Unable to delete record.");
        return;
      }

      const refreshed = await fetch("/api/personal/daily-stats", { cache: "no-store" });
      const refreshedData = (await refreshed.json()) as DailyStatsResponse | { error?: string };
      if (!refreshed.ok) {
        setActionError((refreshedData as { error?: string }).error || "Deleted, but failed to refresh stats.");
        return;
      }

      setStats(refreshedData as DailyStatsResponse);
    } catch (deleteError) {
      console.error(deleteError);
      setActionError("Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (format: "csv" | "json") => {
    if (!stats || stats.records.length === 0) {
      setActionError("No records to export yet.");
      return;
    }

    setActionError("");
    const dateSuffix = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      downloadFile(`personal-records-${dateSuffix}.json`, buildJsonExport(stats.records), "application/json;charset=utf-8");
      return;
    }

    downloadFile(`personal-records-${dateSuffix}.csv`, buildCsvExport(stats.records), "text/csv;charset=utf-8");
  };

  return (
    <div className="space-y-5">
      <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl text-[color:var(--personal-text)]">Daily Stats</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                Habit trends, completion rates, and consistency over time.
              </CardDescription>
            </div>
            <Badge className="border-[color:var(--personal-border)] bg-[color:var(--personal-accent-muted)] text-[color:var(--personal-accent-text)]">
              Insight dashboard
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
          <CardContent>
            <p className="text-sm text-[color:var(--personal-muted)]">Loading stats...</p>
          </CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <p className="rounded-xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>
      ) : null}

      {!loading && stats ? (
        <>
          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardContent className="flex flex-wrap gap-3">
              <Button size="sm" onClick={() => handleDownload("csv")}>
                Download CSV
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDownload("json")}>
                Download JSON
              </Button>
              <p className="text-xs text-[color:var(--personal-muted)]">Export includes all record-level fields for backup and analysis.</p>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
              <CardContent>
                <p className="text-xs text-[color:var(--personal-muted)]">Total entries</p>
                <p className="text-2xl font-bold text-[color:var(--personal-text)]">{stats.summary.totalEntries}</p>
              </CardContent>
            </Card>
            <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
              <CardContent>
                <p className="text-xs text-[color:var(--personal-muted)]">Current streak</p>
                <p className="text-2xl font-bold text-[color:var(--personal-text)]">{stats.summary.currentStreak} days</p>
              </CardContent>
            </Card>
            <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
              <CardContent>
                <p className="text-xs text-[color:var(--personal-muted)]">Average score</p>
                <p className="text-2xl font-bold text-[color:var(--personal-text)]">{trendInsights.averageScore}%</p>
              </CardContent>
            </Card>
            <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
              <CardContent>
                <p className="text-xs text-[color:var(--personal-muted)]">Latest score</p>
                <p className="text-2xl font-bold text-[color:var(--personal-text)]">{trendInsights.latestScore}%</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardHeader>
              <CardTitle className="text-lg text-[color:var(--personal-text)]">Completion Trend</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                Daily score (%) computed from meals, workout, swimming, MSB, study/work, and blue tea/ashwagandha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={stats.records} />
            </CardContent>
          </Card>

          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardHeader>
              <CardTitle className="text-lg text-[color:var(--personal-text)]">Habit Rates</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                How often each key habit has been completed.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <RateChip label="Meals completed" value={stats.summary.mealsDoneRate} />
              <RateChip label="Workout done" value={stats.summary.workoutRate} />
              <RateChip label="Swimming done" value={stats.summary.swimmingRate} />
              <RateChip label="MSB done" value={stats.summary.msbRate} />
              <RateChip label="Study/Work done" value={stats.summary.studyRate} />
              <RateChip label="Blue tea/Ashwagandha" value={stats.summary.blueTeaRate} />
            </CardContent>
          </Card>

          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardHeader>
              <CardTitle className="text-lg text-[color:var(--personal-text)]">Swimming Focus: Tue and Sun</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                Tue rate: {stats.summary.swimmingFocus.tuesdayRate}% | Sun rate: {stats.summary.swimmingFocus.sundayRate}% | Focus total: {stats.summary.swimmingFocus.focusRate}%
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
              {stats.summary.weekdayTrends.map((trend) => (
                <div
                  key={trend.day}
                  className={cn(
                    "rounded-xl border bg-[color:var(--personal-card-muted)] px-3 py-3",
                    trend.day === "Tue" || trend.day === "Sun"
                      ? "border-[color:var(--personal-accent)]"
                      : "border-[color:var(--personal-border)]"
                  )}
                >
                  <p className="text-sm font-semibold text-[color:var(--personal-text)]">{trend.day}</p>
                  <p className="text-xs text-[color:var(--personal-muted)]">Entries: {trend.totalEntries}</p>
                  <p className="mt-2 text-xs text-[color:var(--personal-muted)]">Swim: {trend.swimmingRate}%</p>
                  <p className="text-xs text-[color:var(--personal-muted)]">MSB: {trend.msbRate}%</p>
                  <p className="text-xs text-[color:var(--personal-muted)]">Workout: {trend.workoutRate}%</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[color:var(--personal-border)] bg-[color:var(--personal-card)]">
            <CardHeader>
              <CardTitle className="text-lg text-[color:var(--personal-text)]">Past Records</CardTitle>
              <CardDescription className="text-[color:var(--personal-muted)]">
                Best day: {trendInsights.bestDay} ({trendInsights.bestScore}%).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actionError ? (
                <p className="rounded-xl border border-rose-300/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{actionError}</p>
              ) : null}

              <div className="overflow-x-auto rounded-xl border border-[color:var(--personal-border)]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[color:var(--personal-card-muted)] text-[color:var(--personal-muted)]">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Date</th>
                      <th className="px-3 py-2 text-left font-medium">Meals</th>
                      <th className="px-3 py-2 text-left font-medium">Workout</th>
                      <th className="px-3 py-2 text-left font-medium">Swim</th>
                      <th className="px-3 py-2 text-left font-medium">MSB</th>
                      <th className="px-3 py-2 text-left font-medium">Study</th>
                      <th className="px-3 py-2 text-left font-medium">Blue tea</th>
                      <th className="px-3 py-2 text-left font-medium">Score</th>
                      <th className="px-3 py-2 text-left font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.records.length === 0 ? (
                      <tr>
                        <td className="px-3 py-4 text-[color:var(--personal-muted)]" colSpan={9}>
                          No records found yet.
                        </td>
                      </tr>
                    ) : (
                      [...stats.records]
                        .reverse()
                        .map((record) => (
                          <tr
                            key={record.id}
                            className={cn(
                              "border-t border-[color:var(--personal-border)]",
                              "text-[color:var(--personal-text)]"
                            )}
                          >
                            <td className="px-3 py-2">{formatDayLabel(record.date)}</td>
                            <td className="px-3 py-2">{formatCell(record, "mealsDone")}</td>
                            <td className="px-3 py-2">{formatCell(record, "workoutDone")}</td>
                            <td className="px-3 py-2">{formatCell(record, "swimmingDone")}</td>
                            <td className="px-3 py-2">{formatCell(record, "msbDone")}</td>
                            <td className="px-3 py-2">{formatCell(record, "studyWorkDone")}</td>
                            <td className="px-3 py-2">{formatCell(record, "blueTeaAshwagandhaDone")}</td>
                            <td className="px-3 py-2 font-semibold">{record.scorePercent}%</td>
                            <td className="px-3 py-2">
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={deletingId === record.id}
                                onClick={() => handleDeleteRecord(record.id)}
                              >
                                {deletingId === record.id ? "Deleting..." : "Delete"}
                              </Button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
