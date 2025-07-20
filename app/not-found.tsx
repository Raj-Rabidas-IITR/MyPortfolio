'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500 opacity-30 w-32 h-32 mx-auto" />
        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-cyan-600 text-4xl font-bold z-10 shadow-md shadow-cyan-700 animate-bounce">
          404
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-bold text-cyan-400">Page Not Found</h1>
      <p className="text-gray-400 mt-2 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/"
        className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded text-white text-sm tracking-wide transition"
      >
        🏠 Back to Home
      </Link>
    </div>
  );
}
