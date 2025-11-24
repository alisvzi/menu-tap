"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ShoppingCart, 
  Star, 
  Clock,
  DollarSign,
  Users,
  Calendar,
  Download
} from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: Array<{
    name: string;
    orders: number;
    revenue: number;
    views: number;
  }>;
  categoryStats: Array<{
    name: string;
    items: number;
    orders: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const analyticsData = useMemo<AnalyticsData>(() => ({
      totalViews: 1250,
      totalOrders: 89,
      totalRevenue: 4500000,
      averageOrderValue: 50562,
      popularItems: [
        { name: "پیتزا مارگاریتا", orders: 25, revenue: 1250000, views: 150 },
        { name: "برگر کلاسیک", orders: 18, revenue: 900000, views: 120 },
        { name: "پاستا آلفردو", orders: 15, revenue: 750000, views: 95 },
      ],
      categoryStats: [
        { name: "پیتزا", items: 8, orders: 45, revenue: 2250000 },
        { name: "برگر", items: 6, orders: 28, revenue: 1400000 },
        { name: "پاستا", items: 5, orders: 16, revenue: 800000 },
      ],
      recentActivity: [
        { type: "order", description: "سفارش جدید برای پیتزا مارگاریتا", timestamp: "2 دقیقه پیش" },
        { type: "view", description: "مشاهده منوی برگر", timestamp: "5 دقیقه پیش" },
        { type: "order", description: "سفارش جدید برای پاستا آلفردو", timestamp: "12 دقیقه پیش" },
      ]
  }), [timeRange]);

  const loading = false;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "1d": return "24 ساعت گذشته";
      case "7d": return "7 روز گذشته";
      case "30d": return "30 روز گذشته";
      case "90d": return "3 ماه گذشته";
      default: return "7 روز گذشته";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری آمار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">آمار و گزارشات</h1>
          <p className="text-muted-foreground">
            آمار عملکرد منو و فروش خود را مشاهده کنید
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 ساعت گذشته</SelectItem>
              <SelectItem value="7d">7 روز گذشته</SelectItem>
              <SelectItem value="30d">30 روز گذشته</SelectItem>
              <SelectItem value="90d">3 ماه گذشته</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            دانلود گزارش
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        آمار مربوط به {getTimeRangeLabel(timeRange)}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل بازدیدها</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalViews.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="ml-1 h-3 w-3" />
                +12.5%
              </span>
              نسبت به دوره قبل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل سفارشات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalOrders.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="ml-1 h-3 w-3" />
                +8.2%
              </span>
              نسبت به دوره قبل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="ml-1 h-3 w-3" />
                +15.3%
              </span>
              نسبت به دوره قبل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین ارزش سفارش</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData?.averageOrderValue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="ml-1 h-3 w-3" />
                -2.1%
              </span>
              نسبت به دوره قبل
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              محبوب‌ترین آیتم‌ها
            </CardTitle>
            <CardDescription>
              آیتم‌هایی که بیشترین سفارش را داشته‌اند
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData?.popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.orders} سفارش</span>
                      <span>{item.views} بازدید</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{formatCurrency(item.revenue)}</p>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              آمار دسته‌بندی‌ها
            </CardTitle>
            <CardDescription>
              عملکرد هر دسته‌بندی از منو
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData?.categoryStats.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{category.items} آیتم</span>
                    <span>{category.orders} سفارش</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(category.orders / (analyticsData?.totalOrders || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            فعالیت‌های اخیر
          </CardTitle>
          <CardDescription>
            آخرین فعالیت‌های مربوط به منوی شما
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Badge variant={activity.type === 'order' ? 'default' : 'secondary'}>
                  {activity.type === 'order' ? 'سفارش' : 'بازدید'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>بینش‌های عملکرد</CardTitle>
          <CardDescription>
            توصیه‌هایی برای بهبود عملکرد منوی شما
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">عملکرد خوب</h4>
                <p className="text-sm text-green-700">
                  آیتم «پیتزا مارگاریتا» بیشترین فروش را داشته است. در نظر بگیرید آیتم‌های مشابه اضافه کنید.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">نیاز به بهبود</h4>
                <p className="text-sm text-yellow-700">
                  دسته‌بندی «نوشیدنی» کمترین فروش را داشته است. بررسی قیمت‌ها و تنوع آیتم‌ها را در نظر بگیرید.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">فرصت رشد</h4>
                <p className="text-sm text-blue-700">
                  نرخ تبدیل بازدید به سفارش 7.1% است. با بهبود توضیحات و تصاویر آیتم‌ها می‌توانید این نرخ را افزایش دهید.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}