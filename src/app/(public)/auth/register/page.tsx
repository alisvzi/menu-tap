"use client";

import { Form, FormField } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import { ErrorHandler } from "@/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Store,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "./_types/register-schema";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setError("");

      await register(data);
    } catch (err) {
      const errorInfo = ErrorHandler.handle(err);
      setError(errorInfo.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            ثبت‌نام در منوتپ
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
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>نام *</FieldLabel>
                        <Input
                          {...field}
                          placeholder="نام خود را وارد کنید"
                          disabled={isLoading}
                          data-invalid={!!form.formState.errors.firstName}
                        />
                        {form.formState.errors.firstName && (
                          <FieldError>
                            {form.formState.errors.firstName.message?.toString()}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>نام خانوادگی *</FieldLabel>
                        <Input
                          {...field}
                          placeholder="نام خانوادگی خود را وارد کنید"
                          disabled={isLoading}
                          data-invalid={!!form.formState.errors.lastName}
                        />
                        {form.formState.errors.lastName && (
                          <FieldError>
                            {form.formState.errors.lastName.message?.toString()}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>ایمیل *</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@domain.com"
                          className="pr-9"
                          autoComplete="email"
                          disabled={isLoading}
                          data-invalid={!!form.formState.errors.email}
                        />
                      </div>
                      <FieldDescription>
                        برای ورود و دریافت اطلاعیه‌ها استفاده می‌شود
                      </FieldDescription>
                      {form.formState.errors.email && (
                        <FieldError>
                          {form.formState.errors.email.message?.toString()}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>شماره تلفن</FieldLabel>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="tel"
                          placeholder="09xxxxxxxxx"
                          className="pr-9"
                          disabled={isLoading}
                          data-invalid={!!form.formState.errors.phone}
                        />
                      </div>
                      <FieldDescription>
                        اختیاری - برای تماس و ارسال پیامک
                      </FieldDescription>
                      {form.formState.errors.phone && (
                        <FieldError>
                          {form.formState.errors.phone.message?.toString()}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>رمز عبور *</FieldLabel>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="رمز عبور خود را وارد کنید"
                            className="pr-9 pl-9"
                            autoComplete="new-password"
                            disabled={isLoading}
                            data-invalid={!!form.formState.errors.password}
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
                        {form.formState.errors.password && (
                          <FieldError>
                            {form.formState.errors.password.message?.toString()}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>تأیید رمز عبور *</FieldLabel>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="رمز عبور را مجدد وارد کنید"
                            className="pr-9 pl-9"
                            autoComplete="new-password"
                            disabled={isLoading}
                            data-invalid={
                              !!form.formState.errors.confirmPassword
                            }
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
                        {form.formState.errors.confirmPassword && (
                          <FieldError>
                            {form.formState.errors.confirmPassword.message?.toString()}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <Field>
                      <div className="flex items-start space-x-2 space-x-reverse">
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          data-invalid={!!form.formState.errors.acceptTerms}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <FieldLabel
                            htmlFor="acceptTerms"
                            className="cursor-pointer"
                          >
                            شرایط و قوانین را می‌پذیرم *
                          </FieldLabel>
                          <FieldDescription className="text-xs">
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
                          </FieldDescription>
                        </div>
                      </div>
                      {form.formState.errors.acceptTerms && (
                        <FieldError>
                          {form.formState.errors.acceptTerms.message?.toString()}
                        </FieldError>
                      )}
                    </Field>
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
