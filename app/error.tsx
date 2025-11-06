'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AppError({ error, reset }: Readonly<{ error: Error; reset: () => void }>) {
  const router = useRouter();

  useEffect(() => {
    console.error("An error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500 opacity-30 w-40 h-40 mx-auto" />
        <div className="w-40 h-40 flex items-center justify-center rounded-full bg-cyan-600 text-5xl font-bold z-10 shadow-xl shadow-cyan-700 animate-bounce">
          500
        </div>
      </div>

  <h1 className="mt-10 text-3xl font-bold text-cyan-400">Something went wrong!</h1>
  <p className="text-gray-400 mt-2 mb-6">Do not worry — this is on us.</p>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-cyan-300 border border-cyan-500 transition"
        >
          ⬅ Go Back
        </button>
        <button
          onClick={() => reset()}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white transition"
        >
          🏠 Go Home
        </Link>
      </div>
    </div>
  );
}
