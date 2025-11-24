"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  LogOut,
  Save,
  Shield,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  passwordSchema,
  privacySchema,
  profileSchema,
  type PasswordFormData,
  type PrivacyFormData,
  type ProfileFormData,
} from "./_types/account-schema";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  address: string;
  city: string;
  country: string;
  joinDate: string;
  lastLogin: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  passwordLastChanged: string;
  activeSessions: number;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "business";
  showEmail: boolean;
  showPhone: boolean;
  allowMarketing: boolean;
  dataSharing: boolean;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "احمد محمدی",
    email: "ahmad@example.com",
    phone: "09123456789",
    avatar: "",
    bio: "مدیر رستوران و علاقه‌مند به غذاهای سنتی ایرانی",
    address: "خیابان ولیعصر، پلاک 123",
    city: "تهران",
    country: "ایران",
    joinDate: "1402/01/15",
    lastLogin: "1402/08/25 - 14:30",
    emailVerified: true,
    phoneVerified: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    passwordLastChanged: "1402/06/10",
    activeSessions: 3,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "business",
    showEmail: false,
    showPhone: true,
    allowMarketing: true,
    dataSharing: false,
  });

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      address: profile.address,
      bio: profile.bio,
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Privacy form
  const privacyForm = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: privacy.profileVisibility,
      showEmail: privacy.showEmail,
      showPhone: privacy.showPhone,
      allowMarketing: privacy.allowMarketing,
      dataSharing: privacy.dataSharing,
    },
  });

  const updateProfile = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const updateSecurity = (key: keyof SecuritySettings, value: any) => {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  const updatePrivacy = (key: keyof PrivacySettings, value: any) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      setProfile((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        bio: data.bio || "",
      }));

      // Show success message
      alert("اطلاعات پروفایل با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Update security settings
      setSecurity((prev) => ({
        ...prev,
        passwordLastChanged: new Date().toLocaleDateString("fa-IR"),
      }));

      // Show success message
      alert("رمز عبور با موفقیت تغییر یافت");
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePrivacy = async (data: PrivacyFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      setPrivacy((prev) => ({
        ...prev,
        profileVisibility: data.profileVisibility,
        showEmail: data.showEmail,
        showPhone: data.showPhone,
        allowMarketing: data.allowMarketing,
        dataSharing: data.dataSharing,
      }));

      // Show success message
      alert("تنظیمات حریم خصوصی با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    // This would typically redirect to a confirmation page or API call
    console.log("Account deletion requested");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            تنظیمات حساب
          </h1>
          <p className="text-muted-foreground">
            مدیریت اطلاعات شخصی و تنظیمات امنیتی
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={profile.emailVerified ? "default" : "secondary"}>
            {profile.emailVerified ? "تایید شده" : "تایید نشده"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            پروفایل
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            حریم خصوصی
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            صورتحساب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات شخصی</CardTitle>
                  <CardDescription>
                    اطلاعات پایه حساب کاربری خود را ویرایش کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(saveProfile)}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-lg">
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="ml-2 h-4 w-4" />
                            تغییر عکس پروفایل
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            فرمت‌های مجاز: JPG, PNG (حداکثر 2MB)
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نام و نام خانوادگی</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ایمیل</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input type="email" {...field} />
                                  {!profile.emailVerified && (
                                    <Button variant="outline" size="sm">
                                      تایید
                                    </Button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شماره تلفن</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input {...field} />
                                  {!profile.phoneVerified && (
                                    <Button variant="outline" size="sm">
                                      تایید
                                    </Button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شهر</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>آدرس</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>درباره من</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="کمی درباره خود و کسب‌وکارتان بنویسید..."
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
                        ) : (
                          <Save className="ml-2 h-4 w-4" />
                        )}
                        ذخیره تغییرات
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات حساب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">تاریخ عضویت</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.joinDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">آخرین ورود</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.lastLogin}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ایمیل تایید شده</span>
                      <Badge
                        variant={
                          profile.emailVerified ? "default" : "secondary"
                        }
                      >
                        {profile.emailVerified ? "بله" : "خیر"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">تلفن تایید شده</span>
                      <Badge
                        variant={
                          profile.phoneVerified ? "default" : "secondary"
                        }
                      >
                        {profile.phoneVerified ? "بله" : "خیر"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>تغییر رمز عبور</CardTitle>
                <CardDescription>
                  رمز عبور قوی انتخاب کنید که شامل حروف، اعداد و نمادها باشد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(changePassword)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رمز عبور فعلی</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رمز عبور جدید</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تکرار رمز عبور جدید</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
                      ) : (
                        <Key className="ml-2 h-4 w-4" />
                      )}
                      تغییر رمز عبور
                    </Button>
                  </form>
                </Form>

                <p className="text-xs text-muted-foreground">
                  آخرین تغییر رمز عبور: {security.passwordLastChanged}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تنظیمات امنیتی</CardTitle>
                <CardDescription>امنیت حساب خود را افزایش دهید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>احراز هویت دو مرحله‌ای</Label>
                    <p className="text-sm text-muted-foreground">
                      افزایش امنیت با کد تایید پیامکی
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      updateSecurity("twoFactorEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>اعلان ورود</Label>
                    <p className="text-sm text-muted-foreground">
                      اطلاع‌رسانی ورود از دستگاه‌های جدید
                    </p>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) =>
                      updateSecurity("loginNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">جلسات فعال</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تعداد دستگاه‌های متصل</span>
                    <Badge variant="outline">{security.activeSessions}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج از همه دستگاه‌ها
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات حریم خصوصی</CardTitle>
              <CardDescription>
                کنترل کنید چه اطلاعاتی از شما قابل مشاهده باشد
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...privacyForm}>
                <form
                  onSubmit={privacyForm.handleSubmit(savePrivacy)}
                  className="space-y-4"
                >
                  <FormField
                    control={privacyForm.control}
                    name="profileVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نمایش پروفایل</FormLabel>
                        <FormControl>
                          <div className="grid gap-2">
                            <label className="flex items-center space-x-2 space-x-reverse">
                              <input
                                type="radio"
                                value="public"
                                checked={field.value === "public"}
                                onChange={() => field.onChange("public")}
                              />
                              <span className="text-sm">
                                عمومی - همه می‌توانند ببینند
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 space-x-reverse">
                              <input
                                type="radio"
                                value="business"
                                checked={field.value === "business"}
                                onChange={() => field.onChange("business")}
                              />
                              <span className="text-sm">
                                تجاری - فقط مشتریان
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 space-x-reverse">
                              <input
                                type="radio"
                                value="private"
                                checked={field.value === "private"}
                                onChange={() => field.onChange("private")}
                              />
                              <span className="text-sm">خصوصی - فقط خودم</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">نمایش اطلاعات تماس</h4>

                    <FormField
                      control={privacyForm.control}
                      name="showEmail"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>نمایش ایمیل</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                ایمیل شما در پروفایل عمومی نمایش داده شود
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="showPhone"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>نمایش شماره تلفن</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                شماره تلفن شما در پروفایل عمومی نمایش داده شود
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">تنظیمات داده</h4>

                    <FormField
                      control={privacyForm.control}
                      name="allowMarketing"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>ایمیل‌های بازاریابی</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                دریافت ایمیل‌های تبلیغاتی و اطلاعیه‌ها
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={privacyForm.control}
                      name="dataSharing"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>اشتراک‌گذاری داده</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                اشتراک‌گذاری داده‌های ناشناس برای بهبود سرویس
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
                    ) : (
                      <Save className="ml-2 h-4 w-4" />
                    )}
                    ذخیره تنظیمات
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>اشتراک فعلی</CardTitle>
                <CardDescription>جزئیات پلان و صورتحساب شما</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">پلان پایه</span>
                  <Badge>فعال</Badge>
                </div>
                <div className="text-2xl font-bold">رایگان</div>
                <p className="text-sm text-muted-foreground">
                  تا 50 آیتم منو و 100 بازدید ماهانه
                </p>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>آیتم‌های استفاده شده</span>
                    <span>12 / 50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>بازدید این ماه</span>
                    <span>45 / 100</span>
                  </div>
                </div>

                <Button className="w-full">ارتقاء به پلان حرفه‌ای</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تاریخچه پرداخت</CardTitle>
                <CardDescription>صورتحساب‌های قبلی شما</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">هیچ پرداختی وجود ندارد</h3>
                  <p className="text-sm text-muted-foreground">
                    شما هنوز هیچ پرداختی انجام نداده‌اید
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            منطقه خطر
          </CardTitle>
          <CardDescription>
            اقدامات غیرقابل بازگشت - با احتیاط عمل کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="ml-2 h-4 w-4" />
                حذف حساب کاربری
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                <AlertDialogDescription>
                  این عمل غیرقابل بازگشت است. تمام داده‌ها، منوها و اطلاعات شما
                  برای همیشه حذف خواهد شد.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  بله، حساب را حذف کن
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
