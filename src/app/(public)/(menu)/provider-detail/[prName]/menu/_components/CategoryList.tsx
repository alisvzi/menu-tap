import { ItemGroup } from "@/components/ui/item";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    id: 1,
    slug: "category1",
    nameFa: "دسته بندی اول",
    nameEn: "Category One",
    image: "/provider.webp",
  },
  {
    id: 2,
    slug: "category2",
    nameFa: "دسته بندی دوم",
    nameEn: "Category Two",
    image: "/provider.webp",
  },
  {
    id: 3,
    slug: "category3",
    nameFa: "دسته بندی سوم",
    nameEn: "Category Three",
    image: "/provider.webp",
  },
  {
    id: 4,
    slug: "category4",
    nameFa: "دسته بندی چهارم",
    nameEn: "Category Four",
    image: "/provider.webp",
  },
  {
    id: 5,
    slug: "category1",
    nameFa: "دسته بندی اول",
    nameEn: "Category 5",
    image: "/provider.webp",
  },
  {
    id: 6,
    slug: "category2",
    nameFa: "دسته بندی دوم",
    nameEn: "Category 6",
    image: "/provider.webp",
  },
  {
    id: 7,
    slug: "category3",
    nameFa: "دسته بندی سوم",
    nameEn: "Category 7",
    image: "/provider.webp",
  },
  {
    id: 77,
    slug: "category4",
    nameFa: "دسته بندی چهارم",
    nameEn: "Category 8",
    image: "/provider.webp",
  },
];

const CategoryList = () => {
  return (
    <div className="px-4 pb-8">
      <h2 className="text-xl font-semibold my-6">دسته‌بندی‌های منو</h2>

      <ItemGroup className="gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </ItemGroup>
    </div>
  );
};

export default CategoryList;
