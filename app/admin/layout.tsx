import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar"; // Assuming this exists
import Topbar from "@/components/admin/Topbar";   // Optional but nice
import React from "react";
import AdminFooter from "@/components/admin/AdminFooter";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
   <div className="flex min-h-screen bg-gray-950 text-white">
  <Sidebar />
  
  <div className="flex flex-col flex-1 min-h-screen">
    <Topbar session={session} />

    {/* Make this section scrollable */}
    <main className="flex-grow overflow-y-auto p-6">
      {children}
    </main>

    <AdminFooter />
  </div>
</div>

  );
}
