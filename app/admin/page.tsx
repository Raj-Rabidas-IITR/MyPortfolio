import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-xl">
        Access Denied. Please log in.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">Welcome to your Admin Dashboard</h1>
      <p className="text-gray-400">Use the sidebar to manage your profile, skills, and projects.</p>
    </div>
  );
}
