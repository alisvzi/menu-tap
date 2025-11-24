import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "نام آیتم الزامی است"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().positive("قیمت باید بیشتر از صفر باشد"),
  originalPrice: z
    .number()
    .optional()
    .refine((val) => !val || val > 0, "قیمت اصلی باید بیشتر از صفر باشد"),
  category: z.string().min(1, "انتخاب دسته‌بندی الزامی است"),
  subcategory: z.string().optional(),
  slug: z.string().optional(), // اگر slug اجباری نیست، optional نگه دارید
  preparationTime: z.number().min(0, "زمان آماده‌سازی نمی‌تواند منفی باشد"),
  calories: z
    .number()
    .optional()
    .refine((val) => !val || val >= 0, "کالری نمی‌تواند منفی باشد"),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
  isSpicy: z.boolean(),
  isPopular: z.boolean(),
  isAvailable: z.boolean(),
  isVisible: z.boolean(),
  tags: z.array(z.string()),
  allergens: z.array(z.string()),
  tagInput: z.string().optional(),
  allergenInput: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    })
  ),
});

// برای refine بیشتر (مثل چک originalPrice > price)
export const refinedMenuItemSchema = menuItemSchema.refine(
  (data) => !data.originalPrice || data.originalPrice > data.price,
  { message: "قیمت اصلی باید بیشتر از قیمت فعلی باشد", path: ["originalPrice"] }
);

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
