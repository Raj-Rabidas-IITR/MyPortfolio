'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-[#27276d] shadow-md hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-white">Admin Panel</h2>
        <nav className="space-y-3">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded transition ${
                pathname === href
                  ? "bg-white text-[#27276d] font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
