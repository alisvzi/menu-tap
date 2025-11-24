import { SkeletonData } from "@/configs/mock-data";
import SetPortal from "@/utility/set-portal";
import { Suspense } from "react";
import CategoryContent from "./_components/CategoryContent";
import CategorySelectSlider from "./_components/CategorySelectSlider";
import MenuItem from "./_components/MenuItem";
import MenuSubtitle from "./_components/MenuSubtitle";
import ScrollReset from "./_components/ScrollReset";

import CategoryModel from "@/lib/models/Category";
import ProviderModel from "@/lib/models/Provider";
import { Provider } from "@/types";
import type { Category } from "@/types/category";
import { toPlainObject } from "@/utility/utils";

interface MenuData {
  provider: Provider;
  categories: Category[];
}

interface CategoryProps {
  params: Promise<{
    prName: string;
  }>;
  searchParams: Promise<{ category?: string }>;
}

async function getMenuData(slug: string): Promise<MenuData | null> {
  const provider = (await ProviderModel.findOne(
    { slug },
    "_id name nameEn logo"
  ).lean()) as unknown as Provider | null;

  if (!provider) return null;

  const categories = (await CategoryModel.find(
    {
      provider: provider._id,
    },
    "name nameEn slug"
  ).lean()) as unknown as Category[];

  return { provider, categories };
}

export default async function Category({
  searchParams,
  params,
}: CategoryProps) {
  const { prName } = await params;
  const { category } = await searchParams;

  const menuData = await getMenuData(prName);
  console.log(menuData?.categories);
  // const catSlug = searchParams.get("category");

  // Server-side data fetching
  const categories = toPlainObject(menuData?.categories || []) as {
    name: string;
    nameEn?: string;
    slug: string;
  }[];
  const initialCategory =
    categories.find((c) => c.slug === category)?.slug || categories[0]?.slug;

  return (
    <div className="">
      <ScrollReset />
      <SetPortal idName="menu-portal">
        <CategorySelectSlider
          categories={categories}
          initialCategory={initialCategory}
        />
      </SetPortal>

      {/* Server-rendered content */}
      <Suspense
        fallback={
          <div className="pt-[170px] min-h-[100vh] px-3 skeleton">
            <div className="flex flex-col gap-3 pb-10">
              {["زیردسته ۱", "زیردسته ۲", "زیردسته ۳"].map((t, gi) => (
                <div key={gi}>
                  <MenuSubtitle title={t} />
                  <div className="flex flex-col gap-3 mt-3">
                    {SkeletonData.menuItems.slice(0, 4).map((mi, ii) => (
                      <MenuItem
                        key={mi._id + ii}
                        image={mi.images[0]}
                        nameFa={mi.name_fa}
                        nameEn={mi.name_en}
                        ingredients={mi.ingredients}
                        price={mi.price}
                        currency="تومان"
                        isFeatured={mi.isSpecialOffer}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <CategoryContent category={initialCategory} prName={prName} />
      </Suspense>
    </div>
  );
}
