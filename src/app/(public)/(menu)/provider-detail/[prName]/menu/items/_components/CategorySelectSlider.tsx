"use client";

import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CategorySelectCart from "./CategorySelectCart";

type CategorySelectSliderProps = {
  categories: { name: string; nameEn?: string; slug: string }[];
  initialCategory: string;
};

export default function CategorySelectSlider({
  categories,
  initialCategory,
}: CategorySelectSliderProps) {
  const router = useRouter();
  const [api, setApi] = useState<any>(null);

  const [selected, setSelected] = useState<string>(() => {
    const param =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("category")
        : null;
    return param || initialCategory;
  });

  const opts = useMemo(() => ({ align: "center", loop: false } as any), []);

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
  }, [initialCategory]);

  const handleSelect = (category: string) => {
    setSelected(category);

    const index = categories.findIndex((c) => c.slug === category);
    if (api && index >= 0) api.scrollTo(index);

    const params = new URLSearchParams(window.location.search);
    params.set("category", category);

    router.push(`?${params.toString()}`);
  };

  return (
    <Carousel
      opts={opts}
      setApi={setApi}
      className="w-full px-2 pb-3 overflow-auto" // Fix #2
    >
      <CarouselContent>
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
