import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/db/connection";
import Provider from "@/lib/models/Provider";
import { ChevronLeft, Instagram, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BranchesDrawer from "../_components/BranchesDrawer";
import ContactDialog from "../_components/ContactDialog";
import ShareModal from "../_components/ShareModal";
import WorkingHoursDrawer from "../_components/WorkingHoursDrawer";
import { ProviderI } from "../types/Provider";

interface ProviderDetailPageProps {
  params: Promise<{ prName: string }>;
}

async function fetchProvider(slug: string) {
  await connectDB();
  const active = (await Provider.findOne({
    slug,
    isActive: true,
  }).lean()) as ProviderI | null;
  if (active) return active;
  return (await Provider.findOne({ slug }).lean()) as ProviderI | null;
}

export default async function ProviderDetailPage({
  params,
}: ProviderDetailPageProps) {
  const { prName } = await params;
  const provider = await fetchProvider(prName);

  if (!provider) {
    notFound();
  }

  const currentUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/provider-detail/${provider.slug}`;

  return (
    <div className="flex flex-col justify-between h-screen w-full bg-background overflow-hidden">
      {/* === Cover Image Section === */}
      <div className="relative h-[55vh]">
        <Image
          src={provider.coverImage || "/provider.webp"}
          alt={provider.name}
          fill
          priority
          className="object-cover"
        />

        {/* Dark Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="flex gap-2">
            <ContactDialog
              contact={{
                email: provider.email,
                phone: provider.phone,
                reservationPhone: provider.reservationPhone,
              }}
            />
            <ShareModal businessName={provider.name} url={currentUrl} />
          </div>
          <Link href="/providers">
            <button className="bg-white/25 backdrop-blur-sm p-2.5 rounded-full border border-white/30 active:scale-95 transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
        </div>

        {/* Title & Description on Cover */}
        <div className="absolute bottom-20 left-5 right-5 z-10 text-white">
          <h1 className="text-2xl md:text-3xl font-bold alexandria drop-shadow-2xl leading-tight">
            {provider.name}
          </h1>
          {provider.nameEn && (
            <p className="text-sm text-white/90 mt-1 drop-shadow-md">
              {provider.nameEn}
            </p>
          )}
          {(provider.tagline || provider.description) && (
            <p className="text-sm text-white/85 mt-2 line-clamp-2 drop-shadow-md leading-relaxed">
              {provider.tagline || provider.description}
            </p>
          )}
        </div>

        {/* Logo - Floating above content */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl bg-white/20 backdrop-blur-md overflow-hidden">
            <Image
              src={provider.logo || "/restaurant-logo.png"}
              alt={provider.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* === Bottom Content Section === */}
      <div className="bg-background px-5 pt-16 pb-6 overflow-y-auto">
        <div className="space-y-5">
          {/* Features */}
          {provider.features.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2">
              {provider.features.slice(0, 2).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium"
                >
                  {feature}
                </Badge>
              ))}
              {provider.features.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-primary text-xs"
                >
                  +{provider.features.length - 2}
                </Button>
              )}
            </div>
          )}

          {/* Menu Button */}
          <Link href={`/provider-detail/${provider.slug}/menu`}>
            <Button
              size="lg"
              className="mb-4 w-full h-12 text-base font-semibold premium-button shadow-lg"
            >
              مشاهده منو
            </Button>
          </Link>

          {/* Working Hours */}
          <div>
            <WorkingHoursDrawer workingHours={provider.workingHours} />
          </div>

          {/* Social & Contact Icons */}
          <div className="flex justify-center items-center gap-3 pt-2">
            {provider.instagram && (
              <a
                href={provider.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="w-11 h-11 rounded-full border-muted-foreground/40 hover:bg-muted/50 transition"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              </a>
            )}
            {provider.telegram && (
              <a
                href={provider.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="w-11 h-11 rounded-full border-muted-foreground/40 hover:bg-muted/50"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </a>
            )}
            <a href={`tel:${provider.phone}`}>
              <Button
                size="icon"
                variant="outline"
                className="w-11 h-11 rounded-full border-muted-foreground/40 hover:bg-muted/50"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </a>

            <BranchesDrawer
              mainAddress={provider.address}
              branches={provider.branches?.map((b) => ({
                name: b.name ?? b.title ?? "شعبه اصلی",
                address: b.address,
                phone: b.phone,
                coordinates: b.coordinates,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
