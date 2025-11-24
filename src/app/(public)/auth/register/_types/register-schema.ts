import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "نام الزامی است")
      .max(50, "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
    lastName: z
      .string()
      .min(1, "نام خانوادگی الزامی است")
      .max(50, "نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
    email: z
      .string()
      .email("فرمت ایمیل صحیح نیست"),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 0 || /^09[0-9]{9}$/.test(val), {
        message: "شماره تلفن باید با ۰۹ شروع شده و ۱۱ رقم باشد",
      }),
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z
      .string()
      .min(1, "تأیید رمز عبور الزامی است"),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, "لطفاً شرایط و قوانین را بپذیرید"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "رمز عبور و تأیید آن مطابقت ندارند",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterSchema = typeof registerSchema;