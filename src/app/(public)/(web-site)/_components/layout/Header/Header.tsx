"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoBox from "../Footer/LogoBox";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 nav-blur">
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-x-3 ">
            <div suppressHydrationWarning>
              {/* {isMounted ? (
                <Image src={logoSrc} alt="Site Logo" width={150} height={26} />
              ) : (
                <div className="text-lg w-[150px] h-[26px]"></div>
              )} */}

              <LogoBox />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold rose-gold-gradient alexandria">
                منوتپ
              </h1>
              <p className="text-xs text-muted-foreground">
                منوی دیجیتال هوشمند
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              امکانات
            </Link>
            <Link
              href="/providers"
              className="text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              کسب‌وکارها
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              تعرفه‌ها
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              نظرات
            </Link>
            <Button className="premium-button text-sm px-6 py-2">
              شروع کنید
            </Button>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 space-x-reverse md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
            <Link
              href="#features"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              امکانات
            </Link>
            <Link
              href="#businesses"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              کسب‌وکارها
            </Link>
            <Link
              href="#pricing"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              تعرفه‌ها
            </Link>
            <Link
              href="#testimonials"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-rose-gold transition-colors"
            >
              نظرات مشتریان
            </Link>
            <Button className="w-full premium-button text-sm">شروع کنید</Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
