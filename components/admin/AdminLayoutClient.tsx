'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface AdminLayoutClientProps {
  readonly children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar (includes both desktop and mobile drawer) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen w-full relative">
        {/* Mobile Menu Button - High z-index to ensure it's clickable */}
        <button
          onClick={() => {
            console.log('Mobile menu clicked!');
            setIsMobileMenuOpen(true);
          }}
          className="md:hidden fixed top-4 left-4 z-[100] flex items-center justify-center w-14 h-14 bg-[#27276d] text-white rounded-xl shadow-2xl hover:bg-[#3333a0] active:scale-90 transition-all border-2 border-cyan-400 hover:border-cyan-300"
          aria-label="Open menu"
          type="button"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {children}
      </div>
    </div>
  );
}
