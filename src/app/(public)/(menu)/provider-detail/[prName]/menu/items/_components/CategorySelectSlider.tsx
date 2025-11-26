"use client";

import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { useEffect, useMemo, useState } from "react";
import CategorySelectCart from "./CategorySelectCart";
import { useMenuCategory } from "@/providers/menu-category-provider";

type CategorySelectSliderProps = {
  categories: { name: string; nameEn?: string; slug: string }[];
  initialCategory: string;
};

export default function CategorySelectSlider({
  categories,
  initialCategory,
}: CategorySelectSliderProps) {
  const [api, setApi] = useState<any>(null);
  const { selected, setSelected } = useMenuCategory();

  const opts = useMemo(
    () => ({ align: "start", loop: false, direction: "rtl" } as any),
    []
  );

  useEffect(() => {
    if (!api) return;
    const index = categories.findIndex((c) => c.slug === selected);
    if (index >= 0) api.scrollTo(index);
  }, [api, selected, categories]);

  useEffect(() => {
    const onPopState = () => {
      const cat =
        new URLSearchParams(window.location.search).get("category") ||
        initialCategory;
      setSelected(cat);
      window.requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialCategory, setSelected]);

  const handleSelect = (category: string) => {
    setSelected(category);
    const index = categories.findIndex((c) => c.slug === category);
    if (api && index >= 0) api.scrollTo(index);
  };

  return (
    <Carousel
      opts={opts}
      setApi={setApi}
      className="w-full px-2 pb-3 overflow-auto"
      dir="rtl"
    >
      <CarouselContent dir="rtl">
        {categories.map((category) => {
          const isActive = selected === category.slug;
          return (
            <CategorySelectCart
              key={category.slug}
              category={category}
              handleSelect={handleSelect}
              isActive={isActive}
            />
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
