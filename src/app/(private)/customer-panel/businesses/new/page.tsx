"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth/context";
import { ErrorHandler } from "@/lib/errors";
import { BusinessProfileData } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormField, Field } from "@/components/forms/field";
import {
  ArrowRight,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  MessageCircle,
  Clock,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const DAYS = [
  { key: "monday", label: "دوشنبه" },
  { key: "tuesday", label: "سه‌شنبه" },
  { key: "wednesday", label: "چهارشنبه" },
  { key: "thursday", label: "پنج‌شنبه" },
  { key: "friday", label: "جمعه" },
  { key: "saturday", label: "شنبه" },
  { key: "sunday", label: "یکشنبه" },
];

const BUSINESS_TYPES = [
  { value: "restaurant", label: "رستوران" },
  { value: "cafe", label: "کافه" },
  { value: "bakery", label: "نانوایی" },
  { value: "fast-food", label: "فست فود" },
  { value: "food-truck", label: "فود تراک" },
  { value: "catering", label: "خدمات پذیرایی" },
  { value: "other", label: "سایر" },
];

const CUISINES = [
  "ایرانی",
  "فست‌فود",
  "ایتالیایی",
  "چینی",
  "مکزیکی",
  "هندی",
  "ترکی",
  "عربی",
  "فرانسوی",
  "ژاپنی",
  "کره‌ای",
  "تایلندی",
];

const FEATURES = [
  "پارکینگ",
  "Wi-Fi رایگان",
  "تحویل درب منزل",
  "سرویس بیرون‌بر",
  "محیط خانوادگی",
  "محیط کسب‌وکار",
  "پذیرایی از کودکان",
  "دسترسی برای معلولان",
  "فضای باز",
  "موسیقی زنده",
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const form = useForm<BusinessProfileData>({
    defaultValues: {
      name: user?.business?.name || "",
      nameEn: user?.business?.nameEn || "",
      description: user?.business?.description || "",
      descriptionEn: user?.business?.descriptionEn || "",
      slug: user?.business?.slug || "",
      businessType: user?.business?.businessType || "",
      address: {
        street: user?.business?.address?.street || "",
        city: user?.business?.address?.city || "",
        state: user?.business?.address?.state || "",
        postalCode: user?.business?.address?.postalCode || "",
      },
      workingHours:
        user?.business?.workingHours ||
        DAYS.map((day) => ({
          day: day.key,
          isOpen: true,
          openTime: "09:00",
          closeTime: "22:00",
        })),
      phone: user?.business?.phone || "",
      email: user?.business?.email || "",
      website: user?.business?.website || "",
      instagram: user?.business?.instagram || "",
      telegram: user?.business?.telegram || "",
      whatsapp: user?.business?.whatsapp || "",
      priceRange: user?.business?.priceRange || "moderate",
      cuisine: user?.business?.cuisine || [],
      features: user?.business?.features || [],
    },
  });

  const watchName = form.watch("name");
  const watchSlug = form.watch("slug");

  // Auto-generate slug from name
  useState(() => {
    if (watchName && (!watchSlug || watchSlug === "")) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  });

  const validateStep = (stepNumber: number) => {
    const values = form.getValues();
    switch (stepNumber) {
      case 1:
        return (
          values.name &&
          values.phone &&
          values.businessType &&
          values.address.street &&
          values.address.city &&
          values.address.state &&
          values.slug
        );
      case 2:
        return true; // Working hours are optional
      case 3:
        return true; // Additional info is optional
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleCuisineToggle = (cuisine: string) => {
    const currentCuisines = form.getValues("cuisine");
    const updatedCuisines = currentCuisines.includes(cuisine)
      ? currentCuisines.filter((c) => c !== cuisine)
      : [...currentCuisines, cuisine];
    form.setValue("cuisine", updatedCuisines);
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = form.getValues("features");
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    form.setValue("features", updatedFeatures);
  };

  const handleWorkingHourChange = (
    dayKey: string,
    field: string,
    value: string | boolean,
  ) => {
    const currentHours = form.getValues("workingHours");
    const updatedHours = currentHours.map((hour) =>
      hour.day === dayKey ? { ...hour, [field]: value } : hour,
    );
    form.setValue("workingHours", updatedHours);
  };

  const onSubmit = async (data: BusinessProfileData) => {
    try {
      setLoading(true);
      setError("");

      await updateProfile({
        business: {
          ...data,
          settings: {
            allowOnlineOrdering: false,
            showPrices: true,
            showCalories: false,
            showIngredients: false,
            theme: "default",
            primaryColor: "#d4a574",
            secondaryColor: "#f4e4c1",
          },
          isActive: true,
          isCompleted: true,
        },
      });

      router.push("/customer-panel");
    } catch (err) {
      const errorInfo = ErrorHandler.handle(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          اطلاعات پایه کسب‌وکار
        </CardTitle>
        <CardDescription>
          اطلاعات اصلی کسب‌وکار خود را وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "نام کسب‌وکار الزامی است",
                  maxLength: {
                    value: 100,
                    message: "نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد",
                  },
                }}
                render={({ field }) => (
                  <Field label="نام کسب‌وکار" required>
                    <Input
                      {...field}
                      placeholder="رستوران سنتی پارسی"
                      disabled={loading}
                    />
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                rules={{
                  required: "نوع کسب‌وکار الزامی است",
                }}
                render={({ field }) => (
                  <Field label="نوع کسب‌وکار" required>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="نوع کسب‌وکار را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              rules={{
                required: "آدرس منو الزامی است",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است",
                },
              }}
              render={({ field }) => (
                <Field
                  label="آدرس منو (URL)"
                  required
                  description={`منوی شما در آدرس: bestmenu.ir/menu/${
                    field.value || "your-slug"
                  } قابل دسترسی خواهد بود`}
                >
                  <Input
                    {...field}
                    placeholder="parsi-restaurant"
                    disabled={loading}
                  />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Field label="توضیحات">
                    <Textarea
                      {...field}
                      placeholder="بهترین غذاهای سنتی ایرانی..."
                      rows={3}
                      disabled={loading}
                    />
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <Field label="محدوده قیمت">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">اقتصادی</SelectItem>
                        <SelectItem value="moderate">متوسط</SelectItem>
                        <SelectItem value="expensive">گران</SelectItem>
                        <SelectItem value="fine-dining">لوکس</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                اطلاعات تماس
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    required: "شماره تلفن الزامی است",
                    pattern: {
                      value: /^09[0-9]{9}$/,
                      message: "شماره تلفن صحیح نیست",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="شماره تلفن" required>
                      <Input
                        {...field}
                        placeholder="09123456789"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "فرمت ایمیل صحیح نیست",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="ایمیل">
                      <Input
                        {...field}
                        type="email"
                        placeholder="info@restaurant.com"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                آدرس
              </Label>
              <FormField
                control={form.control}
                name="address.street"
                rules={{
                  required: "آدرس کامل الزامی است",
                }}
                render={({ field }) => (
                  <Field label="آدرس کامل" required>
                    <Textarea
                      {...field}
                      placeholder="تهران، خیابان ولیعصر، کوچه..."
                      rows={2}
                      disabled={loading}
                    />
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  rules={{
                    required: "شهر الزامی است",
                  }}
                  render={({ field }) => (
                    <Field label="شهر" required>
                      <Input
                        {...field}
                        placeholder="تهران"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  rules={{
                    required: "استان الزامی است",
                  }}
                  render={({ field }) => (
                    <Field label="استان" required>
                      <Input
                        {...field}
                        placeholder="تهران"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <Field label="کد پستی">
                      <Input
                        {...field}
                        placeholder="1234567890"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          ساعات کاری
        </CardTitle>
        <CardDescription>ساعات کاری کسب‌وکار خود را تنظیم کنید</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DAYS.map((day) => {
            const workingHour = form
              .getValues("workingHours")
              .find((wh) => wh.day === day.key);
            return (
              <div
                key={day.key}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-20">
                  <Label className="text-sm font-medium">{day.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={workingHour?.isOpen}
                    onCheckedChange={(checked) =>
                      handleWorkingHourChange(day.key, "isOpen", checked)
                    }
                    disabled={loading}
                  />
                  <Label className="text-sm">فعال</Label>
                </div>
                {workingHour?.isOpen && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">از:</Label>
                      <Input
                        type="time"
                        value={workingHour.openTime}
                        onChange={(e) =>
                          handleWorkingHourChange(
                            day.key,
                            "openTime",
                            e.target.value,
                          )
                        }
                        className="w-24"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">تا:</Label>
                      <Input
                        type="time"
                        value={workingHour.closeTime}
                        onChange={(e) =>
                          handleWorkingHourChange(
                            day.key,
                            "closeTime",
                            e.target.value,
                          )
                        }
                        className="w-24"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            شبکه‌های اجتماعی
          </CardTitle>
          <CardDescription>
            لینک‌های شبکه‌های اجتماعی و وب‌سایت خود را اضافه کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <Field label="وب‌سایت" description="آدرس وب‌سایت کسب‌وکار">
                      <Input
                        {...field}
                        placeholder="https://restaurant.com"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <Field
                      label="اینستاگرام"
                      description="نام کاربری اینستاگرام"
                    >
                      <Input
                        {...field}
                        placeholder="@restaurant"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <Field label="تلگرام" description="نام کاربری تلگرام">
                      <Input
                        {...field}
                        placeholder="@restaurant"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <Field label="واتساپ" description="شماره واتساپ">
                      <Input
                        {...field}
                        placeholder="09123456789"
                        disabled={loading}
                      />
                    </Field>
                  )}
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نوع غذا</CardTitle>
          <CardDescription>
            انواع غذاهایی که سرو می‌کنید را انتخاب کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <Badge
                key={cuisine}
                variant={
                  form.getValues("cuisine").includes(cuisine)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => !loading && handleCuisineToggle(cuisine)}
              >
                {cuisine}
                {form.getValues("cuisine").includes(cuisine) && (
                  <X className="w-3 h-3 mr-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>امکانات</CardTitle>
          <CardDescription>
            امکانات موجود در کسب‌وکار خود را مشخص کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((feature) => (
              <Badge
                key={feature}
                variant={
                  form.getValues("features").includes(feature)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => !loading && handleFeatureToggle(feature)}
              >
                {feature}
                {form.getValues("features").includes(feature) && (
                  <X className="w-3 h-3 mr-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/customer-panel">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تکمیل اطلاعات کسب‌وکار</h1>
          <p className="text-muted-foreground">
            مرحله {step} از 3:{" "}
            {step === 1
              ? "اطلاعات پایه"
              : step === 2
                ? "ساعات کاری"
                : "اطلاعات تکمیلی"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 rounded ${
                  step > stepNumber ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={loading}
            >
              مرحله قبل
            </Button>
          )}
        </div>
        <div>
          {step < 3 ? (
            <Button
              onClick={handleNextStep}
              disabled={!validateStep(step) || loading}
              className="premium-button"
            >
              مرحله بعد
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || !validateStep(step)}
              className="premium-button"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  تکمیل پروفیل
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">نکات مهم:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• آدرس منو (URL) نمی‌تواند بعداً تغییر کند</li>
                <li>
                  • تصاویر لوگو و کاور را بعد از تکمیل می‌توانید اضافه کنید
                </li>
                <li>• می‌توانید تمام اطلاعات را بعداً ویرایش کنید</li>
                <li>
                  • پس از تکمیل، می‌توانید منو و دسته‌بندی‌هایتان را اضافه کنید
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
