"use client";

import FadeInItem from "@/providers/FadeInItem";
import { useMenuCategory } from "@/providers/menu-category-provider";
import MenuItem from "./MenuItem";
import MenuSubtitle from "./MenuSubtitle";

interface MenuItemType {
  image?: string;
  nameFa: string;
  nameEn: string;
  ingredients: string[];
  price: string;
  currency: string;
  isFeatured?: boolean;
  images?: string[];
  originalPrice?: number;
  isSpecialOffer?: boolean;
  slug?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItemType[];
}

type MenuGroupsByCategory = Record<string, MenuGroup[]>;

interface CategoryContentProps {
  menuGroupsByCategory: MenuGroupsByCategory;
}

const CategoryContent = ({ menuGroupsByCategory }: CategoryContentProps) => {
  const { selected } = useMenuCategory();

  const menuGroups = menuGroupsByCategory[selected] || [];

  if (!menuGroups.length) {
    return (
      <div className="pt-[170px] min-h-[100vh] px-3">
        <p className="text-center text-gray-500">
          منویی برای این دسته‌بندی یافت نشد.
        </p>
      </div>
    );
  }

  return (
    <div key={selected} className="pt-[170px] min-h-[100vh] px-3">
      <div className="flex flex-col gap-3 pb-10">
        {menuGroups.map((group, groupIndex) => (
          <div key={group.title}>
            <FadeInItem delay={groupIndex * 100}>
              <MenuSubtitle title={group.title} />
            </FadeInItem>
            <div className="flex flex-col gap-3 mt-3">
              {group.items.map((item, itemIndex) => (
                <FadeInItem
                  key={item.nameEn + itemIndex}
                  delay={(groupIndex + itemIndex) * 100}
                >
                  <MenuItem {...item} />
                </FadeInItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryContent;
