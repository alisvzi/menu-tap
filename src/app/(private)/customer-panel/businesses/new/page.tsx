"use client";

import { Form, FormField } from "@/components/forms/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/context";
import { ErrorHandler } from "@/lib/errors";
import { BusinessProfileData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Phone,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FieldPath } from "react-hook-form";
import { useForm } from "react-hook-form";
import { businessProfileSchema } from "../_types/business-schema";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "دوشنبه" },
  { key: "tuesday", label: "سه‌شنبه" },
  { key: "wednesday", label: "چهارشنبه" },
  { key: "thursday", label: "پنج‌شنبه" },
  { key: "friday", label: "جمعه" },
  { key: "saturday", label: "شنبه" },
  { key: "sunday", label: "یکشنبه" },
];

const PROVIDER_TYPES = [
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const form = useForm<BusinessProfileData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      slug: "",
      providerType: "",
      logo: "",
      coverImage: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      },
      workingHours: DAYS.map((day) => ({
        day: day.key,
        isOpen: true,
        openTime: "09:00",
        closeTime: "22:00",
      })),
      phone: "",
      email: "",
      website: "",
      instagram: "",
      telegram: "",
      whatsapp: "",
      priceRange: "moderate",
      cuisine: [],
      features: [],
      branches: [],
      isActive: true,
      isVerified: false,
    },
  });

  const watchName = form.watch("name");
  const watchSlug = form.watch("slug");
  const [
    stepName,
    stepProviderType,
    stepSlug,
    stepAddressStreet,
    stepAddressCity,
    stepAddressState,
    stepPhone,
  ] = form.watch([
    "name",
    "providerType",
    "slug",
    "address.street",
    "address.city",
    "address.state",
    "phone",
  ]);
  const isStepOneFilled = [
    stepName,
    stepProviderType,
    stepSlug,
    stepAddressStreet,
    stepAddressCity,
    stepAddressState,
    stepPhone,
  ].every((value) => typeof value === "string" && value.trim().length > 0);

  const STEP_VALIDATION_FIELDS: Record<
    number,
    FieldPath<BusinessProfileData>[]
  > = {
    1: [
      "name",
      "providerType",
      "slug",
      "address.street",
      "address.city",
      "address.state",
      "phone",
    ],
    2: [],
    3: [],
  };

  const slugifyFa = (text: string) => {
    const map: Record<string, string> = {
      آ: "a",
      ا: "a",
      ب: "b",
      پ: "p",
      ت: "t",
      ث: "s",
      ج: "j",
      چ: "ch",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "z",
      ر: "r",
      ز: "z",
      ژ: "zh",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "z",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ک: "k",
      گ: "g",
      ل: "l",
      م: "m",
      ن: "n",
      و: "o",
      ه: "h",
      ی: "y",
      ء: "",
      ئ: "y",
      ؤ: "o",
      ي: "y",
      ك: "k",
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
    };
    const normalized = (text || "")
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return normalized;
  };

  const normalizeDigits = (text: string) => {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const en = "0123456789";
    return (text || "").replace(/[۰-۹]/g, (d) => en[fa.indexOf(d)]);
  };

  useEffect(() => {
    if (watchName && (!watchSlug || watchSlug === "")) {
      const slug = slugifyFa(watchName);
      form.setValue("slug", slug);
    }
  }, [watchName, watchSlug, form]);

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_VALIDATION_FIELDS[step] || [];
    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) {
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCuisineToggle = (cuisine: string) => {
    const currentCuisines = form.getValues("cuisine") || [];
    const updatedCuisines = currentCuisines.includes(cuisine)
      ? currentCuisines.filter((c) => c !== cuisine)
      : [...currentCuisines, cuisine];
    form.setValue("cuisine", updatedCuisines);
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = form.getValues("features") || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    form.setValue("features", updatedFeatures);
  };

  const handleWorkingHourChange = (
    dayKey: DayKey,
    field: string,
    value: string | boolean
  ) => {
    const currentHours = form.getValues("workingHours") || [];
    const updatedHours = currentHours.map((hour) =>
      hour.day === dayKey ? { ...hour, [field]: value } : hour
    );
    form.setValue("workingHours", updatedHours);
  };

  const onSubmit = async (data: BusinessProfileData) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          isActive: data.isActive,
          isVerified: data.isVerified,
          branches: data.branches,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "ایجاد کسب‌وکار ناموفق بود");
      }

      const slug = json?.data?.slug || data.slug;
      router.push(`/customer-panel/businesses/${slug}`);
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
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="name">نام کسب‌وکار</FieldLabel>
                    <Input
                      id="name"
                      {...field}
                      placeholder="رستوران سنتی پارسی"
                      disabled={loading}
                    />
                    <FieldDescription>
                      نام کسب‌وکار خود را وارد کنید
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="nameEn"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="nameEn">نام انگلیسی</FieldLabel>
                    <Input
                      id="nameEn"
                      {...field}
                      placeholder="Parsi Restaurant"
                      disabled={loading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="providerType"
                rules={{
                  required: "نوع کسب‌وکار الزامی است",
                }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="providerType">نوع کسب‌وکار</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger id="providerType">
                        <SelectValue placeholder="نوع کسب‌وکار را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      نوع کسب‌وکار خود را انتخاب کنید
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
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
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="slug">آدرس منو (URL)</FieldLabel>
                  <Input
                    id="slug"
                    {...field}
                    placeholder="parsi-restaurant"
                    disabled={loading}
                  />
                  <FieldDescription>
                    {`منوی شما در آدرس: bestmenu.ir/menu/${
                      field.value || "your-slug"
                    } قابل دسترسی خواهد بود`}
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="description">توضیحات</FieldLabel>
                    <Textarea
                      id="description"
                      {...field}
                      placeholder="بهترین غذاهای سنتی ایرانی..."
                      rows={3}
                      disabled={loading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="descriptionEn">
                      توضیحات انگلیسی
                    </FieldLabel>
                    <Textarea
                      id="descriptionEn"
                      {...field}
                      placeholder="Best traditional Persian cuisine..."
                      rows={3}
                      disabled={loading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="priceRange">محدوده قیمت</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger id="priceRange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">اقتصادی</SelectItem>
                        <SelectItem value="moderate">متوسط</SelectItem>
                        <SelectItem value="expensive">گران</SelectItem>
                        <SelectItem value="fine-dining">لوکس</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label className="text-base font-medium">تصاویر کسب‌وکار</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="logo">لوگوی کسب‌وکار</FieldLabel>
                      <ImageUpload
                        value={
                          field.value
                            ? [
                                {
                                  url: field.value,
                                  name: "logo",
                                  size: 0,
                                  type: "image/*",
                                },
                              ]
                            : []
                        }
                        onChange={(images) =>
                          field.onChange(images[0]?.url || "")
                        }
                        maxFiles={1}
                        maxSize={5}
                        folder="businesses/logos"
                        variant="single"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="coverImage">تصویر کاور</FieldLabel>
                      <ImageUpload
                        value={
                          field.value
                            ? [
                                {
                                  url: field.value,
                                  name: "cover",
                                  size: 0,
                                  type: "image/*",
                                },
                              ]
                            : []
                        }
                        onChange={(images) =>
                          field.onChange(images[0]?.url || "")
                        }
                        maxFiles={1}
                        maxSize={8}
                        folder="businesses/covers"
                        variant="single"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="phone">شماره تلفن</FieldLabel>
                      <Input
                        id="phone"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(normalizeDigits(e.target.value))
                        }
                        placeholder="09123456789"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="email">ایمیل</FieldLabel>
                      <Input
                        id="email"
                        {...field}
                        type="email"
                        placeholder="info@restaurant.com"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
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
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="address.street">آدرس کامل</FieldLabel>
                    <Textarea
                      id="address.street"
                      {...field}
                      placeholder="تهران، خیابان ولیعصر، کوچه..."
                      rows={2}
                      disabled={loading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="address.city">شهر</FieldLabel>
                      <Input
                        id="address.city"
                        {...field}
                        placeholder="تهران"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  rules={{
                    required: "استان الزامی است",
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="address.state">استان</FieldLabel>
                      <Input
                        id="address.state"
                        {...field}
                        placeholder="تهران"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="address.postalCode">
                        کد پستی
                      </FieldLabel>
                      <Input
                        id="address.postalCode"
                        {...field}
                        placeholder="1234567890"
                        disabled={loading}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
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
            const workingHour = (form.getValues("workingHours") || []).find(
              (wh) => wh.day === day.key
            );
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
                            e.target.value
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
                            e.target.value
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
          <CardTitle>وضعیت و شعب</CardTitle>
          <CardDescription>فعال‌سازی کسب‌وکار و مدیریت شعب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="isActive">فعال</FieldLabel>
                  <Switch
                    id="isActive"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="isVerified">تأیید شده</FieldLabel>
                  <Switch
                    id="isVerified"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </div>

          <div className="space-y-4 mt-4">
            <Label className="text-base font-medium">شعب</Label>
            {(form.getValues("branches") || []).length === 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue("branches", [
                    { title: "", address: "", coordinates: { lat: 0, lng: 0 } },
                  ])
                }
              >
                افزودن شعبه
              </Button>
            ) : (
              <div className="space-y-3">
                {(form.getValues("branches") || []).map((br, index) => (
                  <div key={index} className="border rounded p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`branches.${index}.title` as any}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>عنوان شعبه</FieldLabel>
                            <Input
                              {...field}
                              placeholder="شعبه مرکزی"
                              disabled={loading}
                            />
                          </Field>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`branches.${index}.address` as any}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>آدرس شعبه</FieldLabel>
                            <Textarea
                              {...field}
                              rows={2}
                              placeholder="تهران، ..."
                              disabled={loading}
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`branches.${index}.coordinates.lat` as any}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>عرض جغرافیایی (lat)</FieldLabel>
                            <Input
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={loading}
                            />
                          </Field>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`branches.${index}.coordinates.lng` as any}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>طول جغرافیایی (lng)</FieldLabel>
                            <Input
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={loading}
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current = form.getValues("branches") || [];
                          const next = current.filter((_, i) => i !== index);
                          form.setValue("branches", next);
                        }}
                      >
                        حذف شعبه
                      </Button>
                      {index ===
                        (form.getValues("branches") || []).length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const current = form.getValues("branches") || [];
                            form.setValue("branches", [
                              ...current,
                              {
                                title: "",
                                address: "",
                                coordinates: { lat: 0, lng: 0 },
                              },
                            ]);
                          }}
                        >
                          افزودن شعبه
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="website">وب‌سایت</FieldLabel>
                      <Input
                        id="website"
                        {...field}
                        placeholder="https://restaurant.com"
                        disabled={loading}
                      />
                      <FieldDescription>آدرس وب‌سایت کسب‌وکار</FieldDescription>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="instagram">اینستاگرام</FieldLabel>
                      <Input
                        id="instagram"
                        {...field}
                        placeholder="@restaurant"
                        disabled={loading}
                      />
                      <FieldDescription>نام کاربری اینستاگرام</FieldDescription>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="telegram">تلگرام</FieldLabel>
                      <Input
                        id="telegram"
                        {...field}
                        placeholder="@restaurant"
                        disabled={loading}
                      />
                      <FieldDescription>نام کاربری تلگرام</FieldDescription>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="whatsapp">واتساپ</FieldLabel>
                      <Input
                        id="whatsapp"
                        {...field}
                        placeholder="09123456789"
                        disabled={loading}
                      />
                      <FieldDescription>شماره واتساپ</FieldDescription>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
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
                  (form.getValues("cuisine") || []).includes(cuisine)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => !loading && handleCuisineToggle(cuisine)}
              >
                {cuisine}
                {(form.getValues("cuisine") || []).includes(cuisine) && (
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
            امکانات موجود در کسب‌وکار خود را مشص کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((feature) => (
              <Badge
                key={feature}
                variant={
                  (form.getValues("features") || []).includes(feature)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => !loading && handleFeatureToggle(feature)}
              >
                {feature}
                {(form.getValues("features") || []).includes(feature) && (
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
              disabled={loading || (step === 1 && !isStepOneFilled)}
              className="premium-button"
            >
              مرحله بعد
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
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
