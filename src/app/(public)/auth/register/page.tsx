"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { RegisterData } from "@/types/auth";
import { ErrorHandler } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, Field } from "@/components/forms/field";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Store,
} from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<RegisterData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setError("");

      if (data.password !== data.confirmPassword) {
        setError("رمز عبور و تأیید آن مطابقت ندارند");
        return;
      }

      if (!data.acceptTerms) {
        setError("لطفاً شرایط و قوانین را بپذیرید");
        return;
      }

      await register(data);
    } catch (err) {
      const errorInfo = ErrorHandler.handle(err);
      setError(errorInfo.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            ثبت‌نام در بست منو
          </h1>
          <p className="text-muted-foreground mt-2">
            منوی دیجیتال خود را ایجاد و مدیریت کنید
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center">
              ایجاد حساب کاربری جدید
            </CardTitle>
            <CardDescription className="text-center">
              اطلاعات شخصی خود را وارد کنید
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{
                      required: "نام الزامی است",
                      maxLength: {
                        value: 50,
                        message: "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد",
                      },
                    }}
                    render={({ field }) => (
                      <Field label="نام" required>
                        <Input
                          {...field}
                          placeholder="نام خود را وارد کنید"
                          disabled={isLoading}
                        />
                      </Field>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{
                      required: "نام خانوادگی الزامی است",
                      maxLength: {
                        value: 50,
                        message:
                          "نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد",
                      },
                    }}
                    render={({ field }) => (
                      <Field label="نام خانوادگی" required>
                        <Input
                          {...field}
                          placeholder="نام خانوادگی خود را وارد کنید"
                          disabled={isLoading}
                        />
                      </Field>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "فرمت ایمیل صحیح نیست",
                    },
                  }}
                  render={({ field }) => (
                    <Field
                      label="ایمیل"
                      required
                      description="برای ورود و دریافت اطلاعیه‌ها استفاده می‌شود"
                    >
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@domain.com"
                          className="pr-9"
                          autoComplete="email"
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    pattern: {
                      value: /^09[0-9]{9}$/,
                      message: "شماره تلفن باید با ۰۹ شروع شده و ۱۱ رقم باشد",
                    },
                  }}
                  render={({ field }) => (
                    <Field
                      label="شماره تلفن"
                      description="اختیاری - برای تماس و ارسال پیامک"
                    >
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="tel"
                          placeholder="09xxxxxxxxx"
                          className="pr-9"
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "رمز عبور الزامی است",
                      minLength: {
                        value: 6,
                        message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                      },
                    }}
                    render={({ field }) => (
                      <Field label="رمز عبور" required>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="رمز عبور خود را وارد کنید"
                            className="pr-9 pl-9"
                            autoComplete="new-password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: "تأیید رمز عبور الزامی است",
                    }}
                    render={({ field }) => (
                      <Field label="تأیید رمز عبور" required>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="رمز عبور را مجدد وارد کنید"
                            className="pr-9 pl-9"
                            autoComplete="new-password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    )}
                  />
                </div>

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  rules={{
                    required: "لطفاً شرایط و قوانین را بپذیرید",
                  }}
                  render={({ field }) => (
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <Checkbox
                        id="acceptTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="acceptTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          شرایط و قوانین را می‌پذیرم *
                        </label>
                        <p className="text-xs text-muted-foreground">
                          با ثبت‌نام، شما{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            شرایط و قوانین
                          </Link>{" "}
                          و{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            حریم خصوصی
                          </Link>{" "}
                          ما را می‌پذیرید.
                        </p>
                      </div>
                    </div>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full premium-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      در حال ثبت‌نام...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      ثبت‌نام
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  قبلاً ثبت‌نام کرده‌اید؟{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    وارد شوید
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 p-4 bg-primary/10 rounded-xl mb-4">
            <Store className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              پس از ثبت‌نام، کسب‌وکار خود را ایجاد کنید
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>رایگان برای همیشه</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>بدون محدودیت منو</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>پشتیبانی ۲۴/۷</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
