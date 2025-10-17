// app/restaurant/[slug]/page.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Instagram, Phone, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BranchesDrawer from "../_components/BranchesDrawer";
import ContactDialog from "../_components/ContactDialog";
import WorkingHoursDrawer from "../_components/WorkingHoursDrawer";

export default function ProductDetail() {
  const restaurant = {
    name: "رستوران رزگلد",
    tagline: "تجربه‌ای فراتر از یک وعده غذایی",
    coverImage: "/provider.webp",
    logoImage: "/restaurant-logo.png",
    features: ["غذاهای گیاهی", "سرویس تحویل", "محیط خانوادگی"],
    socialLinks: {
      instagram: "https://instagram.com/rosegold.restaurant",
      telegram: "https://t.me/rosegold_restaurant",
    },
    contact: "+98 51 1234 5678",
  };

  return (
    <div className="relative flex flex-col justify-between h-screen w-full overflow-hidden bg-background">
      {/* ======== بخش بالایی (کاور) ======== */}
      <div className="relative h-[50vh]">
        <Image
          src={restaurant.coverImage}
          alt={restaurant.name}
          fill
          priority
          className="object-cover"
        />

        {/* گرادینت برای خوانایی */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-[5]" />

        {/* کنترل‌های بالا */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-[10]">
          <div className="flex space-x-2">
            <ContactDialog />
            <button className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 active:scale-95 transition">
              <Share2 className="text-white w-5 h-5" />
            </button>
          </div>
          <Link href="/providers">
            <button className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 active:scale-95 transition">
              <ChevronLeft className="text-white w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* لوگوی رستوران */}
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 z-[20]">
          <div className="relative w-[95px] h-[95px] rounded-full border-4 border-white/80 shadow-xl bg-white/10 backdrop-blur-sm">
            <Image
              src={restaurant.logoImage}
              alt={restaurant.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ======== بخش پایین (پترن و اطلاعات) ======== */}
      <div className="relative bg-background flex flex-col justify-between px-4 pb-8 pt-12 space-y-6 overflow-hidden">
        {/* محتوا */}
        <div className="relative z-[5] fade-up text-center">
          <h1 className="text-xl font-bold text-foreground alexandria">
            {restaurant.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {restaurant.tagline}
          </p>
        </div>

        {/* ویژگی‌ها */}
        <div className="relative z-[5] fade-up flex justify-center flex-wrap gap-2">
          {restaurant.features.map((feature, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-xs"
            >
              {feature}
            </Badge>
          ))}
        </div>

        {/* دکمه مشاهده منو */}
        <Link href="/provider-detail/test/menu" className="relative z-[5]">
          <Button
            size="lg"
            className="fade-up block w-full text-base font-medium premium-button"
          >
            مشاهده منو
          </Button>
        </Link>

        {/* ساعت کاری و شعب */}
        <div className="relative z-[5] fade-up grid grid-cols-2 gap-3">
          <WorkingHoursDrawer />
          <BranchesDrawer />
        </div>

        {/* شبکه‌های اجتماعی */}
        <div className="relative z-[5] fade-up flex justify-center gap-3">
          <a href={restaurant.socialLinks.instagram}>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-muted-foreground/30 hover:bg-muted"
            >
              <Instagram className="w-4 h-4" />
            </Button>
          </a>
          <a href={restaurant.socialLinks.telegram}>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-muted-foreground/30 hover:bg-muted"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </a>
          <a href={`tel:${restaurant.contact}`}>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-muted-foreground/30 hover:bg-muted"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
