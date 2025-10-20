"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  GlassWater,
  Store,
  Utensils,
  MapPin,
  Star,
  Phone,
  Eye,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "@/types/business";
import { ErrorHandler } from "@/lib/errors";

const businessTypes = [
  {
    icon: <Coffee className="w-8 h-8 text-rose-gold" />,
    name: "کافه‌ها",
    description: "منوی دیجیتال تخصصی برای کافه‌ها",
    type: "cafe",
  },
  {
    icon: <Utensils className="w-8 h-8 text-rose-gold" />,
    name: "رستوران‌ها",
    description: "سیستم کامل منوی دیجیتال رستوران",
    type: "restaurant",
  },
  {
    icon: <GlassWater className="w-8 h-8 text-rose-gold" />,
    name: "آبمیوه‌فروشی‌ها",
    description: "منوی دیجیتال برای آبمیوه‌فروشی‌ها",
    type: "other",
  },
  {
    icon: <Store className="w-8 h-8 text-rose-gold" />,
    name: "فست‌فودها",
    description: "منوی دیجیتال سریع برای فست‌فودها",
    type: "fast-food",
  },
];

const BusinessesSection = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<BusinessCard[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, []);

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/businesses?isActive=true&isVerified=true&limit=8",
      );

      if (response.ok) {
        const data = await response.json();
        setFeaturedBusinesses(data.businesses || []);
      } else {
        // If API fails, set empty array (no error shown to user)
        setFeaturedBusinesses([]);
      }
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setFeaturedBusinesses([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="businesses" className="py-16 px-4 bg-muted/20">
      <div className="container space-y-16">
        {/* Business Types */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 alexandria">
              مناسب برای تمام کسب‌وکارها
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              منوتپ برای انواع کسب‌وکارهای غذایی طراحی شده است
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {businessTypes.map((business, index) => (
              <Card
                key={index}
                className="compact-card border-border hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="text-center pb-3">
                  <div className="mb-3 flex justify-center">
                    {business.icon}
                  </div>
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {business.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Businesses */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 alexandria">
              کسب‌وکارهای برتر
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نمونه‌هایی از کسب‌وکارهایی که از منوتپ استفاده می‌کنند
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredBusinesses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredBusinesses.slice(0, 8).map((business) => (
                  <Card
                    key={business._id}
                    className="compact-card border-border hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                            {business.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{business.address.city}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              business.isActive ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {business.isActive ? "فعال" : "غیرفعال"}
                          </Badge>
                          {business.isVerified && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-600"
                            >
                              تایید شده
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        {business.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{business.rating.toFixed(1)}</span>
                            {business.reviewCount &&
                              business.reviewCount > 0 && (
                                <span>({business.reviewCount})</span>
                              )}
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {business.priceRange === "budget"
                            ? "اقتصادی"
                            : business.priceRange === "moderate"
                              ? "متوسط"
                              : business.priceRange === "expensive"
                                ? "گران"
                                : "لوکس"}
                        </Badge>
                      </div>

                      {business.cuisine && business.cuisine.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {business.cuisine
                            .slice(0, 2)
                            .map((cuisine, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {cuisine}
                              </Badge>
                            ))}
                          {business.cuisine.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{business.cuisine.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <Link href={`/provider-detail/${business.slug}`}>
                          <Eye className="w-3 h-3 mr-2" />
                          مشاهده منو
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/providers">مشاهده همه کسب‌وکارها</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                هیچ کسب‌وکاری یافت نشد
              </h3>
              <p className="text-muted-foreground mb-6">
                اولین کسب‌وکار باشید که از منوتپ استفاده می‌کند
              </p>
              <Button asChild className="premium-button">
                <Link href="/auth/register">ثبت‌نام رایگان</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessesSection;
