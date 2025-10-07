import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Smartphone, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <Smartphone className="w-6 h-6 text-rose-gold" />,
    title: "منوی موبایل پسند",
    description: "طراحی کاملاً ریسپانسیو با بهترین تجربه کاربری",
  },
  {
    icon: <Zap className="w-6 h-6 text-rose-gold" />,
    title: "به‌روزرسانی لحظه‌ای",
    description: "تغییرات منو به صورت آنی و بدون تأخیر",
  },
  {
    icon: <Users className="w-6 h-6 text-rose-gold" />,
    title: "مدیریت آسان",
    description: "پنل مدیریتی قدرتمند و کاربرپسند",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-rose-gold" />,
    title: "گزارش‌های تحلیلی",
    description: "آمار دقیق از عملکرد و فروش کسب‌وکار",
  },
];
const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 px-4">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 alexandria">
            امکانات ویژه منوتپ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            با امکانات پیشرفته منوتپ، کسب‌وکار خود را به سطح جدیدی از مدیریت و
            خدمات برسانید
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="compact-card border-border">
              <CardHeader className="text-center pb-3">
                <div className="mb-3 flex justify-center">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
