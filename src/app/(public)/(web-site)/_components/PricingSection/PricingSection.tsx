import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const pricingPlans = [
  {
    name: "پایه",
    price: "۱۵۰",
    period: "هزار تومان / ماه",
    features: [
      "منوی دیجیتال نامحدود",
      "پشتیبانی ایمیلی",
      "به‌روزرسانی ماهانه",
      "۱ کاربر مدیر",
    ],
    popular: false,
  },
  {
    name: "حرفه‌ای",
    price: "۲۹۰",
    period: "هزار تومان / ماه",
    features: [
      "منوی دیجیتال نامحدود",
      "پشتیبانی تلفنی و ایمیلی",
      "به‌روزرسانی هفتگی",
      "۳ کاربر مدیر",
      "گزارش‌های تحلیلی",
      "دسته‌بندی‌های نامحدود",
    ],
    popular: true,
  },
  {
    name: "پیشرفته",
    price: "۴۹۰",
    period: "هزار تومان / ماه",
    features: [
      "منوی دیجیتال نامحدود",
      "پشتیبانی ۲۴/۷",
      "به‌روزرسانی روزانه",
      "کاربران مدیر نامحدود",
      "گزارش‌های پیشرفته",
      "API دسترسی",
      "دامنه شخصی",
      "پشتیبانی VIP",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 px-4 bg-muted/20">
      <div className="container ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 alexandria">تعرفه‌ها</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            انتخاب بهترین پلن برای کسب‌وکار شما
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`justify-between compact-card border-border relative ${
                plan.popular ? "ring-2 ring-rose-gold scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-rose-gold text-background">
                    محبوب‌ترین
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-rose-gold ml-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Button
                className={`w-full text-sm ${
                  plan.popular
                    ? "premium-button"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                انتخاب پلن
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
