"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/field";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Edit,
  Eye,
  Globe,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Plus,
  Settings,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  businessProfileSchema,
  businessSettingsSchema,
  workingHoursSchema,
  type BusinessProfileFormData,
} from "../_types/business-schema";
import { Provider } from "@/types/business";
import { BusinessInfoForm } from "./_components/business-info-form";
import { WorkingHoursForm } from "./_components/working-hours-form";
import { SettingsForm } from "./_components/settings-form";

interface Business {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  email?: string;
  website?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  workingHours: {
    day: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  }[];
  cuisine: string[];
  priceRange: string;
  features: string[];
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  settings: {
    allowOnlineOrdering: boolean;
    showPrices: boolean;
    showCalories: boolean;
    showIngredients: boolean;
    theme: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  slug: string;
  image?: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
}

interface MenuItem {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: string;
}

const DAYS = [
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
  { value: "confectionery", label: "شیرینی فروشی" },
  { value: "other", label: "غیره" },
];

export default function BusinessManagementPage() {
  const params = useParams() as { providerId?: string };
  const providerId = params?.providerId as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Provider | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMenuItems: 0,
    totalViews: 0,
    totalOrders: 0,
  });

  // فرم اطلاعات کسب‌وکار
  const businessInfoForm = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      phone: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      },
      website: "",
      instagram: "",
      telegram: "",
      whatsapp: "",
    },
  });

  // فرم ساعت‌های کاری
  const workingHoursForm = useForm<z.infer<typeof workingHoursSchema>>({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      workingHours: [],
    },
  });

  // فرم تنظیمات
  const settingsForm = useForm({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      showPrices: true,
      showCalories: false,
      showIngredients: false,
      allowOnlineOrdering: true,
    },
  });

  useEffect(() => {
    if (providerId) {
      fetchBusinessData();
    }
  }, [providerId]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      // Fetch business details
      const businessResponse = await fetch(`/api/providers/${providerId}`);
      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        setBusiness(businessData.data);

        // پر کردن فرم اطلاعات کسب‌وکار با داده‌های دریافتی
        businessInfoForm.reset({
          name: businessData.data.name,
          nameEn: businessData.data.nameEn || "",
          description: businessData.data.description || "",
          phone: businessData.data.phone,
          email: businessData.data.email || "",
          address: {
            street: businessData.data.address.street,
            city: businessData.data.address.city,
            state: businessData.data.address.state,
            postalCode: businessData.data.address.postalCode || "",
          },
          website: businessData.data.website || "",
          instagram: businessData.data.instagram || "",
          telegram: businessData.data.telegram || "",
          whatsapp: businessData.data.whatsapp || "",
          isActive: businessData.data.isActive,
          isVerified: businessData.data.isVerified,
          branches: businessData.data.branches || [],
        });

        // پر کردن فرم تنظیمات
        settingsForm.reset({
          showPrices: businessData.data.settings.showPrices,
          showCalories: businessData.data.settings.showCalories,
          showIngredients: businessData.data.settings.showIngredients,
          allowOnlineOrdering:
            businessData.data.settings.allowOnlineOrdering,
        });
      }

      // Fetch categories via business slug
      const categoriesResponse = await fetch(
        `/api/providers/${providerId}/categories`
      );
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data?.categories || []);
        setStats((prev) => ({
          ...prev,
          totalCategories: categoriesData.data?.categories?.length || 0,
        }));
      }

      // Fetch menu items
      const menuItemsResponse = await fetch(
        `/api/menu-items?providerId=${business?._id}&limit=10`
      );
      if (menuItemsResponse.ok) {
        const menuItemsData = await menuItemsResponse.json();
        setMenuItems(menuItemsData.menuItems || []);
        setStats((prev) => ({
          ...prev,
          totalMenuItems: menuItemsData.pagination?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessUpdate = async (updatedData: Partial<Provider>) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/providers/${providerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setBusiness(data.data);
        alert("اطلاعات با موفقیت بروزرسانی شد");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "خطا در بروزرسانی");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      alert("خطا در بروزرسانی");
    } finally {
      setSaving(false);
    }
  };

  const onSubmitBusinessInfo = async (data: BusinessProfileFormData) => {
    const update: Partial<Provider> = {
      name: data.name,
      nameEn: data.nameEn,
      description: data.description,
      descriptionEn: data.descriptionEn,
      slug: data.slug,
      providerType: data.providerType,
      logo: data.logo,
      coverImage: data.coverImage,
      address: data.address,
      workingHours: data.workingHours,
      phone: data.phone,
      email: data.email || undefined,
      website: data.website || undefined,
      instagram: data.instagram,
      telegram: data.telegram,
      whatsapp: data.whatsapp,
      cuisine: data.cuisine || [],
      priceRange: data.priceRange as Provider['priceRange'],
      features: data.features || [],
      isActive: data.isActive ?? false,
      isVerified: data.isVerified ?? false,
      branches: data.branches?.map((b) => ({
        name: b.title,
        address: b.address,
        coordinates: b.coordinates,
      })),
    };
    await handleBusinessUpdate(update);
  };

  const onSubmitSettings = async (data: any) => {
    await handleBusinessUpdate({ settings: data });
  };

  const onSubmitWorkingHours = async (data: { workingHours: any[] }) => {
    await handleBusinessUpdate({ workingHours: data.workingHours });
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">دسته‌بندی‌ها</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">دسته‌بندی فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آیتم‌های منو</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMenuItems}</div>
            <p className="text-xs text-muted-foreground">آیتم در منو</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بازدیدها</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">این ماه</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سفارشات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">کل سفارشات</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>عملیات سریع</CardTitle>
          <CardDescription>دسترسی سریع به عملکردهای پرکاربرد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-4"
            >
              <Link
                href={`/customer-panel/menu-items/new?businessId=${providerId}`}
              >
                <div className="text-right">
                  <Plus className="w-5 h-5 mb-2" />
                  <div className="font-medium">آیتم جدید</div>
                  <div className="text-sm text-muted-foreground">
                    افزودن غذا یا نوشیدنی
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-4"
            >
              <Link
                href={`/customer-panel/categories/new?businessId=${providerId}`}
              >
                <div className="text-right">
                  <Menu className="w-5 h-5 mb-2" />
                  <div className="font-medium">دسته‌بندی جدید</div>
                  <div className="text-sm text-muted-foreground">
                    ایجاد گروه جدید
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-4"
            >
              <Link href={`/provider-detail/${business?.slug}`} target="_blank">
                <div className="text-right">
                  <Eye className="w-5 h-5 mb-2" />
                  <div className="font-medium">نمایش منو</div>
                  <div className="text-sm text-muted-foreground">
                    مشاهده منوی عمومی
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab("settings")}
              className="justify-start h-auto p-4"
            >
              <div className="text-right">
                <Settings className="w-5 h-5 mb-2" />
                <div className="font-medium">تنظیمات</div>
                <div className="text-sm text-muted-foreground">
                  شخصی‌سازی منو
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>دسته‌بندی‌ها</CardTitle>
              <CardDescription>مدیریت دسته‌بندی‌های منو</CardDescription>
            </div>
            <Button onClick={() => setActiveTab("categories")}>
              مشاهده همه
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Menu className="w-8 h-8 mx-auto mb-2" />
              <p>هیچ دسته‌بندی‌ای یافت نشد</p>
              <Button asChild className="mt-4">
                <Link
                  href={`/customer-panel/categories/new?businessId=${providerId}`}
                >
                  ایجاد اولین دسته‌بندی
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.slice(0, 5).map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Menu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/customer-panel/categories/${category._id}/edit`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Menu Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>آیتم‌های اخیر</CardTitle>
              <CardDescription>آخرین آیتم‌های اضافه شده به منو</CardDescription>
            </div>
            <Button onClick={() => setActiveTab("menu")}>مشاهده همه</Button>
          </div>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Store className="w-8 h-8 mx-auto mb-2" />
              <p>هیچ آیتم منو‌ای یافت نشد</p>
              <Button asChild className="mt-4">
                <Link
                  href={`/customer-panel/menu-items/new?businessId=${providerId}`}
                >
                  افزودن اولین آیتم
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category.name} • {item.price.toLocaleString()}{" "}
                        تومان
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isFeatured && <Badge variant="outline">ویژه</Badge>}
                    {item.isPopular && <Badge variant="outline">محبوب</Badge>}
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/customer-panel/menu-items/${item._id}/edit`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessInfoTab = () => {
    if (!business) return null;

    return (
      <BusinessInfoForm
        business={business}
        setBusiness={setBusiness}
        onSubmit={handleBusinessUpdate}
      />
    );
  };



  const renderWorkingHoursTab = () => {
    if (!business) return null;

    return (
      <Form {...workingHoursForm}>
        <form onSubmit={workingHoursForm.handleSubmit(onSubmitWorkingHours)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                ساعات کاری
              </CardTitle>
              <CardDescription>تنظیم ساعات کاری کسب‌وکار</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS.map((day, index) => {
                  const workingHour = business.workingHours.find(
                    (wh) => wh.day === day.key
                  );
                  return (
                    <div
                      key={day.key}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-20">
                        <Label className="text-sm font-medium">
                          {day.label}
                        </Label>
                      </div>
                      <FormField
                        control={workingHoursForm.control}
                        name={`workingHours.${index}.isOpen`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm cursor-pointer">
                              فعال
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {workingHour?.isOpen && (
                        <>
                          <FormField
                            control={workingHoursForm.control}
                            name={`workingHours.${index}.openTime`}
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormLabel className="text-sm">از:</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="time"
                                    className="w-24"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={workingHoursForm.control}
                            name={`workingHours.${index}.closeTime`}
                            render={({ field }) => (
                              <Field className="flex items-center gap-2">
                                <FieldLabel className="text-sm">تا:</FieldLabel>
                                <Input
                                  {...field}
                                  type="time"
                                  className="w-24"
                                  data-invalid={
                                    !!workingHoursForm.formState.errors
                                      ?.workingHours?.[index]?.closeTime
                                  }
                                />
                                {workingHoursForm.formState.errors
                                  ?.workingHours?.[index]?.closeTime && (
                                  <FieldError>
                                    {workingHoursForm.formState.errors?.workingHours?.[
                                      index
                                    ]?.closeTime?.message?.toString()}
                                  </FieldError>
                                )}
                              </Field>
                            )}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="premium-button"
                >
                  {saving ? "در حال ذخیره..." : "ذخیره ساعات کاری"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  };

  const renderSettingsTab = () => {
    if (!business) return null;

    return (
      <div className="space-y-6">
        <Form {...settingsForm}>
          <form onSubmit={settingsForm.handleSubmit(onSubmitSettings)}>
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات منو</CardTitle>
                <CardDescription>
                  مدیریت تنظیمات نمایش منو و سفارشات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={settingsForm.control}
                    name="showPrices"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          نمایش قیمت‌ها
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="showCalories"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          نمایش کالری
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="showIngredients"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          نمایش مواد تشکیل‌دهنده
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="allowOnlineOrdering"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          سفارش آنلاین
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="premium-button"
                  >
                    {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">کسب‌وکار یافت نشد</h2>
          <p className="text-muted-foreground mb-4">
            کسب‌وکار مورد نظر شما یافت نشد یا دسترسی به آن ندارید
          </p>
          <Button asChild>
            <Link href="/customer-panel">بازگشت به پیشخوان</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "نمای کلی", icon: BarChart3 },
    { id: "info", label: "اطلاعات کسب‌وکار", icon: Store },
    { id: "hours", label: "ساعات کاری", icon: Clock },
    { id: "categories", label: "دسته‌بندی‌ها", icon: Menu },
    { id: "menu", label: "آیتم‌های منو", icon: Store },
    { id: "analytics", label: "آمار و تحلیل", icon: TrendingUp },
    { id: "settings", label: "تنظیمات", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/customer-panel">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {business.address.city}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {business.phone}
            </span>
            {business.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {business.rating.toFixed(1)}
                {business.reviewCount && ` (${business.reviewCount})`}
              </span>
            )}
            <Badge variant={business.isActive ? "default" : "secondary"}>
              {business.isActive ? "فعال" : "غیرفعال"}
            </Badge>
            {business.isVerified && (
              <Badge variant="outline" className="text-green-600">
                تایید شده
              </Badge>
            )}
          </div>
        </div>
        <Button asChild>
          <Link href={`/provider-detail/${business.slug}`} target="_blank">
            <Eye className="w-4 h-4 mr-2" />
            نمایش منو
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverviewTab()}
      {activeTab === "info" && renderBusinessInfoTab()}
      {activeTab === "hours" && renderWorkingHoursTab()}
      {activeTab === "settings" && renderSettingsTab()}
      {activeTab === "categories" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>دسته‌بندی‌ها</CardTitle>
                <CardDescription>مدیریت دسته‌بندی‌های منو</CardDescription>
              </div>
              <Button asChild>
                <Link
                  href={`/customer-panel/categories/new?businessId=${business._id}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  دسته‌بندی جدید
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Menu className="w-8 h-8 mx-auto mb-2" />
              <p>مدیریت دسته‌بندی‌ها در حال توسعه است</p>
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === "menu" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>آیتم‌های منو</CardTitle>
                <CardDescription>مدیریت آیتم‌های منو</CardDescription>
              </div>
              <Button asChild>
                <Link
                  href={`/customer-panel/menu-items/new?businessId=${business._id}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  آیتم جدید
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Store className="w-8 h-8 mx-auto mb-2" />
              <p>مدیریت آیتم‌های منو در حال توسعه است</p>
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === "analytics" && (
        <Card>
          <CardHeader>
            <CardTitle>آمار و تحلیل</CardTitle>
            <CardDescription>آمار بازدید و فروش</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p>آمار و تحلیل در حال توسعه است</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
