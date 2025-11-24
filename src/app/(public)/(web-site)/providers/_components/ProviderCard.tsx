import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { fallbackNameHelper } from "@/utility/utils";
import Image from "next/image";
import Link from "next/link";

interface Provider {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  const rawName = provider?.nameEn || "BM";
  const fallbackName = fallbackNameHelper(rawName);

  return (
    <Card className="w-full overflow-hidden shadow-xl hover:shadow-xl transition-shadow group py-0 border-2">
      <Link
        href={`/provider-detail/${provider.slug}`}
        className="relative h-64"
      >
        <Image
          src={provider.coverImage || "/provider.webp"}
          alt={provider.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/90 via-black/40">
          <CardContent className="h-full flex flex-col justify-end p-4">
            {/* Header Section */}
            <div className="flex items-center gap-3 backdrop-blur-sm bg-white/50 dark:bg-black/50 rounded-lg p-3 w-fit transition-all hover:bg-white/70 dark:hover:bg-black/70">
              <Avatar className="border-2 border-black/10 dark:border-white/20">
                <AvatarImage src={provider.logo} />
                <AvatarFallback className="bg-black/5 dark:bg-white/10">
                  {fallbackName}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 drop-shadow-md dark:text-white/90">
                <span>{provider.name}</span>
                <br />
                <span className="text-base">{provider.nameEn}</span>
              </h2>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};

export default ProviderCard;
