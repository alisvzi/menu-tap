import { z } from "zod";

// Schema for profile information form
export const profileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z.string().min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد").regex(/^[0-9+]+$/, "شماره تلفن فقط می‌تواند شامل اعداد و + باشد"),
  city: z.string().min(2, "نام شهر باید حداقل ۲ کاراکتر باشد"),
  address: z.string().min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
  bio: z.string().max(500, "درباره من نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد").optional(),
});

// Schema for password change form
export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "رمز عبور باید شامل حروف بزرگ، کوچک، عدد و نماد باشد"),
  confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "رمز عبور جدید و تکرار آن مطابقت ندارند",
  path: ["confirmPassword"],
});

// Schema for privacy settings form
export const privacySchema = z.object({
  profileVisibility: z.enum(["public", "private", "business"]),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  allowMarketing: z.boolean(),
  dataSharing: z.boolean(),
});

// TypeScript types
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type PrivacyFormData = z.infer<typeof privacySchema>;