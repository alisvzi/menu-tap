"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Menu,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Star
} from "lucide-react";

type ChangeType = 'positive' | 'negative' | 'neutral';
type StatItem = {
  title: string;
  value: number | string;
  icon: any;
  change: string;
  changeType: ChangeType;
  description: string;
};

interface DashboardStatsProps {
  stats: {
    totalBusinesses: number;
    totalMenuItems: number;
    totalCategories: number;
    totalViews: number;
    monthlyViews: number;
    monthlyOrders: number;
    revenue: number;
    averageRating: number;
  };
  loading?: boolean;
}

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  const statItems: StatItem[] = [
    {
      title: "کل کسب‌وکارها",
      value: stats.totalBusinesses,
      icon: Store,
      change: "+0%",
      changeType: "neutral" as const,
      description: "کسب‌وکارهای فعال شما"
    },
    {
      title: "آیتم‌های منو",
      value: stats.totalMenuItems,
      icon: Menu,
      change: "+12%",
      changeType: "positive" as const,
      description: "در همه منوها"
    },
    {
      title: "دسته‌بندی‌ها",
      value: stats.totalCategories,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
      description: "دسته‌بندی‌های فعال"
    },
    {
      title: "بازدیدهای این ماه",
      value: stats.monthlyViews,
      icon: Eye,
      change: "+18%",
      changeType: "positive" as const,
      description: "نسبت به ماه گذشته"
    },
    {
      title: "سفارشات این ماه",
      value: stats.monthlyOrders,
      icon: Users,
      change: "+8%",
      changeType: "positive" as const,
      description: "سفارشات موفق"
    },
    {
      title: "درآمد این ماه",
      value: `${stats.revenue.toLocaleString()} تومان`,
      icon: DollarSign,
      change: "+15%",
      changeType: "positive" as const,
      description: "درآمد خالص"
    },
    {
      title: "میانگین امتیاز",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      change: "+0.2",
      changeType: "positive" as const,
      description: "امتیاز مشتریان"
    },
    {
      title: "کل بازدیدها",
      value: stats.totalViews,
      icon: Calendar,
      change: "+25%",
      changeType: "positive" as const,
      description: "از ابتدای راه‌اندازی"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  item.changeType === 'positive' ? 'default' :
                  item.changeType === 'negative' ? 'destructive' :
                  'secondary'
                }
                className="text-xs"
              >
                {item.change}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
