"use client";

import { formatPrice } from "@/utility/utils";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../../../../../../../../components/ui/badge";
import { Button } from "../../../../../../../../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../../../../../../../../components/ui/drawer";

interface ItemDetailDrawerProps {
  item: {
    images?: string[];
    name_fa: string;
    name_en?: string;
    price: number;
    originalPrice?: number;
    description?: string;
    preparationTime?: number;
    ingredients?: string[];
    allergens?: string[];
    isSpecialOffer?: boolean;
    isPopular?: boolean;
  };

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * ✅ نسخه‌ی استاندارد ItemDetailDrawer
 * - از DrawerTrigger برای دکمه‌ی باز کردن استفاده می‌کند
 * - بدون Dialog و بدون کنترل دستی state
 */
export default function ItemDetailDrawer({
  item,
  open,
  setOpen,
}: ItemDetailDrawerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = item.images && item.images.length > 1;

  const discountPercentage =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0;

  const prevImage = () => {
    if (!item.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images!.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!item.images) return;
    setCurrentImageIndex((prev) =>
      prev === item.images!.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(state) => state === false && setOpen(false)}
    >
      {/* محتوای Drawer */}
      <DrawerContent className="max-w-xl mx-auto">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle className="text-right">جزئیات آیتم</DrawerTitle>
          {/* <Button variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button> */}
        </DrawerHeader>

        <div className="p-4 space-y-6">
          {/* تصاویر */}
          {item.images && item.images.length > 0 && (
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item.images[currentImageIndex]}
                  alt={item.name_fa}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              {hasMultipleImages && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {item.isSpecialOffer && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500 text-white">پیشنهاد ویژه</Badge>
                </div>
              )}
            </div>
          )}

          {/* جزئیات اصلی */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{item.name_fa}</h2>
                  {item.isPopular && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                {item.name_en && (
                  <p className="text-muted-foreground">{item.name_en}</p>
                )}
              </div>

              <div className="text-left">
                <div className="text-xl font-bold text-primary">
                  {formatPrice(item.price)} تومان
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)} تومان
                    </span>
                    {discountPercentage > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {discountPercentage}% تخفیف
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* توضیحات */}
            {item.description && (
              <div>
                <h3 className="font-semibold mb-2">توضیحات</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* زمان آماده‌سازی */}
            {item.preparationTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  زمان آماده‌سازی: {item.preparationTime} دقیقه
                </span>
              </div>
            )}

            {/* مواد تشکیل‌دهنده */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">مواد تشکیل‌دهنده</h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* آلرژن‌ها */}
            {item.allergens && item.allergens.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-orange-600">آلرژن‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="text-xs"
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
