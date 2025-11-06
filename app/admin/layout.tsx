import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import AdminFooter from "@/components/admin/AdminFooter";
import TopProgress from '@/components/admin/TopProgress';
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import Topbar from "@/components/admin/Topbar";

export default async function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <AdminLayoutClient>
      <TopProgress />
      <Topbar session={session} />
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        {children}
      </main>
      <AdminFooter />
    </AdminLayoutClient>
  );
}
