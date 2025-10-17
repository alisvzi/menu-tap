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

const CategoryCard = ({ cat }) => {
  return (
    <Item asChild role="listitem" className="shadow-md">
      <Link href={`menu/items?category=${cat.nameEn}`}>
        <ItemMedia variant="image">
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
            <Image
              src={cat.image}
              alt={cat.nameFa}
              fill
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{cat.nameFa}</ItemTitle>
          <ItemDescription>{cat.nameEn}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronLeftIcon className="size-6" />
        </ItemActions>
      </Link>
    </Item>
  );
};

export default CategoryCard;
