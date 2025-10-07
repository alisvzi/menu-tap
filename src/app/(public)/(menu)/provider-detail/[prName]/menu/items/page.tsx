import SetPortal from "@/utility/set-portal";
import CategoryContent from "./_components/CategoryContent";
import CategorySelectSlider from "./_components/CategorySelectSlider";
import ScrollReset from "./_components/ScrollReset";

export default async function Category({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // Server-side data fetching
  const categories = [
    { title: "1 تست", titleEn: "Category One" },
    { title: "2 تست", titleEn: "Category Two" },
    { title: "3 تست", titleEn: "Category Three" },
    { title: "4 تست", titleEn: "Category Four" },
    { title: "5 تست", titleEn: "Category 5" },
    { title: "6 تست", titleEn: "Category 6" },
    { title: "7 تست", titleEn: "Category 7" },
    { title: "8 تست", titleEn: "Category 8" },
  ];
  const initialCategory = searchParams.category || categories[0].titleEn;

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
      <CategoryContent category={initialCategory} />
    </div>
  );
}
