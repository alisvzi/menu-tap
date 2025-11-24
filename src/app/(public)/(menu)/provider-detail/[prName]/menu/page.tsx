import CategoryModel from "@/lib/models/Category";
import ProviderModel from "@/lib/models/Provider";
import { Category, Provider } from "@/types/category";
import Image from "next/image";
import { notFound } from "next/navigation";
import CategoryList from "./_components/CategoryList";

interface MenuData {
  provider: Provider;
  categories: Category[];
}

interface MenuCategoriesProps {
  params: {
    prName: string;
  };
}

async function fetchMenuData(slug: string): Promise<MenuData | null> {
  const provider = (await ProviderModel.findOne(
    { slug },
    "_id name nameEn logo"
  ).lean()) as unknown as Provider | null;

  if (!provider) return null;

  const categories = (await CategoryModel.find({
    provider: provider._id,
  }).lean()) as unknown as Category[];

  return { provider, categories };
}

export default async function MenuCategories({ params }: MenuCategoriesProps) {
  const { prName } = await params;
  const menuData = await fetchMenuData(prName);
  console.log(menuData);
  if (!menuData) return notFound();

  const { provider, categories } = menuData;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-8 bg-rose-gold-muted dark:bg-card border-b border-border shadow relative overflow-hidden">
        <div className="-left-35 absolute w-[200px] h-[200px] bg-rose-gold-dark/20 rotate-60"></div>
        <div className="-left-35 bottom-18 absolute w-[200px] h-[200px] bg-rose-gold-dark/20 -rotate-60"></div>

        <div className="flex gap-5 px-4 items-center">
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-accent">
            <Image
              src={provider.logo || "/provider.webp"}
              alt={`لوگو ${provider.name}`}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>

          <div>
            <h1 className="text-xl alexandria font-bold text-rose-gold-dark mb-3">
              {provider.name}
            </h1>
            {provider.nameEn && (
              <p className="text-sm text-muted-foreground font-medium">
                {provider.nameEn}
              </p>
            )}
          </div>
        </div>
      </div>

      <CategoryList categories={categories} providerSlug={prName} />
    </div>
  );
}
