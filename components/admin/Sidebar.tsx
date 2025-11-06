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
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: Code2 },
  { href: "/admin/skills", label: "Skills", icon: Brain },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/cv-access", label: "CV Access", icon: Download },
];

interface SidebarProps {
  readonly isMobileOpen: boolean;
  readonly onMobileClose: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] md:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col bg-[#27276d] text-white h-screen sticky top-0 shadow-xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button
            onClick={handleToggleCollapse}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-[#27276d] font-semibold shadow-lg"
                    : "hover:bg-white/10 hover:translate-x-1"
                }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t border-white/10 text-xs text-white/60 text-center">
            Use the arrow to collapse
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[95] md:hidden bg-[#27276d] text-white w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#27276d] to-[#1e1e55]">
          <h2 className="text-xl font-bold text-cyan-400">Admin Panel</h2>
          <button
            onClick={onMobileClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/20 active:scale-90 transition-all bg-white/10"
            aria-label="Close menu"
            type="button"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/50">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#27276d] font-semibold shadow-lg scale-105"
                    : "hover:bg-white/10 hover:pl-5"
                }`}
              >
                <Icon size={22} className="flex-shrink-0" />
                <span className="truncate font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#1e1e55]/50">
          <p className="text-xs text-white/60 text-center">
            Tap outside to close
          </p>
        </div>
      </aside>
    </>
  );
}
