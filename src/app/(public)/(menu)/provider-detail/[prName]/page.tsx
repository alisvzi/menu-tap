// app/restaurant/[slug]/page.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  Clock,
  Heart,
  Instagram,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetail() {
  const restaurant = {
    name: "رستوران رزگلد",
    tagline: "تجربه‌ای فراتر از یک وعده غذایی",
    coverImage: "/provider.webp",
    logoImage: "/restaurant-logo.png",
    rating: 4.9,
    reviewCount: 342,
    cuisine: "آشپزی مدرن ایرانی",
    priceRange: "$$$$",
    workingHours: {
      open: "12:00",
      close: "23:00",
    },
    address: "مشهد، خیابان سجاد، نبش حامد شمالی",
    contact: "+98 51 1234 5678",
    features: ["غذاهای گیاهی", "سرویس تحویل", "محیط خانوادگی"],
    socialLinks: {
      instagram: "https://instagram.com/rosegold.restaurant",
      telegram: "https://t.me/rosegold_restaurant",
    },
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <div className="bg-background relative h-[50vh] w-full">
        <Image
          src={restaurant.coverImage}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-10 inset-0 bg-gradient-to-t from-5% from-black to-black/0"></div>

        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="flex space-x-2">
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Heart className="text-white w-5 h-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Share2 className="text-white w-5 h-5" />
            </button>
          </div>
          <Link href="/providers">
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <ChevronLeft className="text-white w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 z-20">
          <Image
            src={restaurant.logoImage}
            alt={restaurant.name}
            width={100}
            height={100}
            className="rounded-full border-4 border-border shadow-lg"
          />
        </div>
      </div>

      <div className="bg-background h-[50vh] flex flex-col justify-between px-4 pt-16 pb-8 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground alexandria">
            {restaurant.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-x-1">
            {restaurant.tagline}
          </p>
        </div>
        {/* ویژگی‌ها */}
        <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
          {restaurant.features.map((feature, index) => (
            <Badge variant="secondary" key={index}>
              {feature}
            </Badge>
          ))}
        </div>
        <Link href="/provider-detail/test/menu">
          <Button size={"lg"} className="block w-full premium-button">
            مشاهده منو
          </Button>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex-row justify-between items-center p-3 gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <p className="text-xs">
              {restaurant.workingHours.open} -{restaurant.workingHours.close}
            </p>
            <ChevronLeft className="text-muted-foreground" />
          </Card>
          <Card className="flex-row justify-between items-center p-3 gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-xs">
              {/* {restaurant.address} */}
              مشاهده آدرس
            </p>
            <ChevronLeft className="text-muted-foreground" />
          </Card>
        </div>

        {/* دکمه‌های عملیاتی */}

        <div className="flex justify-center space-x-3">
          <a href={restaurant.socialLinks.instagram}>
            <Button size={"icon"} variant="outline">
              <Instagram className="w-4 h-4" />
            </Button>
          </a>
          <a href={restaurant.socialLinks.telegram}>
            <Button size={"icon"} variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </a>
          <a href={restaurant.contact}>
            <Button size={"icon"} variant="outline">
              <Phone className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
