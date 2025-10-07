import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-rose-gold/10 to-rose-gold/5">
      <div className="container text-center">
        <h2 className="text-4xl font-bold mb-4 alexandria">
          آماده شروع هستید؟
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          همین امروز کسب‌وکار خود را با منوی دیجیتال هوشمند منوتپ متحول کنید
        </p>
        <Button className="premium-button text-lg px-8 py-4 shadow-xl">
          شروع رایگان
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
