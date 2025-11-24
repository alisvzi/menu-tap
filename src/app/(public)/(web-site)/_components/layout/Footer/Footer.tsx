import {
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import LogoBox from "./LogoBox";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container ">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-x-2 mb-4">
              <LogoBox />
              <h3 className="text-lg font-bold rose-gold-gradient alexandria">
                منوتپ
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              ارائه‌دهنده منوی دیجیتال هوشمند برای کسب‌وکارهای غذایی
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-rose-gold transition-colors"
                >
                  امکانات
                </a>
              </li>
              <li>
                <a
                  href="#businesses"
                  className="hover:text-rose-gold transition-colors"
                >
                  کسب‌وکارها
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-rose-gold transition-colors"
                >
                  تعرفه‌ها
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-rose-gold transition-colors"
                >
                  نظرات مشتریان
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 ml-2" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 ml-2" />
                <span>info@tapmenu.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 ml-2" />
                <span>تهران، ایران</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">شبکه‌های اجتماعی</h4>
            <div className="flex gap-x-3 space-x-reverse">
              <a
                href="#"
                className="w-10 h-10 bg-rose-gold rounded-lg flex items-center justify-center hover:bg-rose-gold-light transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-rose-gold rounded-lg flex items-center justify-center hover:bg-rose-gold-light transition-colors"
                aria-label="Message"
              >
                <MessageCircle className="w-5 h-5 text-background" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-rose-gold rounded-lg flex items-center justify-center hover:bg-rose-gold-light transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5 text-background" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>© ۱۴۰۳ منوتپ. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
