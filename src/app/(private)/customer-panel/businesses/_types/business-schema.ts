import { z } from "zod";

// اسکیما برای آدرس
const addressSchema = z.object({
  street: z.string().min(1, "آدرس کامل الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  state: z.string().min(1, "استان الزامی است"),
  postalCode: z.string().optional(),
});

// اسکیما برای ساعات کاری
export const workingHourSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  isOpen: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export const workingHoursSchema = z.object({
  workingHours: z.array(workingHourSchema),
});

// اسکیما برای تنظیمات کسب‌وکار
export const businessSettingsSchema = z.object({
  allowOnlineOrdering: z.boolean(),
  showPrices: z.boolean(),
  showCalories: z.boolean(),
  showIngredients: z.boolean(),
  theme: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

// اسکیما اصلی برای پروفایل کسب‌وکار
export const businessProfileSchema = z.object({
  name: z.string().min(1, "نام کسب‌وکار الزامی است"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  slug: z.string().min(1, "آدرس منو الزامی است"),
  providerType: z.string().min(1, "نوع کسب‌وکار الزامی است"),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  address: addressSchema,
  workingHours: z.array(workingHourSchema).optional(),
  phone: z.string().regex(/^09[0-9]{9}$/, "شماره تلفن صحیح نیست"),
  email: z.string().email("فرمت ایمیل صحیح نیست").optional().or(z.literal('')),
  website: z.string().url("فرمت وب‌سایت صحیح نیست").optional().or(z.literal('')),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  priceRange: z.enum(["budget", "moderate", "expensive", "fine-dining"]).optional(),
  cuisine: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  settings: businessSettingsSchema.optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  branches: z
    .array(
      z.object({
        title: z.string().min(1, "عنوان شعبه الزامی است"),
        address: z.string().min(1, "آدرس شعبه الزامی است"),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
      })
    )
    .optional(),
  isCompleted: z.boolean().optional(),
});

// تایپ‌های TypeScript
export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type WorkingHourFormData = z.infer<typeof workingHourSchema>;
export type WorkingHoursFormData = z.infer<typeof workingHoursSchema>;
export type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;