"use client";

import { createContext, useContext, useEffect, useState } from "react";

type MenuCategoryContextValue = {
  selected: string;
  setSelected: (slug: string) => void;
};

const MenuCategoryContext = createContext<MenuCategoryContextValue | undefined>(
  undefined
);

export function MenuCategoryProvider({
  initialCategory,
  children,
}: {
  initialCategory: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string>(initialCategory || "");

  useEffect(() => {
    if (!selected) return;
    const url = new URL(window.location.href);
    url.searchParams.set("category", selected);
    const qs = url.searchParams.toString();
    const next = qs ? `${url.pathname}?${qs}` : url.pathname;
    window.history.replaceState(null, "", next);
  }, [selected]);

  return (
    <MenuCategoryContext.Provider value={{ selected, setSelected }}>
      {children}
    </MenuCategoryContext.Provider>
  );
}

export function useMenuCategory() {
  const ctx = useContext(MenuCategoryContext);
  if (!ctx) {
    throw new Error("useMenuCategory must be used within MenuCategoryProvider");
  }
  return ctx;
}

