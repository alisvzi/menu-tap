"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { LoginCredentials } from "@/types/auth";
import { ErrorHandler } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, Field } from "@/components/forms/field";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError("");
      await login(data);
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
            <LogIn className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ورود به بست منو</h1>
          <p className="text-muted-foreground mt-2">
            به پنل مدیریت منوی دیجیتال خود وارد شوید
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center">
              ورود به حساب کاربری
            </CardTitle>
            <CardDescription className="text-center">
              ایمیل و رمز عبور خود را وارد کنید
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
                      description="ایمیل ثبت‌نامی خود را وارد کنید"
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
                  name="password"
                  rules={{
                    required: "رمز عبور الزامی است",
                    minLength: {
                      value: 6,
                      message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                    },
                  }}
                  render={({ field }) => (
                    <Field
                      label="رمز عبور"
                      required
                      description="رمز عبور حساب کاربری خود را وارد کنید"
                    >
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="رمز عبور خود را وارد کنید"
                          className="pr-9 pl-9"
                          autoComplete="current-password"
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

                <div className="flex items-center justify-between">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </Link>
                </div>
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
                      در حال ورود...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      ورود
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  حساب کاربری ندارید؟{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    ثبت‌نام کنید
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            با ورود، شما{" "}
            <Link href="/terms" className="text-primary hover:underline">
              شرایط و قوانین
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              حریم خصوصی
            </Link>{" "}
            را می‌پذیرید
          </p>
        </div>
      </div>
    </div>
  );
}
