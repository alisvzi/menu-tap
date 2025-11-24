import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coffee, GlassWater, Store, Utensils } from "lucide-react";

const providerTypes = [
  {
    icon: <Coffee className="w-8 h-8 text-rose-gold" />,
    name: "کافه‌ها",
    description: "منوی دیجیتال تخصصی برای کافه‌ها",
    type: "cafe",
  },
  {
    icon: <Utensils className="w-8 h-8 text-rose-gold" />,
    name: "رستوران‌ها",
    description: "سیستم کامل منوی دیجیتال رستوران",
    type: "restaurant",
  },
  {
    icon: <GlassWater className="w-8 h-8 text-rose-gold" />,
    name: "آبمیوه‌فروشی‌ها",
    description: "منوی دیجیتال برای آبمیوه‌فروشی‌ها",
    type: "other",
  },
  {
    icon: <Store className="w-8 h-8 text-rose-gold" />,
    name: "فست‌فودها",
    description: "منوی دیجیتال سریع برای فست‌فودها",
    type: "fast-food",
  },
];

const BusinessesSection = () => {
  return (
    <section id="businesses" className="py-16 px-4 bg-muted/20">
      <div className="container space-y-16">
        {/* Business Types */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-4xl font-bold mb-4 alexandria">
              مناسب برای تمام کسب‌وکارها
            </h2>
            <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
              منوتپ برای انواع کسب‌وکارهای غذایی طراحی شده است
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {providerTypes.map((business, index) => (
              <Card
                key={index}
                className="compact-card border-border hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="text-center pb-3">
                  <div className="mb-3 flex justify-center">
                    {business.icon}
                  </div>
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {business.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessesSection;
