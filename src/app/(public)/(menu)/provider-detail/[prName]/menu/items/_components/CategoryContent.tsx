import MenuItem from "./MenuItem";
import MenuSubtitle from "./MenuSubtitle";

const CategoryContent = ({ category }) => {
  return (
    <div className="pt-[170px] min-h-[100vh] px-3">
      {category}

      <div className="flex flex-col gap-3">
        <MenuItem
          nameFa="کباب کوبیده"
          nameEn="Koobideh Kebab"
          ingredients={["گوشت گوسفند", "پیاز", "ادویه"]}
          price={"250000"}
          currency="تومان"
        />

        <MenuSubtitle title="نوشیدنی‌های سرد" />

        <MenuItem
          nameFa="کباب کوبیده"
          nameEn="Koobideh Kebab"
          ingredients={["گوشت گوسفند", "پیاز", "ادویه"]}
          price={"250000"}
          currency="تومان"
        />
        <MenuItem
          nameFa="کباب کوبیده"
          nameEn="Koobideh Kebab"
          ingredients={["گوشت گوسفند", "پیاز", "ادویه"]}
          price={"250000"}
          currency="تومان"
        />
        <MenuItem
          nameFa="کباب کوبیده"
          nameEn="Koobideh Kebab"
          ingredients={["گوشت گوسفند", "پیاز", "ادویه"]}
          price={"250000"}
          currency="تومان"
          isFeatured
        />
        <MenuSubtitle title="نوشیدنی‌های گرم" highlight />
        <MenuItem
          nameFa="کباب کوبیده"
          nameEn="Koobideh Kebab"
          ingredients={["گوشت گوسفند", "پیاز", "ادویه"]}
          price={"250000"}
          currency="تومان"
        />
      </div>

      {/* addToCart(product) */}
    </div>
  );
};

export default CategoryContent;
