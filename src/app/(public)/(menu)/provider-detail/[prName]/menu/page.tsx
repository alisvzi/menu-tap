import Image from "next/image";
import CategoryList from "./_components/CategoryList";

export default function MenuCategories() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-8 bg-rose-gold-muted dark:bg-card border-b border-border shadow relative overflow-hidden">
        <div className="-left-35 absolute w-[200px] h-[200px] bg-rose-gold-dark/20 rotate-60 "></div>
        <div className="-left-35 bottom-18 absolute w-[200px] h-[200px] bg-rose-gold-dark/20 -rotate-60"></div>
        <div className="flex gap-5 px-4 items-center">
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-accent">
            <Image
              src="/provider.webp"
              alt="لوگو رستوران"
              width={24}
              height={24}
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl text-shadow-2xs alexandria font-bold text-rose-gold-dark mb-3">
              رستوران مرکزی
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              تجربه‌ای فراتر از یک وعده غذایی
            </p>
          </div>
        </div>
      </div>

      <CategoryList />
    </div>
  );
}
