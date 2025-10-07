"use client";

import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CategorySelectCart from "./CategorySelectCart";

type CategorySelectSliderProps = {
  categories: { title: string; titleEn: string }[];
  initialCategory: string;
};

export default function CategorySelectSlider({
  categories,
  initialCategory,
}: CategorySelectSliderProps) {
  const router = useRouter();
  const [api, setApi] = useState<any>(null);
  const [selected, setSelected] = useState<string>(() => {
    if (typeof window === "undefined") return initialCategory;
    return (
      new URLSearchParams(window.location.search).get("category") ||
      initialCategory
    );
  });

  const opts = useMemo(
    () => ({ align: "center", direction: "rtl", loop: true }),
    []
  );

  // وقتی category عوض میشه با انیمیشن برو به همون index
  useEffect(() => {
    if (!api) return;
    const index = categories.findIndex((c) => c.titleEn === selected);
    if (index >= 0) api.scrollTo(index);
  }, [api, selected, categories]);

  // دکمه‌های back/forward مرورگر
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
  }, [initialCategory]);

  const handleSelect = (category: string) => {
    setSelected(category);

    const index = categories.indexOf(category);
    if (api && index >= 0) api.scrollTo(index);

    const params = new URLSearchParams(window.location.search);
    params.set("category", category);

    router.push(`?${params.toString()}`);
  };

  return (
    <Carousel
      opts={opts}
      setApi={setApi}
      className="w-full px-2 pb-3 overflow-auto!"
    >
      <CarouselContent>
        {categories.map((category) => {
          const isActive = selected === category.titleEn;
          return (
            <CategorySelectCart
              key={category.titleEn}
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
