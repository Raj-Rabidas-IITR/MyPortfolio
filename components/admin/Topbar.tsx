'use client';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Topbar({ session }: { session: any }) {
  const router = useRouter();
  
  return (
    <header className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
      <h1 className="text-xl font-bold text-cyan-400">Welcome, Admin</h1>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">{session?.user?.email}</span>
         <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Home
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
