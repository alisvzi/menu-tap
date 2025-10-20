"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 h-16 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger /> {/* این خودش collapse و expand رو کنترل می‌کنه */}
        <div className="relative">
          <Input
            type="search"
            placeholder="جستجو..."
            className="w-48 md:w-72 pr-9"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
