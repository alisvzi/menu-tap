"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { DashboardStats } from "@/components/customer-panel/dashboard-stats";
import { ErrorHandler } from "@/lib/errors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Store,
  Menu,
  Eye,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Edit,
  Calendar,
  AlertCircle,
  Building2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalCategories: number;
    totalMenuItems: number;
    totalViews: number;
    monthlyViews: number;
    monthlyOrders: number;
    revenue: number;
    averageRating: number;
  };
  recentActivity: Array<{
    id: string;
    type: "business_created" | "menu_updated" | "item_added" | "category_added";
    message: string;
    timestamp: string;
  }>;
}

export default function CustomerPanelPage() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalCategories: 0,
      totalMenuItems: 0,
      totalViews: 0,
      monthlyViews: 0,
      monthlyOrders: 0,
      revenue: 0,
      averageRating: 0,
    },
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.id) return;

      // Fetch user's categories
      const categoriesResponse = await fetch(
        `/api/categories?userId=${user.id}`,
      );
      const categoriesData = categoriesResponse.ok
        ? await categoriesResponse.json()
        : { categories: [] };

      // Fetch user's menu items
      const menuItemsResponse = await fetch(
        `/api/menu-items?userId=${user.id}`,
      );
      const menuItemsData = menuItemsResponse.ok
        ? await menuItemsResponse.json()
        : { menuItems: [] };

      const totalCategories = categoriesData.categories?.length || 0;
      const totalMenuItems = menuItemsData.menuItems?.length || 0;

      // For demo purposes, simulate some data
      const stats = {
        totalCategories,
        totalMenuItems,
        totalViews: Math.floor(Math.random() * 1000) + 100,
        monthlyViews: Math.floor(Math.random() * 300) + 50,
        monthlyOrders: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 50000000) + 10000000,
        averageRating: 4.2 + Math.random() * 0.8,
      };

      // Generate recent activity based on business completion
      const recentActivity = [];

      if (user.business?.isCompleted) {
        recentActivity.push({
          id: "1",
          type: "business_created" as const,
          message: "پروفیل کسب‌وکار تکمیل شد",
          timestamp: new Date().toISOString(),
        });
      }

      if (totalMenuItems > 0) {
        recentActivity.push({
          id: "2",
          type: "item_added" as const,
          message: `${totalMenuItems} آیتم منو اضافه شد`,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        });
      }

      setData({
        stats,
        recentActivity,
      });
    } catch (err) {
      const errorInfo = ErrorHandler.handle(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            سلام {user?.firstName}، خوش آمدید! 👋
          </h1>
          <p className="text-muted-foreground">
            {user?.business?.isCompleted
              ? "آمار و گزارش‌های کسب‌وکار شما"
              : "پروفیل کسب‌وکار خود را تکمیل کنید"}
          </p>
        </div>
        <Button asChild className="premium-button">
          <Link href="/customer-panel/businesses/new">
            <Plus className="w-4 h-4 mr-2" />
            کسب‌وکار جدید
          </Link>
        </Button>
      </div>

      {/* Business Profile Completion Alert */}
      {!user?.business?.isCompleted && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  پروفیل کسب‌وکار شما ناقص است
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  برای استفاده کامل از امکانات، اطلاعات کسب‌وکار خود را تکمیل
                  کنید.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/customer-panel/businesses/new">تکمیل پروفیل</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Dashboard Stats */}
      <DashboardStats
        stats={{
          ...data.stats,
          totalBusinesses: 1,
        }}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>عملیات سریع</CardTitle>
            <CardDescription>دسترسی سریع به عملکردهای پرکاربرد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              asChild
              className="w-full justify-start h-auto p-4"
              disabled={!user?.business?.isCompleted}
            >
              <Link href="/customer-panel/menu-items/new">
                <div className="flex items-center gap-3 text-right">
                  <Plus className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">آیتم جدید</div>
                    <div className="text-sm text-muted-foreground">
                      افزودن غذا یا نوشیدنی
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full justify-start h-auto p-4"
              disabled={!user?.business?.isCompleted}
            >
              <Link href="/customer-panel/categories/new">
                <div className="flex items-center gap-3 text-right">
                  <Menu className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">دسته‌بندی جدید</div>
                    <div className="text-sm text-muted-foreground">
                      ایجاد گروه جدید
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full justify-start h-auto p-4"
            >
              <Link href="/customer-panel/analytics">
                <div className="flex items-center gap-3 text-right">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">آمار و گزارش</div>
                    <div className="text-sm text-muted-foreground">
                      تحلیل عملکرد
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full justify-start h-auto p-4"
            >
              <Link href="/customer-panel/settings">
                <div className="flex items-center gap-3 text-right">
                  <Settings className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">تنظیمات</div>
                    <div className="text-sm text-muted-foreground">
                      شخصی‌سازی منو
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Business */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>کسب‌وکار من</CardTitle>
                <CardDescription>مدیریت رستوران یا کافه شما</CardDescription>
              </div>
              {user?.business?.isCompleted && (
                <Button variant="outline" asChild>
                  <Link href={`/menu/${user.business.slug}`} target="_blank">
                    نمایش منو
                    <Eye className="w-4 h-4 mr-2" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse flex items-center space-x-4 space-x-reverse p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <div className="h-6 w-12 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ) : !user?.business?.isCompleted ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  پروفیل کسب‌وکار ناقص است
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  برای شروع، اطلاعات کسب‌وکار خود را تکمیل کنید و منوی دیجیتال
                  زیبایی بسازید
                </p>
                <Button asChild className="premium-button">
                  <Link href="/customer-panel/businesses/new">
                    <Settings className="w-4 h-4 mr-2" />
                    تکمیل اطلاعات کسب‌وکار
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.business?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{user.business?.address?.city}</span>
                        <span>•</span>
                        <span>{user.business?.phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {user.business?.priceRange === "budget"
                            ? "اقتصادی"
                            : user.business?.priceRange === "expensive"
                              ? "گران"
                              : user.business?.priceRange === "fine-dining"
                                ? "لوکس"
                                : "متوسط"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        user.business?.isActive ? "default" : "secondary"
                      }
                    >
                      {user.business?.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/customer-panel/businesses/new">
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/menu/${user.business?.slug}`}
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            فعالیت‌های اخیر
          </CardTitle>
          <CardDescription>آخرین تغییرات در کسب‌وکارهای شما</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p>هیچ فعالیت اخیری یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.business?.name}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString("fa-IR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
