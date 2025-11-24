import { z } from "zod";

// اسکیما برای پاسخ به نظرات
export const replySchema = z.object({
  replyText: z.string().min(1, "متن پاسخ نمی‌تواند خالی باشد"),
});

// تایپ TypeScript برای پاسخ
export type ReplyFormData = z.infer<typeof replySchema>;