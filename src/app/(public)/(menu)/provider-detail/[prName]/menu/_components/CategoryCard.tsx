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
          <Image
            src={cat.image}
            alt={cat.nameFa}
            width={20}
            height={20}
            className="w-20 h-20 object-cover"
          />
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
