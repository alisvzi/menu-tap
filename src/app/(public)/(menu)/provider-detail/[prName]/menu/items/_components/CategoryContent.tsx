import CategoryModel from "@/lib/models/Category";
import MenuItemModel from "@/lib/models/MenuItem";
import ProviderModel from "@/lib/models/Provider";
import FadeInItem from "@/providers/FadeInItem";
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
}

interface MenuGroup {
  title: string;
  items: MenuItemType[];
}

interface ItemsData {
  items: {
    name: string;
    nameEn: string;
    slug: string;
    images: string[];
    ingredients: any[];
    price: number;
    originalPrice: number;
    isSpecial: boolean;
    subcategory: string;
  }[];
  subcategories: { _id: string; name_fa: string; name_en?: string }[];
}

async function getMenuItems(
  slug: string,
  category: string
): Promise<ItemsData | null> {
  const provider = (await ProviderModel.findOne({ slug }, "_id").lean()) as any;

  if (!provider) return null;

  const categoryDoc = (await CategoryModel.findOne(
    {
      provider: provider._id,
      slug: category,
    },
    "_id subcategories"
  ).lean()) as any;

  if (!categoryDoc) return null;

  const items = (await MenuItemModel.find(
    {
      category: categoryDoc._id,
      isActive: true,
      isAvailable: true,
    },
    "name nameEn slug images ingredients price originalPrice isSpecial subcategory"
  ).lean()) as any[];

  return { items, subcategories: categoryDoc.subcategories || [] };
}

function transformItemsToMockFormat(
  items: ItemsData["items"],
  dict: Record<string, { fa: string; en?: string }>
): MenuGroup[] {
  if (!items || !Array.isArray(items)) return [];

  const groupsMap: Record<string, MenuItemType[]> = {};

  items.forEach((item) => {
    const titleFa =
      item.subcategory && dict[item.subcategory]?.fa
        ? dict[item.subcategory].fa
        : "";
    const titleEn =
      item.subcategory && dict[item.subcategory]?.en
        ? dict[item.subcategory].en
        : "";
    const categoryTitle = titleEn ? `${titleFa} (${titleEn})` : titleFa;

    if (!groupsMap[categoryTitle]) {
      groupsMap[categoryTitle] = [];
    }

    groupsMap[categoryTitle].push({
      image: item?.images?.[0],
      nameFa: item.name || "",
      nameEn: item.nameEn || "",
      ingredients: (item.ingredients || []).map((ing: any) =>
        typeof ing === "string" ? ing : ing?.name || ""
      ),
      price: item.price?.toString() || "0",
      currency: "تومان",
      isFeatured: item.isSpecial || false,
    });
  });

  return Object.entries(groupsMap).map(([title, items]) => ({
    title,
    items,
  }));
}

interface CategoryContentProps {
  category: string;
  prName: string;
}

const CategoryContent = async ({ category, prName }: CategoryContentProps) => {
  const data = await getMenuItems(prName, category);

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="pt-[170px] min-h-[100vh] px-3">
        <p className="text-center text-gray-500">
          منویی برای این دسته‌بندی یافت نشد.
        </p>
      </div>
    );
  }

  const dict = Object.fromEntries(
    (data.subcategories || []).map((sc: any) => [
      String(sc._id || ""),
      { fa: sc.name_fa, en: sc.name_en },
    ])
  );
  const menuGroups = transformItemsToMockFormat(data.items, dict);

  console.log(menuGroups, "menuGroups");
  console.log(data.items, "data.items");

  return (
    <div key={category} className="pt-[170px] min-h-[100vh] px-3">
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
