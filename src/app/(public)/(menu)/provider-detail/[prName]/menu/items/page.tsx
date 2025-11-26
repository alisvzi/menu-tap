import { MenuCategoryProvider } from "@/providers/menu-category-provider";
import SetPortal from "@/utility/set-portal";
import CategoryContent from "./_components/CategoryContent";
import CategorySelectSlider from "./_components/CategorySelectSlider";
import ScrollReset from "./_components/ScrollReset";

import CategoryModel from "@/lib/models/Category";
import MenuItemModel from "@/lib/models/MenuItem";
import ProviderModel from "@/lib/models/Provider";
import type { Category } from "@/types/category";
import { toPlainObject } from "@/utility/utils";

type MenuItemDoc = {
  name: string;
  nameEn?: string;
  slug: string;
  images?: string[];
  ingredients?: any[];
  price: number;
  originalPrice?: number;
  isSpecial?: boolean;
  subcategory?: string;
};

type MenuGroup = {
  title: string;
  items: {
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
  }[];
};

type MenuGroupsByCategory = Record<string, MenuGroup[]>;

interface CategoryProps {
  params: Promise<{ prName: string }>;
  searchParams?: Promise<{ category?: string }>;
}

async function getMenuData(slug: string): Promise<{
  categories: Category[];
  menuGroupsByCategory: MenuGroupsByCategory;
} | null> {
  const provider = await ProviderModel.findOne({ slug }, "_id").lean();
  if (!provider) return null;

  const categories = (await CategoryModel.find(
    { provider: (provider as any)._id },
    "_id name nameEn slug subcategories"
  )
    .sort({ order: 1 })
    .lean()) as unknown as (Category & {
    _id: string;
    subcategories?: { _id: string; name_fa: string; name_en?: string }[];
  })[];

  const menuGroupsByCategory: MenuGroupsByCategory = {};

  const categoryIds = categories.map((c: any) => c._id);

  const itemsByCategory = await Promise.all(
    categoryIds.map(async (catId) => {
      const items = await MenuItemModel.find(
        { category: catId, isActive: true, isAvailable: true },
        "name nameEn slug images ingredients price originalPrice isSpecial subcategory"
      ).lean();
      return { catId, items: items as unknown as MenuItemDoc[] };
    })
  );

  itemsByCategory.forEach(({ catId, items }) => {
    const cat = categories.find((c: any) => String(c._id) === String(catId));
    if (!cat) return;
    const dict = Object.fromEntries(
      (cat.subcategories || []).map((sc: any) => [
        String(sc._id || ""),
        { fa: sc.name_fa, en: sc.name_en },
      ])
    );

    const groupsMap: Record<string, MenuGroup["items"]> = {};
    items.forEach((item) => {
      const fa =
        item.subcategory && dict[item.subcategory]?.fa
          ? dict[item.subcategory].fa
          : "";
      const en =
        item.subcategory && dict[item.subcategory]?.en
          ? dict[item.subcategory].en
          : "";
      const title = en ? `${fa} (${en})` : fa;
      if (!groupsMap[title]) groupsMap[title] = [];
      groupsMap[title].push({
        image: item.images?.[0],
        nameFa: item.name || "",
        nameEn: item.nameEn || "",
        ingredients: (item.ingredients || []).map((ing: any) =>
          typeof ing === "string" ? ing : ing?.name || ""
        ),
        price: String(item.price ?? 0),
        currency: "تومان",
        isFeatured: !!item.isSpecial,
        images: item.images || [],
        originalPrice: item.originalPrice,
        isSpecialOffer: !!item.isSpecial,
        slug: item.slug,
      });
    });

    const groups: MenuGroup[] = Object.entries(groupsMap).map(
      ([title, items]) => ({ title, items })
    );
    menuGroupsByCategory[(cat as any).slug] = groups;
  });

  return {
    categories: categories as unknown as Category[],
    menuGroupsByCategory,
  };
}

export const dynamic = "force-dynamic";

export default async function Category({
  searchParams,
  params,
}: CategoryProps) {
  const { prName } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const currentCategory = sp?.category;

  const menuData = await getMenuData(prName);
  const categories = toPlainObject(menuData?.categories || []) as {
    name: string;
    nameEn?: string;
    slug: string;
  }[];
  const initialCategory =
    categories.find((c) => c.slug === currentCategory)?.slug ||
    categories[0]?.slug ||
    "";

  return (
    <MenuCategoryProvider initialCategory={initialCategory}>
      <div className="">
        <ScrollReset />
        <SetPortal idName="menu-portal">
          <CategorySelectSlider
            categories={categories}
            initialCategory={initialCategory}
          />
        </SetPortal>

        <CategoryContent
          menuGroupsByCategory={menuData?.menuGroupsByCategory || {}}
        />
      </div>
    </MenuCategoryProvider>
  );
}
