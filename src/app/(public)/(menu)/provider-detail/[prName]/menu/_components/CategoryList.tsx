import { ItemGroup } from "@/components/ui/item";
import FadeInItem from "@/providers/FadeInItem";
import { Category } from "@/types/category";
import CategoryCard from "./CategoryCard";

interface CategoryListProps {
  categories: Category[];
  providerSlug: string;
}

export default function CategoryList({
  categories,
  providerSlug,
}: CategoryListProps) {
  if (!categories?.length) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">هیچ دسته‌بندی موجود نیست</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold my-6">دسته‌بندی‌های منو</h2>
      <ItemGroup className="gap-3">
        {categories.map((category, i) => (
          <FadeInItem key={category._id} delay={i * 100}>
            <CategoryCard
              category={{
                id: category._id,
                slug: category.slug,
                nameFa: category.name,
                nameEn: category.nameEn || "",
                image: category.image || "/placeholder.svg",
              }}
              providerSlug={providerSlug}
            />
          </FadeInItem>
        ))}
      </ItemGroup>
    </>
  );
}
