'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  LayoutDashboard,
  Code2,
  Brain,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/profile", label: "Profile", icon: <User size={18} /> },
  { href: "/admin/projects", label: "Projects", icon: <Code2 size={18} /> },
  { href: "/admin/skills", label: "Skills", icon: <Brain size={18} /> },
  { href: "/admin/education", label: "Education", icon: <GraduationCap size={18} /> },
  { href: "/admin/experience", label: "Experience", icon: <Briefcase size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#27276d] text-white p-6 space-y-4 hidden md:block shadow-md">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-3">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
              pathname === href
                ? "bg-white text-[#27276d] font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
