import { CarouselItem } from "@/components/ui/carousel";

const CategorySelectCart = ({ category, handleSelect, isActive }) => {
  return (
    <CarouselItem key={category.titleEn} className="basis-1/2 min-w-[80px]">
      <button
        onClick={() => handleSelect(category.titleEn)}
        className={`w-full h-[60px] flex flex-col items-center justify-center rounded-xl border transition-all duration-300 ${
          isActive
            ? "text-accent-foreground border-primary bg-rose-gold-muted/40 dark:bg-accent shadow-sm"
            : "text-muted-foreground border-border bg-rose-gold-muted/30 dark:bg-card scale-[0.9] opacity-80 hover:opacity-100"
        }`}
      >
        <span className="text-sm font-medium truncate px-2">
          {category.title}
        </span>
        <span className="text-sm font-medium truncate px-2">
          {category.titleEn}
        </span>
      </button>
    </CarouselItem>
  );
};

export default CategorySelectCart;
