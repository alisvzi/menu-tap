import FadeInItem from "@/providers/FadeInItem";
import MenuItem from "./MenuItem";
import MenuSubtitle from "./MenuSubtitle";

const mockData = [
  {
    title: "غذاهای اصلی",
    items: [
      {
        nameFa: "کباب کوبیده",
        nameEn: "Koobideh Kebab",
        ingredients: ["گوشت گوسفند", "پیاز", "ادویه"],
        price: "250000",
        currency: "تومان",
      },
      {
        nameFa: "جوجه کباب زعفرانی",
        nameEn: "Joojeh Kebab",
        ingredients: ["مرغ", "زعفران", "روغن زیتون", "نمک"],
        price: "300000",
        currency: "تومان",
        isFeatured: true,
      },
      {
        nameFa: "چلو قیمه",
        nameEn: "Gheymeh Stew",
        ingredients: ["گوشت گوسفند", "لپه", "رب گوجه", "سیب‌زمینی"],
        price: "220000",
        currency: "تومان",
      },
      {
        nameFa: "چلو قورمه سبزی",
        nameEn: "Ghormeh Sabzi",
        ingredients: ["سبزی", "لوبیا قرمز", "گوشت", "لیمو عمانی"],
        price: "240000",
        currency: "تومان",
      },
      {
        nameFa: "زرشک پلو با مرغ",
        nameEn: "Zereshk Polo",
        ingredients: ["مرغ", "زرشک", "برنج", "زعفران"],
        price: "280000",
        currency: "تومان",
      },
    ],
  },
  {
    title: "نوشیدنی‌های سرد",
    items: [
      {
        nameFa: "لیموناد تازه",
        nameEn: "Fresh Lemonade",
        ingredients: ["لیمو", "شکر", "نعنا"],
        price: "80000",
        currency: "تومان",
      },
      {
        nameFa: "آب هندوانه",
        nameEn: "Watermelon Juice",
        ingredients: ["هندوانه", "یخ"],
        price: "70000",
        currency: "تومان",
      },
      {
        nameFa: "موهیتو",
        nameEn: "Mojito",
        ingredients: ["نعنا", "لیمو", "یخ", "شکر"],
        price: "90000",
        currency: "تومان",
        isFeatured: true,
      },
      {
        nameFa: "شیر موز",
        nameEn: "Banana Milkshake",
        ingredients: ["موز", "شیر", "شکر"],
        price: "95000",
        currency: "تومان",
      },
      {
        nameFa: "آب پرتقال طبیعی",
        nameEn: "Fresh Orange Juice",
        ingredients: ["پرتقال تازه"],
        price: "85000",
        currency: "تومان",
      },
    ],
  },
  {
    title: "نوشیدنی‌های گرم",
    items: [
      {
        nameFa: "قهوه ترک",
        nameEn: "Turkish Coffee",
        ingredients: ["پودر قهوه ترک", "آب"],
        price: "70000",
        currency: "تومان",
      },
      {
        nameFa: "اسپرسو",
        nameEn: "Espresso",
        ingredients: ["دانه قهوه", "آب"],
        price: "75000",
        currency: "تومان",
      },
      {
        nameFa: "کاپوچینو",
        nameEn: "Cappuccino",
        ingredients: ["اسپرسو", "شیر", "فوم شیر"],
        price: "90000",
        currency: "تومان",
      },
      {
        nameFa: "هات چاکلت",
        nameEn: "Hot Chocolate",
        ingredients: ["پودر کاکائو", "شیر", "شکر"],
        price: "95000",
        currency: "تومان",
        isFeatured: true,
      },
      {
        nameFa: "چای ایرانی",
        nameEn: "Iranian Tea",
        ingredients: ["چای خشک", "آب جوش"],
        price: "50000",
        currency: "تومان",
      },
    ],
  },
];

const CategoryContent = ({ category }) => {
  return (
    <div key={category} className="pt-[170px] min-h-[100vh] px-3">
      <div className="flex flex-col gap-3 pb-10">
        {mockData.map((group, groupIndex) => (
          <div key={group.title}>
            <FadeInItem delay={groupIndex * 100}>
              <MenuSubtitle title={group.title} />
            </FadeInItem>
            <div className="flex flex-col gap-3 mt-3">
              {group.items.map((item, itemIndex) => (
                <FadeInItem
                  key={item.nameEn}
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
