import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "رستوران سرآشپز",
    role: "رستوران ایرانی",
    content:
      "منوتپ مدیریت منوی رستوران ما را متحول کرده است. طراحی زیبا و کاربری آسان.",
    rating: 5,
  },
  {
    name: "کافه آرامش",
    role: "کافه تخصصی",
    content: "سیستم منوی دیجیتال منوتپ واقعاً عالیه. به‌روزرسانی در چند ثانیه.",
    rating: 5,
  },
  {
    name: "آبمیوه‌فروشی طبیعت",
    role: "آبمیوه‌فروشی",
    content:
      "پشتیبانی سریع و سیستم کاربری آسان باعث رشد چشمگیر کسب‌وکارمون شد.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="container ">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-4xl font-bold mb-4 alexandria">
            نظرات مشتریان
          </h2>
          <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
            کسب‌وکارهای مختلف از منوتپ راضی هستند
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="compact-card glass-morphism border-border"
            >
              <CardContent className="p-5 h-full flex flex-col justify-between">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-rose-gold fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {testimonial.content}
                </p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
