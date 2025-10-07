import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 px-4 hero-pattern">
      <div className="container">
        <div className="text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-rose-gold/10 text-rose-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>منوی دیجیتال هوشمند</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-rose-gold alexandria">منوتپ</span>
            <br />
            <br />
            <span className="text-foreground alexandria">
              منوی دیجیتال کسب‌وکار شما
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            ارائه‌دهنده منوی دیجیتال هوشمند و مدرن برای رستوران‌ها، کافه‌ها،
            آبمیوه‌فروشی‌ها و تمام کسب‌وکارهای غذایی
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="premium-button text-lg px-8 py-4 shadow-xl"
            >
              شروع رایگان
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-rose-gold text-rose-gold hover:bg-rose-gold/10 text-lg px-8 py-4"
            >
              مشاهده دمو
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold rose-gold-gradient">۵۰۰+</div>
              <div className="text-sm text-muted-foreground">کسب‌وکار فعال</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold rose-gold-gradient">۵۰K+</div>
              <div className="text-sm text-muted-foreground">منوی دیجیتال</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold rose-gold-gradient">۹۹٪</div>
              <div className="text-sm text-muted-foreground">رضایت مشتریان</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
