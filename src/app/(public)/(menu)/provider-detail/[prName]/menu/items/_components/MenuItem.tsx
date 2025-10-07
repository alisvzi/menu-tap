"use client";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import Image from "next/image";

interface MenuItemProps {
  image?: string;
  nameFa?: string;
  nameEn?: string;
  ingredients?: string[] | string;
  price?: string | number;
  currency?: string;
  isFeatured?: boolean;
}

/**
 * MenuItem (Mobile Optimized)
 * - حالت ویژه: عمودی با بج 🔥 پیشنهاد مجموعه
 * - حالت عادی: سطری با قیمت برجسته مشابه حالت ویژه
 */
export default function MenuItem({
  image = "/provider.webp",
  nameFa = "خوراک نمونه",
  nameEn = "Sample Dish",
  ingredients = [],
  price = "--",
  currency = "تومان",
  isFeatured = false,
}: MenuItemProps) {
  const ing = Array.isArray(ingredients) ? ingredients.join("، ") : ingredients;

  // حالت ویژه (عمودی)
  if (isFeatured) {
    return (
      <Item className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="w-full relative">
          <Image
            src={image}
            alt={`${nameFa} - ${nameEn}`}
            width={100}
            height={33}
            className="w-full h-33 object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow">
            <Flame className="fill-red-700 stroke-red-700 " /> پیشنهاد مجموعه
          </Badge>
        </div>

        <ItemContent className="w-full pt-4 space-y-2 flex flex-col flex-1">
          <ItemHeader>
            <ItemTitle>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {nameFa}
              </h3>
            </ItemTitle>
            <span className="text-sm text-muted-foreground">{nameEn}</span>
          </ItemHeader>

          <ItemDescription>
            <span className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {ing}
            </span>
          </ItemDescription>

          <ItemFooter className="pt-3 mt-auto flex justify-end">
            <span className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-primary bg-muted/40">
              {price}{" "}
              <span className="text-xs text-muted-foreground">{currency}</span>
            </span>
          </ItemFooter>
        </ItemContent>
      </Item>
    );
  }

  // حالت عادی (سطری)
  return (
    <Item
      className={cn(
        "w-full flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm active:scale-[0.98] transition-transform duration-100"
      )}
    >
      <ItemMedia>
        <div className="w-24 h-24 overflow-hidden rounded-xl">
          <img
            src={image}
            alt={`${nameFa} - ${nameEn}`}
            className="object-cover w-full h-full"
          />
        </div>
      </ItemMedia>

      <ItemContent className="flex-1 min-w-0 flex flex-col justify-between">
        <ItemHeader>
          <ItemTitle>
            <h3 className="text-base font-semibold text-card-foreground truncate">
              {nameFa}
            </h3>
          </ItemTitle>
          <p className="text-xs text-muted-foreground truncate">{nameEn}</p>
        </ItemHeader>

        <ItemDescription>
          <span className="text-xs text-muted-foreground truncate">{ing}</span>
        </ItemDescription>

        <ItemFooter className="pt-2 flex justify-end">
          <span className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-primary bg-muted/40">
            {price}{" "}
            <span className="text-xs text-muted-foreground">{currency}</span>
          </span>
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}
