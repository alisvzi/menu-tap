const HowItWorkSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container ">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-4xl font-bold mb-4 alexandria">
            چگونه کار می‌کند؟
          </h2>
          <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
            در سه مرحله ساده منوی دیجیتال خود را راه‌اندازی کنید
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-rose-gold-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-background">۱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">ثبت‌نام و تنظیمات</h3>
            <p className="text-muted-foreground text-sm">
              ثبت‌نام سریع و تنظیمات اولیه منوی دیجیتال خود را در چند دقیقه
              انجام دهید
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-rose-gold-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-background">۲</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">افزودن محصولات</h3>
            <p className="text-muted-foreground text-sm">
              محصولات و دسته‌بندی‌های خود را به سادگی به منوی دیجیتال اضافه کنید
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-rose-gold-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-background">۳</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              اشتراک‌گذاری و استفاده
            </h3>
            <p className="text-muted-foreground text-sm">
              منوی دیجیتال خود را با مشتریان به اشتراک بگذارید و از آن استفاده
              کنید
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorkSection;
