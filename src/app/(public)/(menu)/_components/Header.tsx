"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SheetMenu from "./SheetMenu";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMenu = pathname.includes("menu");

  if (isMenu)
    return (
      <header className="fixed top-0 w-full z-50  border-b border-gray-200 nav-blur shadow-md dark:shadow-none">
        <div className="max-w-xl mx-auto px-4 py-3 flex justify-between items-center">
          <SheetMenu />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 bg-black/10 dark:bg-white/20 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div id="menu-portal" className="max-w-xl mx-auto" />
      </header>
    );
  return null;
};

export default Header;
