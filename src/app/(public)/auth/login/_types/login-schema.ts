import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("فرمت ایمیل صحیح نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export type LoginSchema = typeof loginSchema;