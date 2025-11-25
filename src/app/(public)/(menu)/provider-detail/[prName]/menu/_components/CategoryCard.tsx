import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: string;
    slug: string;
    nameFa: string;
    nameEn: string;
    image: string;
  };
  providerSlug: string;
}

export default function CategoryCard({
  category,
  providerSlug,
}: CategoryCardProps) {
  return (
    // <Link href={`/provider-detail/${providerSlug}/menu/items/${category.slug}`}>
    //   <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
    //     <div className="aspect-square relative">
    //       <Image
    //         src={category.image}
    //         alt={category.nameFa}
    //         fill
    //         className="object-cover"
    //       />
    //     </div>
    //     <div className="p-3">
    //       <h3 className="font-semibold text-sm mb-1">{category.nameFa}</h3>
    //       {category.nameEn && (
    //         <p className="text-xs text-muted-foreground">{category.nameEn}</p>
    //       )}
    //     </div>
    //   </div>
    // </Link>

    <Item asChild role="listitem" className="shadow-md">
      <Link href={`menu/items?category=${category.slug}`}>
        <ItemMedia variant="image">
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
            <Image
              src={category.image}
              alt={category.nameFa}
              fill
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{category.nameFa}</ItemTitle>
          <ItemDescription>{category.nameEn}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronLeftIcon className="size-6" />
        </ItemActions>
      </Link>
    </Item>
  );
}
