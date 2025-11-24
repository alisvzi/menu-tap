import { z } from "zod";

export const ticketSchema = z.object({
  subject: z.string().min(1, "موضوع نمی‌تواند خالی باشد").max(100, "موضوع نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  category: z.string().min(1, "لطفاً دسته‌بندی را انتخاب کنید"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد").max(1000, "توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد")
});

export const contactSchema = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد").max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  subject: z.string().min(1, "موضوع نمی‌تواند خالی باشد").max(100, "موضوع نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  message: z.string().min(10, "پیام باید حداقل ۱۰ کاراکتر باشد").max(500, "پیام نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد")
});

export type TicketFormData = z.infer<typeof ticketSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;