"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Plus,
  Search,
  Eye,
  Settings,
} from "lucide-react";

interface ProviderSummary {
  _id: string;
  name: string;
  slug: string;
  providerType: string;
  isActive: boolean;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/providers?owner=me&limit=100");
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data.businesses || []);
        } else {
          // Fallback demo data if API is not ready
          setBusinesses([
            {
              _id: "b1",
              name: "کافه شمیم",
              slug: "shamim-cafe",
              providerType: "cafe",
              isActive: true,
            },
            {
              _id: "b2",
              name: "رستوران بهار",
              slug: "bahar-restaurant",
              providerType: "restaurant",
              isActive: false,
            },
            {
              _id: "b3",
              name: "فست‌فود تاپ",
              slug: "top-fastfood",
              providerType: "fast-food",
              isActive: true,
            },
          ]);
        }
      } catch (e) {
        setError("دریافت فهرست کسب‌وکارها با خطا مواجه شد");
        setBusinesses([
          {
            _id: "b1",
            name: "کافه شمیم",
            slug: "shamim-cafe",
            providerType: "cafe",
            isActive: true,
          },
          {
            _id: "b2",
            name: "رستوران بهار",
            slug: "bahar-restaurant",
            providerType: "restaurant",
            isActive: false,
          },
          {
            _id: "b3",
            name: "فست‌فود تاپ",
            slug: "top-fastfood",
            providerType: "fast-food",
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && b.isActive) ||
        (statusFilter === "inactive" && !b.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">کسب‌وکارهای من</h1>
            <p className="text-sm text-muted-foreground">
              مدیریت و مشاهده فهرست کسب‌وکارها
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/customer-panel/businesses/new">
            <Plus className="ml-2 h-4 w-4" />
            کسب‌وکار جدید
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام یا اسلاگ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="inactive">غیرفعال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredBusinesses.length} نتیجه از {businesses.length} کسب‌وکار
        </div>
      </div>

      <Separator />

      {loading ? (
        <div className="text-sm text-muted-foreground">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              هیچ کسب‌وکاری مطابق با جستجو یا فیلتر فعلی یافت نشد.
            </p>
            <Button asChild variant="outline">
              <Link href="/customer-panel/businesses/new">
                <Plus className="ml-2 h-4 w-4" /> افزودن کسب‌وکار جدید
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBusinesses.map((b) => (
            <Card key={b._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="ml-2 size-4 text-muted-foreground" />
                    <CardTitle className="text-base">{b.name}</CardTitle>
                  </div>
                  <Badge variant={b.isActive ? "default" : "secondary"}>
                    {b.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-xs">
                  {b.providerType} | {b.slug}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-2 justify-start">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/customer-panel/businesses/${b.slug}`}>
                    <Eye className="ml-2 size-4" /> مشاهده
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/customer-panel/businesses/${b.slug}`}>
                    <Settings className="ml-2 size-4" /> مدیریت
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}